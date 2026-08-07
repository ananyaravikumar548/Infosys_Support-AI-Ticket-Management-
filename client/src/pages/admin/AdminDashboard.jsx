import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/auth";

import { mockAnalytics } from "../../mock/analytics.js";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { FiUsers, FiUserCheck, FiInbox, FiCheckCircle, FiCpu } from "react-icons/fi";

export default function AdminDashboard() {
  // Backend tickets
  const [tickets, setTickets] = useState([]);

  // Ticket selected for View popup
  const [selectedTicket, setSelectedTicket] = useState(null);

  const navigate = useNavigate();

  const {
    ticketsByCategory,
    ticketsTrend,
    aiEngineStats,
  } = mockAnalytics;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await API.get("/tickets/");
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setTickets([]);
    }
  };

  const systemOverview = {
    totalCustomers: 200,
    totalAgents: 30,
    totalTickets: tickets.length,
    resolvedTickets: tickets.filter((ticket) => ticket.status === "RESOLVED").length,
  };

  // ---------- UI-only helpers (safe to keep in this file) ----------
  const Card = ({ title, right, children, className = "" }) => (
    <div className={`bg-white border border-[#dfe5e1] rounded-[12px] overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-[#dfe5e1] flex items-center justify-between">
        <h3 className="text-[13.5px] font-bold text-slate-900">{title}</h3>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  const Tag = ({ tone = "neutral", children, className = "" }) => {
    const tones = {
      neutral: "bg-slate-100 text-slate-700",
      brand: "bg-[#eef4ef] text-[#14532d]",
      ok: "bg-green-50 text-green-700",
      warn: "bg-amber-50 text-amber-700",
      danger: "bg-red-50 text-red-700",
      info: "bg-blue-50 text-blue-700",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-[10.5px] font-bold ${tones[tone]} ${className}`}
      >
        {children}
      </span>
    );
  };

  const KpiTile = ({ icon: Icon, label, value, sub, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`text-left bg-white border border-[#dfe5e1] rounded-[12px] p-4 transition
        hover:border-[#1f7a45] ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10.5px] font-bold tracking-wide uppercase text-slate-500">
            {label}
          </div>
          <div className="mt-2 text-[26px] font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
          {sub ? (
            <div className="mt-1 text-[11.5px] text-slate-500 leading-5">{sub}</div>
          ) : null}
        </div>
        <div className="h-9 w-9 rounded-[10px] bg-[#eef4ef] text-[#14532d] flex items-center justify-center border border-[#dfe5e1]">
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
    </button>
  );

  const priorityPill = (priority) => {
    // Your backend uses HIGH/MEDIUM/LOW (keeping that), just restyling
    if (priority === "HIGH") return "bg-red-50 text-red-700 border-red-200";
    if (priority === "MEDIUM") return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const statusPill = (status) => {
    if (status === "OPEN") return { tone: "info", label: "Open" };
    if (status === "RESOLVED") return { tone: "ok", label: "Resolved" };
    return { tone: "neutral", label: status };
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Shell header (like the reference top bar) */}
      <div className="bg-white border border-[#dfe5e1] rounded-[12px] px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate-500">Overview</div>
          <h2 className="text-[18px] font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* <Tag tone="brand">Milestone 1 scope</Tag> */}
          <select
            className="px-3 py-2 text-[12px] bg-white border border-[#dfe5e1] rounded-[10px]
              font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#1f7a45]/10 focus:border-[#1f7a45]"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* KPI tiles (SupportPilot style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile
          icon={FiUsers}
          label="Total Customers"
          value={systemOverview.totalCustomers}
          sub="Provisioned users"
        />
        <KpiTile
          icon={FiUserCheck}
          label="Total Agents"
          value={systemOverview.totalAgents}
          sub="Active support staff"
        />
        <KpiTile
          icon={FiInbox}
          label="Total Tickets"
          value={systemOverview.totalTickets}
          sub="All time (loaded)"
          onClick={() => navigate("/admin/tickets")}
        />
        <KpiTile
          icon={FiCheckCircle}
          label="Resolved Tickets"
          value={systemOverview.resolvedTickets}
          sub="Status = RESOLVED"
        />
      </div>

      {/* Row 1: Category + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card
          className="lg:col-span-5"
          title="Tickets by category"
          right={<Tag tone="brand">Live</Tag>}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-52 h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketsByCategory}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ticketsByCategory.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[18px] font-extrabold text-slate-900">
                  {tickets.length}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                  Total
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 text-[12px] w-full">
              {ticketsByCategory.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-7" title="Tickets trend" right={<Tag tone="neutral">Last 7 days</Tag>}>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketsTrend}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#1f7a45"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#1f7a45" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: SLA + Recent + AI stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5" title="SLA compliance" right={<Tag tone="ok">On track</Tag>}>
          <div className="flex items-center justify-around gap-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Met", value: 92, fill: "#1f7a45" },
                      { name: "Breached", value: 8, fill: "#b91c1c" },
                    ]}
                    innerRadius={52}
                    outerRadius={72}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="#1f7a45" />
                    <Cell fill="#b91c1c" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-extrabold text-slate-900">92%</span>
                <span className="text-[10px] font-bold text-[#14532d] uppercase tracking-wide">
                  Met
                </span>
              </div>
            </div>

            <div className="space-y-3 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1f7a45]" />
                <span className="text-slate-700 font-semibold">
                  Met: <span className="text-slate-900 font-extrabold">92%</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#b91c1c]" />
                <span className="text-slate-700 font-semibold">
                  Breached: <span className="text-slate-900 font-extrabold">8%</span>
                </span>
              </div>
              <div className="text-[11.5px] text-slate-500 leading-5">
                Ordered by SLA risk, not creation date.
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-5" title="Recent tickets" right={<Tag tone="neutral">{tickets.length} loaded</Tag>}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-[#dfe5e1] bg-[#f8faf9]">
                  <th className="text-left py-2.5 px-2 text-[10.5px] uppercase tracking-wide text-slate-600 font-extrabold">
                    Title
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10.5px] uppercase tracking-wide text-slate-600 font-extrabold">
                    Category
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10.5px] uppercase tracking-wide text-slate-600 font-extrabold">
                    Priority
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10.5px] uppercase tracking-wide text-slate-600 font-extrabold">
                    Status
                  </th>
                  <th className="text-left py-2.5 px-2 text-[10.5px] uppercase tracking-wide text-slate-600 font-extrabold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets
                    .slice()
                    .reverse()
                    .map((ticket) => {
                      const st = statusPill(ticket.status);
                      return (
                        <tr
                          key={ticket.id}
                          className="border-b border-[#eef2f0] hover:bg-[#fafbfa]"
                        >
                          <td className="py-3 px-2 font-semibold text-slate-900">
                            {ticket.title}
                          </td>
                          <td className="py-3 px-2 text-slate-700">{ticket.category}</td>

                          <td className="py-3 px-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full border text-[11px] font-extrabold ${priorityPill(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>

                          <td className="py-3 px-2">
                            <Tag tone={st.tone}>{st.label}</Tag>
                          </td>

                          <td className="py-3 px-2">
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="px-3 py-2 rounded-[10px] text-[12px] font-bold
                                bg-[#14532d] hover:bg-[#0f2b1d] text-white transition"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="lg:col-span-2"
          title="AI engine stats"
          right={<FiCpu className="text-[#14532d] w-4 h-4" />}
        >
          <div className="space-y-4">
            <div>
              <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                Total predictions
              </div>
              <div className="mt-1 text-[22px] font-extrabold text-slate-900">
                {aiEngineStats.totalPredictions}
              </div>
            </div>

            <div>
              <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                Accuracy
              </div>
              <div className="mt-1 text-[16px] font-extrabold text-[#14532d]">
                {aiEngineStats.accuracy}
              </div>
            </div>

            <div className="pt-3 border-t border-[#eef2f0] space-y-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                  Model version
                </div>
                <div className="mt-1 text-[12.5px] font-semibold text-slate-700">
                  {aiEngineStats.modelVersion}
                </div>
              </div>

              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                  Last trained
                </div>
                <div className="mt-1 text-[12.5px] font-semibold text-slate-700">
                  {aiEngineStats.lastTrained}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= VIEW TICKET MODAL (UI-only restyle) ================= */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#dfe5e1] rounded-[14px] shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#dfe5e1] flex justify-between items-center">
              <div>
                <div className="text-[11px] text-slate-500">Ticket</div>
                <h2 className="text-[18px] font-extrabold tracking-tight text-slate-900">
                  Ticket details
                </h2>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="h-9 w-9 rounded-[10px] border border-[#dfe5e1] text-slate-600 hover:text-red-600 hover:border-red-200 transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Title
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">{selectedTicket.title}</p>
                </div>

                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Category
                  </p>
                  <p className="mt-1 text-slate-800">{selectedTicket.category}</p>
                </div>

                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Priority
                  </p>
                  <p className="mt-1 text-slate-800">{selectedTicket.priority}</p>
                </div>

                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Status
                  </p>
                  <p className="mt-1 text-slate-800">{selectedTicket.status}</p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Description
                  </p>
                  <div className="mt-2 bg-[#f8faf9] border border-[#eef2f0] rounded-[12px] p-4 text-slate-700 leading-6">
                    {selectedTicket.description}
                  </div>
                </div>

                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Customer ID
                  </p>
                  <p className="mt-1 text-slate-800">{selectedTicket.customer_id}</p>
                </div>

                <div>
                  <p className="text-[10.5px] uppercase tracking-wide text-slate-500 font-bold">
                    Created at
                  </p>
                  <p className="mt-1 text-slate-800">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-[10px] border border-[#dfe5e1] bg-white text-slate-700 font-semibold hover:bg-[#f8faf9]"
                >
                  Cancel
                </button>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-[10px] bg-[#14532d] hover:bg-[#0f2b1d] text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}