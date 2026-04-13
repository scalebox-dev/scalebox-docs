import { RootProvider } from 'fumadocs-ui/provider/next';
import '../global.css';
import { Inter } from 'next/font/google';
import { i18nUI } from '@/lib/layout.shared';
import { cookies } from 'next/headers';
import { ThemeQuerySync } from './_components/theme-query-sync';

const inter = Inter({
  subsets: ['latin'],
});

const THEME_COOKIE = 'DOCS_THEME';
const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;
type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

function normalizeTheme(value: string | undefined): SupportedTheme | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  return SUPPORTED_THEMES.find(theme => theme === normalized);
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const lang = (await params).lang;
  const cookieStore = await cookies();
  const preferredTheme = normalizeTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={i18nUI.provider(lang)}
          theme={{
            // 使用 URL 参数写入的偏好主题作为首屏默认值
            defaultTheme: preferredTheme ?? 'system',
            enableSystem: preferredTheme ? preferredTheme === 'system' : true,
            // 与 proxy 写入的 cookie key 对齐，避免被默认 localStorage key 覆盖。
            storageKey: THEME_COOKIE,
          }}
        >
          <ThemeQuerySync />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
