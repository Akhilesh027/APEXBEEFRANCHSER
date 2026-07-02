export interface Partner {
  id: string;
  name: string;
  role: 'state' | 'district' | 'mandal';
  region: string;
  walletBalance: number;
  revenueToday: number;
  revenueMonthly: number;
  totalOrders: number;
  totalCustomers: number;
  activeVendors: number;
  commissionEarned: number;
  pendingCommission: number;
  targetRevenue: number;
  achievedRevenue: number;
  badge: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  state?: string;
  district?: string;
  mandal?: string;
  totalServiceProviders?: number;
  totalDeliveryPartners?: number;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    upiId?: string;
  };
}

export interface NodeMetrics {
  id: string;
  name: string;
  type: 'state' | 'district' | 'mandal' | 'vendor';
  revenue: number;
  orders: number;
  growth: number;
  performance: 'high' | 'average' | 'low';
  manager: string;
  phone: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Vendor' | 'Franchise';
  subType?: 'District' | 'Mandal';
  interest: string;
  location: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted';
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  mandal: string;
  district: string;
  sales: number;
  orders: number;
  rating: number;
  status: 'Active' | 'Warning' | 'Inactive';
  revenueContribution: number;
  contactPerson: string;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface CommissionTransaction {
  id: string;
  vendorName: string;
  orderId: string;
  amount: number;
  commissionEarned: number;
  status: 'Credited' | 'Pending' | 'Withdrawn';
  date: string;
  category?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  bankAccount: string;
  requestedDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Campaign {
  id: string;
  title: string;
  code: string;
  type: 'Offer' | 'Coupon' | 'Area Promotion' | 'Festival';
  discount: string;
  status: 'Active' | 'Draft' | 'Expired';
  targetRegion: string;
  startDate: string;
  endDate: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Vendor Issue' | 'Franchise Network';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdDate: string;
  description: string;
}

export interface Entrepreneur {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo?: string;
  joiningDate: string;
  status: 'Active' | 'Pending' | 'Training' | 'Suspended';
  certificationLevel: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  certifications: string[];
  territory: string;
  state: string;
  district: string;
  mandal: string;
  village?: string;
  mentor: string;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    upiId?: string;
  };
  stateFranchiseId?: string | null;
  districtFranchiseId?: string | null;
  mandalFranchiseId?: string | null;
  parentFranchiseId?: string | null;
  walletBalance: number;
  pendingBalance: number;
  referralEarnings: number;
  leadIncentives: number;
  teamEarnings: number;
  lifetimeEarnings: number;
  vendorAcqCommission: number;
  customerAcqCommission: number;
  spAcqCommission: number;
  franchiseAcqCommission: number;
  mlmEarnings: number;
  commissionEarned: number;
  vendorLeadsGenerated: number;
  customerLeadsGenerated: number;
  spLeadsGenerated: number;
  franchiseLeadsGenerated: number;
  totalLeads: number;
  leadsConverted: number;
  vendorsAcquired: number;
  customersAcquired: number;
  spAcquired: number;
  franchisesAcquired: number;
  salesRevenue: number;
  vendorRevenue: number;
  customerRevenue: number;
  spRevenue: number;
  franchiseRevenue: number;
  vendorTarget: number;
  customerTarget: number;
  spTarget: number;
  franchiseTarget: number;
  revenueTarget: number;
  referralsCount: number;
  teamSize: number;
  teamRevenue: number;
  performanceScore: number;
  purchasePoolContribution: number;
  salesCount: number;
  interviewStatus: 'Pending' | 'Scheduled' | 'Passed' | 'Failed' | 'N/A';
  documentStatus: 'Pending' | 'Submitted' | 'Verified';
  applicationDate: string;
}

export interface EntrepreneurLead {
  id: string;
  entrepreneurId: string;
  entrepreneurName: string;
  name: string;
  phone: string;
  type: 'Vendor' | 'Customer' | 'Service Provider' | 'Franchise';
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';
  source: 'WhatsApp' | 'Referral' | 'Walk-in' | 'Social Media' | 'Cold Call';
  location: string;
  date: string;
}

export interface EntrepreneurTraining {
  id: string;
  title: string;
  category: 'Vendor Acquisition' | 'Customer Acquisition' | 'Franchise Sales' | 'Service Provider' | 'Digital Marketing' | 'Product Knowledge' | 'Business Development';
  type: 'Video' | 'Document' | 'Assessment';
  duration: string;
  status: 'Available' | 'In Progress' | 'Completed';
  progress: number;
}

export interface EntrepreneurCertExam {
  id: string;
  title: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  questions: number;
  passMark: number;
  status: 'Not Attempted' | 'In Progress' | 'Passed' | 'Failed';
  score?: number;
  renewalDate?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  category: string;
  rating: number;
  status: 'Active' | 'Pending' | 'Suspended';
  kycStatus: 'Verified' | 'Pending' | 'Failed';
  serviceRequests: number;
  revenueToday: number;
  revenueTotal: number;
  commissionPaid: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  assignedDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  rating: number;
  walletBalance: number;
  payoutTotal: number;
}

export interface OrderDetail {
  id: string;
  customerName: string;
  vendorName: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
  returnRequested: boolean;
  refundRequested: boolean;
}

export interface AdCampaign {
  id: string;
  title: string;
  vendorName: string;
  type: 'Banner' | 'Sponsored' | 'Featured';
  status: 'Active' | 'Pending' | 'Ended';
  budget: number;
  clicks: number;
  impressions: number;
}

export interface TrainingVideo {
  id: string;
  title: string;
  duration: string;
  targetRole: string;
  category: string;
  videoUrl: string;
}

export interface KYCRecord {
  id: string;
  name: string;
  type: 'Vendor' | 'Entrepreneur' | 'Service Provider' | 'Delivery Partner';
  panStatus: 'Verified' | 'Pending' | 'Rejected';
  aadhaarStatus: 'Verified' | 'Pending' | 'Rejected';
  bankStatus: 'Verified' | 'Pending' | 'Rejected';
  gstStatus: 'Verified' | 'Pending' | 'Rejected' | 'N/A';
  agreementStatus: 'Signed' | 'Pending';
}

export const emptyPartner: Partner = {
  id: '',
  name: '',
  role: 'mandal',
  region: '',
  walletBalance: 0,
  revenueToday: 0,
  revenueMonthly: 0,
  totalOrders: 0,
  totalCustomers: 0,
  activeVendors: 0,
  commissionEarned: 0,
  pendingCommission: 0,
  targetRevenue: 0,
  achievedRevenue: 0,
  badge: 'Silver',
  state: '',
  district: '',
  mandal: '',
  bankDetails: {
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    upiId: ''
  }
};
