import {
  getAllVisits,
  getServerVisitsSnapshot,
  getTodayDateString,
  getVisitsSnapshot,
  insertVisit,
  resetVisitsToSample,
  subscribeVisits,
  updateVisitCheckout,
} from '@/src/storage/guestStorage';
import type {
  DashboardStats,
  GuestFilter,
  GuestFormErrors,
  GuestFormInput,
  GuestVisit,
  UnitDistributionItem,
} from '@/src/types/guest';

export interface UnitOption {
  value: string;
  label: string;
  shortLabel: string;
}

export const UNIT_TUJUAN_LIST: UnitOption[] = [
  {
    value: 'Bidang Layanan Informasi Publik',
    label: 'Bidang Layanan Informasi Publik',
    shortLabel: 'Layanan Informasi Publik',
  },
  {
    value: 'Bidang Aplikasi Informatika',
    label: 'Bidang Aplikasi Informatika',
    shortLabel: 'Aplikasi Informatika',
  },
  {
    value: 'Sekretariat',
    label: 'Sekretariat',
    shortLabel: 'Sekretariat',
  },
  {
    value: 'Bidang Persandian & Keamanan Siber',
    label: 'Bidang Persandian & Keamanan Siber',
    shortLabel: 'Persandian & Keamanan Siber',
  },
  {
    value: 'Bagian Umum & Kepegawaian',
    label: 'Bagian Umum & Kepegawaian',
    shortLabel: 'Bagian Umum & Kepegawaian',
  },
];

const BULAN_SINGKAT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const HARI_INDONESIA = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

function padTwo(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Sanitasi teks input untuk mencegah tag HTML dan karakter kontrol berbahaya.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Membersihkan nomor HP agar hanya menyimpan digit angka.
 */
export function normalizePhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Memformat nomor HP Indonesia agar mudah dibaca (contoh: 0812-3456-7890).
 */
export function formatPhoneDisplay(digits: string): string {
  const clean = normalizePhoneNumber(digits);
  if (clean.length <= 4) return clean;
  if (clean.length <= 8) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
}

/**
 * Menghasilkan cap waktu lokal berformat YYYY-MM-DD HH:mm:ss.
 */
export function formatTimestampNow(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = padTwo(date.getMonth() + 1);
  const d = padTwo(date.getDate());
  const hh = padTwo(date.getHours());
  const mm = padTwo(date.getMinutes());
  const ss = padTwo(date.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

/**
 * Mengambil jam berformat HH:mm WIB dari cap waktu YYYY-MM-DD HH:mm:ss.
 */
export function formatTimeWib(timestamp: string, withZone = true): string {
  const parts = timestamp.split(' ');
  const timePart = parts[1] ?? '00:00:00';
  const hhmm = timePart.slice(0, 5);
  return withZone ? `${hhmm} WIB` : hhmm;
}

/**
 * Mengambil tanggal berformat "23 Nov 2026" dari cap waktu YYYY-MM-DD HH:mm:ss.
 */
export function formatDateShortId(timestamp: string): string {
  const datePart = timestamp.split(' ')[0];
  const [yearStr, monthStr, dayStr] = datePart.split('-');
  const monthIdx = Number(monthStr) - 1;
  const dayNum = Number(dayStr);
  if (!yearStr || Number.isNaN(monthIdx) || Number.isNaN(dayNum)) {
    return datePart;
  }
  return `${dayNum} ${BULAN_SINGKAT[monthIdx] ?? monthStr} ${yearStr}`;
}

/**
 * Mengambil tanggal hari ini lengkap dengan nama hari (contoh: "Senin, 23 Nov 2026").
 */
export function formatTodayFullId(date: Date = new Date()): string {
  const dayName = HARI_INDONESIA[date.getDay()];
  const dayNum = date.getDate();
  const monthName = BULAN_SINGKAT[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Memperoleh label singkat unit tujuan untuk grafik dan ringkasan.
 */
export function getUnitShortLabel(unit: string): string {
  const found = UNIT_TUJUAN_LIST.find((u) => u.value === unit);
  return found ? found.shortLabel : unit;
}

/**
 * Validasi 5 kolom wajib tamu sesuai standar UU PDP dan aturan kualitas.
 */
export function validateGuestInput(input: GuestFormInput): GuestFormErrors {
  const errors: GuestFormErrors = {};

  const nama = sanitizeText(input.nama_lengkap);
  const instansi = sanitizeText(input.instansi);
  const nomorHpRaw = input.nomor_hp.trim();
  const unitTujuan = sanitizeText(input.unit_tujuan);
  const keperluan = sanitizeText(input.keperluan);

  if (!nama) {
    errors.nama_lengkap = 'Nama lengkap wajib diisi.';
  } else if (nama.length > 100) {
    errors.nama_lengkap = 'Nama lengkap maksimal 100 karakter.';
  }

  if (!instansi) {
    errors.instansi = 'Instansi atau asal lembaga wajib diisi.';
  } else if (instansi.length > 120) {
    errors.instansi = 'Instansi maksimal 120 karakter.';
  }

  if (!nomorHpRaw) {
    errors.nomor_hp = 'Nomor HP / WhatsApp wajib diisi.';
  } else if (!/^\d+$/.test(nomorHpRaw)) {
    errors.nomor_hp = 'Nomor HP hanya boleh berisi angka.';
  } else if (nomorHpRaw.length < 10 || nomorHpRaw.length > 13) {
    errors.nomor_hp = 'Nomor HP harus terdiri atas 10–13 digit angka.';
  }

  const allowedUnits = new Set(UNIT_TUJUAN_LIST.map((u) => u.value));
  if (!unitTujuan || !allowedUnits.has(unitTujuan)) {
    errors.unit_tujuan = 'Unit tujuan wajib dipilih.';
  }

  if (!keperluan) {
    errors.keperluan = 'Keperluan kunjungan wajib diisi.';
  } else if (keperluan.length > 300) {
    errors.keperluan = 'Keperluan kunjungan maksimal 300 karakter.';
  }

  return errors;
}

/**
 * Menghasilkan nomor kunjungan berurutan dengan format BT-YYYY-XXXX.
 */
function generateNextVisitId(existingVisits: GuestVisit[]): string {
  const year = new Date().getFullYear();
  const prefix = `BT-${year}-`;
  let maxNumber = 142;

  for (const visit of existingVisits) {
    if (visit.id.startsWith(prefix)) {
      const numPart = Number.parseInt(visit.id.slice(prefix.length), 10);
      if (!Number.isNaN(numPart) && numPart > maxNumber) {
        maxNumber = numPart;
      }
    }
  }

  return `${prefix}${String(maxNumber + 1).padStart(4, '0')}`;
}

/**
 * Mendaftarkan kunjungan tamu baru: validasi, sanitasi, ID unik, dan cap waktu otomatis.
 */
export function registerGuest(input: GuestFormInput): {
  ok: boolean;
  visit?: GuestVisit;
  errors?: GuestFormErrors;
} {
  const errors = validateGuestInput(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const existing = getAllVisits();
  const newVisit: GuestVisit = {
    id: generateNextVisitId(existing),
    nama_lengkap: sanitizeText(input.nama_lengkap),
    instansi: sanitizeText(input.instansi),
    unit_tujuan: sanitizeText(input.unit_tujuan),
    keperluan: sanitizeText(input.keperluan),
    nomor_hp: normalizePhoneNumber(input.nomor_hp),
    waktu_masuk: formatTimestampNow(),
    waktu_keluar: null,
  };

  const saved = insertVisit(newVisit);
  if (!saved.ok) {
    return {
      ok: false,
      errors: {
        general: saved.error ?? 'Terjadi kendala saat menyimpan pendaftaran.',
      },
    };
  }

  return { ok: true, visit: newVisit };
}

/**
 * Mengambil seluruh daftar kunjungan diurutkan dari yang terbaru.
 */
export function listGuests(): GuestVisit[] {
  const visits = getAllVisits();
  return [...visits].sort((a, b) => b.waktu_masuk.localeCompare(a.waktu_masuk));
}

/**
 * Mencatat jam pulang (check-out) tamu secara otomatis saat petugas menekan Selesai / Keluar.
 */
export function checkoutGuest(id: string): {
  ok: boolean;
  visit?: GuestVisit;
  error?: string;
} {
  const waktuKeluar = formatTimestampNow();
  const result = updateVisitCheckout(id, waktuKeluar);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true, visit: result.updated };
}

/**
 * Menyaring daftar tamu berdasarkan kata kunci pencarian, unit tujuan, status, dan tanggal.
 */
export function filterGuests(visits: GuestVisit[], filter: GuestFilter): GuestVisit[] {
  const keyword = sanitizeText(filter.search).toLowerCase();

  return visits.filter((visit) => {
    if (filter.tanggal && !visit.waktu_masuk.startsWith(filter.tanggal)) {
      return false;
    }

    if (filter.unitTujuan && visit.unit_tujuan !== filter.unitTujuan) {
      return false;
    }

    if (filter.status === 'aktif' && visit.waktu_keluar !== null) {
      return false;
    }

    if (filter.status === 'selesai' && visit.waktu_keluar === null) {
      return false;
    }

    if (keyword) {
      const searchable = [
        visit.id,
        visit.nama_lengkap,
        visit.instansi,
        visit.unit_tujuan,
        visit.keperluan,
        visit.nomor_hp,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Menghitung ringkasan statistik hari ini dan distribusi kunjungan per unit tujuan.
 */
export function getDashboardStats(
  visits: GuestVisit[],
  referenceDate: string = getTodayDateString()
): DashboardStats {
  const todayVisits = visits.filter((v) => v.waktu_masuk.startsWith(referenceDate));
  const totalHariIni = todayVisits.length;
  const sedangBerkunjung = todayVisits.filter((v) => v.waktu_keluar === null).length;
  const selesaiHariIni = totalHariIni - sedangBerkunjung;

  const counts = new Map<string, number>();
  for (const unit of UNIT_TUJUAN_LIST) {
    counts.set(unit.value, 0);
  }

  for (const visit of todayVisits) {
    counts.set(visit.unit_tujuan, (counts.get(visit.unit_tujuan) ?? 0) + 1);
  }

  const distribusiUnit: UnitDistributionItem[] = UNIT_TUJUAN_LIST.map((unit) => {
    const jumlah = counts.get(unit.value) ?? 0;
    const persentase = totalHariIni > 0 ? Math.round((jumlah / totalHariIni) * 100) : 0;
    return {
      unit: unit.value,
      labelSingkat: unit.shortLabel,
      jumlah,
      persentase,
    };
  }).sort((a, b) => b.jumlah - a.jumlah);

  const top = distribusiUnit[0];
  const unitTerpadat =
    top && top.jumlah > 0
      ? {
          nama: top.unit,
          labelSingkat: top.labelSingkat,
          jumlah: top.jumlah,
          persentase: top.persentase,
        }
      : null;

  return {
    totalHariIni,
    sedangBerkunjung,
    selesaiHariIni,
    unitTerpadat,
    distribusiUnit,
  };
}

/**
 * Mengembalikan data kunjungan di localStorage ke data contoh awal.
 */
export function resetSampleGuests(): GuestVisit[] {
  return resetVisitsToSample();
}

export {
  getServerVisitsSnapshot,
  getTodayDateString,
  getVisitsSnapshot,
  subscribeVisits,
};
