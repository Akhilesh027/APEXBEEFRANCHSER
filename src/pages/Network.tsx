import React, { useEffect, useState } from "react";
import { NetworkTree } from "../components/NetworkTree";
import { Network, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const API = "https://server.apexbee.in/api";

export const NetworkPage: React.FC = () => {
  const [networkData, setNetworkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token =
    localStorage.getItem("token") || localStorage.getItem("adminToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API}/franchise/network`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch network data");
      }

      setNetworkData(data.network || data);
    } catch (error: any) {
      console.error("Network fetch error:", error);
      setErrorMsg(error.message || "Backend network fetch failed");
      setNetworkData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-dark-card rounded-3xl text-center text-xs text-slate-400">
        Loading backend franchise network...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
            <Network size={28} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              Franchise Hierarchy Visualizer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Backend hierarchy from State Franchise to District, Mandal and Vendors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40">
          <Activity size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Backend Live Sync
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {networkData ? (
        <NetworkTree data={networkData} />
      ) : (
        <div className="p-8 bg-white dark:bg-dark-card rounded-3xl text-center text-xs text-slate-400">
          No backend network data found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg space-y-2">
          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
            Backend Hierarchy
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            State franchise owns all assigned districts, mandals and pincodes. District franchise owns its child mandals and pincodes.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg space-y-2">
          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
            Assignment Rule
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When a state territory is assigned, all child district, mandal and pincode territories are assigned automatically.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg space-y-2">
          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
            Live Data Only
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This page uses only backend response from <b>/api/franchise/network</b>. No static or mock hierarchy data is used.
          </p>
        </div>
      </div>
    </motion.div>
  );
};