import { source } from '@/lib/source';
import { createI18nSearchAPI } from 'fumadocs-core/search/server';
import { i18n } from '@/lib/i18n';

export const { GET } = createI18nSearchAPI('advanced', {
  i18n,
  // Orama doesn't provide Chinese or Japanese tokenizers; use its non-stemming
  // English-compatible path so CJK terms remain searchable without a build error.
  localeMap: {
    'en': 'english',
    'zh-cn': 'english',
    'zh-tw': 'english',
    'ja': 'english',
  },
  indexes: i18n.languages.flatMap((lang) => {
    return source.getPages(lang).map((page) => ({
      locale: lang,
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      id: page.url,
      url: page.url,
    }));
  }),
});
