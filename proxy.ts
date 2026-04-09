import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

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

export default function proxy(request: NextRequest, _context: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  
  // Check if path already has a valid language prefix
  const existingLocale = getPathnameLocale(pathname);
  if (existingLocale) {
    // If the case doesn't match our config (e.g., /zh-CN/ vs /zh-cn/), normalize it
    const segments = pathname.split('/');
    if (segments[1] !== existingLocale) {
      segments[1] = existingLocale;
      const normalizedPath = segments.join('/') || '/';
      const url = new URL(normalizedPath, request.nextUrl);
      url.search = request.nextUrl.search;
      const resp = NextResponse.redirect(url);
      resp.cookies.set('NEXT_LOCALE', existingLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return resp;
    }
    // Persist locale preference in cookie
    const resp = NextResponse.next();
    resp.cookies.set('NEXT_LOCALE', existingLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return resp;
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
  // Prefer cookie > Accept-Language > default
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const detectedLang = (cookieLocale && (i18n.languages as string[]).includes(cookieLocale)) ? cookieLocale : detectLanguage(request);
  const redirectPath = pathname === '/' ? `/${detectedLang}` : `/${detectedLang}${pathname}`;
  const url = new URL(redirectPath, request.nextUrl);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api/search|_next/static|_next/image|favicon.ico|llms\\.txt|llms-full\\.txt).*)'],
};
