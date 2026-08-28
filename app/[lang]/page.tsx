import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import Link from 'next/link';
import { appName, gitConfig } from '@/lib/shared';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;
  const isJapanese = lang === 'ja';

  const cards = [
    {
      title: isJapanese ? 'ドキュメント' : 'Documentation',
      description: isJapanese ? 'ガイド、チュートリアル、API リファレンスを見る' : 'Explore guides, tutorials, and API references',
      href: `/${lang}/guides`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      title: isJapanese ? 'ブログ' : 'Blog',
      description: isJapanese ? '最新ニュース、更新情報、技術記事を見る' : 'Latest news, updates, and insights',
      href: 'https://blog.scalebox.dev',
      external: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
    {
      title: 'GitHub',
      description: isJapanese ? 'ソースコードを確認して開発に参加する' : 'View source code and contribute',
      href: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
      external: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-col gap-6 py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{appName}</h1>
          <p className="text-fd-muted-foreground text-lg">
            {isJapanese
              ? 'ScaleBox ドキュメントへようこそ。クラウドネイティブアプリケーションを構築・管理できます。'
              : 'Welcome to ScaleBox documentation. Build and manage cloud-native applications.'}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              className="group flex flex-col gap-3 p-6 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-accent transition-colors"
            >
              <div className="text-fd-muted-foreground group-hover:text-fd-foreground transition-colors">
                {card.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  {card.title}
                  {card.external && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-fd-muted-foreground"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  )}
                </h2>
                <p className="text-sm text-fd-muted-foreground">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
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
}) {
  const lang = (await params).lang;
  return {
    title: lang === 'ja' ? 'ScaleBox ドキュメント' : 'ScaleBox Document',
    description: lang === 'ja' ? 'ScaleBox 公式ドキュメント' : 'ScaleBox Document',
  };
}
