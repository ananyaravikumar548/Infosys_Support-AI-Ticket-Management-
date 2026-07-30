import { useState } from 'react';
import { mockTickets } from '../../mock/tickets';
import StatCard from '../../components/cards/StatCard';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { FiInbox, FiClock, FiAlertCircle, FiPaperclip, FiSend, FiPaperclip as FiAttachIcon, FiSmile, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AgentDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);
  const [replyMessage, setReplyMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Conversation');

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    
    toast.success('Response sent to customer!');
    setReplyMessage('');
  };

  const handleApplyAiResponse = () => {
    if (selectedTicket?.aiInsights?.suggestedResponse) {
      setReplyMessage(selectedTicket.aiInsights.suggestedResponse);
      toast.info('AI Suggested response applied to chat');
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value="128" change="12%" isPositive={true} icon={FiInbox} />
        <StatCard title="Open Tickets" value="42" change="8%" isPositive={true} icon={FiClock} />
        <StatCard title="High Priority" value="18" change="5%" isPositive={false} icon={FiAlertCircle} />
        <StatCard title="SLA Breaches" value="5" change="2%" isPositive={false} icon={FiClock} />
      </div>

      {/* 2. Ticket Queue Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-bold text-slate-800">Ticket Queue</h2>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-600 focus:outline-none">
              <option>All Categories</option>
              <option>Billing</option>
              <option>Technical</option>
              <option>Account</option>
            </select>
            <select className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-600 focus:outline-none">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-600 focus:outline-none">
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {mockTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`hover:bg-indigo-50/40 transition-colors cursor-pointer ${
                    selectedTicket?.id === ticket.id ? 'bg-indigo-50/70 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-indigo-600 font-semibold">{ticket.id}</td>
                  <td className="py-3 px-3 text-slate-800">{ticket.subject}</td>
                  <td className="py-3 px-3 text-slate-600">{ticket.customer}</td>
                  <td className="py-3 px-3"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="py-3 px-3"><StatusBadge status={ticket.status} /></td>
                  <td className="py-3 px-3 text-right font-medium text-slate-600">{ticket.slaTimeRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Ticket Details + Conversation + AI Panel 3-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ticket Details */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-soft space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Ticket Details</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-indigo-600">{selectedTicket.id}</span>
                <PriorityBadge priority={selectedTicket.priority} />
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Subject</p>
              <p className="font-semibold text-slate-800 mt-0.5">{selectedTicket.subject}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Customer</p>
              <p className="font-semibold text-slate-800 mt-0.5">{selectedTicket.customer}</p>
              <p className="text-[10px] text-slate-400">{selectedTicket.customerEmail}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Category</p>
              <p className="font-semibold text-slate-800 mt-0.5">{selectedTicket.category}</p>
            </div>

            <div>
              <p className="text-slate-400 font-medium">Description</p>
              <p className="text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            {selectedTicket.attachment && (
              <div>
                <p className="text-slate-400 font-medium">Attachment</p>
                <div className="flex items-center gap-1.5 text-indigo-600 mt-1 cursor-pointer hover:underline font-medium">
                  <FiPaperclip className="w-3.5 h-3.5" />
                  <span>{selectedTicket.attachment}</span>
                </div>
              </div>
            )}

            <div>
              <p className="text-slate-400 font-medium">Created</p>
              <p className="font-semibold text-slate-700 mt-0.5">{selectedTicket.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Middle Column: Conversation Thread & Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            {/* Conversation / History Tab Selector */}
            <div className="flex gap-4 border-b border-slate-100 pb-3 mb-4">
              <button 
                onClick={() => setActiveTab('Conversation')}
                className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                  activeTab === 'Conversation' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                Conversation
              </button>
              <button 
                onClick={() => setActiveTab('History')}
                className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                  activeTab === 'History' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                History
              </button>
            </div>

            {/* Chat Bubble Messages */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {selectedTicket.conversation?.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isAi ? 'items-start' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-700">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  
                  <div className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[95%] border ${
                    msg.isAi 
                      ? 'bg-indigo-50/70 border-indigo-100 text-indigo-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    {msg.isAi && (
                      <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-indigo-200/60">
                        <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase">⚡ AI Suggested Response</span>
                        <button 
                          onClick={handleApplyAiResponse}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold transition-colors shadow-sm"
                        >
                          Use This Response
                        </button>
                      </div>
                    )}
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Text area Input */}
          <form onSubmit={handleSendResponse} className="pt-3 border-t border-slate-100">
            <div className="relative">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response..."
                rows={3}
                className="w-full pl-3 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <button type="button" className="p-1 hover:text-indigo-600 transition-colors"><FiAttachIcon className="w-4 h-4" /></button>
                  <button type="button" className="p-1 hover:text-indigo-600 transition-colors"><FiSmile className="w-4 h-4" /></button>
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FiSend className="w-3 h-3" /> Send
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: AI Panel & SLA Gauge */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* AI Panel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Panel</h3>
            
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Predicted Category</p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedTicket.aiInsights?.predictedCategory || 'Billing'}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium">Predicted Priority</p>
              <div className="mt-1">
                <PriorityBadge priority={selectedTicket.aiInsights?.predictedPriority || 'High'} />
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">Similar Tickets</p>
              <div className="space-y-1.5">
                {selectedTicket.aiInsights?.similarTickets?.map((st) => (
                  <div key={st.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-mono text-indigo-600">{st.id}</span>
                    <StatusBadge status={st.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SLA Countdown Meter */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft text-center space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">SLA Countdown</h3>
            
            <div className="relative inline-flex items-center justify-center my-2">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 border-t-red-500 animate-spin-slow flex items-center justify-center">
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-800 block">2h 15m</span>
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">remaining</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Deadline: <span className="font-semibold text-slate-700">27 May, 12:30 PM</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}