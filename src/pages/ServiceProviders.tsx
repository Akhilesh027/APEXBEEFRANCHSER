import React, { useState } from 'react';
import { type ServiceProvider } from '../types';
import { Wrench, Star, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../context/RoleContext';

export const ServiceProvidersPage: React.FC = () => {
  const { serviceProviders: providers, setServiceProviders: setProviders } = useRole();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleApprove = (id: string) => {
    setProviders(prev =>
      prev.map(sp => sp.id === id ? { ...sp, status: 'Active' as const, kycStatus: 'Verified' as const } : sp)
    );
    if (selectedProvider?.id === id) {
      setSelectedProvider(prev => prev ? { ...prev, status: 'Active' as const, kycStatus: 'Verified' as const } : null);
    }
  };

  const getStatusBadge = (status: ServiceProvider['status']) => {
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
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Service Provider Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage local skilled technicians, plumbers, cleaners, and monitor service requests</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Service Partners</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Provider / Category</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Service Requests</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {providers.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{sp.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{sp.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-350">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span>{sp.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300">{sp.serviceRequests} jobs</td>
                    <td className="py-3.5 px-4">{getStatusBadge(sp.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedProvider(sp)}
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

        {/* Inspect Details panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedProvider ? (
              <motion.div
                key={selectedProvider.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-5"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Service Provider Details</span>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{selectedProvider.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedProvider.category}</p>
                </div>

                {/* Earnings metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {formatINR(selectedProvider.revenueTotal)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Commission Paid</span>
                    <span className="text-xs font-extrabold text-emerald-500 mt-1 block">
                      {formatINR(selectedProvider.commissionPaid)}
                    </span>
                  </div>
                </div>

                {/* KYC Badge status */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={selectedProvider.kycStatus === 'Verified' ? 'text-emerald-500' : 'text-amber-500'} />
                    <span className="text-xs font-bold text-slate-650 dark:text-slate-350">KYC Verification</span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    selectedProvider.kycStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {selectedProvider.kycStatus}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                  {selectedProvider.status === 'Pending' && (
                    <button
                      onClick={() => handleApprove(selectedProvider.id)}
                      className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      <span>Approve Provider</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Close Profile
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-400 flex flex-col items-center justify-center">
                <Wrench size={32} className="opacity-40 mb-3" />
                <p className="text-xs">Select a registered service partner to inspect metrics and operational compliance reports</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
