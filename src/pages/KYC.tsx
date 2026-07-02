import React, { useState, useEffect } from 'react';
import type { KYCRecord } from '../types';
import { ShieldCheck, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const KYCPage: React.FC = () => {
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<KYCRecord | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('https://server.apexbee.in/api/applications?status=pending', { headers })
      .then(r => r.json())
      .then(data => {
        const list: KYCRecord[] = (data.applications || data.data || []).map((a: any) => ({
          id: a._id || a.id,
          name: a.businessName || a.name || '',
          type: a.roleAppliedFor === 'vendor' ? 'Vendor' : a.roleAppliedFor === 'entrepreneur' ? 'Entrepreneur' : a.roleAppliedFor === 'service_provider' ? 'Service Provider' : 'Vendor',
          panStatus: a.panStatus || a.documents?.pan?.status || 'Pending',
          aadhaarStatus: a.aadhaarStatus || a.documents?.aadhaar?.status || 'Pending',
          bankStatus: a.bankStatus || a.documents?.bank?.status || 'Pending',
          gstStatus: a.gstStatus || a.documents?.gst?.status || 'N/A',
          agreementStatus: a.agreementSigned ? 'Signed' : 'Pending'
        }));
        setKycRecords(list);
      })
      .catch(err => console.error('Failed to fetch KYC records:', err));
  }, []);

  const handleVerifyField = (recordId: string, field: 'panStatus' | 'aadhaarStatus' | 'bankStatus' | 'gstStatus' | 'agreementStatus', value: any) => {
    setKycRecords(prev =>
      prev.map(rec => rec.id === recordId ? { ...rec, [field]: value } : rec)
    );
    if (selectedRecord?.id === recordId) {
      setSelectedRecord(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const getStatusIcon = (status: 'Verified' | 'Pending' | 'Rejected' | 'Signed' | 'N/A') => {
    if (status === 'Verified' || status === 'Signed') return <CheckCircle size={14} className="text-emerald-500" />;
    if (status === 'Pending') return <AlertTriangle size={14} className="text-amber-500" />;
    if (status === 'N/A') return <span className="text-[10px] text-slate-400 font-bold">N/A</span>;
    return <XCircle size={14} className="text-rose-500" />;
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
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">KYC Verification Desk</h2>
            <p className="text-xs text-slate-400 mt-0.5">Audit uploaded PAN, Aadhaar, Bank Details, and Agreement signatures for onboarding partners</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">KYC Applications</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Partner details</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">PAN audit</th>
                  <th className="py-3 px-4">Agreement</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {kycRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-slate-200">{rec.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-450">{rec.type}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(rec.panStatus)}
                        <span className="capitalize">{rec.panStatus}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(rec.agreementStatus)}
                        <span>{rec.agreementStatus}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Inspect documents
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Panel (Right side) */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedRecord ? (
              <motion.div
                key={selectedRecord.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-5"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Document Review</span>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{selectedRecord.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedRecord.type} Application</p>
                </div>

                {/* Verification Checkboxes */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/20 space-y-3">
                  <h5 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Required Audits</h5>
                  
                  {/* PAN */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-550 dark:text-slate-350">PAN Card Verify</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRecord.panStatus)}
                      {selectedRecord.panStatus === 'Pending' && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleVerifyField(selectedRecord.id, 'panStatus', 'Verified')} className="text-[9px] font-extrabold text-emerald-500 hover:underline">Verify</button>
                          <button onClick={() => handleVerifyField(selectedRecord.id, 'panStatus', 'Rejected')} className="text-[9px] font-extrabold text-rose-500 hover:underline">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Aadhaar */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-555 dark:text-slate-350">Aadhaar Card Verify</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRecord.aadhaarStatus)}
                      {selectedRecord.aadhaarStatus === 'Pending' && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleVerifyField(selectedRecord.id, 'aadhaarStatus', 'Verified')} className="text-[9px] font-extrabold text-emerald-500 hover:underline">Verify</button>
                          <button onClick={() => handleVerifyField(selectedRecord.id, 'aadhaarStatus', 'Rejected')} className="text-[9px] font-extrabold text-rose-500 hover:underline">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bank */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-555 dark:text-slate-350">Bank Details Audit</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRecord.bankStatus)}
                      {selectedRecord.bankStatus === 'Pending' && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleVerifyField(selectedRecord.id, 'bankStatus', 'Verified')} className="text-[9px] font-extrabold text-emerald-500 hover:underline">Verify</button>
                          <button onClick={() => handleVerifyField(selectedRecord.id, 'bankStatus', 'Rejected')} className="text-[9px] font-extrabold text-rose-500 hover:underline">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GST */}
                  {selectedRecord.gstStatus !== 'N/A' && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-555 dark:text-slate-350">GSTIN Registration</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedRecord.gstStatus)}
                        {selectedRecord.gstStatus === 'Pending' && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleVerifyField(selectedRecord.id, 'gstStatus', 'Verified')} className="text-[9px] font-extrabold text-emerald-500 hover:underline">Verify</button>
                            <button onClick={() => handleVerifyField(selectedRecord.id, 'gstStatus', 'Rejected')} className="text-[9px] font-extrabold text-rose-500 hover:underline">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Agreement */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-555 dark:text-slate-350">Franchise Agreement</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRecord.agreementStatus)}
                      {selectedRecord.agreementStatus === 'Pending' && (
                        <button onClick={() => handleVerifyField(selectedRecord.id, 'agreementStatus', 'Signed')} className="text-[9px] font-extrabold text-emerald-500 hover:underline">Sign Audit</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Close Audit Panel
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-400 flex flex-col items-center justify-center">
                <FileText size={32} className="opacity-40 mb-3" />
                <p className="text-xs">Select an onboarding partner to review verification document links and pan details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
