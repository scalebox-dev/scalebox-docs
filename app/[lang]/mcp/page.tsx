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
  const npxCommand = 'npx -y @scalebox/mcp --api-key YOUR_API_KEY';
  const docs = [
    {
      title: 'Node npx Setup',
      description:
        'Use `npx -y @scalebox/mcp --api-key ...` for stdio mode. The npm package scope is `@scalebox/mcp` (not `@scalebox-dev`).',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#quick-start',
    },
    {
      title: 'Python FastMCP Modes',
      description:
        'Run Python via FastMCP in stdio, HTTP, or SSE mode. The default HTTP endpoint is `http://127.0.0.1:8000/mcp`.',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#3-python--http-or-sse',
    },
    {
      title: 'Tool Lifecycle',
      description:
        'Follow `create_sandbox` -> use `context_id` for execute/files/commands -> `destroy_context`, covering code execution, filesystem operations, package install, and shell commands.',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#tools',
    },
    {
      title: 'Auth & Runtime Ops',
      description:
        'Auth supports CLI flags, env vars (`SBX_API_KEY`/`SCALEBOX_API_KEY`), and HTTP headers (`X-API-Key` / Bearer). Docker and Makefile targets are included.',
      href: 'https://github.com/scalebox-dev/scalebox-mcp#authentication',
    },
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">ScaleBox MCP Server</h1>
          <p className="max-w-4xl text-base text-fd-muted-foreground">
            A Model Context Protocol server for running code in ScaleBox sandboxes.
            It provides sandbox lifecycle management, code execution, filesystem APIs,
            package installation, and shell command execution.
          </p>
          <CopyCommandBlock command={npxCommand} />
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
                Open {item.title}
                <ExternalLink className="size-3.5" />
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-fd-border bg-fd-card p-5">
          <h2 className="text-lg font-semibold">Repository</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            View source code, package release workflow (`packages/js` + semantic-release),
            and runtime setup details for Node and Python modes.
          </p>
          <Link
            href="https://github.com/scalebox-dev/scalebox-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:opacity-80"
          >
            Open scalebox-mcp
            <ExternalLink className="size-3.5" />
          </Link>
        </section>
      </main>
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'en' }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MCP',
    description: 'ScaleBox MCP resources',
  };
}
