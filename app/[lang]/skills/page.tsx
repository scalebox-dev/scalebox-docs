import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ExternalLink } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const sections = [
    {
      title: 'API',
      description:
        'Public REST API reference for Sandboxes, Templates, Import Jobs, Projects, Users, API Keys, Notifications, and Webhooks.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/api',
    },
    {
      title: 'CLI',
      description:
        'ScaleBox CLI reference: auth, sandbox lifecycle, template workflows, and update commands.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/cli',
    },
    {
      title: 'SDK JS',
      description:
        'JavaScript/TypeScript SDK usage with Session API, Sandbox APIs, file operations, commands, and PTY.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/sdk-js',
    },
    {
      title: 'SDK Python',
      description:
        'Python SDK usage for sync/async sandbox workflows and code interpreter scenarios.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/sdk-python',
    },
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">ScaleBox Skills</h1>
          <p className="max-w-4xl text-base text-fd-muted-foreground">
            Skills for AI agents and developers working with the ScaleBox cloud sandbox
            platform.
          </p>
          <div className="inline-flex items-center gap-2 rounded-md border border-fd-border bg-fd-card px-3 py-2">
            {/* 参考仓库 README 的快速接入命令 */}
            <code className="text-sm">npx skills add https://github.com/scalebox-dev/scalebox-skills</code>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {sections.map(section => (
            <article
              key={section.title}
              className="rounded-lg border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">{section.description}</p>
              <Link
                href={section.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:opacity-80"
              >
                Open {section.title}
                <ExternalLink className="size-3.5" />
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-fd-border bg-fd-card p-5">
          <h2 className="text-lg font-semibold">Repository</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            View the full project structure, updates, and README in the GitHub repository.
          </p>
          <Link
            href="https://github.com/scalebox-dev/scalebox-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:opacity-80"
          >
            Open scalebox-skills
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
    title: 'Skills',
    description: 'ScaleBox skills overview',
  };
}
