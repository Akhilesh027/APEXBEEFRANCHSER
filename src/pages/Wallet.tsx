import React from 'react';
import { useRole } from '../context/RoleContext';
import { Wallet, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const WalletPage: React.FC = () => {
  const { partner, transactions } = useRole();

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate dynamic balances from transaction categories
  const mlmEarned = transactions
    .filter(t => ["Product Commission", "product_commission"].includes((t as any).category))
    .reduce((sum, t) => sum + (t.commissionEarned || 0), 0);

  const refEarned = transactions
    .filter(t => ["Referral Bonus", "first_order_bonus", "first_purchase_product_commission"].includes((t as any).category))
    .reduce((sum, t) => sum + (t.commissionEarned || 0), 0);

  const franchiseTxs = transactions
    .filter(t => [
      "Franchise Commission",
      "Entrepreneur Commission",
      "State Franchise Commission",
      "District Franchise Commission",
      "Mandal Franchise Commission"
    ].includes((t as any).category))
    .reduce((sum, t) => sum + (t.commissionEarned || 0), 0);

  const franchiseEarned = franchiseTxs || Math.max(0, partner.commissionEarned - refEarned - mlmEarned);

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
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Wallet Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage available and pending credit pools, MLM downline shares, and ledger history</p>
          </div>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden lg:col-span-1">
          <span className="text-[9px] uppercase font-bold text-blue-100 block">Available Balance</span>
          <span className="text-lg font-extrabold mt-1 block">{formatINR(partner.walletBalance)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Balance</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{formatINR(partner.pendingCommission)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MLM Commissions</span>
          <span className="text-base font-extrabold text-emerald-500 mt-1 block">{formatINR(mlmEarned)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referral Earnings</span>
          <span className="text-base font-extrabold text-emerald-500 mt-1 block">{formatINR(refEarned)}</span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Franchise Earnings</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{formatINR(franchiseEarned)}</span>
        </div>
      </div>

      {/* Ledger statement list */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Transaction Statement Ledger</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Entity Details</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{tx.id}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                      <ArrowDownLeft size={12} />
                      <span>Credit Split</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {tx.vendorName}
                    <span className="block text-[9px] font-normal text-slate-400 mt-0.5">Order Ref: {tx.orderId}</span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-500">+{formatINR(tx.commissionEarned)}</td>
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
