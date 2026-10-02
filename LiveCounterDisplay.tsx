import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Volume2, 
  Clock, 
  Building2, 
  Users, 
  ShieldCheck,
  Maximize,
  ArrowLeft
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const LiveCounterDisplay: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { 
    organizations, 
    queueStates, 
    tokens, 
    playChime,
    t 
  } = useQueue();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Collect active service counters
  const activeCounters: Array<{
    orgName: string;
    branchName: string;
    deptName: string;
    serviceName: string;
    codePrefix: string;
    counterName: string;
    currentRunningToken: string;
    waitingCount: number;
    serviceId: string;
  }> = [];

  organizations.forEach(org => {
    if (selectedOrgFilter !== 'all' && org.id !== selectedOrgFilter) return;
    org.branches.forEach(branch => {
      branch.departments.forEach(dept => {
        dept.services.forEach(srv => {
          const qState = queueStates[srv.id];
          const waitingTokens = tokens.filter(t => t.serviceId === srv.id && t.status === 'waiting');
          activeCounters.push({
            orgName: org.name,
            branchName: branch.name,
            deptName: dept.name,
            serviceName: srv.name,
            codePrefix: srv.codePrefix,
            counterName: srv.activeCounter,
            currentRunningToken: qState?.currentRunningTokenNumber || `${srv.codePrefix}-001`,
            waitingCount: waitingTokens.length,
            serviceId: srv.id,
          });
        });
      });
    });
  });

  return (
    <div id="live-display-board" className="min-h-screen bg-[#001530] text-white flex flex-col font-sans">
      {/* Top Header Display Bar */}
      <header className="bg-[#001F45] border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/20 mr-2 flex items-center space-x-1 text-xs transition-colors shadow-xs"
            title="Back to Portal"
            id="btn-display-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Back</span>
          </button>
          <div className="w-10 h-10 bg-[#002D62] rounded-lg flex items-center justify-center border border-white/20 shadow-xs">
            <Tv className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                {t.portalTitle} - PUBLIC QUEUE DISPLAY
              </h1>
              <span className="bg-red-500/20 text-red-300 border border-red-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Official Waiting Hall Electronic Display System
            </p>
          </div>
        </div>

        {/* Center/Right Clock and Filter */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg border border-white/15 text-xs">
            <span className="text-slate-300 font-medium">Filter:</span>
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none text-xs"
            >
              <option value="all" className="bg-[#001F45] text-white">All Institutions</option>
              {organizations.map(o => (
                <option key={o.id} value={o.id} className="bg-[#001F45] text-white">{o.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={playChime}
            className="p-2 bg-white/10 hover:bg-white/15 text-amber-300 rounded-lg border border-white/15 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
            title="Test Counter Bell Chime"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden md:inline">Test Bell</span>
          </button>

          <div className="text-right bg-white/10 px-4 py-1.5 rounded-lg border border-white/15">
            <div className="text-[11px] text-slate-300 uppercase font-mono tracking-wider">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-lg font-black text-amber-400 font-mono leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
          </div>
        </div>
      </header>

      {/* Main TV Counter Grid */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCounters.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#001F45] border border-white/15 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between transition-all hover:border-amber-400/40"
            >
              {/* Card Header: Counter Name & Institution */}
              <div className="bg-[#001530] p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    {item.counterName}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate max-w-[220px]">
                    {item.serviceName}
                  </h3>
                </div>
                <span className="text-[10px] bg-white/10 text-blue-200 border border-white/20 px-2 py-0.5 rounded-md uppercase font-semibold">
                  {item.orgName.split(' ')[0]}
                </span>
              </div>

              {/* Central Large Token Number */}
              <div className="p-8 text-center bg-[#002552]/80">
                <div className="text-xs font-semibold uppercase text-slate-300 tracking-wider">
                  Now Serving Token
                </div>
                <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-widest my-3 drop-shadow-sm">
                  {item.currentRunningToken}
                </div>
                <div className="text-xs text-slate-300 truncate font-medium">
                  {item.branchName.split('(')[0]}
                </div>
              </div>

              {/* Card Footer: Queue Stats */}
              <div className="bg-[#001530] p-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>
                  Waiting Citizens: <strong className="text-amber-400 font-mono font-bold">{item.waitingCount}</strong>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Counter Open</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Display Ticker */}
      <footer className="bg-[#001530] border-t border-white/10 p-3.5 text-center text-xs text-slate-300">
        <p>
          ★ Citizens please keep your digital token receipt / mobile SMS ready before approaching the designated counter.
        </p>
      </footer>
    </div>
  );
};
