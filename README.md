# ApexBee Franchise & Entrepreneur Management Platform

Welcome to the **ApexBee Franchise & Entrepreneur Management Platform**. This system is a high-fidelity, production-grade enterprise dashboard designed to administer, monitor, and scale regional operations, vendor acquisition, MLM networks, and entrepreneur pipelines across regional tiers (State, District, and Mandal).

---

## 🚀 Key Architectures & Role-Based Perspectives

The platform is designed around strict **Role-Based Workspace Isolation**. Roles are divided into two main categories:

### 1. Franchise Partners (`state` | `district` | `mandal`)
Franchise partners manage hierarchical boundaries and regional desks.
*   **State Partner**: Oversees the entire state region (e.g., Andhra Pradesh), managing districts, mandals, regional networks, and high-volume billing.
*   **District Partner**: Operates at the county or district level (e.g., SPSR Nellore), monitoring localized mandals, active entrepreneurs, and partner growth.
*   **Mandal Partner**: Works at the localized town or mandal tier (e.g., Buchi Reddy Palem), directly onboarding vendors, tracking delivery agents, and auditing customer transactions.

### 2. Dedicated Entrepreneur Perspective (`entrepreneur`)
*   **Isolated Workspace**: Entrepreneurs access a **completely separate portal** with a dedicated layout, custom sidebar, emerald-green branding, and independent routing.
*   **Zero Cross-Contamination**: Under the entrepreneur role, all franchise-level administration, regional settings, and state configurations are hidden to ensure focus on business growth (vendor/customer acquisition, lead building, and MLM teams).

---

## 🎨 Technology Stack & Design System
*   **Framework**: React 19 + TypeScript + Vite.
*   **Styling**: Tailwind CSS v4 using modern CSS-only configurations inside `index.css`.
*   **Icons**: Lucide React.
*   **Visualizations**: Recharts (with optimized type overrides) & SVG Canvas.
*   **Animations**: Framer Motion for state changes, tabs sliding, and dialog transitions.
*   **Session Management**: Persistent localStorage bindings inside a unified `RoleProvider` context.

---

## 📂 System Directory & Code Architecture

```
src/
├── App.tsx                  # Core router & workspace switcher (Franchise vs Entrepreneur)
├── main.tsx                 # App mount & entrypoint
├── index.css                # Tailwind CSS v4 directives & theme configurations
├── components/              # Reusable functional visualization components
│   ├── Header.tsx           # Global Franchise top bar (profile tracker, theme, quick-switch)
│   ├── Sidebar.tsx          # Grouped Franchise sidebar navigation (26 routes in 7 desks)
│   ├── NetworkTree.tsx      # Interactive collapsible node structure (State ➔ Vendor)
│   ├── PerformanceMap.tsx   # Geographical maps with performance marker nodes
│   └── TargetAchievement.tsx# SVG targets vs achievement ring meters
├── context/
│   ├── RoleContext.tsx      # Auth states, active roles, and shared handlers (e.g. simulate sale)
│   └── ThemeContext.tsx     # Light/Dark mode state management
├── pages/                   # All individual module pages
│   ├── Login.tsx            # Dual-tab Login Portal (Franchise vs Entrepreneur)
│   ├── EntrepreneurRegister.tsx # 4-Step Entrepreneur Registration Wizard
│   ├── EntrepreneurPortal.tsx   # Self-contained Entrepreneur dashboard & workspace
│   ├── Dashboard.tsx        # Franchise KPI desk & Recharts metrics
│   ├── CRM.tsx              # Leads management withTwilio/WhatsApp simulators
│   ├── Commission.tsx       # Interactive Commission Center with instant calculators
│   ├── Withdrawals.tsx      # Withdrawal requests form & transaction histories
│   ├── MLMTeam.tsx          # Multi-level downline visual charts
│   ├── KYC.tsx              # Interactive document verification checklist
│   └── ... (and all other operational pages)
└── utils/
    └── mockData.ts          # Complete business data sets & typescript models
```

---

## 🌟 Detailed Module Guide (Franchise Portal)

The Franchise Portal is organized into **7 Core Desks** containing 26 routes:

### 🏠 1. Core Desk
*   **Dashboard**: Renders the **14 KPI Cards Grid** (Today's revenue, active vendors, available commission, pending ticket counts, etc.) and **6 analytical widgets** (revenue trends, MLM vs referral payouts, referral growth chart). Includes regional performance maps and interactive targets ring trackers.
*   **Notifications**: Centralized logs repository showcasing simulated system logs, sales commissions, and sign-ups.

### 📍 2. Territory & Network Desk
*   **Territory Management**: Interactive breakdown tree highlighting State ➔ District ➔ Mandal scopes, mapping total vendor counts and targets at each level.
*   **Franchise Network**: Accesses the node-based hierarchical collapsible canvas representing the regional chain structure.
*   **Referral Network**: Clipboard invitation links generator tracking downline referral metrics.
*   **MLM Team Management**: Renders visually structured downline cards across three levels (L1, L2, L3) displaying names, status, and earnings.

### 🏪 3. Operations Directory Desk
*   **Vendor Management**: Onboarding hub listing active/inactive shops, verification ratings, and dynamic approval buttons.
*   **Entrepreneur Management Hub**: Admin view overseeing registrations, active pools, mentor pairings, performance scorecards, and bronze/silver/gold training statuses.
*   **Service Provider Management**: Directory filtering local electricians, plumbers, and technicians.
*   **Delivery Partner Management**: Logistics grid tracking active riders, delivery orders, wallets, and vehicle classifications.
*   **Customer Management**: Direct accounts dashboard showing profile details, mandal regions, and status switches.
*   **CRM & Lead Management**: Pipeline stages scheduler with call and text integration buttons.

### 💰 4. Transactions Desk
*   **Order Monitoring**: Real-time receipt tracking illustrating purchase amounts, delivery mandals, and return/refund approvals.
*   **Wallet**: Displays cash ledgers categorized into MLM splits, Referral bonuses, and Franchise sales.
*   **Commission Center**: Interactive slider calculator estimating commissions based on tier volumes.
*   **Withdrawals**: Wallet payout portal authorizing transfers to verified bank accounts.
*   **KYC Verification**: Secure workspace to verify Aadhaar, PAN card, and GST certifications.

### 📢 5. Marketing & Ads Desk
*   **Marketing Management**: Discount campaign creator setting scopes (Mandal-wide, District-wide, State-wide).
*   **Advertisement Management**: Banners catalog to publish featured campaigns in specific regional zones.

### 🏆 6. Achievements Desk
*   **Performance Center**: Dynamic timelines tracking milestone unlockables, badges, and targets.
*   **Leaderboards**: Regional ranking cards identifying top performers.
*   **Training Center**: Digital library with course checklists and quiz configurations.

### 🛡️ 7. Security & Help Desk
*   **Support Center**: Knowledge base FAQs and helpdesk tickets submitter.
*   **Reports & Analytics**: Quick export dashboard (PDF, Excel, CSV) with mock download delay screens.
*   **Security Settings**: Controls to change passwords, configure 2FA, and review device logs.

---

## 💼 Detailed Module Guide (Entrepreneur Portal)

When logged in under the **Entrepreneur perspective**, the workspace shifts to an independent suite:

*   **My Dashboard**: Personalized metrics highlighting active performance scores (out of 100), targets progression, and wallet balances.
*   **My Leads**: Localized lead generator where entrepreneurs can manually add potential clients, trigger quick simulator calls, or check conversion paths.
*   **Acquisition Desks**: Detailed pipelines specifically configured to track targets for Vendor, Customer, Service Provider, and Franchise acquisitions.
*   **Commissions Breakdown**: A pie-chart illustrating income splits across MLM downlines, referral bonuses, and acquisitions.
*   **Training & Exams**: Quizzes workspace where entrepreneurs take exams to unlock higher status levels (Bronze, Silver, Gold, Platinum).
*   **Referral Center**: Dashboard showing personal referral codes and tracking L1 signup chains.
*   **Support Desk**: Direct connection to support channels and tracking personal dispute tickets.

---

## ⚙️ How to Setup & Run

### Prerequisites
Make sure you have Node.js installed on your system.

### 1. Install Dependencies
Run the following command in the project root:
```bash
npm install
```

### 2. Start Local Development Server
Launch the hot-reloading development environment:
```bash
npm run dev
```
Open your browser and navigate to the displayed URL (usually `http://localhost:5173/`).

### 3. Production Build
Verify that compilation compiles cleanly under production packaging rules:
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.
#   A P E X B E E F R A N C H S E R  
 