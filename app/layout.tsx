import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Buku Tamu Digital (e-Tamu) — Dinas Komunikasi dan Informatika',
  description:
    'Aplikasi web Buku Tamu Digital resmi Dinas Komunikasi dan Informatika untuk pencatatan kunjungan tamu, bukti kunjungan, dan dasbor pemantauan petugas.',
  openGraph: {
    title: 'Buku Tamu Digital (e-Tamu) — Dinas Komunikasi dan Informatika',
    description:
      'Aplikasi web Buku Tamu Digital resmi Dinas Komunikasi dan Informatika untuk pencatatan kunjungan tamu, bukti kunjungan, dan dasbor pemantauan petugas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buku Tamu Digital (e-Tamu) — Dinas Komunikasi dan Informatika',
    description:
      'Aplikasi web Buku Tamu Digital resmi Dinas Komunikasi dan Informatika untuk pencatatan kunjungan tamu, bukti kunjungan, dan dasbor pemantauan petugas.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Red+Hat+Text:wght@500;600;700&family=Spline+Sans+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
