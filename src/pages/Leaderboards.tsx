import React from 'react';
import { useRole } from '../context/RoleContext';
import { Award, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const LeaderboardsPage: React.FC = () => {
  const { role } = useRole();


  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get data arrays depending on role
  const getLeaderboardItems = () => {
    if (role === 'state') {
      return [
        { rank: 1, name: 'Visakhapatnam District', manager: 'P. Appala Raju', revenue: 1500000, orders: 5200, growth: 22, rating: 4.9, commission: 75000 },
        { rank: 2, name: 'Nellore District', manager: 'K. Srinivasa Rao', revenue: 1200000, orders: 4200, growth: 18, rating: 4.8, commission: 60000 },
        { rank: 3, name: 'Krishna District', manager: 'Y. V. Subba Rao', revenue: 1000000, orders: 3500, growth: 15, rating: 4.7, commission: 50000 },
        { rank: 4, name: 'Guntur District', manager: 'T. Rama Naidu', revenue: 800000, orders: 2800, growth: 12, rating: 4.5, commission: 40000 },
        { rank: 5, name: 'Chittoor District', manager: 'D. Kuppaswamy', revenue: 600000, orders: 2100, growth: 8, rating: 4.2, commission: 30000 }
      ];
    }
    if (role === 'district') {
      return [
        { rank: 1, name: 'Kavali Mandal', manager: 'B. Venkata Ramana', revenue: 310000, orders: 1100, growth: 16, rating: 4.8, commission: 15500 },
        { rank: 2, name: 'Nellore Rural Mandal', manager: 'S. K. Mastan Vali', revenue: 250000, orders: 950, growth: 10, rating: 4.5, commission: 12500 },
        { rank: 3, name: 'Buchi Reddy Palem Mandal', manager: 'M. Venkaiah Chowdary', revenue: 225000, orders: 840, growth: 14, rating: 4.7, commission: 11250 },
        { rank: 4, name: 'Kovur Mandal', manager: 'P. Sudhakar Reddy', revenue: 180000, orders: 720, growth: 5, rating: 4.3, commission: 9000 },
        { rank: 5, name: 'Atmakur Mandal', manager: 'C. Obul Reddy', revenue: 120000, orders: 480, growth: -2, rating: 3.8, commission: 6000 }
      ];
    }
    // Mandal view
    return [
      { rank: 1, name: 'ABC Mobiles', manager: 'Sk. Anwar', revenue: 110000, orders: 320, growth: 16, rating: 4.8, commission: 5500 },
      { rank: 2, name: 'Fresh Mart', manager: 'P. Srinivasa Rao', revenue: 65000, orders: 290, growth: 10, rating: 4.5, commission: 3250 },
      { rank: 3, name: 'Sai Ram Fancy', manager: 'T. Sairam', revenue: 30000, orders: 140, growth: 5, rating: 4.1, commission: 1500 },
      { rank: 4, name: 'SLV Enterprises', manager: 'V. Lakshman', revenue: 20000, orders: 90, growth: -8, rating: 3.5, commission: 1000 }
    ];
  };

  const list = getLeaderboardItems();

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
            <Award size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Affiliate Leaderboards</h2>
            <p className="text-xs text-slate-400 mt-0.5">Review rank placements and sales metrics for local districts and vendor partners</p>
          </div>
        </div>
      </div>

      {/* Ranks Table */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl p-6 space-y-4">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
          <Trophy className="text-amber-500" size={18} />
          <span>Top Performing Affiliates</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Partner Name</th>
                <th className="py-3 px-4">Manager Representative</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Growth %</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Commission Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {list.map((item) => (
                <tr key={item.name} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                  <td className="py-3.5 px-4 text-center">
                    <span className={`w-6 h-6 rounded-lg font-extrabold text-xs flex items-center justify-center mx-auto ${
                      item.rank === 1
                        ? 'bg-amber-500 text-white'
                        : item.rank === 2
                        ? 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-white'
                        : item.rank === 3
                        ? 'bg-amber-700/50 text-white'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                    }`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-slate-200">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{item.manager}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-100">{formatINR(item.revenue)}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">{item.orders}</td>
                  <td className={`py-3.5 px-4 font-bold ${item.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.growth >= 0 ? `+${item.growth}%` : `${item.growth}%`}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span>{item.rating}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-500">{formatINR(item.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
