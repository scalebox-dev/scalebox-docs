import { RootProvider } from 'fumadocs-ui/provider/next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import '../global.css';
import { Inter } from 'next/font/google';
import { baseOptions } from '@/lib/layout.shared';
import { cookies } from 'next/headers';
import { i18n } from '@/lib/i18n';

const inter = Inter({
  subsets: ['latin'],
});

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = (cookieLocale && (i18n.languages as string[]).includes(cookieLocale))
    ? cookieLocale
    : i18n.defaultLanguage;

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <HomeLayout {...baseOptions(locale)}>
            {children}
          </HomeLayout>
        </RootProvider>
      </body>
    </html>
  );
}
