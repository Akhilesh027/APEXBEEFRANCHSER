import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import type { Vendor } from '../types';
import {
  Store,
  Star,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Phone,
  ArrowUpRight,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Vendors: React.FC = () => {
  const { vendors, role, partner, setRole } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Warning' | 'Inactive'>('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'active' | 'applications' | 'kyc' | 'analytics'>('active');

  const [applications, setApplications] = useState<any[]>([]);

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('https://server.apexbee.in/api/franchise/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.applications) {
          const formatted = data.applications.map((app: any) => ({
            id: app._id,
            name: app.businessName,
            category: app.serviceType || app.applicationType || 'General',
            contact: app.ownerName,
            phone: app.mobile,
            mandal: app.mandal || 'N/A',
            appliedDate: app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            kycStatus: app.kycStatus === 'verified' ? 'Verified' : 'Pending'
          }));
          setApplications(formatted);
        }
      }
    } catch (err) {
      console.error('Error fetching franchise applications:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const [kycLogs] = useState([
    { id: 'KYC-V01', name: 'ABC Mobiles', district: 'Nellore', pan: 'Verified', aadhaar: 'Verified', bank: 'Verified', gst: 'Verified' },
    { id: 'KYC-V02', name: 'Fresh Mart', district: 'Nellore', pan: 'Verified', aadhaar: 'Verified', bank: 'Verified', gst: 'Verified' },
    { id: 'KYC-V03', name: 'Sai Ram Fancy', district: 'Nellore', pan: 'Verified', aadhaar: 'Verified', bank: 'Pending', gst: 'Pending' },
    { id: 'KYC-V04', name: 'SLV Enterprises', district: 'Nellore', pan: 'Verified', aadhaar: 'Pending', bank: 'Pending', gst: 'Pending' }
  ]);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Onboarding approval action
  const handleApproval = async (id: string, action: 'Approve' | 'Reject') => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://server.apexbee.in/api/franchise/applications/${id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, adminRemarks: `${action}d by franchise` })
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
        alert(`Vendor Application has been successfully ${action === 'Approve' ? 'Approved & Onboarded' : 'Rejected'}.`);
        setRole(role); // Refresh database context team arrays
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error handling application approval:', err);
      alert('Network error handling application');
    }
  };

  // Filter vendors based on search, status, and role perspective
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;
    
    // If we are Mandal partner, we only see vendors belonging to our mandal
    if (role === 'mandal') {
      return v.mandal === (partner.mandal || 'Buchi Reddy Palem') && matchesSearch && matchesStatus;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Vendor['status']) => {
    if (status === 'Active') {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle size={10} />
          <span>Active</span>
        </span>
      );
    }
    if (status === 'Warning') {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle size={10} />
          <span>Warning</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <X size={10} />
        <span>Inactive</span>
      </span>
    );
  };

  const getVerificationIcon = (status: string) => {
    return status === 'Verified' ? (
      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-center block w-fit">Verified</span>
    ) : (
      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-center block w-fit">Pending</span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Title Header */}
      <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {role === 'mandal' ? 'Mandal Vendor Monitoring' : 'Franchise Vendor Network'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review sales, transaction volumes, feedback grades, and revenue metrics
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 shrink-0">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              activeTab === 'active' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 bg-transparent'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              activeTab === 'applications' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 bg-transparent'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              activeTab === 'kyc' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 bg-transparent'
            }`}
          >
            KYC Logs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
              activeTab === 'analytics' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 bg-transparent'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'active' && (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search vendors by store name, category, or mandal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 shrink-0">
              {(['All', 'Active', 'Warning', 'Inactive'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
                    selectedStatus === s
                      ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 bg-transparent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Vendors List Table */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Vendor Name</th>
                    {role !== 'mandal' && <th className="py-4 px-6">Location (Mandal)</th>}
                    <th className="py-4 px-6">Sales Revenue</th>
                    <th className="py-4 px-6">Total Orders</th>
                    <th className="py-4 px-6">Rating</th>
                    <th className="py-4 px-6">Status</th>
                    {role === 'mandal' && <th className="py-4 px-6">Share</th>}
                    <th className="py-4 px-6 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={role === 'mandal' ? 8 : 7} className="py-12 text-center text-xs text-slate-400">
                        No vendors found in this region.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {vendor.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{vendor.name}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">{vendor.category}</span>
                            </div>
                          </div>
                        </td>

                        {role !== 'mandal' && (
                          <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                            {vendor.mandal} ({vendor.district})
                          </td>
                        )}

                        <td className="py-4 px-6 text-xs text-slate-850 dark:text-slate-100 font-extrabold">
                          {formatINR(vendor.sales)}
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-bold">
                          {vendor.orders}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                            <Star size={12} fill="currentColor" />
                            <span>{vendor.rating}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {getStatusBadge(vendor.status)}
                        </td>

                        {role === 'mandal' && (
                          <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                            {vendor.revenueContribution}%
                          </td>
                        )}

                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors cursor-pointer inline-flex items-center border-0"
                          >
                            <ArrowUpRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Vendor Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Mandal Location</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Representative</th>
                  <th className="py-4 px-6">KYC Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                      No pending applications at this time.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 text-xs">
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">{app.name}</td>
                      <td className="py-4 px-6 text-slate-650 dark:text-slate-350">{app.category}</td>
                      <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">{app.mandal}</td>
                      <td className="py-4 px-6 text-slate-400">{app.appliedDate}</td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{app.contact}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{app.phone}</span>
                      </td>
                      <td className="py-4 px-6">{getVerificationIcon(app.kycStatus)}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproval(app.id, 'Approve')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors border-0"
                            title="Approve Application"
                          >
                            <ThumbsUp size={13} />
                          </button>
                          <button
                            onClick={() => handleApproval(app.id, 'Reject')}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors border-0"
                            title="Reject Application"
                          >
                            <ThumbsDown size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Vendor Name</th>
                  <th className="py-4 px-6">PAN Audit</th>
                  <th className="py-4 px-6">Aadhaar Audit</th>
                  <th className="py-4 px-6">Bank Account</th>
                  <th className="py-4 px-6">GST registration</th>
                  <th className="py-4 px-6">Overall status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {kycLogs.map((log) => {
                  const isComplete = log.pan === 'Verified' && log.aadhaar === 'Verified' && log.bank === 'Verified' && log.gst === 'Verified';
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 text-xs">
                      <td className="py-4 px-6 font-mono font-bold text-slate-400">{log.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-150">{log.name}</td>
                      <td className="py-4 px-6">{getVerificationIcon(log.pan)}</td>
                      <td className="py-4 px-6">{getVerificationIcon(log.aadhaar)}</td>
                      <td className="py-4 px-6">{getVerificationIcon(log.bank)}</td>
                      <td className="py-4 px-6">{getVerificationIcon(log.gst)}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isComplete ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {isComplete ? 'Verified Document Base' : 'Pending Document Audits'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Network Rating</span>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">4.4 / 5.0</h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
                <Star size={20} fill="currentColor" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4">Calculated across all active electronic, retail, and grocery vendor store nodes.</p>
          </div>

          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Performing Vendor</span>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">ABC Mobiles</h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4">Highest revenue generator this month contributing ₹1,10,000 in retail mobile sales.</p>
          </div>

          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Onboarding Velocity</span>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">+4 This Week</h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                <UserCheck size={20} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4">Newly registered merchant shop-owners and service providers in {partner.district || 'Nellore'} district.</p>
          </div>
        </div>
      )}

      {/* Details drawer overlay */}
      <AnimatePresence>
        {selectedVendor && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSelectedVendor(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-dark-card border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-50 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                      {selectedVendor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{selectedVendor.name}</h3>
                      <p className="text-xs text-slate-400">{selectedVendor.category} Vendor</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVendor(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sales Revenue</span>
                    <span className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-1">
                      {formatINR(selectedVendor.sales)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
                    <span className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-1">
                      {selectedVendor.orders}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20 space-y-3">
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Compliance Matrix</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Feedback Rating</span>
                    <span className="font-extrabold text-amber-500 flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      {selectedVendor.rating} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Revenue Contribution</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-200">
                      {selectedVendor.revenueContribution > 0 ? `${selectedVendor.revenueContribution}% share` : 'Regional vendor'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Operation Status</span>
                    <span>{getStatusBadge(selectedVendor.status)}</span>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 space-y-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Store Representative</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedVendor.contactPerson}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">District: {selectedVendor.district} • Mandal: {selectedVendor.mandal}</span>
                  </div>
                  <button className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-colors border-0">
                    <Phone size={12} />
                    <span>Call Store Manager</span>
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/40 leading-relaxed">
                <Info size={12} className="shrink-0 text-primary" />
                <span>Modifying operations status requires Mandal or District administrator approval clearance keys.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
