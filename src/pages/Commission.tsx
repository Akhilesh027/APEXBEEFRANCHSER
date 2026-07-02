import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  X,
  CreditCard,
  Calculator,
  Coins,
  Users,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Commission: React.FC = () => {
  const { partner, withdrawals, addWithdrawal } = useRole();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Dynamic commissions state
  const [franchiseTx, setFranchiseTx] = useState<any[]>([]);
  const [referralTx, setReferralTx] = useState<any[]>([]);
  const [mlmTx, setMlmTx] = useState<any[]>([]);

  // Filters & Tabs State
  const [timeFilter, setTimeFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [activeTab, setActiveTab] = useState<'franchise' | 'referral' | 'mlm'>('franchise');

  // Calculator State
  const [calcTotalValue, setCalcTotalValue] = useState('100000');
  const [calcPercentage, setCalcPercentage] = useState('5');
  const [calcAmount, setCalcAmount] = useState('5000');

  // Fetch commissions
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('https://server.apexbee.in/api/franchise/commissions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFranchiseTx(data.transactions || []);
          setReferralTx(data.referralTransactions || []);
          setMlmTx(data.mlmTransactions || []);
        }
      })
      .catch(err => {
        console.error('Error fetching commissions:', err);
      });
  }, []);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }

    if (amt > partner.walletBalance) {
      setErrorMsg('Insufficient wallet balance.');
      return;
    }

    if (!bankAccount) {
      setErrorMsg('Please select/enter a destination bank account.');
      return;
    }

    const success = addWithdrawal(amt, bankAccount);
    if (success) {
      setSuccessMsg(true);
      setWithdrawAmount('');
      setTimeout(() => {
        setShowWithdrawModal(false);
        setSuccessMsg(false);
      }, 1500);
    } else {
      setErrorMsg('Transaction failed. Contact network support.');
    }
  };

  const getStatusBadge = (status: typeof withdrawals[0]['status']) => {
    if (status === 'Approved') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          Approved
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Pending
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
        Rejected
      </span>
    );
  };

  // Calculator Logic
  const handleCalcTotalChange = (val: string) => {
    setCalcTotalValue(val);
    const total = parseFloat(val);
    const pct = parseFloat(calcPercentage);
    if (!isNaN(total) && !isNaN(pct)) {
      setCalcAmount((total * (pct / 100)).toFixed(0));
    }
  };

  const handleCalcPercentageChange = (val: string) => {
    setCalcPercentage(val);
    const pct = parseFloat(val);
    const total = parseFloat(calcTotalValue);
    if (!isNaN(pct) && !isNaN(total)) {
      setCalcAmount((total * (pct / 100)).toFixed(0));
    }
  };

  const handleCalcAmountChange = (val: string) => {
    setCalcAmount(val);
    const amt = parseFloat(val);
    const total = parseFloat(calcTotalValue);
    if (!isNaN(amt) && !isNaN(total) && total > 0) {
      setCalcPercentage(((amt / total) * 100).toFixed(2));
    }
  };

  // Time filter logic
  const filterByTime = (dateStr: string) => {
    if (timeFilter === 'all') return true;
    if (!dateStr) return false;
    const datePart = dateStr.split(' ')[0]; // YYYY-MM-DD
    const txDate = new Date(datePart);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - txDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (timeFilter === 'daily') return diffDays <= 1;
    if (timeFilter === 'weekly') return diffDays <= 7;
    if (timeFilter === 'monthly') return diffDays <= 30;
    if (timeFilter === 'yearly') return diffDays <= 365;
    return true;
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Commission metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Wallet Balance */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-100 tracking-wider">Available Commission</span>
              <h3 className="text-2xl font-extrabold">{formatINR(partner.walletBalance)}</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15">
              <Wallet size={20} />
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full mt-6 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-primary font-bold text-xs shadow-md active:scale-98 transition-transform cursor-pointer text-center font-sans border-0 focus:outline-none"
          >
            Request Payout Withdrawal
          </button>
        </div>

        {/* Pending Payout Audit */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Pending Commission</span>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{formatINR(partner.pendingCommission)}</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-4 leading-relaxed">
            Locked in verification phase. Credited on the 10th of every month.
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Lifetime Earnings</span>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{formatINR(partner.commissionEarned)}</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-4 leading-relaxed">
            Aggregated gross franchise commissions generated from network transactions.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger transaction logs (Left side) */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Ledger Statement History</h3>
              <p className="text-xs text-slate-400">Incoming credits breakdown</p>
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/40 p-1 rounded-xl shrink-0">
              {(['all', 'daily', 'weekly', 'monthly', 'yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all duration-150 cursor-pointer border-0 ${
                    timeFilter === f
                      ? 'bg-white dark:bg-slate-800 text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent'
                  }`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-slate-100/50 dark:bg-slate-900/20 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('franchise')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border-0 ${
                activeTab === 'franchise'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent'
              }`}
            >
              <Coins size={14} />
              Franchise Commission
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border-0 ${
                activeTab === 'referral'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent'
              }`}
            >
              <Users size={14} />
              Referral Earnings
            </button>
            <button
              onClick={() => setActiveTab('mlm')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border-0 ${
                activeTab === 'mlm'
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent'
              }`}
            >
              <Layers size={14} />
              MLM Commission
            </button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'franchise' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Vendor Partner</th>
                    <th className="py-3 px-4">Order Value</th>
                    <th className="py-3 px-4">Commission Earned</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {franchiseTx.filter(tx => filterByTime(tx.date)).map((tx) => (
                    <tr key={tx.id} className="text-xs hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{tx.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-250">
                        {tx.vendorName}
                        <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{tx.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{formatINR(tx.amount)}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-500">{formatINR(tx.commissionEarned)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          tx.status === 'Credited'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {franchiseTx.filter(tx => filterByTime(tx.date)).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-xs text-slate-400 py-8">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'referral' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Affiliate Partner</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Total Order Value</th>
                    <th className="py-3 px-4">Commission Earned (3%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {referralTx.filter(tx => filterByTime(tx.date)).map((tx) => (
                    <tr key={tx.id} className="text-xs hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{tx.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-250">
                        {tx.name}
                        <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{tx.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">{tx.code}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{formatINR(tx.orderAmount)}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-500">{formatINR(tx.commission)}</td>
                    </tr>
                  ))}
                  {referralTx.filter(tx => filterByTime(tx.date)).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-xs text-slate-400 py-8">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'mlm' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Downline Partner</th>
                    <th className="py-3 px-4">MLM Level</th>
                    <th className="py-3 px-4">Downline Sales</th>
                    <th className="py-3 px-4">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {mlmTx.filter(tx => filterByTime(tx.date)).map((tx) => (
                    <tr key={tx.id} className="text-xs hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{tx.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-250">
                        {tx.downline}
                        <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{tx.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-500">
                        {tx.level} <span className="text-[10px] text-slate-400 font-normal">({tx.rate})</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{formatINR(tx.sales)}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-500">{formatINR(tx.commission)}</td>
                    </tr>
                  ))}
                  {mlmTx.filter(tx => filterByTime(tx.date)).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-xs text-slate-400 py-8">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Action Widgets (Right side) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* Interactive Calculator Widget */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <Calculator size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Interactive Calculator</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Auto-calculate percentage to amount splits</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Transaction Value (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-450">₹</span>
                  <input
                    type="number"
                    value={calcTotalValue}
                    onChange={(e) => handleCalcTotalChange(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 100000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Commission (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={calcPercentage}
                      onChange={(e) => handleCalcPercentageChange(e.target.value)}
                      className="w-full pr-7 pl-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                      placeholder="e.g. 5"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-450">₹</span>
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => handleCalcAmountChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal payouts lists */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Payout Request Log</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Withdrawals from wallet</p>
                </div>
              </div>

              <div className="space-y-3">
                {withdrawals.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">No payout withdrawals logged.</p>
                ) : (
                  withdrawals.map((wd) => (
                    <div
                      key={wd.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-150 block">
                          {formatINR(wd.amount)}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 block truncate max-w-[150px]">
                          Account: {wd.bankAccount}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          Requested: {wd.requestedDate}
                        </span>
                      </div>
                      {getStatusBadge(wd.status)}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 text-[9px] text-slate-400 leading-relaxed">
              Payout requests are audited and settled into the nominated bank account within 2-3 business working days.
            </div>
          </div>
        </div>
      </div>

      {/* Request Payout Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Request Payout Withdrawal</h3>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-2xl bg-danger/10 text-danger border border-danger/25 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 text-xs font-semibold">
                    Withdrawal request registered successfully!
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Withdrawal Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Available balance: {formatINR(partner.walletBalance)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Select Destination Bank Account
                  </label>
                  <select
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="">-- Choose Account --</option>
                    <option value="State Bank of India (***3489)">State Bank of India (***3489) - Primary</option>
                    <option value="HDFC Bank (***8822)">HDFC Bank (***8822) - Secondary</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Process Withdrawal
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
