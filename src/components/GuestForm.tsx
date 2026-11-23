'use client';

import { AlertCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import PrivacyNotice from '@/src/components/PrivacyNotice';
import {
  UNIT_TUJUAN_LIST,
  validateGuestInput,
} from '@/src/services/guestService';
import type { GuestFormErrors, GuestFormInput } from '@/src/types/guest';

interface GuestFormProps {
  onSubmitForm: (input: GuestFormInput) => { ok: boolean; errors?: GuestFormErrors };
}

const INITIAL_FORM: GuestFormInput = {
  nama_lengkap: '',
  instansi: '',
  nomor_hp: '',
  unit_tujuan: '',
  keperluan: '',
};

export default function GuestForm({ onSubmitForm }: GuestFormProps) {
  const [formData, setFormData] = useState<GuestFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<GuestFormErrors>({});

  function handleChange<K extends keyof GuestFormInput>(
    field: K,
    value: GuestFormInput[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  }

  function handleBlur<K extends keyof GuestFormInput>(field: K) {
    const fieldErrors = validateGuestInput(formData);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onSubmitForm(formData);
    if (!result.ok) {
      setErrors(result.errors ?? { general: 'Periksa kembali isian formulir Anda.' });
      return;
    }
    setFormData(INITIAL_FORM);
    setErrors({});
  }

  return (
    <div className="w-full max-w-[640px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
      <section className="flex flex-col gap-1.5">
        <h2 className="font-headline text-[24px] sm:text-[28px] leading-[30px] sm:leading-[34px] font-bold tracking-[-0.2px] text-primary text-balance">
          Pendaftaran Tamu
        </h2>
        <p className="text-[14px] leading-[20px] text-on-surface-variant text-pretty">
          Silakan lengkapi data kunjungan Anda untuk mendapatkan nomor antrean dan
          tanda masuk resmi.
        </p>
      </section>

      <article className="rounded-[12px] border border-outline-variant bg-surface-container-lowest p-4 sm:p-6 flex flex-col gap-5">
        {errors.general && (
          <div
            role="alert"
            className="rounded-[8px] bg-error-container text-on-error-container px-3 py-2.5 flex items-start gap-2.5 text-[13px] leading-[18px]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Nama Lengkap */}
          <label className="flex flex-col gap-1 w-full">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
              Nama Lengkap <span className="text-error" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="nama_lengkap"
              autoComplete="name"
              required
              maxLength={100}
              value={formData.nama_lengkap}
              onChange={(e) => handleChange('nama_lengkap', e.target.value)}
              onBlur={() => handleBlur('nama_lengkap')}
              placeholder="Contoh: Budi Santoso, S.Kom."
              aria-invalid={Boolean(errors.nama_lengkap)}
              aria-describedby="nama-hint nama-error"
              className={`w-full min-h-[44px] px-3 py-2 rounded-[8px] border bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 transition-colors duration-100 ${
                errors.nama_lengkap
                  ? 'border-error focus:border-error focus:ring-error'
                  : 'border-outline-variant focus:border-primary focus:ring-primary'
              }`}
            />
            {errors.nama_lengkap ? (
              <span
                id="nama-error"
                role="alert"
                className="text-[12px] leading-[18px] text-error"
              >
                {errors.nama_lengkap}
              </span>
            ) : (
              <span
                id="nama-hint"
                className="text-[12px] leading-[18px] tracking-[0.1px] text-on-surface-variant"
              >
                Sesuai KTP atau kartu identitas resmi.
              </span>
            )}
          </label>

          {/* Instansi / Asal Lembaga */}
          <label className="flex flex-col gap-1 w-full">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
              Instansi / Asal Lembaga{' '}
              <span className="text-error" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="instansi"
              autoComplete="organization"
              required
              maxLength={120}
              value={formData.instansi}
              onChange={(e) => handleChange('instansi', e.target.value)}
              onBlur={() => handleBlur('instansi')}
              placeholder="Contoh: PT Nusantara Sistem / Masyarakat Umum"
              aria-invalid={Boolean(errors.instansi)}
              aria-describedby={errors.instansi ? 'instansi-error' : undefined}
              className={`w-full min-h-[44px] px-3 py-2 rounded-[8px] border bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 transition-colors duration-100 ${
                errors.instansi
                  ? 'border-error focus:border-error focus:ring-error'
                  : 'border-outline-variant focus:border-primary focus:ring-primary'
              }`}
            />
            {errors.instansi && (
              <span
                id="instansi-error"
                role="alert"
                className="text-[12px] leading-[18px] text-error"
              >
                {errors.instansi}
              </span>
            )}
          </label>

          {/* Nomor HP / WhatsApp */}
          <label className="flex flex-col gap-1 w-full">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
              Nomor HP / WhatsApp{' '}
              <span className="text-error" aria-hidden="true">*</span>
            </span>
            <div className="relative flex items-center">
              <Phone
                aria-hidden="true"
                className="w-4 h-4 text-on-surface-variant absolute left-3 pointer-events-none"
              />
              <input
                type="tel"
                name="nomor_hp"
                inputMode="numeric"
                autoComplete="tel"
                required
                maxLength={20}
                value={formData.nomor_hp}
                onChange={(e) => handleChange('nomor_hp', e.target.value)}
                onBlur={() => handleBlur('nomor_hp')}
                placeholder="Contoh: 081234567890"
                aria-invalid={Boolean(errors.nomor_hp)}
                aria-describedby="hp-hint hp-error"
                className={`w-full min-h-[44px] pl-10 pr-3 py-2 rounded-[8px] border bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 transition-colors duration-100 tabular-nums ${
                  errors.nomor_hp
                    ? 'border-error focus:border-error focus:ring-error'
                    : 'border-outline-variant focus:border-primary focus:ring-primary'
                }`}
              />
            </div>
            {errors.nomor_hp ? (
              <span
                id="hp-error"
                role="alert"
                className="text-[12px] leading-[18px] text-error"
              >
                {errors.nomor_hp}
              </span>
            ) : (
              <span
                id="hp-hint"
                className="text-[12px] leading-[18px] tracking-[0.1px] text-on-surface-variant"
              >
                Hanya angka, 10–13 digit.
              </span>
            )}
          </label>

          {/* Unit Tujuan */}
          <label className="flex flex-col gap-1 w-full">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
              Unit Tujuan <span className="text-error" aria-hidden="true">*</span>
            </span>
            <select
              name="unit_tujuan"
              required
              value={formData.unit_tujuan}
              onChange={(e) => handleChange('unit_tujuan', e.target.value)}
              onBlur={() => handleBlur('unit_tujuan')}
              aria-invalid={Boolean(errors.unit_tujuan)}
              aria-describedby={errors.unit_tujuan ? 'unit-error' : undefined}
              className={`w-full min-h-[44px] px-3 py-2 rounded-[8px] border bg-surface-container-lowest text-[14px] leading-[20px] focus:outline-none focus:ring-1 transition-colors duration-100 ${
                formData.unit_tujuan ? 'text-on-surface' : 'text-outline'
              } ${
                errors.unit_tujuan
                  ? 'border-error focus:border-error focus:ring-error'
                  : 'border-outline-variant focus:border-primary focus:ring-primary'
              }`}
            >
              <option value="" disabled>
                Pilih unit atau bidang tujuan
              </option>
              {UNIT_TUJUAN_LIST.map((unit) => (
                <option key={unit.value} value={unit.value} className="text-on-surface">
                  {unit.label}
                </option>
              ))}
            </select>
            {errors.unit_tujuan && (
              <span
                id="unit-error"
                role="alert"
                className="text-[12px] leading-[18px] text-error"
              >
                {errors.unit_tujuan}
              </span>
            )}
          </label>

          {/* Keperluan Kunjungan */}
          <label className="flex flex-col gap-1 w-full">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.2px] text-on-surface">
              Keperluan Kunjungan{' '}
              <span className="text-error" aria-hidden="true">*</span>
            </span>
            <textarea
              name="keperluan"
              rows={3}
              required
              maxLength={300}
              value={formData.keperluan}
              onChange={(e) => handleChange('keperluan', e.target.value)}
              onBlur={() => handleBlur('keperluan')}
              placeholder="Tuliskan maksud kunjungan Anda secara singkat dan jelas"
              aria-invalid={Boolean(errors.keperluan)}
              aria-describedby={errors.keperluan ? 'keperluan-error' : undefined}
              className={`w-full px-3 py-2 rounded-[8px] border bg-surface-container-lowest text-[14px] leading-[20px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 transition-colors duration-100 resize-y ${
                errors.keperluan
                  ? 'border-error focus:border-error focus:ring-error'
                  : 'border-outline-variant focus:border-primary focus:ring-primary'
              }`}
            />
            {errors.keperluan && (
              <span
                id="keperluan-error"
                role="alert"
                className="text-[12px] leading-[18px] text-error"
              >
                {errors.keperluan}
              </span>
            )}
          </label>

          {/* Tombol Kirim */}
          <button
            type="submit"
            className="mt-1 w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-[8px] bg-primary text-on-primary text-[14px] leading-[20px] font-semibold tracking-[0.1px] hover:bg-primary-container active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-100 cursor-pointer"
          >
            <span>Kirim</span>
          </button>
        </form>
      </article>

      <PrivacyNotice />
    </div>
  );
}
