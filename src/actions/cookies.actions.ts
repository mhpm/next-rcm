'use server';

import { cookies } from 'next/headers';

export async function setChurchSlugCookie(slug: string) {
  const cookieStore = await cookies();
  cookieStore.set('church_slug', slug, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
