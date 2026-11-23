import { NextRequest, NextResponse } from 'next/server';
import { revokeSessionToken } from '@/src/server/authStore';

export async function POST(req: NextRequest) {
  const header = req.headers.get('authorization') ?? '';
  if (header.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length).trim();
    revokeSessionToken(token);
  }

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
