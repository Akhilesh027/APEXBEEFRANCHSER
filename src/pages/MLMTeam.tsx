import React, { useState } from 'react';
import { GitFork, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRole } from '../context/RoleContext';

export const MLMTeamPage: React.FC = () => {
  const { subFranchises, entrepreneurs, vendors } = useRole();
  const [level, setLevel] = useState<'all' | '1' | '2' | '3'>('all');

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const level1Team = subFranchises.map(sf => {
    const typeLabel = sf.franchiseLevel === 'district' ? 'District Partner' : 'Mandal Partner';
    const revenue = sf.revenue;
    return {
      name: sf.businessName || sf.ownerName || 'Sub Franchise',
      type: typeLabel,
      mandals: sf.franchiseLevel === 'district' ? 5 : 1,
      revenue,
      commission: sf.commissionEarned || (revenue * 0.05)
    };
  });

  const level2Team = entrepreneurs.map(ent => {
    const revenue = ent.salesRevenue || 120000;
    return {
      name: ent.name || 'Entrepreneur Partner',
      type: 'Entrepreneur',
      vendors: ent.vendorsAcquired || 0,
      revenue,
      commission: ent.commissionEarned || (revenue * 0.03)
    };
  });

  const level3Team = vendors.map(v => {
    const revenue = v.sales || 45000;
    return {
      name: v.name || 'Vendor Partner',
      type: 'Vendor',
      sales: v.orders || 0,
      revenue,
      commission: (revenue * 0.02)
    };
  });

  const getFilteredTeam = () => {
    if (level === '1') return level1Team.map(t => ({ ...t, lvl: 1, detail: `${t.mandals} active Mandals` }));
    if (level === '2') return level2Team.map(t => ({ ...t, lvl: 2, detail: `${t.vendors} active Vendors` }));
    if (level === '3') return level3Team.map(t => ({ ...t, lvl: 3, detail: `${t.sales} completed orders` }));

    // Combine all
    return [
      ...level1Team.map(t => ({ ...t, lvl: 1, detail: `${t.mandals} active Mandals` })),
      ...level2Team.map(t => ({ ...t, lvl: 2, detail: `${t.vendors} active Vendors` })),
      ...level3Team.map(t => ({ ...t, lvl: 3, detail: `${t.sales} completed orders` }))
    ];
  };

  const team = getFilteredTeam();
  const totalComm = level1Team.reduce((acc, t) => acc + t.commission, 0) +
    level2Team.reduce((acc, t) => acc + t.commission, 0) +
    level3Team.reduce((acc, t) => acc + t.commission, 0);

  const totalRevenue = level1Team.reduce((acc, t) => acc + t.revenue, 0) +
    level2Team.reduce((acc, t) => acc + t.revenue, 0) +
    level3Team.reduce((acc, t) => acc + t.revenue, 0);

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
            <GitFork size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">MLM Team Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monitor multi-level referral levels, team volume, and commissions splits</p>
          </div>
        </div>

        {/* Level filter dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filter Tier</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1 (Direct Districts/Mandals)</option>
            <option value="2">Level 2 (Indirect Entrepreneurs)</option>
            <option value="3">Level 3 (Indirect Vendors)</option>
          </select>
        </div>
      </div>

      {/* MLM Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MLM Team Size</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{level1Team.length + level2Team.length + level3Team.length} active members</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Accumulated Team Revenue</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{formatINR(totalRevenue)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MLM Commissions</span>
          <span className="text-xl font-extrabold text-emerald-500 mt-1 block">{formatINR(totalComm)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Team Growth MoM</span>
          <span className="text-xs font-bold text-slate-850 dark:text-slate-250 mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            +18.2% Growth
          </span>
        </div>
      </div>

      {/* Team table list */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Team Member</th>
                <th className="py-4 px-6">Hierarchy Level</th>
                <th className="py-4 px-6">Role Details</th>
                <th className="py-4 px-6">Gross Revenue (₹)</th>
                <th className="py-4 px-6">MLM Commission (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {team.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-450 dark:text-slate-400 font-medium">
                    No MLM team members found at this level.
                  </td>
                </tr>
              ) : (
                team.map((member, index) => (
                  <tr key={`${member.name}-${index}`} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-200">{member.name}</td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        Level {member.lvl}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">
                      {member.type} ({member.detail})
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300">{formatINR(member.revenue)}</td>
                    <td className="py-4 px-6 font-extrabold text-emerald-500">{formatINR(member.commission)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
