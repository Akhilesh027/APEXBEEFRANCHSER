import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react";

interface FeeInvoice {
  _id: string;
  invoiceNumber: string;
  title: string;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "failed";
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

interface PricingItem {
  _id: string;
  serviceKey: string;
  title: string;
  description: string;
  amount: number;
  billingCycle: string;
  minAdvancePercentage?: number;
  features: string[];
}

export const PendingFranchiseFeesCard: React.FC = () => {
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [catalog, setCatalog] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const API_BASE = "https://server.apexbee.in/api";
  const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, catRes] = await Promise.all([
        fetch(`${API_BASE}/fee-pricing/my-invoices`, { headers: getAuthHeader() }),
        fetch(`${API_BASE}/fee-pricing/catalog?category=franchise`),
      ]);

      const invData = await invRes.json();
      const catData = await catRes.json();

      if (invData.success) setInvoices(invData.data);
      if (catData.success) setCatalog(catData.data);
    } catch (err) {
      console.error("Error fetching franchise fees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayFee = async (invoice: FeeInvoice) => {
    try {
      setPayingId(invoice._id);
      const res = await fetch(`${API_BASE}/fee-pricing/pay`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          invoiceId: invoice._id,
          paymentMethod: "NetBanking / UPI",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("License fee paid successfully! Territory rights active.");
        fetchData();
      } else {
        showToast(data.message || "Payment failed", "error");
      }
    } catch (err) {
      showToast("Error processing payment", "error");
    } finally {
      setPayingId(null);
    }
  };

  const pending = invoices.filter((i) => i.status === "pending");

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md border ${toastMessage.type === "success"
            ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
            : "bg-rose-950/90 border-rose-500/40 text-rose-200"
            }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Pending Invoices Notice */}
      {pending.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pending Franchise License / Territory Fee</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  An invoice of <strong>₹{pending[0].totalAmount}</strong> is due for {pending[0].title}.
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePayFee(pending[0])}
              disabled={payingId === pending[0]._id}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              {payingId === pending[0]._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Pay License Fee (₹{pending[0].totalAmount})
            </button>
          </div>
        </div>
      )}

      {/* Official Territory Pricing Quotes */}
      <div className="rounded-3xl bg-card/60 backdrop-blur-xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Official Territory License Fees (Set by Platform Admin)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live standard pricing for Mandal, District, and State franchise jurisdictions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {catalog.map((cat) => (
            <div key={cat._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {cat.serviceKey.replace(/_/g, " ")}
              </span>
              <h4 className="text-sm font-semibold text-white">{cat.title}</h4>
              <div className="text-xl font-extrabold text-white">₹{cat.amount} <span className="text-xs font-normal text-muted-foreground">/ {cat.billingCycle}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
