import React, { useState } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  User as UserIcon, 
  Bell, 
  Search, 
  Tv, 
  ShieldCheck, 
  Clock, 
  FileCode,
  Globe
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenBookToken: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenBookToken,
  onOpenNotifications
}) => {
  const { 
    language, 
    setLanguage, 
    t, 
    currentUser, 
    logoutUser, 
    notifications, 
    activeView, 
    setActiveView,
    searchTerm,
    setSearchTerm,
    setPortalMode
  } = useQueue();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      setSearchTerm(quickSearchInput.trim());
      setActiveView('queue-status');
      setMobileMenuOpen(false);
    }
  };

  const adjustFontSize = (delta: number) => {
    const next = Math.min(1.2, Math.max(0.85, fontSizeMultiplier + delta));
    setFontSizeMultiplier(next);
    document.documentElement.style.fontSize = `${next * 100}%`;
  };

  return (
    <header id="main-header" className="w-full bg-white border-b border-slate-200/80 shadow-xs sticky top-0 z-40">
      {/* 1. Top Government Utility Strip */}
      <div className="bg-[#001F45] text-slate-100 text-xs px-4 py-1.5 border-b border-[#001530]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Tricolor subtle emblem indicator & Public Helpline */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-0.5 h-3.5 w-5 rounded-xs overflow-hidden border border-slate-400/80">
              <span className="bg-[#FF9933] w-1/3 h-full"></span>
              <span className="bg-[#FFFFFF] w-1/3 h-full flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#000080]"></span>
              </span>
              <span className="bg-[#128807] w-1/3 h-full"></span>
            </div>
            <span className="font-semibold tracking-wide text-slate-200 uppercase text-[11px]">
              {t.govtTag}
            </span>
            <span className="hidden sm:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-block text-slate-300">
              {t.tollFreeHelpline}
            </span>
          </div>

          {/* Right: Accessibility font controls & Language selector */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1 text-[11px] bg-[#001530] px-2 py-0.5 rounded-md border border-slate-700/60">
              <span className="text-slate-400 mr-1">Text:</span>
              <button 
                onClick={() => adjustFontSize(-0.05)} 
                className="px-1 hover:text-white font-bold"
                title="Decrease font size"
                id="btn-font-dec"
              >
                A-
              </button>
              <button 
                onClick={() => {
                  setFontSizeMultiplier(1);
                  document.documentElement.style.fontSize = '100%';
                }} 
                className="px-1 hover:text-white font-bold"
                title="Reset font size"
                id="btn-font-reset"
              >
                A
              </button>
              <button 
                onClick={() => adjustFontSize(0.05)} 
                className="px-1 hover:text-white font-bold"
                title="Increase font size"
                id="btn-font-inc"
              >
                A+
              </button>
            </div>

            {/* Officer Portal Link */}
            <button
              onClick={() => setPortalMode('admin')}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-white/10"
              title="Official Administrator & Staff Command Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Officer Portal</span>
            </button>

            {/* Language Toggle: English | मराठी */}
            <div className="flex items-center space-x-1.5 bg-[#002D62] px-2.5 py-0.5 rounded-md border border-blue-800/80">
              <Globe className="w-3.5 h-3.5 text-blue-200" />
              <button
                id="lang-en-btn"
                onClick={() => setLanguage('en')}
                className={`text-xs px-1 font-medium transition-colors ${
                  language === 'en' ? 'text-amber-300 font-bold underline underline-offset-2' : 'text-slate-200 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-400">|</span>
              <button
                id="lang-mr-btn"
                onClick={() => setLanguage('mr')}
                className={`text-xs px-1 font-medium transition-colors ${
                  language === 'mr' ? 'text-amber-300 font-bold underline underline-offset-2' : 'text-slate-200 hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Identity & Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Official Brand Logo & Subtitle */}
        <button 
          onClick={() => setActiveView('home')} 
          className="flex items-center space-x-3 text-left group focus:outline-none"
          id="btn-brand-logo"
        >
          <div className="w-11 h-11 bg-[#002D62] text-white flex items-center justify-center rounded-lg border border-[#001F45] shadow-xs group-hover:bg-[#00234f] transition-colors">
            <Building2 className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-[#002D62] font-sans">
                {t.portalTitle}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-none mt-0.5">
              {t.portalSubTitle}
            </p>
          </div>
        </button>

        {/* Center: Quick Search Token Field */}
        <form onSubmit={handleQuickSearch} className="hidden lg:flex items-center max-w-xs w-full">
          <div className="relative w-full">
            <input
              type="text"
              id="header-quick-search-input"
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              placeholder="Search Token (e.g. H-OPD-022)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 pl-3 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002D62]/20 focus:border-[#002D62] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-[#002D62]"
              title="Track Token"
              id="header-search-submit"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right: Quick Action Controls */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            id="btn-nav-book-token"
            onClick={onOpenBookToken}
            className="bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center space-x-1.5 border border-[#001F45] active:scale-[0.98]"
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.navBookToken}</span>
          </button>

          <button
            id="btn-nav-display-board"
            onClick={() => setActiveView('display-board')}
            className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-slate-300 shadow-xs flex items-center space-x-1.5"
            title="Open Live Display Board for Waiting Halls"
          >
            <Tv className="w-3.5 h-3.5 text-[#002D62]" />
            <span>{t.navDisplayBoard}</span>
          </button>

          {/* Notifications button */}
          <button
            id="btn-header-notifs"
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-700 hover:text-[#002D62] bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs"
            title="Citizen Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* User Status / Login */}
          {currentUser ? (
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-2">
              <button
                id="btn-nav-user-dashboard"
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-800 hover:text-[#002D62] bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg border border-blue-200/80 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#002D62]" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <span className="text-[10px] uppercase font-bold text-[#002D62] bg-blue-200/70 px-1.5 py-0.5 rounded-md">
                  Citizen
                </span>
              </button>
              <button
                id="btn-nav-logout"
                onClick={logoutUser}
                className="text-xs text-red-600 hover:text-red-800 font-medium px-1.5 py-1 hover:underline"
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 border-l border-slate-200 pl-2">
              <button
                id="btn-nav-login"
                onClick={onOpenLogin}
                className="text-xs font-semibold text-slate-700 hover:text-[#002D62] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {t.navLogin}
              </button>
              <button
                id="btn-nav-register"
                onClick={onOpenRegister}
                className="text-xs font-bold text-[#002D62] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                {t.navRegister}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            id="btn-mobile-notifs"
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-700 bg-slate-100 rounded-lg border border-slate-300"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>
          <button
            id="btn-mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 bg-slate-100 rounded-lg border border-slate-300 hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Primary Navigation Bar */}
      <nav className="bg-[#002D62] text-white border-t border-[#003B7F]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-1">
            <button
              id="nav-link-home"
              onClick={() => setActiveView('home')}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeView === 'home'
                  ? 'border-amber-400 text-amber-300 bg-[#001F45]/60'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.navHome}
            </button>
            <button
              id="nav-link-services"
              onClick={() => {
                setActiveView('home');
                setTimeout(() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              {t.navServices}
            </button>
            <button
              id="nav-link-how-it-works"
              onClick={() => {
                setActiveView('home');
                setTimeout(() => {
                  document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-2.5 text-xs font-medium border-b-2 border-transparent text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              {t.navHowItWorks}
            </button>
            <button
              id="nav-link-queue-status"
              onClick={() => setActiveView('queue-status')}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeView === 'queue-status'
                  ? 'border-amber-400 text-amber-300 bg-[#001F45]/60'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.navQueueStatus}
            </button>
            {currentUser && (
              <button
                id="nav-link-dashboard"
                onClick={() => setActiveView('dashboard')}
                className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeView === 'dashboard'
                    ? 'border-amber-400 text-amber-300 bg-[#001F45]/60'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.navDashboard}
              </button>
            )}
            <button
              id="nav-link-about"
              onClick={() => setActiveView('about')}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeView === 'about'
                  ? 'border-amber-400 text-amber-300 bg-[#001F45]/60'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.navAbout}
            </button>
            <button
              id="nav-link-contact"
              onClick={() => setActiveView('contact')}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeView === 'contact'
                  ? 'border-amber-400 text-amber-300 bg-[#001F45]/60'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.navContact}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-b border-slate-700 px-4 py-4 space-y-3">
          <form onSubmit={handleQuickSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Search Token (e.g. H-OPD-022)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-sm py-2 pl-3 pr-8 text-xs text-white placeholder-slate-400"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-sm"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => { setActiveView('queue-status'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-sm text-amber-300"
            >
              {t.navQueueStatus}
            </button>
            <button
              onClick={() => { onOpenBookToken(); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 bg-blue-800 hover:bg-blue-700 text-xs rounded-sm font-semibold text-white col-span-2 flex items-center justify-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>{t.navBookToken}</span>
            </button>
            <button
              onClick={() => { setActiveView('display-board'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-sm"
            >
              {t.navDisplayBoard}
            </button>
            <button
              onClick={() => { setActiveView('about'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-sm"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => { setActiveView('contact'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-sm"
            >
              {t.navContact}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {currentUser ? (
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveView(currentUser.role === 'admin' || currentUser.role === 'counter_operator' ? 'admin' : 'dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-blue-300 font-medium"
                >
                  Dashboard ({currentUser.name})
                </button>
                <button
                  onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-400 hover:underline"
                >
                  {t.navLogout}
                </button>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="py-1.5 bg-slate-800 text-xs text-center rounded-lg font-medium"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }}
                  className="py-1.5 bg-blue-700 text-xs font-semibold text-center rounded-lg"
                >
                  {t.navRegister}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
