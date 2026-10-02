import React from 'react';
import { 
  Building2, 
  Layers, 
  Briefcase, 
  UserCheck, 
  Ticket, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface HowItWorksProps {
  onStartBooking?: () => void;
  onOpenBookToken?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartBooking, onOpenBookToken }) => {
  const { t } = useQueue();

  const handleBooking = () => {
    if (onOpenBookToken) {
      onOpenBookToken();
    } else if (onStartBooking) {
      onStartBooking();
    }
  };

  const steps = [
    {
      step: '01',
      title: 'Select Institution',
      desc: 'Pick your government hospital, public bank branch, or civic office.',
      icon: <Building2 className="w-5 h-5 text-[#002D62]" />,
    },
    {
      step: '02',
      title: 'Choose Department',
      desc: 'Select the specific department or service counter you require.',
      icon: <Layers className="w-5 h-5 text-[#002D62]" />,
    },
    {
      step: '03',
      title: 'Specify Service',
      desc: 'Pick your exact service—such as OPD registration, cash desk, or certificates.',
      icon: <Briefcase className="w-5 h-5 text-[#002D62]" />,
    },
    {
      step: '04',
      title: 'Login or Register (Compulsory)',
      desc: 'Sign in to your verified citizen account or register with your mobile number to book your token.',
      icon: <UserCheck className="w-5 h-5 text-[#002D62]" />,
    },
    {
      step: '05',
      title: 'Receive Digital Token',
      desc: 'Get an instant digital token slip with assigned counter and queue position.',
      icon: <Ticket className="w-5 h-5 text-[#002D62]" />,
    },
    {
      step: '06',
      title: 'Track & Arrive on Time',
      desc: 'Watch the live counter progress online and arrive right as your turn approaches.',
      icon: <Activity className="w-5 h-5 text-[#002D62]" />,
    },
  ];

  return (
    <section id="how-it-works-section" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#002D62] uppercase tracking-wider">
            Simple 6-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
            {t.howItWorksTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Obtain your digital queue token in under a minute and avoid long physical queues.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              id={`step-card-${item.step}`}
              className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-5 hover:border-[#002D62] hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/70 pb-2.5">
                  <span className="text-lg font-black text-[#002D62] font-mono">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="mt-10 bg-[#002D62] text-white p-6 sm:p-7 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#001F45]">
          <div>
            <h4 className="text-base font-bold text-white font-sans">Ready to book your digital token?</h4>
            <p className="text-xs text-slate-200 mt-1">Check real-time counter availability and reserve your spot before visiting.</p>
          </div>
          <button
            id="btn-how-it-works-book"
            onClick={handleBooking}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-lg transition-all shadow-xs active:scale-[0.98] shrink-0 flex items-center space-x-2"
          >
            <span>Generate Token</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
