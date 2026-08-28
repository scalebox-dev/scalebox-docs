import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ExternalLink } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { CopyCommandBlock } from '../_components/copy-command-block';

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isJapanese = lang === 'ja';
  const skillsAddCommand = 'npx skills add https://github.com/scalebox-dev/scalebox-skills';
  const sections = [
    {
      title: 'API',
      description:
        isJapanese
          ? 'サンドボックス、テンプレート、インポートジョブ、プロジェクト、ユーザー、API キー、通知、Webhook の公開 REST API リファレンスです。'
          : 'Public REST API reference for Sandboxes, Templates, Import Jobs, Projects, Users, API Keys, Notifications, and Webhooks.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/api',
    },
    {
      title: 'CLI',
      description:
        isJapanese
          ? '認証、サンドボックスのライフサイクル、テンプレートのワークフロー、更新コマンドを含む ScaleBox CLI リファレンスです。'
          : 'ScaleBox CLI reference: auth, sandbox lifecycle, template workflows, and update commands.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/cli',
    },
    {
      title: 'SDK JS',
      description:
        isJapanese
          ? 'Session API、Sandbox API、ファイル操作、コマンド、PTY を含む JavaScript/TypeScript SDK の使用方法です。'
          : 'JavaScript/TypeScript SDK usage with Session API, Sandbox APIs, file operations, commands, and PTY.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/sdk-js',
    },
    {
      title: 'SDK Python',
      description:
        isJapanese
          ? '同期・非同期のサンドボックスワークフローとコードインタープリターでの Python SDK の使用方法です。'
          : 'Python SDK usage for sync/async sandbox workflows and code interpreter scenarios.',
      href: 'https://github.com/scalebox-dev/scalebox-skills/tree/main/sdk-python',
    },
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
        <section className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">ScaleBox Skills</h1>
          <p className="max-w-4xl text-base text-fd-muted-foreground">
            {isJapanese
              ? 'ScaleBox クラウドサンドボックスプラットフォームを利用する AI エージェントと開発者向けのスキルです。'
              : 'Skills for AI agents and developers working with the ScaleBox cloud sandbox platform.'}
          </p>
          <CopyCommandBlock text={skillsAddCommand} />
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
                {isJapanese ? '開く' : 'Open'} {section.title}
                <ExternalLink className="size-3.5" />
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-fd-border bg-fd-card p-5">
          <h2 className="text-lg font-semibold">{isJapanese ? 'リポジトリ' : 'Repository'}</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            {isJapanese
              ? 'GitHub リポジトリでプロジェクト全体の構成、更新内容、README を確認できます。'
              : 'View the full project structure, updates, and README in the GitHub repository.'}
          </p>
          <Link
            href="https://github.com/scalebox-dev/scalebox-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:opacity-80"
          >
            {isJapanese ? 'scalebox-skills を開く' : 'Open scalebox-skills'}
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
    title: lang === 'ja' ? 'ScaleBox スキル' : 'Skills',
    description: lang === 'ja' ? 'ScaleBox スキルの概要' : 'ScaleBox skills overview',
  };
}
