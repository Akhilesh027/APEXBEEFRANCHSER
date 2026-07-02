import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import type { NodeMetrics } from '../types';
import { Map, Info, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Static performance node data for the visual map grid
// Labels are overridden dynamically based on the partner's state/district
const districtPerformance: NodeMetrics[] = [
  { id: 'd1', name: 'Nellore', type: 'district', revenue: 2450000, orders: 1240, growth: 18, performance: 'high', manager: 'Ravi Kumar', phone: '+91 98765 11001' },
  { id: 'd2', name: 'Guntur', type: 'district', revenue: 1980000, orders: 980, growth: 12, performance: 'high', manager: 'Suresh Babu', phone: '+91 98765 11002' },
  { id: 'd3', name: 'Krishna', type: 'district', revenue: 1560000, orders: 820, growth: 8, performance: 'average', manager: 'Anand Rao', phone: '+91 98765 11003' },
  { id: 'd4', name: 'Prakasam', type: 'district', revenue: 1120000, orders: 640, growth: 5, performance: 'average', manager: 'Venkateswara', phone: '+91 98765 11004' },
  { id: 'd5', name: 'Chittoor', type: 'district', revenue: 870000, orders: 490, growth: -3, performance: 'low', manager: 'Nagarjuna', phone: '+91 98765 11005' },
  { id: 'd6', name: 'Visakhapatnam', type: 'district', revenue: 780000, orders: 420, growth: -6, performance: 'low', manager: 'Prasad Varma', phone: '+91 98765 11006' },
];

const mandalPerformance: NodeMetrics[] = [
  { id: 'm1', name: 'Kavali', type: 'mandal', revenue: 420000, orders: 310, growth: 15, performance: 'high', manager: 'Bhaskar Rao', phone: '+91 99001 22001' },
  { id: 'm2', name: 'Nellore Rural', type: 'mandal', revenue: 380000, orders: 280, growth: 11, performance: 'high', manager: 'Sudhakar', phone: '+91 99001 22002' },
  { id: 'm3', name: 'Atmakur', type: 'mandal', revenue: 290000, orders: 210, growth: 6, performance: 'average', manager: 'Ramesh', phone: '+91 99001 22003' },
  { id: 'm4', name: 'Kovur', type: 'mandal', revenue: 210000, orders: 160, growth: 3, performance: 'average', manager: 'Srikanth', phone: '+91 99001 22004' },
  { id: 'm5', name: 'Buchi Reddy Palem', type: 'mandal', revenue: 140000, orders: 110, growth: -4, performance: 'low', manager: 'Narender', phone: '+91 99001 22005' },
];

export const PerformanceMap: React.FC = () => {
  const { role, partner, subFranchises, vendors } = useRole();
  const [selectedRegion, setSelectedRegion] = useState<NodeMetrics | null>(null);

  // Load correct regional dataset dynamically based on real database records
  const regions = React.useMemo((): NodeMetrics[] => {
    if (role === 'state') {
      return subFranchises
        .filter(sf => sf.franchiseLevel === 'district')
        .map((sf, idx) => ({
          id: sf.id || sf._id || `d-${idx}`,
          name: sf.district || sf.businessName || 'District Hub',
          type: 'district',
          revenue: sf.revenue || 0,
          orders: sf.orders || 0,
          growth: sf.growth || 0,
          performance: (sf.revenue || 0) > 100000 ? 'high' : 'average',
          manager: sf.ownerName || 'Representative',
          phone: sf.mobile || sf.phone || 'N/A'
        }));
    }

    if (role === 'district') {
      return subFranchises
        .filter(sf => sf.franchiseLevel === 'mandal')
        .map((sf, idx) => ({
          id: sf.id || sf._id || `m-${idx}`,
          name: sf.mandal || sf.businessName || 'Mandal Hub',
          type: 'mandal',
          revenue: sf.revenue || 0,
          orders: sf.orders || 0,
          growth: sf.growth || 0,
          performance: (sf.revenue || 0) > 20000 ? 'high' : 'average',
          manager: sf.ownerName || 'Representative',
          phone: sf.mobile || sf.phone || 'N/A'
        }));
    }

    // Mandal view has vendors under it
    return vendors.map((v, idx) => ({
      id: v.id || v._id || `v-${idx}`,
      name: v.name,
      type: 'vendor',
      revenue: v.sales || 0,
      orders: v.orders || 0,
      growth: v.rating >= 4 ? 12 : 5,
      performance: v.rating >= 4 ? 'high' : 'average',
      manager: v.contactPerson || 'Owner',
      phone: 'N/A'
    }));
  }, [role, partner, subFranchises, vendors]);

  // If a region is not selected yet, auto-select the first performer in the active region list
  React.useEffect(() => {
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
    }
  }, [regions]);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Color mapping based on performance metrics
  const getPerfColor = (perf: 'high' | 'average' | 'low') => {
    if (perf === 'high') return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', lightBg: 'bg-emerald-500/10' };
    if (perf === 'average') return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', lightBg: 'bg-amber-500/10' };
    return { bg: 'bg-danger', text: 'text-danger', border: 'border-danger', lightBg: 'bg-danger/10' };
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative flex flex-col xl:flex-row gap-6">
      
      {/* Visual map dashboard grid */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Map size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                {role === 'state' ? 'District-Wise Performance Map' : role === 'district' ? 'Mandal-Wise Performance Map' : 'Vendor Breakdown'}
              </h3>
              <p className="text-xs text-slate-400">Interactive geographic layout representation</p>
            </div>
          </div>
          
          {/* Map Legends */}
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-500 dark:text-slate-400">Avg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger" />
              <span className="text-slate-500 dark:text-slate-400">Low</span>
            </div>
          </div>
        </div>

        {/* Abstract Geographic Map Representation */}
        <div className="flex-1 min-h-[280px] bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-6 relative flex items-center justify-center overflow-hidden">
          
          {/* Compass grid background detail */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none flex items-center justify-center">
            <Compass size={240} className="text-primary animate-spin" style={{ animationDuration: '60s' }} />
          </div>

          {/* District Spatial Layout Nodes */}
          <div className="relative w-full h-full max-w-[420px] max-h-[240px] grid grid-cols-3 gap-6 items-center z-10">
            {regions.map((region) => {
              const colors = getPerfColor(region.performance);
              const isSelected = selectedRegion?.id === region.id;
              
              // Place nodes in an abstract regional form on the grid
              return (
                <motion.div
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-lg border-primary ring-2 ring-primary/20 scale-102'
                      : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator Dot */}
                  <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${colors.bg} pulse-slow`} />
                  
                  {/* Value */}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {region.name}
                  </span>
                  
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                    {region.revenue >= 100000 ? `₹${(region.revenue / 100000).toFixed(1)}L` : formatINR(region.revenue)}
                  </span>
                  
                  {/* Performance indicator text */}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1.5 ${colors.lightBg} ${colors.text}`}>
                    {region.growth > 0 ? `+${region.growth}%` : `${region.growth}%`}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Region Details Panel */}
      <div className="w-full xl:w-72 border-t xl:border-t-0 xl:border-l border-slate-200/50 dark:border-slate-800/50 pt-6 xl:pt-0 xl:pl-6 shrink-0 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {selectedRegion ? (
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Region Title */}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getPerfColor(selectedRegion.performance).bg}`} />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    {selectedRegion.type} Profile
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedRegion.name}
                </h4>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Revenue</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                    {formatINR(selectedRegion.revenue)}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                    {selectedRegion.orders}
                  </span>
                </div>
              </div>

              {/* Status Row */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Performance Matrix</span>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Growth Index</span>
                  <span className={`text-xs font-bold ${selectedRegion.growth >= 0 ? 'text-emerald-500' : 'text-danger'}`}>
                    {selectedRegion.growth >= 0 ? `+${selectedRegion.growth}% MoM` : `${selectedRegion.growth}% MoM`}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Rating Tier</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">
                    {selectedRegion.performance} Grade
                  </span>
                </div>
              </div>

              {/* Regional Lead contact info */}
              <div className="p-3.5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                  Regional Representative
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {selectedRegion.manager}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Phone: {selectedRegion.phone}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <Info size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">Select a region node on the map to review detailed stats</p>
            </div>
          )}
        </AnimatePresence>

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/40 text-[10px] text-slate-400 flex items-center gap-1.5 leading-relaxed">
          <Info size={12} className="shrink-0 text-primary" />
          <span>Real-time geo-performance synced automatically every 15 minutes.</span>
        </div>
      </div>

    </div>
  );
};
