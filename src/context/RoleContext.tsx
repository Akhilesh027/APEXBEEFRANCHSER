import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Partner,
  Lead,
  Vendor,
  Customer,
  CommissionTransaction,
  WithdrawalRequest,
  Campaign,
  SupportTicket,
  Entrepreneur,
  ServiceProvider
} from '../types';
import { emptyPartner } from '../types';

export type RoleType = 'state' | 'district' | 'mandal' | 'entrepreneur';

interface RoleContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  partner: Partner;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  transactions: CommissionTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<CommissionTransaction[]>>;
  withdrawals: WithdrawalRequest[];
  setWithdrawals: React.Dispatch<React.SetStateAction<WithdrawalRequest[]>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;

  // Authentication
  isAuthenticated: boolean;
  login: (role: RoleType) => void;
  loginAsEntrepreneur: (entId: string) => void;
  logout: () => void;

  // Entrepreneur-specific
  currentEntrepreneur: Entrepreneur | null;
  entrepreneurs: Entrepreneur[];
  setEntrepreneurs: React.Dispatch<React.SetStateAction<Entrepreneur[]>>;

  // Franchise-specific
  subFranchises: any[];
  setSubFranchises: React.Dispatch<React.SetStateAction<any[]>>;
  serviceProviders: ServiceProvider[];
  setServiceProviders: React.Dispatch<React.SetStateAction<ServiceProvider[]>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  addWithdrawal: (amount: number, bankAccount: string) => boolean;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'status'>) => void;
  addTicket: (subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], description: string) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  updateBankDetails: (details: NonNullable<Partner['bankDetails']>) => Promise<boolean>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const normalizeVendor = (v: any): Vendor => ({
  id: v._id || v.id,
  name: v.businessName || v.name || 'Vendor Store',
  mandal: v.mandal || 'N/A',
  district: v.district || 'N/A',
  sales: v.sales || 0,
  orders: v.orders || 0,
  rating: (v.rating && typeof v.rating === 'object') ? (v.rating.average || 0) : (Number(v.rating) || 0),
  status: (v.status === 'active' || v.status === 'Active') ? 'Active' : 'Inactive',
  revenueContribution: 0,
  contactPerson: v.ownerName || 'Owner',
  category: v.category || 'Retail'
});

const normalizeEntrepreneur = (e: any): Entrepreneur => ({
  id: e._id || e.id,
  name: e.name || 'Ecosystem Agent',
  phone: e.mobile || e.phone || '',
  email: e.email || '',
  joiningDate: e.createdAt ? new Date(e.createdAt).toISOString().split('T')[0] : '2026-01-01',
  status: (e.status === 'active' || e.status === 'Active') ? 'Active' : 'Pending',
  certificationLevel: e.certificationLevel || 'Gold',
  certifications: e.certifications || ['Certified Leader'],
  territory: e.mandal || e.district || 'N/A',
  state: e.state || '',
  district: e.district || '',
  mandal: e.mandal || '',
  village: e.village || '',
  mentor: e.mentor || 
    (e.parentFranchiseId && typeof e.parentFranchiseId === 'object'
      ? (e.parentFranchiseId.ownerName || e.parentFranchiseId.businessName)
      : null) || 
    'Unassigned',
  bankDetails: e.bankDetails || {
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    upiId: ""
  },
  stateFranchiseId: e.stateFranchiseId ? (e.stateFranchiseId._id || e.stateFranchiseId) : null,
  districtFranchiseId: e.districtFranchiseId ? (e.districtFranchiseId._id || e.districtFranchiseId) : null,
  mandalFranchiseId: e.mandalFranchiseId ? (e.mandalFranchiseId._id || e.mandalFranchiseId) : null,
  parentFranchiseId: e.parentFranchiseId ? (e.parentFranchiseId._id || e.parentFranchiseId) : null,
  walletBalance: e.walletBalance || 0,
  pendingBalance: e.pendingBalance || 0,
  referralEarnings: e.referralEarnings || 0,
  leadIncentives: e.leadIncentives || 0,
  teamEarnings: e.teamEarnings || 0,
  lifetimeEarnings: e.lifetimeEarnings || 0,
  vendorAcqCommission: e.vendorAcqCommission || 0,
  customerAcqCommission: e.customerAcqCommission || 0,
  spAcqCommission: e.spAcqCommission || 0,
  franchiseAcqCommission: 0,
  mlmEarnings: e.mlmEarnings || 0,
  commissionEarned: e.commissionEarned || 0,
  vendorLeadsGenerated: e.vendorLeadsGenerated || 0,
  customerLeadsGenerated: e.customerLeadsGenerated || 0,
  spLeadsGenerated: e.spLeadsGenerated || 0,
  franchiseLeadsGenerated: 0,
  totalLeads: e.totalLeads || 0,
  leadsConverted: e.leadsConverted || 0,
  vendorsAcquired: e.vendorsAcquired || 0,
  customersAcquired: e.customersAcquired || 0,
  spAcquired: e.spAcquired || 0,
  franchisesAcquired: 0,
  salesRevenue: e.salesRevenue || 0,
  vendorRevenue: e.vendorRevenue || 0,
  customerRevenue: e.customerRevenue || 0,
  spRevenue: e.spRevenue || 0,
  franchiseRevenue: 0,
  vendorTarget: e.vendorTarget || 0,
  customerTarget: e.customerTarget || 0,
  spTarget: e.spTarget || 0,
  franchiseTarget: 0,
  revenueTarget: e.revenueTarget || 0,
  referralsCount: e.referralsCount || 0,
  teamSize: e.teamSize || 0,
  teamRevenue: e.teamRevenue || 0,
  performanceScore: e.performanceScore || 0,
  purchasePoolContribution: e.purchasePoolContribution || 0,
  salesCount: e.salesCount || 0,
  interviewStatus: e.interviewStatus || 'Passed',
  documentStatus: e.documentStatus || 'Verified',
  applicationDate: e.applicationDate || '2026-01-01'
});

const normalizeServiceProvider = (sp: any): ServiceProvider => ({
  id: sp._id || sp.id,
  name: sp.businessName || sp.name || 'Service Provider',
  phone: sp.mobile || sp.phone || '',
  category: sp.serviceType || sp.category || 'General',
  rating: sp.rating || 0,
  status: (sp.status === 'active' || sp.status === 'Active' || sp.status === 'verified') ? 'Active' : 'Pending',
  kycStatus: (sp.status === 'verified' || sp.status === 'active') ? 'Verified' : 'Pending',
  serviceRequests: sp.serviceRequests || 0,
  revenueToday: sp.revenueToday || 0,
  revenueTotal: sp.revenueTotal || 0,
  commissionPaid: sp.commissionPaid || 0
});

const normalizeNotification = (n: any) => ({
  id: n._id || n.id,
  title: n.title || 'Notification',
  message: n.message || '',
  time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : 'Just now',
  type: n.type || 'info',
  unread: !n.isRead
});

const currentPartners: Record<'state' | 'district' | 'mandal', Partner> = {
  state: {
    id: 'STATE-01',
    name: 'State Partner',
    role: 'state',
    region: 'Andhra Pradesh',
    walletBalance: 0,
    revenueToday: 0,
    revenueMonthly: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeVendors: 0,
    commissionEarned: 0,
    pendingCommission: 0,
    targetRevenue: 1000000,
    achievedRevenue: 0,
    badge: 'Platinum',
    state: 'Andhra Pradesh',
    district: '',
    mandal: ''
  },
  district: {
    id: 'DIST-01',
    name: 'District Partner',
    role: 'district',
    region: 'Nellore',
    walletBalance: 0,
    revenueToday: 0,
    revenueMonthly: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeVendors: 0,
    commissionEarned: 0,
    pendingCommission: 0,
    targetRevenue: 500000,
    achievedRevenue: 0,
    badge: 'Gold',
    state: 'Andhra Pradesh',
    district: 'Nellore',
    mandal: ''
  },
  mandal: {
    id: 'MAND-01',
    name: 'Mandal Partner',
    role: 'mandal',
    region: 'Buchi Reddy Palem',
    walletBalance: 0,
    revenueToday: 0,
    revenueMonthly: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeVendors: 0,
    commissionEarned: 0,
    pendingCommission: 0,
    targetRevenue: 100000,
    achievedRevenue: 0,
    badge: 'Silver',
    state: 'Andhra Pradesh',
    district: 'Nellore',
    mandal: 'Buchi Reddy Palem'
  }
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleType>(() => {
    const savedRole = localStorage.getItem('apexbee_role') as RoleType;
    return savedRole || 'state';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('apexbee_auth') === 'true';
  });

  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [currentEntId, setCurrentEntId] = useState<string | null>(() => {
    return localStorage.getItem('apexbee_ent_id');
  });

  const currentEntrepreneur = currentEntId ? (entrepreneurs.find(e => e.id === currentEntId) ?? null) : null;

  const [partner, setPartner] = useState<Partner>(emptyPartner);

  // Dynamic collections
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [subFranchises, setSubFranchises] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchBackendData = async (activeRole: RoleType) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Fetch Notifications for logged in user
      const userStr = localStorage.getItem('user');
      let loggedInUser: any = null;
      try {
        loggedInUser = JSON.parse(userStr || 'null');
      } catch {}

      if (loggedInUser && loggedInUser._id) {
        fetch(`https://server.apexbee.in/api/notifications/user/${loggedInUser._id}`, { headers })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.notifications) {
              setNotifications(data.notifications.map(normalizeNotification));
            }
          })
          .catch(err => console.error('Error fetching notifications:', err));
      }

      if (activeRole === 'entrepreneur') {
        const [profileRes, teamRes, dashboardRes, walletRes, notifRes] = await Promise.all([
          fetch('https://server.apexbee.in/api/entrepreneur/profile', { headers }),
          fetch('https://server.apexbee.in/api/entrepreneur/team', { headers }),
          fetch('https://server.apexbee.in/api/entrepreneur/dashboard', { headers }),
          fetch('https://server.apexbee.in/api/entrepreneur/wallet', { headers }),
          fetch('https://server.apexbee.in/api/entrepreneur/notifications', { headers })
        ].map(p => p.catch(() => null)));

        let profileObj: any = null;
        let teamObj: any = null;
        let dashboardObj: any = null;
        let walletObj: any = null;
        let notificationsObj: any = null;

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          profileObj = profileData.data || profileData.entrepreneur;
        }

        if (dashboardRes && dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          dashboardObj = dashboardData.data;
        }

        if (walletRes && walletRes.ok) {
          const walletData = await walletRes.json();
          walletObj = walletData.data;
        }

        if (notifRes && notifRes.ok) {
          const notifData = await notifRes.json();
          notificationsObj = notifData.data;
        }

        if (teamRes && teamRes.ok) {
          const teamData = await teamRes.json();
          teamObj = teamData.data || teamData.team;
        }

        if (profileObj) {
          const mergedEntrepreneur = {
            ...profileObj,
            walletBalance: walletObj ? walletObj.balance : 0,
            pendingBalance: walletObj ? walletObj.pending : 0,
            lifetimeEarnings: walletObj ? walletObj.totalEarnings : 0,
            totalLeads: dashboardObj ? dashboardObj.totalLeads : 0,
            vendorsAcquired: teamObj && teamObj.vendors ? teamObj.vendors.length : 0,
            customersAcquired: dashboardObj ? dashboardObj.totalCustomers : 0,
            phone: profileObj.mobile || profileObj.phone || '',
            parentFranchiseId: (dashboardObj?.parentFranchise && typeof dashboardObj.parentFranchise === 'object')
              ? dashboardObj.parentFranchise
              : (profileObj.parentFranchiseId || null)
          };

          const normEnt = normalizeEntrepreneur(mergedEntrepreneur);
          
          if (walletObj) {
            normEnt.walletBalance = walletObj.balance;
            normEnt.pendingBalance = walletObj.pending;
            normEnt.lifetimeEarnings = walletObj.totalEarnings;
            normEnt.commissionEarned = walletObj.totalEarnings;
          }
          if (dashboardObj) {
            normEnt.totalLeads = dashboardObj.totalLeads;
            normEnt.customersAcquired = dashboardObj.totalCustomers;
            if (dashboardObj.parentFranchise) {
              normEnt.mentor = dashboardObj.parentFranchise.ownerName || dashboardObj.parentFranchise.businessName || 'Unassigned';
            }
          }
          if (teamObj) {
            normEnt.vendorsAcquired = teamObj.vendors?.length || 0;
            normEnt.spAcquired = teamObj.serviceProviders?.length || 0;
            normEnt.teamSize = (
              (teamObj.vendors?.length || 0) +
              (teamObj.serviceProviders?.length || 0) +
              (teamObj.courseProviders?.length || 0) +
              (teamObj.manufacturers?.length || 0) +
              (teamObj.wholesalers?.length || 0) +
              (teamObj.deliveryPartners?.length || 0)
            );
          }

          setEntrepreneurs(prev => {
            const filtered = prev.filter(e => e.id !== normEnt.id);
            return [normEnt, ...filtered];
          });
          setCurrentEntId(normEnt.id);
          localStorage.setItem('apexbee_ent_id', normEnt.id);
        }

        if (teamObj) {
          if (teamObj.vendors) {
            setVendors(teamObj.vendors.map(normalizeVendor));
          }
          if (teamObj.serviceProviders) {
            setServiceProviders(teamObj.serviceProviders.map(normalizeServiceProvider));
          }
        }

        if (notificationsObj) {
          setNotifications(notificationsObj.map(normalizeNotification));
        }

        if (walletObj && walletObj.transactions) {
          const mappedTx = walletObj.transactions.map((t: any, idx: number) => {
            const isCredit = String(t.type || '').toLowerCase() === 'credit';
            return {
              id: t._id || `TX-${idx}`,
              vendorName: t.description || 'Commission Credit',
              orderId: t.referenceId || 'N/A',
              amount: isCredit ? t.amount : -t.amount,
              commissionEarned: t.amount,
              status: isCredit ? 'Credited' : 'Deducted',
              date: t.date ? new Date(t.date).toISOString().replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
              category: t.category
            };
          });
          setTransactions(mappedTx);
        }
      } else {
        // Franchise role
        const [profileRes, teamRes, perfRes, walletRes] = await Promise.all([
          fetch('https://server.apexbee.in/api/franchise/profile', { headers }),
          fetch('https://server.apexbee.in/api/franchise/team', { headers }),
          fetch('https://server.apexbee.in/api/franchise/performance', { headers }),
          fetch('https://server.apexbee.in/api/franchise/wallet', { headers })
        ].map(p => p.catch(() => null)));

        let rawFranchise: any = null;
        let perfStats: any = null;
        let wallet: any = null;

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.franchise) {
            rawFranchise = profileData.franchise;
            setRoleState(rawFranchise.franchiseLevel);
            localStorage.setItem('apexbee_role', rawFranchise.franchiseLevel);
          }
        }

        if (perfRes && perfRes.ok) {
          const perfData = await perfRes.json();
          if (perfData.success) {
            perfStats = perfData.stats;
          }
        }

        if (walletRes && walletRes.ok) {
          const walletData = await walletRes.json();
          if (walletData.success) {
            wallet = walletData.wallet;
          }
        }

        if (rawFranchise) {
          const level = rawFranchise.franchiseLevel;
          const fallbackPartner = currentPartners[level as 'state' | 'district' | 'mandal'];
          
          setPartner({
            id: rawFranchise.franchiseCode || rawFranchise._id,
            name: rawFranchise.ownerName || fallbackPartner.name,
            role: level,
            region: rawFranchise.mandal || rawFranchise.district || rawFranchise.state || fallbackPartner.region,
            walletBalance: wallet ? wallet.availableBalance : (rawFranchise.walletBalance !== undefined ? rawFranchise.walletBalance : fallbackPartner.walletBalance),
            revenueToday: perfStats?.totalSales ? Math.floor(perfStats.totalSales / 30) : fallbackPartner.revenueToday,
            revenueMonthly: perfStats?.totalSales || fallbackPartner.revenueMonthly,
            totalOrders: perfStats?.mappedBusinesses ? perfStats.mappedBusinesses * 5 : fallbackPartner.totalOrders,
            totalCustomers: rawFranchise.totalCustomers || fallbackPartner.totalCustomers,
            activeVendors: rawFranchise.totalVendors || fallbackPartner.activeVendors,
            commissionEarned: wallet ? wallet.ledgerEntries.filter((e: any) => String(e.type || '').toLowerCase() === 'credit').reduce((acc: number, curr: any) => acc + curr.amount, 0) : (perfStats?.commissionEarned || fallbackPartner.commissionEarned),
            pendingCommission: wallet ? wallet.pendingBalance : fallbackPartner.pendingCommission,
            targetRevenue: fallbackPartner.targetRevenue,
            achievedRevenue: perfStats?.totalSales || fallbackPartner.achievedRevenue,
            badge: fallbackPartner.badge,
            state: rawFranchise.state || fallbackPartner.state || 'Andhra Pradesh',
            district: rawFranchise.district || fallbackPartner.district || 'Nellore',
            mandal: rawFranchise.mandal || fallbackPartner.mandal || 'Buchi Reddy Palem',
            bankDetails: rawFranchise.bankDetails || {
              accountHolderName: '',
              accountNumber: '',
              ifsc: '',
              bankName: '',
              upiId: ''
            }
          });
        }

        if (wallet) {
          const wds: WithdrawalRequest[] = [];
          const txs: CommissionTransaction[] = [];
          wallet.ledgerEntries.forEach((entry: any, idx: number) => {
            const isDebit = String(entry.type || '').toLowerCase() === 'debit';
            if (isDebit || entry.category === 'Withdrawal') {
              wds.push({
                id: entry._id || `WD-${idx}`,
                amount: entry.amount,
                bankAccount: entry.description || 'Bank Transfer',
                requestedDate: entry.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: entry.status === 'completed' ? 'Approved' : entry.status === 'rejected' ? 'Rejected' : 'Pending'
              });
            } else {
              txs.push({
                id: entry._id || `TX-${idx}`,
                vendorName: entry.description || 'Weekly Commission',
                orderId: entry.referenceId || `ORD-${idx}`,
                amount: entry.amount * 20,
                commissionEarned: entry.amount,
                status: 'Credited',
                date: entry.date ? new Date(entry.date).toISOString().replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
                category: entry.category
              });
            }
          });
          setWithdrawals(wds);
          setTransactions(txs);
        }

        if (teamRes && teamRes.ok) {
          const teamData = await teamRes.json();
          if (teamData.success && teamData.team) {
            const { subFranchises: rawSubs, entrepreneurs: rawEnts, vendors: rawVends, serviceProviders: rawSps } = teamData.team;
            if (rawSubs) {
              setSubFranchises(rawSubs);
            }
            if (rawEnts) {
              setEntrepreneurs(rawEnts.map(normalizeEntrepreneur));
            }
            if (rawVends) {
              setVendors(rawVends.map(normalizeVendor));
            }
            if (rawSps) {
              setServiceProviders(rawSps.map(normalizeServiceProvider));
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching backend franchise/ent data:', err);
    }
  };

  // Sync partner from backend when role changes; only fallback to emptyPartner if no token
  useEffect(() => {
    if (role !== 'entrepreneur' && !localStorage.getItem('token')) {
      setPartner(emptyPartner);
    }
  }, [role]);

  // Session verification on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const savedRole = localStorage.getItem('apexbee_role') as RoleType;
    if (!token || !userStr) {
      setIsAuthenticated(false);
      localStorage.removeItem('apexbee_auth');
      localStorage.removeItem('apexbee_role');
      localStorage.removeItem('apexbee_ent_id');
    } else if (savedRole) {
      fetchBackendData(savedRole);
    }
  }, []);

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    localStorage.setItem('apexbee_role', newRole);
    fetchBackendData(newRole);
  };

  const login = (selectedRole: RoleType) => {
    setRoleState(selectedRole);
    setIsAuthenticated(true);
    localStorage.setItem('apexbee_auth', 'true');
    localStorage.setItem('apexbee_role', selectedRole);
    fetchBackendData(selectedRole);
  };

  const loginAsEntrepreneur = (entId: string) => {
    setRoleState('entrepreneur');
    setCurrentEntId(entId);
    setIsAuthenticated(true);
    localStorage.setItem('apexbee_auth', 'true');
    localStorage.setItem('apexbee_role', 'entrepreneur');
    localStorage.setItem('apexbee_ent_id', entId);
    fetchBackendData('entrepreneur');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentEntId(null);
    localStorage.removeItem('apexbee_auth');
    localStorage.removeItem('apexbee_role');
    localStorage.removeItem('apexbee_ent_id');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Add lead
  const addLead = (newLeadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `L-${String(leads.length + 1).padStart(3, '0')}`,
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);
    setPartner(prev => {
      if (prev.role === 'state') {
        return { ...prev, totalCustomers: prev.totalCustomers + 1 };
      }
      return prev;
    });
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  };

  const addWithdrawal = (amount: number, bankAccount: string): boolean => {
    if (amount > partner.walletBalance) return false;
    const newWD: WithdrawalRequest = {
      id: `WD-${String(withdrawals.length + 1).padStart(3, '0')}`,
      amount,
      bankAccount,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setWithdrawals((prev) => [newWD, ...prev]);
    setPartner((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      pendingCommission: prev.pendingCommission + amount
    }));

    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://server.apexbee.in/api/franchise/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, bankAccount })
      })
      .then(res => {
        if (res.ok) {
          const savedRole = localStorage.getItem('apexbee_role') as RoleType;
          if (savedRole) fetchBackendData(savedRole);
        }
      })
      .catch(err => console.error('Withdrawal error:', err));
    }

    return true;
  };

  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'status'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `CMP-${String(campaigns.length + 1).padStart(2, '0')}`,
      status: 'Active'
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const addTicket = (subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], description: string) => {
    const newTkt: SupportTicket = {
      id: `TKT-${7000 + tickets.length + 1}`,
      subject, category, priority,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0],
      description
    };
    setTickets((prev) => [newTkt, ...prev]);

    if (role === 'entrepreneur') {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('https://server.apexbee.in/api/entrepreneur/support', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subject, category, priority, description })
        })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            console.warn('Support ticket backend response:', data.message);
          }
        })
        .catch(err => console.error('Error creating support ticket:', err));
      }
    }
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setTickets((prev) => prev.map((tkt) => (tkt.id === id ? { ...tkt, status } : tkt)));
  };

  const updateBankDetails = async (details: NonNullable<Partner['bankDetails']>): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const res = await fetch('https://server.apexbee.in/api/franchise/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bankDetails: details })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.franchise) {
          setPartner(prev => ({
            ...prev,
            bankDetails: data.franchise.bankDetails
          }));
          return true;
        }
      }
    } catch (err) {
      console.error('Update bank details error:', err);
    }
    return false;
  };

  return (
    <RoleContext.Provider
      value={{
        role, setRole, partner,
        leads, setLeads, vendors, setVendors, customers, setCustomers,
        transactions, setTransactions, withdrawals, setWithdrawals,
        campaigns, setCampaigns, tickets, setTickets,
        isAuthenticated, login, loginAsEntrepreneur, logout,
        currentEntrepreneur, entrepreneurs, setEntrepreneurs,
        subFranchises, setSubFranchises,
        serviceProviders, setServiceProviders,
        notifications, setNotifications,
        addLead, updateLeadStatus, addWithdrawal, addCampaign,
        addTicket, updateTicketStatus, updateBankDetails
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
