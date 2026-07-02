import React, { useState, useEffect } from 'react';
import type { Entrepreneur, EntrepreneurLead, EntrepreneurTraining, EntrepreneurCertExam } from '../types';
import { useRole } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, FileText, CheckCircle, Users, BookOpen, Shield,
  Wallet, Percent, Users2, Target, TrendingUp, Award, BarChart3,
  Briefcase, Search, Phone, MessageCircle, Download, Copy,
  UserCheck, XCircle, AlertCircle, Plus, X, MapPin, Store,
  Wrench, Building2, Clock, Zap
} from 'lucide-react';

// ─── helpers ───────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100)));

const certColor = (level: string) => {
  if (level === 'Platinum') return 'text-purple-600 bg-purple-500/10 border-purple-500/30';
  if (level === 'Gold') return 'text-amber-600 bg-amber-500/10 border-amber-500/30';
  if (level === 'Silver') return 'text-slate-500 bg-slate-400/10 border-slate-400/30';
  if (level === 'Bronze') return 'text-orange-600 bg-orange-500/10 border-orange-500/30';
  return 'text-slate-400 bg-slate-100 border-slate-200';
};

const statusBadge = (status: string) => {
  if (status === 'Active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (status === 'Training') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  if (status === 'Pending') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  if (status === 'Suspended') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  return 'bg-slate-100 text-slate-400 border-slate-200';
};

const scoreColor = (score: number) => {
  if (score >= 90) return 'bg-purple-500';
  if (score >= 75) return 'bg-amber-500';
  if (score >= 60) return 'bg-emerald-500';
  if (score > 0) return 'bg-blue-500';
  return 'bg-slate-300';
};

const scoreBadge = (score: number) => {
  if (score >= 90) return { label: 'Platinum', cls: 'text-purple-600 bg-purple-500/10 border-purple-500/30' };
  if (score >= 75) return { label: 'Gold', cls: 'text-amber-600 bg-amber-500/10 border-amber-500/30' };
  if (score >= 60) return { label: 'Silver', cls: 'text-slate-500 bg-slate-400/10 border-slate-400/30' };
  return { label: 'Bronze', cls: 'text-orange-600 bg-orange-500/10 border-orange-500/30' };
};

const progressBarColor = (p: number) => {
  if (p >= 80) return 'bg-emerald-500';
  if (p >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

// Card wrapper
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl ${className}`}>
    {children}
  </div>
);

// KPI card
const KpiCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string }> = ({
  label, value, icon, color = 'text-primary bg-primary/10', sub
}) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-2xl ${color}`}>{icon}</div>
    </div>
    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-3">{label}</p>
    <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
  </Card>
);

// Progress bar row
const ProgressRow: React.FC<{ label: string; achieved: number; target: number; unit?: string }> = ({ label, achieved, target, unit = '' }) => {
  const p = pct(achieved, target);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-slate-400">{achieved}{unit} / {target}{unit} <span className="text-slate-500">({p}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${progressBarColor(p)}`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
};

// ─── tab definitions ────────────────────────────────────────────────────────
const TABS = [
  { id: 'active', label: 'Active Entrepreneurs', icon: Users },
  { id: 'applications', label: 'Applications', icon: FileText },
];

// ─── growth chart data ──────────────────────────────────────────────────────
const growthData = [
  { month: 'Jan', entrepreneurs: 2 },
  { month: 'Feb', entrepreneurs: 3 },
  { month: 'Mar', entrepreneurs: 4 },
  { month: 'Apr', entrepreneurs: 5 },
  { month: 'May', entrepreneurs: 6 },
  { month: 'Jun', entrepreneurs: 8 },
];

const revenueContribData = [
  { name: 'Vendor', revenue: 794000 },
  { name: 'Customer', revenue: 229000 },
  { name: 'SP', revenue: 110000 },
  { name: 'Franchise', revenue: 27000 },
];

const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

// ─── main component ─────────────────────────────────────────────────────────
export const EntrepreneursPage: React.FC = () => {
  const { role, partner, entrepreneurs: contextEntrepreneurs } = useRole();
  const entrepreneurList = contextEntrepreneurs;
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntId, setSelectedEntId] = useState<string>(contextEntrepreneurs[0]?.id || '');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('All');
  const [trainingCategory, setTrainingCategory] = useState<string>('All');
  const [appFilter, setAppFilter] = useState<string>('All');
  const [reportPeriod, setReportPeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [reportCategory, setReportCategory] = useState<string>('Revenue');
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedEntId, setExpandedEntId] = useState<string | null>(null);
  const [leads, setLeads] = useState<EntrepreneurLead[]>([]);
  const [entrepreneurTrainingList, setEntrepreneurTrainingList] = useState<EntrepreneurTraining[]>([]);
  const [entrepreneurCertExamList] = useState<EntrepreneurCertExam[]>([]);

  // Update selected entrepreneur when context loads
  useEffect(() => {
    if (contextEntrepreneurs.length > 0 && !selectedEntId) {
      setSelectedEntId(contextEntrepreneurs[0].id);
    }
  }, [contextEntrepreneurs]);

  // Fetch training data from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('https://server.apexbee.in/api/entrepreneur/training', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.data || data.training) setEntrepreneurTrainingList(data.data || data.training || []); })
      .catch(() => {});
    fetch('https://server.apexbee.in/api/entrepreneur/leads', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.data || data.leads) setLeads(data.data || data.leads || []); })
      .catch(() => {});
  }, []);

  // New lead form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadType, setNewLeadType] = useState<EntrepreneurLead['type']>('Vendor');
  const [newLeadLocation, setNewLeadLocation] = useState('');

  const selectedEnt = entrepreneurList.find(e => e.id === selectedEntId) ?? entrepreneurList[0];
  const activeEnts = entrepreneurList.filter(e => e.status === 'Active');
  const totalLeadsAll = entrepreneurList.reduce((s, e) => s + e.totalLeads, 0);
  const totalConverted = entrepreneurList.reduce((s, e) => s + e.leadsConverted, 0);

  const handleExport = (type: string) => {
    setExportLoading(type);
    setTimeout(() => setExportLoading(null), 1800);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: EntrepreneurLead = {
      id: `EL-${String(leads.length + 1).padStart(3, '0')}`,
      entrepreneurId: selectedEntId,
      entrepreneurName: selectedEnt.name,
      name: newLeadName,
      phone: newLeadPhone,
      type: newLeadType,
      status: 'New',
      source: 'Walk-in',
      location: newLeadLocation,
      date: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    setNewLeadName(''); setNewLeadPhone(''); setNewLeadLocation('');
    setShowLeadModal(false);
  };

  const handleCopyReferral = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ─── filtered lists ──────────────────────────────────────────────────────
  const filteredLeads = leads.filter(l =>
    (leadTypeFilter === 'All' || l.type === leadTypeFilter) &&
    (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.entrepreneurName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTraining: EntrepreneurTraining[] = entrepreneurTrainingList.filter(t =>
    trainingCategory === 'All' || t.category === trainingCategory
  );

  const pendingApps = entrepreneurList.filter(e => {
    if (appFilter === 'All') return e.status === 'Pending' || (e.status === 'Training' && e.interviewStatus !== 'N/A');
    if (appFilter === 'Pending') return e.interviewStatus === 'Pending' || e.interviewStatus === 'Scheduled';
    if (appFilter === 'Scheduled') return e.interviewStatus === 'Scheduled';
    if (appFilter === 'Passed') return e.interviewStatus === 'Passed';
    return true;
  });

  const readyForApproval = entrepreneurList.filter(e =>
    e.interviewStatus === 'Passed' && e.documentStatus === 'Verified' && e.status !== 'Active'
  );

  // ─── tab content renderers ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Entrepreneurs" value={8} icon={<Users size={18} />} />
        <KpiCard label="Active" value={5} icon={<CheckCircle size={18} />} color="text-emerald-600 bg-emerald-500/10" />
        <KpiCard label="Pending" value={1} icon={<Clock size={18} />} color="text-blue-600 bg-blue-500/10" />
        <KpiCard label="In Training" value={2} icon={<BookOpen size={18} />} color="text-amber-600 bg-amber-500/10" />
        <KpiCard label="Certified" value={4} icon={<Shield size={18} />} color="text-purple-600 bg-purple-500/10" />
        <KpiCard label="Monthly Revenue" value={fmt(230000)} icon={<TrendingUp size={18} />} color="text-emerald-600 bg-emerald-500/10" />
        <KpiCard label="Commission Paid" value={fmt(160400)} icon={<Percent size={18} />} color="text-indigo-600 bg-indigo-500/10" />
        <KpiCard label="Vendor Leads" value={171} icon={<Store size={18} />} color="text-orange-600 bg-orange-500/10" />
        <KpiCard label="Customer Leads" value={264} icon={<UserCheck size={18} />} color="text-teal-600 bg-teal-500/10" />
        <KpiCard label="SP Leads" value={59} icon={<Wrench size={18} />} color="text-rose-600 bg-rose-500/10" />
        <KpiCard label="Franchise Leads" value={11} icon={<Building2 size={18} />} color="text-violet-600 bg-violet-500/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Entrepreneur Growth (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="entrepreneurs" stroke="#2563EB" fill="url(#entGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" /> Revenue Contribution by Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueContribData} barCategoryGap="35%">
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: unknown) => typeof v === 'number' ? fmt(v) : String(v)} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueContribData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Leaderboard + Targets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Entrepreneurs */}
        <Card className="p-6">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
            <Award size={16} className="text-amber-500" /> Top Entrepreneurs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-right">Revenue</th>
                  <th className="py-2 px-3 text-center">Score</th>
                  <th className="py-2 px-3 text-center">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {[...entrepreneurList].sort((a, b) => b.salesRevenue - a.salesRevenue).slice(0, 5).map((e, i) => {
                  const sb = scoreBadge(e.performanceScore);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center text-white ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-700' : 'bg-slate-300 dark:bg-slate-700'}`}>{i + 1}</span>
                        {e.name}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-right text-slate-800 dark:text-slate-100">{fmt(e.salesRevenue)}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">{e.performanceScore}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${sb.cls}`}>{sb.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Aggregate Targets */}
        <Card className="p-6">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
            <Target size={16} className="text-emerald-500" /> Aggregate Target Achievement
          </h3>
          <div className="space-y-4">
            <ProgressRow label="Vendor Acquisition" achieved={81} target={120} />
            <ProgressRow label="Customer Acquisition" achieved={198} target={270} />
            <ProgressRow label="Service Provider Acq." achieved={26} target={42} />
            <ProgressRow label="Franchise Acquisition" achieved={3} target={7} />
            <ProgressRow label="Revenue (Lakhs)" achieved={11.6} target={15} unit="L" />
          </div>
        </Card>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'Pending', 'Scheduled', 'Passed'].map(f => (
          <button key={f} onClick={() => setAppFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${appFilter === f ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}>
            {f}
          </button>
        ))}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-5">Applicant</th>
                <th className="py-4 px-5">Applied Date</th>
                <th className="py-4 px-5">Territory</th>
                <th className="py-4 px-5">Interview</th>
                <th className="py-4 px-5">Documents</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {pendingApps.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">No applications matching this filter.</td></tr>
              ) : pendingApps.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{e.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{e.email} · {e.phone}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-500">{e.applicationDate}</td>
                  <td className="py-4 px-5 text-slate-600 dark:text-slate-300">{e.mandal}, {e.district}</td>
                  <td className="py-4 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${e.interviewStatus === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : e.interviewStatus === 'Scheduled' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                      {e.interviewStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${e.documentStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : e.documentStatus === 'Submitted' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                      {e.documentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer transition-colors">Approve</button>
                      <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-100 cursor-pointer transition-colors">Reject</button>
                      <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer transition-colors">Req. Docs</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-500" /> Ready for Activation
        </h3>
        <p className="text-xs text-slate-400 mb-5">Entrepreneurs who passed interview and document verification.</p>
        {readyForApproval.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">All approved entrepreneurs are already active.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Applicant</th>
                  <th className="py-4 px-5">Territory</th>
                  <th className="py-4 px-5">Mentor</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {readyForApproval.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">{e.name}</td>
                    <td className="py-4 px-5 text-slate-500">{e.mandal}, {e.district}</td>
                    <td className="py-4 px-5 text-slate-500">{e.mentor}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-blue-600 cursor-pointer">Activate</button>
                        <button className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 cursor-pointer">Assign Mentor</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card className="p-5">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-primary" /> Recently Approved
        </h3>
        {[entrepreneurList[0], entrepreneurList[1], entrepreneurList[4], entrepreneurList[5], entrepreneurList[7]].map(e => (
          <div key={e.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
            <div>
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{e.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{e.district} · Approved {e.joiningDate}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${certColor(e.certificationLevel)}`}>{e.certificationLevel}</span>
          </div>
        ))}
      </Card>
    </div>
  );

  const renderActive = () => {
    const filtered = activeEnts.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, district, mandal…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Territory</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Score</th>
                  <th className="py-4 px-5">Revenue</th>
                  <th className="py-4 px-5">Commission</th>
                  <th className="py-4 px-5">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map(e => (
                  <React.Fragment key={e.id}>
                    <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 cursor-pointer" onClick={() => setExpandedEntId(expandedEntId === e.id ? null : e.id)}>
                      <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">{e.name}</td>
                      <td className="py-4 px-5 text-slate-500"><div className="flex items-center gap-1"><MapPin size={11} />{e.mandal}</div></td>
                      <td className="py-4 px-5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadge(e.status)}`}>{e.status}</span></td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 w-20 overflow-hidden">
                            <div className={`h-full rounded-full ${scoreColor(e.performanceScore)}`} style={{ width: `${e.performanceScore}%` }} />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{e.performanceScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-extrabold text-slate-800 dark:text-slate-100">{fmt(e.salesRevenue)}</td>
                      <td className="py-4 px-5 font-bold text-emerald-500">{fmt(e.commissionEarned)}</td>
                      <td className="py-4 px-5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${certColor(e.certificationLevel)}`}>{e.certificationLevel}</span></td>
                    </tr>
                    <AnimatePresence>
                      {expandedEntId === e.id && (
                        <tr>
                          <td colSpan={7} className="px-5 pb-5">
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                              {[
                                ['Vendors Acquired', e.vendorsAcquired], ['Customers Acquired', e.customersAcquired],
                                ['Leads Generated', e.totalLeads], ['Referrals', e.referralsCount],
                                ['Team Size', e.teamSize], ['Team Revenue', fmt(e.teamRevenue)],
                                ['Mentor', e.mentor], ['Joined', e.joiningDate]
                              ].map(([k, v]) => (
                                <div key={String(k)}>
                                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{k}</p>
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{v}</p>
                                </div>
                              ))}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const trainingCategories = ['All', 'Vendor Acquisition', 'Customer Acquisition', 'Franchise Sales', 'Service Provider', 'Digital Marketing', 'Product Knowledge', 'Business Development'];
  const completedTraining = entrepreneurTrainingList.filter(t => t.status === 'Completed').length;

  const renderTraining = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {trainingCategories.slice(0, 5).map(c => (
            <button key={c} onClick={() => setTrainingCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${trainingCategory === c ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}>
              {c}
            </button>
          ))}
        </div>
        <Card className="px-4 py-2.5 !rounded-2xl">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{completedTraining} / {entrepreneurTrainingList.length} completed — </span>
          <span className="text-xs font-black text-primary">{Math.round((completedTraining / entrepreneurTrainingList.length) * 100)}%</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTraining.map((t: EntrepreneurTraining) => (
          <motion.div key={t.id} whileHover={{ y: -3 }}>
            <Card className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${t.type === 'Video' ? 'text-blue-600 bg-blue-500/10 border-blue-500/20' : t.type === 'Document' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-600 bg-amber-500/10 border-amber-500/20'}`}>{t.type}</span>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-2 leading-snug">{t.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t.category} · {t.duration}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Progress</span><span>{t.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${t.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${t.progress}%` }} />
                </div>
              </div>
              <button className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : t.status === 'In Progress' ? 'bg-primary text-white hover:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
                {t.status === 'Completed' ? '✓ Review Module' : t.status === 'In Progress' ? 'Continue →' : 'Start Module'}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => {
    const levels: { level: EntrepreneurCertExam['level']; emoji: string; desc: string }[] = [
      { level: 'Bronze', emoji: '🥉', desc: 'Foundation level — 20 questions, 60% pass mark' },
      { level: 'Silver', emoji: '🥈', desc: 'Intermediate — 35 questions, 65% pass mark' },
      { level: 'Gold', emoji: '🥇', desc: 'Advanced — 50 questions, 70% pass mark' },
      { level: 'Platinum', emoji: '💎', desc: 'Expert — 75 questions, 80% pass mark' },
    ];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map(lv => (
            <Card key={lv.level} className="p-5 text-center">
              <div className="text-3xl mb-2">{lv.emoji}</div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{lv.level} Entrepreneur</p>
              <p className="text-[10px] text-slate-400 mt-1">{lv.desc}</p>
            </Card>
          ))}
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Certification</th>
                  <th className="py-4 px-5">Level</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Score</th>
                  <th className="py-4 px-5">Renewal</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {(entrepreneurCertExamList as EntrepreneurCertExam[]).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">{c.title}</td>
                    <td className="py-4 px-5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${certColor(c.level)}`}>{c.level}</span></td>
                    <td className="py-4 px-5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${c.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : c.status === 'Failed' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : c.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{c.status}</span>
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-slate-700 dark:text-slate-300">{c.score !== undefined ? `${c.score}%` : '—'}</td>
                    <td className="py-4 px-5 text-slate-400">{c.renewalDate ?? '—'}</td>
                    <td className="py-4 px-5 text-center">
                      {c.status === 'Passed' ? (
                        <button className="text-[10px] font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer flex items-center gap-1 mx-auto">
                          <Download size={11} /> Certificate
                        </button>
                      ) : (
                        <button className="text-[10px] font-bold px-3 py-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer mx-auto">{c.status === 'In Progress' ? 'Continue' : 'Take Exam'}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderWallets = () => {
    const ent = selectedEnt;
    const walletTx = [
      { date: '2026-06-13', type: 'Vendor Commission', amount: ent.vendorAcqCommission * 0.1, status: 'Credited' },
      { date: '2026-06-12', type: 'Referral Bonus', amount: ent.referralEarnings * 0.2, status: 'Credited' },
      { date: '2026-06-10', type: 'Lead Incentive', amount: ent.leadIncentives * 0.15, status: 'Credited' },
      { date: '2026-06-08', type: 'Withdrawal', amount: -5000, status: 'Deducted' },
      { date: '2026-06-06', type: 'Team Bonus', amount: ent.teamEarnings * 0.1, status: 'Credited' },
    ];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Select Entrepreneur:</label>
          <select value={selectedEntId} onChange={e => setSelectedEntId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer">
            {activeEnts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Available Balance', value: ent.walletBalance, color: 'text-emerald-600 bg-emerald-500/10' },
            { label: 'Pending Balance', value: ent.pendingBalance, color: 'text-amber-600 bg-amber-500/10' },
            { label: 'Referral Earnings', value: ent.referralEarnings, color: 'text-blue-600 bg-blue-500/10' },
            { label: 'Lead Incentives', value: ent.leadIncentives, color: 'text-purple-600 bg-purple-500/10' },
            { label: 'Team Earnings', value: ent.teamEarnings, color: 'text-teal-600 bg-teal-500/10' },
            { label: 'Lifetime Earnings', value: ent.lifetimeEarnings, color: 'text-slate-600 bg-slate-500/10' },
          ].map(w => (
            <KpiCard key={w.label} label={w.label} value={fmt(w.value)} icon={<Wallet size={16} />} color={w.color} />
          ))}
        </div>

        <Card className="p-5">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-4">Date</th><th className="py-3 px-4">Type</th><th className="py-3 px-4 text-right">Amount</th><th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {walletTx.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">{tx.type}</td>
                    <td className={`py-3 px-4 font-extrabold text-right ${tx.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.amount >= 0 ? '+' : ''}{fmt(Math.abs(tx.amount))}</td>
                    <td className="py-3 px-4 text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tx.status === 'Credited' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderCommissions = () => {
    const ent = selectedEnt;
    const commData = [
      { name: 'Vendor Acq.', value: ent.vendorAcqCommission },
      { name: 'Customer Acq.', value: ent.customerAcqCommission },
      { name: 'SP Acq.', value: ent.spAcqCommission },
      { name: 'Franchise Acq.', value: ent.franchiseAcqCommission },
      { name: 'Referral', value: ent.referralEarnings },
      { name: 'MLM', value: ent.mlmEarnings },
    ].filter(d => d.value > 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Select Entrepreneur:</label>
          <select value={selectedEntId} onChange={e => setSelectedEntId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer">
            {entrepreneurList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Commission Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={commData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={((p: { name?: string; percent?: number }) => `${p.name ?? ''} ${(((p.percent) ?? 0) * 100).toFixed(0)}%`) as unknown as boolean} labelLine={false}>
                  {commData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: unknown) => typeof v === 'number' ? fmt(v) : String(v)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Commission Ledger</h3>
            <div className="space-y-3">
              {commData.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{d.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-500">{fmt(d.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 mt-2 border-t-2 border-slate-200 dark:border-slate-700">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Total Commission</span>
                <span className="text-sm font-black text-emerald-500">{fmt(ent.commissionEarned)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderReferrals = () => {
    const ent = selectedEnt;
    const refCode = `APEX-${ent.id}-REF`;
    const l1 = [
      { name: 'J. Srinivas', phone: '+91 99554 11222', joined: '2026-02-10', revenue: 0 },
      { name: 'K. Madhavi', phone: '+91 99554 11223', joined: '2026-05-01', revenue: 0 },
      { name: 'G. Saradha Devi', phone: '+91 99554 11225', joined: '2025-11-10', revenue: 72000 },
    ].slice(0, ent.referralsCount);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Select Entrepreneur:</label>
          <select value={selectedEntId} onChange={e => setSelectedEntId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer">
            {entrepreneurList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="Total Referrals" value={ent.referralsCount} icon={<Users2 size={16} />} />
          <KpiCard label="Referral Earnings" value={fmt(ent.referralEarnings)} icon={<Percent size={16} />} color="text-emerald-600 bg-emerald-500/10" />
          <Card className="p-5 flex flex-col justify-between">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Referral Code</p>
            <div className="flex items-center gap-2 mt-2">
              <code className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{refCode}</code>
              <button onClick={handleCopyReferral} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer transition-colors text-slate-500">
                {copiedCode ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </Card>
        </div>

        {/* Visual Referral Tree */}
        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5">Referral Network Tree</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
                {ent.name.charAt(0)}
              </div>
              {ent.name} <span className="text-[10px] text-slate-400 font-normal">(You)</span>
            </div>
            {l1.map((r, i) => (
              <div key={i} className="ml-8 flex items-center gap-2 py-2.5 border-l-2 border-slate-200 dark:border-slate-700 pl-4 text-xs">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-[10px]">L1</div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{r.name}</p>
                  <p className="text-[10px] text-slate-400">{r.phone} · Joined {r.joined}</p>
                </div>
                <div className="ml-auto font-extrabold text-emerald-500 text-xs">{fmt(r.revenue)}</div>
              </div>
            ))}
            {ent.referralsCount === 0 && <p className="ml-8 text-xs text-slate-400 py-4">No referrals yet. Share your code to start growing!</p>}
          </div>
        </Card>
      </div>
    );
  };

  const renderTeams = () => {
    const ent = selectedEnt;
    const teamMembers = entrepreneurList.filter(e => e.id !== ent.id && e.status === 'Active').slice(0, ent.teamSize);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Team Lead:</label>
          <select value={selectedEntId} onChange={e => setSelectedEntId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer">
            {activeEnts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="Team Size" value={ent.teamSize} icon={<Users size={16} />} />
          <KpiCard label="Team Revenue" value={fmt(ent.teamRevenue)} icon={<TrendingUp size={16} />} color="text-emerald-600 bg-emerald-500/10" />
          <KpiCard label="Team Commission" value={fmt(ent.teamEarnings)} icon={<Percent size={16} />} color="text-purple-600 bg-purple-500/10" />
        </div>
        {/* Hierarchy */}
        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5">Team Hierarchy</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm">{ent.name.charAt(0)}</div>
              <div><p>{ent.name}</p><p className="text-[10px] font-normal text-slate-400">Team Lead · {ent.certificationLevel}</p></div>
            </div>
            {teamMembers.map((m, i) => {
              const mb = scoreBadge(m.performanceScore);
              return (
                <div key={i} className="ml-10 border-l-2 border-slate-200 dark:border-slate-700 pl-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 text-xs">{m.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{m.name}</p>
                      <p className="text-[10px] text-slate-400">{m.mandal} · {m.certificationLevel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{fmt(m.salesRevenue)}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${mb.cls}`}>{mb.label}</span>
                  </div>
                </div>
              );
            })}
            {ent.teamSize === 0 && <p className="ml-10 text-xs text-slate-400 py-4">No team members yet.</p>}
          </div>
        </Card>
      </div>
    );
  };

  const renderLeads = () => {
    const types = ['All', 'Vendor', 'Customer', 'Service Provider', 'Franchise'];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setLeadTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${leadTypeFilter === t ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setShowLeadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-blue-600 transition-colors">
            <Plus size={14} /> New Lead
          </button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Lead Name</th>
                  <th className="py-4 px-5">Type</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Source</th>
                  <th className="py-4 px-5">Entrepreneur</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLeads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.phone}</p>
                    </td>
                    <td className="py-4 px-5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{l.type}</span></td>
                    <td className="py-4 px-5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${l.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : l.status === 'Lost' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : l.status === 'Follow-up' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{l.status}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-500">{l.source}</td>
                    <td className="py-4 px-5 text-slate-500">{l.entrepreneurName}</td>
                    <td className="py-4 px-5 text-slate-400">{l.date}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Call" className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer"><Phone size={12} /></button>
                        <button title="WhatsApp" className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 cursor-pointer"><MessageCircle size={12} /></button>
                        {l.status !== 'Converted' && <button title="Convert" className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 cursor-pointer"><CheckCircle size={12} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* New Lead Modal */}
        <AnimatePresence>
          {showLeadModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Add New Lead</h3>
                  <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>
                <form onSubmit={handleAddLead} className="p-6 space-y-4">
                  {[
                    { label: 'Lead Name', val: newLeadName, set: setNewLeadName, placeholder: 'Business or person name' },
                    { label: 'Phone', val: newLeadPhone, set: setNewLeadPhone, placeholder: '+91 XXXXX XXXXX' },
                    { label: 'Location', val: newLeadLocation, set: setNewLeadLocation, placeholder: 'City, Mandal' },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{f.label}</label>
                      <input required value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Type</label>
                    <select value={newLeadType} onChange={e => setNewLeadType(e.target.value as EntrepreneurLead['type'])}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer">
                      {['Vendor', 'Customer', 'Service Provider', 'Franchise'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setShowLeadModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200">Cancel</button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-blue-600">Add Lead</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderAcquisition = (type: 'vendor' | 'customer' | 'sp' | 'franchise') => {
    const config = {
      vendor: { label: 'Vendor Acquisition', acqKey: 'vendorsAcquired', revKey: 'vendorRevenue', targetKey: 'vendorTarget', color: 'text-orange-600' } as const,
      customer: { label: 'Customer Acquisition', acqKey: 'customersAcquired', revKey: 'customerRevenue', targetKey: 'customerTarget', color: 'text-teal-600' } as const,
      sp: { label: 'Service Provider Acquisition', acqKey: 'spAcquired', revKey: 'spRevenue', targetKey: 'spTarget', color: 'text-rose-600' } as const,
      franchise: { label: 'Franchise Acquisition', acqKey: 'franchisesAcquired', revKey: 'franchiseRevenue', targetKey: 'franchiseTarget', color: 'text-violet-600' } as const,
    }[type];

    const totalAcq = entrepreneurList.reduce((s, e) => s + e[config.acqKey], 0);
    const totalRev = entrepreneurList.reduce((s, e) => s + e[config.revKey], 0);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard label={`Total ${config.label.split(' ')[0]}s`} value={totalAcq} icon={<UserCheck size={16} />} />
          <KpiCard label="Total Revenue" value={fmt(totalRev)} icon={<TrendingUp size={16} />} color="text-emerald-600 bg-emerald-500/10" />
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Entrepreneur</th>
                  <th className="py-4 px-5 text-center">Acquired</th>
                  <th className="py-4 px-5 text-right">Revenue</th>
                  <th className="py-4 px-5 text-center">Target</th>
                  <th className="py-4 px-5">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {entrepreneurList.filter(e => e.status === 'Active').sort((a, b) => b[config.acqKey] - a[config.acqKey]).map(e => {
                  const p = pct(e[config.acqKey], e[config.targetKey]);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">{e.name}</td>
                      <td className="py-4 px-5 text-center font-extrabold text-slate-700 dark:text-slate-200">{e[config.acqKey]}</td>
                      <td className="py-4 px-5 text-right font-bold text-emerald-500">{fmt(e[config.revKey])}</td>
                      <td className="py-4 px-5 text-center text-slate-400">{e[config.targetKey]}</td>
                      <td className="py-4 px-5 min-w-[160px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${progressBarColor(p)}`} style={{ width: `${p}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 w-8">{p}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderTargets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {activeEnts.map(e => (
        <Card key={e.id} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{e.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{e.mandal} · {e.certificationLevel}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${certColor(e.certificationLevel)}`}>{e.certificationLevel}</span>
          </div>
          <div className="space-y-3">
            <ProgressRow label="Vendor Acquisition" achieved={e.vendorsAcquired} target={e.vendorTarget} />
            <ProgressRow label="Customer Acquisition" achieved={e.customersAcquired} target={e.customerTarget} />
            <ProgressRow label="SP Acquisition" achieved={e.spAcquired} target={e.spTarget} />
            <ProgressRow label="Revenue" achieved={Math.round(e.salesRevenue / 1000)} target={Math.round(e.revenueTarget / 1000)} unit="K" />
          </div>
        </Card>
      ))}
    </div>
  );

  const renderPerformance = () => {
    const perfData = activeEnts.map(e => ({ name: e.name.split(' ')[0], score: e.performanceScore }));
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Performance Score Chart</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perfData} barCategoryGap="40%">
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {perfData.map((d, i) => <Cell key={i} fill={d.score >= 90 ? '#8B5CF6' : d.score >= 75 ? '#F59E0B' : d.score >= 60 ? '#10B981' : '#3B82F6'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Entrepreneur</th>
                  <th className="py-4 px-5 text-center">Total Leads</th>
                  <th className="py-4 px-5 text-center">Conv. Rate</th>
                  <th className="py-4 px-5 text-right">Revenue</th>
                  <th className="py-4 px-5 text-right">Commission</th>
                  <th className="py-4 px-5 text-center">Score</th>
                  <th className="py-4 px-5 text-center">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {[...entrepreneurList].sort((a, b) => b.performanceScore - a.performanceScore).map(e => {
                  const conv = e.totalLeads > 0 ? Math.round((e.leadsConverted / e.totalLeads) * 100) : 0;
                  const sb = scoreBadge(e.performanceScore);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">{e.name}</td>
                      <td className="py-4 px-5 text-center text-slate-600 dark:text-slate-300">{e.totalLeads}</td>
                      <td className="py-4 px-5 text-center font-bold text-primary">{conv}%</td>
                      <td className="py-4 px-5 text-right font-extrabold text-slate-800 dark:text-slate-100">{fmt(e.salesRevenue)}</td>
                      <td className="py-4 px-5 text-right font-bold text-emerald-500">{fmt(e.commissionEarned)}</td>
                      <td className="py-4 px-5 text-center font-extrabold text-slate-700 dark:text-slate-200">{e.performanceScore}</td>
                      <td className="py-4 px-5 text-center"><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${sb.cls}`}>{sb.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderLeaderboards = () => {
    const sorted = (key: keyof Entrepreneur) => [...entrepreneurList].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 5);
    const boards = [
      { title: 'Top Revenue Generators', data: sorted('salesRevenue'), valKey: 'salesRevenue' as const, label: 'Revenue' },
      { title: 'Top Vendor Acquirers', data: sorted('vendorsAcquired'), valKey: 'vendorsAcquired' as const, label: 'Vendors' },
      { title: 'Top Customer Acquirers', data: sorted('customersAcquired'), valKey: 'customersAcquired' as const, label: 'Customers' },
      { title: 'Top Lead Converters', data: sorted('leadsConverted'), valKey: 'leadsConverted' as const, label: 'Converted' },
    ];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {boards.map(b => (
          <Card key={b.title} className="p-5">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Award size={16} className="text-amber-500" /> {b.title}
            </h3>
            <div className="space-y-2.5">
              {b.data.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center text-white shrink-0 ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{i + 1}</span>
                  <span className="flex-1 font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{e.name}</span>
                  <span className="font-extrabold text-xs text-primary">
                    {typeof e[b.valKey] === 'number' && b.valKey === 'salesRevenue' ? fmt(e[b.valKey] as number) : e[b.valKey]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderReports = () => {
    const periods: ('Daily' | 'Weekly' | 'Monthly' | 'Yearly')[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const categories = ['Revenue', 'Commission', 'Referral', 'MLM', 'Lead Conversion'];
    const stats = {
      Revenue: { total: fmt(230000), growth: '+14%', entries: 48 },
      Commission: { total: fmt(16040), growth: '+11%', entries: 32 },
      Referral: { total: fmt(8200), growth: '+22%', entries: 18 },
      MLM: { total: fmt(5200), growth: '+8%', entries: 12 },
      'Lead Conversion': { total: `${Math.round((totalConverted / Math.max(totalLeadsAll, 1)) * 100)}%`, growth: '+5%', entries: totalLeadsAll },
    } as Record<string, { total: string; growth: string; entries: number }>;
    const s = stats[reportCategory] ?? { total: '—', growth: '—', entries: 0 };

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400">Period:</label>
            <div className="flex gap-1">
              {periods.map(p => (
                <button key={p} onClick={() => setReportPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${reportPeriod === p ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400">Category:</label>
            <select value={reportCategory} onChange={e => setReportCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 cursor-pointer">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <KpiCard label={`${reportPeriod} ${reportCategory}`} value={s.total} icon={<BarChart3 size={16} />} />
          <KpiCard label="Growth vs Last Period" value={s.growth} icon={<TrendingUp size={16} />} color="text-emerald-600 bg-emerald-500/10" />
          <KpiCard label="Total Records" value={s.entries} icon={<FileText size={16} />} color="text-purple-600 bg-purple-500/10" />
        </div>

        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5">Export Report</h3>
          <div className="flex items-center gap-4">
            {['PDF', 'Excel', 'CSV'].map(type => (
              <button key={type} onClick={() => handleExport(type)} disabled={exportLoading !== null}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-primary/30 text-primary text-xs font-bold hover:bg-primary hover:text-white cursor-pointer transition-all disabled:opacity-60">
                {exportLoading === type ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : <Download size={14} />}
                {type}
              </button>
            ))}
          </div>
          {exportLoading && <p className="text-xs text-slate-400 mt-3 animate-pulse">Generating {exportLoading} report…</p>}
        </Card>
      </div>
    );
  };

  const renderSettings = () => {
    const commRates = [
      { type: 'Vendor Acquisition', rate: '5%', description: 'Per vendor onboarded successfully' },
      { type: 'Customer Acquisition', rate: '3%', description: 'Per customer on first order' },
      { type: 'Service Provider', rate: '4%', description: 'Per SP registered and verified' },
      { type: 'Franchise Acquisition', rate: '8%', description: 'Per franchise successfully converted' },
    ];
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <Percent size={16} className="text-primary" /> Commission Rate Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commRates.map(c => (
              <div key={c.type} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{c.type}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-primary">{c.rate}</span>
                  <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <Users size={16} className="text-primary" /> Mentor Assignment
          </h3>
          <div className="space-y-3">
            {entrepreneurList.filter(e => e.status !== 'Active' || e.mentor === 'Unassigned').map(e => (
              <div key={e.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                <div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{e.name}</p>
                  <p className="text-[10px] text-slate-400">Current mentor: {e.mentor}</p>
                </div>
                <select className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:border-primary">
                  <option>Select Mentor</option>
                  {activeEnts.map(m => <option key={m.id}>{m.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-500" /> Status Management
          </h3>
          <div className="space-y-3">
            {activeEnts.map(e => (
              <div key={e.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                <div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{e.name}</p>
                  <p className="text-[10px] text-slate-400">{e.mandal} · {e.district}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadge(e.status)}`}>{e.status}</span>
                  <button className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 cursor-pointer border border-rose-500/20 flex items-center gap-1">
                    <XCircle size={10} /> Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // ─── tab content dispatcher ──────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'applications': return renderApplications();
      case 'approvals': return renderApprovals();
      case 'active': return renderActive();
      case 'training': return renderTraining();
      case 'certifications': return renderCertifications();
      case 'wallets': return renderWallets();
      case 'commissions': return renderCommissions();
      case 'referrals': return renderReferrals();
      case 'teams': return renderTeams();
      case 'leads': return renderLeads();
      case 'vendor-acq': return renderAcquisition('vendor');
      case 'customer-acq': return renderAcquisition('customer');
      case 'sp-acq': return renderAcquisition('sp');
      case 'franchise-acq': return renderAcquisition('franchise');
      case 'targets': return renderTargets();
      case 'performance': return renderPerformance();
      case 'leaderboards': return renderLeaderboards();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return null;
    }
  };

  // ─── role scope banner ───────────────────────────────────────────────────
  const roleScopeLabel = role === 'state' ? `${partner.state || 'Andhra Pradesh'} State` : role === 'district' ? `${partner.district || 'SPSR Nellore'} District` : `${partner.mandal || 'Buchi Reddy Palem'} Mandal`;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Module Header */}
      <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Entrepreneur Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Business growth engine · Vendor, Customer, SP &amp; Franchise acquisition hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
            <MapPin size={12} />
            <span>{roleScopeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            <Zap size={12} />
            <span>{activeEnts.length} Active</span>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex gap-1.5 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60'}`}
              >
                <Icon size={13} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
