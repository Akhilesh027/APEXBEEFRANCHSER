import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Wallet,
  ChevronDown,
  LogOut,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole, partner, logout, currentEntrepreneur } = useRole();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; title: string; message: string; time: string; type: string; unread: boolean }[]>([]);

  // Load real logged-in user from localStorage
  const loggedInUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const displayName = loggedInUser?.name || partner.name;
  const displayEmail = loggedInUser?.email || '';
  const displayPhone = loggedInUser?.phone || loggedInUser?.mobile || '';

  const userRoles = Array.isArray(loggedInUser?.roles) ? loggedInUser.roles : [];
  const rolesList = userRoles.map((r: string) => r.toLowerCase());
  if (loggedInUser && !rolesList.includes('customer')) {
    rolesList.unshift('customer');
  }

  const PORTAL_LINKS: Record<string, { label: string; url: string }> = {
    customer: { label: 'Customer Portal', url: 'http://localhost:5173' },
    admin: { label: 'Admin Panel', url: 'http://localhost:5173/admin' },
    vendor: { label: 'Vendor Portal', url: 'http://localhost:5177' },
    franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    state_franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    district_franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    mandal_franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    service_provider: { label: 'Service Provider Portal', url: 'http://localhost:5176' },
    course_provider: { label: 'Course Provider Portal', url: 'http://localhost:5174' },
  };

  const availablePortals = rolesList
    .map((role: string) => {
      const match = PORTAL_LINKS[role];
      return match ? { ...match, role } : null;
    })
    .filter(Boolean);

  const handleSwitchPortal = (role: string, url: string) => {
    localStorage.setItem('activeRole', role);
    window.location.href = url;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format currency in Indian Rupees format (e.g. ₹12,45,000)
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleRoleSelect = (selectedRole: 'state' | 'district' | 'mandal') => {
    setRole(selectedRole);
    setShowRoleMenu(false);
  };

  const handleNotificationClick = (id: number | string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`https://server.apexbee.in/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error('Error marking notification read:', err));
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getRoleBadgeColor = (r: typeof role) => {
    if (r === 'state') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (r === 'district') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  };

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/60 glass z-10">
      {/* Welcome & Info */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Welcome Back,
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            {displayName.split(' ')[0]}
          </span>
        </h1>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
          {role === 'state'
            ? (partner.state || 'Andhra Pradesh')
            : role === 'district'
            ? `${partner.district || 'SPSR Nellore'} District`
            : role === 'mandal'
            ? `${partner.mandal || 'Buchi Reddy Palem'} Mandal`
            : `${currentEntrepreneur?.mandal || 'Buchi Reddy Palem'} Mandal`}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {/* Wallet Balance Card */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 border border-primary/20 dark:border-primary/30 rounded-2xl">
          <div className="p-1.5 rounded-lg bg-primary text-white">
            <Wallet size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider leading-none">
              Wallet Balance
            </span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
              {formatINR(partner.walletBalance)}
            </span>
          </div>
        </div>

        {/* Search Input (Decorative/Modern) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            className="relative p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-dark animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 max-h-[400px] overflow-y-auto rounded-2xl glass-premium border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-2 z-30"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setNotifications(n => n.map(x => ({ ...x, unread: false })))}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id)}
                          className={`p-3 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                            notif.unread ? 'bg-primary/5 dark:bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-bold ${notif.unread ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                              {notif.title}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown - Now shows REAL logged-in user */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {getInitials(displayName)}
            </div>
            <div className="flex flex-col text-left hidden sm:flex">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                {displayName.split(' ')[0]}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider capitalize">
                {role} Partner
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          <AnimatePresence>
            {showRoleMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowRoleMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-64 rounded-2xl glass-premium border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-2 z-30"
                >
                  {/* Real User Info Header */}
                  <div className="px-3 py-3 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      {getInitials(displayName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{displayEmail || `${role}_franchise`}</p>
                      {displayPhone && <p className="text-[10px] text-slate-400">{displayPhone}</p>}
                    </div>
                  </div>

                  {/* Account Status */}
                  {loggedInUser && (
                    <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500">
                          {loggedInUser.isVerified ? 'Verified Account' : 'Account Active'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(loggedInUser.roles || [role + '_franchise']).map((r: string) => (
                          <span key={r} className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                            {r.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Switch Perspective */}
                  <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Perspective</span>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {(['state', 'district', 'mandal'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleSelect(r)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer transition-colors ${
                          role === r
                            ? 'bg-primary text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="capitalize">{r} Partner</span>
                        {role !== r && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md border ${getRoleBadgeColor(r)}`}>
                            Select
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 space-y-1 border-t border-slate-200/50 dark:border-slate-800/50 pt-1.5">
                    {availablePortals.length > 1 && (
                      <div className="pb-1.5 border-b border-slate-200/50 dark:border-slate-800/50 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">Switch Portal</span>
                        {availablePortals.map((portal: any, idx: number) => {
                          if (portal.role.includes('franchise')) return null;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSwitchPortal(portal.role, portal.url)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-left text-xs font-semibold text-primary hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                            >
                              <span>🔄 {portal.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-bold text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Logout Account</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

