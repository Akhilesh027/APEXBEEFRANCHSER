import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';

import { Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const PerformancePage: React.FC = () => {
  const { partner } = useRole();

  const [targets, setTargets] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getBadgeDetails = (percentage: number) => {
    if (percentage >= 95) {
      return { name: 'Diamond Partner', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/5', border: 'border-cyan-400/30' };
    }
    if (percentage >= 85) {
      return { name: 'Platinum Partner', color: 'from-indigo-400 to-purple-500', bg: 'bg-purple-500/5', border: 'border-purple-400/30' };
    }
    if (percentage >= 75) {
      return { name: 'Gold Partner', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500/5', border: 'border-amber-400/30' };
    }
    return { name: 'Silver Partner', color: 'from-slate-400 to-slate-500', bg: 'bg-slate-500/5', border: 'border-slate-400/30' };
  };

  // Fetch performance data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('https://server.apexbee.in/api/franchise/performance', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTargets(data.targets || []);
          setHistoryData(data.historyData || []);
        }
      })
      .catch(err => {
        console.error('Error fetching performance:', err);
      });
  }, []);

  const pct = Math.round((partner.achievedRevenue / partner.targetRevenue) * 100) || 0;
  const badge = getBadgeDetails(pct);

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
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Performance Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">Audit monthly and yearly target quotas and unlock achievement badges</p>
          </div>
        </div>

        {/* Badge status */}
        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border ${badge.border} ${badge.bg}`}>
          <Award size={16} className={`bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`} />
          <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200">{badge.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Targets List */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Current Acquisition Quotas</h3>
          
          <div className="space-y-4">
            {targets.map(t => {
              const cpct = Math.round((t.achieved / t.target) * 100);
              return (
                <div key={t.label} className="space-y-2">
                  <div className="flex items-end justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{t.label}</span>
                    <span className="text-[10px] text-slate-400">
                      {t.isCurrency ? formatINR(t.achieved) : t.achieved} / {t.isCurrency ? formatINR(t.target) : t.target} ({cpct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${cpct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics Card */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4">Target Completion Trend</h3>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pctCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="month" fontSize={10} stroke="#94A3B8" tickLine={false} />
                  <YAxis fontSize={10} stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#pctCurve)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-2xl space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Rate KPI</span>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-250">
              <span>MoM growth rate:</span>
              <span className="text-emerald-550">+12% MoM</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-250 mt-1">
              <span>Fulfillment rate:</span>
              <span className="text-slate-800 dark:text-slate-150">92%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
