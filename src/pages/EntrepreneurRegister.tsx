import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import {
  User, Mail, Phone, MapPin, Lock, Sun, Moon,
  CheckCircle, Upload, Briefcase, Building2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Entrepreneur } from '../types';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const STEPS = ['Personal Info', 'Territory', 'Business Profile', 'Documents & Submit'];

const GEOGRAPHY_DATA: Record<string, { districts: string[]; mandals: Record<string, string[]> }> = {
  'Andhra Pradesh': {
    districts: ['Nellore', 'Guntur', 'Krishna', 'Prakasam', 'Chittoor', 'Visakhapatnam', 'East Godavari', 'West Godavari', 'Kurnool', 'Kadapa'],
    mandals: {
      Nellore: ['Buchi Reddy Palem', 'Kavali', 'Atmakur', 'Kovur', 'Nellore Rural'],
      Guntur: ['Guntur Urban', 'Narasaraopet', 'Sattenapalle', 'Tenali', 'Mangalagiri'],
      Krishna: ['Gannavaram', 'Machilipatnam', 'Vijayawada Rural', 'Nuzvid'],
      Prakasam: ['Ongole', 'Markapur', 'Kandukur', 'Giddalur'],
      Chittoor: ['Tirupati Rural', 'Madanapalle', 'Chittoor Urban', 'Puttur'],
      Visakhapatnam: ['Bheemunipatnam', 'Visakhapatnam Urban', 'Anakapalle', 'Narsipatnam'],
      'East Godavari': ['Rajahmundry', 'Kakinada', 'Amalapuram', 'Pithapuram'],
      'West Godavari': ['Eluru', 'Bhimavaram', 'Narsapuram', 'Palakol'],
      Kurnool: ['Kurnool Urban', 'Nandyal', 'Adoni', 'Yemmiganur'],
      Kadapa: ['Kadapa Urban', 'Proddatur', 'Rajampeta', 'Pulivendla'],
    }
  },
  'Telangana': {
    districts: ['Hyderabad', 'Rangareddy', 'Medchal', 'Sangareddy', 'Nizamabad', 'Warangal'],
    mandals: {
      Hyderabad: ['Charminar', 'Secunderabad', 'Amberpet', 'Asifnagar', 'Bahadurpura'],
      Rangareddy: ['Gachibowli', 'Kondapur', 'Serilingampally', 'Rajendranagar'],
      Medchal: ['Malkajgiri', 'Quthbullapur', 'Kukatpally', 'Alwal'],
      Sangareddy: ['Sangareddy Mandal', 'Patancheru', 'Ameenpur'],
      Nizamabad: ['Nizamabad Urban', 'Armoor', 'Bodhan'],
      Warangal: ['Warangal Urban', 'Hanamkonda', 'Kazipet']
    }
  },
  'Maharashtra': {
    districts: ['Pune', 'Mumbai Suburban', 'Thane', 'Nagpur', 'Nashik'],
    mandals: {
      Pune: ['Kothrud', 'Haveli', 'Shivajinagar', 'Hadapsar'],
      'Mumbai Suburban': ['Andheri', 'Borivali', 'Kurla'],
      Thane: ['Vashi', 'Thane Urban', 'Kalyan', 'Mira Road'],
      Nagpur: ['Nagpur Urban', 'Kamptee'],
      Nashik: ['Nashik Urban', 'Panchavati']
    }
  }
};

const INTEREST_OPTIONS = [
  'Vendor Acquisition', 'Customer Acquisition', 'Service Provider Acquisition',
  'Franchise Acquisition', 'All Business Development'
];

export const EntrepreneurRegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { loginAsEntrepreneur, entrepreneurs, setEntrepreneurs, partner } = useRole();
  const { theme, toggleTheme } = useTheme();

  const activeState = partner.state || 'Andhra Pradesh';
  const geo = GEOGRAPHY_DATA[activeState] || GEOGRAPHY_DATA['Andhra Pradesh'];
  const stateDistricts = geo.districts;
  const stateMandals = geo.mandals;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [state] = useState(activeState);
  const [district, setDistrict] = useState('');
  const [mandal, setMandal] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [interest, setInterest] = useState('');
  const [experience, setExperience] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [motivation, setMotivation] = useState('');

  const [aadhaarNo, setAadhaarNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!name.trim()) errs.name = 'Full name is required';
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required';
      if (!phone.trim() || phone.length < 10) errs.phone = 'Valid 10-digit phone required';
      if (!password || password.length < 6) errs.password = 'Password must be 6+ characters';
      if (password !== confirmPass) errs.confirmPass = 'Passwords do not match';
    }
    if (step === 1) {
      if (!district) errs.district = 'Please select a district';
      if (!mandal) errs.mandal = 'Please select a mandal';
      if (!address.trim()) errs.address = 'Address is required';
    }
    if (step === 2) {
      if (!interest) errs.interest = 'Please select your area of interest';
    }
    if (step === 3) {
      if (!aadhaarNo || aadhaarNo.length !== 12) errs.aadhaar = 'Valid 12-digit Aadhaar required';
      if (!panNo || panNo.length !== 10) errs.pan = 'Valid 10-character PAN required';
      if (!agreedTerms) errs.terms = 'You must accept the terms';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setTimeout(() => {
      // Create new entrepreneur
      const newEnt: Entrepreneur = {
        id: `ENT-${String(entrepreneurs.length + 1).padStart(2, '0')}`,
        name, phone, email,
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        certificationLevel: 'None',
        certifications: [],
        territory: mandal,
        state, district, mandal,
        mentor: 'Unassigned',
        applicationDate: new Date().toISOString().split('T')[0],
        interviewStatus: 'Pending',
        documentStatus: aadhaarNo && panNo ? 'Submitted' : 'Pending',
        walletBalance: 0, pendingBalance: 0, referralEarnings: 0,
        leadIncentives: 0, teamEarnings: 0, lifetimeEarnings: 0,
        vendorAcqCommission: 0, customerAcqCommission: 0, spAcqCommission: 0,
        franchiseAcqCommission: 0, mlmEarnings: 0, commissionEarned: 0,
        vendorLeadsGenerated: 0, customerLeadsGenerated: 0, spLeadsGenerated: 0,
        franchiseLeadsGenerated: 0, totalLeads: 0, leadsConverted: 0,
        vendorsAcquired: 0, customersAcquired: 0, spAcquired: 0, franchisesAcquired: 0,
        salesRevenue: 0, vendorRevenue: 0, customerRevenue: 0, spRevenue: 0, franchiseRevenue: 0,
        vendorTarget: 5, customerTarget: 15, spTarget: 2, franchiseTarget: 0, revenueTarget: 50000,
        referralsCount: 0, teamSize: 0, teamRevenue: 0, performanceScore: 0,
        purchasePoolContribution: 0, salesCount: 0,
      };

      setEntrepreneurs(prev => [...prev, newEnt]);
      setLoading(false);
      setSubmitted(true);

      // Auto-login after 2 seconds
      setTimeout(() => {
        loginAsEntrepreneur(newEnt.id);
      }, 2200);
    }, 1500);
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border ${errors[field] ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 transition-colors`;

  const selectCls = (field: string) =>
    `w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border ${errors[field] ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} focus:outline-none focus:border-primary text-slate-700 dark:text-slate-300 transition-colors cursor-pointer`;

  if (submitted) {
    return (
      <div className="relative min-h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-dark overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="text-center p-10 max-w-md relative z-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Registration Successful!</h2>
          <p className="text-sm text-slate-400 mt-2">Welcome to ApexBee, <span className="font-bold text-primary">{name}</span>!</p>
          <p className="text-xs text-slate-400 mt-4">Your application is under review. Logging you into your portal…</p>
          <div className="mt-6 flex justify-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark text-slate-800 dark:text-slate-100 p-4 transition-colors duration-250 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-primary/30">A</div>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">ApexBee</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSwitchToLogin} className="text-xs font-bold text-primary hover:underline cursor-pointer">Already registered? Login →</button>
          <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white/60 dark:bg-dark-card/60 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 cursor-pointer transition-colors text-slate-600 dark:text-slate-300">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] shadow-2xl p-8 md:p-10 relative z-10 mt-16">

        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Entrepreneur Portal
          </span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-3">Join ApexBee as an Entrepreneur</h2>
          <p className="text-xs text-slate-400 mt-1">Start your journey — build networks, earn commissions, grow with ApexBee</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-slate-300 dark:text-slate-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold hidden sm:block ${i === step ? 'text-primary' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

              {/* ── STEP 0: Personal Info ── */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. N. Rama Krishna"
                          className={`pl-10 ${inputCls('name')}`} />
                      </div>
                      {errors.name && <p className="text-[10px] text-rose-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth</label>
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls('')} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                          className={`pl-10 ${inputCls('email')}`} />
                      </div>
                      {errors.email && <p className="text-[10px] text-rose-500">{errors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                          className={`pl-10 ${inputCls('phone')}`} />
                      </div>
                      {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value)} className={selectCls('')}>
                        {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Create Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                          className={`pl-10 ${inputCls('password')}`} />
                      </div>
                      {errors.password && <p className="text-[10px] text-rose-500">{errors.password}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter password"
                          className={`pl-10 ${inputCls('confirmPass')}`} />
                      </div>
                      {errors.confirmPass && <p className="text-[10px] text-rose-500">{errors.confirmPass}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Territory ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State</label>
                      <input value={state} disabled className={`${inputCls('')} opacity-60 cursor-not-allowed`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select value={district} onChange={e => { setDistrict(e.target.value); setMandal(''); }}
                          className={`pl-10 ${selectCls('district')}`}>
                          <option value="">Select District</option>
                          {stateDistricts.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      {errors.district && <p className="text-[10px] text-rose-500">{errors.district}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mandal *</label>
                      <select value={mandal} onChange={e => setMandal(e.target.value)}
                        className={selectCls('mandal')} disabled={!district}>
                        <option value="">Select Mandal</option>
                        {(stateMandals[district] ?? []).map(m => <option key={m}>{m}</option>)}
                      </select>
                      {errors.mandal && <p className="text-[10px] text-rose-500">{errors.mandal}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PIN Code</label>
                      <input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="e.g. 524002"
                        className={inputCls('')} maxLength={6} />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Address *</label>
                      <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House/Shop No., Street, Village/City"
                        rows={3}
                        className={`w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border ${errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 transition-colors resize-none`} />
                      {errors.address && <p className="text-[10px] text-rose-500">{errors.address}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Business Profile ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Area of Interest *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {INTEREST_OPTIONS.map(opt => (
                        <button key={opt} type="button" onClick={() => setInterest(opt)}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${interest === opt ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/40'}`}>
                          <Briefcase size={14} className={interest === opt ? 'text-primary' : 'text-slate-400'} />
                          {opt}
                          {interest === opt && <CheckCircle size={12} className="ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                    {errors.interest && <p className="text-[10px] text-rose-500">{errors.interest}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business / Sales Experience</label>
                    <select value={experience} onChange={e => setExperience(e.target.value)} className={selectCls('')}>
                      <option value="">Select Experience Level</option>
                      {['No Experience (Fresher)', '0–1 Years', '1–3 Years', '3–5 Years', '5+ Years'].map(x => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referral Code (Optional)</label>
                      <input value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="e.g. APEX-ENT-01-REF"
                        className={inputCls('')} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Income Goal</label>
                      <select className={selectCls('')}>
                        <option>Select Income Goal</option>
                        {['₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000+'].map(x => <option key={x}>{x}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Why do you want to join ApexBee? (Optional)</label>
                    <textarea value={motivation} onChange={e => setMotivation(e.target.value)} rows={3}
                      placeholder="Tell us about your motivation and goals…"
                      className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 transition-colors resize-none" />
                  </div>
                </div>
              )}

              {/* ── STEP 3: Documents ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aadhaar Number *</label>
                      <input value={aadhaarNo} onChange={e => setAadhaarNo(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        placeholder="12-digit Aadhaar" className={inputCls('aadhaar')} maxLength={12} />
                      {errors.aadhaar && <p className="text-[10px] text-rose-500">{errors.aadhaar}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAN Number *</label>
                      <input value={panNo} onChange={e => setPanNo(e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="ABCDE1234F" className={inputCls('pan')} maxLength={10} />
                      {errors.pan && <p className="text-[10px] text-rose-500">{errors.pan}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank Name</label>
                      <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. State Bank of India"
                        className={inputCls('')} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Number</label>
                      <input value={accountNo} onChange={e => setAccountNo(e.target.value)} placeholder="Bank account number"
                        className={inputCls('')} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</label>
                      <input value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234"
                        className={inputCls('')} />
                    </div>
                  </div>

                  {/* Document upload placeholders */}
                  <div className="grid grid-cols-2 gap-4">
                    {['Aadhaar Card (Front)', 'PAN Card Photo', 'Passport Photo', 'Cancelled Cheque'].map(doc => (
                      <div key={doc} className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                        <Upload size={20} className="text-slate-300 dark:text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400">{doc}</p>
                        <p className="text-[9px] text-slate-300 dark:text-slate-600">Click to upload</p>
                      </div>
                    ))}
                  </div>

                  {/* Terms */}
                  <div className={`p-4 rounded-2xl border ${errors.terms ? 'border-rose-500 bg-rose-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-800 cursor-pointer" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        I agree to the <span className="text-primary font-bold cursor-pointer hover:underline">ApexBee Terms of Service</span> and{' '}
                        <span className="text-primary font-bold cursor-pointer hover:underline">Entrepreneur Agreement</span>.
                        I confirm that all provided information is accurate and complete.
                      </span>
                    </label>
                    {errors.terms && <p className="text-[10px] text-rose-500 mt-2">{errors.terms}</p>}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
            <button type="button" onClick={prevStep} disabled={step === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={14} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-blue-600 transition-colors shadow-lg shadow-primary/25">
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex items-center gap-1.5 px-8 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-75">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Building2 size={14} /> Submit Application</>}
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <div className="mt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
        © 2026 ApexBee Solutions — Entrepreneur Partner Program
      </div>
    </div>
  );
};
