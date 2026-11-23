'use client';

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  LogOut,
  RotateCcw,
  Search,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { downloadGuestsCsv } from '@/src/services/exportService';
import {
  UNIT_TUJUAN_LIST,
  filterGuests,
  formatDateShortId,
  formatPhoneDisplay,
  formatTimeWib,
  formatTodayFullId,
  getDashboardStats,
  getTodayDateString,
  getUnitShortLabel,
} from '@/src/services/guestService';
import type {
  AuthSession,
  GuestFilter,
  GuestVisit,
  VisitStatusFilter,
} from '@/src/types/guest';

interface DashboardProps {
  session: AuthSession;
  visits: GuestVisit[];
  onCheckout: (id: string) => { ok: boolean; error?: string };
  onResetSampleData: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  session,
  visits,
  onCheckout,
  onResetSampleData,
  onLogout,
}: DashboardProps) {
  const todayStr = getTodayDateString();

  const [filter, setFilter] = useState<GuestFilter>({
    search: '',
    unitTujuan: '',
    status: 'semua',
    tanggal: todayStr,
  });

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const statsDate = filter.tanggal || todayStr;
  const stats = useMemo(
    () => getDashboardStats(visits, statsDate),
    [visits, statsDate]
  );

  const filteredVisits = useMemo(
    () => filterGuests(visits, filter),
    [visits, filter]
  );

  const maxUnitCount = useMemo(() => {
    const highest = Math.max(...stats.distribusiUnit.map((d) => d.jumlah), 1);
    return highest;
  }, [stats.distribusiUnit]);

  function handleExportCsv() {
    if (filteredVisits.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Tidak ada data kunjungan pada filter saat ini untuk diekspor.',
      });
      return;
    }

    const result = downloadGuestsCsv(filteredVisits, filter.tanggal || 'semua');
    if (result.ok) {
      setFeedback({
        type: 'success',
        message: `Rekap ${result.count} kunjungan berhasil diunduh dalam format CSV (${result.filename}).`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: result.error ?? 'Gagal mengekspor data ke CSV.',
      });
    }
  }

  function handleCheckoutClick(visit: GuestVisit) {
    const result = onCheckout(visit.id);
    if (result.ok) {
      setFeedback({
        type: 'success',
        message: `Kunjungan ${visit.nama_lengkap} (${visit.id}) telah ditandai selesai / keluar.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: result.error ?? 'Gagal memperbarui status pulang tamu.',
      });
    }
  }

  function handleResetFilters() {
    setFilter({
      search: '',
      unitTujuan: '',
      status: 'semua',
      tanggal: '',
    });
  }

  const statusTabs: { value: VisitStatusFilter; label: string }[] = [
    { value: 'semua', label: 'Semua' },
    { value: 'aktif', label: 'Sedang Berkunjung' },
    { value: 'selesai', label: 'Selesai' },
  ];

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* Judul & Aksi Utama */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-headline text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-bold tracking-[-0.2px] text-primary">
            Dashboard Petugas
          </h2>
          <p className="text-[13px] leading-[18px] text-on-surface-variant tabular-nums">
            {formatTodayFullId()} · Petugas: {session.namaPetugas} (
            {session.username})
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[8px] bg-primary text-on-primary text-[14px] leading-[20px] font-semibold tracking-[0.1px] hover:bg-primary-container active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Unduh CSV</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-on-surface text-[13px] leading-[20px] font-semibold hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </section>

      {/* Notifikasi Status */}
      {feedback && (
        <div
          role="status"
          className={`rounded-[12px] px-4 py-3 flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-success-container text-on-success-container'
              : 'bg-error-container text-on-error-container'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span className="text-[13px] leading-[18px] font-medium">
              {feedback.message}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[12px] font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Ringkasan Metrik Hari Ini */}
      <section
        aria-label="Ringkasan kunjungan"
        className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-stretch"
      >
        <article className="h-full rounded-[12px] bg-surface-container-low p-4 sm:p-5 flex flex-col justify-between gap-1.5">
          <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface-variant">
            Total Tamu
          </span>
          <p className="font-headline text-[28px] leading-[34px] font-bold text-primary tabular-nums">
            {stats.totalHariIni}
          </p>
          <span className="text-[12px] leading-[18px] text-on-surface-variant tabular-nums">
            {filter.tanggal === todayStr || !filter.tanggal
              ? 'Hari ini'
              : formatDateShortId(`${statsDate} 00:00:00`)}
          </span>
        </article>

        <article className="h-full rounded-[12px] bg-surface-container-low p-4 sm:p-5 flex flex-col justify-between gap-1.5">
          <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface-variant">
            Sedang Berkunjung
          </span>
          <p className="font-headline text-[28px] leading-[34px] font-bold text-success tabular-nums">
            {stats.sedangBerkunjung}
          </p>
          <span className="text-[12px] leading-[18px] text-on-surface-variant tabular-nums">
            {stats.selesaiHariIni} tamu sudah keluar
          </span>
        </article>

        <article className="col-span-2 md:col-span-1 h-full rounded-[12px] bg-surface-container-low p-4 sm:p-5 flex flex-col justify-between gap-1.5">
          <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface-variant">
            Unit Terpadat
          </span>
          <p className="font-headline text-[18px] leading-[24px] font-semibold text-primary truncate">
            {stats.unitTerpadat ? stats.unitTerpadat.labelSingkat : 'Belum ada data'}
          </p>
          <span className="text-[12px] leading-[18px] text-on-surface-variant tabular-nums">
            {stats.unitTerpadat
              ? `${stats.unitTerpadat.jumlah} tamu (${stats.unitTerpadat.persentase}%)`
              : '0 tamu'}
          </span>
        </article>
      </section>

      {/* Grid Utama Desktop: Grafik Distribusi + Daftar Tamu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Grafik per Unit Tujuan */}
        <article className="lg:col-span-5 rounded-[12px] border border-outline-variant bg-surface-container-lowest p-4 sm:p-5 flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <h3 className="font-headline text-[18px] leading-[24px] font-semibold text-on-surface">
              Grafik per Unit Tujuan
            </h3>
            <p className="text-[12px] leading-[18px] text-on-surface-variant">
              Distribusi jumlah tamu berdasarkan unit layanan{' '}
              {filter.tanggal === todayStr || !filter.tanggal
                ? 'hari ini'
                : `pada ${formatDateShortId(`${statsDate} 00:00:00`)}`}
            </p>
          </header>

          <div
            className="flex flex-col gap-3.5"
            role="list"
            aria-label="Grafik kunjungan per unit tujuan"
          >
            {stats.distribusiUnit.map((item) => {
              const widthPercent =
                item.jumlah > 0
                  ? Math.max(8, Math.round((item.jumlah / maxUnitCount) * 100))
                  : 0;
              return (
                <div
                  key={item.unit}
                  className="flex flex-col gap-1.5"
                  role="listitem"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] leading-[18px] text-on-surface truncate">
                      {item.labelSingkat}
                    </span>
                    <span className="font-mono text-[14px] leading-[20px] font-semibold text-primary tabular-nums shrink-0">
                      {item.jumlah}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-200"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        {/* Daftar Tamu & Filter */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-headline text-[18px] leading-[24px] font-semibold text-on-surface">
                {filter.tanggal === todayStr
                  ? 'Daftar Tamu Hari Ini'
                  : 'Riwayat Kunjungan Tamu'}
              </h3>
              <p className="text-[12px] leading-[18px] text-on-surface-variant tabular-nums">
                Menampilkan {filteredVisits.length} dari {visits.length} catatan
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onResetSampleData();
                setFeedback({
                  type: 'success',
                  message: 'Data kunjungan berhasil dikembalikan ke data contoh awal.',
                });
              }}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[12px] font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Data Contoh</span>
            </button>
          </div>

          {/* Kontrol Pencarian & Filter */}
          <div className="rounded-[12px] border border-outline-variant bg-surface-container-lowest p-3.5 sm:p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Pencarian */}
              <div className="relative flex items-center sm:col-span-2">
                <Search
                  className="w-4 h-4 text-on-surface-variant absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Cari nama tamu, instansi, atau nomor kunjungan..."
                  aria-label="Cari tamu"
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-100"
                />
              </div>

              {/* Filter Unit */}
              <select
                aria-label="Filter unit tujuan"
                value={filter.unitTujuan}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, unitTujuan: e.target.value }))
                }
                className="w-full min-h-[42px] px-3 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[13px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Semua Unit Tujuan</option>
                {UNIT_TUJUAN_LIST.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.shortLabel}
                  </option>
                ))}
              </select>

              {/* Filter Tanggal */}
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1 flex items-center">
                  <Calendar
                    className="w-4 h-4 text-on-surface-variant absolute left-3 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="date"
                    aria-label="Filter tanggal kunjungan"
                    value={filter.tanggal}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, tanggal: e.target.value }))
                    }
                    className="w-full min-h-[42px] pl-9 pr-2.5 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[13px] text-on-surface tabular-nums focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                {filter.tanggal ? (
                  <button
                    type="button"
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, tanggal: '' }))
                    }
                    className="min-h-[42px] px-2.5 rounded-[8px] border border-outline-variant text-[12px] font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Semua
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, tanggal: todayStr }))
                    }
                    className="min-h-[42px] px-2.5 rounded-[8px] border border-outline-variant text-[12px] font-semibold text-primary hover:bg-surface-container-low whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Hari Ini
                  </button>
                )}
              </div>
            </div>

            {/* Filter Status Segmented */}
            <div
              role="group"
              aria-label="Filter status kunjungan"
              className="grid grid-cols-3 gap-1 p-1 rounded-[8px] bg-surface-container-low"
            >
              {statusTabs.map((tab) => {
                const isActive = filter.status === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, status: tab.value }))
                    }
                    className={`min-h-[36px] px-2 py-1.5 rounded-[6px] text-[12px] font-semibold whitespace-nowrap truncate transition-colors duration-100 cursor-pointer ${
                      isActive
                        ? 'bg-surface-container-lowest text-primary border border-outline-variant/60'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daftar Kartu Tamu */}
          {filteredVisits.length === 0 ? (
            <div className="rounded-[12px] border border-outline-variant bg-surface-container-lowest p-8 text-center flex flex-col items-center gap-3">
              <p className="text-[14px] font-semibold text-on-surface">
                Tidak ada catatan kunjungan yang sesuai filter.
              </p>
              <p className="text-[12px] text-on-surface-variant max-w-sm">
                Ubah kata kunci pencarian, pilih tanggal lain, atau tampilkan
                seluruh riwayat kunjungan.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[40px] px-4 py-2 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-[13px] font-semibold text-primary hover:bg-surface-container-low cursor-pointer"
              >
                Tampilkan Semua Riwayat
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredVisits.map((visit) => {
                const isActive = visit.waktu_keluar === null;
                return (
                  <article
                    key={visit.id}
                    className="rounded-[12px] border border-outline-variant bg-surface-container-lowest p-4 flex flex-col gap-3"
                  >
                    {/* Baris Atas: Identitas & Jam Masuk */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[16px] leading-[22px] font-semibold text-on-surface">
                          {visit.nama_lengkap}
                        </h4>
                        <p className="text-[13px] leading-[18px] text-on-surface-variant">
                          {visit.instansi} ·{' '}
                          <span className="font-mono tabular-nums">
                            {formatPhoneDisplay(visit.nomor_hp)}
                          </span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-[14px] leading-[20px] font-semibold text-primary tabular-nums block">
                          {formatTimeWib(visit.waktu_masuk, false)} WIB
                        </span>
                        <span className="text-[11px] leading-[14px] text-on-surface-variant tabular-nums">
                          {formatDateShortId(visit.waktu_masuk)}
                        </span>
                      </div>
                    </div>

                    {/* Keperluan */}
                    <p className="text-[13px] leading-[19px] text-on-surface text-pretty">
                      {visit.keperluan}
                    </p>

                    {/* Baris Metadata & Aksi Pulang */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-surface-container">
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-on-surface-variant">
                        <span className="font-semibold text-primary">
                          {getUnitShortLabel(visit.unit_tujuan)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[12px] tabular-nums">
                          {visit.id}
                        </span>
                        <span aria-hidden="true">·</span>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container text-[11px] font-semibold">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span>Sedang Berkunjung</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[12px] text-on-surface-variant tabular-nums">
                            Keluar {formatTimeWib(visit.waktu_keluar ?? '', true)}
                          </span>
                        )}
                      </div>

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleCheckoutClick(visit)}
                          className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-[8px] border border-primary bg-surface-container-lowest text-primary text-[12px] font-semibold hover:bg-primary hover:text-on-primary transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Selesai / Keluar</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
