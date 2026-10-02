import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  ArrowRight, 
  KeyRound,
  Users
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface AdminLoginScreenProps {
  onBackToCitizen?: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onBackToCitizen }) => {
  const { loginAdmin, setPortalMode } = useQueue();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrator username/email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginAdmin(username.trim(), password);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Access Denied. Invalid Administrator credentials.');
      }
    }, 300);
  };

  const handleReturnToCitizen = () => {
    if (onBackToCitizen) {
      onBackToCitizen();
    } else {
      setPortalMode('citizen');
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Government Security Header */}
      <header className="border-b border-slate-800 bg-[#0B1324]/90 px-6 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Government of Maharashtra
                </span>
                <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                  Restricted Access Tier-1
                </span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                QueueWise Central Administrator & Officer Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReturnToCitizen}
              className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Back to Citizen Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-xl space-y-6">
          {/* Card Container */}
          <div className="bg-[#111C32] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Authorized Personnel Login
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Sign in to Admin Command Center
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access is strictly restricted to designated Nodal Directors and Operations Administrators. All access attempts and citizen queue activities are audited and dispatched to <span className="text-amber-300 font-mono font-bold">queuewise.admin@gmail.com</span>.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-950/40 border border-rose-500/50 text-rose-200 p-3.5 rounded-xl text-xs flex items-start space-x-2.5 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Authentication Failed</span>
                  <p className="text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Administrator Username / Email ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter assigned administrator email"
                    className="w-full bg-[#0A1120] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-300">
                    Administrator Security Password
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Case-sensitive</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0A1120] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/10 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authenticate & Access Portal</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Email Dispatch Notice */}
            <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                Connected to Admin Gmail: <strong className="text-emerald-400 font-mono">queuewise.admin@gmail.com</strong> for instant booking alerts.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B1324] px-6 py-4 text-center text-xs text-slate-500">
        QueueWise Civic Portal System &bull; State Digital Gateway Security Protocol &bull; Restricted for Nodal Administrators
      </footer>
    </div>
  );
};
