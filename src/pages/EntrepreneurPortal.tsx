import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Target, Store, UserCheck, Wrench, Building2,
  Wallet, Percent, Users2, Users, BookOpen, Shield, TrendingUp,
  Award, Phone, MessageCircle, CheckCircle, Plus,
  Download, Copy, MapPin, ChevronRight, Sun, Moon, LogOut, Zap,
  X, FileText, Bell, Star, Clock, Briefcase
} from 'lucide-react';

// ─── helpers ───────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100)));

const barColor = (p: number) => p >= 80 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-500' : 'bg-rose-500';

const TABS = [
  { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'My Leads', icon: Target },
  { id: 'vendor-acq', label: 'Vendor Acquisition', icon: Store },
  { id: 'customer-acq', label: 'Customer Acquisition', icon: UserCheck },
  { id: 'sp-acq', label: 'SP Acquisition', icon: Wrench },
  { id: 'franchise-acq', label: 'Franchise Acquisition', icon: Building2 },
  { id: 'wallet', label: 'My Wallet', icon: Wallet },
  { id: 'commissions', label: 'Commissions', icon: Percent },
  { id: 'referrals', label: 'My Referrals', icon: Users2 },
  { id: 'team', label: 'My Team', icon: Users },
  { id: 'territory', label: 'My Territory', icon: MapPin },
  { id: 'profile', label: 'My Profile', icon: UserCheck },
  { id: 'training', label: 'Training', icon: BookOpen },
  { id: 'certifications', label: 'Certifications', icon: Shield },
  { id: 'targets', label: 'My Targets', icon: Target },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'leaderboard', label: 'Leaderboard', icon: Award },
  { id: 'support', label: 'Support', icon: Phone },
];

const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl ${className}`}>
    {children}
  </div>
);

const KpiCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string }> = ({
  label, value, icon, color = 'text-primary bg-primary/10', sub
}) => (
  <Card className="p-5">
    <div className={`p-2.5 rounded-2xl ${color} w-fit`}>{icon}</div>
    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-3">{label}</p>
    <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
  </Card>
);

const ProgressBar: React.FC<{ label: string; achieved: number; target: number; unit?: string }> = ({ label, achieved, target, unit = '' }) => {
  const p = pct(achieved, target);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-slate-400">{achieved}{unit} / {target}{unit} ({p}%)</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor(p)}`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
};

// ─── mock lead data for entrepreneur ────────────────────────────────────────
const myLeadsMock = [
  { id: 'ML-01', name: 'D. Raju Electronics', phone: '+91 90001 22334', type: 'Vendor', status: 'Converted', source: 'Walk-in', date: '2026-06-01' },
  { id: 'ML-02', name: 'S. Prasad Grocery', phone: '+91 90001 22335', type: 'Vendor', status: 'Follow-up', source: 'WhatsApp', date: '2026-06-08' },
  { id: 'ML-03', name: 'Kavitha Medicals', phone: '+91 90001 22336', type: 'Service Provider', status: 'New', source: 'Referral', date: '2026-06-12' },
  { id: 'ML-04', name: 'Sreedevi Home Care', phone: '+91 90002 22338', type: 'Customer', status: 'Converted', source: 'Social Media', date: '2026-06-05' },
  { id: 'ML-05', name: 'VP Enterprises', phone: '+91 90005 22341', type: 'Franchise', status: 'Contacted', source: 'Referral', date: '2026-05-28' },
];

const growthData = [
  { month: 'Jan', leads: 4, converted: 2 },
  { month: 'Feb', leads: 6, converted: 4 },
  { month: 'Mar', leads: 8, converted: 5 },
  { month: 'Apr', leads: 12, converted: 8 },
  { month: 'May', leads: 15, converted: 11 },
  { month: 'Jun', leads: 20, converted: 14 },
];

const trainingMock = [
  { id: 1, title: 'Vendor Acquisition Fundamentals', type: 'Video', progress: 100, status: 'Completed' },
  { id: 2, title: 'Customer Acquisition Strategies', type: 'Video', progress: 60, status: 'In Progress' },
  { id: 3, title: 'Digital Marketing Basics', type: 'Document', progress: 100, status: 'Completed' },
  { id: 4, title: 'Franchise Sales Mastery', type: 'Video', progress: 0, status: 'Available' },
  { id: 5, title: 'Building Purchase Pools', type: 'Video', progress: 100, status: 'Completed' },
];

const certMock = [
  { level: 'Bronze', emoji: '🥉', status: 'Passed', score: 78, date: '2027-08-15' },
  { level: 'Silver', emoji: '🥈', status: 'Passed', score: 82, date: '2027-08-15' },
  { level: 'Gold', emoji: '🥇', status: 'In Progress', score: null, date: null },
  { level: 'Platinum', emoji: '💎', status: 'Locked', score: null, date: null },
];



// ─── main component ─────────────────────────────────────────────────────────
export const EntrepreneurPortal: React.FC = () => {
  const { currentEntrepreneur, logout, entrepreneurs, transactions, vendors, serviceProviders, addTicket, tickets } = useRole();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leads, setLeads] = useState(myLeadsMock);
  const [showAddLead, setShowAddLead] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadType, setLeadType] = useState<'Vendor' | 'Customer' | 'Service Provider' | 'Franchise'>('Vendor');
  const [copiedCode, setCopiedCode] = useState(false);

  // Territory Info states
  const [territoryInfo, setTerritoryInfo] = useState<any>(null);
  const [loadingTerritory, setLoadingTerritory] = useState(false);

  const fetchTerritory = async () => {
    setLoadingTerritory(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://server.apexbee.in/api/entrepreneur/territory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTerritoryInfo(data.data);
      }
    } catch (err) {
      console.error('Error fetching territory details:', err);
    } finally {
      setLoadingTerritory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'territory') {
      fetchTerritory();
    }
  }, [activeTab]);

  const ent = currentEntrepreneur ?? entrepreneurs[0];

  // Profile states
  const [profileName, setProfileName] = useState(ent ? ent.name : '');
  const [profileMobile, setProfileMobile] = useState(ent ? ent.phone : '');
  const [profileEmail, setProfileEmail] = useState(ent ? ent.email : '');
  const [profilePhotoVal, setProfilePhotoVal] = useState(ent ? (ent.photo || '') : '');
  const [bankHolder, setBankHolder] = useState(ent?.bankDetails?.accountHolderName || '');
  const [bankNumber, setBankNumber] = useState(ent?.bankDetails?.accountNumber || '');
  const [bankIfsc, setBankIfsc] = useState(ent?.bankDetails?.ifsc || '');
  const [bankNameStr, setBankNameStr] = useState(ent?.bankDetails?.bankName || '');
  const [bankUpi, setBankUpi] = useState(ent?.bankDetails?.upiId || '');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', isError: false });

  // Sync state values when ent changes
  useEffect(() => {
    if (ent) {
      setProfileName(ent.name);
      setProfileMobile(ent.phone || '');
      setProfileEmail(ent.email || '');
      setProfilePhotoVal(ent.photo || '');
      setBankHolder(ent.bankDetails?.accountHolderName || '');
      setBankNumber(ent.bankDetails?.accountNumber || '');
      setBankIfsc(ent.bankDetails?.ifsc || '');
      setBankNameStr(ent.bankDetails?.bankName || '');
      setBankUpi(ent.bankDetails?.upiId || '');
    }
  }, [ent]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage({ text: '', isError: false });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://server.apexbee.in/api/entrepreneur/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileName,
          mobile: profileMobile,
          email: profileEmail,
          profilePhoto: profilePhotoVal,
          bankDetails: {
            accountHolderName: bankHolder,
            accountNumber: bankNumber,
            ifsc: bankIfsc,
            bankName: bankNameStr,
            upiId: bankUpi
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMessage({ text: 'Profile updated successfully!', isError: false });
        // Smooth local update for instant feedback
        if (ent) {
          ent.name = profileName;
          ent.phone = profileMobile;
          ent.email = profileEmail;
          ent.photo = profilePhotoVal;
          ent.bankDetails = {
            accountHolderName: bankHolder,
            accountNumber: bankNumber,
            ifsc: bankIfsc,
            bankName: bankNameStr,
            upiId: bankUpi
          };
        }
      } else {
        setProfileMessage({ text: data.message || 'Failed to update profile.', isError: true });
      }
    } catch (err: any) {
      setProfileMessage({ text: err.message || 'Error connecting to the server.', isError: true });
    } finally {
      setSavingProfile(false);
    }
  };

  // Support ticket form states
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Billing' | 'Technical' | 'Vendor Issue' | 'Franchise Network'>('Technical');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [ticketDesc, setTicketDesc] = useState('');

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket(ticketSubject, ticketCategory, ticketPriority, ticketDesc);
    setTicketSubject('');
    setTicketDesc('');
    setShowAddTicket(false);
    alert('Support module placeholder triggered. Requested details printed to console.');
  };

  if (!ent) return null;

  const refCode = `APEX-${ent.id}-REF`;
  const convRate = ent.totalLeads > 0 ? Math.round((ent.leadsConverted / ent.totalLeads) * 100) : 0;

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    setLeads(prev => [...prev, {
      id: `ML-${String(prev.length + 1).padStart(2, '0')}`,
      name: leadName, phone: leadPhone, type: leadType,
      status: 'New', source: 'Manual', date: new Date().toISOString().split('T')[0]
    }]);
    setLeadName(''); setLeadPhone('');
    setShowAddLead(false);
  };

  // ── tab renderers ────────────────────────────────────────────────────────

  const renderDashboard = () => {
    const commData = [
      { name: 'Vendor', value: ent.vendorAcqCommission },
      { name: 'Customer', value: ent.customerAcqCommission },
      { name: 'SP', value: ent.spAcqCommission },
      { name: 'MLM', value: ent.mlmEarnings },
    ].filter(d => d.value > 0);

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl shadow-primary/30">
          <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Welcome back,</p>
          <h2 className="text-2xl font-black mt-1">{ent.name}</h2>
          <p className="text-xs opacity-70 mt-1">{ent.mandal} · {ent.district} · {ent.certificationLevel} Level</p>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-white/15 text-xs font-bold backdrop-blur-sm">Score: {ent.performanceScore}/100</div>
            <div className="px-3 py-1.5 rounded-xl bg-white/15 text-xs font-bold backdrop-blur-sm">Mentor: {ent.mentor}</div>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${ent.status === 'Active' ? 'bg-emerald-500/80' : 'bg-amber-500/80'}`}>{ent.status}</div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Wallet Balance" value={fmt(ent.walletBalance)} icon={<Wallet size={16} />} color="text-emerald-600 bg-emerald-500/10" />
          <KpiCard label="Commission Earned" value={fmt(ent.commissionEarned)} icon={<Percent size={16} />} color="text-purple-600 bg-purple-500/10" />
          <KpiCard label="Total Leads" value={ent.totalLeads} icon={<Target size={16} />} color="text-orange-600 bg-orange-500/10" />
          <KpiCard label="Conversion Rate" value={`${convRate}%`} icon={<TrendingUp size={16} />} color="text-teal-600 bg-teal-500/10" />
          <KpiCard label="Vendors Acquired" value={ent.vendorsAcquired} icon={<Store size={16} />} />
          <KpiCard label="Customers Acquired" value={ent.customersAcquired} icon={<UserCheck size={16} />} color="text-blue-600 bg-blue-500/10" />
          <KpiCard label="Team Size" value={ent.teamSize} icon={<Users size={16} />} color="text-amber-600 bg-amber-500/10" />
          <KpiCard label="Referrals" value={ent.referralsCount} icon={<Users2 size={16} />} color="text-rose-600 bg-rose-500/10" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Lead & Conversion Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="lGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#2563EB" fill="url(#lGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="converted" name="Converted" stroke="#10B981" fill="url(#cGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {commData.length > 0 ? (
            <Card className="p-6">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Commission Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={commData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={((p: { name?: string; percent?: number }) => `${p.name ?? ''} ${(((p.percent) ?? 0) * 100).toFixed(0)}%`) as unknown as boolean}
                    labelLine={false}>
                    {commData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => typeof v === 'number' ? fmt(v) : String(v)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Percent size={32} className="mx-auto opacity-30 mb-2" />
                <p className="text-xs">No commission data yet. Start acquiring!</p>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Add New Lead', icon: <Plus size={16} />, color: 'bg-primary text-white', action: () => { setActiveTab('leads'); setShowAddLead(true); } },
              { label: 'View Training', icon: <BookOpen size={16} />, color: 'bg-emerald-500/10 text-emerald-600', action: () => setActiveTab('training') },
              { label: 'My Wallet', icon: <Wallet size={16} />, color: 'bg-amber-500/10 text-amber-600', action: () => setActiveTab('wallet') },
              { label: 'Leaderboard', icon: <Award size={16} />, color: 'bg-purple-500/10 text-purple-600', action: () => setActiveTab('leaderboard') },
            ].map(a => (
              <button key={a.label} onClick={a.action}
                className={`flex items-center gap-2 p-3.5 rounded-2xl font-bold text-xs cursor-pointer transition-all hover:scale-105 ${a.color}`}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderLeads = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100">My Lead Pipeline</h3>
        <button onClick={() => setShowAddLead(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-blue-600">
          <Plus size={14} /> Add Lead
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
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {leads.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{l.name}</p>
                    <p className="text-[10px] text-slate-400">{l.phone}</p>
                  </td>
                  <td className="py-4 px-5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{l.type}</span></td>
                  <td className="py-4 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${l.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : l.status === 'Follow-up' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{l.status}</span>
                  </td>
                  <td className="py-4 px-5 text-slate-500">{l.source}</td>
                  <td className="py-4 px-5 text-slate-400">{l.date}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 cursor-pointer hover:bg-emerald-500/20"><Phone size={12} /></button>
                      <button className="p-1.5 rounded-lg bg-green-500/10 text-green-600 cursor-pointer hover:bg-green-500/20"><MessageCircle size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showAddLead && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Add New Lead</h3>
                <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleAddLead} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Name</label>
                  <input required value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Business / Person Name"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone</label>
                  <input required value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Type</label>
                  <select value={leadType} onChange={e => setLeadType(e.target.value as typeof leadType)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-700 dark:text-slate-300 cursor-pointer">
                    {['Vendor', 'Customer', 'Service Provider', 'Franchise'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddLead(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-blue-600">Add Lead</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderAcqTab = (type: 'vendor' | 'customer' | 'sp' | 'franchise') => {
    const config = {
      vendor: { label: 'Vendor', acq: ent.vendorsAcquired, target: ent.vendorTarget, rev: ent.vendorRevenue, leads: ent.vendorLeadsGenerated },
      customer: { label: 'Customer', acq: ent.customersAcquired, target: ent.customerTarget, rev: ent.customerRevenue, leads: ent.customerLeadsGenerated },
      sp: { label: 'Service Provider', acq: ent.spAcquired, target: ent.spTarget, rev: ent.spRevenue, leads: ent.spLeadsGenerated },
      franchise: { label: 'Franchise', acq: ent.franchisesAcquired, target: ent.franchiseTarget, rev: ent.franchiseRevenue, leads: ent.franchiseLeadsGenerated },
    }[type];

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Acquired" value={config.acq} icon={<CheckCircle size={16} />} color="text-emerald-600 bg-emerald-500/10" />
          <KpiCard label="Target" value={config.target} icon={<Target size={16} />} />
          <KpiCard label="Revenue Generated" value={fmt(config.rev)} icon={<TrendingUp size={16} />} color="text-purple-600 bg-purple-500/10" />
          <KpiCard label="Leads Generated" value={config.leads} icon={<FileText size={16} />} color="text-orange-600 bg-orange-500/10" />
        </div>
        <Card className="p-5">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">{config.label} Target Progress</h3>
          <ProgressBar label={`${config.label}s Acquired`} achieved={config.acq} target={config.target} />
          <div className="mt-6">
            <ProgressBar label="Revenue Target" achieved={Math.round(config.rev / 1000)} target={Math.round(ent.revenueTarget / 1000)} unit="K" />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">My {config.label} Leads</h3>
          {leads.filter(l => l.type === (type === 'sp' ? 'Service Provider' : config.label)).length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No {config.label.toLowerCase()} leads yet. <button onClick={() => setShowAddLead(true)} className="text-primary font-bold cursor-pointer hover:underline">Add your first lead →</button></div>
          ) : (
            <div className="space-y-2">
              {leads.filter(l => l.type === (type === 'sp' ? 'Service Provider' : config.label)).map(l => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <div>
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{l.name}</p>
                    <p className="text-[10px] text-slate-400">{l.phone} · {l.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${l.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderWallet = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KpiCard label="Available Balance" value={fmt(ent.walletBalance)} icon={<Wallet size={16} />} color="text-emerald-600 bg-emerald-500/10" />
        <KpiCard label="Pending Balance" value={fmt(ent.pendingBalance)} icon={<Clock size={16} />} color="text-amber-600 bg-amber-500/10" />
        <KpiCard label="Lifetime Earnings" value={fmt(ent.lifetimeEarnings)} icon={<Star size={16} />} color="text-purple-600 bg-purple-500/10" />
        <KpiCard label="Referral Earnings" value={fmt(ent.referralEarnings)} icon={<Users2 size={16} />} />
        <KpiCard label="Lead Incentives" value={fmt(ent.leadIncentives)} icon={<Target size={16} />} color="text-teal-600 bg-teal-500/10" />
        <KpiCard label="Team Earnings" value={fmt(ent.teamEarnings)} icon={<Users size={16} />} color="text-rose-600 bg-rose-500/10" />
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Recent Transactions</h3>
          <button className="text-xs font-bold text-primary cursor-pointer hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <tr key={tx.id || i} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4 text-slate-400">{tx.date?.split(' ')[0]}</td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">{tx.vendorName}</td>
                    <td className={`py-3 px-4 font-extrabold text-right ${tx.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.amount >= 0 ? '+' : ''}{fmt(Math.abs(tx.amount))}</td>
                    <td className="py-3 px-4 text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tx.status === 'Credited' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{tx.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">No transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderCommissions = () => {
    const items = [
      { label: 'Vendor Acquisition', value: ent.vendorAcqCommission, color: PIE_COLORS[0] },
      { label: 'Customer Acquisition', value: ent.customerAcqCommission, color: PIE_COLORS[1] },
      { label: 'SP Acquisition', value: ent.spAcqCommission, color: PIE_COLORS[2] },
      { label: 'Referral Bonus', value: ent.referralEarnings, color: PIE_COLORS[3] },
      { label: 'MLM Earnings', value: ent.mlmEarnings, color: PIE_COLORS[4] },
      { label: 'Team Earnings', value: ent.teamEarnings, color: PIE_COLORS[5] },
    ];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard label="Total Commission" value={fmt(ent.commissionEarned)} icon={<Percent size={16} />} color="text-emerald-600 bg-emerald-500/10" />
          <KpiCard label="Lifetime Earnings" value={fmt(ent.lifetimeEarnings)} icon={<Star size={16} />} color="text-purple-600 bg-purple-500/10" />
        </div>
        <Card className="p-6">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Commission Breakdown</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-500">{fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderReferrals = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Referrals" value={ent.referralsCount} icon={<Users2 size={16} />} />
        <KpiCard label="Referral Earnings" value={fmt(ent.referralEarnings)} icon={<Percent size={16} />} color="text-emerald-600 bg-emerald-500/10" />
        <Card className="p-5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Your Referral Code</p>
          <div className="flex items-center gap-2 mt-2">
            <code className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{refCode}</code>
            <button onClick={() => { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
              {copiedCode ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
            </button>
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">How Referrals Work</h3>
        <div className="space-y-3">
          {['Share your referral code with someone interested in becoming an ApexBee Entrepreneur.',
            'When they register using your code, they become your Level 1 referral.',
            'You earn ₹200 per successful referral registration + % of their commissions.'].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s}</p>
            </div>
          ))}
        </div>
        {ent.referralsCount === 0 && (
          <div className="mt-5 p-4 bg-primary/5 rounded-2xl border border-primary/20 text-center">
            <p className="text-xs font-bold text-primary">Share your code to start earning referral bonuses!</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderTeam = () => {
    const totalCount = (vendors?.length || 0) + (serviceProviders?.length || 0);

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="Team Size" value={totalCount} icon={<Users size={16} />} />
          <KpiCard label="Vendors" value={vendors?.length || 0} icon={<Store size={16} />} color="text-blue-600 bg-blue-500/10" />
          <KpiCard label="Service Providers" value={serviceProviders?.length || 0} icon={<Wrench size={16} />} color="text-purple-600 bg-purple-500/10" />
        </div>
        <Card className="p-5">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">My Team</h3>
          {totalCount === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              <Users size={32} className="mx-auto opacity-30 mb-3" />
              <p>No team members assigned yet in your territory.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendors && vendors.length > 0 && (
                <div>
                  <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-3">Vendors ({vendors.length})</h4>
                  <div className="space-y-3">
                    {vendors.map((v, i) => (
                      <div key={v.id || i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0"><Store size={14} /></div>
                          <div>
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{v.name}</p>
                            <p className="text-[10px] text-slate-400">{v.category} · {v.contactPerson}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${v.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{v.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {serviceProviders && serviceProviders.length > 0 && (
                <div>
                  <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mt-4 mb-3">Service Providers ({serviceProviders.length})</h4>
                  <div className="space-y-3">
                    {serviceProviders.map((sp, i) => (
                      <div key={sp.id || i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0"><Wrench size={14} /></div>
                          <div>
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{sp.name}</p>
                            <p className="text-[10px] text-slate-400">{sp.category} · Rating: {sp.rating}★</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${sp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{sp.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderTraining = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100">Training Modules</h3>
        <div className="text-xs font-bold text-primary">{trainingMock.filter(t => t.status === 'Completed').length}/{trainingMock.length} completed</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainingMock.map(t => (
          <motion.div key={t.id} whileHover={{ y: -2 }}>
            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${t.type === 'Video' ? 'text-blue-600 bg-blue-500/10 border-blue-500/20' : 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'}`}>{t.type}</span>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 mt-2 leading-snug">{t.title}</h4>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Progress</span><span>{t.progress}%</span></div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${t.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${t.progress}%` }} />
                </div>
              </div>
              <button className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : t.status === 'In Progress' ? 'bg-primary text-white hover:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>
                {t.status === 'Completed' ? '✓ Review' : t.status === 'In Progress' ? 'Continue →' : 'Start Module'}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {certMock.map(c => (
          <Card key={c.level} className="p-5 text-center">
            <div className="text-3xl mb-2">{c.emoji}</div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{c.level}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border mt-2 inline-block ${c.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : c.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{c.status}</span>
            {c.score && <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Score: {c.score}%</p>}
            <button className={`w-full mt-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-colors ${c.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : c.status === 'Locked' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-primary/10 text-primary hover:bg-primary/20'}`} disabled={c.status === 'Locked'}>
              {c.status === 'Passed' ? '↓ Certificate' : c.status === 'Locked' ? '🔒 Locked' : c.status === 'In Progress' ? 'Continue Exam' : 'Take Exam'}
            </button>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-3">Current Level: {ent.certificationLevel}</h3>
        <div className="flex items-center gap-2">
          {['None', 'Bronze', 'Silver', 'Gold', 'Platinum'].map((l, i) => (
            <React.Fragment key={l}>
              <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${ent.certificationLevel === l ? 'bg-primary text-white' : ['None', 'Bronze', 'Silver', 'Gold', 'Platinum'].indexOf(ent.certificationLevel) > i ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{l === 'None' ? 'Starter' : l}</div>
              {i < 4 && <ChevronRight size={12} className="text-slate-300 dark:text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderTargets = () => (
    <div className="space-y-5">
      <Card className="p-6">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-5">My Acquisition Targets</h3>
        <div className="space-y-5">
          <ProgressBar label="Vendor Acquisition" achieved={ent.vendorsAcquired} target={ent.vendorTarget} />
          <ProgressBar label="Customer Acquisition" achieved={ent.customersAcquired} target={ent.customerTarget} />
          <ProgressBar label="SP Acquisition" achieved={ent.spAcquired} target={ent.spTarget} />
          <ProgressBar label="Franchise Acquisition" achieved={ent.franchisesAcquired} target={ent.franchiseTarget} />
          <ProgressBar label="Revenue (₹K)" achieved={Math.round(ent.salesRevenue / 1000)} target={Math.round(ent.revenueTarget / 1000)} unit="K" />
        </div>
      </Card>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Performance Score" value={`${ent.performanceScore}/100`} icon={<TrendingUp size={16} />} color="text-purple-600 bg-purple-500/10" />
        <KpiCard label="Conversion Rate" value={`${convRate}%`} icon={<Target size={16} />} color="text-emerald-600 bg-emerald-500/10" />
        <KpiCard label="Total Revenue" value={fmt(ent.salesRevenue)} icon={<Briefcase size={16} />} />
        <KpiCard label="Total Leads" value={ent.totalLeads} icon={<FileText size={16} />} color="text-orange-600 bg-orange-500/10" />
      </div>
      <Card className="p-6">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-4">Performance Score</h3>
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-100 dark:text-slate-800" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${ent.performanceScore} 100`} strokeDashoffset="0" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">{ent.performanceScore}</span>
              <span className="text-[9px] text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { label: 'Lead Conversion', score: convRate },
              { label: 'Acquisition Rate', score: pct(ent.vendorsAcquired + ent.customersAcquired, ent.vendorTarget + ent.customerTarget) },
              { label: 'Revenue Achievement', score: pct(ent.salesRevenue, ent.revenueTarget) },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>{m.label}</span><span>{m.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor(m.score)}`} style={{ width: `${m.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderLeaderboard = () => {
    const ranked = [...entrepreneurs].filter(e => e.status === 'Active').sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 10);
    const myRank = ranked.findIndex(e => e.id === ent.id) + 1;
    return (
      <div className="space-y-5">
        <Card className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200/60 dark:border-amber-700/30">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🏆</div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Your Ranking</p>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100">#{myRank || '—'}</p>
              <p className="text-xs text-slate-500 mt-0.5">out of {ranked.length} active entrepreneurs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Performance Leaderboard</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {ranked.map((e, i) => (
              <div key={e.id} className={`flex items-center gap-4 px-5 py-4 ${e.id === ent.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
                <span className={`w-7 h-7 rounded-xl text-[11px] font-black flex items-center justify-center text-white shrink-0 ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{i + 1}</span>
                <div className="flex-1">
                  <p className={`font-bold text-xs ${e.id === ent.id ? 'text-primary' : 'text-slate-800 dark:text-slate-200'}`}>{e.name} {e.id === ent.id && '(You)'}</p>
                  <p className="text-[10px] text-slate-400">{e.mandal} · {e.certificationLevel}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{e.performanceScore}</p>
                  <p className="text-[10px] text-slate-400">{fmt(e.salesRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderSupport = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Chat Support', icon: <MessageCircle size={20} />, desc: 'WhatsApp: +91 98765 43210', color: 'text-green-600 bg-green-500/10' },
          { label: 'Call Helpline', icon: <Phone size={20} />, desc: '1800-XXX-XXXX (Toll Free)', color: 'text-blue-600 bg-blue-500/10' },
          { label: 'Email Support', icon: <Bell size={20} />, desc: 'entrepreneur@apexbee.com', color: 'text-purple-600 bg-purple-500/10' },
        ].map(c => (
          <Card key={c.label} className="p-5 text-center cursor-pointer hover:shadow-2xl transition-shadow">
            <div className={`p-3 rounded-2xl ${c.color} w-fit mx-auto mb-3`}>{c.icon}</div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{c.label}</p>
            <p className="text-[10px] text-slate-400 mt-1">{c.desc}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">My Support Tickets</h3>
          <button onClick={() => setShowAddTicket(true)} className="text-xs font-bold text-primary cursor-pointer hover:underline flex items-center gap-1"><Plus size={12} /> New Ticket</button>
        </div>
        {tickets && tickets.length > 0 ? (
          tickets.map(t => (
            <div key={t.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
              <div>
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{t.subject}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.id} · {t.createdDate}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${t.status === 'Open' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>{t.status}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No support tickets created yet.</p>
        )}
      </Card>

      <AnimatePresence>
        {showAddTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Create Support Ticket</h3>
                <button onClick={() => setShowAddTicket(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleCreateTicketSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                  <input required value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} placeholder="Brief issue summary"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                    <select value={ticketCategory} onChange={e => setTicketCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-700 dark:text-slate-300 cursor-pointer">
                      {['Billing', 'Technical', 'Vendor Issue', 'Franchise Network'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</label>
                    <select value={ticketPriority} onChange={e => setTicketPriority(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-700 dark:text-slate-300 cursor-pointer">
                      {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                  <textarea required rows={4} value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddTicket(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-blue-600">Submit Ticket</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderTerritory = () => {
    if (loadingTerritory) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      );
    }

    if (!territoryInfo) return <p className="text-xs text-slate-400">Failed to load territory details.</p>;

    const { state, district, mandal, village, stateFranchiseId, districtFranchiseId, mandalFranchiseId, parentFranchiseId } = territoryInfo;

    const renderFranchiseCard = (title: string, f: any) => (
      <Card className="p-5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{title}</span>
        {f ? (
          <div className="mt-3 space-y-2">
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{f.businessName || 'Unnamed Franchise'}</p>
            <p className="text-xs font-bold text-slate-500">Owner: {f.ownerName || 'N/A'}</p>
            <div className="flex flex-col gap-1.5 pt-1 text-xs">
              <a href={`tel:${f.mobile}`} className="flex items-center gap-2 text-primary hover:underline font-semibold">
                <Phone size={12} /> {f.mobile || 'N/A'}
              </a>
              <a href={`mailto:${f.email}`} className="flex items-center gap-2 text-primary hover:underline font-semibold">
                <Bell size={12} /> {f.email || 'N/A'}
              </a>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-3">No franchise assigned / active in this region.</p>
        )}
      </Card>
    );

    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 border-emerald-100 dark:border-slate-700">
          <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">My Assigned Region</h3>
          <p className="text-xs text-slate-500">Below is your exclusive territory assignment.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
            {[['State', state], ['District', district], ['Mandal', mandal], ['Village', village || 'All Villages']].map(([lbl, val]) => (
              <div key={lbl} className="bg-white dark:bg-dark-card p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">{lbl}</span>
                <p className="font-black text-slate-800 dark:text-slate-200 mt-1 text-xs">{val || 'N/A'}</p>
              </div>
            ))}
          </div>
        </Card>

        <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-6 mb-4">Franchise Contact Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFranchiseCard('State Franchise Officer', stateFranchiseId)}
          {renderFranchiseCard('District Franchise Officer', districtFranchiseId)}
          {renderFranchiseCard('Mandal Franchise Officer', mandalFranchiseId)}
          {renderFranchiseCard('Parent Franchise / Mentor Store', parentFranchiseId)}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="space-y-6">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Details */}
            <Card className="p-6 space-y-4">
              <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">Personal Details</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <input required value={profileName} onChange={e => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Number</label>
                  <input required value={profileMobile} onChange={e => setProfileMobile(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input required type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Photo Link</label>
                  <input value={profilePhotoVal} onChange={e => setProfilePhotoVal(e.target.value)} placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
              </div>
            </Card>

            {/* Bank Details */}
            <Card className="p-6 space-y-4">
              <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">Banking Details</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Holder Name</label>
                  <input value={bankHolder} onChange={e => setBankHolder(e.target.value)} placeholder="Name as in passbook"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Name</label>
                  <input value={bankNameStr} onChange={e => setBankNameStr(e.target.value)} placeholder="e.g. State Bank of India"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Number</label>
                  <input value={bankNumber} onChange={e => setBankNumber(e.target.value)} placeholder="Bank Account Number"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</label>
                    <input value={bankIfsc} onChange={e => setBankIfsc(e.target.value.toUpperCase())} placeholder="SBIN000XXXX"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UPI ID</label>
                    <input value={bankUpi} onChange={e => setBankUpi(e.target.value)} placeholder="e.g. mobile@upi"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {profileMessage.text && (
            <div className={`p-4 rounded-2xl text-xs font-bold ${profileMessage.isError ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
              {profileMessage.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={savingProfile}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs cursor-pointer hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 disabled:bg-emerald-500/50 flex items-center gap-2">
              {savingProfile ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                  Saving Changes...
                </>
              ) : 'Save Details'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'leads': return renderLeads();
      case 'vendor-acq': return renderAcqTab('vendor');
      case 'customer-acq': return renderAcqTab('customer');
      case 'sp-acq': return renderAcqTab('sp');
      case 'franchise-acq': return renderAcqTab('franchise');
      case 'wallet': return renderWallet();
      case 'commissions': return renderCommissions();
      case 'referrals': return renderReferrals();
      case 'team': return renderTeam();
      case 'territory': return renderTerritory();
      case 'profile': return renderProfile();
      case 'training': return renderTraining();
      case 'certifications': return renderCertifications();
      case 'targets': return renderTargets();
      case 'performance': return renderPerformance();
      case 'leaderboard': return renderLeaderboard();
      case 'support': return renderSupport();
      default: return null;
    }
  };

  // ─── layout ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/40 dark:bg-dark dark:text-dark-text transition-colors duration-200">
      {/* Sidebar */}
      <aside className={`h-full flex flex-col border-r border-slate-200 dark:border-slate-800 glass-premium z-20 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            {ent.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[140px]">{ent.name}</p>
              <span className="text-[9px] font-bold uppercase text-emerald-600 tracking-wider">🧑‍💼 Entrepreneur</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                title={sidebarCollapsed ? tab.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${isActive ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                <Icon size={17} className="shrink-0 group-hover:scale-110 transition-transform" />
                {!sidebarCollapsed && <span className="font-semibold text-xs whitespace-nowrap">{tab.label}</span>}
              </div>
            );
          })}
        </nav>

        {/* Collapse + Logout */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0 space-y-2">
          <button onClick={() => setSidebarCollapsed(c => !c)} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-bold cursor-pointer hover:bg-rose-500/20 transition-colors">
            <LogOut size={14} />
            {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
              <Zap size={12} />
              <span>Entrepreneur Portal</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={12} />
              <span>{ent.mandal}, {ent.district}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
              <Star size={12} className="text-amber-500" />
              {ent.certificationLevel} Level
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
