import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Ticket, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Plus, 
  Settings, 
  Search, 
  Filter, 
  Building2, 
  Layers, 
  Activity, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Play,
  Radio,
  Bell,
  RefreshCw,
  Send,
  ArrowLeftRight,
  UserCheck,
  Phone,
  AlertTriangle,
  Monitor,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  Zap,
  Mail,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { Token, Organization, LiveActivityLog } from '../types';
import { AdminEmailInboxView } from './AdminEmailInboxView';

interface AdminPortalAppProps {
  onSwitchToCitizen?: () => void;
  onOpenLiveDisplay?: () => void;
}

export const AdminPortalApp: React.FC<AdminPortalAppProps> = ({
  onSwitchToCitizen,
  onOpenLiveDisplay
}) => {
  const { 
    organizations, 
    tokens, 
    queueStates, 
    callNextToken, 
    callSpecificToken, 
    completeToken, 
    cancelToken,
    transferToken,
    updateServiceAverageTime,
    playChime,
    t,
    currentUser,
    currentAdmin,
    logoutAdmin,
    adminEmails,
    activityLogs,
    broadcastAnnouncements,
    postBroadcastAnnouncement,
    dismissAnnouncement,
    simulateCitizenBooking,
    resetSystemData
  } = useQueue();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-opd-gen');
  const [adminTab, setAdminTab] = useState<'console' | 'live-pulse' | 'master-queue' | 'emails' | 'counters-orgs' | 'announcements' | 'analytics'>('console');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all');

  // Announcement Composer state
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [announcementSeverity, setAnnouncementSeverity] = useState<'info' | 'warning' | 'urgent'>('info');

  // Transfer Token Modal state
  const [tokenToTransfer, setTokenToTransfer] = useState<Token | null>(null);
  const [targetTransferServiceId, setTargetTransferServiceId] = useState<string>('');

  // Find all services flattened
  const allServices: Array<{
    id: string;
    name: string;
    orgId: string;
    orgName: string;
    branchName: string;
    deptName: string;
    codePrefix: string;
    avgTime: number;
    activeCounter: string;
  }> = [];

  organizations.forEach(org => {
    org.branches.forEach(branch => {
      branch.departments.forEach(dept => {
        dept.services.forEach(srv => {
          allServices.push({
            id: srv.id,
            name: srv.name,
            orgId: org.id,
            orgName: org.name,
            branchName: branch.name,
            deptName: dept.name,
            codePrefix: srv.codePrefix,
            avgTime: srv.averageServiceTimeMinutes,
            activeCounter: srv.activeCounter,
          });
        });
      });
    });
  });

  const currentServiceObj = allServices.find(s => s.id === selectedServiceId) || allServices[0];
  const currentServiceQueue = queueStates[selectedServiceId] || {
    serviceId: selectedServiceId,
    currentRunningTokenNumber: `${currentServiceObj?.codePrefix || 'A'}-001`,
    currentRunningSequence: 1,
    lastAssignedSequence: 1,
    activeCounter: currentServiceObj?.activeCounter || 'Counter 1',
    isCounterOpen: true,
  };

  // Service specific tokens
  const serviceTokens = tokens.filter(t => t.serviceId === selectedServiceId);
  const waitingTokens = serviceTokens.filter(t => t.status === 'waiting');
  const currentlyServingToken = serviceTokens.find(t => t.status === 'serving');

  // System-wide metrics
  const totalTokensToday = tokens.length;
  const totalWaiting = tokens.filter(t => t.status === 'waiting').length;
  const totalServing = tokens.filter(t => t.status === 'serving').length;
  const totalCompleted = tokens.filter(t => t.status === 'completed').length;
  const totalCancelled = tokens.filter(t => t.status === 'cancelled' || t.status === 'no_show').length;

  // Filtered Tokens for Queue List Tab
  const filteredTokens = tokens.filter(tok => {
    const matchesSearch = 
      tok.tokenNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tok.citizenName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tok.citizenMobile.includes(searchFilter) ||
      tok.serviceName.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tok.status === statusFilter;
    const matchesOrg = orgFilter === 'all' || tok.organizationId === orgFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    postBroadcastAnnouncement(newAnnouncementText.trim(), announcementSeverity);
    setNewAnnouncementText('');
  };

  const handleExecuteTransfer = () => {
    if (!tokenToTransfer || !targetTransferServiceId) return;
    transferToken(tokenToTransfer.id, targetTransferServiceId, 'Transferred by Admin Officer');
    setTokenToTransfer(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Officer & Command Bar */}
      <header className="bg-[#1E293B] border-b border-slate-700/80 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  ADMIN COMMAND CENTER
                </span>
                <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE REAL-TIME SYNC</span>
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>QueueWise Admin & Officer Portal</span>
              </h1>
            </div>
          </div>

          {/* Quick Actions & Portal Switcher */}
          <div className="flex items-center space-x-2 text-xs">
            {/* Logged in Admin Identity Pill */}
            {currentAdmin && (
              <div className="hidden lg:flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[11px] border border-amber-400/30">
                  {currentAdmin.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-[11px] flex items-center space-x-1">
                    <span>{currentAdmin.name}</span>
                    {currentAdmin.badgeNumber && (
                      <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                        {currentAdmin.badgeNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[10px] truncate max-w-[170px]">
                    {currentAdmin.username}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={simulateCitizenBooking}
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all shadow-xs"
              title="Simulate a citizen booking token on the citizen website to test live sync"
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Simulate Citizen Booking</span>
            </button>

            {onOpenLiveDisplay && (
              <button
                onClick={onOpenLiveDisplay}
                className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Open Waiting Lounge Fullscreen Display Board"
              >
                <Monitor className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">TV Display Board</span>
              </button>
            )}

            {onSwitchToCitizen && (
              <button
                onClick={onSwitchToCitizen}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Citizen Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={logoutAdmin}
              className="bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 px-2.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-colors"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto border-t border-slate-700/50 text-xs">
          <button
            onClick={() => setAdminTab('console')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'console' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>Counter Operator Desk</span>
          </button>

          <button
            onClick={() => setAdminTab('live-pulse')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'live-pulse' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Live Activity Stream</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-500/30">
              Live
            </span>
          </button>

          <button
            onClick={() => setAdminTab('master-queue')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'master-queue' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-blue-400" />
            <span>Master Tokens ({tokens.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('emails')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'emails' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Email Alerts</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold border border-amber-400/30">
              {adminEmails.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('counters-orgs')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'counters-orgs' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Dept & Services</span>
          </button>

          <button
            onClick={() => setAdminTab('announcements')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'announcements' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>Broadcasts</span>
            {broadcastAnnouncements.filter(a => a.active).length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {broadcastAnnouncements.filter(a => a.active).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('analytics')}
            className={`py-2.5 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              adminTab === 'analytics' 
                ? 'border-amber-400 text-amber-300 bg-slate-800/80' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flow Analytics</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Real-Time Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Tokens</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">{totalTokensToday}</span>
              <span className="text-[10px] text-slate-400">Total Booked</span>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Citizens Waiting</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">{totalWaiting}</span>
              <span className="text-[10px] text-amber-300/70">In Waiting Hall</span>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">At Counters</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-blue-400 font-mono">{totalServing}</span>
              <span className="text-[10px] text-blue-300/70">Being Served</span>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Completed</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalCompleted}</span>
              <span className="text-[10px] text-emerald-300/70">Successful</span>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">Cancelled / No-Show</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-rose-400 font-mono">{totalCancelled}</span>
              <span className="text-[10px] text-rose-300/70">Revoked</span>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Avg Wait Pace</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-cyan-300 font-mono">{currentServiceObj?.avgTime || 5}m</span>
              <span className="text-[10px] text-cyan-300/70">Per Token</span>
            </div>
          </div>
        </div>

        {/* TAB 1: COUNTER OPERATOR DESK */}
        {adminTab === 'console' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Active Counter Calling Engine */}
            <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 block">
                    ACTIVE OPERATOR DESK
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    {currentServiceObj?.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {currentServiceObj?.orgName} • {currentServiceObj?.activeCounter}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    id="select-admin-active-desk"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="bg-[#0F172A] border border-slate-600 text-amber-300 text-xs font-bold p-2.5 rounded-xl focus:ring-1 focus:ring-amber-400"
                  >
                    {allServices.map(s => (
                      <option key={s.id} value={s.id}>
                        [{s.orgName.split(' ')[0]}] {s.name} ({s.activeCounter})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={playChime}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-xl transition-colors"
                    title="Ring audio chime"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Large Current Serving Display Box */}
              <div className="bg-[#0F172A] border border-slate-700 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>BROADCASTING LIVE</span>
                </div>

                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  CURRENT RUNNING TOKEN AT {currentServiceObj?.activeCounter}
                </span>

                <div className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-widest py-1 drop-shadow-md">
                  {currentServiceQueue.currentRunningTokenNumber}
                </div>

                {currentlyServingToken ? (
                  <div className="bg-[#1E293B] border border-slate-700 p-3 rounded-xl text-xs inline-block text-left space-y-1">
                    <div className="flex items-center space-x-2 text-slate-200">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <strong className="text-white text-sm">{currentlyServingToken.citizenName}</strong>
                      {currentlyServingToken.isSeniorCitizenOrPriority && (
                        <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                          Priority Senior
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center space-x-3">
                      <span>Phone: {currentlyServingToken.citizenMobile}</span>
                      <span>Called: {currentlyServingToken.calledTime ? new Date(currentlyServingToken.calledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No citizen currently called at this counter. Click "CALL NEXT CITIZEN" below to advance.
                  </p>
                )}
              </div>

              {/* Master Calling Button Controls */}
              <div className="space-y-3">
                <button
                  id="btn-admin-call-next"
                  onClick={() => callNextToken(selectedServiceId)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-base sm:text-lg font-black py-4 px-6 rounded-xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center space-x-3"
                >
                  <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
                  <span>CALL NEXT CITIZEN (RING CHIME)</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {currentlyServingToken ? (
                    <>
                      <button
                        onClick={() => completeToken(currentlyServingToken.id)}
                        className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Completed</span>
                      </button>

                      <button
                        onClick={() => setTokenToTransfer(currentlyServingToken)}
                        className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        <span>Transfer Desk</span>
                      </button>

                      <button
                        onClick={() => cancelToken(currentlyServingToken.id, 'Citizen no-show at counter')}
                        className="py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Mark No-Show</span>
                      </button>
                    </>
                  ) : (
                    <div className="col-span-3 text-center py-2.5 text-slate-400 text-xs bg-[#0F172A] border border-slate-700/60 rounded-xl">
                      Waiting for next call. Once called, Complete, Transfer, and No-Show options will activate.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Waiting Queue in Current Desk */}
            <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-md flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Waiting In Lounge
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    {waitingTokens.length} Citizens
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Est. ~{waitingTokens.length * (currentServiceObj?.avgTime || 5)} mins remaining
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1 flex-1">
                {waitingTokens.length > 0 ? (
                  waitingTokens.map((tok, index) => (
                    <div
                      key={tok.id}
                      className="bg-[#0F172A] border border-slate-700/90 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-500 transition-all text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-amber-400 text-base">{tok.tokenNumber}</span>
                          <span className="text-[10px] text-slate-400 font-mono">#{index + 1} in line</span>
                          {tok.isSeniorCitizenOrPriority && (
                            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                              Priority
                            </span>
                          )}
                        </div>
                        <div className="text-slate-200 font-medium">{tok.citizenName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                          <span>{tok.citizenMobile}</span>
                          <span>• Booked {new Date(tok.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => callSpecificToken(tok.id)}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition-colors shadow-xs"
                          title="Call this specific citizen"
                        >
                          Call Now
                        </button>
                        <button
                          onClick={() => cancelToken(tok.id, 'Cancelled from desk queue')}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Cancel token"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                    <p>No citizens currently waiting in this service queue.</p>
                    <button
                      onClick={simulateCitizenBooking}
                      className="text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
                    >
                      Click here to simulate a citizen booking on the citizen website
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CITIZEN ACTIVITY STREAM */}
        {adminTab === 'live-pulse' && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h2 className="text-lg font-bold text-white">
                    Live Citizen Activity & Event Stream
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time synchronization logs showing all actions performed on the Citizen Portal and Admin Desks.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={simulateCitizenBooking}
                  className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simulate Citizen Booking</span>
                </button>
              </div>
            </div>

            {/* Activity Timeline List */}
            <div className="space-y-3">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#0F172A] border border-slate-700 p-4 rounded-xl flex items-start justify-between text-xs hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        log.type === 'citizen_booked' 
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : log.type === 'counter_called'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : log.type === 'token_completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : log.type === 'broadcast_alert'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-slate-700 border-slate-600 text-slate-300'
                      }`}>
                        {log.type === 'citizen_booked' && <Ticket className="w-4 h-4" />}
                        {log.type === 'counter_called' && <Volume2 className="w-4 h-4" />}
                        {log.type === 'token_completed' && <CheckCircle2 className="w-4 h-4" />}
                        {log.type === 'broadcast_alert' && <Radio className="w-4 h-4" />}
                        {log.type === 'counter_transferred' && <ArrowLeftRight className="w-4 h-4" />}
                        {log.type === 'token_cancelled' && <XCircle className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <strong className="text-white text-sm">{log.title}</strong>
                          {log.tokenNumber && (
                            <span className="font-mono bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[11px] border border-slate-700">
                              {log.tokenNumber}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                            {log.actor}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{log.description}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-4">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MASTER TOKEN DIRECTORY */}
        {adminTab === 'master-queue' && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-md">
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-slate-700/70 pb-4">
              <div className="relative w-full md:max-w-sm">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search token no., citizen name, mobile, service..."
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-2.5 text-xs text-white pl-9 focus:ring-1 focus:ring-amber-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
                <select
                  value={orgFilter}
                  onChange={(e) => setOrgFilter(e.target.value)}
                  className="bg-[#0F172A] border border-slate-700 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="all">All Organizations</option>
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0F172A] border border-slate-700 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="all">All Statuses</option>
                  <option value="waiting">Waiting</option>
                  <option value="serving">Serving</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0F172A] text-slate-200 font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">Token No.</th>
                    <th className="p-3.5">Citizen Name</th>
                    <th className="p-3.5">Contact Number</th>
                    <th className="p-3.5">Organization & Counter</th>
                    <th className="p-3.5">Booking Time</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Desk Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredTokens.length > 0 ? (
                    filteredTokens.map(tok => (
                      <tr key={tok.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-mono font-black text-amber-400 text-sm">
                          {tok.tokenNumber}
                          {tok.isSeniorCitizenOrPriority && (
                            <span className="ml-1.5 bg-amber-400/20 text-amber-300 text-[9px] px-1 py-0.2 rounded font-sans font-bold">
                              Priority
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-medium text-white">{tok.citizenName}</td>
                        <td className="p-3.5 font-mono text-slate-300">{tok.citizenMobile}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-200">{tok.serviceName}</div>
                          <div className="text-[10px] text-slate-400">{tok.organizationName} • {tok.counterNumber}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">
                          {new Date(tok.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                            tok.status === 'serving'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : tok.status === 'waiting'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : tok.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {tok.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {tok.status === 'waiting' && (
                            <button
                              onClick={() => callSpecificToken(tok.id)}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition-colors shadow-xs"
                            >
                              Call
                            </button>
                          )}
                          {tok.status === 'serving' && (
                            <button
                              onClick={() => completeToken(tok.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          {tok.status !== 'completed' && tok.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelToken(tok.id, 'Cancelled via Master Directory')}
                              className="px-2.5 py-1 bg-rose-950/50 text-rose-300 border border-rose-700/50 hover:bg-rose-900/50 font-bold text-[11px] rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No tokens found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: GMAIL OFFICIAL DISPATCHES */}
        {adminTab === 'emails' && (
          <AdminEmailInboxView />
        )}

        {/* TAB 5: SERVICE DESK & TIME SETTINGS */}
        {adminTab === 'counters-orgs' && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-6 shadow-md">
            <div>
              <h2 className="text-lg font-bold text-white">
                Department Counters & Handling Pace Configuration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Modifying the average service time per desk instantly recalibrates estimated wait times for citizens on the citizen website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map(srv => (
                <div key={srv.id} className="bg-[#0F172A] border border-slate-700 p-4 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                        {srv.orgName.split(' ')[0]}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{srv.name}</h4>
                      <div className="text-xs text-slate-400">{srv.activeCounter} • Prefix: {srv.codePrefix}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                    <label className="text-slate-300 font-medium">Avg Handling (Mins):</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={1}
                        max={60}
                        defaultValue={srv.avgTime}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val > 0) updateServiceAverageTime(srv.id, val);
                        }}
                        className="w-16 bg-[#1E293B] border border-slate-600 rounded-lg p-1.5 text-xs text-center font-bold text-amber-300"
                      />
                      <span className="text-slate-400 text-[11px]">mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PUBLIC BROADCAST ANNOUNCEMENTS */}
        {adminTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Compose Announcement */}
            <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-md">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-rose-400" />
                  <span>Broadcast Public Notice</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dispatches an instant notification banner across all Citizen Website sessions and TV Display boards.
                </p>
              </div>

              <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Announcement Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={newAnnouncementText}
                    onChange={(e) => setNewAnnouncementText(e.target.value)}
                    placeholder="e.g. Counter 3 is briefly paused for document verification. Please check your token on the TV screen."
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Alert Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAnnouncementSeverity('info')}
                      className={`p-2 rounded-lg font-bold text-[11px] border transition-colors ${
                        announcementSeverity === 'info'
                          ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                          : 'bg-[#0F172A] border-slate-700 text-slate-400'
                      }`}
                    >
                      General (Info)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnouncementSeverity('warning')}
                      className={`p-2 rounded-lg font-bold text-[11px] border transition-colors ${
                        announcementSeverity === 'warning'
                          ? 'bg-amber-600/30 border-amber-400 text-amber-300'
                          : 'bg-[#0F172A] border-slate-700 text-slate-400'
                      }`}
                    >
                      Warning
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnouncementSeverity('urgent')}
                      className={`p-2 rounded-lg font-bold text-[11px] border transition-colors ${
                        announcementSeverity === 'urgent'
                          ? 'bg-rose-600/30 border-rose-400 text-rose-300'
                          : 'bg-[#0F172A] border-slate-700 text-slate-400'
                      }`}
                    >
                      Urgent Alert
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast to All Citizens Now</span>
                </button>
              </form>
            </div>

            {/* Right: Active Broadcasts List */}
            <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-md">
              <h3 className="text-base font-bold text-white">
                Active & Recent Broadcasts
              </h3>

              <div className="space-y-3">
                {broadcastAnnouncements.length > 0 ? (
                  broadcastAnnouncements.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        item.severity === 'urgent'
                          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                          : item.severity === 'warning'
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                          : 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                            item.severity === 'urgent'
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : item.severity === 'warning'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-blue-500/20 border-blue-500 text-blue-300'
                          }`}>
                            {item.severity}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-slate-400 text-[10px]">by {item.sender}</span>
                        </div>
                        <p className="text-white text-xs leading-relaxed font-medium">{item.message}</p>
                      </div>

                      <button
                        onClick={() => dismissAnnouncement(item.id)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="Dismiss announcement"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No active public announcements at this time.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FLOW ANALYTICS & CAPACITY */}
        {adminTab === 'analytics' && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 space-y-6 shadow-md">
            <div>
              <h2 className="text-lg font-bold text-white">
                Queue Throughput & Counter Efficiency Metrics
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time operational summary of citizen traffic, counter service rates, and waiting hall distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0F172A] border border-slate-700 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Service Completion Rate</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {totalTokensToday > 0 ? `${Math.round((totalCompleted / totalTokensToday) * 100)}%` : '100%'}
                </div>
                <p className="text-[11px] text-slate-400">
                  {totalCompleted} of {totalTokensToday} tokens successfully served today.
                </p>
              </div>

              <div className="bg-[#0F172A] border border-slate-700 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Operational Desks</span>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {allServices.length} Desks
                </div>
                <p className="text-[11px] text-slate-400">
                  Across 3 public departments and civic utility counters.
                </p>
              </div>

              <div className="bg-[#0F172A] border border-slate-700 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Average Handling Efficiency</span>
                <div className="text-3xl font-black text-cyan-400 font-mono">
                  4.8 Mins
                </div>
                <p className="text-[11px] text-slate-400">
                  Calculated against standardized e-governance service SLA.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Transfer Desk Modal */}
      {tokenToTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ArrowLeftRight className="w-4 h-4 text-blue-400" />
                <span>Transfer Token to Another Desk</span>
              </h3>
              <button
                onClick={() => setTokenToTransfer(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-xl text-xs space-y-1 border border-slate-700">
              <div>Token: <strong className="text-amber-400 font-mono">{tokenToTransfer.tokenNumber}</strong></div>
              <div>Citizen: <strong className="text-white">{tokenToTransfer.citizenName}</strong></div>
              <div className="text-slate-400">Current Service: {tokenToTransfer.serviceName}</div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-300 font-semibold">Select Destination Service Desk:</label>
              <select
                value={targetTransferServiceId}
                onChange={(e) => setTargetTransferServiceId(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-xs text-amber-300 font-bold focus:ring-1 focus:ring-amber-400"
              >
                <option value="">-- Choose Destination Desk --</option>
                {allServices.filter(s => s.id !== tokenToTransfer.serviceId).map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.orgName.split(' ')[0]}] {s.name} ({s.activeCounter})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-2 text-xs">
              <button
                onClick={() => setTokenToTransfer(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                disabled={!targetTransferServiceId}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-md"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
