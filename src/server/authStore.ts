import crypto from 'node:crypto';

interface StoredCredential {
  username: string;
  namaPetugas: string;
  saltHex: string;
  hashHex: string;
}

interface SessionRecord {
  username: string;
  namaPetugas: string;
  expiresAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface AuthStoreState {
  claimedAdmin: StoredCredential | null;
  sessions: Map<string, SessionRecord>;
  loginAttempts: Map<string, RateLimitEntry>;
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 jam kerja
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 menit
const MAX_LOGIN_ATTEMPTS = 10;

const globalForAuth = globalThis as unknown as {
  __etamuAuthStore?: AuthStoreState;
};

function getStore(): AuthStoreState {
  if (!globalForAuth.__etamuAuthStore) {
    globalForAuth.__etamuAuthStore = {
      claimedAdmin: null,
      sessions: new Map<string, SessionRecord>(),
      loginAttempts: new Map<string, RateLimitEntry>(),
    };
  }
  return globalForAuth.__etamuAuthStore;
}

function hashPasswordWithSalt(password: string, saltHex: string): string {
  return crypto.scryptSync(password, saltHex, 64).toString('hex');
}

function timingSafeHexEqual(aHex: string, bHex: string): boolean {
  const aBuf = Buffer.from(aHex, 'hex');
  const bBuf = Buffer.from(bHex, 'hex');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function timingSafeTextEqual(a: string, b: string): boolean {
  const aHash = crypto.createHash('sha256').update(a).digest();
  const bHash = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

function getEnvAdminCredentials(): { username: string; password: string } | null {
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!envPassword) {
    return null;
  }
  const envUsername = process.env.ADMIN_USERNAME?.trim() || 'petugas';
  return { username: envUsername, password: envPassword };
}

export function getAuthStatus(): { initialized: boolean; configuredViaEnv: boolean } {
  const envCreds = getEnvAdminCredentials();
  if (envCreds) {
    return { initialized: true, configuredViaEnv: true };
  }
  const store = getStore();
  return {
    initialized: store.claimedAdmin !== null,
    configuredViaEnv: false,
  };
}

export function checkLoginRateLimit(clientKey: string): { allowed: boolean; retryAfterSec?: number } {
  const store = getStore();
  const now = Date.now();
  const entry = store.loginAttempts.get(clientKey);

  if (!entry || now > entry.resetAt) {
    return { allowed: true };
  }

  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { allowed: true };
}

function recordFailedAttempt(clientKey: string): void {
  const store = getStore();
  const now = Date.now();
  const entry = store.loginAttempts.get(clientKey);

  if (!entry || now > entry.resetAt) {
    store.loginAttempts.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return;
  }

  entry.count += 1;
}

function clearFailedAttempts(clientKey: string): void {
  const store = getStore();
  store.loginAttempts.delete(clientKey);
}

function issueSession(username: string, namaPetugas: string): {
  token: string;
  username: string;
  namaPetugas: string;
} {
  const store = getStore();
  const token = crypto.randomBytes(32).toString('hex');
  store.sessions.set(token, {
    username,
    namaPetugas,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return { token, username, namaPetugas };
}

/**
 * Klaim akun petugas pertama kali (hanya aktif apabila ADMIN_PASSWORD di .env kosong
 * dan belum ada akun yang diklaim). Menggunakan hash scrypt + salt acak.
 */
export function setupFirstAdmin(
  usernameRaw: string,
  passwordRaw: string,
  namaPetugasRaw: string
): {
  ok: boolean;
  session?: { token: string; username: string; namaPetugas: string };
  error?: string;
} {
  if (getEnvAdminCredentials()) {
    return {
      ok: false,
      error: 'Kredensial petugas sudah dikonfigurasi melalui variabel lingkungan server.',
    };
  }

  const store = getStore();
  if (store.claimedAdmin !== null) {
    return {
      ok: false,
      error: 'Akun petugas sudah diaktifkan sebelumnya. Silakan masuk menggunakan akun terdaftar.',
    };
  }

  const username = usernameRaw.trim().toLowerCase();
  const namaPetugas = namaPetugasRaw.trim() || 'Petugas Layanan';
  const password = passwordRaw;

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return {
      ok: false,
      error: 'Nama pengguna harus 3–32 karakter (huruf kecil, angka, titik, atau garis bawah).',
    };
  }

  if (password.length < 8 || password.length > 128) {
    return {
      ok: false,
      error: 'Kata sandi petugas minimal 8 karakter.',
    };
  }

  const saltHex = crypto.randomBytes(16).toString('hex');
  const hashHex = hashPasswordWithSalt(password, saltHex);

  store.claimedAdmin = {
    username,
    namaPetugas,
    saltHex,
    hashHex,
  };

  const session = issueSession(username, namaPetugas);
  return { ok: true, session };
}

/**
 * Memverifikasi kredensial petugas di sisi server.
 * Kredensial dari process.env selalu diutamakan apabila dikonfigurasi.
 */
export function authenticateAdmin(
  usernameRaw: string,
  passwordRaw: string,
  clientKey: string
): {
  ok: boolean;
  session?: { token: string; username: string; namaPetugas: string };
  error?: string;
  status?: number;
} {
  const rate = checkLoginRateLimit(clientKey);
  if (!rate.allowed) {
    return {
      ok: false,
      status: 429,
      error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${rate.retryAfterSec ?? 60} detik.`,
    };
  }

  const username = usernameRaw.trim().toLowerCase();
  const password = passwordRaw;

  if (!username || !password) {
    return {
      ok: false,
      status: 400,
      error: 'Nama pengguna dan kata sandi wajib diisi.',
    };
  }

  const envCreds = getEnvAdminCredentials();
  if (envCreds) {
    const userMatch = timingSafeTextEqual(username, envCreds.username.toLowerCase());
    const passMatch = timingSafeTextEqual(password, envCreds.password);
    if (userMatch && passMatch) {
      clearFailedAttempts(clientKey);
      return {
        ok: true,
        session: issueSession(envCreds.username, 'Petugas Resepsionis'),
      };
    }
    recordFailedAttempt(clientKey);
    return {
      ok: false,
      status: 401,
      error: 'Nama pengguna atau kata sandi tidak sesuai.',
    };
  }

  const store = getStore();
  if (!store.claimedAdmin) {
    return {
      ok: false,
      status: 409,
      error: 'Akun petugas belum diaktifkan. Silakan lakukan aktivasi akun petugas terlebih dahulu.',
    };
  }

  const userMatch = timingSafeTextEqual(username, store.claimedAdmin.username);
  const candidateHash = hashPasswordWithSalt(password, store.claimedAdmin.saltHex);
  const passMatch = timingSafeHexEqual(candidateHash, store.claimedAdmin.hashHex);

  if (userMatch && passMatch) {
    clearFailedAttempts(clientKey);
    return {
      ok: true,
      session: issueSession(store.claimedAdmin.username, store.claimedAdmin.namaPetugas),
    };
  }

  recordFailedAttempt(clientKey);
  return {
    ok: false,
    status: 401,
    error: 'Nama pengguna atau kata sandi tidak sesuai.',
  };
}

export function verifySessionToken(token: string): SessionRecord | null {
  if (!token) return null;
  const store = getStore();
  const record = store.sessions.get(token);
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    store.sessions.delete(token);
    return null;
  }

  return record;
}

export function revokeSessionToken(token: string): void {
  if (!token) return;
  const store = getStore();
  store.sessions.delete(token);
}
