import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ExternalLink } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { CopyCommandBlock } from '../_components/copy-command-block';

export default async function MCPPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isJapanese = lang === 'ja';
  // 与 scalebox-mcp README 一致：常见 MCP 客户端使用的 mcpServers 结构（stdio + npx）
  const mcpClientConfigJson = `{
  "mcpServers": {
    "scalebox": {
      "command": "npx",
      "args": ["-y", "@scalebox/mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}`;
  const docs = [
    {
      title: isJapanese ? 'Node npx のセットアップ' : 'Node npx Setup',
      description:
        isJapanese
          ? 'stdio モードでは `npx -y @scalebox/mcp --api-key ...` を使用します。npm パッケージスコープは `@scalebox/mcp` です（`@scalebox-dev` ではありません）。'
          : 'Use `npx -y @scalebox/mcp --api-key ...` for stdio mode. The npm package scope is `@scalebox/mcp` (not `@scalebox-dev`).',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#quick-start',
    },
    {
      title: isJapanese ? 'Python FastMCP モード' : 'Python FastMCP Modes',
      description:
        isJapanese
          ? 'FastMCP を使用し、stdio、HTTP、SSE モードで Python を実行します。既定の HTTP エンドポイントは `http://127.0.0.1:8000/mcp` です。'
          : 'Run Python via FastMCP in stdio, HTTP, or SSE mode. The default HTTP endpoint is `http://127.0.0.1:8000/mcp`.',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#3-python--http-or-sse',
    },
    {
      title: isJapanese ? 'ツールのライフサイクル' : 'Tool Lifecycle',
      description:
        isJapanese
          ? '`create_sandbox` → `context_id` を使用した実行・ファイル・コマンド操作 → `destroy_context` の流れで、コード実行、ファイルシステム操作、パッケージのインストール、シェルコマンドを扱います。'
          : 'Follow `create_sandbox` -> use `context_id` for execute/files/commands -> `destroy_context`, covering code execution, filesystem operations, package install, and shell commands.',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#tools',
    },
    {
      title: isJapanese ? '認証とランタイム操作' : 'Auth & Runtime Ops',
      description:
        isJapanese
          ? '認証では CLI フラグ、環境変数（`SBX_API_KEY` / `SCALEBOX_API_KEY`）、HTTP ヘッダー（`X-API-Key` / Bearer）を利用できます。Docker と Makefile のターゲットも含まれます。'
          : 'Auth supports CLI flags, env vars (`SBX_API_KEY`/`SCALEBOX_API_KEY`), and HTTP headers (`X-API-Key` / Bearer). Docker and Makefile targets are included.',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#authentication',
    },
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">ScaleBox MCP Server</h1>
          <p className="max-w-4xl text-base text-fd-muted-foreground">
            {isJapanese
              ? 'ScaleBox サンドボックスでコードを実行するための Model Context Protocol サーバーです。サンドボックスのライフサイクル管理、コード実行、ファイルシステム API、パッケージのインストール、シェルコマンド実行を提供します。'
              : 'A Model Context Protocol server for running code in ScaleBox sandboxes. It provides sandbox lifecycle management, code execution, filesystem APIs, package installation, and shell command execution.'}
          </p>
          <p className="text-sm text-fd-muted-foreground">
            {isJapanese ? '一般的な MCP クライアント設定（' : 'Typical MCP client config (stdio via '}
            stdio: <code className="text-fd-foreground">npx</code>{isJapanese ? '）：' : '):'}
          </p>
          <CopyCommandBlock text={mcpClientConfigJson} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {docs.map(item => (
            <article
              key={item.title}
              className="rounded-lg border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">{item.description}</p>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:opacity-80"
              >
                {isJapanese ? '開く' : 'Open'} {item.title}
                <ExternalLink className="size-3.5" />
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-fd-border bg-fd-card p-5">
          <h2 className="text-lg font-semibold">{isJapanese ? 'リポジトリ' : 'Repository'}</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            {isJapanese
              ? 'ソースコード、パッケージのリリースフロー（`packages/js` + semantic-release）、Node および Python モードのランタイム設定を確認できます。'
              : 'View source code, package release workflow (`packages/js` + semantic-release), and runtime setup details for Node and Python modes.'}
          </p>
          <Link
            href="https://github.com/scalebox-dev/scalebox-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:opacity-80"
          >
            {isJapanese ? 'scalebox-mcp を開く' : 'Open scalebox-mcp'}
            <ExternalLink className="size-3.5" />
          </Link>
        </section>
      </main>
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh-cn' }, { lang: 'zh-tw' }, { lang: 'ja' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'MCP',
    description: lang === 'ja' ? 'ScaleBox MCP のリソースとセットアップガイド' : 'ScaleBox MCP resources',
  };
}
