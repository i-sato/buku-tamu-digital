# AGENTS.md — Pedoman Pengembangan Buku Tamu Digital (e-Tamu)

Dokumen ini adalah aturan baku yang **wajib diikuti** oleh agen AI saat membangun, memodifikasi, dan merawat aplikasi web **Buku Tamu Digital (e-Tamu)** instansi pemerintah.

---

## 1. Konteks Proyek
* **Tujuan:** Menggantikan buku tamu kertas di pos keamanan/layanan kantor dengan aplikasi web *mobile-first* untuk mempercepat pencatatan, menjamin keterbacaan data, dan mempermudah rekapitulasi laporan.
* **Pengguna:**
  1. **Tamu:** Mengisi formulir kunjungan mandiri (*walk-in*) via HP/tablet pos.
  2. **Petugas/Admin:** *Login* ke dasbor untuk memantau tamu aktif, memperbarui status pulang (*check-out*), mencari riwayat, dan mengunduh laporan CSV/Excel.
* **Di Luar Cakupan (*Out of Scope*):** Reservasi jadwal (*appointment*), notifikasi WA/Email pegawai, integrasi perangkat keras (printer kartu, *OCR scanner*, *barrier gate*), integrasi SIMPEG, dan survei kepuasan (SKM).

---

## 2. Arsitektur & Struktur Kode
Gunakan **React** dengan pemisahan 3 lapisan ketat (**Satu File = Satu Tanggung Jawab**):
* **`src/components/` (Tampilan):** Hanya menangani UI dan interaksi pengguna (`GuestForm.jsx`, `LoginForm.jsx`, `Dashboard.jsx`, `PrivacyNotice.jsx`). Dilarang menaruh logika bisnis atau akses penyimpanan langsung di sini.
* **`src/services/` (Logika):** Validasi input, pembuatan ID unik & *timestamp* otomatis, filter data, autentikasi, dan ekspor CSV (`guestService.js`, `authService.js`, `exportService.js`).
* **`src/storage/` (Data):** Operasi baca/tulis data ke penyimpanan (`guestStorage.js`).
* **Model Data Kunjungan (8 Kolom Wajib/Opsional):** `id` (unik, otomatis), `nama_lengkap` (wajib), `instansi` (wajib), `unit_tujuan` (wajib), `keperluan` (wajib), `nomor_hp` (wajib), `waktu_masuk` (*timestamp* otomatis), dan `waktu_keluar` (*timestamp* saat pulang, default `null`).

---

## 3. Aturan Desain (*Civic Minimalism*)
* **Palet Warna:** Biru Tua Institusional sebagai identitas utama (`#00183B` *Primary*, `#0F2D59` *Primary Container*), latar bersih (`#FAF9FD` *Surface*, `#FFFFFF` kartu), batas halus (`#C4C6D0`), dan hijau status aktif (`#146C2E` pada latar `#E6F4EA`).
* **Tipografi:** *Red Hat Text* (judul tegas), *Instrument Sans* (label & isi form), dan *Spline Sans Mono* (`tabular-nums` untuk kode kunjungan `BT-YYYY-XXXX` dan waktu `HH:mm WIB`).
* **Tata Letak & Bentuk:** *Mobile-first* (mulai lebar `360px`, *gutter* kelipatan `4px`/`8px`), sudut membulat `8px` (input/tombol), `12px` (kartu), dan `full` (*badge*). Transisi cepat (`100ms`–`220ms`) tanpa animasi dekoratif.
* **Bahasa UI:** Bahasa Indonesia baku (EYD V), nada resmi dan sopan, *sentence case* untuk label/bantuan, serta tombol aksi yang lugas (*Kirim*, *Selesai / Keluar*, *Unduh CSV*).

---

## 4. Keamanan & Data Pribadi (Kepatuhan UU PDP)
* **Minimalisasi Data (UU No. 27/2022):** Sistem **HANYA** boleh mengumpulkan 5 input tamu (`nama_lengkap`, `instansi`, `unit_tujuan`, `keperluan`, `nomor_hp`).
* **Data Terlarang:** **DILARANG KERAS** meminta atau menyimpan NIK/KTP, alamat rumah lengkap, maupun foto wajah/*selfie*. Wajib tampilkan `PrivacyNotice.jsx` di bawah formulir.
* **Keamanan Kode & Akses:**
  * **Nol Kredensial di Kode:** Dilarang menulis *API key*, URL *database*, atau *password* di dalam kode sumber; gunakan variabel lingkungan (`.env`).
  * Riwayat kunjungan hanya dapat diakses oleh Petugas yang sudah *login*; tamu tidak boleh bisa melihat data tamu lain.

---

## 5. Standar Kualitas (ISO/IEC 25010)
1. **Fungsionalitas (*Functional Suitability*):** Seluruh fitur prioritas *Must Have* (input tamu, *login*, dasbor *real-time*, *timestamp* masuk/keluar otomatis, ekspor laporan) berfungsi akurat tanpa melanggar batasan data.
2. **Kemudahan Penggunaan (*Usability*):** Antarmuka ramah jari (*touch-friendly*) di layar HP tanpa *scroll* horizontal, dan kolom `nomor_hp` wajib memicu *keyboard* numerik (`type="tel"` / `inputMode="numeric"`).
3. **Keamanan (*Security*):** Validasi dan sanitasi seluruh input formulir untuk mencegah injeksi skrip (XSS), perlindungan rute dasbor, serta penyimpanan *password* berbasis *hash*.
4. **Keandalan (*Reliability*):** Penanganan galat (*error handling*) yang jelas jika penyimpanan gagal atau input kosong agar aplikasi tidak *crash* saat jam sibuk.
5. **Pemeliharaan (*Maintainability*):** Kode modular, penamaan fungsi/variabel deskriptif dalam Bahasa Indonesia/Inggris yang konsisten, serta bebas kode mati (*dead code*).

---

## 6. Cara Kerja Agen AI
* **Bertahap (Satu Fitur per Langkah):** Bangun, uji, dan selesaikan satu komponen atau satu fitur secara utuh sebelum berpindah ke fitur berikutnya.
* **Dokumentasi Wajib:** Setiap kali menyelesaikan pembuatan fitur, perbaikan *bug*, atau perubahan struktur, **wajib** mencatat ringkasan perubahan (tanggal, fitur/file yang diubah, dan alasan) ke dalam file `CATATAN-PERUBAHAN.md`.