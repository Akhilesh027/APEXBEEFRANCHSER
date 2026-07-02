import React, { useState } from 'react';
// import removed: '../types';
import type { AdCampaign } from '../types';
import { Tv, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [type, setType] = useState<AdCampaign['type']>('Banner');
  const [budget, setBudget] = useState('');

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !vendorName || !budget) return;

    const newAd: AdCampaign = {
      id: `AD-${String(campaigns.length + 1).padStart(2, '0')}`,
      title,
      vendorName,
      type,
      status: 'Pending',
      budget: parseFloat(budget),
      clicks: 0,
      impressions: 0
    };

    setCampaigns(prev => [...prev, newAd]);
    setTitle('');
    setVendorName('');
    setBudget('');
    setShowAddModal(false);
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
            <Tv size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Advertisement Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Audit sponsored listings, mobile featured banners, and monitor CTR performance metrics</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 active:scale-98 transition-all cursor-pointer text-center"
        >
          <Plus size={16} />
          <span>Launch Ad Campaign</span>
        </button>
      </div>

      {/* Campaigns list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((ad) => (
          <motion.div
            key={ad.id}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
                  ad.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}>
                  {ad.status}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{ad.type} Ad</span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 leading-tight">
                  {ad.title}
                </h4>
                <span className="text-[10px] text-slate-400 mt-1 block">Sponsor: {ad.vendorName}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-3.5 mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Budget</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">{formatINR(ad.budget)}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Impressions</span>
                <span className="font-bold text-slate-700 dark:text-slate-350 block mt-0.5">{ad.impressions}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clicks</span>
                <span className="font-bold text-slate-700 dark:text-slate-350 block mt-0.5">{ad.clicks}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Ad Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Launch New Ad Campaign</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campaign Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Featured Electronics Header Banner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sponsoring Vendor</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABC Mobiles"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Pool (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Advertisement Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AdCampaign['type'])}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="Banner">Top Banner Ad</option>
                    <option value="Sponsored">Sponsored Listing</option>
                    <option value="Featured">Featured Spotlight</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Deploy Advertisement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
