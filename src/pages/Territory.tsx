import React, { useEffect, useMemo, useState } from "react";
import { useRole } from "../context/RoleContext";
import {
  Map,
  Compass,
  MapPin,
  Building,
  Globe,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const API = "https://server.apexbee.in/api";

export const TerritoryPage: React.FC = () => {
  const { partner } = useRole();

  const [franchise, setFranchise] = useState<any>(partner || null);
  const [loading, setLoading] = useState(true);
  const [territoryDetails, setTerritoryDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({});

  const token =
    localStorage.getItem("token") || localStorage.getItem("adminToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchBackendData = async () => {
    try {
      setLoading(true);

      const profileRes = await fetch(`${API}/franchise/profile`, { headers });
      const profileData = await profileRes.json();

      if (profileRes.ok && profileData.franchise) {
        setFranchise(profileData.franchise);
      } else if (partner) {
        setFranchise(partner);
      }

      // Fetch territory details
      const detailsRes = await fetch(`${API}/franchise/territory/details`, { headers });
      const detailsData = await detailsRes.json();
      if (detailsRes.ok && detailsData.success) {
        setTerritoryDetails(detailsData);
        
        // Auto-expand all districts by default for state view
        if (detailsData.level === "state" && detailsData.districts) {
          const initial: Record<string, boolean> = {};
          detailsData.districts.forEach((d: string) => {
            initial[d] = true;
          });
          setExpandedDistricts(initial);
        }
      }
    } catch (error) {
      console.error("Territory backend fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const level = territoryDetails?.level || franchise?.franchiseLevel || "state";
  const stateName = territoryDetails?.state || franchise?.state || "Telangana";

  // Filtered districts for state view
  const filteredDistricts = useMemo(() => {
    if (!territoryDetails?.districts) return [];
    if (!searchQuery) return territoryDetails.districts;
    
    return territoryDetails.districts.filter((dist: string) => {
      const distMatches = dist.toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingMandal = territoryDetails.mandals?.some(
        (m: any) => m.district === dist && m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return distMatches || hasMatchingMandal;
    });
  }, [territoryDetails, searchQuery]);

  // Filtered mandals for district view
  const filteredDistrictMandals = useMemo(() => {
    if (!territoryDetails?.mandals) return [];
    if (!searchQuery) return territoryDetails.mandals;
    return territoryDetails.mandals.filter((m: string) =>
      m.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [territoryDetails, searchQuery]);

  // Filtered entrepreneurs for mandal view
  const filteredEntrepreneurs = useMemo(() => {
    if (!territoryDetails?.entrepreneurs) return [];
    if (!searchQuery) return territoryDetails.entrepreneurs;
    return territoryDetails.entrepreneurs.filter((e: any) =>
      (e.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.mobile || e.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [territoryDetails, searchQuery]);

  const toggleDistrictExpanded = (districtName: string) => {
    setExpandedDistricts(prev => ({
      ...prev,
      [districtName]: !prev[districtName]
    }));
  };

  if (loading) {
    return (
      <div className="p-12 bg-white dark:bg-dark-card rounded-3xl text-center text-sm font-semibold text-slate-400 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col items-center justify-center gap-4">
        <Compass size={40} className="text-primary animate-spin" />
        Loading territory information from database...
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
      {/* Dynamic Render based on franchise level */}
      {level === "state" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Globe size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                  Territory Management
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                    {stateName} State Scope
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing assigned districts and mandals under {stateName}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search districts or mandals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary/50 text-slate-700 dark:text-slate-200"
                />
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  const firstMandal = territoryDetails?.mandals?.find((m: any) => m.district === e.target.value)?.name || "";
                  setSelectedMandal(firstMandal);
                }}
                className="px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="">Filter by District</option>
                {territoryDetails?.districts?.map((d: string) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Franchise Level
              </span>
              <span className="text-xl font-extrabold block capitalize mt-1 text-slate-800 dark:text-white">
                State Franchise
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Districts
              </span>
              <span className="text-xl font-extrabold block mt-1 text-amber-500">
                {territoryDetails?.districts?.length || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Mandals
              </span>
              <span className="text-xl font-extrabold block mt-1 text-indigo-500">
                {territoryDetails?.mandals?.length || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Assigned State
              </span>
              <span className="text-xl font-extrabold block mt-1 text-emerald-500">
                {stateName}
              </span>
            </div>
          </div>

          {/* District & Mandal Tree */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
              <Building size={18} className="text-primary" />
              District & Mandal Hierarchy Tree
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDistricts.map((district: string) => {
                const distMandals = territoryDetails?.mandals?.filter((m: any) => m.district === district) || [];
                const filteredMandals = distMandals.filter((m: any) => 
                  m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  district.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const isExpanded = !!expandedDistricts[district];

                return (
                  <div
                    key={district}
                    className="border border-slate-100 dark:border-slate-800/60 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleDistrictExpanded(district)}
                      className="w-full flex items-center justify-between p-4 font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-amber-500" />
                        <span>{district}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[10px]">
                          {distMandals.length} Mandals
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 space-y-2 border-t border-slate-100 dark:border-slate-800/40 bg-white dark:bg-dark-card max-h-64 overflow-y-auto">
                        {filteredMandals.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No mandals found.</p>
                        ) : (
                          filteredMandals.map((mandal: any) => (
                            <div
                              key={mandal.name}
                              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                              <MapPin size={12} className="text-indigo-500" />
                              <span className="font-semibold">{mandal.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {level === "district" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Building size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                  Territory Management
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                    {territoryDetails?.district || franchise?.district || "Hyderabad"} District Scope
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing all mandals assigned under {territoryDetails?.district || franchise?.district || "Hyderabad"} District
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search mandals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary/50 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Franchise Level
              </span>
              <span className="text-xl font-extrabold block capitalize mt-1 text-slate-800 dark:text-white">
                District Franchise
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Assigned Mandals
              </span>
              <span className="text-xl font-extrabold block mt-1 text-amber-500">
                {territoryDetails?.mandals?.length || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                State Coverage
              </span>
              <span className="text-xl font-extrabold block mt-1 text-emerald-500">
                {stateName}
              </span>
            </div>
          </div>

          {/* Mandals list */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              Covered Mandals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDistrictMandals.length === 0 ? (
                <div className="col-span-full text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs text-slate-400">
                  No mandals match your search query.
                </div>
              ) : (
                filteredDistrictMandals.map((mandalName: string) => (
                  <div
                    key={mandalName}
                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{mandalName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Active Jurisdiction</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {level === "mandal" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                  Territory Management
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                    {territoryDetails?.mandal || franchise?.mandal || "Secunderabad"} Mandal Scope
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing all registered entrepreneurs under {territoryDetails?.mandal || franchise?.mandal || "Secunderabad"} Mandal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search entrepreneurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:border-primary/50 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Franchise Level
              </span>
              <span className="text-xl font-extrabold block capitalize mt-1 text-slate-800 dark:text-white">
                Mandal Franchise
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Entrepreneurs
              </span>
              <span className="text-xl font-extrabold block mt-1 text-indigo-500">
                {territoryDetails?.entrepreneurs?.length || 0}
              </span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Location Context
              </span>
              <span className="text-base font-extrabold block mt-1 text-emerald-500 truncate">
                {stateName} / {territoryDetails?.district || franchise?.district || "Hyderabad"}
              </span>
            </div>
          </div>

          {/* Entrepreneurs List under Mandal */}
          <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl overflow-hidden">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Registered Entrepreneurs
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">
                    <th className="py-3 px-4">Entrepreneur</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4">Certification</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredEntrepreneurs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        No entrepreneurs found under this Mandal.
                      </td>
                    </tr>
                  ) : (
                    filteredEntrepreneurs.map((ent: any) => (
                      <tr key={ent._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold">
                              {ent.name ? ent.name[0].toUpperCase() : 'E'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{ent.name}</p>
                              <p className="text-[10px] text-slate-400">ID: {ent._id ? ent._id.substring(ent._id.length - 8) : 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Mail size={12} className="text-slate-400" />
                              {ent.email || 'N/A'}
                            </p>
                            <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Phone size={12} className="text-slate-400" />
                              {ent.mobile || ent.phone || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-mono">
                          {ent.joiningDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ent.certificationLevel?.toLowerCase() === 'gold' ? 'bg-amber-500/10 text-amber-600' :
                            ent.certificationLevel?.toLowerCase() === 'diamond' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-slate-500/10 text-slate-600'
                          }`}>
                            {ent.certificationLevel || 'Gold'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ent.status?.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {ent.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};