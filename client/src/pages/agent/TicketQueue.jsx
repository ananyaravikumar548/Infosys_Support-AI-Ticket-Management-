import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/auth';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { FiSearch } from 'react-icons/fi';

export default function TicketQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tickets/');
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setTickets(data);
    } catch (error) {
      // eslint-disable-next-line no-console
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
  const getPriority = (t) => t?.priority ?? 'MEDIUM';
  const getStatus = (t) => t?.status ?? 'OPEN';

  // Extract or calculate SLA timestamp safely
const getSlaDueDate = (t) => {
  // 1. If backend explicitly provided sla_due_at, use it
  if (t?.sla_due_at || t?.slaDueAt || t?.sla_due_date) {
    return t.sla_due_at || t.slaDueAt || t.sla_due_date;
  }

  // 2. Fallback: derive created time from MongoDB ObjectId (first 4 bytes are timestamp)
  let createdAt = t?.created_at ? new Date(t.created_at) : null;
  const mongoId = t?._id ?? t?.id;

  if (!createdAt && mongoId && typeof mongoId === 'string' && mongoId.length === 24) {
    createdAt = new Date(parseInt(mongoId.substring(0, 8), 16) * 1000);
  }

  if (!createdAt || isNaN(createdAt.getTime())) return null;

  // 3. Assign SLA target based on Priority (P1: 2h, P2: 4h, P3: 8h, P4: 24h)
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

    // 1. Resolved tickets freeze SLA
    if (status === 'RESOLVED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Resolved
        </span>
      );
    }

    const rawDueAt = getSlaDueDate(ticket);

    // Fallback if backend supplies a pre-formatted string (e.g. "2h remaining")
    if (!rawDueAt && (ticket?.slaTimeRemaining || ticket?.sla)) {
      return <span className="text-slate-600">{ticket.slaTimeRemaining || ticket.sla}</span>;
    }

    if (!rawDueAt) return <span className="text-slate-400">—</span>;

    const dueDate = new Date(rawDueAt);
    const now = new Date();

    if (isNaN(dueDate.getTime())) {
      return <span className="text-slate-500">{rawDueAt}</span>;
    }

    const diffMs = dueDate.getTime() - now.getTime();

    // 2. SLA Breached (Past due date)
    if (diffMs <= 0) {
      const breachedMins = Math.abs(Math.floor(diffMs / (1000 * 60)));
      const hours = Math.floor(breachedMins / 60);
      const mins = breachedMins % 60;
      const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Breached ({timeStr} ago)
        </span>
      );
    }

    // 3. Pending / Active Countdown
    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    // Urgent warning if < 1 hour to breach
    if (totalMins <= 60) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300 animate-pulse">
          {timeStr} remaining
        </span>
      );
    }

    // Standard remaining time
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
        {timeStr} left
      </span>
    );
  };

  // Filter and Sort tickets by SLA breach urgency
  const filteredTickets = useMemo(() => {
    let list = [...tickets];

    // Filter by search query
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

    // Sort by SLA Urgency: Breached & Urgent tickets float to the top
    return list.sort((a, b) => {
      // Resolved tickets always go to bottom
      if (a.status === 'RESOLVED') return 1;
      if (b.status === 'RESOLVED') return -1;

      const dateA = getSlaDueDate(a) ? new Date(getSlaDueDate(a)).getTime() : Infinity;
      const dateB = getSlaDueDate(b) ? new Date(getSlaDueDate(b)).getTime() : Infinity;

      return dateA - dateB;
    });
  }, [tickets, searchTerm]);

  const updateTicketStatus = async (ticketId, nextStatus) => {
    // Optimistic update
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
        // eslint-disable-next-line no-console
        console.error(err2);
        toast.error('Failed to update status');
        fetchTickets(); // rollback
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
            {loading ? (
              <tr>
                <td className="py-6 px-4 text-slate-500" colSpan={6}>
                  Loading tickets…
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td className="py-6 px-4 text-slate-500" colSpan={6}>
                  No tickets found.
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => {
                const id = getTicketId(ticket);
                const status = getStatus(ticket);
                return (
                  <tr key={id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">{id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{getSubject(ticket)}</td>
                    <td className="py-3.5 px-4 text-slate-600">{getCustomer(ticket)}</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={getPriority(ticket)} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                        <select
                          value={status}
                          onChange={(e) => updateTicketStatus(id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:ring-2 focus:ring-emerald-200"
                          title="Update status"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">{renderSLA(ticket)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}