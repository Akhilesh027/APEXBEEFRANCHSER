import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import type { SupportTicket } from '../types';
import {
  HelpCircle,
  Plus,
  Video,
  ChevronDown,
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
  BookOpen,
  Search,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Support: React.FC = () => {
  const { tickets, addTicket, updateTicketStatus } = useRole();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Search & Tab States
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [ticketTab, setTicketTab] = useState<'standard' | 'escalated'>('standard');
  const [escalatedTicketIds, setEscalatedTicketIds] = useState<string[]>([]);

  // WhatsApp Support Simulator States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste! Welcome to ApexBee Help Desk. How can we help you with your franchise operations today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Billing');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    addTicket(subject, category, priority, description);
    
    // Reset Form
    setSubject('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let botReply = "Thank you for writing. Our regional operations team has been notified and will write back to you shortly.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('hi') || lower.includes('hello')) {
        botReply = "Namaste! Welcome to ApexBee Franchise Support. How can we help you today with your regional operations?";
      } else if (lower.includes('commission')) {
        botReply = "Franchise commission splits are processed monthly. Mandal gets 3.0%, District gets 1.5%, State gets 0.5%.";
      } else if (lower.includes('payout') || lower.includes('withdraw')) {
        botReply = "Payout requests are routed directly to your registered bank account and take 2-3 working days to clear.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 800);
  };

  const getPriorityColor = (p: SupportTicket['priority']) => {
    if (p === 'High') return 'text-rose-500 bg-rose-500/10 border-rose-500/25';
    if (p === 'Medium') return 'text-amber-500 bg-amber-500/10 border-amber-500/25';
    return 'text-blue-500 bg-blue-500/10 border-blue-500/25';
  };

  const getStatusIcon = (status: SupportTicket['status'], id: string) => {
    if (escalatedTicketIds.includes(id)) {
      return <AlertTriangle size={14} className="text-rose-500" />;
    }
    if (status === 'Open') return <AlertTriangle size={14} className="text-blue-500" />;
    if (status === 'In Progress') return <Clock size={14} className="text-amber-500" />;
    return <CheckCircle size={14} className="text-emerald-500" />;
  };

  const handleEscalate = (id: string) => {
    setEscalatedTicketIds(prev => [...prev, id]);
    alert(`Ticket ${id} has been successfully Escalated to Corporate Support.`);
  };

  const faqs = [
    { q: "How is my franchise commission calculated?", a: "Commissions are calculated as percentage split matrices of the gross vendor order size. Mandal partners receive 3.0%, District partners receive 1.5%, and State partners receive 0.5% flat on all regional transactions." },
    { q: "What is the withdrawal verification process?", a: "Withdrawal payouts undergo bank routing verification checks. Once approved, the funds are released into your nominated bank account in 2-3 business working days." },
    { q: "How do I register a new vendor partner?", a: "Mandal partners can invite vendors to register via the CRM leads desk. Once a vendor completes onboarding and uploads documents, their operational status is activated upon partner approval." }
  ];

  // Filter FAQs by search
  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  // Split tickets between standard and escalated
  const standardTickets = tickets.filter(t => !escalatedTicketIds.includes(t.id));
  const escalatedTickets = tickets.filter(t => escalatedTicketIds.includes(t.id));

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
            <HelpCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Partner Support Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">Review training videos, guidelines, FAQs, and submit help desk tickets</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 active:scale-98 transition-all cursor-pointer text-center border-0 shrink-0"
        >
          <Plus size={16} />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Standard / Escalated Tickets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-4">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Your Support Tickets</h3>
              
              {/* Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 shrink-0">
                <button
                  onClick={() => setTicketTab('standard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
                    ticketTab === 'standard' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 bg-transparent'
                  }`}
                >
                  My Tickets ({standardTickets.length})
                </button>
                <button
                  onClick={() => setTicketTab('escalated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
                    ticketTab === 'escalated' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 bg-transparent'
                  }`}
                >
                  Escalated ({escalatedTickets.length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {ticketTab === 'standard' ? (
                standardTickets.length === 0 ? (
                  <p className="text-center text-xs text-slate-450 py-10 font-semibold">No standard support tickets logged.</p>
                ) : (
                  standardTickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">{tkt.id}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(tkt.priority)}`}>
                              {tkt.priority} Priority
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mt-1">
                            {tkt.subject}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 capitalize">
                          {getStatusIcon(tkt.status, tkt.id)}
                          <span>{tkt.status}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{tkt.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200/25 dark:border-slate-850 pt-2.5">
                        <span>Category: {tkt.category} • Submitted {tkt.createdDate}</span>
                        <div className="flex items-center gap-3">
                          {tkt.status !== 'Resolved' && (
                            <>
                              <button
                                onClick={() => handleEscalate(tkt.id)}
                                className="text-amber-500 hover:underline text-[9px] font-bold border-0 bg-transparent cursor-pointer"
                              >
                                Escalate to Corporate
                              </button>
                              <button
                                onClick={() => updateTicketStatus(tkt.id, 'Resolved')}
                                className="text-primary hover:underline text-[9px] font-bold border-0 bg-transparent cursor-pointer"
                              >
                                Mark Resolved
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                escalatedTickets.length === 0 ? (
                  <p className="text-center text-xs text-slate-450 py-10 font-semibold">No escalated support tickets logged.</p>
                ) : (
                  escalatedTickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-4 rounded-2xl bg-rose-50/5 dark:bg-rose-950/5 border border-rose-100/30 dark:border-rose-900/30 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">{tkt.id}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border text-rose-500 bg-rose-500/10 border-rose-500/20">
                              Escalated
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mt-1">
                            {tkt.subject}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 capitalize">
                          {getStatusIcon(tkt.status, tkt.id)}
                          <span>Corporate Review</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{tkt.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-slate-200/25 dark:border-slate-850 pt-2.5">
                        <span>Corporate escalation queue • Submitted {tkt.createdDate}</span>
                        <span className="text-[9px] font-bold text-rose-400">Response SLA: 24 hrs</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Search FAQs and WhatsApp Simulator */}
        <div className="lg:col-span-1 space-y-6">
          {/* Guidelines & Videos */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Guidelines & Courseware</h3>
            
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 hover:border-primary/20 transition-all text-decoration-none">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <BookOpen size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Onboarding Guidelines</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-semibold">Official compliance documentation PDF</span>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 hover:border-primary/20 transition-all text-decoration-none">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Video size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Franchise Video Tutorial</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-semibold">15 mins operations setup course</span>
                </div>
              </a>
            </div>
          </div>

          {/* FAQs search & accordion */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Knowledge Base Desk</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Search FAQs instantly</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search queries (e.g. commission)..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-[11px] bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-2 pt-1">
              {filteredFaqs.length === 0 ? (
                <p className="text-center text-xs text-slate-450 py-4 font-semibold">No matching questions found.</p>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-850 pb-2.5 last:border-b-0"
                  >
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-700 dark:text-slate-350 py-1.5 hover:text-primary transition-colors cursor-pointer border-0 bg-transparent focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeFAQ === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeFAQ === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[10px] text-slate-450 leading-relaxed pt-1.5 pl-0.5 font-semibold">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* WhatsApp Support Simulator */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col h-[320px]">
            <div className="flex items-center gap-3 border-b border-slate-150 dark:border-slate-850 pb-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">WhatsApp Support Simulator</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Simulate live WhatsApp chat</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[11px] font-sans scrollbar-thin">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-tl-none font-semibold'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2 pt-2 border-t border-slate-150 dark:border-slate-850 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type 'commission' or 'payout'..."
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer border-0 shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Raise Ticket Modal */}
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
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Raise Technical/Billing Ticket</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border-0 bg-transparent"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ticket Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Discrepancy in June commission breakdown"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="Billing">Billing & Payouts</option>
                      <option value="Technical">Technical Bugs</option>
                      <option value="Vendor Issue">Vendor Operations</option>
                      <option value="Franchise Network">Franchise Guidelines</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Issue Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about the issue or bug you are encountering..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
                  />
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
                    Submit Ticket
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
