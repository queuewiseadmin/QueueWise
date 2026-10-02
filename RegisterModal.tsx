import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
  reason?: string;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
  reason
}) => {
  const { setCurrentUser, setActiveView } = useQueue();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Enter a valid email address';
    }
    if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      role: 'citizen' as const,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    onClose();
    if (onSuccess) {
      onSuccess();
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-[#002D62] p-5 text-white flex items-center justify-between border-b border-[#001F45]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <UserPlus className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Citizen Portal Registration
              </h2>
              <p className="text-[10px] text-slate-300">
                Register to track digital queue tokens and receive real-time updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRegister} className="p-6 space-y-3.5 text-xs">
          {reason && (
            <div className="bg-amber-50 border border-amber-300 text-amber-950 p-3 rounded-xl text-xs flex items-start space-x-2">
              <span className="font-bold text-amber-700">★</span>
              <p className="leading-relaxed font-medium">{reason}</p>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mobile Number <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="reg-mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                placeholder="e.g. 9876543210"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              />
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.mobile && <p className="text-[11px] text-red-600 mt-0.5">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ramesh.patil@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="reg-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-0.5">{errors.password}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="reg-confirm-pass"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-600 mt-0.5">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-register"
            className="w-full bg-[#002D62] hover:bg-[#001F45] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs mt-3"
          >
            <span>Create Citizen Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="text-center pt-2 text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { onClose(); onSwitchToLogin(); }}
              className="text-[#002D62] font-bold hover:underline"
            >
              Login Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
