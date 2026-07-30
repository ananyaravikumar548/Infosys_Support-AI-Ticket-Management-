import { useState } from 'react';
import { mockTickets } from '../../mock/tickets';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredTickets = activeTab === 'All'
    ? mockTickets
    : mockTickets.filter(t => t.status === activeTab);

  const tabs = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">My Tickets</h2>
        <p className="text-xs text-slate-500">Track all your ticket status</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-3 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-semibold text-indigo-600">{ticket.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{ticket.subject}</td>
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3.5 px-4 text-right text-slate-400">{ticket.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}