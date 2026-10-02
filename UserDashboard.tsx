import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Clock, 
  Ticket, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Trash2, 
  ExternalLink, 
  History, 
  Bell, 
  ShieldCheck,
  Building2,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { Token } from '../types';

interface UserDashboardProps {
  onOpenBookToken: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenBookToken }) => {
  const { 
    currentUser, 
    tokens, 
    calculateTokenQueueInfo, 
    setActiveReceiptToken, 
    cancelToken, 
    notifications,
    setActiveView,
    setSearchTerm,
    t 
  } = useQueue();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-tokens' | 'history' | 'notifications' | 'profile'>('overview');

  // Filter tokens belonging to user (or demo citizen)
  const userTokens = tokens.filter(tok => 
    tok.userId === currentUser?.id || 
    tok.citizenMobile === currentUser?.mobile ||
    tok.citizenName.toLowerCase() === currentUser?.name.toLowerCase()
  );

  const activeTokens = userTokens.filter(t => t.status === 'waiting' || t.status === 'serving');
  const pastTokens = userTokens.filter(t => t.status === 'completed' || t.status === 'cancelled');

  const primaryActiveToken = activeTokens[0] || null;
  const primaryQueueInfo = primaryActiveToken ? calculateTokenQueueInfo(primaryActiveToken) : null;

  return (
    <div id="citizen-dashboard" className="py-8 bg-[#F2F4F7] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top Citizen Header Bar */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-[#002D62] text-white rounded-lg flex items-center justify-center border border-[#001F45]">
              <UserIcon className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Citizen Portal Dashboard
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#002D62] font-sans">
                Welcome, {currentUser?.name || 'Citizen'}
              </h1>
              <div className="text-xs text-slate-600">
                Mobile: {currentUser?.mobile || '9876543210'} • Email: {currentUser?.email || 'citizen@queuewise.gov.in'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-dash-book-token"
              onClick={onOpenBookToken}
              className="px-4 py-2.5 bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold rounded-lg border border-[#001F45] shadow-xs active:scale-[0.98] transition-all flex items-center space-x-1.5"
            >
              <Ticket className="w-4 h-4 text-amber-300" />
              <span>Book New Token</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs gap-1 pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('my-tokens')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'my-tokens'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Tokens</span>
            {activeTokens.length > 0 && (
              <span className="bg-[#002D62] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activeTokens.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Token History
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#002D62] text-[#002D62] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Citizen Profile
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: My Active Token */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                  <span>My Active Token</span>
                  <Ticket className="w-4 h-4 text-[#002D62]" />
                </div>
                <div className="text-2xl font-black text-[#002D62] font-mono mt-2">
                  {primaryActiveToken ? primaryActiveToken.tokenNumber : 'None Active'}
                </div>
                <div className="text-xs text-slate-600 mt-1 truncate">
                  {primaryActiveToken ? primaryActiveToken.serviceName : 'Book a token to start'}
                </div>
              </div>

              {/* Card 2: Current Running Token */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                  <span>Current Running</span>
                  <Clock className="w-4 h-4 text-[#002D62]" />
                </div>
                <div className="text-2xl font-black text-[#002D62] font-mono mt-2">
                  {primaryQueueInfo ? primaryQueueInfo.currentRunningTokenNumber : '--'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {primaryActiveToken ? primaryActiveToken.counterNumber : 'Counter Desk'}
                </div>
              </div>

              {/* Card 3: People Ahead */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                  <span>People Ahead</span>
                  <UserIcon className="w-4 h-4 text-[#002D62]" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {primaryQueueInfo ? `${primaryQueueInfo.peopleAhead} Citizens` : '0'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {primaryQueueInfo && primaryQueueInfo.peopleAhead <= 2 && primaryQueueInfo.peopleAhead > 0
                    ? '⚠️ Turn is approaching!'
                    : 'In Queue'}
                </div>
              </div>

              {/* Card 4: Estimated Waiting Time */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                  <span>Est. Waiting Time</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-700 mt-2">
                  {primaryQueueInfo ? `~${primaryQueueInfo.estimatedWaitMinutes} Mins` : '0 Mins'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Based on active counter pace
                </div>
              </div>
            </div>

            {/* Active Token Detail Card */}
            {primaryActiveToken ? (
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#002D62] uppercase bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60 inline-block mb-1">
                      ACTIVE RESERVATION
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {primaryActiveToken.organizationName} - {primaryActiveToken.serviceName}
                    </h3>
                    <div className="text-xs text-slate-600">
                      {primaryActiveToken.branchName} • {primaryActiveToken.counterNumber}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveReceiptToken(primaryActiveToken)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchTerm(primaryActiveToken.tokenNumber);
                        setActiveView('queue-status');
                      }}
                      className="px-3.5 py-2 bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-xs"
                    >
                      <span>Track Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block text-[11px]">Token Number:</span>
                    <strong className="text-[#002D62] font-mono text-base">{primaryActiveToken.tokenNumber}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block text-[11px]">Booking Time:</span>
                    <strong className="text-slate-800">{new Date(primaryActiveToken.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block text-[11px]">Current Status:</span>
                    <strong className="text-amber-800 uppercase">{primaryActiveToken.status}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <span className="text-slate-500 block text-[11px]">Action:</span>
                    <button
                      onClick={() => cancelToken(primaryActiveToken.id, 'Cancelled by citizen from dashboard')}
                      className="text-red-600 hover:text-red-800 font-bold hover:underline"
                    >
                      Cancel Token
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-8 rounded-xl text-center space-y-3 shadow-xs">
                <Ticket className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Active Tokens Currently Booked</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Reserve an official queue token before visiting the Hospital, Bank, or Government Office to avoid waiting.
                </p>
                <button
                  onClick={onOpenBookToken}
                  className="bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-xs"
                >
                  Book Digital Token Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Active Tokens */}
        {activeTab === 'my-tokens' && (
          <div className="space-y-4">
            {activeTokens.length > 0 ? (
              activeTokens.map(tok => {
                const qInfo = calculateTokenQueueInfo(tok);
                return (
                  <div key={tok.id} className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-[#002D62] font-mono">{tok.tokenNumber}</span>
                        <span className="bg-blue-100 text-[#002D62] text-xs font-bold px-2.5 py-0.5 rounded-md">
                          {tok.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mt-1">{tok.organizationName} - {tok.serviceName}</h3>
                      <p className="text-xs text-slate-500">{tok.branchName} • {tok.counterNumber}</p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">People Ahead:</span>
                        <strong className="text-sm text-slate-900">{qInfo.peopleAhead}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">Est. Wait:</span>
                        <strong className="text-sm text-amber-700">~{qInfo.estimatedWaitMinutes} Mins</strong>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveReceiptToken(tok)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cancelToken(tok.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-600 transition-colors"
                          title="Cancel Token"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-200 p-8 rounded-xl text-center shadow-xs">
                <p className="text-xs text-slate-500">No active tokens in queue.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase">
              Completed & Cancelled Token History
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Token No.</th>
                    <th className="p-3.5">Organization</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Booking Time</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pastTokens.length > 0 ? (
                    pastTokens.map(tok => (
                      <tr key={tok.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#002D62]">{tok.tokenNumber}</td>
                        <td className="p-3.5">{tok.organizationName}</td>
                        <td className="p-3.5">{tok.serviceName}</td>
                        <td className="p-3.5">{new Date(tok.bookingTime).toLocaleDateString()} {new Date(tok.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            tok.status === 'completed' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                          }`}>
                            {tok.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => setActiveReceiptToken(tok)}
                            className="text-[#002D62] hover:underline font-semibold"
                          >
                            View Slip
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        No previous token history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase">
                Citizen In-Portal Alerts
              </span>
              <span className="text-xs text-slate-500">{notifications.length} alerts</span>
            </div>
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-lg flex items-start space-x-3 text-xs"
              >
                <Bell className="w-4 h-4 text-[#002D62] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{notif.title}</strong>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl max-w-xl space-y-4 text-xs shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Registered Citizen Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Full Name:</label>
                <div className="font-bold text-slate-900">{currentUser?.name}</div>
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Mobile Number:</label>
                <div className="font-bold text-slate-900">{currentUser?.mobile}</div>
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Email ID:</label>
                <div className="font-bold text-slate-900">{currentUser?.email}</div>
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Role / Access:</label>
                <div className="font-bold text-[#002D62] uppercase">{currentUser?.role}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
