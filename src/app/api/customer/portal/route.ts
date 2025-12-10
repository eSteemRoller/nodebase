import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST() {
  try {
    // Delegate to better-auth's customer.portal endpoint. Forward headers
    // for session identification.
    const result = await (auth.api as any).customer.portal({ headers: await headers() } as any);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'failed' }, { status: 500 });
  }
}
