import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  User, 
  Ticket, 
  Phone, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Inbox,
  Sparkles,
  Download,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { AdminEmailNotification } from '../types';

export const AdminEmailInboxView: React.FC = () => {
  const { 
    adminEmails, 
    sendTestAdminEmail, 
    clearAdminEmails, 
    simulateCitizenBooking,
    currentAdmin 
  } = useQueue();

  const [selectedEmail, setSelectedEmail] = useState<AdminEmailNotification | null>(
    adminEmails.length > 0 ? adminEmails[0] : null
  );
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEmails = adminEmails.filter(email => {
    if (filterType !== 'all' && email.eventType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(q) ||
        email.citizenName.toLowerCase().includes(q) ||
        (email.citizenContact && email.citizenContact.toLowerCase().includes(q)) ||
        email.plainText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Gmail Dispatch Gateway
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                Active &bull; queuewise.admin@gmail.com
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Admin Email Notifications Stream
            </h2>
            <p className="text-xs text-slate-400">
              Every citizen booking, login, token cancellation, and queue event is instantly transmitted to <strong className="text-amber-300 font-mono">queuewise.admin@gmail.com</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={simulateCitizenBooking}
            className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Trigger Citizen Booking Email</span>
          </button>

          <button
            onClick={sendTestAdminEmail}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Send Test Ping Email</span>
          </button>
        </div>
      </div>

      {/* Main Split Inbox View: Left List, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Email List */}
        <div className="lg:col-span-5 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
          {/* Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Dispatches ({filteredEmails.length})
              </span>
            </div>
            {adminEmails.length > 0 && (
              <button
                onClick={clearAdminEmails}
                className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center space-x-1 transition-colors"
                title="Clear inbox history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="space-y-2 text-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, citizen name, token..."
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-2.5 pl-8 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-wrap gap-1 text-[10px]">
              {[
                { key: 'all', label: 'All Events' },
                { key: 'citizen_booking', label: 'Bookings' },
                { key: 'citizen_login', label: 'Logins' },
                { key: 'token_cancelled', label: 'Cancellations' },
                { key: 'system_alert', label: 'System' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    filterType === tab.key
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Items Scroll */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 relative ${
                      isSelected
                        ? 'bg-[#15233C] border-amber-400/60 shadow-md'
                        : 'bg-[#0F172A] border-slate-700/70 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        email.eventType === 'citizen_booking'
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          : email.eventType === 'citizen_login'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : email.eventType === 'token_cancelled'
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      }`}>
                        {email.eventType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                      {email.subject}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {email.plainText}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono border-t border-slate-800">
                      <span>To: queuewise.admin@gmail.com</span>
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{email.status}</span>
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Mail className="w-8 h-8 mx-auto text-slate-600" />
                <p>No email transmissions match the selected criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Gmail Email Viewer */}
        <div className="lg:col-span-7 bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-5">
          {selectedEmail ? (
            <div className="space-y-5">
              {/* Header Box */}
              <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      OFFICIAL DISPATCH TRANSMISSION
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {selectedEmail.subject}
                    </h3>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-1 rounded flex items-center space-x-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedEmail.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">From</span>
                    <span className="text-slate-300 font-mono">{selectedEmail.from}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">To (Admin Mailbox)</span>
                    <span className="text-amber-300 font-mono font-bold">{selectedEmail.to}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Timestamp</span>
                    <span className="text-slate-300 font-mono">
                      {new Date(selectedEmail.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Citizen Name / Actor</span>
                    <span className="text-white font-medium">{selectedEmail.citizenName} {selectedEmail.citizenContact ? `(${selectedEmail.citizenContact})` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Email Body Rendering (Gmail Letterhead Style) */}
              <div className="bg-[#0B1324] border border-slate-700/80 rounded-xl p-6 space-y-4 text-xs text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                      QW
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">QueueWise E-Governance Alert Dispatch</div>
                      <div className="text-[10px] text-slate-400">Maharashtra Civic Queue Modernization System</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ID: {selectedEmail.id}
                  </div>
                </div>

                <div className="space-y-3 leading-relaxed">
                  <p className="text-slate-300">
                    Hello Administrator,
                  </p>

                  <div className="p-4 bg-[#111C32] border border-slate-700 rounded-xl space-y-2">
                    <div className="font-semibold text-white text-xs">
                      Event Summary:
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {selectedEmail.plainText}
                    </p>
                  </div>

                  {selectedEmail.metadata && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        Technical & Queue Metadata:
                      </span>
                      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                        {Object.entries(selectedEmail.metadata).map(([k, v]) => (
                          <div key={k} className="flex flex-col">
                            <span className="text-slate-500 uppercase text-[9px]">{k}</span>
                            <span className="text-slate-200 font-bold">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    This is an automated notification securely transmitted to <strong className="text-amber-300">queuewise.admin@gmail.com</strong> for real-time operations auditing.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs space-y-2">
              <Mail className="w-10 h-10 mx-auto text-slate-600" />
              <p>Select any email from the left inbox stream to view its full details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
