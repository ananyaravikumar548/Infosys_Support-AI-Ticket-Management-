import CreateTicket from './CreateTicket';
import MyTickets from './MyTickets';
import { mockTickets } from '../../mock/tickets';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { FiClock, FiCheckCircle, FiUser, FiPaperclip } from 'react-icons/fi';

export default function CustomerDashboard() {
  const activeTicket = mockTickets[0]; // #TKT-1042 from reference screenshot

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Grid: Auth Quick Status & Create Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Back Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                Q
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Support AI</h3>
                <p className="text-xs text-slate-400">Ticket Management</p>
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome Back!</h2>
            <p className="text-xs text-slate-500">Manage and view your active support requests seamlessly.</p>
          </div>
          <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-900 font-semibold">Active Support Desk Status</p>
            <p className="text-[11px] text-indigo-700 mt-1">Average Response Time: <span className="font-bold">&lt; 15 mins</span></p>
          </div>
        </div>

        {/* Create Ticket Form Card */}
        <div className="lg:col-span-2">
          <CreateTicket />
        </div>
      </div>

      {/* Middle Section: My Tickets List */}
      <MyTickets />

      {/* Bottom Section: Ticket Details Timeline & AI Insights */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <div className="flex flex-wrap justify-between items-center pb-4 mb-6 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">Ticket Details - {activeTicket.id}</h2>
            <PriorityBadge priority={activeTicket.priority} />
          </div>
          <StatusBadge status={activeTicket.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details & Timeline Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Category</p>
                <p className="font-semibold text-slate-800 mt-1">{activeTicket.category}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Created On</p>
                <p className="font-semibold text-slate-800 mt-1">{activeTicket.createdAt}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">SLA Deadline</p>
                <p className="font-semibold text-slate-800 mt-1">{activeTicket.slaDeadline}</p>
                <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5">
                  <FiClock className="w-3 h-3" /> {activeTicket.slaTimeRemaining}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Attachment</p>
                <p className="font-semibold text-indigo-600 mt-1 flex items-center gap-1 cursor-pointer hover:underline">
                  <FiPaperclip className="w-3 h-3" /> {activeTicket.attachment}
                </p>
              </div>
            </div>

            {/* Tabs for Timeline / AI Insights */}
            <div>
              <div className="flex gap-4 border-b border-slate-100 mb-6">
                <button className="pb-2 text-xs font-semibold text-indigo-600 border-b-2 border-indigo-600">
                  Timeline
                </button>
                <button className="pb-2 text-xs font-medium text-slate-400 hover:text-slate-600">
                  AI Insights
                </button>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                {activeTicket.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[31px] top-0 p-1 bg-white rounded-full border border-slate-200">
                      {event.type === 'created' && <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      {event.type === 'ai' && <span className="w-3.5 h-3.5 text-[10px] font-bold text-amber-500 flex items-center justify-center">⚡</span>}
                      {event.type === 'assignment' && <FiUser className="w-3.5 h-3.5 text-indigo-500" />}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">{event.timestamp}</span>
                      <h4 className="text-xs font-bold text-slate-800 mt-0.5">{event.title}</h4>
                      {event.description && <p className="text-xs text-slate-500 mt-1">{event.description}</p>}
                      {event.category && (
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            Category: {event.category}
                          </span>
                          <PriorityBadge priority={event.priority} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights Right Panel */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Insights</h3>
            
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Predicted Category</p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">{activeTicket.aiInsights.predictedCategory}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium">Predicted Priority</p>
              <div className="mt-1">
                <PriorityBadge priority={activeTicket.aiInsights.predictedPriority} />
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium mb-1">AI Suggested Response</p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed shadow-sm">
                "{activeTicket.aiInsights.suggestedResponse}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}