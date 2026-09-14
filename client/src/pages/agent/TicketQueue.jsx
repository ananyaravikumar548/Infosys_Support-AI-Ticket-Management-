import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/auth';
import { PriorityBadge } from '../../components/common/Badge';
import { FiSearch, FiDatabase } from 'react-icons/fi';

import MasterDataModal from "../../components/MasterDataModal";

export default function TicketQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tickets/');
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setTickets(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Field helpers
  const getTicketId = (t) => (t?._id ?? t?.id ?? t?.ticket_number ?? '').toString();
  const getSubject = (t) => t?.title ?? t?.subject ?? '';
  const getCustomer = (t) => t?.customer_id ?? t?.customer ?? t?.created_by ?? '—';
  const getCategory = (t) => t?.category ?? 'General';
  const getPriority = (t) => t?.priority ?? 'MEDIUM';
  const getStatus = (t) => t?.status ?? 'OPEN';

  // Shorten Mongo ObjectId (e.g. "6a74a49aaf4765b68e24ea92" -> "#24EA92")
  const formatShortId = (rawId) => {
    if (!rawId) return '—';
    if (rawId.length >= 12) {
      return `#${rawId.slice(-6).toUpperCase()}`;
    }
    return rawId.startsWith('#') ? rawId : `#${rawId}`;
  };

  // Extract or calculate SLA timestamp safely
  const getSlaDueDate = (t) => {
    if (t?.sla_due_at || t?.slaDueAt || t?.sla_due_date) {
      return t.sla_due_at || t.slaDueAt || t.sla_due_date;
    }

    let createdAt = t?.created_at ? new Date(t.created_at) : null;
    const mongoId = t?._id ?? t?.id;

    if (!createdAt && mongoId && typeof mongoId === 'string' && mongoId.length === 24) {
      createdAt = new Date(parseInt(mongoId.substring(0, 8), 16) * 1000);
    }

    if (!createdAt || isNaN(createdAt.getTime())) return null;

    const priorityHours = {
      P1: 2,
      P2: 4,
      P3: 8,
      P4: 24,
    };

    const priority = t?.priority ?? 'P3';
    const hoursToAdd = priorityHours[priority] || 8;

    return new Date(createdAt.getTime() + hoursToAdd * 60 * 60 * 1000).toISOString();
  };

  // Render SLA Badge with dynamic countdown & warning colors
  const renderSLA = (ticket) => {
    const status = getStatus(ticket);

    if (status === 'RESOLVED' || status === 'AI_RESOLVED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
          Resolved
        </span>
      );
    }

    const rawDueAt = getSlaDueDate(ticket);

    if (!rawDueAt && (ticket?.slaTimeRemaining || ticket?.sla)) {
      return <span className="text-slate-600 whitespace-nowrap">{ticket.slaTimeRemaining || ticket.sla}</span>;
    }

    if (!rawDueAt) return <span className="text-slate-400">—</span>;

    const dueDate = new Date(rawDueAt);
    const now = new Date();

    if (isNaN(dueDate.getTime())) {
      return <span className="text-slate-500 whitespace-nowrap">{rawDueAt}</span>;
    }

    const diffMs = dueDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      const breachedMins = Math.abs(Math.floor(diffMs / (1000 * 60)));
      const hours = Math.floor(breachedMins / 60);
      const mins = breachedMins % 60;
      const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
          Breached ({timeStr} ago)
        </span>
      );
    }

    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    if (totalMins <= 60) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300 animate-pulse whitespace-nowrap">
          {timeStr} remaining
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
        {timeStr} left
      </span>
    );
  };

  const filteredTickets = useMemo(() => {
    let list = [...tickets];

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const id = getTicketId(t).toLowerCase();
        const subject = getSubject(t).toLowerCase();
        const customer = (getCustomer(t) ?? '').toString().toLowerCase();
        const category = (t?.category ?? '').toString().toLowerCase();
        return id.includes(q) || subject.includes(q) || customer.includes(q) || category.includes(q);
      });
    }

    return list.sort((a, b) => {
      if (a.status === 'RESOLVED' || a.status === 'AI_RESOLVED') return 1;
      if (b.status === 'RESOLVED' || b.status === 'AI_RESOLVED') return -1;

      const dateA = getSlaDueDate(a) ? new Date(getSlaDueDate(a)).getTime() : Infinity;
      const dateB = getSlaDueDate(b) ? new Date(getSlaDueDate(b)).getTime() : Infinity;

      return dateA - dateB;
    });
  }, [tickets, searchTerm]);

  const updateTicketStatus = async (ticketId, nextStatus) => {
    setTickets((prev) =>
      prev.map((t) => (getTicketId(t) === ticketId ? { ...t, status: nextStatus } : t)),
    );

    try {
      await API.patch(`/tickets/${ticketId}/`, { status: nextStatus });
      toast.success('Status updated');
    } catch (err1) {
      try {
        await API.patch(`/tickets/${ticketId}`, { status: nextStatus });
        toast.success('Status updated');
      } catch (err2) {
        console.error(err2);
        toast.error('Failed to update status');
        fetchTickets();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Complete Ticket Queue</h2>
          <p className="text-xs text-slate-500">
            Filter, review, and handle active incoming support requests
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setIsMasterDataOpen(true)}
            className="flex items-center gap-1.5 whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <FiDatabase className="text-sm" />
            <span>Master Data</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-28 whitespace-nowrap">Ticket ID</th>
              <th className="py-3 px-4 min-w-[180px]">Subject</th>
              <th className="py-3 px-4 w-24 whitespace-nowrap">Customer</th>
              <th className="py-3 px-4 w-28 whitespace-nowrap">Category</th>
              <th className="py-3 px-4 w-24 whitespace-nowrap">Priority</th>
              <th className="py-3 px-4 w-32 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 w-40 text-right whitespace-nowrap">SLA Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {loading ? (
              <tr>
                <td className="py-6 px-4 text-slate-500 text-center" colSpan={7}>
                  Loading tickets…
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td className="py-6 px-4 text-slate-500 text-center" colSpan={7}>
                  No tickets found.
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => {
                const rawId = getTicketId(ticket);
                const status = getStatus(ticket);
                return (
                  <tr key={rawId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700 whitespace-nowrap" title={rawId}>
                      {formatShortId(rawId)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{getSubject(ticket)}</td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{getCustomer(ticket)}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {getCategory(ticket)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={getPriority(ticket)} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={status}
                        onChange={(e) => updateTicketStatus(rawId, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold outline-none transition-colors cursor-pointer ${
                          status === 'RESOLVED' || status === 'AI_RESOLVED'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : status === 'IN_PROGRESS' || status === 'ASSIGNED'
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : status === 'PENDING_AGENT_REVIEW' || status === 'ESCALATED' || status === 'PENDING_HUMAN_REVIEW'
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : status === 'PENDING_ASSIGNMENT'
                            ? 'border-violet-200 bg-violet-50 text-violet-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                        title="Update status"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="PENDING_ASSIGNMENT">PENDING_ASSIGNMENT</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="PENDING_AGENT_REVIEW">PENDING_AGENT_REVIEW</option>
                        <option value="AI_RESOLVED">AI_RESOLVED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="ESCALATED">ESCALATED</option>
                        <option value="PENDING_HUMAN_REVIEW">PENDING_HUMAN_REVIEW</option>
                        <option value="REOPENED">REOPENED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">{renderSLA(ticket)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <MasterDataModal
        isOpen={isMasterDataOpen}
        onClose={() => setIsMasterDataOpen(false)}
      />
    </div>
  );
}