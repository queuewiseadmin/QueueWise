import React from 'react';
import { Hospital, Landmark, Building2, ArrowRight, Clock, Check, ChevronRight } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface OrganizationTilesProps {
  onSelectOrg?: (orgId: string) => void;
  onOpenBookToken?: (orgId?: string) => void;
}

export const OrganizationTiles: React.FC<OrganizationTilesProps> = ({ onSelectOrg, onOpenBookToken }) => {
  const { t, language, organizations } = useQueue();

  const handleSelect = (orgId: string) => {
    if (onSelectOrg) {
      onSelectOrg(orgId);
    } else if (onOpenBookToken) {
      onOpenBookToken(orgId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Hospital className="w-8 h-8 text-blue-800" />;
      case 'bank':
        return <Landmark className="w-8 h-8 text-blue-800" />;
      case 'government_office':
      default:
        return <Building2 className="w-8 h-8 text-blue-800" />;
    }
  };

  return (
    <section id="services-section" className="py-12 bg-[#F2F4F7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#002D62] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-md mb-2">
            PUBLIC SERVICE CATEGORIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
            {t.chooseServiceTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {t.chooseServiceSub}
          </p>
        </div>

        {/* The 3 Target Service Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {organizations.map((org) => {
            const isMr = language === 'mr';
            const orgName = isMr && org.marathiName ? org.marathiName : org.name;
            const orgDesc = isMr && org.marathiDescription ? org.marathiDescription : org.description;

            // Sample department highlights
            const sampleDepts = org.branches[0]?.departments.map(d => isMr ? d.marathiName : d.name).slice(0, 3) || [];

            return (
              <div
                key={org.id}
                id={`org-tile-${org.type}`}
                className="bg-white border border-slate-200 hover:border-[#002D62] rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-blue-50 border border-blue-200/80 rounded-lg flex items-center justify-center group-hover:bg-[#002D62] group-hover:text-white transition-colors">
                      {React.cloneElement(getIcon(org.type) as React.ReactElement, {
                        className: 'w-8 h-8 text-[#002D62] group-hover:text-white transition-colors'
                      })}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      {org.badge}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="text-lg font-bold text-[#002D62] mb-2 font-sans">
                    {orgName}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {orgDesc}
                  </p>

                  {/* Department Highlights */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-lg mb-5">
                    <div className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                      Available Departments:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {sampleDepts.map((deptName, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#002D62] shrink-0"></span>
                          <span className="truncate">{deptName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Book Token Button */}
                <button
                  id={`btn-book-org-${org.id}`}
                  onClick={() => handleSelect(org.id)}
                  className="w-full bg-[#002D62] hover:bg-[#001F45] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 border border-[#001F45] shadow-xs active:scale-[0.98]"
                >
                  <span>{t.btnBookToken}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
