import { i18n } from '@/lib/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
  },
  'zh-cn': {
    displayName: '简体中文',
    search: '搜索文档',
  },
  'zh-tw': {
    displayName: '繁體中文',
    search: '搜尋文檔',
  },
});

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: `/${locale}`,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'Back to ScaleBox.dev',
        url: 'https://www.scalebox.dev',
        external: true,
      },
    ],
  };
}
