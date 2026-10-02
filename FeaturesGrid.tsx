import React from 'react';
import { 
  Ticket, 
  Activity, 
  Clock, 
  Users, 
  FileText, 
  Bell, 
  Hourglass, 
  Smartphone 
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const FeaturesGrid: React.FC = () => {
  const { t } = useQueue();

  const features = [
    {
      id: 'feat-1',
      title: 'Digital Token Booking',
      desc: 'Reserve queue numbers from any phone or computer without leaving home.',
      icon: <Ticket className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-2',
      title: 'Live Queue Tracking',
      desc: 'Real-time synchronization with active counter operators and staff desks.',
      icon: <Activity className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-3',
      title: 'Estimated Waiting Time',
      desc: 'Transparent wait time calculation based on active counter pace.',
      icon: <Clock className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-4',
      title: 'People Ahead Counter',
      desc: 'Clear count of citizens ahead so you know exactly when to enter.',
      icon: <Users className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-5',
      title: 'Printable Token Slips',
      desc: 'Instant QR-coded receipts downloadable for counter presentation.',
      icon: <FileText className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-6',
      title: 'Instant In-Portal Alerts',
      desc: 'Live audio chime and on-screen alerts when your counter is called.',
      icon: <Bell className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-7',
      title: 'Crowd Congestion Relief',
      desc: 'Dramatically reduces corridor overcrowding in hospitals and civic offices.',
      icon: <Hourglass className="w-5 h-5 text-[#002D62]" />,
    },
    {
      id: 'feat-8',
      title: 'Mobile & Senior Friendly',
      desc: 'Accessible typography with priority options for senior citizens.',
      icon: <Smartphone className="w-5 h-5 text-[#002D62]" />,
    },
  ];

  return (
    <section id="features-section" className="py-14 bg-[#F2F4F7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#002D62] uppercase tracking-wider">
            Built for Modern Public Service
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
            {t.featuresTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every tool needed for organized, stress-free public visits.
          </p>
        </div>

        {/* 8 Feature Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.id}
              id={`feature-box-${f.id}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#002D62] hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center mb-3.5">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 font-sans">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
