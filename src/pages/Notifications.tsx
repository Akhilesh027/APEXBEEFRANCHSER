import React from 'react';
import { useRole } from '../context/RoleContext';
import { Bell, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationsPage: React.FC = () => {
  const { notifications, setNotifications } = useRole();

  const handleMarkAllRead = () => {
    const unreads = notifications.filter((n: any) => n.unread);
    setNotifications((prev: any[]) => prev.map((n: any) => ({ ...n, unread: false })));
    const token = localStorage.getItem('token');
    if (token && unreads.length > 0) {
      Promise.all(unreads.map((n: any) =>
        fetch(`https://server.apexbee.in/api/notifications/${n.id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
      )).catch(err => console.error('Error marking all notifications read:', err));
    }
  };

  const handleMarkRead = (id: string | number) => {
    setNotifications((prev: any[]) => prev.map((n: any) => n.id === id ? { ...n, unread: false } : n));
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`https://server.apexbee.in/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error('Error marking notification read:', err));
    }
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
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Notifications</h2>
            <p className="text-xs text-slate-400 mt-0.5">Browse system alert notices, sales commissions logs, and training milestones</p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-250 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-250 font-bold text-xs shadow-sm transition-all cursor-pointer text-center"
        >
          <CheckSquare size={16} />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Roster list */}
      <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-2">Recent Notifications Feed</h3>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                notif.unread
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/20'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                notif.unread ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                <Bell size={16} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-bold ${notif.unread ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
