import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/src/server/authStore';

function getClientKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return req.headers.get('x-real-ip') || 'local';
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Format permintaan tidak valid.' },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { ok: false, error: 'Nama pengguna dan kata sandi wajib diisi.' },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const username = typeof record.username === 'string' ? record.username : '';
  const password = typeof record.password === 'string' ? record.password : '';

  const result = authenticateAdmin(username, password, getClientKey(req));
  if (!result.ok || !result.session) {
    return NextResponse.json(
      { ok: false, error: result.error ?? 'Gagal masuk.' },
      { status: result.status ?? 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    { ok: true, session: result.session },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
