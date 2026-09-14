import { useCallback, useEffect, useState } from 'react';
import { FiChevronRight, FiMail, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchCustomerEmailLogs } from '../../services/api';
import API from '../../services/api';

const EMAIL_TYPE_STYLES = {
  TICKET_CREATED: 'bg-sky-50 text-sky-700 ring-sky-200',
  RESOLUTION: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ESCALATION: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const STATUS_STYLES = {
  SENT: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  FAILED: 'bg-rose-50 text-rose-700 ring-rose-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function CustomerEmailLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadLogs = useCallback(async () => {
    try {
      const response = await fetchCustomerEmailLogs();
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Unable to load customer email logs:', error);
      toast.error('Unable to load email logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const submitFeedback = async (accepted) => {
    if (!selectedLog) return;
    setSubmittingFeedback(true);
    try {
      await API.patch(`/tickets/${selectedLog.ticket_id}/`, accepted
        ? { status: 'RESOLVED', customer_feedback: 'ACCEPTED' }
        : { status: 'ESCALATED', customer_feedback: 'REJECTED_NEEDS_HUMAN' });
      toast.success(accepted ? 'Ticket resolved and closed. Thank you!' : 'Your ticket has been escalated to a support specialist.');
      setSelectedLog(null);
      loadLogs();
    } catch (error) {
      console.error('Email resolution feedback failed:', error);
      toast.error('Unable to submit ticket feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Email Logs</h2>
          <p className="mt-1 text-sm text-slate-500">Review every system email sent to your account.</p>
        </div>
        <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><FiMail /></span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-y border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="py-4 pl-3">Date / Time</th>
              <th className="py-4">Subject</th>
              <th className="py-4">Ticket Title / Issue</th>
              <th className="py-4">Email Type</th>
              <th className="py-4">Status</th>
              <th className="py-4 pr-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-500">Loading email logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-500">No email logs found.</td></tr>
            ) : logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="cursor-pointer text-sm transition hover:bg-emerald-50/50"
              >
                <td className="py-4 pl-3 text-xs text-slate-500">{formatDateTime(log.sent_at)}</td>
                <td className="max-w-[300px] py-4 font-semibold text-slate-800">{log.subject}</td>
                <td className="py-4">
                  <div className="max-w-[260px] truncate font-bold text-slate-800" title={log.ticket_title}>{log.ticket_title}</div>
                  <div className="mt-1 font-mono text-xs text-gray-400" title={log.ticket_id}>#{log.ticket_id}</div>
                </td>
                <td className="py-4"><Badge value={log.email_type} styles={EMAIL_TYPE_STYLES} /></td>
                <td className="py-4"><Badge value={log.status} styles={STATUS_STYLES} /></td>
                <td className="py-4 pr-3 text-right text-emerald-700"><FiChevronRight className="ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35" onClick={() => setSelectedLog(null)}>
          <aside
            className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Email details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">System email</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{selectedLog.subject}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close email details"><FiX /></button>
            </div>

            <dl className="grid gap-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-2">
              <Detail label="Ticket Title" value={selectedLog.ticket_title} />
              <Detail label="Ticket ID" value={selectedLog.ticket_id} />
              <Detail label="Date / Time" value={formatDateTime(selectedLog.sent_at)} />
              <Detail label="Email Type" value={selectedLog.email_type} />
              <Detail label="Delivery Status" value={selectedLog.status} />
            </dl>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900">Email body</h4>
              <div className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {selectedLog.body}
              </div>
              {selectedLog.email_type === 'RESOLUTION' && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button disabled={submittingFeedback} onClick={() => submitFeedback(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Accept & Close Ticket</button>
                  <button disabled={submittingFeedback} onClick={() => submitFeedback(false)} className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 disabled:opacity-60">Request Human Support / Escalate</button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function Badge({ value, styles }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[value] || 'bg-slate-50 text-slate-600 ring-slate-200'}`}>{value}</span>;
}

function Detail({ label, value }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words font-medium text-slate-700">{value}</dd></div>;
}
