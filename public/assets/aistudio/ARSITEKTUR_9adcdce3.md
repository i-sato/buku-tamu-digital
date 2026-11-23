# Dokumen Arsitektur Sistem (ARSITEKTUR.md)

**Nama Sistem:** Aplikasi Web Buku Tamu Digital (e-Tamu)  
**Teknologi Utama:** React (Aplikasi Web)  
**Referensi:** `KEBUTUHAN.md`  

Dokumen ini menjelaskan "cetak biru" (rancangan teknis) bagaimana aplikasi e-Tamu disusun agar mudah dibangun, dirawat, dan aman digunakan.

---

## 1. Pembagian Lapisan Aplikasi

Bayangkan aplikasi ini seperti sebuah **kantor pelayanan tamu fisik** yang dibagi menjadi tiga ruangan utama dengan tugas masing-masing agar tidak saling tumpang tindih:

| Nama Lapisan | Nama Folder | Analogi & Tugas Utama |
| :--- | :--- | :--- |
| **1. Lapisan Tampilan** | `components/` | **Analogi: Meja Resepsionis & Papan Informasi.**<br>Bagian yang dilihat dan disentuh langsung oleh pengguna di layar HP atau komputer (kotak isian nama, tombol kirim, tabel daftar tamu). Lapisan ini *tidak boleh* memikirkan cara menyimpan data atau menghitung laporan. |
| **2. Lapisan Logika** | `services/` | **Analogi: Kepala Tata Usaha / Koordinator.**<br>Otak yang memproses aturan kantor. Misalnya: memastikan nomor HP hanya berisi angka, mencatat jam masuk otomatis saat tombol ditekan, menyaring data berdasarkan tanggal, dan mengubah data menjadi file Excel/CSV. |
| **3. Lapisan Data** | `storage/` | **Analogi: Lemari Arsip.**<br>Tempat penyimpanan dan pengambilan data kunjungan (bisa berupa penyimpanan sementara di *browser* atau terhubung ke *database* server). Lapisan ini hanya bertugas menyimpan, mengambil, dan memperbarui catatan. |

---

## 2. Struktur Folder dan File yang Diusulkan

Berikut adalah susunan "lemari dan map" tempat kode program disimpan agar pengembang mudah menemukan bagian yang ingin diperbaiki:

```text
e-tamu-app/
├── .env.example              # Contoh daftar pengaturan rahasia (tanpa isi asli)
├── src/
│   ├── components/           # [LAPISAN TAMPILAN] Semua elemen layar
│   │   ├── GuestForm.jsx     # Formulir pendaftaran untuk tamu
│   │   ├── LoginForm.jsx     # Halaman masuk (login) untuk petugas
│   │   ├── Dashboard.jsx     # Halaman utama petugas (ringkasan & tabel tamu)
│   │   └── PrivacyNotice.jsx # Teks pemberitahuan privasi (UU PDP) di bawah form
│   │
│   ├── services/             # [LAPISAN LOGIKA] Aturan dan pemrosesan data
│   │   ├── guestService.js   # Mengatur proses daftar masuk, keluar, dan cari tamu
│   │   ├── authService.js    # Mengecek kebenaran username & password petugas
│   │   └── exportService.js  # Mengubah daftar tamu menjadi file unduhan Excel/CSV
│   │
│   ├── storage/              # [LAPISAN DATA] Penghubung ke tempat penyimpanan
│   │   └── guestStorage.js   # Menyimpan & membaca data tamu dari database/browser
│   │
│   ├── App.jsx               # Pengatur lalu lintas halaman (halaman tamu vs halaman admin)
│   └── main.jsx              # Titik awal aplikasi dijalankan
```

---

## 3. Model Data (Struktur Catatan Kunjungan)

Sesuai dengan batasan **UU PDP** pada `KEBUTUHAN.md` (tanpa NIK, alamat rumah, maupun foto), setiap satu kali kunjungan tamu hanya akan menyimpan **8 informasi** berikut:

| Nama Kolom (Teknis) | Keterangan | Tipe Data | Wajib Diisi? | Contoh Isi |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Nomor unik otomatis tiap kunjungan | Teks / ID Unik | **Wajib** *(Otomatis)* | `"kunjungan-20261123-001"` |
| `nama_lengkap` | Nama pengunjung | Teks | **Wajib** | `"Budi Santoso"` |
| `instansi` | Asal kantor/perusahaan atau umum | Teks | **Wajib** | `"Dinas Kominfo" / "Umum"` |
| `unit_tujuan` | Bidang/bagian yang dituju | Teks (Pilihan) | **Wajib** | `"Bidang Pelayanan Publik"` |
| `keperluan` | Tujuan kedatangan | Teks | **Wajib** | `"Konsultasi perizinan"` |
| `nomor_hp` | Nomor HP / WhatsApp aktif | Angka (Teks) | **Wajib** | `"081234567890"` |
| `waktu_masuk` | Tanggal dan jam tamu mendaftar | Waktu (*Timestamp*) | **Wajib** *(Otomatis)* | `"2026-11-23 09:15:00"` |
| `waktu_keluar` | Tanggal dan jam tamu pulang | Waktu (*Timestamp*) | **Tidak** *(Diisi saat pulang)* | `null` (jika masih di dalam) atau `"2026-11-23 10:30:00"` |

---

## 4. Alur Data: Dari Formulir Tamu hingga Dasbor Petugas

Berikut adalah perjalanan data langkah demi langkah sejak tamu mengetik di HP hingga datanya muncul di layar komputer petugas:

```text
[1. Tamu Mengisi Form] ──> [2. Validasi & Tambah Jam] ──> [3. Simpan ke Arsip] ──> [4. Tampil di Dasbor]
   (GuestForm.jsx)             (guestService.js)            (guestStorage.js)          (Dashboard.jsx)
```

1. **Input di Layar (`GuestForm.jsx`):** Tamu memindai QR Code di pos keamanan, mengisi 5 kolom wajib di HP, lalu menekan tombol **"Kirim"**.
2. **Pemeriksaan & Cap Waktu (`guestService.js`):** Lapisan logika memeriksa apakah semua kolom sudah terisi dan format nomor HP sudah benar. Jika valid, sistem otomatis menempelkan **ID unik** dan **Jam Masuk (`waktu_masuk`)** saat itu juga, serta mengatur `waktu_keluar` menjadi kosong.
3. **Penyimpanan (`guestStorage.js`):** Data yang sudah lengkap dan rapi dikirim ke lapisan penyimpanan untuk disimpan secara permanen.
4. **Pembaruan Dasbor (`Dashboard.jsx`):** Ketika petugas membuka dasbor, tampilan meminta daftar tamu terbaru melalui `guestService.js`. Petugas melihat nama tamu baru berada di urutan paling atas dengan status **"Sedang Berkunjung"**.
5. **Proses Pulang (*Check-out*):** Saat tamu pulang, petugas menekan tombol **"Selesai / Keluar"** di dasbor. `guestService.js` mencatat jam saat itu ke kolom `waktu_keluar` dan menyimpannya kembali.

---

## 5. Aturan Dasar Pengembangan (Standar Kualitas & Keamanan)

Untuk menjaga agar aplikasi tidak mudah rusak saat diperbarui dan aman dari kebocoran data, pengembang wajib mematuhi **2 aturan emas** berikut:

### Aturan 1: Satu File, Satu Tanggung Jawab (*Single Responsibility*)
* **Penjelasan:** Setiap file hanya boleh mengurus satu pekerjaan spesifik. File untuk tampilan formulir (`GuestForm.jsx`) tidak boleh dicampur dengan kode untuk mengunduh file Excel (`exportService.js`).
* **Manfaat bagi Instansi:** Jika di kemudian hari kantor ingin mengubah tampilan formulir (misalnya menambah pilihan unit kerja baru), programmer cukup membuka satu file saja tanpa risiko merusak fitur laporan atau fitur *login* petugas.

### Aturan 2: Dilarang Keras Menulis Kunci Rahasia (*API Key* / *Password*) di Dalam Kode
* **Penjelasan:** Alamat server *database*, kata sandi *admin* bawaan, atau kunci akses (*API Key*) tidak boleh ditulis langsung di dalam file kode program (`.jsx` atau `.js`). Semua informasi rahasia wajib diletakkan di file khusus terpisah bernama `.env` (*Environment Variables*) yang tidak ikut dibagikan ke publik.
* **Manfaat bagi Instansi:** Jika kode aplikasi disimpan di repositori kode (seperti GitHub) atau diserahkan ke pihak ketiga untuk pemeliharaan, rahasia keamanan server dan data tamu instansi tetap terlindungi dan tidak bocor.