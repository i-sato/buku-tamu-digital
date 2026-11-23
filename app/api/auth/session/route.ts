import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/src/server/authStore';

function extractBearerToken(req: NextRequest): string {
  const header = req.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice('Bearer '.length).trim();
}

export async function GET(req: NextRequest) {
  const token = extractBearerToken(req);
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'Sesi tidak valid atau telah berakhir.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      username: session.username,
      namaPetugas: session.namaPetugas,
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
