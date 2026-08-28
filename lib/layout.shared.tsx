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
  ja: {
    displayName: '日本語',
    search: 'ドキュメントを検索',
  },
});

export function baseOptions(locale: string): BaseLayoutProps {
  const labels = locale === 'ja'
    ? {
        skills: 'スキル',
        playground: 'プレイグラウンド',
        blog: 'ブログ',
        goToScaleBox: 'ScaleBox を開く',
      }
    : {
        skills: 'Skills',
        playground: 'Playground',
        blog: 'Blog',
        goToScaleBox: 'Go to ScaleBox',
      };

  return {
    nav: {
      title: appName,
      url: `/${locale}`,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'MCP',
        url: '/mcp',
        active: 'nested-url',
      },
      {
        text: labels.skills,
        url: '/skills',
        active: 'nested-url',
      },
      {
        text: labels.playground,
        url: '/playground',
        active: 'nested-url',
      },
      {
        text: (
          <span className="inline-flex items-center gap-1 align-middle">
            {labels.blog}
            <ExternalLink className="size-3.5 opacity-70" />
          </span>
        ),
        url: 'https://blog.scalebox.dev',
        external: true,
      },
      {
        type: 'custom',
        secondary: true,
        children: (
          <a
            href="https://www.scalebox.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-fd-primary px-4 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-80"
          >
            {labels.goToScaleBox}
            <ExternalLink className="size-3.5" />
          </a>
        ),
      },
    ],
  };
}
