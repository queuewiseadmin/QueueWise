import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
  reason?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccess,
  reason
}) => {
  const { loginUser, setActiveView } = useQueue();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const success = loginUser(email.trim(), 'citizen');
    if (success) {
      setError('');
      onClose();
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveView('dashboard');
      }
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('citizen@queuewise.gov.in');
    setPassword('citizen123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 text-white flex items-center justify-between bg-[#002D62] border-b border-[#001F45]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <User className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Citizen Portal Login
              </h2>
              <p className="text-[10px] text-slate-300">
                Track and manage your public queue tokens
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {reason && (
            <div className="bg-amber-50 border border-amber-300 text-amber-950 p-3 rounded-xl text-xs flex items-start space-x-2">
              <span className="font-bold text-amber-700">★</span>
              <p className="leading-relaxed font-medium">{reason}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Registered Email Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                id="input-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@queuewise.gov.in"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                id="input-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 pl-8.5 focus:outline-none focus:ring-1 focus:ring-[#002D62] focus:border-[#002D62]"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-sm text-[#002D62] focus:ring-[#002D62]"
              />
              <span>Remember Me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset verification link sent to your registered email/mobile.'); }} className="text-[#002D62] font-medium hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            id="btn-submit-login"
            className="w-full bg-[#002D62] hover:bg-[#001F45] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs"
          >
            <span>Login to Citizen Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick Access Demo Credentials */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Quick Test Fill:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-[#002D62] font-semibold text-[11px] transition-colors"
            >
              Fill Citizen Demo Account
            </button>
          </div>

          <div className="text-center pt-2 text-slate-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => { onClose(); onSwitchToRegister(); }}
              className="text-[#002D62] font-bold hover:underline"
            >
              Create Citizen Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
