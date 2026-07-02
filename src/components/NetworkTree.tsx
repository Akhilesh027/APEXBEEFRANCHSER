import React, { useEffect, useMemo, useState } from "react";
import {
  Network,
  ChevronRight,
  ChevronDown,
  Building,
  MapPin,
  Store,
  ArrowRight,
  Activity,
  Globe,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NodeItem {
  id: string;
  name: string;
  type: "franchise" | "state" | "district" | "mandal" | "pincode" | "entrepreneur";
  ownerName?: string;
  status?: string;
  franchiseCode?: string;
  email?: string;
  mobile?: string;
  children?: NodeItem[];
}

const API = "https://server.apexbee.in/api";

export const NetworkTree: React.FC<{ data?: any }> = ({ data }) => {
  const [backendData, setBackendData] = useState<any>(data || null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState("");
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const normalize = (v?: string) => (v || "").trim().toLowerCase();

  const fetchNetwork = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/franchise/network`, { headers });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to fetch network");

      setBackendData(result.network || result);
    } catch (err: any) {
      setError(err.message || "Network backend error");
      setBackendData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setBackendData(data);
      setLoading(false);
    } else {
      fetchNetwork();
    }
  }, [data]);

  const getLevel = (t: any) => {
    if (t.level) return t.level;
    if (t.pincode) return "Pincode";
    if (t.mandal) return "Mandal";
    if (t.district) return "District";
    return "State";
  };

  const getName = (t: any) => {
    if (t.name) return t.name;
    if (t.pincode) return t.pincode;
    if (t.mandal) return t.mandal;
    if (t.district) return t.district;
    return t.state || "Territory";
  };

  const tree = useMemo(() => {
    if (!backendData) return null;

    const territories = Array.isArray(backendData.territories)
      ? backendData.territories
      : [];

    const root: NodeItem = {
      id: String(backendData.id || backendData._id || "root"),
      name: backendData.title || backendData.businessName || backendData.ownerName || "Franchise",
      type: "franchise",
      ownerName: backendData.ownerName,
      status: backendData.status,
      franchiseCode: backendData.franchiseCode,
      email: backendData.email,
      mobile: backendData.mobile,
      children: [],
    };

    const state = backendData.state;
    const stateNode: NodeItem = {
      id: `state-${state}`,
      name: state || "State",
      type: "state",
      status: backendData.status,
      children: [],
    };

    const districts = Array.from(
      new Set(
        territories
          .filter((t: any) => getLevel(t) === "District")
          .map((t: any) => t.district || getName(t))
          .filter(Boolean)
      )
    );

    stateNode.children = districts.map((district: any) => {
      const districtNode: NodeItem = {
        id: `district-${district}`,
        name: district,
        type: "district",
        children: [],
      };

      const mandals = Array.from(
        new Set(
          territories
            .filter(
              (t: any) =>
                getLevel(t) === "Mandal" &&
                normalize(t.district) === normalize(district)
            )
            .map((t: any) => t.mandal || getName(t))
            .filter(Boolean)
        )
      );

      districtNode.children = mandals.map((mandal: any) => {
        const mandalNode: NodeItem = {
          id: `mandal-${district}-${mandal}`,
          name: mandal,
          type: "mandal",
          children: [],
        };

        mandalNode.children = territories
          .filter(
            (t: any) =>
              getLevel(t) === "Pincode" &&
              normalize(t.district) === normalize(district) &&
              normalize(t.mandal) === normalize(mandal)
          )
          .map((pin: any) => ({
            id: String(pin.id || pin._id || pin.pincode),
            name: String(pin.pincode || getName(pin)),
            type: "pincode" as const,
            status: pin.status,
          }));

        return mandalNode;
      });

      return districtNode;
    });

    root.children = [stateNode];

    if (Array.isArray(backendData.children)) {
      root.children.push(
        ...backendData.children.map((child: any) => ({
          id: String(child.id || child._id),
          name: child.title || child.businessName || child.ownerName || "Franchise",
          type: "franchise" as const,
          ownerName: child.ownerName,
          status: child.status,
          franchiseCode: child.franchiseCode,
          email: child.email,
          mobile: child.mobile,
        }))
      );
    }

    return root;
  }, [backendData]);

  useEffect(() => {
    setSelectedNode(tree);
  }, [tree]);

  const countNodes = (node: NodeItem | null, type?: NodeItem["type"]): number => {
    if (!node) return 0;

    let count = !type || node.type === type ? 1 : 0;

    node.children?.forEach((child) => {
      count += countNodes(child, type);
    });

    return count;
  };

  const getIcon = (type: NodeItem["type"], selected = false) => {
    const cls = selected ? "text-white" : "";

    if (type === "state") return <Globe size={16} className={cls || "text-emerald-500"} />;
    if (type === "district") return <Building size={16} className={cls || "text-amber-500"} />;
    if (type === "mandal") return <MapPin size={16} className={cls || "text-indigo-500"} />;
    if (type === "pincode") return <Store size={16} className={cls || "text-rose-500"} />;
    if (type === "entrepreneur") return <Users size={16} className={cls || "text-teal-500"} />;

    return <Users size={16} className={cls || "text-primary"} />;
  };

  const TreeNodeComponent: React.FC<{ node: NodeItem; depth: number }> = ({
    node,
    depth,
  }) => {
    const [expanded, setExpanded] = useState(depth < 2);
    const hasChildren = !!node.children?.length;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div className="flex flex-col ml-6 relative">
        {depth > 0 && (
          <div className="absolute -left-4 top-0 bottom-0 border-l border-slate-200 dark:border-slate-800" />
        )}

        <div className="flex items-center gap-2 py-1.5 relative">
          {depth > 0 && (
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 border-t border-slate-200 dark:border-slate-800" />
          )}

          {hasChildren ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div
            onClick={() => setSelectedNode(node)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none ${
              isSelected
                ? "bg-primary text-white border-primary shadow-md shadow-primary/15"
                : "bg-white/70 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            }`}
          >
            {getIcon(node.type, isSelected)}

            <div className="flex flex-col">
              <span
                className={`text-xs font-bold ${
                  isSelected ? "text-white" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {node.name}
              </span>

              <span
                className={`text-[9px] uppercase font-bold leading-none mt-0.5 ${
                  isSelected ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {node.type}
                {node.franchiseCode ? ` • ${node.franchiseCode}` : ""}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {node.children!.map((child) => (
                <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 text-center text-xs text-slate-400">
        Loading backend network...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center text-xs text-red-500">
        {error}
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 text-center text-xs text-slate-400">
        No backend network data found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative flex flex-col xl:flex-row gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Network size={20} />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
              Backend Network Tree
            </h3>
            <p className="text-xs text-slate-400">
              Franchise → State → District → Mandal → Pincode
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Total Nodes
            </span>
            <span className="text-lg font-extrabold">{countNodes(tree)}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Districts
            </span>
            <span className="text-lg font-extrabold text-amber-500">
              {countNodes(tree, "district")}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Mandals
            </span>
            <span className="text-lg font-extrabold text-indigo-500">
              {countNodes(tree, "mandal")}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Pincodes
            </span>
            <span className="text-lg font-extrabold text-rose-500">
              {countNodes(tree, "pincode")}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Entrepreneurs
            </span>
            <span className="text-lg font-extrabold text-teal-500">
              {countNodes(tree, "entrepreneur")}
            </span>
          </div>
        </div>

        <div className="border border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl p-4 overflow-x-auto min-h-[350px]">
          <TreeNodeComponent node={tree} depth={0} />
        </div>
      </div>

      <div className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-slate-200/50 dark:border-slate-800/50 pt-6 xl:pt-0 xl:pl-6 shrink-0">
        {selectedNode ? (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Backend Node Details
              </span>
              <h4 className="text-xl font-extrabold mt-1">{selectedNode.name}</h4>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                  Node Type
                </span>
                <span className="text-base font-extrabold capitalize">
                  {selectedNode.type}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                  Status
                </span>
                <span className="text-base font-extrabold text-emerald-500 capitalize">
                  {selectedNode.status || "Active"}
                </span>
              </div>

              {selectedNode.franchiseCode && (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">
                    {selectedNode.type === "entrepreneur" ? "Entrepreneur Code" : "Franchise Code"}
                  </span>
                  <span className="text-base font-extrabold text-primary">
                    {selectedNode.franchiseCode}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">
                Responsible Person
              </span>

              <p className="text-sm font-bold mt-1">
                {selectedNode.ownerName || "Not Available"}
              </p>

              {selectedNode.email && (
                <p className="text-xs text-slate-500 mt-1">{selectedNode.email}</p>
              )}

              {selectedNode.mobile && (
                <p className="text-xs text-slate-500">{selectedNode.mobile}</p>
              )}
            </div>

            {selectedNode.children?.length ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Child Nodes ({selectedNode.children.length})
                </span>

                {selectedNode.children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => setSelectedNode(child)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary/30 cursor-pointer"
                  >
                    <span className="text-xs font-bold truncate">{child.name}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="capitalize">{child.type}</span>
                      <ArrowRight size={10} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Activity size={32} className="text-primary animate-pulse mb-3 mx-auto" />
            <p className="text-xs font-semibold">Select a backend node</p>
          </div>
        )}
      </div>
    </div>
  );
};