import { getTodayDateString } from '@/src/storage/guestStorage';
import type { GuestVisit } from '@/src/types/guest';

/**
 * Mencegah CSV Formula Injection saat file dibuka di Microsoft Excel / LibreOffice Calc.
 */
function sanitizeCsvCell(value: string): string {
  const trimmed = value ?? '';
  const needsPrefix = /^[=+\-@\t\r]/.test(trimmed);
  const safeValue = needsPrefix ? `'${trimmed}` : trimmed;
  const escaped = safeValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Mengubah daftar kunjungan menjadi string CSV berstandar UTF-8 (dengan BOM untuk Excel).
 */
export function buildGuestsCsv(visits: GuestVisit[]): string {
  const headers = [
    'Nomor Kunjungan',
    'Nama Lengkap',
    'Instansi',
    'Unit Tujuan',
    'Keperluan',
    'Nomor HP',
    'Waktu Masuk',
    'Waktu Keluar',
    'Status',
  ];

  const rows = visits.map((visit) => [
    sanitizeCsvCell(visit.id),
    sanitizeCsvCell(visit.nama_lengkap),
    sanitizeCsvCell(visit.instansi),
    sanitizeCsvCell(visit.unit_tujuan),
    sanitizeCsvCell(visit.keperluan),
    sanitizeCsvCell(visit.nomor_hp),
    sanitizeCsvCell(visit.waktu_masuk),
    sanitizeCsvCell(visit.waktu_keluar ?? '-'),
    sanitizeCsvCell(visit.waktu_keluar ? 'Selesai' : 'Sedang Berkunjung'),
  ]);

  const lines = [headers.map(sanitizeCsvCell).join(','), ...rows.map((r) => r.join(','))];
  return `\uFEFF${lines.join('\r\n')}`;
}

/**
 * Memicu unduhan file CSV daftar kunjungan di peramban.
 */
export function downloadGuestsCsv(
  visits: GuestVisit[],
  dateSuffix: string = getTodayDateString()
): { ok: boolean; filename: string; count: number; error?: string } {
  const filename = `rekap-buku-tamu-${dateSuffix || 'semua'}.csv`;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      ok: false,
      filename,
      count: 0,
      error: 'Fitur unduh CSV hanya dapat dijalankan pada peramban.',
    };
  }

  try {
    const csvContent = buildGuestsCsv(visits);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    return { ok: true, filename, count: visits.length };
  } catch {
    return {
      ok: false,
      filename,
      count: 0,
      error: 'Gagal menyiapkan berkas CSV untuk diunduh.',
    };
  }
}
