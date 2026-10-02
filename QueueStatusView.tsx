import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Printer, 
  RefreshCw,
  Volume2
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { Token } from '../types';

export const QueueStatusView: React.FC<{ onOpenBookToken: () => void }> = ({ onOpenBookToken }) => {
  const { 
    tokens, 
    calculateTokenQueueInfo, 
    setActiveReceiptToken, 
    searchTerm, 
    setSearchTerm,
    t,
    playChime
  } = useQueue();

  const [inputToken, setInputToken] = useState(searchTerm || '');
  const [searchedToken, setSearchedToken] = useState<Token | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    if (searchTerm) {
      setInputToken(searchTerm);
      const found = tokens.find(tok => 
        tok.tokenNumber.toLowerCase() === searchTerm.toLowerCase() ||
        tok.citizenMobile === searchTerm ||
        tok.id === searchTerm
      );
      setSearchedToken(found || null);
      setHasSearched(true);
    } else if (tokens.length > 0) {
      const defaultTok = tokens.find(t => t.status === 'waiting') || tokens[0];
      setSearchedToken(defaultTok);
      setInputToken(defaultTok.tokenNumber);
      setHasSearched(true);
    }
  }, [searchTerm, tokens]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputToken.trim().toLowerCase();
    if (!query) return;

    const found = tokens.find(tok => 
      tok.tokenNumber.toLowerCase() === query ||
      tok.citizenMobile === query ||
      tok.id.toLowerCase() === query
    );

    setSearchedToken(found || null);
    setHasSearched(true);
    setSearchTerm(inputToken.trim());
    setLastRefreshed(new Date());
  };

  const handleRefresh = () => {
    setLastRefreshed(new Date());
    if (searchedToken) {
      const refreshed = tokens.find(t => t.id === searchedToken.id);
      if (refreshed) setSearchedToken(refreshed);
    }
  };

  const queueInfo = searchedToken ? calculateTokenQueueInfo(searchedToken) : null;

  const getStatusBadge = (status: string, isServingNow: boolean) => {
    if (isServingNow || status === 'serving') {
      return (
        <span className="bg-emerald-600 text-white font-bold px-3 py-1 text-xs rounded-lg uppercase tracking-wider animate-pulse flex items-center space-x-1">
          <span>Serving Now</span>
        </span>
      );
    }
    switch (status) {
      case 'waiting':
        return (
          <span className="bg-amber-600 text-white font-bold px-3 py-1 text-xs rounded-lg uppercase tracking-wider">
            Waiting in Queue
          </span>
        );
      case 'completed':
        return (
          <span className="bg-[#002D62] text-white font-bold px-3 py-1 text-xs rounded-lg uppercase tracking-wider">
            Completed
          </span>
        );
      case 'cancelled':
      case 'no_show':
        return (
          <span className="bg-rose-700 text-white font-bold px-3 py-1 text-xs rounded-lg uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="queue-status-view" className="py-10 bg-[#F2F4F7] min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Page Title & Search Box */}
        <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-semibold text-[#002D62] uppercase tracking-wider">
                Live Status Tracker
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">
                {t.trackQueueTitle}
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <button 
                onClick={handleRefresh}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-[#002D62] transition-colors cursor-pointer"
                title="Refresh queue status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                id="input-search-token"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Enter Token Number (e.g. H-OPD-022) or Mobile..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-4 pr-10 text-sm font-mono text-slate-900 uppercase focus:ring-2 focus:ring-[#002D62]/20 focus:border-[#002D62] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              id="btn-submit-track-queue"
              className="bg-[#002D62] hover:bg-[#001F45] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-all shadow-xs active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>{t.btnTrack}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        {hasSearched && searchedToken && queueInfo ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
            {/* Header: Organization & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {searchedToken.organizationName}
                </span>
                <h2 className="text-lg font-bold text-[#002D62]">
                  {searchedToken.serviceName}
                </h2>
                <div className="text-xs text-slate-600 mt-0.5">
                  {searchedToken.branchName} • {searchedToken.departmentName}
                </div>
              </div>
              <div className="shrink-0">
                {getStatusBadge(searchedToken.status, queueInfo.isNowServing)}
              </div>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl text-center">
                <span className="text-[11px] font-bold text-[#002D62] uppercase block">
                  Current Token
                </span>
                <span className="text-2xl font-black text-[#002D62] font-mono my-1 block">
                  {queueInfo.currentRunningTokenNumber}
                </span>
                <span className="text-[11px] text-blue-700 font-medium">
                  {searchedToken.counterNumber}
                </span>
              </div>

              <div className="bg-[#002D62] text-white border border-[#001F45] p-4 rounded-xl text-center shadow-xs">
                <span className="text-[11px] font-bold text-amber-300 uppercase block">
                  My Token
                </span>
                <span className="text-2xl font-black text-white font-mono my-1 block">
                  {searchedToken.tokenNumber}
                </span>
                <span className="text-[11px] text-slate-300">
                  {searchedToken.citizenName}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[11px] font-bold text-slate-700 uppercase block">
                  People Ahead
                </span>
                <span className="text-2xl font-black text-slate-900 my-1 block">
                  {queueInfo.peopleAhead}
                </span>
                <span className="text-[11px] text-slate-500">
                  {queueInfo.peopleAhead === 0 ? 'Your Turn Next' : 'Waiting ahead'}
                </span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl text-center">
                <span className="text-[11px] font-bold text-amber-900 uppercase block">
                  Estimated Wait
                </span>
                <span className="text-2xl font-black text-amber-950 my-1 block">
                  {queueInfo.estimatedWaitMinutes} Mins
                </span>
                <span className="text-[11px] text-amber-800">
                  Approximate Time
                </span>
              </div>
            </div>

            {/* Queue Progression Timeline */}
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-xl">
              <div className="text-xs font-bold text-slate-700 uppercase mb-3">
                Queue Progress
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className={`p-3 rounded-lg border ${
                  searchedToken.status !== 'cancelled' ? 'bg-blue-100/90 border-blue-300 text-[#002D62] font-bold' : 'bg-slate-100 text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-500">1</div>
                  <div>Booked</div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  queueInfo.peopleAhead > 2 ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-slate-100 text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-500">2</div>
                  <div>In Queue</div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  queueInfo.peopleAhead <= 2 && queueInfo.peopleAhead > 0 ? 'bg-amber-200 border-amber-400 text-amber-950 font-bold' : 'bg-slate-100 text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-500">3</div>
                  <div>Approaching Turn</div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  queueInfo.isNowServing || searchedToken.status === 'serving' ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold animate-pulse' : 'bg-slate-100 text-slate-400'
                }`}>
                  <div className="text-[10px] text-slate-500">4</div>
                  <div>Serving at Desk</div>
                </div>
              </div>
            </div>

            {/* Turn Approaching Notice */}
            {queueInfo.peopleAhead <= 2 && queueInfo.peopleAhead > 0 && (
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-center space-x-3 text-xs text-amber-950">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <strong>Turn Approaching:</strong> There are only {queueInfo.peopleAhead} person(s) ahead. Please proceed toward {searchedToken.counterNumber}.
                </div>
              </div>
            )}

            {/* Serving Notice */}
            {queueInfo.isNowServing && (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <strong>Your Turn Now:</strong> Token <strong>{searchedToken.tokenNumber}</strong> is currently being served at <strong>{searchedToken.counterNumber}</strong>.
                  </div>
                </div>
                <button
                  onClick={playChime}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Bell</span>
                </button>
              </div>
            )}

            {/* Token Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                Booked: {new Date(searchedToken.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Contact: {searchedToken.citizenMobile}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  id="btn-reprint-receipt"
                  onClick={() => setActiveReceiptToken(searchedToken)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-300 flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable Slip</span>
                </button>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white border border-slate-200 p-10 rounded-2xl text-center space-y-4 shadow-xs">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No Active Token Found for "{inputToken}"
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Please check your token prefix (e.g. H-OPD-022, B-CSH-048) or registered 10-digit mobile number.
            </p>
            <button
              onClick={onOpenBookToken}
              className="bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              Book a Token
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
