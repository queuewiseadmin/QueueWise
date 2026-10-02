import React, { useState } from 'react';
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
  Play
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { Token, Organization } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    organizations, 
    tokens, 
    queueStates, 
    callNextToken, 
    callSpecificToken, 
    completeToken, 
    cancelToken,
    updateServiceAverageTime,
    playChime,
    t,
    currentUser
  } = useQueue();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-opd-gen');
  const [adminTab, setAdminTab] = useState<'counter-console' | 'queue-list' | 'services-config' | 'statistics'>('counter-console');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Find all services flattened
  const allServices: Array<{
    id: string;
    name: string;
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

  // Overall system metrics
  const totalTokensToday = tokens.length;
  const totalWaiting = tokens.filter(t => t.status === 'waiting').length;
  const totalCompleted = tokens.filter(t => t.status === 'completed').length;
  const totalCancelled = tokens.filter(t => t.status === 'cancelled' || t.status === 'no_show').length;

  // Handle Call Next
  const handleCallNext = () => {
    callNextToken(selectedServiceId);
  };

  // Filtered Tokens for Queue List Tab
  const filteredTokens = tokens.filter(tok => {
    const matchesSearch = 
      tok.tokenNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tok.citizenName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tok.citizenMobile.includes(searchFilter) ||
      tok.serviceName.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tok.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin-management-portal" className="py-8 bg-[#F2F4F7] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top Operator Banner */}
        <div className="bg-[#002D62] text-white p-6 rounded-xl border-b border-[#001F45] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <Activity className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  OFFICIAL QUEUE OPERATOR CONSOLE
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white">
                Queue Management & Counter Controller
              </h1>
              <p className="text-xs text-slate-300">
                Authorized Access: {currentUser?.name} ({currentUser?.email})
              </p>
            </div>
          </div>

          {/* Quick Counter Selector Dropdown */}
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/15 flex items-center space-x-2">
            <span className="text-xs text-slate-200 font-semibold">Select Desk:</span>
            <select
              id="admin-select-service-desk"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="bg-[#001F45] border border-white/20 text-amber-300 font-bold text-xs p-2 rounded-lg focus:ring-1 focus:ring-amber-400"
            >
              {allServices.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.orgName.split(' ')[0]}] {s.name} ({s.activeCounter})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6 Mandatory KPI Cards from Section 19 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">{t.todayTotal}</span>
            <span className="text-2xl font-black text-[#002D62] font-mono mt-1 block">{totalTokensToday}</span>
            <span className="text-[10px] text-slate-500">All Departments</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-[#002D62] uppercase block">Selected Running</span>
            <span className="text-2xl font-black text-[#002D62] font-mono mt-1 block">
              {currentServiceQueue.currentRunningTokenNumber}
            </span>
            <span className="text-[10px] text-blue-700 font-semibold">{currentServiceObj?.activeCounter}</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">{t.waitingUsers}</span>
            <span className="text-2xl font-black text-amber-900 font-mono mt-1 block">{totalWaiting}</span>
            <span className="text-[10px] text-amber-700 font-semibold">{waitingTokens.length} at current desk</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">{t.completedTokens}</span>
            <span className="text-2xl font-black text-emerald-900 font-mono mt-1 block">{totalCompleted}</span>
            <span className="text-[10px] text-emerald-700">Successfully Served</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-red-800 uppercase block">{t.cancelledTokens}</span>
            <span className="text-2xl font-black text-red-900 font-mono mt-1 block">{totalCancelled}</span>
            <span className="text-[10px] text-red-700">No-show / cancelled</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-600 uppercase block">{t.avgWaitTime}</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {currentServiceObj?.avgTime || 5} Min
            </span>
            <span className="text-[10px] text-slate-500">Per Citizen Token</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-xs px-4 pt-1 gap-1">
          <button
            onClick={() => setAdminTab('counter-console')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              adminTab === 'counter-console'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Counter Operator Console (Section 21)
          </button>
          <button
            onClick={() => setAdminTab('queue-list')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              adminTab === 'queue-list'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bookings & Queue List ({tokens.length})
          </button>
          <button
            onClick={() => setAdminTab('services-config')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              adminTab === 'services-config'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Department & Service Settings
          </button>
        </div>

        {/* TAB 1: COUNTER OPERATOR CONSOLE */}
        {adminTab === 'counter-console' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Huge "CALL NEXT TOKEN" Master Controller */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ACTIVE COUNTER DESK</span>
                  <h2 className="text-lg font-bold text-[#002D62]">
                    {currentServiceObj?.name} - {currentServiceObj?.activeCounter}
                  </h2>
                  <div className="text-xs text-slate-600">
                    {currentServiceObj?.orgName} • {currentServiceObj?.branchName}
                  </div>
                </div>
                <button
                  onClick={playChime}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                  title="Ring counter bell"
                >
                  <Volume2 className="w-4 h-4 text-[#002D62]" />
                  <span>Ring Chime</span>
                </button>
              </div>

              {/* Large Current Token Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Currently Called / Serving Token
                </div>
                <div className="text-5xl sm:text-6xl font-black text-[#002D62] font-mono tracking-widest">
                  {currentServiceQueue.currentRunningTokenNumber}
                </div>
                {currentlyServingToken && (
                  <div className="text-xs text-slate-700 font-medium">
                    Citizen: <strong>{currentlyServingToken.citizenName}</strong> • Phone: {currentlyServingToken.citizenMobile}
                  </div>
                )}
              </div>

              {/* SECTION 21: CALL NEXT TOKEN MASTER BUTTON */}
              <div className="space-y-3">
                <button
                  id="btn-call-next-token"
                  onClick={handleCallNext}
                  className="w-full bg-[#002D62] hover:bg-[#001F45] text-white text-base sm:text-lg font-black py-4 px-6 rounded-lg shadow-sm transition-all active:scale-[0.99] border border-[#001F45] flex items-center justify-center space-x-3"
                >
                  <Play className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span>{t.callNextBtn}</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {currentlyServingToken ? (
                    <>
                      <button
                        onClick={() => completeToken(currentlyServingToken.id)}
                        className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.markCompletedBtn}</span>
                      </button>
                      <button
                        onClick={() => cancelToken(currentlyServingToken.id, 'No-show after 3 announcements')}
                        className="py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.markCancelledBtn}</span>
                      </button>
                    </>
                  ) : (
                    <div className="col-span-2 text-center text-xs text-slate-500 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                      Click "CALL NEXT TOKEN" to serve the next waiting citizen in queue.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Waiting Queue for Current Service */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Waiting Queue
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {waitingTokens.length} in line
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Pace: ~{currentServiceObj?.avgTime}m / token</span>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {waitingTokens.length > 0 ? (
                  waitingTokens.map((tok, idx) => (
                    <div
                      key={tok.id}
                      className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg flex items-center justify-between text-xs hover:bg-blue-50/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#002D62] text-sm">{tok.tokenNumber}</span>
                          {tok.isSeniorCitizenOrPriority && (
                            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              Priority
                            </span>
                          )}
                        </div>
                        <div className="text-slate-800 font-medium">{tok.citizenName}</div>
                        <div className="text-[10px] text-slate-500">{new Date(tok.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => callSpecificToken(tok.id)}
                          className="px-2.5 py-1.5 bg-[#002D62] hover:bg-[#001F45] text-white font-bold text-[11px] rounded-lg transition-colors shadow-xs"
                          title="Call this token directly"
                        >
                          Call Now
                        </button>
                        <button
                          onClick={() => cancelToken(tok.id, 'Cancelled by operator')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel token"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No citizens currently waiting in this service queue.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUEUE & BOOKING LOGS */}
        {adminTab === 'queue-list' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-200 pb-4">
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search token, citizen name, phone..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 pl-8.5 focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="waiting">Waiting</option>
                  <option value="serving">Serving</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Token No.</th>
                    <th className="p-3.5">Citizen Name</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Organization & Service</th>
                    <th className="p-3.5">Booking Time</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTokens.length > 0 ? (
                    filteredTokens.map(tok => (
                      <tr key={tok.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#002D62]">{tok.tokenNumber}</td>
                        <td className="p-3.5 font-medium text-slate-900">{tok.citizenName}</td>
                        <td className="p-3.5">{tok.citizenMobile}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{tok.serviceName}</div>
                          <div className="text-[10px] text-slate-500">{tok.organizationName} • {tok.counterNumber}</div>
                        </td>
                        <td className="p-3.5 font-mono">
                          {new Date(tok.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            tok.status === 'serving'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : tok.status === 'waiting'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : tok.status === 'completed'
                              ? 'bg-blue-100 text-[#002D62]'
                              : 'bg-red-100 text-red-900'
                          }`}>
                            {tok.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          {tok.status === 'waiting' && (
                            <button
                              onClick={() => callSpecificToken(tok.id)}
                              className="px-2.5 py-1 bg-[#002D62] text-white font-bold text-[11px] rounded-lg hover:bg-[#001F45] transition-colors"
                            >
                              Call
                            </button>
                          )}
                          {tok.status === 'serving' && (
                            <button
                              onClick={() => completeToken(tok.id)}
                              className="px-2.5 py-1 bg-emerald-700 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-800 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          {tok.status !== 'completed' && tok.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelToken(tok.id, 'Cancelled via Admin logs')}
                              className="px-2.5 py-1 bg-red-100 text-red-700 font-bold text-[11px] rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        No tokens matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES & AVERAGE TIME SETTINGS */}
        {adminTab === 'services-config' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Service Desk & Average Service Time Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Adjust the average minutes spent per token to recalibrate civic estimated waiting times dynamically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allServices.map(srv => (
                <div key={srv.id} className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#002D62] bg-blue-100 px-2 py-0.5 rounded-md uppercase">
                      {srv.orgName.split(' ')[0]}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{srv.name}</h4>
                    <div className="text-[11px] text-slate-500">{srv.activeCounter} • Prefix: {srv.codePrefix}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-[11px] font-semibold text-slate-600">Avg Time (Mins):</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      defaultValue={srv.avgTime}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (val > 0) updateServiceAverageTime(srv.id, val);
                      }}
                      className="w-16 bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-center font-bold text-[#002D62]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
