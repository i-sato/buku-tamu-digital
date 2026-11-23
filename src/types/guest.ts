/**
 * Model data catatan kunjungan tamu (8 kolom sesuai ARSITEKTUR.md dan kepatuhan UU PDP).
 * Sistem dilarang meminta atau menyimpan NIK/KTP, alamat rumah, maupun foto wajah.
 */
export interface GuestVisit {
  id: string;
  nama_lengkap: string;
  instansi: string;
  unit_tujuan: string;
  keperluan: string;
  nomor_hp: string;
  waktu_masuk: string;
  waktu_keluar: string | null;
}

export interface GuestFormInput {
  nama_lengkap: string;
  instansi: string;
  nomor_hp: string;
  unit_tujuan: string;
  keperluan: string;
}

export interface GuestFormErrors {
  nama_lengkap?: string;
  instansi?: string;
  nomor_hp?: string;
  unit_tujuan?: string;
  keperluan?: string;
  general?: string;
}

export type VisitStatusFilter = 'semua' | 'aktif' | 'selesai';

export interface GuestFilter {
  search: string;
  unitTujuan: string;
  status: VisitStatusFilter;
  tanggal: string; // format YYYY-MM-DD atau '' untuk semua tanggal
}

export interface UnitDistributionItem {
  unit: string;
  labelSingkat: string;
  jumlah: number;
  persentase: number;
}

export interface DashboardStats {
  totalHariIni: number;
  sedangBerkunjung: number;
  selesaiHariIni: number;
  unitTerpadat: {
    nama: string;
    labelSingkat: string;
    jumlah: number;
    persentase: number;
  } | null;
  distribusiUnit: UnitDistributionItem[];
}

export interface AuthSession {
  token: string;
  username: string;
  namaPetugas: string;
}

export interface AuthStatusResponse {
  initialized: boolean;
  configuredViaEnv: boolean;
}
