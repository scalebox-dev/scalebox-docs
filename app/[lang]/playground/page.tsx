import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ExternalLink, FlaskConical, Sparkles } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isJapanese = lang === 'ja';
  const showcases = [
    {
      name: isJapanese ? 'Node.js 24 + nvm テンプレートを作成' : 'Create Node.js 24 + nvm Template',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/05-create-nodejs-template',
      description:
        isJapanese ? 'nvm と検証済みランタイムを備えた、再利用可能な Node.js 24 ベーステンプレートを構築します。' : 'Build a reusable Node.js 24 base template with nvm and verified runtime.',
      tag: isJapanese ? 'テンプレート' : 'Template',
    },
    {
      name: isJapanese ? '直接アップロードで Vite React をデプロイ' : 'Deploy Vite React by Direct Upload',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/06-deploy-vite-react',
      description:
        isJapanese ? '`/tmp/app` にアップロードし、依存関係をインストールしてポート 3000 で Vite を実行し、サービスを検証します。' : 'Upload to `/tmp/app`, install dependencies, run Vite on port 3000, and verify service.',
      tag: isJapanese ? 'デプロイ' : 'Deploy',
    },
    {
      name: isJapanese ? 'S3 署名付き URL でデプロイ' : 'Deploy via S3 Presigned URL',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/07-deploy-oss-vite-react',
      description:
        isJapanese ? 'パッケージ化して S3 互換ストレージにアップロードし、署名付き URL のフローでデプロイします。' : 'Package, upload to S3-compatible storage, and deploy through a presigned URL flow.',
      tag: 'OSS',
    },
    {
      name: isJapanese ? 'オブジェクトストレージのマウントでデプロイ' : 'Deploy via Object Storage Mount',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/08-mount-oss-vite-react',
      description:
        isJapanese ? 'オブジェクトストレージを `/mnt/oss` にマウントし、プロジェクトをローカルにコピーしてからインストール・実行します。' : 'Mount object storage to `/mnt/oss`, copy project locally, then install and run.',
      tag: isJapanese ? 'マウント' : 'Mount',
    },
    {
      name: isJapanese ? 'サンドボックスドメインの Host ヘッダー修正' : 'Host Header Fix for Sandbox Domains',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/06-deploy-vite-react',
      description:
        isJapanese ? 'Invalid Host Header を回避するため、`allowedHosts` に `.scalebox.dev` を設定します。' : 'Set `.scalebox.dev` in `allowedHosts` to avoid Invalid Host Header.',
      tag: isJapanese ? 'ネットワーク' : 'Network',
    },
    {
      name: isJapanese ? 'OSS 転送とマウントを選択' : 'Choose OSS Transfer vs Mount',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/08-mount-oss-vite-react',
      description:
        isJapanese ? 'ワークロードのサイズ、実行時のデータアクセス、デプロイ頻度に応じて転送方式を選択します。' : 'Pick transfer mode by workload size, runtime data access, and deployment frequency.',
      tag: isJapanese ? '戦略' : 'Strategy',
    },
  ];

  const cookbookLinks = [
    {
      name: isJapanese ? 'Node.js テンプレートを作成' : 'Create Node.js Template',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/05-create-nodejs-template',
      description:
        isJapanese ? 'サンドボックスで Node.js 24 + nvm をセットアップし、後続のワークロード向けに再利用可能なテンプレートを公開します。' : 'Bootstrap Node.js 24 + nvm in sandbox and publish a reusable template for downstream workloads.',
    },
    {
      name: isJapanese ? 'Vite React をデプロイ' : 'Deploy Vite React',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/06-deploy-vite-react',
      description:
        isJapanese ? 'サンドボックス環境で直接アップロードと nohup プロセス管理を使用し、フロントエンドコードをデプロイします。' : 'Deploy frontend code with direct upload and nohup process management in a sandbox environment.',
    },
    {
      name: isJapanese ? 'S3/OSS でデプロイ' : 'Deploy with S3/OSS',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/07-deploy-oss-vite-react',
      description:
        isJapanese ? 'S3 互換ストレージと署名付きリンクを使用し、安全で回復性の高いパッケージ転送を行います。' : 'Use S3-compatible storage and presigned links for secure and resilient package transfer.',
    },
    {
      name: isJapanese ? 'OSS をマウントしてデプロイ' : 'Mount OSS and Deploy',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/08-mount-oss-vite-react',
      description:
        isJapanese ? 'オブジェクトストレージをサンドボックスにマウントし、ファイルをローカルにコピーして、アプリケーションサービスをインストール・実行します。' : 'Mount object storage into sandbox, copy files locally, then install and run application services.',
    },
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="z-10 mx-auto w-full max-w-7xl px-4 py-14">
        <section className="relative overflow-hidden rounded-2xl border border-fd-border bg-linear-to-br from-fd-card to-fd-background p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background/80 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
                <FlaskConical className="size-3.5" />
                {isJapanese ? 'プレイグラウンド' : 'Playground'}
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {isJapanese ? 'ScaleBox レシピを構築、テスト、共有する。' : 'Build, test, and share ScaleBox recipes.'}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-fd-muted-foreground">
                  {isJapanese
                    ? 'ScaleBox Cookbook の実践シナリオです。テンプレート作成、直接アップロード、S3 署名付き転送、オブジェクトストレージのマウントによるデプロイを紹介します。'
                    : 'Real scenarios from the ScaleBox Cookbook: template creation, direct upload deployment, S3 presigned transfer, and object-storage mount deployment.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-85"
                >
                  {isJapanese ? 'すべてのレシピを見る' : 'Browse All Recipes'}
                  <ExternalLink className="size-3.5" />
                </Link>
                <Link
                  href="https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/07-deploy-oss-vite-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background/80 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
                >
                  {isJapanese ? 'OSS デプロイ手順' : 'OSS Deployment Path'}
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* 右侧信息块用于平衡 Hero 区的视觉重心 */}
            <div className="rounded-xl border border-fd-border bg-fd-background/70 p-5">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-fd-primary" />
                {isJapanese ? 'ScaleBox ショーケース' : 'ScaleBox Showcase'}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-fd-muted-foreground">
                <li>• {isJapanese ? 'まず再利用可能な Node.js 24 テンプレートを構築し、後続のデプロイを標準化します。' : 'Build a reusable Node.js 24 template first, then standardize downstream deployments.'}</li>
                <li>• {isJapanese ? '直接アップロード、S3 署名付き転送、マウント方式のデプロイ手順を比較します。' : 'Compare direct upload, S3 presigned transfer, and mount-based deployment paths.'}</li>
                <li>• {isJapanese ? '抽象的な構成例ではなく、実行可能な Cookbook スクリプトを参考にします。' : 'Use cookbook scripts as runnable references instead of abstract architecture samples.'}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 space-y-1 px-1">
            <h2 className="text-2xl font-semibold tracking-tight">{isJapanese ? '注目のサンプル' : 'Featured Examples'}</h2>
            <p className="text-sm text-fd-muted-foreground">{isJapanese ? 'Cookbook のサンプルに対応した実践シナリオです。' : 'Real scenarios mapped from cookbook examples.'}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcases.map(item => (
              <a
                key={item.name}
                href={item.url}
                target={item.url.startsWith('http') ? '_blank' : undefined}
                rel={item.url.startsWith('http') ? 'noreferrer noopener' : undefined}
                className="group flex min-h-48 flex-col rounded-xl border border-fd-border bg-fd-card/70 p-5 transition-all hover:-translate-y-0.5 hover:bg-fd-accent hover:shadow-sm"
              >
                <p className="font-mono text-xs text-fd-muted-foreground">
                  {item.url.startsWith('http') ? new URL(item.url).hostname : 'scalebox.dev'}
                </p>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <p className="text-lg font-semibold leading-snug">{item.name}</p>
                  <span className="rounded-md border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 space-y-1 px-1">
            <h2 className="text-2xl font-semibold tracking-tight">{isJapanese ? 'おすすめ Cookbook' : 'Cookbook Picks'}</h2>
            <p className="text-sm text-fd-muted-foreground">
              {isJapanese ? '具体的な Cookbook サンプルとデプロイワークフローへの直接リンクです。' : 'Direct links to concrete cookbook examples and deployment workflows.'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cookbookLinks.map(item => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-h-40 flex-col rounded-xl border border-fd-border bg-fd-card/70 p-5 transition-all hover:-translate-y-0.5 hover:bg-fd-accent hover:shadow-sm"
              >
                <p className="font-mono text-xs text-fd-muted-foreground">
                  {new URL(item.url).hostname}
                </p>
                <p className="mt-4 text-lg font-semibold">{item.name}</p>
                <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">{item.description}</p>
              </a>
            ))}
          </div>
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
    title: lang === 'ja' ? 'プレイグラウンド' : 'Playground',
    description: lang === 'ja' ? 'ScaleBox の実践サンプルとレシピ' : 'ScaleBox playground',
  };
}
