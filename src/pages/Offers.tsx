import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import type { Campaign } from '../types';
import { Gift, Plus, Calendar, Tag, MapPin, X, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Offers: React.FC = () => {
  const { campaigns, addCampaign, role, partner } = useRole();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<Campaign['type']>('Offer');
  const [discount, setDiscount] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get regions matching role scope
  const getRegionsForRole = () => {
    const sName = partner.state || 'Andhra Pradesh';
    const dName = partner.district || 'Nellore';
    const mName = partner.mandal || 'Buchi Reddy Palem';
    const isTelangana = sName.toLowerCase() === 'telangana';
    const isMaharashtra = sName.toLowerCase() === 'maharashtra';

    if (role === 'state') {
      return [
        { value: sName, label: `${sName} (State Wide)` },
        { value: dName, label: `${dName} (District)` },
        { value: isTelangana ? 'Rangareddy' : isMaharashtra ? 'Mumbai Suburban' : 'Guntur', label: `${isTelangana ? 'Rangareddy' : isMaharashtra ? 'Mumbai Suburban' : 'Guntur'} (District)` },
        { value: mName, label: `${mName} (Mandal)` }
      ];
    }
    if (role === 'district') {
      return [
        { value: dName, label: `${dName} (District Wide)` },
        { value: mName, label: `${mName} (Mandal)` },
        { value: isTelangana ? 'Gachibowli' : isMaharashtra ? 'Haveli' : 'Kavali', label: `${isTelangana ? 'Gachibowli' : isMaharashtra ? 'Haveli' : 'Kavali'} (Mandal)` },
        { value: isTelangana ? 'Secunderabad' : isMaharashtra ? 'Vashi' : 'Kovur', label: `${isTelangana ? 'Secunderabad' : isMaharashtra ? 'Vashi' : 'Kovur'} (Mandal)` }
      ];
    }
    return [
      { value: mName, label: `${mName} (Mandal Wide)` }
    ];
  };

  const regions = getRegionsForRole();

  // Set default targetRegion when regions change or modal opens
  useEffect(() => {
    if (regions.length > 0) {
      setTargetRegion(regions[0].value);
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code || !discount || !targetRegion) return;

    addCampaign({
      title,
      code: code.toUpperCase(),
      type,
      discount,
      targetRegion,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    // Reset Form
    setTitle('');
    setCode('');
    setDiscount('');
    setStartDate('');
    setEndDate('');
    setShowAddModal(false);
  };

  const getStatusColor = (status: Campaign['status']) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (status === 'Draft') return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  };

  // Compile performance data for Recharts
  const chartData = campaigns.map(camp => {
    let clicks = 0;
    let impressions = 0;
    if (camp.status === 'Active') {
      clicks = camp.code.includes('MANGO') ? 1240 : camp.code.includes('BUCHI') ? 840 : 150;
      impressions = camp.code.includes('MANGO') ? 24800 : camp.code.includes('BUCHI') ? 12000 : 3500;
    } else if (camp.status === 'Expired') {
      clicks = 2800;
      impressions = 42000;
    } else {
      clicks = 0;
      impressions = 0;
    }
    return {
      name: camp.title.length > 15 ? camp.title.substring(0, 15) + '...' : camp.title,
      clicks,
      impressions: Math.floor(impressions / 10) // Scaled down /10 for clear visual comparison
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header card */}
      <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Gift size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Offers & Marketing Desk</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Launch discount coupons, area promotions, and festival campaigns to boost local sales
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 active:scale-98 transition-all cursor-pointer text-center border-0"
        >
          <Plus size={16} />
          <span>Launch Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Campaigns List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaigns.map((camp) => (
              <motion.div
                key={camp.id}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${getStatusColor(camp.status)}`}>
                      {camp.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{camp.type}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 leading-tight">
                      {camp.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                      <Tag size={13} className="text-primary" />
                      <span className="text-primary font-extrabold bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                        {camp.code}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-350">{camp.discount}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      Target Scope: {camp.targetRegion}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      Validity: {camp.startDate} to {camp.endDate}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Campaign Performance</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Clicks vs Impressions comparison</p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 'bold' }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 8, fontWeight: 'bold' }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      border: '0',
                      fontSize: '10px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  <Bar dataKey="clicks" name="Total Clicks" fill="#2563EB" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="impressions" name="Impressions (x10)" fill="#10B981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Add Campaign Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Launch New Marketing Campaign</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border-0 bg-transparent"
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
                    placeholder="e.g. Nellore Weekend Grocery Fest"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Promo Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BUCHIFRESH"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15% OFF Grocery"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campaign Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as Campaign['type'])}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="Offer">General Offer</option>
                      <option value="Coupon">Discount Coupon</option>
                      <option value="Area Promotion">Area Promotion</option>
                      <option value="Festival">Festival Campaign</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Region Scope</label>
                    <select
                      value={targetRegion}
                      onChange={(e) => setTargetRegion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      {regions.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer border-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold cursor-pointer border-0"
                  >
                    Launch Campaign
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
