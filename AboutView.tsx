import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles,
  HeartHandshake,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const AboutView: React.FC<{ onOpenBookToken: () => void }> = ({ onOpenBookToken }) => {
  const { t } = useQueue();

  const values = [
    {
      icon: <Clock className="w-5 h-5 text-[#002D62]" />,
      title: 'Time Preservation',
      desc: 'Replaces unproductive hours standing in physical lines with real-time digital tracking from the comfort of home.'
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#002D62]" />,
      title: 'Queue Transparency',
      desc: 'Every citizen receives an immutable token number, assigned desk, and transparent turn calculation.'
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#002D62]" />,
      title: 'Inclusive Service',
      desc: 'Priority queues for senior citizens (60+) and differently-abled individuals ensure dignified, equitable public access.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#002D62]" />,
      title: 'Operational Excellence',
      desc: 'Equips desk operators with intuitive token call controls, reducing congestion across public facilities.'
    }
  ];

  return (
    <div id="about-page" className="py-12 bg-[#F2F4F7] min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        {/* Hero Section */}
        <div className="bg-[#002D62] text-white p-8 sm:p-12 rounded-2xl shadow-sm space-y-4">
          <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Public Service Initiative
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Transforming Civic Queues into Seamless Digital Access
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl font-normal">
            QueueWise is a modern digital queue management system built to eliminate congested waiting corridors at District Hospitals, Public Sector Banks, and Civic Administration Centers.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-4">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
              Our Core Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Engineered to make public services transparent, timely, and accessible to every citizen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  {v.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors Served */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-[#002D62] font-sans">
              Serving Critical Public Sectors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Delivering structured, organized crowd management across primary civic touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#002D62]">
                Government Healthcare
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                Civil Hospitals, OPD case papers, diagnostic pathology tests, and medical certificate verifications.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#002D62]">
                Public Sector Banking
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                Cash management, teller services, KYC documentation, passbook updates, and account services.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#002D62]">
                Revenue & Civic Offices
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                Tehsildar offices, income & domicile certificates, Setu citizen facilitation desks, and municipal registers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Need to visit a public facility today?
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Generate an official digital token in seconds and track your turn from anywhere.
            </p>
          </div>
          <button
            onClick={onOpenBookToken}
            className="bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-xs transition-colors flex items-center space-x-2 shrink-0 self-start sm:self-auto"
          >
            <span>Book a Token</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
