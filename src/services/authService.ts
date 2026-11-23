import type { AuthSession, AuthStatusResponse } from '@/src/types/guest';

/**
 * Token sesi petugas disimpan hanya di memori aplikasi (tidak pernah di localStorage/sessionStorage).
 */
let activeSession: AuthSession | null = null;

export function getActiveSession(): AuthSession | null {
  return activeSession;
}

export function clearActiveSession(): void {
  activeSession = null;
}

export async function fetchAuthStatus(): Promise<AuthStatusResponse> {
  const response = await fetch('/api/auth/status', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Gagal memeriksa status akun petugas.');
  }

  return (await response.json()) as AuthStatusResponse;
}

export async function setupAdminAccount(payload: {
  username: string;
  password: string;
  namaPetugas: string;
}): Promise<{ ok: boolean; session?: AuthSession; error?: string }> {
  try {
    const response = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      session?: AuthSession;
      error?: string;
    };

    if (!response.ok || !data.session) {
      return {
        ok: false,
        error: data.error ?? 'Gagal mengaktifkan akun petugas.',
      };
    }

    activeSession = data.session;
    return { ok: true, session: data.session };
  } catch {
    return {
      ok: false,
      error: 'Tidak dapat terhubung ke layanan autentikasi.',
    };
  }
}

export async function loginAdmin(payload: {
  username: string;
  password: string;
}): Promise<{ ok: boolean; session?: AuthSession; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      session?: AuthSession;
      error?: string;
    };

    if (!response.ok || !data.session) {
      return {
        ok: false,
        error: data.error ?? 'Nama pengguna atau kata sandi tidak sesuai.',
      };
    }

    activeSession = data.session;
    return { ok: true, session: data.session };
  } catch {
    return {
      ok: false,
      error: 'Tidak dapat terhubung ke layanan autentikasi.',
    };
  }
}

export async function verifyCurrentSession(): Promise<AuthSession | null> {
  if (!activeSession?.token) {
    return null;
  }

  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${activeSession.token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      activeSession = null;
      return null;
    }

    return activeSession;
  } catch {
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  const token = activeSession?.token;
  activeSession = null;

  if (!token) return;

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Sesi di memori klien tetap dibersihkan walaupun jaringan bermasalah
  }
}
