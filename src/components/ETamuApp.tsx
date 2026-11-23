'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState, useSyncExternalStore } from 'react';
import AppFooter from '@/src/components/AppFooter';
import AppHeader, { type ActiveTab } from '@/src/components/AppHeader';
import Dashboard from '@/src/components/Dashboard';
import GuestForm from '@/src/components/GuestForm';
import LoginForm from '@/src/components/LoginForm';
import VisitReceipt from '@/src/components/VisitReceipt';
import {
  clearActiveSession,
  logoutAdmin,
  verifyCurrentSession,
} from '@/src/services/authService';
import {
  checkoutGuest,
  getServerVisitsSnapshot,
  getVisitsSnapshot,
  registerGuest,
  resetSampleGuests,
  subscribeVisits,
} from '@/src/services/guestService';
import type {
  AuthSession,
  GuestFormErrors,
  GuestFormInput,
  GuestVisit,
} from '@/src/types/guest';

export default function ETamuApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [recentVisit, setRecentVisit] = useState<GuestVisit | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);

  const visits = useSyncExternalStore(
    subscribeVisits,
    getVisitsSnapshot,
    getServerVisitsSnapshot
  );

  async function handleSelectTab(tab: ActiveTab) {
    setActiveTab(tab);
    if (tab === 'form') {
      setRecentVisit(null);
      return;
    }

    if (session) {
      const valid = await verifyCurrentSession();
      if (!valid) {
        clearActiveSession();
        setSession(null);
      }
    }
  }

  function handleGuestSubmit(input: GuestFormInput): {
    ok: boolean;
    errors?: GuestFormErrors;
  } {
    const result = registerGuest(input);
    if (!result.ok || !result.visit) {
      return { ok: false, errors: result.errors };
    }

    setRecentVisit(result.visit);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return { ok: true };
  }

  function handleRegisterAnother() {
    setRecentVisit(null);
    setActiveTab('form');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleCheckout(id: string): { ok: boolean; error?: string } {
    const result = checkoutGuest(id);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    return { ok: true };
  }

  function handleResetSampleData() {
    resetSampleGuests();
  }

  async function handleLogout() {
    await logoutAdmin();
    setSession(null);
  }

  const isReceiptView = activeTab === 'form' && recentVisit !== null;
  const viewKey = isReceiptView
    ? 'receipt'
    : activeTab === 'form'
      ? 'form'
      : session
        ? 'dashboard'
        : 'login';

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <AppHeader
        mode={isReceiptView ? 'receipt' : 'default'}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onBackFromReceipt={handleRegisterAnother}
      />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="flex-1 flex flex-col"
          >
            {isReceiptView && recentVisit ? (
              <VisitReceipt
                visit={recentVisit}
                onRegisterAnother={handleRegisterAnother}
              />
            ) : activeTab === 'form' ? (
              <GuestForm onSubmitForm={handleGuestSubmit} />
            ) : session ? (
              <Dashboard
                session={session}
                visits={visits}
                onCheckout={handleCheckout}
                onResetSampleData={handleResetSampleData}
                onLogout={handleLogout}
              />
            ) : (
              <LoginForm
                onAuthenticated={(newSession) => {
                  setSession(newSession);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AppFooter />
    </div>
  );
}
