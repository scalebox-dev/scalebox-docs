import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

const THEME_COOKIE = 'DOCS_THEME';
const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;
type SupportedTheme = (typeof SUPPORTED_THEMES)[number];
const STANDALONE_SECTIONS = ['mcp', 'skills', 'playground'] as const;

const { rewrite: rewriteDocs } = rewritePath(
  `/{lang}{/*path}`,
  `${docsContentRoute}/{lang}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `/{lang}{/*path}.mdx`,
  `${docsContentRoute}/{lang}{/*path}/content.md`,
);

/**
 * Check if the pathname starts with a valid language prefix.
 * Case-insensitive to handle browser locale variants (zh-CN vs zh-cn).
 */
function getPathnameLocale(pathname: string): string | null {
  const segments = pathname.split('/');
  const firstSegment = segments[1]?.toLowerCase(); // first segment after leading /
  
  if (!firstSegment) return null;
  
  // Check against configured languages (case-insensitive)
  return i18n.languages.find(lang => lang.toLowerCase() === firstSegment) ?? null;
}

/**
 * 从 query 中解析语言，返回规范化后的语言值。
 */
function getQueryLocale(request: NextRequest): string | null {
  const lang = request.nextUrl.searchParams.get('lang')?.trim().toLowerCase();
  if (!lang) return null;
  return i18n.languages.find(item => item.toLowerCase() === lang) ?? null;
}

/**
 * 从 query 中解析主题，返回支持的主题值。
 */
function getQueryTheme(request: NextRequest): SupportedTheme | null {
  const theme = request.nextUrl.searchParams.get('theme')?.trim().toLowerCase();
  if (!theme) return null;
  return SUPPORTED_THEMES.find(item => item === theme) ?? null;
}

/**
 * 去掉我们用于初始化的 query 参数，避免 URL 噪音。
 */
function removeControlParams(url: URL): void {
  url.searchParams.delete('lang');
}

/**
 * 为响应写入语言和主题偏好 cookie。
 */
function setPreferenceCookies(
  response: NextResponse,
  locale: string | null,
  theme: SupportedTheme | null,
): NextResponse {
  if (locale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (theme) {
    response.cookies.set(THEME_COOKIE, theme, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

/**
 * Detect the best matching language from Accept-Language header.
 */
function detectLanguage(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang) return i18n.defaultLanguage;
  
  // Parse Accept-Language header entries
  const entries = acceptLang.split(',').map(entry => {
    const [lang, q] = entry.trim().split(';q=');
    return { lang: lang.trim().toLowerCase(), quality: q ? parseFloat(q) : 1.0 };
  }).sort((a, b) => b.quality - a.quality);
  
  // Try to match each preferred language against our configured languages
  for (const entry of entries) {
    const browserLang = entry.lang;
    
    // Exact match (case-insensitive)
    const exact = i18n.languages.find(l => l.toLowerCase() === browserLang);
    if (exact) return exact;
    
    // Prefix match: zh matches zh-cn, en-US matches en
    const prefix = i18n.languages.find(l => 
      l.toLowerCase().startsWith(browserLang.split('-')[0]) ||
      browserLang.startsWith(l.toLowerCase().split('-')[0])
    );
    if (prefix) return prefix;
  }
  
  return i18n.defaultLanguage;
}

/**
 * 解析请求的目标语言优先级：query > cookie > Accept-Language > default。
 */
function resolvePreferredLocale(
  request: NextRequest,
  queryLocale: string | null,
): string {
  if (queryLocale) return queryLocale;

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && (i18n.languages as string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  return detectLanguage(request);
}

export default function proxy(request: NextRequest, _context: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const queryLocale = getQueryLocale(request);
  const queryTheme = getQueryTheme(request);
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0]?.toLowerCase();
  const secondSegment = pathSegments[1]?.toLowerCase();

  // 这三个页面对外固定使用根路径，不暴露语言前缀。
  if (
    firstSegment &&
    STANDALONE_SECTIONS.includes(
      firstSegment as (typeof STANDALONE_SECTIONS)[number],
    )
  ) {
    const preferredLocale = resolvePreferredLocale(request, queryLocale);
    const hasControlParams = queryLocale !== null;

    // 优先把控制参数写入 cookie 并清理 URL，下一跳再由 rewrite 使用 cookie/检测到的语言。
    if (hasControlParams) {
      const url = new URL(pathname, request.nextUrl);
      url.search = request.nextUrl.search;
      removeControlParams(url);
      return setPreferenceCookies(
        NextResponse.redirect(url),
        queryLocale,
        queryTheme,
      );
    }

    const rewriteUrl = new URL(`/${preferredLocale}${pathname}`, request.nextUrl);
    rewriteUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(rewriteUrl);
  }
  
  // Check if path already has a valid language prefix
  const existingLocale = getPathnameLocale(pathname);
  if (existingLocale) {
    if (
      secondSegment &&
      STANDALONE_SECTIONS.includes(
        secondSegment as (typeof STANDALONE_SECTIONS)[number],
      )
    ) {
      const rootPath = `/${pathSegments.slice(1).join('/')}`;
      const url = new URL(rootPath, request.nextUrl);
      url.search = request.nextUrl.search;
      removeControlParams(url);
      return setPreferenceCookies(
        NextResponse.redirect(url),
        queryLocale ?? existingLocale,
        queryTheme,
      );
    }

    const targetLocale = queryLocale ?? existingLocale;

    // If the case doesn't match our config (e.g., /zh-CN/ vs /zh-cn/), normalize it
    const segments = pathname.split('/');
    if (segments[1] !== targetLocale || existingLocale !== targetLocale) {
      segments[1] = targetLocale;
      const normalizedPath = segments.join('/') || '/';
      const url = new URL(normalizedPath, request.nextUrl);
      url.search = request.nextUrl.search;
      removeControlParams(url);
      return setPreferenceCookies(
        NextResponse.redirect(url),
        targetLocale,
        queryTheme,
      );
    }

    // Persist locale preference in cookie
    return setPreferenceCookies(
      NextResponse.next(),
      targetLocale,
      queryTheme,
    );
  }
  
  // Handle .md/.mdx URL requests
  // Match patterns like /en/api/notifications.mdx or /zh-cn/index.md
  const langPrefixMatch = pathname.match(/^\/([a-z]{2}(-[a-z]+)?)(\/.*)?$/i);
  if (
    langPrefixMatch &&
    (pathname.endsWith('.md') || pathname.endsWith('.mdx'))
  ) {
    const stripped = pathname.replace(/\.mdx?$/, '');
    const result = rewriteSuffix(stripped);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }
  
  // Handle Accept header content negotiation
  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }
  
  // No language prefix found — detect and redirect
  // 优先级：query lang > cookie > Accept-Language > default
  const detectedLang = resolvePreferredLocale(request, queryLocale);
  const redirectPath = pathname === '/' ? `/${detectedLang}` : `/${detectedLang}${pathname}`;
  const url = new URL(redirectPath, request.nextUrl);
  url.search = request.nextUrl.search;
  removeControlParams(url);
  return setPreferenceCookies(
    NextResponse.redirect(url),
    detectedLang,
    queryTheme,
  );
}

export const config = {
  matcher: ['/((?!api/search|_next/static|_next/image|favicon.ico|llms\\.txt|llms-full\\.txt).*)'],
};
