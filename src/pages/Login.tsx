import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import type { RoleType } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, ArrowRight, Sun, Moon, Shield, Briefcase, UserPlus, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntrepreneurRegisterPage } from './EntrepreneurRegister';

type LoginTab = 'franchise' | 'entrepreneur';

const determineFranchiseRole = (user: any, profile?: any): RoleType => {
  if (profile?.franchiseLevel) return profile.franchiseLevel as RoleType;
  if (user?.franchiseLevel) return user.franchiseLevel as RoleType;
  const roles = (user?.roles || []).map((r: string) => r.toLowerCase());
  if (roles.includes('state_franchise') || roles.includes('state')) return 'state';
  if (roles.includes('district_franchise') || roles.includes('district')) return 'district';
  if (roles.includes('mandal_franchise') || roles.includes('mandal')) return 'mandal';
  return 'mandal';
};

export const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { login, loginAsEntrepreneur, entrepreneurs } = useRole();

  const [loginTab, setLoginTab] = useState<LoginTab>('franchise');
  const [showRegister, setShowRegister] = useState(false);

  // ── Franchise fields ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Entrepreneur fields ──
  const [entEmail, setEntEmail] = useState('');
  const [entPassword, setEntPassword] = useState('');
  const [entLoading, setEntLoading] = useState(false);
  const [entError, setEntError] = useState('');

  const handleFranchiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://server.apexbee.in/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Invalid email or password.');
      }

      const token = data.token;
      const user = data.user;

      const franchiseRoles = ['franchise', 'state_franchise', 'district_franchise', 'mandal_franchise', 'admin', 'state', 'district', 'mandal'];
      const hasFranchiseRole = user.roles?.some((r: string) => franchiseRoles.includes(r.toLowerCase())) || user.franchiseLevel;
      if (!hasFranchiseRole) {
        throw new Error('Access Denied: Your account does not have an active Franchise profile.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Automatically determine user's franchise role & territory from DB profile
      let detectedRole: RoleType = 'mandal';
      try {
        const profileRes = await fetch('https://server.apexbee.in/api/franchise/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const pData = await profileRes.json();
          if (pData.success && pData.franchise) {
            detectedRole = (pData.franchise.franchiseLevel as RoleType) || determineFranchiseRole(user, pData.franchise);
          } else {
            detectedRole = determineFranchiseRole(user);
          }
        } else {
          detectedRole = determineFranchiseRole(user);
        }
      } catch {
        detectedRole = determineFranchiseRole(user);
      }

      login(detectedRole);
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
    if (!entEmail || !entPassword) {
      setEntError('Please fill in email and password.');
      return;
    }
    setEntLoading(true);
    try {
      const res = await fetch('https://server.apexbee.in/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: entEmail, password: entPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Invalid email or password.');
      }

      const token = data.token;
      const user = data.user;

      const permittedRoles = ['entrepreneur', 'admin', 'agent'];
      const hasRole = user.roles?.some((r: string) => permittedRoles.includes(r.toLowerCase())) || user.role === 'entrepreneur';
      if (!hasRole) {
        throw new Error('Access Denied: Your account does not have an active Entrepreneur profile.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const found = entrepreneurs.find((en: any) => en.email === entEmail || en.phone === entEmail);
      loginAsEntrepreneur(found?.id || user.id || user._id);
    } catch (err: any) {
      console.error(err);
      setEntError(err.message || 'Login failed');
    } finally {
      setEntLoading(false);
    }
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
        className="w-full max-w-lg bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] shadow-2xl p-8 md:p-10 relative z-10">

        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Portal Authentication</h2>
          <p className="text-xs text-slate-400">Sign in with your registered credentials to access your designated territory</p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-7">
          <button onClick={() => setLoginTab('franchise')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${loginTab === 'franchise' ? 'bg-white dark:bg-dark-card shadow-md text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Shield size={15} /> Franchise Partner
          </button>
          <button onClick={() => setLoginTab('entrepreneur')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${loginTab === 'entrepreneur' ? 'bg-white dark:bg-dark-card shadow-md text-emerald-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Briefcase size={15} /> Entrepreneur <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Soon</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ── FRANCHISE LOGIN ── */}
          {loginTab === 'franchise' && (
            <motion.div key="franchise" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.2 }}>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center gap-2 text-xs font-medium mb-5">
                <Info size={16} className="shrink-0" />
                <span>Your assigned State, District, or Mandal territory will load automatically upon login.</span>
              </div>

              <form onSubmit={handleFranchiseSubmit} className="space-y-4">
                {error && <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold">{error}</div>}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email or Mobile Number</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="text" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="franchise@apexbee.in"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
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

          {/* ── ENTREPRENEUR LOGIN (COMING SOON) ── */}
          {loginTab === 'entrepreneur' && (
            <motion.div key="entrepreneur" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
                🚀
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Coming Soon
                </span>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Entrepreneur Portal</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  We are finalizing the dedicated Entrepreneur & Agent workspace. Access for this section is launching soon!
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setLoginTab('franchise')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-lg shadow-primary/25 hover:bg-blue-600 transition-all cursor-pointer"
                >
                  <Shield size={15} />
                  <span>Switch to Franchise Partner Login</span>
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
