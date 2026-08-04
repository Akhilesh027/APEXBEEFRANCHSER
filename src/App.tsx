import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './pages/Login';
import { EntrepreneurPortal } from './pages/EntrepreneurPortal';
import { Dashboard } from './pages/Dashboard';
import { NetworkPage } from './pages/Network';
import { CRM } from './pages/CRM';
import { Vendors } from './pages/Vendors';
import { Commission } from './pages/Commission';
import { Offers } from './pages/Offers';
import { Reports } from './pages/Reports';
import { Support } from './pages/Support';
import { TerritoryPage } from './pages/Territory';
import { ReferralPage } from './pages/Referral';
import { EntrepreneursPage } from './pages/Entrepreneurs';
import { ServiceProvidersPage } from './pages/ServiceProviders';
import { DeliveryPartnersPage } from './pages/DeliveryPartners';
import { CustomersPage } from './pages/Customers';
import { OrdersPage } from './pages/Orders';
import { WalletPage } from './pages/Wallet';
import { WithdrawalsPage } from './pages/Withdrawals';
import { MLMTeamPage } from './pages/MLMTeam';
import { KYCPage } from './pages/KYC';
import { AdsPage } from './pages/Ads';
import { PerformancePage } from './pages/Performance';
import { LeaderboardsPage } from './pages/Leaderboards';
import { TrainingPage } from './pages/Training';
import { NotificationsPage } from './pages/Notifications';
import { SecurityPage } from './pages/Security';

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, role } = useRole();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (role === 'entrepreneur') {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark text-slate-800 dark:text-slate-100 p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <div className="max-w-md w-full text-center space-y-5 bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-8 rounded-[32px] shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner text-2xl font-black">
            🚀
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Coming Soon
            </span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Entrepreneur Portal</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We are enhancing the Ecosystem Entrepreneur & Partner Portal. Access for this section is launching soon!
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => {
                localStorage.removeItem('apexbee_auth');
                localStorage.removeItem('apexbee_role');
                localStorage.removeItem('apexbee_ent_id');
                window.location.reload();
              }}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-extrabold text-xs shadow-lg shadow-primary/25 hover:bg-blue-600 transition-all cursor-pointer"
            >
              Return to Main Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-light text-light-text dark:bg-dark dark:text-dark-text transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Universal Top Header */}
        <Header />

        {/* Dynamic Route Display Shell */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/40 dark:bg-slate-900/10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/territory" element={<TerritoryPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/entrepreneurs" element={<EntrepreneursPage />} />
            <Route path="/service-providers" element={<ServiceProvidersPage />} />
            <Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/commission" element={<Commission />} />
            <Route path="/withdrawals" element={<WithdrawalsPage />} />
            <Route path="/mlm-team" element={<MLMTeamPage />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/ads" element={<AdsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/security" element={<SecurityPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <Router>
          <AppContent />
        </Router>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
