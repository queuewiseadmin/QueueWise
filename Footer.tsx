import React from 'react';
import { Building2, ShieldCheck, Phone, Mail, HelpCircle } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const Footer: React.FC<{ onOpenBookToken: () => void }> = ({ onOpenBookToken }) => {
  const { t, setActiveView } = useQueue();

  return (
    <footer id="main-footer" className="bg-[#001F45] text-white border-t border-[#001530]">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs sm:text-sm">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                {t.portalTitle}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.portalSubTitle}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-amber-300 uppercase tracking-wider">
              Quick Navigation
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button onClick={() => setActiveView('home')} className="hover:text-white hover:underline transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('queue-status')} className="hover:text-white hover:underline transition-colors">
                  {t.navQueueStatus}
                </button>
              </li>
              <li>
                <button onClick={onOpenBookToken} className="hover:text-white hover:underline transition-colors">
                  {t.navBookToken}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('display-board')} className="hover:text-white hover:underline transition-colors">
                  {t.navDisplayBoard}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('about')} className="hover:text-white hover:underline transition-colors">
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contact')} className="hover:text-white hover:underline transition-colors">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Services */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-amber-300 uppercase tracking-wider">
              Covered Institutions
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Government District Civil Hospitals</li>
              <li>• Nationalized Public Banks</li>
              <li>• Tehsildar & Setu Facilitation Desks</li>
              <li>• Municipal Corporation CFC Centers</li>
              <li>• Diagnostic Pathology Laboratories</li>
            </ul>
          </div>

          {/* Col 4: Citizen Support & Helpdesk */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-xs text-amber-300 uppercase tracking-wider">
              Citizen Support & Helpdesk
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Centralized nodal support for token inquiries, counter verifications, and citizen grievances.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>1800-200-7833 (9 AM - 6 PM)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>support@queuewise.gov.in</span>
              </div>
            </div>
            <button
              onClick={() => setActiveView('contact')}
              className="mt-2 bg-white/10 hover:bg-white/15 text-amber-300 border border-white/20 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Contact Citizen Cell</span>
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          <div>{t.copyright}</div>
          <div className="text-[11px] text-slate-400">{t.disclaimer}</div>
        </div>
      </div>
    </footer>
  );
};
