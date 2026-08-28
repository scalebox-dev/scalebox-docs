#!/usr/bin/env python3
"""Generate the Japanese MDX tree from English while preserving executable syntax."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "en"
DESTINATION = ROOT / "content" / "ja"
CACHE_PATH = ROOT / "scripts" / ".japanese-translation-cache.v5.json"

GLOSSARY = {
    "ScaleBox": "ScaleBox",
    "sandbox-agent": "sandbox-agent",
    "Sandboxes": "サンドボックス",
    "Sandbox": "サンドボックス",
    "sandboxes": "サンドボックス",
    "sandbox": "サンドボックス",
    "Templates": "テンプレート",
    "Template": "テンプレート",
    "templates": "テンプレート",
    "template": "テンプレート",
    "Projects": "プロジェクト",
    "Project": "プロジェクト",
    "Kubernetes": "Kubernetes",
    "Docker": "Docker",
    "Harbor": "Harbor",
    "Skopeo": "Skopeo",
    "WebRTC": "WebRTC",
    "GitHub": "GitHub",
    "Node.js": "Node.js",
    "JavaScript": "JavaScript",
    "TypeScript": "TypeScript",
    "Python": "Python",
    "Golang": "Go",
    "FastMCP": "FastMCP",
    "ScaleBox CLI": "ScaleBox CLI",
    "CLI": "CLI",
    "REST API": "REST API",
    "API": "API",
    "SDK": "SDK",
    "MCP": "MCP",
    "HTTP": "HTTP",
    "HTTPS": "HTTPS",
    "JSON": "JSON",
    "YAML": "YAML",
    "Dockerfile": "Dockerfile",
    "Webhook": "Webhook",
    "Webhooks": "Webhook",
}
GLOSSARY_RE = re.compile(
    r"(?<![A-Za-z0-9_-])(" + "|".join(map(re.escape, sorted(GLOSSARY, key=len, reverse=True))) + r")(?![A-Za-z0-9_-])"
)
PROTECTED_RE = re.compile(
    r"`[^`\n]+`|https?://[^\s)>\]}]+|\$\{[^}]+\}|\{[A-Z_][A-Z0-9_]*\}|"
    r"--[a-zA-Z0-9][a-zA-Z0-9_-]*|(?<![A-Za-z0-9])/[A-Za-z0-9_.$~{}:/?&=+%@,-]+|"
    r"<[A-Za-z/][^>]*>|\b(?!ZXQPROTECT)[A-Z][A-Z0-9_]{2,}\b"
)
MARKDOWN_LINK_RE = re.compile(r"\[([^\]\n]+)\]\(([^)\n]+)\)")
SEPARATOR = "ZXQSEG{index:04d}QXZ"


def protect(value: str) -> tuple[str, list[str]]:
    protected: list[str] = []

    def token(original: str) -> str:
        protected.append(original)
        return f"ZXQPROTECT{len(protected) - 1:04d}QXZ"

    value = PROTECTED_RE.sub(lambda match: token(match.group(0)), value)
    value = GLOSSARY_RE.sub(lambda match: token(GLOSSARY[match.group(0)]), value)
    return value, protected


def restore(value: str, protected: list[str]) -> str:
    for index, original in enumerate(protected):
        value = value.replace(f"ZXQPROTECT{index:04d}QXZ", original)
    return value


def translate_batch(values: list[str]) -> list[str]:
    prepared: list[str] = []
    protected_values: list[list[str]] = []
    separators: list[str] = []
    for index, value in enumerate(values):
        safe, protected = protect(value)
        prepared.append(safe)
        protected_values.append(protected)
        if index < len(values) - 1:
            separators.append(SEPARATOR.format(index=index))

    parts: list[str] = []
    for index, value in enumerate(prepared):
        parts.append(value)
        if index < len(separators):
            parts.append(separators[index])
    query = urllib.parse.urlencode(
        {"client": "dict-chrome-ex", "sl": "en", "tl": "ja", "dt": "t", "q": "\n".join(parts)}
    )
    request = urllib.request.Request(
        f"https://translate.google.com/translate_a/single?{query}",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read())
    translated = "".join(fragment[0] for fragment in payload[0])

    output: list[str] = []
    remaining = translated
    for separator in separators:
        if separator not in remaining:
            raise RuntimeError(f"Translation separator was not preserved: {separator}")
        before, remaining = remaining.split(separator, 1)
        output.append(before.strip())
    output.append(remaining.strip())
    if len(output) != len(values):
        raise RuntimeError(f"Expected {len(values)} translations, received {len(output)}")
    return [restore(value, protected_values[index]) for index, value in enumerate(output)]


def translate_all(values: list[str]) -> list[str]:
    cache: dict[str, str] = (
        json.loads(CACHE_PATH.read_text(encoding="utf-8")) if CACHE_PATH.exists() else {}
    )
    missing = list(dict.fromkeys(value for value in values if value not in cache))
    cursor = 0
    while cursor < len(missing):
        batch: list[str] = []
        length = 0
        while cursor + len(batch) < len(missing) and len(batch) < 18:
            candidate = missing[cursor + len(batch)]
            if batch and length + len(candidate) > 2600:
                break
            batch.append(candidate)
            length += len(candidate)
        for attempt in range(5):
            try:
                translated = translate_batch(batch)
                cache.update(zip(batch, translated, strict=True))
                CACHE_PATH.write_text(
                    json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
                break
            except Exception:
                if attempt == 4:
                    raise
                time.sleep(2**attempt)
        cursor += len(batch)
        print(f"Translated {cursor}/{len(missing)} missing segments", flush=True)
        time.sleep(0.4)
    return [cache[value] for value in values]


def is_translatable(value: str) -> bool:
    plain = PROTECTED_RE.sub("", value)
    return bool(re.search(r"[A-Za-z]{2,}", plain))


def collect_mdx(source: str) -> tuple[str, list[str]]:
    values: list[str] = []
    output: list[str] = []
    in_fence = False
    in_frontmatter = False
    frontmatter_seen = False

    def marker(value: str) -> str:
        index = len(values)
        values.append(value)
        return f"ZXQTRANS{index:05d}QXZ"

    def mark_markdown_text(value: str) -> str:
        """Translate prose and link labels separately, preserving link destinations."""
        output_parts: list[str] = []
        cursor = 0
        for match in MARKDOWN_LINK_RE.finditer(value):
            prose = value[cursor:match.start()]
            output_parts.append(marker(prose) if is_translatable(prose) else prose)
            label, destination = match.groups()
            translated_label = marker(label) if is_translatable(label) else label
            output_parts.append(f"[{translated_label}]({destination.replace('/en/', '/ja/')})")
            cursor = match.end()
        prose = value[cursor:]
        output_parts.append(marker(prose) if is_translatable(prose) else prose)
        return "".join(output_parts)

    for line in source.splitlines(keepends=True):
        newline = "\n" if line.endswith("\n") else ""
        body = line[:-1] if newline else line
        stripped = body.strip()

        if stripped.startswith("```"):
            in_fence = not in_fence
            output.append(line)
            continue
        if in_fence:
            output.append(line)
            continue
        if stripped == "---" and not frontmatter_seen:
            in_frontmatter = not in_frontmatter
            if not in_frontmatter:
                frontmatter_seen = True
            output.append(line)
            continue
        if in_frontmatter:
            match = re.match(r"^(\s*(?:title|description):\s*)(.*)$", body)
            if match and is_translatable(match.group(2)):
                output.append(f"{match.group(1)}{marker(match.group(2))}{newline}")
            else:
                output.append(line)
            continue
        if not stripped:
            output.append(line)
            continue

        # Translate human-facing JSX attributes without exposing tag syntax.
        replaced = body
        for attribute in ("title", "description"):
            pattern = re.compile(rf'({attribute}=")([^"]+)(")')
            replaced = pattern.sub(
                lambda match: f"{match.group(1)}{marker(match.group(2))}{match.group(3)}"
                if is_translatable(match.group(2))
                else match.group(0),
                replaced,
            )
        if "ZXQTRANS" in replaced:
            output.append(replaced.replace('/en/', '/ja/') + newline)
            continue
        if stripped.startswith("<"):
            output.append(line.replace('/en/', '/ja/'))
            continue

        prefix_match = re.match(r"^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s*)?)(.*)$", body)
        assert prefix_match
        prefix, text = prefix_match.groups()
        if is_translatable(text):
            output.append(f"{prefix}{mark_markdown_text(text)}{newline}")
        else:
            output.append(line.replace('/en/', '/ja/'))

    return "".join(output).replace('/en/', '/ja/'), values


def translate_json_value(value: Any, marker, key: str | None = None) -> Any:
    if isinstance(value, dict):
        return {item_key: translate_json_value(item, marker, item_key) for item_key, item in value.items()}
    if isinstance(value, list):
        output = []
        for item in value:
            if isinstance(item, str) and item.startswith("---") and item.endswith("---"):
                output.append({"__translate__": marker(item[3:-3]), "__section__": True})
            else:
                output.append(translate_json_value(item, marker))
        return output
    if isinstance(value, str) and key in {"title", "description"}:
        return {"__translate__": marker(value)}
    return value


def resolve_json_value(value: Any, translations: list[str]) -> Any:
    if isinstance(value, dict):
        if "__translate__" in value:
            translated = re.sub(
                r"ZXQTRANS(\d{5})QXZ",
                lambda match: translations[int(match.group(1))],
                value["__translate__"],
            )
            return f"---{translated}---" if value.get("__section__") else translated
        return {key: resolve_json_value(item, translations) for key, item in value.items()}
    if isinstance(value, list):
        return [resolve_json_value(item, translations) for item in value]
    return value


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    mdx_templates: dict[Path, str] = {}
    json_templates: dict[Path, Any] = {}
    values: list[str] = []

    for source_path in sorted(SOURCE.rglob("*")):
        if not source_path.is_file():
            continue
        relative = source_path.relative_to(SOURCE)
        destination_path = DESTINATION / relative
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        if source_path.suffix == ".mdx":
            template, file_values = collect_mdx(source_path.read_text(encoding="utf-8"))
            offset = len(values)
            template = re.sub(
                r"ZXQTRANS(\d{5})QXZ",
                lambda match: f"ZXQTRANS{int(match.group(1)) + offset:05d}QXZ",
                template,
            )
            mdx_templates[destination_path] = template
            values.extend(file_values)
        elif source_path.suffix == ".json":
            def json_marker(value: str) -> str:
                index = len(values)
                values.append(value)
                return f"ZXQTRANS{index:05d}QXZ"

            template = translate_json_value(
                json.loads(source_path.read_text(encoding="utf-8")),
                json_marker,
            )
            json_templates[destination_path] = template

    translated = translate_all(values)
    for path, template in mdx_templates.items():
        rendered = re.sub(
            r"ZXQTRANS(\d{5})QXZ",
            lambda match: translated[int(match.group(1))],
            template,
        ).replace('/en/', '/ja/')
        path.write_text(rendered, encoding="utf-8")

    for path, template in json_templates.items():
        resolved = resolve_json_value(template, translated)
        path.write_text(json.dumps(resolved, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
