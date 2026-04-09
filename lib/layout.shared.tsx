import { i18n } from '@/lib/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { ExternalLink } from 'lucide-react';

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
        text: 'Blog',
        url: 'https://blog.scalebox.dev',
        external: true,
      },
      {
        type: 'custom',
        secondary: true,
        children: (
          <a
            href="https://www.scalebox.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-fd-primary px-4 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-80"
          >
            Go to ScaleBox
            <ExternalLink className="size-3.5" />
          </a>
        ),
      },
    ],
  };
}
