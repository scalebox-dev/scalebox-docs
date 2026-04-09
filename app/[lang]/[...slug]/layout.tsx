import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';

export default async function DocsSlugLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  return (
    <DocsLayout tree={source.getPageTree(lang)} {...baseOptions(lang)} links={[]}>
      {children}
    </DocsLayout>
  );
}
