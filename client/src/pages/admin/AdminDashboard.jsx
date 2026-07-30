import { mockAnalytics } from '../../mock/analytics.js';
import StatCard from '../../components/cards/StatCard';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { FiUsers, FiUserCheck, FiInbox, FiCheckCircle, FiCpu, FiAlertTriangle, FiAward } from 'react-icons/fi';

export default function AdminDashboard() {
  const { systemOverview, ticketsByCategory, ticketsTrend, ticketsByPriority, topAgents, recentSlaBreaches, aiEngineStats } = mockAnalytics;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* Time Range Selector Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">System Overview</h2>
        <select className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg shadow-sm font-semibold text-slate-600 focus:outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This Month</option>
        </select>
      </div>

      {/* 1. Top Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={systemOverview.totalCustomers} change="15%" isPositive={true} icon={FiUsers} />
        <StatCard title="Total Agents" value={systemOverview.totalAgents} change="8%" isPositive={true} icon={FiUserCheck} />
        <StatCard title="Total Tickets" value={systemOverview.totalTickets} change="18%" isPositive={true} icon={FiInbox} />
        <StatCard title="Resolved Tickets" value={systemOverview.resolvedTickets} change="20%" isPositive={true} icon={FiCheckCircle} />
      </div>

      {/* 2. Middle Row: Category Donut & Trend Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tickets by Category Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tickets by Category</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketsByCategory}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ticketsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-slate-800">2,856</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Total</span>
              </div>
            </div>

            <div className="space-y-2.5 flex-1 text-xs">
              {ticketsByCategory.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets Trend Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tickets Trend</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketsTrend}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="tickets" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. SLA Compliance & Tickets by Priority Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SLA Compliance Gauge */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-2">SLA Compliance</h3>
          <div className="flex items-center justify-around py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Met', value: 92, fill: '#10B981' },
                      { name: 'Breached', value: 8, fill: '#EF4444' }
                    ]}
                    innerRadius={45}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-800">92%</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Met</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Met: <strong className="text-slate-800">92%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600">Breached: <strong className="text-slate-800">8%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets by Priority Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tickets by Priority</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketsByPriority}>
                <XAxis dataKey="priority" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ticketsByPriority.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Top Agents, Recent SLA Breaches, AI Engine Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Agents Leaderboard */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <FiAward className="text-amber-500 w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Agents by Resolved Tickets</h3>
          </div>
          <div className="divide-y divide-slate-50 text-xs">
            {topAgents.map((agent) => (
              <div key={agent.rank} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    agent.rank === 1 ? 'bg-amber-100 text-amber-700' :
                    agent.rank === 2 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {agent.rank}
                  </span>
                  <span className="font-semibold text-slate-700">{agent.name}</span>
                </div>
                <span className="font-bold text-slate-800">{agent.resolved}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent SLA Breaches */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-500 w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent SLA Breaches</h3>
          </div>
          <div className="divide-y divide-slate-50 text-xs">
            {recentSlaBreaches.map((breach) => (
              <div key={breach.id} className="py-2.5 flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-600">{breach.id}</span>
                <span className="text-slate-400 font-medium">{breach.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Engine Stats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <FiCpu className="text-emerald-600 w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Engine Stats</h3>
          </div>
          <div className="space-y-3 text-xs pt-1">
            <div>
              <p className="text-slate-400 font-medium">Total Predictions</p>
              <p className="text-lg font-bold text-slate-800 mt-0.5">{aiEngineStats.totalPredictions}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Accuracy</p>
              <p className="text-base font-bold text-emerald-600 mt-0.5">{aiEngineStats.accuracy}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div>
                <p className="text-slate-400 font-medium">Model Version</p>
                <p className="font-semibold text-slate-700 mt-0.5">{aiEngineStats.modelVersion}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Last Trained</p>
                <p className="font-semibold text-slate-700 mt-0.5">{aiEngineStats.lastTrained}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}