import { ShieldCheck } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <aside
      aria-label="Pemberitahuan privasi data pribadi"
      className="rounded-[12px] border border-outline-variant/70 bg-surface-container-low p-4 flex items-start gap-3"
    >
      <ShieldCheck
        className="w-5 h-5 text-primary shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-primary">
          Pemberitahuan Privasi Data (UU No. 27 Tahun 2022 tentang PDP)
        </h3>
        <p className="text-[12px] leading-[18px] text-on-surface-variant text-pretty">
          Layanan ini menerapkan prinsip minimalisasi data pribadi. Kami hanya
          mencatat lima data kunjungan di atas dan tidak meminta maupun menyimpan
          NIK/KTP, alamat rumah lengkap, atau foto wajah. Riwayat kunjungan hanya
          dapat diakses oleh petugas resmi instansi.
        </p>
      </div>
    </aside>
  );
}
