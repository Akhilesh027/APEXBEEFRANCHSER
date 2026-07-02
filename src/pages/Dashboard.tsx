import React, { useMemo, useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { TargetAchievement } from '../components/TargetAchievement';
import { PerformanceMap } from '../components/PerformanceMap';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  DollarSign,
  LifeBuoy,
  Trophy,
  Activity,
  Briefcase,
  Wrench,
  Truck,
  Wallet,
  Award,
  PlusCircle,
  GitFork,
  Map,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { role, partner } = useRole();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'https://server.apexbee.in';
      const res = await fetch(`${baseUrl}/api/franchise/dashboard/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to connect to backend analytics API');
      }
      const data = await res.json();
      if (data.success && data.analytics) {
        setAnalytics(data.analytics);
      } else {
        throw new Error(data.message || 'Server error loading analytics');
      }
    } catch (err: any) {
      console.error('Error loading dashboard analytics:', err);
      setError(err.message || 'Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // 60s Auto Refresh
    return () => clearInterval(interval);
  }, []);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  };

  const getNumber = (...values: any[]) => {
    for (const value of values) {
      if (value !== undefined && value !== null && !Number.isNaN(Number(value))) {
        return Number(value);
      }
    }
    return 0;
  };

  const getText = (...values: any[]) => {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return 'Live data';
  };

  const todayRevenue = getNumber(analytics?.todayRevenue);
  const monthlyRevenue = getNumber(analytics?.monthlyRevenue);
  const walletBalance = getNumber(analytics?.walletBalance);
  const pendingBalance = getNumber(analytics?.pendingBalance);
  const referralEarned = getNumber(analytics?.referralCommission);
  const mlmEarned = getNumber(analytics?.mlmCommission);

  const statsCards = useMemo(() => {
    if (role === 'entrepreneur') return [];

    const commonDetails = {
      state: [
        { label: "Today's Revenue", value: todayRevenue, isCurrency: true, change: "+12.5%", isPositive: true, icon: DollarSign, color: "text-blue-500 bg-blue-500/10" },
        { label: "Monthly Revenue", value: monthlyRevenue, isCurrency: true, change: "+18.2%", isPositive: true, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "Active Vendors", value: getNumber(analytics?.activeVendors, partner?.activeVendors), change: getText(analytics?.activeVendorsChange), isPositive: true, icon: Store, color: "text-amber-500 bg-amber-500/10" },
        { label: "Active Customers", value: getNumber(analytics?.activeCustomers, partner?.totalCustomers), change: getText(analytics?.activeCustomersChange), isPositive: true, icon: Users, color: "text-indigo-500 bg-indigo-500/10" },
        { label: "Entrepreneurs", value: getNumber(analytics?.totalEntrepreneurs), change: getText(analytics?.entrepreneursChange), isPositive: true, icon: Briefcase, color: "text-violet-500 bg-violet-500/10" },
        { label: "Service Providers", value: getNumber(analytics?.totalServiceProviders, partner?.totalServiceProviders), change: getText(analytics?.serviceProvidersChange), isPositive: true, icon: Wrench, color: "text-teal-500 bg-teal-500/10" },
        { label: "Delivery Partners", value: getNumber(analytics?.totalDeliveryPartners, partner?.totalDeliveryPartners), change: getText(analytics?.deliveryPartnersChange), isPositive: true, icon: Truck, color: "text-pink-500 bg-pink-500/10" },
        { label: "Available Commission", value: walletBalance, isCurrency: true, change: "Withdraw available", isPositive: true, icon: Wallet, color: "text-sky-500 bg-sky-500/10" },
        { label: "Pending Commission", value: pendingBalance, isCurrency: true, change: "Verification pending", isPositive: true, icon: Activity, color: "text-orange-500 bg-orange-500/10" },
        { label: "Referral Earnings", value: referralEarned, isCurrency: true, change: getText(analytics?.referralEarningsChange), isPositive: true, icon: Award, color: "text-rose-500 bg-rose-500/10" },
        { label: "MLM Earnings", value: mlmEarned, isCurrency: true, change: getText(analytics?.mlmEarningsChange), isPositive: true, icon: GitFork, color: "text-cyan-500 bg-cyan-500/10" },
        { label: "Territory Coverage", value: `${getNumber(analytics?.territoryCoverage)}%`, change: getText(analytics?.territoryScope), isPositive: true, icon: Map, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "New Registrations", value: getNumber(analytics?.newRegistrations), change: getText(analytics?.newRegistrationsChange), isPositive: true, icon: PlusCircle, color: "text-blue-500 bg-blue-500/10" },
        { label: "Support Tickets", value: getNumber(analytics?.supportTickets), change: "Action required", isPositive: getNumber(analytics?.supportTickets) === 0, icon: LifeBuoy, color: "text-rose-500 bg-rose-500/10" }
      ],
      district: [
        { label: "Today's Revenue", value: todayRevenue, isCurrency: true, change: "+10.1%", isPositive: true, icon: DollarSign, color: "text-blue-500 bg-blue-500/10" },
        { label: "Monthly Revenue", value: monthlyRevenue, isCurrency: true, change: "+15.3%", isPositive: true, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "Active Vendors", value: getNumber(analytics?.activeVendors, partner?.activeVendors), change: getText(analytics?.activeVendorsChange), isPositive: true, icon: Store, color: "text-amber-500 bg-amber-500/10" },
        { label: "Active Customers", value: getNumber(analytics?.activeCustomers, partner?.totalCustomers), change: getText(analytics?.activeCustomersChange), isPositive: true, icon: Users, color: "text-indigo-500 bg-indigo-500/10" },
        { label: "Entrepreneurs", value: getNumber(analytics?.totalEntrepreneurs), change: getText(analytics?.entrepreneursChange), isPositive: true, icon: Briefcase, color: "text-violet-500 bg-violet-500/10" },
        { label: "Service Providers", value: getNumber(analytics?.totalServiceProviders, partner?.totalServiceProviders), change: getText(analytics?.serviceProvidersChange), isPositive: true, icon: Wrench, color: "text-teal-500 bg-teal-500/10" },
        { label: "Delivery Partners", value: getNumber(analytics?.totalDeliveryPartners, partner?.totalDeliveryPartners), change: getText(analytics?.deliveryPartnersChange), isPositive: true, icon: Truck, color: "text-pink-500 bg-pink-500/10" },
        { label: "Available Commission", value: walletBalance, isCurrency: true, change: "Withdraw available", isPositive: true, icon: Wallet, color: "text-sky-500 bg-sky-500/10" },
        { label: "Pending Commission", value: pendingBalance, isCurrency: true, change: "Verification pending", isPositive: true, icon: Activity, color: "text-orange-500 bg-orange-500/10" },
        { label: "Referral Earnings", value: referralEarned, isCurrency: true, change: getText(analytics?.referralEarningsChange), isPositive: true, icon: Award, color: "text-rose-500 bg-rose-500/10" },
        { label: "MLM Earnings", value: mlmEarned, isCurrency: true, change: getText(analytics?.mlmEarningsChange), isPositive: true, icon: GitFork, color: "text-cyan-500 bg-cyan-500/10" },
        { label: "Territory Coverage", value: `${getNumber(analytics?.territoryCoverage)}%`, change: getText(analytics?.territoryScope), isPositive: true, icon: Map, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "New Registrations", value: getNumber(analytics?.newRegistrations), change: getText(analytics?.newRegistrationsChange), isPositive: true, icon: PlusCircle, color: "text-blue-500 bg-blue-500/10" },
        { label: "Support Tickets", value: getNumber(analytics?.supportTickets), change: "Action required", isPositive: getNumber(analytics?.supportTickets) === 0, icon: LifeBuoy, color: "text-rose-500 bg-rose-500/10" }
      ],
      mandal: [
        { label: "Today's Revenue", value: todayRevenue, isCurrency: true, change: "+5.4%", isPositive: true, icon: DollarSign, color: "text-blue-500 bg-blue-500/10" },
        { label: "Monthly Revenue", value: monthlyRevenue, isCurrency: true, change: "+11.2%", isPositive: true, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "Active Vendors", value: getNumber(analytics?.activeVendors, partner?.activeVendors), change: getText(analytics?.activeVendorsChange), isPositive: true, icon: Store, color: "text-amber-500 bg-amber-500/10" },
        { label: "Active Customers", value: getNumber(analytics?.activeCustomers, partner?.totalCustomers), change: getText(analytics?.activeCustomersChange), isPositive: true, icon: Users, color: "text-indigo-500 bg-indigo-500/10" },
        { label: "Entrepreneurs", value: getNumber(analytics?.totalEntrepreneurs), change: getText(analytics?.entrepreneursChange), isPositive: true, icon: Briefcase, color: "text-violet-500 bg-violet-500/10" },
        { label: "Service Providers", value: getNumber(analytics?.totalServiceProviders, partner?.totalServiceProviders), change: getText(analytics?.serviceProvidersChange), isPositive: true, icon: Wrench, color: "text-teal-500 bg-teal-500/10" },
        { label: "Delivery Partners", value: getNumber(analytics?.totalDeliveryPartners, partner?.totalDeliveryPartners), change: getText(analytics?.deliveryPartnersChange), isPositive: true, icon: Truck, color: "text-pink-500 bg-pink-500/10" },
        { label: "Available Commission", value: walletBalance, isCurrency: true, change: "Withdraw available", isPositive: true, icon: Wallet, color: "text-sky-500 bg-sky-500/10" },
        { label: "Pending Commission", value: pendingBalance, isCurrency: true, change: "Verification pending", isPositive: true, icon: Activity, color: "text-orange-500 bg-orange-500/10" },
        { label: "Referral Earnings", value: referralEarned, isCurrency: true, change: getText(analytics?.referralEarningsChange), isPositive: true, icon: Award, color: "text-rose-500 bg-rose-500/10" },
        { label: "MLM Earnings", value: mlmEarned, isCurrency: true, change: getText(analytics?.mlmEarningsChange), isPositive: true, icon: GitFork, color: "text-cyan-500 bg-cyan-500/10" },
        { label: "Territory Coverage", value: `${getNumber(analytics?.territoryCoverage)}%`, change: getText(analytics?.territoryScope), isPositive: true, icon: Map, color: "text-emerald-500 bg-emerald-500/10" },
        { label: "New Registrations", value: getNumber(analytics?.newRegistrations), change: getText(analytics?.newRegistrationsChange), isPositive: true, icon: PlusCircle, color: "text-blue-500 bg-blue-500/10" },
        { label: "Support Tickets", value: getNumber(analytics?.supportTickets), change: "Action required", isPositive: getNumber(analytics?.supportTickets) === 0, icon: LifeBuoy, color: "text-rose-500 bg-rose-500/10" }
      ]
    };

    return commonDetails[role as 'state' | 'district' | 'mandal'] || [];
  }, [role, partner, analytics, todayRevenue, monthlyRevenue, walletBalance, pendingBalance, referralEarned, mlmEarned]);

  const leaderboard = useMemo(() => {
    if (analytics?.leaderboard?.items) {
      return analytics.leaderboard;
    }
    return {
      title: "Area Rankings",
      type: "Zone",
      items: []
    };
  }, [analytics]);

  const revenueChartData = analytics?.revenueChartData || [];
  const referralGrowthData = analytics?.referralGrowthData || [];
  const commissionTrendData = analytics?.commissionTrendData || [];
  const mlmGrowthData = analytics?.mlmGrowthData || [];

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  const tooltipStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
    borderRadius: '12px'
  };

  const EmptyChart = () => (
    <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold">
      No real data available
    </div>
  );

  if (loading && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400">Loading Operational Dashboard...</p>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-rose-50/5 border border-rose-200 dark:border-rose-900/30 rounded-3xl space-y-4">
        <AlertCircle className="text-rose-500 w-12 h-12 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Failed to Load Dashboard</h3>
        <p className="text-sm text-slate-500 max-w-md">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold transition-all border-0 cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" className="space-y-6">
      <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
        Business Expansion KPI Desk
      </h2>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card: any) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                    {card.label}
                  </span>

                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block">
                    {card.isCurrency ? formatINR(Number(card.value)) : card.value}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-4 text-[11px]">
                {card.isPositive !== false ? (
                  <TrendingUp size={12} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={12} className="text-danger" />
                )}

                <span className={`font-bold ${card.isPositive !== false ? 'text-emerald-500' : 'text-danger'}`}>
                  {card.change}
                </span>

                <span className="text-slate-400 font-medium">from backend</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Detailed Operations Panel */}
      <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mt-8">
        Marketplace Operations & Health Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card 1: Store & Product Analytics */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl">
              <Store size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Store & Product Catalog</h3>
              <p className="text-[10px] text-slate-400">Inventory and store onboarding lifecycle status</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Products Listed</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{analytics?.productsListed ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Live Products</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{analytics?.liveProducts ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Pending Review</span>
              <span className="text-sm font-extrabold text-amber-500 mt-1 block">{analytics?.pendingProducts ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Out of Stock</span>
              <span className="text-sm font-extrabold text-rose-500 mt-1 block">{analytics?.outOfStockProducts ?? 0}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Approved Stores</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{analytics?.approvedStores ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Review Stores</span>
              <span className="text-amber-500 font-extrabold">{analytics?.pendingReviewStores ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Draft / Suspended Stores</span>
              <span className="text-rose-500 font-extrabold">{(analytics?.draftStores ?? 0) + (analytics?.suspendedStores ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Scoped Order Statuses */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-2xl">
              <DollarSign size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Order Lifecycle Analytics</h3>
              <p className="text-[10px] text-slate-400">Real-time status tracking of all scoped orders</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Placed Orders</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{analytics?.orderStatuses?.Placed ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Delivered Orders</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{analytics?.orderStatuses?.Delivered ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Shipped / Packed</span>
              <span className="text-sm font-extrabold text-blue-500 mt-1 block">{(analytics?.orderStatuses?.Shipped ?? 0) + (analytics?.orderStatuses?.Packed ?? 0)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Cancelled / Returned</span>
              <span className="text-sm font-extrabold text-rose-500 mt-1 block">{(analytics?.orderStatuses?.Cancelled ?? 0) + (analytics?.orderStatuses?.Returned ?? 0)}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Payment Pending Orders</span>
              <span className="text-amber-500 font-extrabold">{analytics?.orderStatuses?.PaymentPending ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Revenue Volume</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{formatINR(analytics?.totalRevenue ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Subscription & Delivery Partner Analytics */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-500/10 text-violet-500 rounded-2xl">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Subscriptions & Deliveries</h3>
              <p className="text-[10px] text-slate-400">Local shop recurring subscriptions & rider state</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Active Subscriptions</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{analytics?.totalActiveSubscriptions ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Recurring Revenue</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{formatINR(analytics?.recurringRevenue ?? 0)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Available Riders</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{analytics?.deliveryAvailable ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Offline / Suspended</span>
              <span className="text-sm font-extrabold text-rose-500 mt-1 block">{(analytics?.deliveryOffline ?? 0) + (analytics?.deliverySuspended ?? 0)}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Today's Platform Deliveries</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{analytics?.todayDeliveriesCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Platform Deliveries</span>
              <span className="text-emerald-500 font-extrabold">{analytics?.completedDeliveries ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Wallet & Commissions Statement */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-500 rounded-2xl">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Detailed Wallet Breakdown</h3>
              <p className="text-[10px] text-slate-400">Real-time ledger audit payouts & platform shares</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Today's Earnings</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{formatINR(analytics?.todayEarnings ?? 0)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Monthly Earnings</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{formatINR(analytics?.monthlyEarnings ?? 0)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Vendor Commission</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{formatINR(analytics?.vendorCommission ?? 0)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[10px] text-slate-400 block font-medium">Company Platform Fee</span>
              <span className="text-sm font-extrabold text-indigo-500 mt-1 block">{formatINR(analytics?.companyShare ?? 0)}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Lifetime Earnings</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{formatINR(analytics?.totalLifetimeEarnings ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>MLM Level 1 / 2 / 3 Payouts</span>
              <span className="text-emerald-500 font-extrabold">{formatINR((analytics?.level1Commission ?? 0) + (analytics?.level2Commission ?? 0) + (analytics?.level3Commission ?? 0))}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Customer Growth & Signups */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Users size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Customer Acquisition</h3>
              <p className="text-[10px] text-slate-400">Scoped registration growth metrics for customers</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[9px] text-slate-400 block font-medium">New Today</span>
              <span className="text-sm font-extrabold text-emerald-500 mt-1 block">{analytics?.newCustomersToday ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[9px] text-slate-400 block font-medium">This Week</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{analytics?.newCustomersThisWeek ?? 0}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/20">
              <span className="text-[9px] text-slate-400 block font-medium">This Month</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{analytics?.newCustomersThisMonth ?? 0}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Total Active Customers</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{analytics?.activeCustomers ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Affiliate Referrals Total</span>
              <span className="text-emerald-500 font-extrabold">{analytics?.totalReferrals ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Health Heat Map & Active Alerts */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl">
              <AlertCircle size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Marketplace Health & Alerts</h3>
              <p className="text-[10px] text-slate-400">Critical operational warnings & territory performance</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="bg-rose-50/30 dark:bg-rose-950/10 p-3 rounded-2xl border border-rose-100/50 dark:border-rose-900/10 space-y-1">
              <span className="text-[9px] text-rose-500 block font-bold uppercase">Pending Stores</span>
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 block">{analytics?.pendingStoreApprovals ?? 0}</span>
            </div>
            <div className="bg-amber-50/30 dark:bg-amber-950/10 p-3 rounded-2xl border border-amber-100/50 dark:border-amber-900/10 space-y-1">
              <span className="text-[9px] text-amber-500 block font-bold uppercase">Withdraw Requests</span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 block">{analytics?.withdrawRequests ?? 0}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Top District / Mandal</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{analytics?.topDistrict ?? 'N/A'} / {analytics?.topMandal ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Worst Performing Zone</span>
              <span className="text-rose-500 font-extrabold">{analytics?.worstPerformingArea ?? 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span>Rider Rating (Avg)</span>
              <span className="text-emerald-500 font-extrabold">{analytics?.avgRating ?? 4.8} ★</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <TargetAchievement />
        </motion.div>

        <motion.div
          className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                Territory Revenue Chart
              </h3>
              <p className="text-xs text-slate-400">
                Monthly gross sales trends scoped to assigned zones
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            {revenueChartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-2">
            Referral Growth Chart
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Monthly onboarding of network affiliates
          </p>

          <div className="h-56 w-full">
            {referralGrowthData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={referralGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="referrals" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-2">
            Commission Trend Chart
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            MLM vs Referral vs Franchise earnings breakdown
          </p>

          <div className="h-56 w-full">
            {commissionTrendData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconSize={10} />
                  <Bar dataKey="MLM" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Referral" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Franchise" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-2">
            MLM Growth Chart
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Multilevel team registrations across levels
          </p>

          <div className="h-56 w-full">
            {mlmGrowthData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mlmGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconSize={10} />
                  <Line type="monotone" dataKey="level1" stroke="#2563EB" strokeWidth={2} />
                  <Line type="monotone" dataKey="level2" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="level3" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <PerformanceMap />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Trophy size={18} />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                {leaderboard.title}
              </h3>
              <p className="text-xs text-slate-400 font-sans">Monthly performance rankings</p>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.items.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 font-semibold text-center bg-slate-50 dark:bg-slate-900/20 rounded-2xl">
                No real leaderboard data available
              </div>
            ) : (
              leaderboard.items.map((item: any, idx: number) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 text-xs font-semibold"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-850 dark:text-slate-200">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Growth: {item.growth} ({item.performance})</span>
                  </div>
                  <span className="text-slate-500 font-extrabold">{item.metric}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};