import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { OrganizationTiles } from './components/OrganizationTiles';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesGrid } from './components/FeaturesGrid';
import { QueueStatusView } from './components/QueueStatusView';
import { UserDashboard } from './components/UserDashboard';
import { LiveCounterDisplay } from './components/LiveCounterDisplay';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { BookTokenModal } from './components/BookTokenModal';
import { TokenReceiptModal } from './components/TokenReceiptModal';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminPortalApp } from './components/AdminPortalApp';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { Users, Zap, Radio, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    activeReceiptToken, 
    setActiveReceiptToken,
    portalMode,
    setPortalMode,
    currentUser,
    currentAdmin,
    simulateCitizenBooking,
    broadcastAnnouncements,
    dismissAnnouncement
  } = useQueue();

  // Modal states for Citizen Portal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedOrgForBooking, setSelectedOrgForBooking] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [loginReason, setLoginReason] = useState('');

  const handleOpenBooking = (orgId?: string) => {
    if (orgId) {
      setSelectedOrgForBooking(orgId);
    } else {
      setSelectedOrgForBooking(null);
    }

    // Compulsory check: User must login or register first
    if (!currentUser) {
      setLoginReason('Citizen Login or Registration is compulsory to book an official queue token.');
      setIsLoginModalOpen(true);
      return;
    }

    setIsBookModalOpen(true);
  };

  // If activeView is display board, render fullscreen live monitor
  if (activeView === 'display-board') {
    return (
      <LiveCounterDisplay onBack={() => setActiveView('home')} />
    );
  }

  // 1. DEDICATED ADMIN WEBSITE
  if (portalMode === 'admin') {
    if (!currentAdmin) {
      return (
        <AdminLoginScreen 
          onBackToCitizen={() => setPortalMode('citizen')}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#0B1120]">
        {/* Quick Portal Header */}
        <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-bold text-amber-400 tracking-wider uppercase text-[11px]">
              ADMIN & OFFICER COMMAND CENTER
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={simulateCitizenBooking}
              className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Simulate incoming citizen booking"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Citizen Booking</span>
            </button>

            <button
              onClick={() => setPortalMode('citizen')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizen Portal</span>
            </button>
          </div>
        </div>

        <AdminPortalApp
          onSwitchToCitizen={() => setPortalMode('citizen')}
          onOpenLiveDisplay={() => setActiveView('display-board')}
        />
      </div>
    );
  }

  // 2. PURE CITIZEN WEBSITE (Default)
  const activeAnnouncements = broadcastAnnouncements.filter(a => a.active);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F7] font-sans text-slate-900 selection:bg-[#002D62] selection:text-white">
      {/* Broadcast Announcement Bar if active */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-500 shadow-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-red-900 shrink-0" />
              <span>
                <strong>Notice:</strong> {activeAnnouncements[0].message}
              </span>
            </div>
            <button
              onClick={() => dismissAnnouncement(activeAnnouncements[0].id)}
              className="text-slate-900 hover:text-red-900 p-1 rounded-sm cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Government Navigation Header */}
      <Header
        onOpenBookToken={() => handleOpenBooking()}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />

      {/* Main View Router for Citizen Website */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-0">
            <HomeHero 
              onOpenBookToken={() => handleOpenBooking()} 
              onOpenLogin={() => setIsLoginModalOpen(true)}
            />
            <OrganizationTiles 
              onSelectOrg={(orgId) => handleOpenBooking(orgId)} 
              onOpenBookToken={(orgId) => handleOpenBooking(orgId)} 
            />
            <HowItWorks onOpenBookToken={() => handleOpenBooking()} />
            <FeaturesGrid />
          </div>
        )}

        {activeView === 'queue-status' && (
          <QueueStatusView onOpenBookToken={() => handleOpenBooking()} />
        )}

        {activeView === 'dashboard' && (
          <UserDashboard onOpenBookToken={() => handleOpenBooking()} />
        )}

        {activeView === 'about' && (
          <AboutView onOpenBookToken={() => handleOpenBooking()} />
        )}

        {activeView === 'contact' && (
          <ContactView />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenBookToken={() => handleOpenBooking()} />

      {/* Global Modals */}
      <BookTokenModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedOrgForBooking(null);
        }}
        preSelectedOrgId={selectedOrgForBooking}
        onOpenLogin={() => {
          setLoginReason('Citizen Login or Registration is compulsory to book an official queue token.');
          setIsLoginModalOpen(true);
        }}
        onOpenRegister={() => {
          setLoginReason('Citizen Login or Registration is compulsory to book an official queue token.');
          setIsRegisterModalOpen(true);
        }}
      />

      <TokenReceiptModal
        token={activeReceiptToken}
        onClose={() => setActiveReceiptToken(null)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        reason={loginReason}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginReason('');
        }}
        onSuccess={() => {
          setLoginReason('');
          setIsBookModalOpen(true);
        }}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        reason={loginReason}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setLoginReason('');
        }}
        onSuccess={() => {
          setLoginReason('');
          setIsBookModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
}

export default App;
