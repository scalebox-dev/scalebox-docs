'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const THEME_COOKIE = 'DOCS_THEME';
const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;
type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

function normalizeTheme(value: string | null): SupportedTheme | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return SUPPORTED_THEMES.find((theme) => theme === normalized) ?? null;
}

export function ThemeQuerySync() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const theme = normalizeTheme(searchParams.get('theme'));
    if (!theme) return;

    // URL 显式指定主题时，直接在客户端强制应用，避免依赖中间状态同步。
    const root = document.documentElement;
    const applyThemeClass = (value: SupportedTheme) => {
      root.classList.remove('light', 'dark');
      if (value === 'light' || value === 'dark') {
        root.classList.add(value);
        root.style.colorScheme = value;
        return;
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved = prefersDark ? 'dark' : 'light';
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
    };

    applyThemeClass(theme);
    localStorage.setItem(THEME_COOKIE, theme);

    // 同步到 cookie，保证后续 SSR 默认主题与客户端一致。
    document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000`;

    // 参数消费后清理 URL，避免分享链接时重复触发主题覆写。
    const url = new URL(window.location.href);
    url.searchParams.delete('theme');
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [searchParams]);

  return null;
}
