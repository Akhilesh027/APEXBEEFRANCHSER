import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, ToggleLeft, ToggleRight, History } from 'lucide-react';
import { motion } from 'framer-motion';

export const SecurityPage: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Logins list state
  const [loginsList, setLoginsList] = useState<any[]>([]);

  const fetchLogins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://server.apexbee.in/api/franchise/security/logins', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.logins) {
        setLoginsList(data.logins);
      }
    } catch (err) {
      console.error('Error fetching login history:', err);
    }
  };

  useEffect(() => {
    fetchLogins();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    setErrorMsg('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://server.apexbee.in/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setOldPass('');
        setNewPass('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setErrorMsg(data.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Security Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage password credentials, configure 2FA login controls, and monitor active sessions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Password form */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <Lock className="text-primary" size={18} />
            <span>Update Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {success && (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl text-xs font-semibold">
                Password updated successfully!
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Password</label>
              <input
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* 2FA and History logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 2FA Toggle */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                <Smartphone size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Two-Factor Authentication</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Secure logins by requiring a verification code sent to your phone</p>
              </div>
            </div>

            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              {twoFactor ? (
                <ToggleRight size={38} className="text-emerald-500" />
              ) : (
                <ToggleLeft size={38} />
              )}
            </button>
          </div>

          {/* Session history */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <History className="text-primary" size={18} />
              <span>Session Login History</span>
            </h3>

            <div className="space-y-3">
              {loginsList.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No login logs recorded yet.</p>
              ) : (
                loginsList.map((log, idx) => (
                  <div
                    key={log._id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.browser} / {log.device}</span>
                      <span className="text-[10px] text-slate-400 block">
                        IP: {log.ipAddress || 'Unknown'} • Status: {' '}
                        <span className={log.status === 'success' ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                          {log.status}
                        </span>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {log.loginTime ? new Date(log.loginTime).toISOString().replace('T', ' ').substring(0, 16) : 'N/A'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>

  );
};
