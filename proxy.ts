// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// // Защищённые роуты — только для авторизованных
// const protectedRoutes = ['/admin'];

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Проверяем — защищённый ли это роут
//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (isProtected) {
//     const token = await getToken({
//       req: request,
//       secret: process.env.NEXTAUTH_SECRET,
//     });

//     // Не авторизован — редирект на страницу входа
//     if (!token) {
//       const signInUrl = new URL('/api/auth/signin', request.url);
//       signInUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(signInUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './lib/routing';

const intlProxy = createIntlMiddleware(routing);

const protectedRoutes = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Защита роутов
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Локализация
  return intlProxy(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};