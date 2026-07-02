import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import type { Lead } from '../types';
import {
  Phone,
  MessageCircle,
  CheckCircle,
  Plus,
  Search,
  UserCheck,
  Building,
  Calendar,
  X,
  Briefcase,
  Wrench,
  Truck,
  Clock,
  Trash2,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CRM: React.FC = () => {
  const { leads, addLead, updateLeadStatus } = useRole();
  const [filterType, setFilterType] = useState<'All' | 'Vendor' | 'Franchise' | 'Entrepreneur' | 'Service Provider' | 'Delivery Partner'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<'Vendor' | 'Franchise' | 'Entrepreneur' | 'Service Provider' | 'Delivery Partner'>('Vendor');
  const [formInterest, setFormInterest] = useState('');
  const [formLocation, setFormLocation] = useState('');

  // Call simulation overlay state
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [activeWhatsApp, setActiveWhatsApp] = useState<string | null>(null);

  // Follow-Up Scheduler State
  const [followUps, setFollowUps] = useState([
    { id: 'F-01', leadName: 'G. Venkata Reddy', date: '2026-06-15', time: '11:00', note: 'Discuss Mandal franchise pricing options' },
    { id: 'F-02', leadName: 'Vijay Diagnostics & Labs', date: '2026-06-16', time: '14:30', note: 'Verify lab registration documents' }
  ]);
  const [showScheduleModal, setShowScheduleModal] = useState<Lead | null>(null);
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedNote, setSchedNote] = useState('');

  // Handles adding lead
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formLocation) return;
    
    addLead({
      name: formName,
      email: formEmail || 'N/A',
      phone: formPhone,
      type: formType as any, // Cast for context mapping
      interest: formInterest || `${formType} Partnership interest`,
      location: formLocation
    });

    // Reset Form
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormInterest('');
    setFormLocation('');
    setShowAddModal(false);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScheduleModal || !schedDate || !schedTime) return;

    const newFollowUp = {
      id: `F-${String(followUps.length + 1).padStart(2, '0')}`,
      leadName: showScheduleModal.name,
      date: schedDate,
      time: schedTime,
      note: schedNote || 'Routine follow-up call'
    };

    setFollowUps(prev => [newFollowUp, ...prev]);
    setShowScheduleModal(null);
    setSchedDate('');
    setSchedTime('');
    setSchedNote('');
    alert(`Follow-up scheduled with ${showScheduleModal.name} for ${schedDate} at ${schedTime}.`);
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filterType === 'All' || lead.type === filterType;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.interest.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: typeof leads[0]['status']) => {
    if (status === 'New') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    if (status === 'Contacted') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    if (status === 'In Progress') return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  };

  const getLeadIcon = (type: string) => {
    switch (type) {
      case 'Franchise': return <Building size={14} className="text-violet-500" />;
      case 'Vendor': return <Store size={14} className="text-amber-500" />;
      case 'Entrepreneur': return <Briefcase size={14} className="text-indigo-500" />;
      case 'Service Provider': return <Wrench size={14} className="text-pink-500" />;
      case 'Delivery Partner': return <Truck size={14} className="text-blue-500" />;
      default: return <UserCheck size={14} className="text-slate-500" />;
    }
  };

  const getLeadIconBg = (type: string) => {
    switch (type) {
      case 'Franchise': return 'bg-violet-500/10';
      case 'Vendor': return 'bg-amber-500/10';
      case 'Entrepreneur': return 'bg-indigo-500/10';
      case 'Service Provider': return 'bg-pink-500/10';
      case 'Delivery Partner': return 'bg-blue-500/10';
      default: return 'bg-slate-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative min-h-[500px]"
    >
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[5px] z-10 rounded-3xl flex flex-col items-center justify-center text-center p-6">
        <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl max-w-sm space-y-4">
          <div className="w-fit mx-auto px-3.5 py-1 bg-primary/10 text-primary text-[10px] uppercase font-extrabold tracking-wider rounded-full">
            Coming Soon
          </div>
          <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">CRM & Telephony Center</h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
            The lead relationship database, Twilio VoIP dialer integration, and automated WhatsApp template broadcaster are currently under development.
          </p>
        </div>
      </div>

      {/* CRM Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Leads</span>
          <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
            {leads.length}
          </span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">New / Open</span>
          <span className="text-2xl font-extrabold text-blue-500 mt-1">
            {leads.filter((l) => l.status === 'New').length}
          </span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">In Pipeline</span>
          <span className="text-2xl font-extrabold text-amber-500 mt-1">
            {leads.filter((l) => l.status === 'Contacted' || l.status === 'In Progress').length}
          </span>
        </div>
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Converted</span>
          <span className="text-2xl font-extrabold text-emerald-500 mt-1">
            {leads.filter((l) => l.status === 'Converted').length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: CRM Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* CRM Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search leads by name, location, interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-primary/20 transition-all cursor-pointer border-0 shrink-0"
            >
              <Plus size={16} />
              <span>Add Lead</span>
            </button>
          </div>

          {/* Filter Types selector */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/60 dark:bg-slate-900/20 rounded-2xl w-fit">
            {(['All', 'Vendor', 'Franchise', 'Entrepreneur', 'Service Provider', 'Delivery Partner'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
                  filterType === t
                    ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 bg-transparent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Leads Table Container */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Lead details</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Interest Area</th>
                    <th className="py-4 px-6">Lead Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                        No leads match the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getLeadIconBg(lead.type)}`}>
                              {getLeadIcon(lead.type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{lead.name}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">{lead.phone} • {lead.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                          {lead.location}
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {lead.interest}
                          </span>
                          <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
                            <Calendar size={10} />
                            <span>Registered {lead.date}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                            className={`text-[10px] font-bold px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${getStatusColor(lead.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Converted">Converted</option>
                          </select>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setActiveCall(lead.name)}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100/80 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/30 cursor-pointer"
                              title="Simulate call dialer"
                            >
                              <Phone size={12} />
                            </button>
                            
                            <button
                              onClick={() => setActiveWhatsApp(lead.name)}
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100/80 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-900/30 cursor-pointer"
                              title="Simulate WhatsApp dispatch"
                            >
                              <MessageCircle size={12} />
                            </button>

                            <button
                              onClick={() => setShowScheduleModal(lead)}
                              className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100/80 text-violet-600 dark:text-violet-400 border border-violet-100/30 dark:border-violet-900/30 cursor-pointer"
                              title="Schedule follow-up appointment"
                            >
                              <Calendar size={12} />
                            </button>

                            {lead.status !== 'Converted' && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'Converted')}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-pointer"
                                title="Instantly convert lead"
                              >
                                <CheckCircle size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Follow-up Scheduler Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-500">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Follow-up Scheduler</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Monitor upcoming lead follow-ups</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {followUps.length === 0 ? (
                <p className="text-center text-xs text-slate-450 py-8">No scheduled follow-up tasks.</p>
              ) : (
                followUps.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/30 flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-150 block truncate">{item.leadName}</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{item.note}</p>
                      <div className="flex items-center gap-2 text-[9px] text-primary font-bold pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {item.time}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFollowUp(item.id)}
                      className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 cursor-pointer transition-colors border-0 bg-transparent"
                      title="Clear reminder"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialer simulation modal */}
      <AnimatePresence>
        {activeCall && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl text-center space-y-6 animate-fadeIn"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto text-xl animate-pulse">
                <Phone size={24} />
              </div>
              <div className="space-y-1">
                <h5 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Dialing Lead Contact</h5>
                <p className="text-lg font-extrabold">{activeCall}</p>
                <p className="text-xs text-slate-400">Ringing via Twilio Integrated VoIP Dialer...</p>
              </div>
              <button
                onClick={() => setActiveCall(null)}
                className="w-full py-2.5 rounded-2xl bg-danger hover:bg-danger-hover text-white text-xs font-bold cursor-pointer border-0"
              >
                End Simulation Call
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp dispatch simulation modal */}
      <AnimatePresence>
        {activeWhatsApp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fadeIn"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">WhatsApp API Dispatcher</h4>
                  <p className="text-[10px] text-slate-400">Simulating automated template broadcast</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-955/20 border border-emerald-500/10 rounded-2xl space-y-2">
                <span className="text-[9px] font-extrabold uppercase text-emerald-500 tracking-wide block">Template Message</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  "Hello {activeWhatsApp}, thank you for your franchise registration interest with ApexBee. Our regional partner representative will connect with you shortly."
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveWhatsApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setActiveWhatsApp(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer border-0 bg-emerald-500"
                >
                  Confirm Broadcast
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Follow-up Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Schedule Lead Follow-up</h4>
                <button onClick={() => setShowScheduleModal(null)} className="text-slate-400 hover:text-slate-650 cursor-pointer border-0 bg-transparent">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <p className="text-xs text-slate-450">Scheduling reminder call for <strong className="text-slate-700 dark:text-slate-200">{showScheduleModal.name}</strong></p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Follow-up Date</label>
                    <input
                      type="date"
                      required
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Follow-up Time</label>
                    <input
                      type="time"
                      required
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Reminders notes</label>
                  <textarea
                    placeholder="e.g. Discuss onboarding KYC guidelines"
                    value={schedNote}
                    onChange={(e) => setSchedNote(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer border-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold cursor-pointer border-0"
                  >
                    Schedule Reminder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Lead Modal */}
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
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Add New Registered Lead</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border-0 bg-transparent"
                >
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 99000 11223"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="anand@gmail.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Geographic Location</label>
                    <input
                      type="text"
                      required
                      placeholder="Kavali, Nellore"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partnership Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="Vendor">Vendor Store</option>
                      <option value="Franchise">Franchise Node</option>
                      <option value="Entrepreneur">Entrepreneur</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Delivery Partner">Delivery Partner</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Interest Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Grocery store partner"
                      value={formInterest}
                      onChange={(e) => setFormInterest(e.target.value)}
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
                    Save Lead
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
