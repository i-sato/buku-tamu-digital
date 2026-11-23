'use client';

import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  fetchAuthStatus,
  loginAdmin,
  setupAdminAccount,
} from '@/src/services/authService';
import type { AuthSession } from '@/src/types/guest';

interface LoginFormProps {
  onAuthenticated: (session: AuthSession) => void;
}

export default function LoginForm({ onAuthenticated }: LoginFormProps) {
  const [statusLoading, setStatusLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(true);
  const [configuredViaEnv, setConfiguredViaEnv] = useState(false);

  const [namaPetugas, setNamaPetugas] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadStatus() {
      try {
        const status = await fetchAuthStatus();
        if (!active) return;
        setIsInitialized(status.initialized);
        setConfiguredViaEnv(status.configuredViaEnv);
      } catch {
        if (!active) return;
        setErrorMessage('Gagal memuat status autentikasi petugas.');
      } finally {
        if (active) setStatusLoading(false);
      }
    }
    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }

    setSubmitting(true);
    const result = await loginAdmin({ username: username.trim(), password });
    setSubmitting(false);

    if (!result.ok || !result.session) {
      setErrorMessage(result.error ?? 'Nama pengguna atau kata sandi tidak sesuai.');
      return;
    }

    onAuthenticated(result.session);
  }

  async function handleSetupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Nama pengguna petugas wajib diisi.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Kata sandi petugas minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSubmitting(true);
    const result = await setupAdminAccount({
      username: username.trim(),
      password,
      namaPetugas: namaPetugas.trim() || 'Petugas Resepsionis',
    });
    setSubmitting(false);

    if (!result.ok || !result.session) {
      setErrorMessage(result.error ?? 'Gagal mengaktifkan akun petugas.');
      return;
    }

    onAuthenticated(result.session);
  }

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-5">
      <section className="flex flex-col gap-1.5">
        <h2 className="font-headline text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-bold tracking-[-0.2px] text-primary text-balance">
          {statusLoading
            ? 'Memeriksa Akses Petugas'
            : isInitialized
              ? 'Masuk Dashboard Petugas'
              : 'Aktivasi Akun Petugas'}
        </h2>
        <p className="text-[14px] leading-[20px] text-on-surface-variant text-pretty">
          {statusLoading
            ? 'Mohon tunggu sebentar sembari kami memeriksa kesiapan autentikasi.'
            : isInitialized
              ? 'Riwayat kunjungan hanya dapat diakses oleh petugas resmi yang telah terverifikasi.'
              : 'Kredensial lingkungan server belum disetel. Buat akun petugas pertama untuk mengamankan akses dasbor.'}
        </p>
      </section>

      <article className="rounded-[12px] border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 flex flex-col gap-5">
        {statusLoading ? (
          <div className="flex flex-col gap-4 py-2" aria-busy="true">
            <div className="h-11 rounded-[8px] bg-surface-container-low animate-pulse" />
            <div className="h-11 rounded-[8px] bg-surface-container-low animate-pulse" />
            <div className="h-12 rounded-[8px] bg-surface-container animate-pulse" />
          </div>
        ) : (
          <>
            {errorMessage && (
              <div
                role="alert"
                className="rounded-[8px] bg-error-container text-on-error-container px-3 py-2.5 flex items-start gap-2.5 text-[13px] leading-[18px]"
              >
                <AlertCircle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{errorMessage}</span>
              </div>
            )}

            {isInitialized ? (
              <form
                onSubmit={handleLoginSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <label className="flex flex-col gap-1 w-full">
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
                    Nama Pengguna
                  </span>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: petugas"
                    className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                  />
                </label>

                <label className="flex flex-col gap-1 w-full">
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
                    Kata Sandi
                  </span>
                  <div className="relative flex items-center">
                    <Lock
                      aria-hidden="true"
                      className="w-4 h-4 text-on-surface-variant absolute left-3 pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi petugas"
                      className="w-full min-h-[44px] pl-10 pr-11 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan kata sandi'
                          : 'Tampilkan kata sandi'
                      }
                      className="absolute right-1 w-10 h-10 inline-flex items-center justify-center rounded-[6px] text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-[8px] bg-primary text-on-primary text-[14px] leading-[20px] font-semibold tracking-[0.1px] hover:bg-primary-container disabled:opacity-60 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-100 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>{submitting ? 'Memverifikasi...' : 'Masuk'}</span>
                </button>

                {configuredViaEnv && (
                  <p className="text-[12px] leading-[18px] text-on-surface-variant text-center">
                    Autentikasi terhubung ke konfigurasi lingkungan server instansi.
                  </p>
                )}
              </form>
            ) : (
              <form
                onSubmit={handleSetupSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <div className="rounded-[8px] bg-surface-container-low p-3 flex items-start gap-2.5 text-[12px] leading-[18px] text-on-surface-variant">
                  <ShieldCheck
                    className="w-4 h-4 text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Kata sandi akan dienkripsi menggunakan hash acak di sisi server
                    dan tidak disimpan dalam kode sumber maupun peramban.
                  </span>
                </div>

                <label className="flex flex-col gap-1 w-full">
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
                    Nama Petugas
                  </span>
                  <input
                    type="text"
                    name="nama_petugas"
                    autoComplete="name"
                    value={namaPetugas}
                    onChange={(e) => setNamaPetugas(e.target.value)}
                    placeholder="Contoh: Petugas Resepsionis"
                    className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                  />
                </label>

                <label className="flex flex-col gap-1 w-full">
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
                    Nama Pengguna <span className="text-error">*</span>
                  </span>
                  <input
                    type="text"
                    name="setup_username"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: petugas.kominfo"
                    className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                  />
                  <span className="text-[12px] leading-[18px] text-on-surface-variant">
                    3–32 karakter (huruf kecil, angka, titik, atau garis bawah).
                  </span>
                </label>

                <label className="flex flex-col gap-1 w-full">
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
                    Kata Sandi Baru <span className="text-error">*</span>
                  </span>
                  <div className="relative flex items-center">
                    <Lock
                      aria-hidden="true"
                      className="w-4 h-4 text-on-surface-variant absolute left-3 pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="setup_password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full min-h-[44px] pl-10 pr-11 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan kata sandi'
                          : 'Tampilkan kata sandi'
                      }
                      className="absolute right-1 w-10 h-10 inline-flex items-center justify-center rounded-[6px] text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="flex flex-col gap-1 w-full">
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
                    Konfirmasi Kata Sandi <span className="text-error">*</span>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-[8px] bg-primary text-on-primary text-[14px] leading-[20px] font-semibold tracking-[0.1px] hover:bg-primary-container disabled:opacity-60 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-100 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {submitting
                      ? 'Mengaktifkan...'
                      : 'Aktifkan & Masuk Dashboard'}
                  </span>
                </button>
              </form>
            )}
          </>
        )}
      </article>
    </div>
  );
}
