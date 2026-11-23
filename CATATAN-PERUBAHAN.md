# Catatan Perubahan (CATATAN-PERUBAHAN.md)

Dokumentasi riwayat pembangunan dan pemeliharaan aplikasi web **Buku Tamu Digital (e-Tamu)** sesuai pedoman `AGENTS.md`.

---

## 2026-11-23 — Penyesuaian Validasi Formulir Buku Tamu

### Ringkasan Perubahan
Memperketat validasi formulir pendaftaran tamu agar seluruh 5 kolom wajib diisi dan kolom Nomor HP hanya menerima angka sebanyak 10–13 digit, dengan pesan kesalahan berbahasa Indonesia yang ditampilkan tepat di bawah kolom terkait (baik saat kolom ditinggalkan maupun saat tombol Kirim ditekan).

### File yang Diubah & Alasan
1. **`src/services/guestService.ts`** — Memperbarui `validateGuestInput` agar memeriksa seluruh kolom wajib diisi serta memvalidasi `nomor_hp` secara ketat hanya berupa digit angka (`/^\d+$/`) dengan panjang 10–13 digit dan pesan galat Bahasa Indonesia yang jelas.
2. **`src/components/GuestForm.tsx`** — Menambahkan validasi per kolom saat `onBlur` (memanggil `validateGuestInput` dari lapisan logika) serta menyesuaikan petunjuk/placeholder kolom Nomor HP menjadi format angka 10–13 digit tanpa mengubah bagian lain.

---

## 2026-11-23 — Pembangunan Awal Aplikasi Buku Tamu Digital (e-Tamu)

### Ringkasan Perubahan
Membangun aplikasi web **Buku Tamu Digital (e-Tamu)** dengan arsitektur tiga lapis (*Tampilan*, *Logika*, *Data*), kepatuhan minimalisasi data UU PDP (UU No. 27 Tahun 2022), autentikasi petugas berbasis hash di server, penyimpanan sementara `localStorage` dengan data contoh, serta sistem desain *Civic Minimalism* sesuai ekspor Google Stitch (`DESIGN.md`).

### Daftar File yang Dibuat / Diperbarui
1. **Konfigurasi & Sistem Desain**
   - `metadata.json`, `app/layout.tsx`, `app/globals.css`, `.env.example`
   - *Alasan:* Menetapkan identitas aplikasi, palet warna Biru Tua Institusional (`#00183B`, `#0F2D59`), tipografi (*Red Hat Text*, *Instrument Sans*, *Spline Sans Mono*), serta deklarasi variabel lingkungan kredensial petugas tanpa menaruh rahasia di kode.
2. **Model Data & Lapisan Data**
   - `src/types/guest.ts`
   - `src/storage/guestStorage.ts`
   - *Alasan:* Menerapkan model data 8 kolom sesuai `ARSITEKTUR.md` (tanpa NIK/KTP, alamat rumah, maupun foto wajah), operasi baca/tulis `localStorage` dengan penanganan galat, serta data contoh awal dari desain Stitch.
3. **Lapisan Logika & Keamanan Server**
   - `src/services/guestService.ts`
   - `src/services/exportService.ts`
   - `src/services/authService.ts`
   - `src/server/authStore.ts`
   - `app/api/auth/{status,setup,login,session,logout}/route.ts`
   - *Alasan:* Memisahkan logika validasi, sanitasi XSS, pembuatan ID berurutan (`BT-YYYY-XXXX`), cap waktu masuk/keluar otomatis (WIB), ekspor CSV aman (UTF-8 BOM + mitigasi *formula injection*), dan autentikasi petugas berbasis `scrypt` tanpa kredensial tertanam di kode.
4. **Lapisan Tampilan**
   - `src/components/AppHeader.tsx`, `src/components/AppFooter.tsx`, `src/components/PrivacyNotice.tsx`
   - `src/components/GuestForm.tsx`, `src/components/VisitReceipt.tsx`
   - `src/components/LoginForm.tsx`, `src/components/Dashboard.tsx`
   - `src/components/ETamuApp.tsx`, `app/page.tsx`
   - *Alasan:* Mewujudkan layar Formulir Buku Tamu, Bukti Kunjungan, Login/Aktivasi Petugas, dan Dashboard Petugas sesuai desain Stitch dengan tata letak *mobile-first* yang responsif hingga layar desktop.
