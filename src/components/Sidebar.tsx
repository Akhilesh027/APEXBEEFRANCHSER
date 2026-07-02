import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import {
  LayoutDashboard,
  MapPin,
  Network,
  Users,
  Store,
  UserPlus,
  Briefcase,
  Wrench,
  Truck,
  UserCheck,
  ShoppingBag,
  Wallet,
  Percent,
  CreditCard,
  GitFork,
  ShieldCheck,
  Megaphone,
  Tv,
  Trophy,
  Award,
  GraduationCap,
  HelpCircle,
  BarChart3,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { role, partner } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab class
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
      isActive
        ? 'bg-primary text-white shadow-md shadow-primary/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-primary dark:hover:text-primary'
    }`;
  };

  // Define navigation items grouped in sections
  const getNavSections = () => {
    return [
      {
        title: 'Core Desk',
        items: [
          { path: '/', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/notifications', label: 'Notifications', icon: Bell }
        ]
      },
      {
        title: 'Territory & Network',
        items: [
          { path: '/territory', label: 'Territory Management', icon: MapPin },
          { path: '/network', label: 'Franchise Network', icon: Network },
          { path: '/referral', label: 'Referral Network', icon: Users },
          { path: '/mlm-team', label: 'MLM Team Management', icon: GitFork }
        ]
      },
      {
        title: 'Operations Directory',
        items: [
          { path: '/vendors', label: 'Vendor Management', icon: Store },
          { path: '/entrepreneurs', label: '🧑‍💼 Entrepreneur Hub', icon: Briefcase },
          { path: '/service-providers', label: 'Service Provider Management', icon: Wrench },
          { path: '/delivery-partners', label: 'Delivery Partner Management', icon: Truck },
          { path: '/customers', label: 'Customer Management', icon: UserCheck },
          { path: '/crm', label: 'CRM & Lead Management', icon: UserPlus }
        ]
      },
      {
        title: 'Transactions',
        items: [
          { path: '/orders', label: 'Order Monitoring', icon: ShoppingBag },
          { path: '/wallet', label: 'Wallet', icon: Wallet },
          { path: '/commission', label: 'Commission Center', icon: Percent },
          { path: '/withdrawals', label: 'Withdrawals', icon: CreditCard },
          { path: '/kyc', label: 'KYC Verification', icon: ShieldCheck }
        ]
      },
      {
        title: 'Marketing & Ads',
        items: [
          { path: '/offers', label: 'Marketing Management', icon: Megaphone },
          { path: '/ads', label: 'Advertisement Management', icon: Tv }
        ]
      },
      {
        title: 'Achievements',
        items: [
          { path: '/performance', label: 'Performance Center', icon: Trophy },
          { path: '/leaderboards', label: 'Leaderboards', icon: Award },
          { path: '/training', label: 'Training Center', icon: GraduationCap }
        ]
      },
      {
        title: 'Security & Help',
        items: [
          { path: '/support', label: 'Support Center', icon: HelpCircle },
          { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
          { path: '/security', label: 'Security Settings', icon: Shield }
        ]
      }
    ];
  };

  const navSections = getNavSections();

  return (
    <aside
      className={`relative h-full flex flex-col border-r border-slate-200 dark:border-slate-800 transition-all duration-300 glass-premium z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-extrabold text-xl shadow-lg shadow-primary/20 shrink-0">
          A
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              ApexBee
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Franchise SaaS
            </span>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center border border-slate-200 dark:border-slate-800 hover:scale-115 transition-transform duration-200 shadow-md shadow-primary/10 cursor-pointer z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {!collapsed ? (
              <span className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                {section.title}
              </span>
            ) : (
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-2 first:border-0" />
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={getLinkClass(item.path)}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {!collapsed && (
                      <span className="font-semibold text-xs tracking-wide transition-opacity duration-200 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Active Role Card */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <div className="bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/20 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${role === 'state' ? 'bg-emerald-500' : role === 'district' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
              <span className="text-xs font-bold text-slate-400 capitalize">{role} Partner</span>
            </div>
            <p className="text-sm font-bold truncate mt-1 text-slate-800 dark:text-slate-200">
              {role === 'state' ? (partner.state || 'Andhra Pradesh') : role === 'district' ? (partner.district || 'SPSR Nellore') : (partner.mandal || 'Buchi Reddy Palem')}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
