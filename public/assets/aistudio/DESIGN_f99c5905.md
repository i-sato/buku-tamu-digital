---
name: "Buku Tamu Digital — Sistem Desain Instansi"
description: "Sistem desain resmi, bersih, dan berwibawa untuk aplikasi web Buku Tamu Digital instansi pemerintah Indonesia dengan pendekatan mobile-first."
---

## Overview

Sistem desain ini dirancang untuk layanan **Buku Tamu Digital** pada instansi pemerintah Indonesia (seperti Dinas Komunikasi dan Informatika, Sekretariat Daerah, atau Kementerian). Kepribadian mereknya adalah **resmi, tepercaya, dan mudah diakses**—menggabungkan otoritas biru tua institusional dengan permukaan putih bersih yang memudahkan warga maupun petugas membaca informasi dengan cepat di layar ponsel.

Gaya visual mengusung **Corporate / Modern Civic Minimalism**: tata letak satu kolom yang terstruktur, hierarki tipografi sans-serif yang tegas, ruang bernapas yang lega, serta pembedaan permukaan berbasis lapisan tonal dan garis batas halus tanpa dekorasi berlebihan.

## Colors

Palet warna berpusat pada **Biru Tua Institusional (`#00183B` dan `#0F2D59`)** sebagai jangkar otoritas dan fokus utama, dipadukan dengan permukaan putih bersih (`#FFFFFF`) serta abu-abu netral sejuk (`#FAF9FD` dan `#F4F3F7`) untuk keterbacaan optimal di lingkungan pencahayaan terang.

- **Primary & Primary Container:** Digunakan untuk header resmi, tombol aksi utama (*Kirim Pendaftaran*, *Unduh CSV*), dan elemen identitas instansi.
- **Surface & Surface Containers:** Menyediakan hierarki kartu formulir, tiket kunjungan, dan daftar tamu tanpa bergantung pada bayangan berat.
- **Success:** Khusus menandai status kunjungan aktif/tercatat pada bukti kunjungan dan daftar hadir.

```yaml
colors:
  success: "#146C2E"
  on-success: "#FFFFFF"
  success-container: "#E6F4EA"
  on-success-container: "#0D4E20"
  light:
    primary: "#00183B"
    on-primary: "#FFFFFF"
    primary-container: "#0F2D59"
    on-primary-container: "#FFFFFF"
    secondary: "#555E72"
    on-secondary: "#FFFFFF"
    secondary-container: "#D9E2FA"
    on-secondary-container: "#121C2D"
    tertiary: "#2D1200"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#4B2300"
    on-tertiary-container: "#FFFFFF"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#410002"
    background: "#FAF9FD"
    on-background: "#1A1B1F"
    surface: "#FAF9FD"
    surface-dim: "#DAD9DE"
    surface-bright: "#FAF9FD"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F4F3F7"
    surface-container: "#EFEDF2"
    surface-container-high: "#E9E7EC"
    surface-container-highest: "#E3E2E6"
    on-surface: "#1A1B1F"
    surface-variant: "#E0E2EC"
    on-surface-variant: "#44474F"
    outline: "#747780"
    outline-variant: "#C4C6D0"
    inverse-surface: "#2F3034"
    inverse-on-surface: "#F1F0F4"
    inverse-primary: "#ADC7FC"
  dark:
    primary: "#ADC7FC"
    on-primary: "#001B3F"
    primary-container: "#0F2D59"
    on-primary-container: "#D7E2FF"
    secondary: "#BDC6DE"
    on-secondary: "#273043"
    secondary-container: "#40495C"
    on-secondary-container: "#D9E2FA"
    tertiary: "#FDB787"
    on-tertiary: "#4F2501"
    tertiary-container: "#4B2300"
    on-tertiary-container: "#FFDCC6"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#121316"
    on-background: "#E3E2E6"
    surface: "#121316"
    surface-dim: "#121316"
    surface-bright: "#38393D"
    surface-container-lowest: "#0D0E11"
    surface-container-low: "#1A1B1F"
    surface-container: "#1E1F23"
    surface-container-high: "#292A2D"
    surface-container-highest: "#343538"
    on-surface: "#E3E2E6"
    surface-variant: "#44474F"
    on-surface-variant: "#C4C6D0"
    outline: "#8E909A"
    outline-variant: "#44474F"
    inverse-surface: "#E3E2E6"
    inverse-on-surface: "#2F3034"
    inverse-primary: "#455E8D"
```

## Typography

Sistem tipografi memadukan **Red Hat Text** untuk judul yang tegas dan berwibawa, **Instrument Sans** untuk teks formulir, label, dan isi yang sangat mudah dibaca di layar ponsel, serta **Spline Sans Mono** untuk kode nomor kunjungan dan pencatatan waktu presisi (`tabular-nums`).

```yaml
typography:
  display-lg:
    fontFamily: "Red Hat Text"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Red Hat Text"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Red Hat Text"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 42px
    letterSpacing: -0.25px
  headline-lg-mobile:
    fontFamily: "Red Hat Text"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: -0.2px
  headline-md:
    fontFamily: "Red Hat Text"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: -0.1px
  title-lg:
    fontFamily: "Red Hat Text"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Instrument Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0.1px
  label-lg:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Instrument Sans"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Instrument Sans"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0.3px
  mono-lg:
    fontFamily: "Spline Sans Mono"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: 0.5px
  mono-md:
    fontFamily: "Spline Sans Mono"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.25px
```

## Layout & Spacing

Tata letak menggunakan pendekatan **Fluid Grid Mobile-First** (lebar acuan `390px` dengan margin sisi `16px`) yang dapat meluas rapi pada layar tablet/desktop hingga lebar maksimal `640px` untuk formulir dan `1120px` untuk dashboard petugas. Skala jarak mengikuti kelipatan dasar `4px` dan `8px` agar setiap input, kartu, dan baris daftar sejajar konsisten.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 12px
  gutter-lg: 16px
  gutter-xl: 24px
  section: 32px
  page-margin: 16px
```

## Elevation & Depth

Hierarki visual mengandalkan **Tonal Layers** dan **Low-Contrast Outlines** (`outline-variant`) alih-alih bayangan tebal. Latar belakang halaman menggunakan `surface`, kartu utama menggunakan `surface-container-lowest` (`#FFFFFF`) dengan batas tipis `1px`, dan area sekunder atau ringkasan menggunakan `surface-container-low` untuk menjaga kesan bersih, datar, dan resmi.

## Shapes

Bahasa bentuk menggunakan sudut membulat yang terkendali dan formal: `8px` (`DEFAULT`) untuk kolom input dan tombol, `12px` (`md`) untuk kartu data dan tiket kunjungan, serta `9999px` (`full`) khusus untuk lencana status (*badge*) ringkas.

```yaml
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Animasi bersifat cepat, fungsional, dan tidak berlebihan. Perubahan status tombol dan fokus input berlangsung instan (`100ms`), sedangkan kemunculan kartu atau panel konfirmasi menggunakan kurva perlambatan halus (`220ms`). Tidak ada animasi berulang atau dekoratif.

```yaml
motion:
  state-change:
    duration: 100ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Nada suara:** Resmi, sopan, lugas, dan membantu (Bahasa Indonesia baku sesuai EYD V). Hindari istilah teknis asing jika padanan Bahasa Indonesia sudah jelas.
- **Kapitalisasi:** *Sentence case* untuk label formulir, deskripsi, dan pesan bantuan; *Title Case* hanya untuk nama instansi, judul layar utama, dan nama unit tujuan.
- **Label aksi:** Gunakan kata kerja yang jelas sesuai konteks pemerintah, seperti *Kirim*, *Unduh CSV*, dan *Lihat Dashboard Petugas*.
- **Format data & waktu:** Gunakan format waktu Indonesia 24 jam (`09:42 WIB`), nomor kunjungan berurutan (`BT-2026-0142`), dan format nomor ponsel Indonesia (`0812-xxxx-xxxx`).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Input Field** → `@components/input-field.html`: `input-field-text`, `input-field-icon`
