import React, { useState, useEffect } from 'react';
import type { DeliveryPartner } from '../types';
import { Truck, Star, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DeliveryPartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('https://server.apexbee.in/api/franchise/delivery-partners', { headers })
      .then(r => r.json())
      .then(data => {
        const list: DeliveryPartner[] = (data.deliveryPartners || data.data || []).map((p: any) => ({
          id: p._id || p.id,
          name: p.name || '',
          phone: p.mobile || p.phone || '',
          status: p.status === 'active' ? 'Active' : p.status === 'pending' ? 'Pending' : 'Suspended',
          assignedDeliveries: p.assignedDeliveries || 0,
          completedDeliveries: p.completedDeliveries || 0,
          failedDeliveries: p.failedDeliveries || 0,
          rating: p.rating || 0,
          walletBalance: p.walletBalance || 0,
          payoutTotal: p.payoutTotal || 0
        }));
        setPartners(list);
      })
      .catch(err => console.error('Failed to fetch delivery partners:', err));
  }, []);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleApprove = (id: string) => {
    setPartners(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'Active' as const } : p)
    );
    if (selectedPartner?.id === id) {
      setSelectedPartner(prev => prev ? { ...prev, status: 'Active' as const } : null);
    }
  };

  const getStatusBadge = (status: DeliveryPartner['status']) => {
    if (status === 'Active') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          Active
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Pending Approval
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
        Suspended
      </span>
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
            <Truck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Delivery Partner Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Approve delivery riders, track assignments, and monitor payout wallets</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Delivery Rider Roster</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Rider Name</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Assigned / Completed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {partners.map((dp) => (
                  <tr key={dp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-slate-200">{dp.name}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span>{dp.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-350">
                      {dp.assignedDeliveries} / {dp.completedDeliveries}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(dp.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedPartner(dp)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspect panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedPartner ? (
              <motion.div
                key={selectedPartner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-5"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Rider Profile</span>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{selectedPartner.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedPartner.phone}</p>
                </div>

                {/* Wallets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {formatINR(selectedPartner.walletBalance)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Payouts</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {formatINR(selectedPartner.payoutTotal)}
                    </span>
                  </div>
                </div>

                {/* Failures stats */}
                <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-2xl flex items-center justify-between text-xs font-bold text-rose-500">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Failed Deliveries</span>
                  </div>
                  <span>{selectedPartner.failedDeliveries} orders</span>
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                  {selectedPartner.status === 'Pending' && (
                    <button
                      onClick={() => handleApprove(selectedPartner.id)}
                      className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      <span>Approve Rider</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Close Profile
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-400 flex flex-col items-center justify-center">
                <Truck size={32} className="opacity-40 mb-3" />
                <p className="text-xs">Select a registered rider to view their wallet ledger and dispatch parameters</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
