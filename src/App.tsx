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
    return <EntrepreneurPortal />;
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
