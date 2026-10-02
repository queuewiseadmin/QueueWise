import React from 'react';
import { 
  Clock, 
  Search, 
  ShieldCheck, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface HomeHeroProps {
  onOpenBookToken: () => void;
  onOpenLogin: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onOpenBookToken, onOpenLogin }) => {
  const { t, setActiveView, tokens, queueStates } = useQueue();

  const totalWaitingCount = tokens.filter(t => t.status === 'waiting').length;
  const totalCompletedToday = tokens.filter(t => t.status === 'completed').length + 84;

  return (
    <section id="hero-section" className="bg-gradient-to-b from-[#002D62] via-[#002552] to-[#001F45] text-white border-b border-[#001530] relative overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Calls to Action */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              {t.heroBadge}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
              {t.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              {t.heroSubheading}
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3.5 pt-2 pb-2">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-4 rounded-xl">
                <div className="flex items-center space-x-1.5 text-blue-200 text-xs font-medium">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Public Sectors</span>
                </div>
                <div className="text-xl font-bold text-white mt-1.5">3 Sectors</div>
                <div className="text-xs text-slate-300">Hospitals, Banks, Offices</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-4 rounded-xl">
                <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Avg. Service Time</span>
                </div>
                <div className="text-xl font-bold text-amber-300 mt-1.5">4 – 7 Mins</div>
                <div className="text-xs text-slate-300">Per Citizen Token</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-4 rounded-xl">
                <div className="flex items-center space-x-1.5 text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Served Today</span>
                </div>
                <div className="text-xl font-bold text-emerald-300 mt-1.5">{totalCompletedToday}+</div>
                <div className="text-xs text-slate-300">Processed Today</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-hero-book-token"
                onClick={onOpenBookToken}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2 active:scale-[0.98]"
              >
                <Clock className="w-4 h-4 text-slate-950" />
                <span>{t.heroBtnBook}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="btn-hero-track-status"
                onClick={() => setActiveView('queue-status')}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors flex items-center space-x-2 border border-white/20 shadow-xs"
              >
                <Search className="w-4 h-4 text-blue-200" />
                <span>{t.heroBtnStatus}</span>
              </button>

              <button
                id="btn-hero-login"
                onClick={onOpenLogin}
                className="bg-[#001736] hover:bg-[#00224f] text-slate-200 text-sm font-semibold px-4 py-3 rounded-lg transition-colors border border-blue-400/30 shadow-xs"
              >
                {t.heroBtnLogin}
              </button>
            </div>

            {/* Compulsory Login Notice */}
            <div className="flex items-center space-x-2 text-xs text-amber-300 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Citizen Login or Registration is compulsory to book official queue tokens</span>
            </div>
          </div>

          {/* Right Column: Live Queue Status Quick Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Counter Running Tokens
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Live Sync
                </span>
              </div>

              {/* Sample Live Service Rows */}
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#002D62] uppercase">Government Hospital</div>
                    <div className="text-xs text-slate-800 font-medium">General OPD & Case Paper</div>
                    <div className="text-[11px] text-slate-500">Counter 01</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Serving Now</span>
                    <div className="text-base font-extrabold text-[#002D62] font-mono">
                      {queueStates['srv-opd-gen']?.currentRunningTokenNumber || 'H-OPD-015'}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#002D62] uppercase">Public Sector Bank</div>
                    <div className="text-xs text-slate-800 font-medium">Cash Deposit & Withdrawal</div>
                    <div className="text-[11px] text-slate-500">Counter 02</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Serving Now</span>
                    <div className="text-base font-extrabold text-[#002D62] font-mono">
                      {queueStates['srv-bank-cash-dep']?.currentRunningTokenNumber || 'B-CSH-042'}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#002D62] uppercase">Government Office</div>
                    <div className="text-xs text-slate-800 font-medium">Tehsildar Revenue & Certificates</div>
                    <div className="text-[11px] text-slate-500">Counter 01</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Serving Now</span>
                    <div className="text-base font-extrabold text-[#002D62] font-mono">
                      {queueStates['srv-gov-income']?.currentRunningTokenNumber || 'G-INC-028'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Track Link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Citizens Waiting: <strong className="text-[#002D62] font-bold">{totalWaitingCount}</strong>
                </span>
                <button
                  id="btn-hero-view-display"
                  onClick={() => setActiveView('display-board')}
                  className="text-[#002D62] hover:text-[#001F45] font-bold hover:underline"
                >
                  Waiting Hall Screen →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
