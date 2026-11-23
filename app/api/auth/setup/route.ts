import { NextRequest, NextResponse } from 'next/server';
import { setupFirstAdmin } from '@/src/server/authStore';

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
      { ok: false, error: 'Data aktivasi petugas wajib dikirimkan.' },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const username = typeof record.username === 'string' ? record.username : '';
  const password = typeof record.password === 'string' ? record.password : '';
  const namaPetugas = typeof record.namaPetugas === 'string' ? record.namaPetugas : '';

  const result = setupFirstAdmin(username, password, namaPetugas);
  if (!result.ok || !result.session) {
    return NextResponse.json(
      { ok: false, error: result.error ?? 'Gagal mengaktifkan akun petugas.' },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { ok: true, session: result.session },
    { status: 201, headers: { 'Cache-Control': 'no-store' } }
  );
}
