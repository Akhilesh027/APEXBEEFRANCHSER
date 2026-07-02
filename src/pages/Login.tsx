import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import type { RoleType } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, ArrowRight, Sun, Moon, MapPin, Award, Shield, Briefcase, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntrepreneurRegisterPage } from './EntrepreneurRegister';
// import removed: '../types';

type LoginTab = 'franchise' | 'entrepreneur';

export const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { login, loginAsEntrepreneur, entrepreneurs } = useRole();

  const [loginTab, setLoginTab] = useState<LoginTab>('franchise');
  const [showRegister, setShowRegister] = useState(false);

  // ── Franchise fields ──
  const [selectedRole, setSelectedRole] = useState<'state' | 'district' | 'mandal'>('state');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Entrepreneur fields ──
  const [entEmail, setEntEmail] = useState('');
  const [entPassword, setEntPassword] = useState('');
  const [entLoading, setEntLoading] = useState(false);
  const [entError, setEntError] = useState('');

  const handleRolePreset = (role: 'state' | 'district' | 'mandal') => {
    setSelectedRole(role);
    setError('');
  };

  const handleFranchiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all credentials.'); return; }
    setLoading(true);
    try {
      const res = await fetch('https://server.apexbee.in/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await res.json();
      const token = data.token;
      const user = data.user;

      const franchiseRoles = ['franchise', 'state_franchise', 'district_franchise', 'mandal_franchise', 'admin'];
      const hasFranchiseRole = user.roles?.some((r: string) => franchiseRoles.includes(r.toLowerCase()));
      if (!hasFranchiseRole) {
        throw new Error('Access Denied: You do not have an active Franchise profile.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      login(selectedRole as RoleType);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEntrepreneurLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEntError('');
    if (!entEmail || !entPassword) { setEntError('Please fill in email and password.'); return; }
    setEntLoading(true);
    try {
      const res = await fetch('https://server.apexbee.in/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: entEmail, password: entPassword })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await res.json();
      const token = data.token;
      const user = data.user;

      const permittedRoles = ['entrepreneur', 'admin'];
      const hasRole = user.roles?.some((r: string) => permittedRoles.includes(r.toLowerCase()));
      if (!hasRole) {
        throw new Error('Access Denied: You do not have an active Entrepreneur profile.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Match against registered entrepreneur node or fallback to user id
      const found = entrepreneurs.find((en: any) => en.email === entEmail);
      loginAsEntrepreneur(found?.id || user.id || user._id);
    } catch (err: any) {
      console.error(err);
      setEntError(err.message || 'Login failed');
    } finally {
      setEntLoading(false);
    }
  };

  const getRoleStyle = (role: 'state' | 'district' | 'mandal') => {
    if (selectedRole === role) {
      if (role === 'state') return 'border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/5';
      if (role === 'district') return 'border-amber-500/60 bg-amber-500/5 dark:bg-amber-500/10 shadow-lg shadow-amber-500/5';
      return 'border-indigo-500/60 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/5';
    }
    return 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-dark-card/40';
  };

  if (showRegister) {
    return <EntrepreneurRegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark text-slate-800 dark:text-slate-100 p-4 transition-colors duration-250 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-primary/30">A</div>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">ApexBee</span>
        </div>
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white/60 dark:bg-dark-card/60 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Login Card */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] shadow-2xl p-8 md:p-10 relative z-10">

        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">ApexBee Portal Access</h2>
          <p className="text-xs text-slate-400">Select your role and sign in to your workspace</p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-7">
          <button onClick={() => setLoginTab('franchise')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${loginTab === 'franchise' ? 'bg-white dark:bg-dark-card shadow-md text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Shield size={14} /> Franchise Partner
          </button>
          <button onClick={() => setLoginTab('entrepreneur')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${loginTab === 'entrepreneur' ? 'bg-white dark:bg-dark-card shadow-md text-emerald-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Briefcase size={14} /> Entrepreneur
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ── FRANCHISE LOGIN ── */}
          {loginTab === 'franchise' && (
            <motion.div key="franchise" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.2 }}>
              <div className="space-y-3.5 mb-7">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Role Profile</label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleRolePreset('state')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${getRoleStyle('state')}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className={`p-1.5 rounded-lg text-emerald-600 ${selectedRole === 'state' ? 'bg-emerald-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}><Award size={16} /></span>
                      {selectedRole === 'state' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                    <div className="mt-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">State Partner</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">AP State Region</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => handleRolePreset('district')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${getRoleStyle('district')}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className={`p-1.5 rounded-lg text-amber-600 ${selectedRole === 'district' ? 'bg-amber-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}><MapPin size={16} /></span>
                      {selectedRole === 'district' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                    <div className="mt-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">District Partner</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Nellore District</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => handleRolePreset('mandal')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${getRoleStyle('mandal')}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className={`p-1.5 rounded-lg text-indigo-600 ${selectedRole === 'mandal' ? 'bg-indigo-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}><Shield size={16} /></span>
                      {selectedRole === 'mandal' && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                    </div>
                    <div className="mt-3">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Mandal Partner</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Buchi Mandal</p>
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleFranchiseSubmit} className="space-y-4">
                {error && <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold">{error}</div>}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Partner Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 transition-colors" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-lg shadow-primary/25 hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-75 mt-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Enter Franchise Console</span><ArrowRight size={15} /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── ENTREPRENEUR LOGIN ── */}
          {loginTab === 'entrepreneur' && (
            <motion.div key="entrepreneur" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>


              <form onSubmit={handleEntrepreneurLogin} className="space-y-4">
                {entError && <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold">{entError}</div>}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Entrepreneur Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="email" required value={entEmail} onChange={e => setEntEmail(e.target.value)}
                      placeholder="your-email@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 transition-colors" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="password" required value={entPassword} onChange={e => setEntPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={entLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-75 mt-2">
                  {entLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Briefcase size={14} /><span>Enter Entrepreneur Portal</span><ArrowRight size={14} /></>}
                </button>
              </form>

              {/* Register CTA */}
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
                <p className="text-xs text-slate-400">New to ApexBee? Join as an Entrepreneur</p>
                <button onClick={() => setShowRegister(true)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/10 cursor-pointer transition-all">
                  <UserPlus size={14} /> Register as Entrepreneur
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
        © 2026 ApexBee Solutions. Secure Enterprise Network.
      </div>
    </div>
  );
};
