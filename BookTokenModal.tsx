import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Lock
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface BookTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedOrgId?: string | null;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const BookTokenModal: React.FC<BookTokenModalProps> = ({
  isOpen,
  onClose,
  preSelectedOrgId,
  onOpenLogin,
  onOpenRegister
}) => {
  const { 
    organizations, 
    bookToken, 
    currentUser, 
    language, 
    t, 
    getServiceQueueInfo 
  } = useQueue();

  const [selectedOrgId, setSelectedOrgId] = useState<string>(preSelectedOrgId || organizations[0]?.id || 'org-hospital');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  const [citizenName, setCitizenName] = useState('');
  const [citizenMobile, setCitizenMobile] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; service?: string }>({});

  // Sync pre-selected org
  useEffect(() => {
    if (preSelectedOrgId) {
      setSelectedOrgId(preSelectedOrgId);
    }
  }, [preSelectedOrgId]);

  // Autofill user info if logged in
  useEffect(() => {
    if (currentUser) {
      setCitizenName(currentUser.name || '');
      setCitizenMobile(currentUser.mobile || '');
      setCitizenEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Selected Org Object
  const currentOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  // Set default branch when org changes
  useEffect(() => {
    if (currentOrg && currentOrg.branches.length > 0) {
      setSelectedBranchId(currentOrg.branches[0].id);
    }
  }, [selectedOrgId, currentOrg]);

  // Selected Branch Object
  const currentBranch = currentOrg?.branches.find(b => b.id === selectedBranchId) || currentOrg?.branches[0];

  // Set default dept when branch changes
  useEffect(() => {
    if (currentBranch && currentBranch.departments.length > 0) {
      setSelectedDeptId(currentBranch.departments[0].id);
    }
  }, [selectedBranchId, currentBranch]);

  // Selected Department Object
  const currentDept = currentBranch?.departments.find(d => d.id === selectedDeptId) || currentBranch?.departments[0];

  // Set default service when dept changes
  useEffect(() => {
    if (currentDept && currentDept.services.length > 0) {
      setSelectedServiceId(currentDept.services[0].id);
    }
  }, [selectedDeptId, currentDept]);

  // Selected Service Object
  const currentService = currentDept?.services.find(s => s.id === selectedServiceId) || currentDept?.services[0];

  // Get live queue info for this service
  const queueInfo = currentService ? getServiceQueueInfo(currentService.id) : null;

  if (!isOpen) return null;

  // Compulsory Login Gate for Token Booking
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 text-center space-y-4 my-auto">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-[#002D62] flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-6 h-6 text-[#002D62]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Citizen Login / Registration Compulsory
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To book an official digital queue token, you must sign in or register with your verified mobile number.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenLogin?.();
              }}
              className="bg-[#002D62] hover:bg-[#001F45] text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Sign In to Book
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenRegister?.();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Register New Account
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: { name?: string; mobile?: string; service?: string } = {};
    if (!citizenName.trim()) {
      newErrors.name = 'Please enter citizen full name';
    }
    if (!citizenMobile.trim() || !/^\d{10}$/.test(citizenMobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!selectedServiceId) {
      newErrors.service = 'Please select a service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    bookToken({
      organizationId: selectedOrgId,
      branchId: selectedBranchId,
      departmentId: selectedDeptId,
      serviceId: selectedServiceId,
      citizenName: citizenName.trim(),
      citizenMobile: citizenMobile.trim(),
      citizenEmail: citizenEmail.trim() || undefined,
      isSeniorCitizenOrPriority: isSeniorCitizen,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#002D62] text-white px-6 py-4 flex items-center justify-between border-b border-[#001F45]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {t.bookingModalTitle}
              </h2>
              <p className="text-[11px] text-slate-300">
                Official Digital Queue Token Slip Reservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            id="btn-close-book-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          {/* Verified Citizen Account Banner */}
          <div className="bg-blue-50 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between text-xs text-[#002D62]">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block text-slate-900">Verified Citizen Account</span>
                <span className="text-[11px] text-slate-600">{currentUser.name} &bull; {currentUser.mobile}</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase">
              Authenticated
            </span>
          </div>

          {/* Step 1: Organization */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
              {t.selectOrgLabel} <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {organizations.map(org => (
                <button
                  type="button"
                  key={org.id}
                  onClick={() => setSelectedOrgId(org.id)}
                  className={`p-3 text-left border rounded-lg transition-all flex items-center space-x-2.5 ${
                    selectedOrgId === org.id
                      ? 'bg-blue-50 border-[#002D62] text-[#002D62] font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#002D62] shrink-0" />
                  <span className="text-xs truncate font-medium">{language === 'mr' ? org.marathiName : org.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Branch Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                {t.selectBranchLabel} <span className="text-red-600">*</span>
              </label>
              <select
                id="select-branch"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              >
                {currentOrg?.branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {language === 'mr' ? b.marathiName : b.name}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500 mt-1">
                Hours: {currentBranch?.operatingHours}
              </div>
            </div>

            {/* Step 3: Department */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                {t.selectDeptLabel} <span className="text-red-600">*</span>
              </label>
              <select
                id="select-department"
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              >
                {currentBranch?.departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {language === 'mr' ? d.marathiName : d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 4: Specific Service */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
              {t.selectServiceLabel} <span className="text-red-600">*</span>
            </label>
            <select
              id="select-service"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
            >
              {currentDept?.services.map(s => (
                <option key={s.id} value={s.id}>
                  {language === 'mr' ? s.marathiName : s.name} ({s.codePrefix}) - {s.activeCounter}
                </option>
              ))}
            </select>
            {currentService && (
              <p className="text-[11px] text-slate-600 mt-1">
                {currentService.description}
              </p>
            )}
          </div>

          {/* Real-time Waiting Estimate Preview Box */}
          {queueInfo && currentService && (
            <div className="bg-[#F2F4F7] border border-slate-200 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Currently Running:</span>
                <span className="font-mono font-bold text-[#002D62] text-sm">{queueInfo.currentRunningTokenNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Citizens in Queue:</span>
                <span className="font-bold text-slate-800 text-sm">{queueInfo.totalWaiting} Ahead</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Est. Waiting Time:</span>
                <span className="font-bold text-amber-700 text-sm">~{queueInfo.totalWaiting * currentService.averageServiceTimeMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Assigned Desk:</span>
                <span className="font-bold text-slate-800 text-xs">{currentService.activeCounter}</span>
              </div>
            </div>
          )}

          {/* Step 5: Citizen Contact Details */}
          <div className="border-t border-slate-200 pt-3.5 space-y-3.5">
            <div className="text-xs font-bold text-[#002D62] uppercase">
              Citizen Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.citizenNameLabel} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="input-citizen-name"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.citizenMobileLabel} <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="input-citizen-mobile"
                  value={citizenMobile}
                  onChange={(e) => setCitizenMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                />
                {errors.mobile && <p className="text-[11px] text-red-600 mt-0.5">{errors.mobile}</p>}
              </div>
            </div>

            {/* Senior citizen / priority */}
            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-lg flex items-center space-x-2.5">
              <input
                type="checkbox"
                id="checkbox-priority"
                checked={isSeniorCitizen}
                onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                className="w-4 h-4 text-[#002D62] border-slate-300 rounded-sm focus:ring-[#002D62]"
              />
              <label htmlFor="checkbox-priority" className="text-xs text-amber-900 font-medium cursor-pointer">
                {t.priorityLabel}
              </label>
            </div>

            {/* Purpose / Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.notesLabel}
              </label>
              <input
                type="text"
                id="input-token-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Renewal of senior citizen card / Caste certificate query"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002D62]"
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-generate-token"
              className="px-5 py-2.5 bg-[#002D62] hover:bg-[#001F45] text-white text-xs font-bold rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
            >
              <span>{t.btnGenerateToken}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
