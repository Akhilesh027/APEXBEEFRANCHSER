import React, { useState } from 'react';
import { GitFork, TrendingUp, MapPin, Users, ShoppingBag, Building2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRole } from '../context/RoleContext';

export const MLMTeamPage: React.FC = () => {
  const { subFranchises, entrepreneurs, vendors } = useRole();
  const [level, setLevel] = useState<'all' | '1' | '2' | '3'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const level1Team = subFranchises.map(sf => {
    const typeLabel = sf.franchiseLevel === 'district' ? '🏛️ District Franchise' : '📍 Mandal Franchise';
    const territory = sf.franchiseLevel === 'district'
      ? `${sf.district || ''}, ${sf.state || ''}`
      : `${sf.mandal || ''}, ${sf.district || ''}, ${sf.state || ''}`;
    const revenue = sf.revenue || 0;
    return {
      name: sf.businessName || sf.ownerName || 'Sub Franchise',
      type: typeLabel,
      franchiseLevel: sf.franchiseLevel,
      territory,
      phone: sf.mobile || sf.phone || '',
      email: sf.email || '',
      status: sf.status || 'active',
      revenue,
      commission: sf.commissionEarned || (revenue * 0.05)
    };
  });

  const level2Team = entrepreneurs.map(ent => {
    const revenue = ent.salesRevenue || 0;
    return {
      name: ent.name || 'Entrepreneur Partner',
      type: '🚀 Entrepreneur',
      franchiseLevel: 'entrepreneur',
      territory: `${ent.mandal || ent.district || ''}, ${ent.state || ''}`,
      phone: (ent as any).mobile || ent.phone || '',
      email: ent.email || '',
      status: ent.status || 'active',
      vendors: ent.vendorsAcquired || 0,
      revenue,
      commission: ent.commissionEarned || (revenue * 0.03)
    };
  });

  const level3Team = vendors.map(v => {
    const revenue = (v as any).sales || 0;
    return {
      name: (v as any).businessName || v.name || 'Vendor Partner',
      type: '🏪 Vendor',
      franchiseLevel: 'vendor',
      territory: '',
      phone: (v as any).mobile || (v as any).phone || '',
      email: (v as any).email || '',
      status: v.status || 'active',
      sales: v.orders || 0,
      revenue,
      commission: (revenue * 0.02)
    };
  });

  const getFilteredTeam = () => {
    if (level === '1') return level1Team.map(t => ({ ...t, lvl: 1, detail: t.territory }));
    if (level === '2') return level2Team.map(t => ({ ...t, lvl: 2, detail: `${(t as any).vendors || 0} vendors acquired` }));
    if (level === '3') return level3Team.map(t => ({ ...t, lvl: 3, detail: `${(t as any).sales || 0} completed orders` }));

    return [
      ...level1Team.map(t => ({ ...t, lvl: 1, detail: t.territory })),
      ...level2Team.map(t => ({ ...t, lvl: 2, detail: `${(t as any).vendors || 0} vendors acquired` })),
      ...level3Team.map(t => ({ ...t, lvl: 3, detail: `${(t as any).sales || 0} completed orders` }))
    ];
  };

  let team = getFilteredTeam();

  // Apply search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    team = team.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.detail.toLowerCase().includes(q) ||
      m.territory?.toLowerCase().includes(q)
    );
  }

  const totalComm = level1Team.reduce((acc, t) => acc + t.commission, 0) +
    level2Team.reduce((acc, t) => acc + t.commission, 0) +
    level3Team.reduce((acc, t) => acc + t.commission, 0);

  const totalRevenue = level1Team.reduce((acc, t) => acc + t.revenue, 0) +
    level2Team.reduce((acc, t) => acc + t.revenue, 0) +
    level3Team.reduce((acc, t) => acc + t.revenue, 0);

  const districtCount = subFranchises.filter(sf => sf.franchiseLevel === 'district').length;
  const mandalCount = subFranchises.filter(sf => sf.franchiseLevel === 'mandal').length;

  const getLevelBadge = (lvl: number, franchiseLevel?: string) => {
    if (lvl === 1) {
      if (franchiseLevel === 'district') {
        return { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20', label: 'L1 – District' };
      }
      return { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20', label: 'L1 – Mandal' };
    }
    if (lvl === 2) return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', label: 'L2 – Entrepreneur' };
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', label: 'L3 – Vendor' };
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', label: '● Active' };
    if (status === 'inactive') return { bg: 'bg-slate-400/10', text: 'text-slate-500', border: 'border-slate-400/20', label: '○ Inactive' };
    return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', label: '◌ Pending' };
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
            <GitFork size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">MLM Team Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monitor multi-level referral levels, team volume, and commissions splits</p>
          </div>
        </div>

        {/* Level filter dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1 (Districts + Mandals)</option>
            <option value="2">Level 2 (Entrepreneurs)</option>
            <option value="3">Level 3 (Vendors)</option>
          </select>
        </div>
      </div>

      {/* MLM Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Team</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{level1Team.length + level2Team.length + level3Team.length}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">active members</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider block flex items-center gap-1"><Building2 size={10} /> Districts</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{districtCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">district franchises</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block flex items-center gap-1"><MapPin size={10} /> Mandals</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{mandalCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">mandal franchises</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Team Revenue</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{formatINR(totalRevenue)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MLM Commissions</span>
          <span className="text-xl font-extrabold text-emerald-500 mt-1 block">{formatINR(totalComm)}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><TrendingUp size={10} className="text-emerald-500" /> +18.2%</span>
        </div>
      </div>

      {/* Team table list */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-5">Team Member</th>
                <th className="py-4 px-5">Level / Role</th>
                <th className="py-4 px-5">Territory</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Gross Revenue (₹)</th>
                <th className="py-4 px-5">MLM Commission (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {team.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-450 dark:text-slate-400 font-medium">
                    No MLM team members found at this level.
                  </td>
                </tr>
              ) : (
                team.map((member, index) => {
                  const badge = getLevelBadge(member.lvl, member.franchiseLevel);
                  const statusBadge = getStatusBadge(member.status || 'active');
                  return (
                    <tr key={`${member.name}-${index}`} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-850 dark:text-slate-200">{member.name}</span>
                          {(member.phone || member.email) && (
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {member.phone}{member.phone && member.email ? ' • ' : ''}{member.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          {member.territory && <MapPin size={10} className="text-slate-400 shrink-0" />}
                          <span className="font-semibold text-[11px]">{member.territory || member.detail}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300">{formatINR(member.revenue)}</td>
                      <td className="py-4 px-5 font-extrabold text-emerald-500">{formatINR(member.commission)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
