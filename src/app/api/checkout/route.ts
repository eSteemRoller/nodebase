import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Delegate to better-auth's checkout endpoint. We forward the request
    // headers so the auth middleware can identify the user/session.
    const result = await auth.api.checkout({ body, headers: await headers() } as any);

    // Return whatever the auth endpoint returned; normalize to JSON when
    // possible.
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'failed' }, { status: 500 });
  }
}
