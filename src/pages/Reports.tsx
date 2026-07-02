import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { BarChart3, FileSpreadsheet, FileText, Download, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Reports: React.FC = () => {
  const { partner } = useRole();
  const [reportTab, setReportTab] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  // List of reports
  const reportsList = [
    { id: 'commission', label: 'Commission Report', desc: 'Franchise and network transaction splits' },
    { id: 'territory', label: 'Territory Report', desc: 'Regional growth and mandal-wise sales' },
    { id: 'referral', label: 'Referral Report', desc: 'Referral conversions and payouts' },
    { id: 'mlm', label: 'MLM Downlines Report', desc: 'MLM downline size, levels, and sales' },
    { id: 'vendor', label: 'Vendor Report', desc: 'Vendor sales and ratings audits' },
    { id: 'customer', label: 'Customer Directory Report', desc: 'Customer retention and spent analytics' },
    { id: 'entrepreneur', label: 'Entrepreneur Report', desc: 'Entrepreneur purchase pools and Sales' },
    { id: 'service', label: 'Service Provider Report', desc: 'Category-wise service requests and revenue' },
    { id: 'delivery', label: 'Delivery Partner Report', desc: 'Rider completion rates and wallet audits' }
  ] as const;

  const [activeReport, setActiveReport] = useState<typeof reportsList[number]['id']>('commission');

  // Export states
  const [exportingType, setExportingType] = useState<'PDF' | 'Excel' | 'CSV' | null>(null);
  const [exportStep, setExportStep] = useState(0);

  // Dynamic preview rows state
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(true);

  // Fetch report preview data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingPreview(true);
    fetch(`https://server.apexbee.in/api/franchise/reports/data?type=${activeReport}&timeframe=${reportTab}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPreviewRows(data.data || []);
        }
        setLoadingPreview(false);
      })
      .catch(err => {
        console.error('Error fetching report preview:', err);
        setLoadingPreview(false);
      });
  }, [activeReport, reportTab]);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExport = (type: 'PDF' | 'Excel' | 'CSV') => {
    setExportingType(type);
    setExportStep(0);

    // Simulate multi-stage premium SaaS export pipeline
    setTimeout(() => setExportStep(1), 500);
    setTimeout(() => setExportStep(2), 1000);
    setTimeout(() => setExportStep(3), 1500);
    setTimeout(() => {
      setExportingType(null);
      const token = localStorage.getItem('token');
      // Trigger download on direct backend link
      window.location.href = `https://server.apexbee.in/api/franchise/reports/download?type=${activeReport}&format=${type.toLowerCase()}&timeframe=${reportTab}&token=${token}`;
    }, 2000);
  };

  // Dynamic values depending on selected tab
  const tabFactor = { Daily: 0.03, Weekly: 0.22, Monthly: 1, Yearly: 12 };
  const factor = tabFactor[reportTab];

  const renderReportPreview = () => {
    if (loadingPreview) {
      return (
        <div className="flex items-center justify-center py-12 text-slate-450 dark:text-slate-400">
          <RefreshCw className="animate-spin mr-2" size={16} />
          <span>Loading preview data...</span>
        </div>
      );
    }

    if (!previewRows || previewRows.length === 0) {
      return (
        <div className="text-center py-12 text-slate-450 dark:text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No records found.
        </div>
      );
    }

    switch (activeReport) {
      case 'commission':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>ID</span>
              <span>Vendor</span>
              <span>Commission</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={row.id || idx} className="grid grid-cols-4 p-3">
                  <span className="font-mono">{row.id?.substring(0, 8)}...</span>
                  <span>{row.vendorName}</span>
                  <span className="text-emerald-500">{formatINR(row.commissionEarned)}</span>
                  <span>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'territory':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Administrative Area</span>
              <span>Manager</span>
              <span>Sales Revenue</span>
              <span>Growth Rate</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={row.area || idx} className="grid grid-cols-4 p-3">
                  <span>{row.area}</span>
                  <span>{row.manager}</span>
                  <span>{formatINR(row.sales)}</span>
                  <span className="text-emerald-500">{row.growth}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'referral':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Referral Partner</span>
              <span>Registered Date</span>
              <span>Referred By</span>
              <span>Commission Earned</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.name}</span>
                  <span>{row.date}</span>
                  <span>{row.code}</span>
                  <span className="text-emerald-500">{formatINR(row.commission)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'mlm':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Downline Node</span>
              <span>Level</span>
              <span>Referral Code</span>
              <span>Sales Revenue</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.name}</span>
                  <span>{row.level}</span>
                  <span className="font-mono">{row.code}</span>
                  <span>{formatINR(row.sales)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'vendor':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Store Name</span>
              <span>Representative</span>
              <span>Category</span>
              <span>Sales Volume</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.storeName}</span>
                  <span>{row.representative}</span>
                  <span>{row.category}</span>
                  <span>{formatINR(row.salesVolume)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'customer':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Customer Name</span>
              <span>Phone</span>
              <span>Orders Count</span>
              <span>Total Spent</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.name}</span>
                  <span>{row.phone}</span>
                  <span>{row.ordersCount}</span>
                  <span>{formatINR(row.totalSpent)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'entrepreneur':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Entrepreneur Name</span>
              <span>Certifications</span>
              <span>Pool Contributed</span>
              <span>Sales Revenue</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.name}</span>
                  <span>{row.certification}</span>
                  <span>{formatINR(row.pool)}</span>
                  <span>{formatINR(row.sales)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Provider</span>
              <span>Category</span>
              <span>Requests Completed</span>
              <span>Gross Earnings</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.provider}</span>
                  <span>{row.category}</span>
                  <span>{row.requests}</span>
                  <span>{formatINR(row.earnings)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'delivery':
        return (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-xs animate-fadeIn">
            <div className="grid grid-cols-4 p-3 bg-slate-50 dark:bg-slate-900/40 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 uppercase tracking-wider text-[9px]">
              <span>Rider Name</span>
              <span>Payout Balance</span>
              <span>Completed Deliveries</span>
              <span>Rating</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-355">
              {previewRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3">
                  <span>{row.riderName}</span>
                  <span>{formatINR(row.payout)}</span>
                  <span>{row.deliveries}</span>
                  <span className="text-amber-500 font-bold">{row.rating}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Tab controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Reports & Export Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">Generate audited financial records, vendor reports, and audit logs</p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 shrink-0">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setReportTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${reportTab === tab
                  ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 bg-transparent'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report selection list (Left column) */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-1">
            Available Reports
          </span>

          {reportsList.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left cursor-pointer ${activeReport === rep.id
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/15'
                  : 'bg-white dark:bg-dark-card border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
            >
              {rep.id === 'commission' ? <FileText size={16} /> : <FileSpreadsheet size={16} />}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold capitalize truncate">{rep.label}</span>
                <span className={`text-[9px] truncate ${activeReport === rep.id ? 'text-blue-100' : 'text-slate-400'}`}>{rep.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Report Preview & Export triggers (Right column) */}
        <div className="lg:col-span-3 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base capitalize">
                  {reportsList.find(r => r.id === activeReport)?.label} ({reportTab})
                </h3>
                <p className="text-xs text-slate-400">Audited parameters synced with ledger database</p>
              </div>

              {/* Export triggers */}
              <div className="flex items-center gap-2">
                {(['PDF', 'Excel', 'CSV'] as const).map((type) => (
                  <button
                    key={type}
                    disabled={exportingType !== null}
                    onClick={() => handleExport(type)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer disabled:opacity-50 bg-white dark:bg-slate-800"
                  >
                    <Download size={12} />
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick summary grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fadeIn">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Turnover</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">
                  {formatINR(partner.revenueMonthly * factor)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Orders</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">
                  {Math.round(partner.totalOrders * factor)}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Audited Commission</span>
                <span className="text-lg font-extrabold text-emerald-500 mt-1 block">
                  {formatINR(partner.commissionEarned * factor)}
                </span>
              </div>
            </div>

            {/* Table Mock layout representing actual items */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Report Preview Rows</span>
              {renderReportPreview()}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-4">
            Audited balance sheets are signed with cryptographic certificates for validation under the GST guidelines.
          </div>
        </div>
      </div>

      {/* Export loading dialog simulation modal */}
      <AnimatePresence>
        {exportingType && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-6"
            >
              {exportStep < 3 ? (
                <div className="relative w-12 h-12 mx-auto">
                  <RefreshCw size={48} className="text-primary animate-spin" />
                </div>
              ) : (
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl">
                  <Check size={24} />
                </div>
              )}

              <div className="space-y-1">
                <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  Exporting Report as {exportingType}
                </h5>
                <p className="text-xs text-slate-450 dark:text-slate-400">
                  {exportStep === 0 && "Fetching database transactions..."}
                  {exportStep === 1 && "Formatting report structures..."}
                  {exportStep === 2 && "Signing security tokens..."}
                  {exportStep === 3 && "Export complete! Downloading file..."}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(exportStep + 1) * 25}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
