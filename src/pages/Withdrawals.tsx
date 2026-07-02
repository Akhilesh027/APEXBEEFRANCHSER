import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const WithdrawalsPage: React.FC = () => {
  const { partner, withdrawals, addWithdrawal, updateBankDetails } = useRole();
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Bank Form State
  const [holderName, setHolderName] = useState(partner.bankDetails?.accountHolderName || '');
  const [accNumber, setAccNumber] = useState(partner.bankDetails?.accountNumber || '');
  const [bankName, setBankName] = useState(partner.bankDetails?.bankName || '');
  const [ifscCode, setIfscCode] = useState(partner.bankDetails?.ifsc || '');
  const [upiId, setUpiId] = useState(partner.bankDetails?.upiId || '');
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [bankSaveError, setBankSaveError] = useState('');

  const isBankAdded = !!(partner.bankDetails && partner.bankDetails.accountNumber && partner.bankDetails.bankName);
  const showBankForm = !isBankAdded || isEditingBank;

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    if (partner.bankDetails && partner.bankDetails.accountNumber && partner.bankDetails.bankName) {
      setBankAccount(`${partner.bankDetails.bankName} (***${partner.bankDetails.accountNumber.slice(-4)})`);
    }
  }, [partner.bankDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid payout amount.');
      return;
    }

    if (amt > partner.walletBalance) {
      setErrorMsg('Insufficient wallet balance pool.');
      return;
    }

    if (!bankAccount) {
      setErrorMsg('Please choose destination bank current account.');
      return;
    }

    const completed = addWithdrawal(amt, bankAccount);
    if (completed) {
      setSuccess(true);
      setAmount('');
    } else {
      setErrorMsg('Transaction failed. Contact SaaS network helpdesk.');
    }
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankSaveError('');
    setSavingBank(true);

    if (!holderName || !accNumber || !bankName || !ifscCode) {
      setBankSaveError('Please fill in all required fields.');
      setSavingBank(false);
      return;
    }

    const completed = await updateBankDetails({
      accountHolderName: holderName,
      accountNumber: accNumber,
      ifsc: ifscCode,
      bankName: bankName,
      upiId: upiId || undefined
    });

    setSavingBank(false);
    if (completed) {
      setIsEditingBank(false);
    } else {
      setBankSaveError('Failed to save bank details. Please try again.');
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
          Pending Verification
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
        Rejected
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
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Payout Withdrawals</h2>
            <p className="text-xs text-slate-400 mt-0.5">Submit and verify bank settlement transfers from your franchise wallet balance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        {showBankForm ? (
          <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Link Bank Account</h3>
              {isBankAdded && (
                <button
                  onClick={() => setIsEditingBank(false)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {bankSaveError && (
              <div className="p-3 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl text-xs font-semibold">
                {bankSaveError}
              </div>
            )}
            
            <form onSubmit={handleSaveBank} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 501004328901"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC0000240"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UPI ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. john@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={savingBank}
                className="w-full py-2.5 mt-2 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center disabled:opacity-50"
              >
                {savingBank ? 'Saving...' : 'Link Bank Details'}
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Request Withdrawal</h3>
              <button
                onClick={() => {
                  setHolderName(partner.bankDetails?.accountHolderName || '');
                  setAccNumber(partner.bankDetails?.accountNumber || '');
                  setBankName(partner.bankDetails?.bankName || '');
                  setIfscCode(partner.bankDetails?.ifsc || '');
                  setUpiId(partner.bankDetails?.upiId || '');
                  setIsEditingBank(true);
                }}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Edit Bank
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              {success && (
                <div className="p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl text-xs font-semibold">
                  Withdrawal request registered!
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Balance</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-sm font-extrabold text-slate-700 dark:text-slate-250">
                  {formatINR(partner.walletBalance)}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nominated Bank Account</label>
                <select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <option value="">-- Choose Account --</option>
                  {isBankAdded && partner.bankDetails && (
                    <option value={`${partner.bankDetails.bankName} (***${partner.bankDetails.accountNumber.slice(-4)})`}>
                      {partner.bankDetails.bankName} (***{partner.bankDetails.accountNumber.slice(-4)})
                    </option>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                Submit Payout Request
              </button>
            </form>
          </div>
        )}

        {/* List */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Request History</h3>

          <div className="space-y-3">
            {withdrawals.map(wd => (
              <div
                key={wd.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{wd.id}</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{formatINR(wd.amount)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Account: {wd.bankAccount}</span>
                  <span className="text-[10px] text-slate-400 block">Requested date: {wd.requestedDate}</span>
                </div>
                {getStatusBadge(wd.status)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
