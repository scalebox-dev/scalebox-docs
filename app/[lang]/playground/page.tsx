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
  const showcases = [
    {
      name: 'Create Node.js 24 + nvm Template',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/05-create-nodejs-template',
      description:
        'Build a reusable Node.js 24 base template with nvm and verified runtime.',
      tag: 'Template',
    },
    {
      name: 'Deploy Vite React by Direct Upload',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/06-deploy-vite-react',
      description:
        'Upload to `/tmp/app`, install dependencies, run Vite on port 3000, and verify service.',
      tag: 'Deploy',
    },
    {
      name: 'Deploy via S3 Presigned URL',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/07-deploy-oss-vite-react',
      description:
        'Package, upload to S3-compatible storage, and deploy through a presigned URL flow.',
      tag: 'OSS',
    },
    {
      name: 'Deploy via Object Storage Mount',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/08-mount-oss-vite-react',
      description:
        'Mount object storage to `/mnt/oss`, copy project locally, then install and run.',
      tag: 'Mount',
    },
    {
      name: 'Host Header Fix for Sandbox Domains',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/06-deploy-vite-react',
      description:
        'Set `.scalebox.dev` in `allowedHosts` to avoid Invalid Host Header.',
      tag: 'Network',
    },
    {
      name: 'Choose OSS Transfer vs Mount',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/08-mount-oss-vite-react',
      description:
        'Pick transfer mode by workload size, runtime data access, and deployment frequency.',
      tag: 'Strategy',
    },
  ];

  const cookbookLinks = [
    {
      name: 'Create Node.js Template',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/05-create-nodejs-template',
      description:
        'Bootstrap Node.js 24 + nvm in sandbox and publish a reusable template for downstream workloads.',
    },
    {
      name: 'Deploy Vite React',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/06-deploy-vite-react',
      description:
        'Deploy frontend code with direct upload and nohup process management in a sandbox environment.',
    },
    {
      name: 'Deploy with S3/OSS',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/07-deploy-oss-vite-react',
      description:
        'Use S3-compatible storage and presigned links for secure and resilient package transfer.',
    },
    {
      name: 'Mount OSS and Deploy',
      url: 'https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/08-mount-oss-vite-react',
      description:
        'Mount object storage into sandbox, copy files locally, then install and run application services.',
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
                Playground
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Build, test, and share ScaleBox recipes.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-fd-muted-foreground">
                  Real scenarios from the ScaleBox Cookbook: template creation, direct upload
                  deployment, S3 presigned transfer, and object-storage mount deployment.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-85"
                >
                  Browse All Recipes
                  <ExternalLink className="size-3.5" />
                </Link>
                <Link
                  href="https://github.com/scalebox-dev/scalebox-cookbook/tree/main/examples/07-deploy-oss-vite-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background/80 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
                >
                  OSS Deployment Path
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* 右侧信息块用于平衡 Hero 区的视觉重心 */}
            <div className="rounded-xl border border-fd-border bg-fd-background/70 p-5">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-fd-primary" />
                ScaleBox Showcase
              </p>
              <ul className="mt-4 space-y-3 text-sm text-fd-muted-foreground">
                <li>• Build a reusable Node.js 24 template first, then standardize downstream deployments.</li>
                <li>• Compare direct upload, S3 presigned transfer, and mount-based deployment paths.</li>
                <li>• Use cookbook scripts as runnable references instead of abstract architecture samples.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 space-y-1 px-1">
            <h2 className="text-2xl font-semibold tracking-tight">Featured Examples</h2>
            <p className="text-sm text-fd-muted-foreground">Real scenarios mapped from cookbook examples.</p>
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
            <h2 className="text-2xl font-semibold tracking-tight">Cookbook Picks</h2>
            <p className="text-sm text-fd-muted-foreground">
              Direct links to concrete cookbook examples and deployment workflows.
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
  return [{ lang: 'en' }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Playground',
    description: 'ScaleBox playground',
  };
}
