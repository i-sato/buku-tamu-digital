import type { GuestVisit } from '@/src/types/guest';

const STORAGE_KEY = 'etamu_kunjungan_v1';

function padTwo(value: number): string {
  return String(value).padStart(2, '0');
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${padTwo(now.getMonth() + 1)}-${padTwo(now.getDate())}`;
}

function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${padTwo(yesterday.getMonth() + 1)}-${padTwo(yesterday.getDate())}`;
}

/**
 * Data contoh awal (sample seed data) sesuai desain Stitch dan kepatuhan 8 kolom UU PDP.
 */
export function buildSampleVisits(): GuestVisit[] {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const year = new Date().getFullYear();

  return [
    {
      id: `BT-${year}-0142`,
      nama_lengkap: 'Budi Santoso, S.Kom.',
      instansi: 'PT Nusantara Sistem',
      unit_tujuan: 'Bidang Aplikasi Informatika',
      keperluan: 'Koordinasi integrasi sistem layanan publik',
      nomor_hp: '081234567890',
      waktu_masuk: `${today} 09:42:00`,
      waktu_keluar: null,
    },
    {
      id: `BT-${year}-0141`,
      nama_lengkap: 'Siti Rahmawati',
      instansi: 'Kelurahan Menteng Dalam',
      unit_tujuan: 'Bidang Layanan Informasi Publik',
      keperluan: 'Permohonan publikasi kegiatan sosialisasi warga',
      nomor_hp: '081345678901',
      waktu_masuk: `${today} 09:18:00`,
      waktu_keluar: null,
    },
    {
      id: `BT-${year}-0140`,
      nama_lengkap: 'Ahmad Fauzi, M.Si.',
      instansi: 'Inspektorat Daerah',
      unit_tujuan: 'Sekretariat',
      keperluan: 'Penyerahan berkas evaluasi kinerja triwulan',
      nomor_hp: '081122334455',
      waktu_masuk: `${today} 08:55:00`,
      waktu_keluar: `${today} 09:35:00`,
    },
    {
      id: `BT-${year}-0139`,
      nama_lengkap: 'Dewi Lestari',
      instansi: 'Universitas Negeri Jakarta',
      unit_tujuan: 'Bidang Layanan Informasi Publik',
      keperluan: 'Permintaan data statistik keterbukaan informasi untuk penelitian',
      nomor_hp: '085678901234',
      waktu_masuk: `${today} 08:20:00`,
      waktu_keluar: `${today} 09:10:00`,
    },
    {
      id: `BT-${year}-0138`,
      nama_lengkap: 'Rendra Pratama',
      instansi: 'Dinas Kesehatan Daerah',
      unit_tujuan: 'Bidang Persandian & Keamanan Siber',
      keperluan: 'Konsultasi sertifikat elektronik dan keamanan portal puskesmas',
      nomor_hp: '081987654321',
      waktu_masuk: `${today} 08:12:00`,
      waktu_keluar: null,
    },
    {
      id: `BT-${year}-0137`,
      nama_lengkap: 'Nadia Kusuma Putri',
      instansi: 'Masyarakat Umum',
      unit_tujuan: 'Bidang Layanan Informasi Publik',
      keperluan: 'Konsultasi pengajuan permohonan informasi publik PPID',
      nomor_hp: '082133445566',
      waktu_masuk: `${today} 08:05:00`,
      waktu_keluar: `${today} 08:40:00`,
    },
    {
      id: `BT-${year}-0136`,
      nama_lengkap: 'Hendra Wijaya, S.T.',
      instansi: 'CV Cipta Jaringan Mandiri',
      unit_tujuan: 'Bidang Aplikasi Informatika',
      keperluan: 'Pemeliharaan perangkat jaringan ruang server',
      nomor_hp: '081566778899',
      waktu_masuk: `${today} 07:50:00`,
      waktu_keluar: `${today} 09:00:00`,
    },
    {
      id: `BT-${year}-0135`,
      nama_lengkap: 'Ratna Sari Dewi',
      instansi: 'Badan Kepegawaian Daerah',
      unit_tujuan: 'Bagian Umum & Kepegawaian',
      keperluan: 'Koordinasi administrasi surat tugas pegawai',
      nomor_hp: '081799887766',
      waktu_masuk: `${today} 07:45:00`,
      waktu_keluar: `${today} 08:25:00`,
    },
    {
      id: `BT-${year}-0134`,
      nama_lengkap: 'Agus Salim',
      instansi: 'Kecamatan Tebet',
      unit_tujuan: 'Bidang Layanan Informasi Publik',
      keperluan: 'Pengambilan materi publikasi layanan terpadu',
      nomor_hp: '085211223344',
      waktu_masuk: `${yesterday} 14:30:00`,
      waktu_keluar: `${yesterday} 15:15:00`,
    },
    {
      id: `BT-${year}-0133`,
      nama_lengkap: 'Lestari Handayani, S.E.',
      instansi: 'Dinas Pendidikan',
      unit_tujuan: 'Sekretariat',
      keperluan: 'Koordinasi rapat lintas dinas penyusunan anggaran',
      nomor_hp: '081288990011',
      waktu_masuk: `${yesterday} 11:10:00`,
      waktu_keluar: `${yesterday} 12:05:00`,
    },
  ];
}

function isValidVisitRecord(item: unknown): item is GuestVisit {
  if (!item || typeof item !== 'object') return false;
  const record = item as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.nama_lengkap === 'string' &&
    typeof record.instansi === 'string' &&
    typeof record.unit_tujuan === 'string' &&
    typeof record.keperluan === 'string' &&
    typeof record.nomor_hp === 'string' &&
    typeof record.waktu_masuk === 'string' &&
    (record.waktu_keluar === null || typeof record.waktu_keluar === 'string')
  );
}

/**
 * Mengambil seluruh catatan kunjungan dari localStorage.
 * Jika belum ada data, sistem otomatis mengisi data contoh awal.
 */
export function getAllVisits(): GuestVisit[] {
  if (typeof window === 'undefined') {
    return buildSampleVisits();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildSampleVisits();
      saveAllVisits(seed);
      return seed;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const seed = buildSampleVisits();
      saveAllVisits(seed);
      return seed;
    }

    const validRecords = parsed.filter(isValidVisitRecord);
    return validRecords;
  } catch {
    return buildSampleVisits();
  }
}

const EMPTY_VISITS: GuestVisit[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedSortedVisits: GuestVisit[] = EMPTY_VISITS;

function notifyVisitListeners(): void {
  cachedRaw = null;
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Mendaftarkan listener perubahan data kunjungan (termasuk sinkronisasi antar tab).
 */
export function subscribeVisits(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      cachedRaw = null;
      listener();
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Snapshot stabil untuk React useSyncExternalStore pada sisi klien.
 */
export function getVisitsSnapshot(): GuestVisit[] {
  if (typeof window === 'undefined') {
    return EMPTY_VISITS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && raw === cachedRaw) {
      return cachedSortedVisits;
    }

    const visits = getAllVisits();
    const sorted = [...visits].sort((a, b) =>
      b.waktu_masuk.localeCompare(a.waktu_masuk)
    );
    cachedRaw = window.localStorage.getItem(STORAGE_KEY);
    cachedSortedVisits = sorted;
    return cachedSortedVisits;
  } catch {
    return EMPTY_VISITS;
  }
}

export function getServerVisitsSnapshot(): GuestVisit[] {
  return EMPTY_VISITS;
}

/**
 * Menyimpan seluruh array kunjungan ke localStorage dengan penanganan galat.
 */
export function saveAllVisits(visits: GuestVisit[]): { ok: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Penyimpanan peramban tidak tersedia di server.' };
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    notifyVisitListeners();
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Gagal menyimpan data ke penyimpanan peramban. Pastikan kapasitas localStorage tersedia dan tidak diblokir.',
    };
  }
}

/**
 * Menambahkan satu kunjungan baru di urutan teratas.
 */
export function insertVisit(visit: GuestVisit): { ok: boolean; error?: string } {
  const existing = getAllVisits();
  return saveAllVisits([visit, ...existing]);
}

/**
 * Memperbarui waktu keluar (check-out) berdasarkan ID kunjungan.
 */
export function updateVisitCheckout(
  id: string,
  waktuKeluar: string
): { ok: boolean; updated?: GuestVisit; error?: string } {
  const existing = getAllVisits();
  let updatedVisit: GuestVisit | undefined;

  const nextVisits = existing.map((visit) => {
    if (visit.id === id) {
      updatedVisit = {
        ...visit,
        waktu_keluar: waktuKeluar,
      };
      return updatedVisit;
    }
    return visit;
  });

  if (!updatedVisit) {
    return { ok: false, error: 'Catatan kunjungan tidak ditemukan.' };
  }

  const saved = saveAllVisits(nextVisits);
  if (!saved.ok) {
    return { ok: false, error: saved.error };
  }

  return { ok: true, updated: updatedVisit };
}

/**
 * Mengembalikan data kunjungan ke data contoh awal (khusus keperluan uji coba).
 */
export function resetVisitsToSample(): GuestVisit[] {
  const seed = buildSampleVisits();
  saveAllVisits(seed);
  return seed;
}
