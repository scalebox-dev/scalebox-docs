import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  // With i18n, the slug includes the locale as the first segment
  const lang = slug?.[0] ?? 'en';
  const pageSlug = slug?.slice(1, -1);
  const page = source.getPage(pageSlug, lang);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: [page.locale, ...getPageMarkdownUrl(page).segments],
  }));
}
