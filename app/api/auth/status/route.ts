import { NextResponse } from 'next/server';
import { getAuthStatus } from '@/src/server/authStore';

export async function GET() {
  const status = getAuthStatus();
  return NextResponse.json(status, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
