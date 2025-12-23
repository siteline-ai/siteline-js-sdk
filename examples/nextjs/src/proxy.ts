import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withSiteline, SitelineConfig } from '@siteline/nextjs';

const sitelineConfig: SitelineConfig = {
  debug: process.env.NODE_ENV === 'development'
}

export default withSiteline(sitelineConfig, (request: NextRequest) => {
  const url = new URL(request.url);

  if (url.pathname !== '/home') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
