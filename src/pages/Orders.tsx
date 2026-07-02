import React, { useState, useEffect } from 'react';
import type { OrderDetail } from '../types';
import { ShoppingBag, Search, ArrowLeftRight, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'All' | 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'>('All');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const baseUrl = import.meta.env.VITE_API_URL || 'https://server.apexbee.in';
    fetch(`${baseUrl}/api/orders?limit=50`, { headers })
      .then(r => r.json())
      .then(data => {
        const getUiStatus = (dbStatus: string) => {
          if (!dbStatus) return 'Pending';
          const normalized = dbStatus.toLowerCase();
          if (['delivered'].includes(normalized)) return 'Delivered';
          if (['cancelled', 'returned', 'payment rejected'].includes(normalized)) return 'Cancelled';
          if (['confirmed', 'packed', 'shipped', 'processing', 'payment verified'].includes(normalized)) return 'Processing';
          return 'Pending';
        };

        const list: OrderDetail[] = (data.orders || []).map((o: any) => ({
          id: o._id || o.id,
          customerName: o.customerName || o.customer?.name || 'Customer',
          vendorName: o.vendorName || o.seller?.businessName || 'Vendor',
          amount: o.totalAmount || o.amount || 0,
          status: getUiStatus(o.orderStatus || o.status),
          date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
          returnRequested: o.returnRequested || false,
          refundRequested: o.refundRequested || false
        }));
        setOrders(list);
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleProcessRefund = (id: string) => {
    setOrders(prev =>
      prev.map(ord => ord.id === id ? { ...ord, refundRequested: false, returnRequested: false, status: 'Cancelled' as const } : ord)
    );
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === 'All' || ord.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderDetail['status']) => {
    if (status === 'Delivered') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          Delivered
        </span>
      );
    }
    if (status === 'Processing') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
          Processing
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Pending
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
        Cancelled
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
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Order Monitoring</h2>
            <p className="text-xs text-slate-400 mt-0.5">Track shipment delivery status, returns, and process vendor refund allocations</p>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search orders by ID, vendor or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 shrink-0">
          {(['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStatus === s
                  ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Order ID / Date</th>
                <th className="py-4 px-6">Customer Details</th>
                <th className="py-4 px-6">Vendor Details</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Returns / Refunds</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No orders match the current status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-6 font-mono font-bold text-slate-500">
                      {ord.id}
                      <span className="block text-[9px] font-normal text-slate-400 mt-0.5">{ord.date}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{ord.customerName}</td>
                    <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">{ord.vendorName}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-800 dark:text-slate-100">{formatINR(ord.amount)}</td>
                    <td className="py-4 px-6">{getStatusBadge(ord.status)}</td>
                    <td className="py-4 px-6">
                      {ord.returnRequested ? (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 flex items-center gap-1.5 max-w-[120px]">
                          <ArrowLeftRight size={10} />
                          <span>Return Req</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {ord.refundRequested ? (
                        <button
                          onClick={() => handleProcessRefund(ord.id)}
                          className="px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 mx-auto"
                        >
                          <HeartHandshake size={10} />
                          <span>Approve Refund</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
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
