import { useState } from 'react';
import { mockTickets } from '../../mock/tickets';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function TicketQueue() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = mockTickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Complete Ticket Queue</h2>
          <p className="text-xs text-slate-500">Filter, review, and handle active incoming support requests</p>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">SLA Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-indigo-600">{ticket.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{ticket.subject}</td>
                <td className="py-3.5 px-4 text-slate-600">{ticket.customer}</td>
                <td className="py-3.5 px-4"><PriorityBadge priority={ticket.priority} /></td>
                <td className="py-3.5 px-4"><StatusBadge status={ticket.status} /></td>
                <td className="py-3.5 px-4 text-right text-slate-500 font-medium">{ticket.slaTimeRemaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}