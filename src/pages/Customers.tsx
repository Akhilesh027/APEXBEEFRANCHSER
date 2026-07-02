import React, { useState, useEffect } from 'react';
import type { Customer } from '../types';
import { UserCheck, Search, UserX, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusMap, setActiveStatusMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('https://server.apexbee.in/api/franchise/customers', { headers })
      .then(r => r.json())
      .then(data => {
        const list: Customer[] = (data.customers || data.data || []).map((c: any) => ({
          id: c._id || c.id,
          name: c.name || '',
          phone: c.mobile || c.phone || '',
          email: c.email || '',
          city: c.city || c.district || '',
          ordersCount: c.ordersCount || 0,
          totalSpent: c.totalSpent || 0,
          lastOrderDate: c.lastOrderDate || c.updatedAt?.split('T')[0] || ''
        }));
        setCustomers(list);
        const statusMap: Record<string, boolean> = {};
        list.forEach(c => { statusMap[c.id] = true; });
        setActiveStatusMap(statusMap);
      })
      .catch(err => console.error('Failed to fetch customers:', err));
  }, []);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleToggleStatus = (id: string) => {
    setActiveStatusMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <UserCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Customer Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">Browse registered consumer logs, lifetime order metrics, and toggle status lists</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search customers by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Customer Details</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Order Count</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6">Last Active</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Toggle Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isActive = activeStatusMap[c.id] !== false;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-200">
                        <div className="flex flex-col">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{c.phone} • {c.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">{c.city}</td>
                      <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <ShoppingBag size={12} className="text-slate-400" />
                          <span>{c.ordersCount} orders</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-850 dark:text-slate-100">{formatINR(c.totalSpent)}</td>
                      <td className="py-4 px-6 text-slate-400">{c.lastOrderDate}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleStatus(c.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center ${
                            isActive
                              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                          }`}
                          title={isActive ? 'Block Customer' : 'Unblock Customer'}
                        >
                          {isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                      </td>
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
