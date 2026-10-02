import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2,
  Ticket
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const NotificationsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    setActiveView, 
    setSearchTerm 
  } = useQueue();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-slate-400 rounded-sm shadow-2xl max-w-lg w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-[#0b2545] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">Citizen Alerts & Queue Notifications</h2>
              <p className="text-[10px] text-slate-300">Live system status announcements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-xs">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-200">
          <span className="text-slate-600 font-semibold">{notifications.length} Total Alerts</span>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-red-600 hover:text-red-800 font-bold hover:underline flex items-center space-x-1 text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.tokenNumber) {
                    setSearchTerm(notif.tokenNumber);
                    setActiveView('queue-status');
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xs border text-xs cursor-pointer transition-all hover:bg-blue-50/50 ${
                  notif.type === 'call'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium animate-pulse'
                    : notif.type === 'near_turn'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-medium'
                    : notif.read
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-blue-50/40 border-blue-300 text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    {notif.type === 'call' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                    {notif.type === 'near_turn' && <AlertCircle className="w-4 h-4 text-amber-700" />}
                    {notif.type === 'booking' && <Ticket className="w-4 h-4 text-blue-900" />}
                    <span className="font-bold">{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{notif.message}</p>
                {notif.tokenNumber && (
                  <div className="mt-1.5 text-[10px] text-blue-800 font-mono font-bold">
                    Click to view live queue status for Token #{notif.tokenNumber} →
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No notifications at this time.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
