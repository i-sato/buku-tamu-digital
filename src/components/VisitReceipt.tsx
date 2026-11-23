'use client';

import { CheckCircle2, Info } from 'lucide-react';
import {
  formatDateShortId,
  formatPhoneDisplay,
  formatTimeWib,
} from '@/src/services/guestService';
import type { GuestVisit } from '@/src/types/guest';

interface VisitReceiptProps {
  visit: GuestVisit;
  onRegisterAnother: () => void;
}

export default function VisitReceipt({
  visit,
  onRegisterAnother,
}: VisitReceiptProps) {
  return (
    <div className="w-full max-w-[640px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
      {/* Status Konfirmasi */}
      <section className="flex flex-col items-start gap-2">
        <span
          role="status"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-container text-on-success-container"
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="text-[11px] leading-[14px] font-semibold tracking-[0.3px]">
            Pendaftaran Tercatat
          </span>
        </span>
        <h2 className="font-headline text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-bold tracking-[-0.2px] text-primary text-balance">
          Terima kasih, data kunjungan Anda telah tersimpan.
        </h2>
      </section>

      {/* Kartu Utama Nomor Kunjungan & Jam Masuk */}
      <article className="rounded-[12px] border border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col">
        {/* Blok Biru Tua Resmi */}
        <div className="bg-primary text-on-primary p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-inverse-primary">
              Nomor Kunjungan
            </span>
            <p className="font-mono text-[24px] sm:text-[28px] leading-[32px] font-bold tracking-[0.5px] text-on-primary tabular-nums">
              {visit.id}
            </p>
          </div>

          <div className="border-t border-primary-container pt-4 grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-inverse-primary">
                Jam Masuk
              </span>
              <p className="font-mono text-[18px] leading-[24px] font-semibold text-on-primary tabular-nums">
                {formatTimeWib(visit.waktu_masuk, true)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-inverse-primary">
                Tanggal
              </span>
              <p className="text-[14px] leading-[20px] font-medium text-on-primary tabular-nums">
                {formatDateShortId(visit.waktu_masuk)}
              </p>
            </div>
          </div>
        </div>

        {/* Ringkasan Data Tamu */}
        <div className="p-4 sm:p-6 flex flex-col gap-3">
          <h3 className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface-variant">
            Ringkasan Identitas Tamu
          </h3>

          <dl className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-0.5 pb-2.5 border-b border-surface-container">
              <dt className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-on-surface-variant">
                Nama Lengkap
              </dt>
              <dd className="text-[16px] leading-[22px] font-semibold text-on-surface">
                {visit.nama_lengkap}
              </dd>
            </div>

            <div className="flex flex-col gap-0.5 pb-2.5 border-b border-surface-container">
              <dt className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-on-surface-variant">
                Instansi
              </dt>
              <dd className="text-[14px] leading-[20px] text-on-surface">
                {visit.instansi}
              </dd>
            </div>

            <div className="flex flex-col gap-0.5 pb-2.5 border-b border-surface-container">
              <dt className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-on-surface-variant">
                Nomor HP / WhatsApp
              </dt>
              <dd className="font-mono text-[14px] leading-[20px] text-on-surface tabular-nums">
                {formatPhoneDisplay(visit.nomor_hp)}
              </dd>
            </div>

            <div className="flex flex-col gap-0.5 pb-2.5 border-b border-surface-container">
              <dt className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-on-surface-variant">
                Unit Tujuan
              </dt>
              <dd className="text-[14px] leading-[20px] font-semibold text-primary">
                {visit.unit_tujuan}
              </dd>
            </div>

            <div className="flex flex-col gap-0.5">
              <dt className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-on-surface-variant">
                Keperluan
              </dt>
              <dd className="text-[14px] leading-[20px] text-on-surface text-pretty">
                {visit.keperluan}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      {/* Catatan Petugas */}
      <article className="rounded-[12px] bg-surface-container-low p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[12px] leading-[18px] tracking-[0.1px] text-on-surface-variant text-pretty">
          Tunjukkan nomor kunjungan di atas kepada petugas resepsionis saat
          memasuki ruang pelayanan.
        </p>
      </article>

      {/* Aksi Lanjutan */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onRegisterAnother}
          className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-[8px] border border-outline-variant bg-surface-container-lowest text-primary text-[14px] leading-[20px] font-semibold tracking-[0.1px] hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-100 cursor-pointer"
        >
          <span>Daftarkan Tamu Lain</span>
        </button>
      </div>
    </div>
  );
}
