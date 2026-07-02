import React from 'react';
import { useRole } from '../context/RoleContext';
import { Award, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const TargetAchievement: React.FC = () => {
  const { partner } = useRole();

  const target = partner.targetRevenue;
  const achieved = partner.achievedRevenue;
  const pct = Math.round((achieved / target) * 100);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Determine Badge based on performance percentage
  const getBadgeDetails = (percentage: number) => {
    if (percentage >= 95) {
      return {
        name: 'Diamond Partner',
        color: 'from-cyan-400 via-teal-400 to-blue-500',
        textColor: 'text-cyan-600 dark:text-cyan-400',
        borderColor: 'border-cyan-400/30',
        bg: 'bg-cyan-500/5',
        desc: 'Top 1% franchise performance. Exceeding targets!'
      };
    }
    if (percentage >= 85) {
      return {
        name: 'Platinum Partner',
        color: 'from-indigo-400 via-purple-400 to-pink-500',
        textColor: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-400/30',
        bg: 'bg-purple-500/5',
        desc: 'Outstanding performance, leading target conversions.'
      };
    }
    if (percentage >= 75) {
      return {
        name: 'Gold Partner',
        color: 'from-amber-400 via-yellow-300 to-orange-400',
        textColor: 'text-amber-600 dark:text-amber-400',
        borderColor: 'border-amber-400/30',
        bg: 'bg-amber-500/5',
        desc: 'Excellent track record, hitting monthly targets.'
      };
    }
    return {
      name: 'Silver Partner',
      color: 'from-slate-400 via-slate-300 to-slate-500',
      textColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-400/30',
      bg: 'bg-slate-500/5',
      desc: 'Active partner. Driving sales in regional sectors.'
    };
  };

  const badge = getBadgeDetails(pct);

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gradient-to-br ${badge.color} opacity-10 dark:opacity-20 blur-3xl`} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Targets & Progress</h3>
            <p className="text-xs text-slate-400">Monthly revenue allocation goal</p>
          </div>
        </div>
        
        {/* Animated Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${badge.borderColor} ${badge.bg}`}
        >
          <Award size={16} className={`bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`} />
          <span className={`text-xs font-extrabold ${badge.textColor}`}>{badge.name}</span>
        </motion.div>
      </div>

      {/* Target Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Achieved</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {formatINR(achieved)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Target Goal</span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {formatINR(target)}
            </span>
          </div>
        </div>

        {/* Progress Tracker Slider */}
        <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-700/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r from-primary to-blue-400 relative`}
          >
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-md shadow-black/30" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>Target completion rate:</span>
            <span className="text-slate-700 dark:text-slate-200 font-bold">{pct}%</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <CheckCircle size={12} className="text-emerald-500" />
            <span>{formatINR(target - achieved)} remaining</span>
          </div>
        </div>

        {/* Description Label */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/20 text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
          <strong>Status Report:</strong> {badge.desc}
        </div>
      </div>
    </div>
  );
};
