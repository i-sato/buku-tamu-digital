'use client';

import { ArrowLeft, FileEdit, Landmark, LayoutDashboard } from 'lucide-react';

export type ActiveTab = 'form' | 'dashboard';

interface AppHeaderProps {
  mode: 'default' | 'receipt';
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onBackFromReceipt?: () => void;
}

export default function AppHeader({
  mode,
  activeTab,
  onSelectTab,
  onBackFromReceipt,
}: AppHeaderProps) {
  if (mode === 'receipt') {
    return (
      <header className="bg-primary-container text-on-primary-container sticky top-0 z-20 border-b border-primary">
        <div className="max-w-[640px] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBackFromReceipt}
            aria-label="Kembali ke formulir"
            className="inline-flex items-center justify-center w-11 h-11 rounded-[8px] border border-outline text-on-primary-container hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary transition-colors duration-100 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-inverse-primary">
              Dinas Komunikasi dan Informatika
            </p>
            <h1 className="font-headline text-[16px] leading-[22px] font-semibold text-on-primary-container truncate">
              Bukti Kunjungan
            </h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary-container text-on-primary-container sticky top-0 z-20 border-b border-primary">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-3 pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-[8px] bg-surface-container-lowest text-primary flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-inverse-primary">
              Pemerintah Daerah
            </p>
            <h1 className="font-headline text-[16px] leading-[22px] font-semibold text-on-primary-container truncate">
              Dinas Komunikasi dan Informatika
            </h1>
          </div>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => onSelectTab('form')}
            aria-current={activeTab === 'form' ? 'page' : undefined}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] md:min-h-[40px] py-2 px-3 sm:px-4 rounded-[8px] text-[12px] sm:text-[13px] leading-[16px] font-semibold tracking-[0.2px] whitespace-nowrap shrink-0 transition-colors duration-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary ${
              activeTab === 'form'
                ? 'bg-surface-container-lowest text-primary'
                : 'border border-outline text-on-primary-container hover:bg-primary'
            }`}
          >
            <FileEdit className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Buku Tamu</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] md:min-h-[40px] py-2 px-3 sm:px-4 rounded-[8px] text-[12px] sm:text-[13px] leading-[16px] font-semibold tracking-[0.2px] whitespace-nowrap shrink-0 transition-colors duration-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary ${
              activeTab === 'dashboard'
                ? 'bg-surface-container-lowest text-primary'
                : 'border border-outline text-on-primary-container hover:bg-primary'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Dashboard Petugas</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
