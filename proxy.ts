import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Excluir completamente Stack Auth: no i18n, no redirecciones, no transformaciones
  if (pathname.startsWith('/handler')) {
    return NextResponse.next();
  }

  // i18n básico: prefijar idioma por defecto si falta
  const locales = ['en', 'es'] as const;
  const defaultLocale = 'en';

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

