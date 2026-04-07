import { source } from '@/lib/source';
import { createI18nSearchAPI } from 'fumadocs-core/search/server';
import { i18n } from '@/lib/i18n';

export const { GET } = createI18nSearchAPI('advanced', {
  i18n,
  // Orama doesn't support Chinese tokenizer, map zh-cn and zh-tw to english
  localeMap: {
    'en': 'english',
    'zh-cn': 'english',
    'zh-tw': 'english',
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
