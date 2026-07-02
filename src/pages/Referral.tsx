import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { Users, Copy, Check, TrendingUp, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReferralPage: React.FC = () => {
  const { partner } = useRole();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'lvl1' | 'lvl2' | 'lvl3'>('lvl1');

  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({
    totalReferrals: 0,
    approvedReferrals: 0,
    pendingReferrals: 0,
    earnings: 0,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [network, setNetwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('https://server.apexbee.in/api/referrals/me', { headers }).then(res => res.json()),
      fetch('https://server.apexbee.in/api/referrals/dashboard', { headers }).then(res => res.json()),
      fetch('https://server.apexbee.in/api/referrals/history', { headers }).then(res => res.json()),
      fetch('https://server.apexbee.in/api/referrals/network', { headers }).then(res => res.json()),
    ])
      .then(([codeData, statsData, historyData, networkData]) => {
        if (codeData.success) {
          setReferralLink(`http://localhost:5173/register?ref=${codeData.referralCode}`);
        }
        if (statsData.success) {
          setStats({
            totalReferrals: (statsData.directReferrals || 0) + (statsData.indirectReferrals || 0),
            approvedReferrals: statsData.directReferrals || 0,
            pendingReferrals: statsData.indirectReferrals || 0,
            earnings: (statsData.releasedRewards || 0) + (statsData.pendingRewards || 0),
          });
        }
        if (historyData.success) {
          const mappedHistory = (historyData.history || []).map((h: any) => ({
            _id: h._id,
            referredUser: { name: h.user },
            referralType: "customer",
            sales: 0,
            rewardAmount: h.reward || 0,
            level: h.level,
            createdAt: h.createdAt || new Date().toISOString()
          }));
          setHistory(mappedHistory);
        }
        if (networkData.success) {
          const lvl1 = networkData.level1 || [];
          const lvl2 = networkData.level2 || [];
          const lvl3 = networkData.level3 || [];

          const lvl1Mapped = lvl1.map((u1: any) => {
            const children = lvl2.filter((u2: any) => u2.referralHierarchy?.level1UserId === u1._id)
              .map((u2: any) => {
                const grandchildren = lvl3.filter((u3: any) => u3.referralHierarchy?.level1UserId === u2._id);
                return {
                  ...u2,
                  referrals: grandchildren
                };
              });
            return {
              ...u1,
              referrals: children
            };
          });

          setNetwork({ referrals: lvl1Mapped });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading referrals:', err);
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getActiveList = () => {
    const lvlNum = activeTab === 'lvl1' ? 1 : activeTab === 'lvl2' ? 2 : 3;
    return history.filter(r => r.level === lvlNum);
  };

  const renderNetworkNode = (node: any, depth = 1) => {
    if (!node) return null;
    return (
      <div key={node._id} className="space-y-2 text-left">
        <div className="flex items-center gap-2">
          <span className={`rounded-full ${
            depth === 1 ? 'w-2 h-2 bg-violet-500' :
            depth === 2 ? 'w-1.5 h-1.5 bg-amber-500' :
            'w-1 h-1 bg-indigo-500'
          }`} />
          <span>Lvl {depth}: {node.name} ({node.referralCode || 'Customer'})</span>
        </div>
        {node.referrals && node.referrals.length > 0 && (
          <div className="ml-4 border-l border-slate-200 dark:border-slate-800 pl-4 space-y-2">
            {node.referrals.map((child: any) => renderNetworkNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
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
            <Users size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Referral Network</h2>
            <p className="text-xs text-slate-400 mt-0.5">Build and monitor your downline network to earn commission bonuses</p>
          </div>
        </div>
      </div>

      {/* Referral Link Generator */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 text-left">
          <Share2 size={16} className="text-primary" />
          <span>My Partner Referral Link</span>
        </h3>
        
        <div className="flex items-center gap-3">
          <input
            type="text"
            readOnly
            value={referralLink || 'Generating link...'}
            className="flex-1 px-4 py-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none text-slate-650 dark:text-slate-300 font-mono"
          />
          <button
            onClick={handleCopy}
            disabled={!referralLink}
            className="p-2.5 rounded-2xl bg-primary text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-primary/25 disabled:opacity-50"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Network Referrals</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">
            {stats.totalReferrals} Nodes
          </span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active downlines</span>
          <span className="text-xl font-extrabold text-emerald-500 mt-1 block">
            {stats.totalReferrals > 0 ? '100% Active' : '0% Active'}
          </span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Referral Earnings</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">
            {formatINR(stats.earnings)}
          </span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Network Growth Index</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2.5 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" />
            +14% MoM
          </span>
        </div>
      </div>

      {/* Network Downlines Tree Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree Visual */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base text-left">Referral Downline Tree</h3>
          
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20 space-y-3 font-semibold text-xs text-slate-700 dark:text-slate-300 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>You ({partner.name})</span>
            </div>
            
            <div className="ml-4 border-l border-slate-200 dark:border-slate-800 pl-4 space-y-3">
              {network?.referrals && network.referrals.length > 0 ? (
                network.referrals.map((child: any) => renderNetworkNode(child, 1))
              ) : (
                <div className="text-slate-450 italic text-[11px] text-left">No downline referrals found yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Level Tables */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Referral Affiliates</h3>
              
              <div className="flex bg-slate-100 dark:bg-slate-855 p-1 rounded-xl shrink-0">
                {(['lvl1', 'lvl2', 'lvl3'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Level {tab === 'lvl1' ? '1' : tab === 'lvl2' ? '2' : '3'}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto mt-4">
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading referral list...</div>
              ) : getActiveList().length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-450 italic">No affiliates found at this level.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Affiliate Name</th>
                      <th className="py-3 px-4">Role Partner</th>
                      <th className="py-3 px-4">Volume (₹)</th>
                      <th className="py-3 px-4">Commission (₹)</th>
                      <th className="py-3 px-4">Registration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {getActiveList().map((ref) => (
                      <tr key={ref._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{ref.referredUser?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400 capitalize">{String(ref.referralType || 'customer').replace('_', ' ')}</td>
                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">{formatINR(ref.sales || 0)}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-500">{formatINR(ref.rewardAmount || 0)}</td>
                        <td className="py-3 px-4 text-slate-400">{new Date(ref.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-4 mt-4 text-left">
            MLM commissions propagate across 3 tiers (Level 1: 5.0%, Level 2: 3.0%, Level 3: 2.0%) flat.
          </div>
        </div>
      </div>
    </motion.div>
  );
};
