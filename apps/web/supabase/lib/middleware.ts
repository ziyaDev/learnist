import { NextResponse, type NextRequest } from 'next/server';
import { APP_HOSTNAMES } from '@learnist/utils';
import { createServerClient } from '@supabase/ssr';
import AppMiddleware from '@/middlware/dashboard-middlware';
import { parse } from '@/middlware/utils/parse';

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    const { domain, path, key, fullKey, fullPath } = parse(request);

    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // for App
    if (APP_HOSTNAMES.has(domain)) {
      if (user) {
        return AppMiddleware(request, user);
      } else if (
        !user &&
        path !== '/login' &&
        path !== '/forgot-password' &&
        path !== '/register' &&
        path !== '/auth/saml' &&
        !path.startsWith('/auth/reset-password/')
      ) {
        return NextResponse.redirect(
          new URL(
            `/login${path === '/' ? '' : `?next=${encodeURIComponent(fullPath)}`}`,
            request.url
          )
        );
      }
    }
    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
