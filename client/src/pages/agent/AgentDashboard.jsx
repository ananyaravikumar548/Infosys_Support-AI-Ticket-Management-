import { useState } from 'react';
import { mockTickets } from '../../mock/tickets';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/common/Badge';
import {
  FiSearch,
  FiPaperclip,
  FiSend,
  FiSmile,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

function ShellCard({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-[11px] border border-[#dfe5e1] bg-white ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between border-b border-[#dfe5e1] px-4 py-3">
          <h3 className="text-[13.5px] font-bold text-[#1c2430]">{title}</h3>
          {right ? <div>{right}</div> : null}
        </div>
      )}
      <div className={title || right ? "p-4" : ""}>{children}</div>
    </div>
  );
}

export default function AgentDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);
  const [replyMessage, setReplyMessage] = useState('');

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    toast.success('Response sent to customer!');
    setReplyMessage('');
  };

  const handleApplyAiResponse = () => {
    if (selectedTicket?.aiInsights?.suggestedResponse) {
      setReplyMessage(selectedTicket.aiInsights.suggestedResponse);
      toast.info('AI suggested response applied');
    }
  };

  const openCount = mockTickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = mockTickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = mockTickets.filter((t) => t.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#f4f6f5]">
      <div className="flex min-h-screen flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#dfe5e1] bg-white px-[22px] py-[13px]">
          <div>
            <div className="text-[11px] text-[#8b95a1]">Tickets / Queue</div>
            <h1 className="text-[17px] font-bold tracking-tight text-[#1c2430]">
              My queue
            </h1>
          </div>

          <label className="relative hidden w-64 sm:block">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b95a1]" />
            <input
              type="text"
              placeholder="Ticket no, subject, requester..."
              className="w-full rounded-[7px] border border-[#dfe5e1] bg-white py-2 pl-9 pr-3 text-[11.5px] outline-none focus:border-[#1f7a45]"
            />
          </label>
        </div>

        <div className="flex-1 space-y-4 overflow-auto p-[22px]">
          {/* Info note like template */}
          <div className="rounded-r-[9px] rounded-l-[2px] border border-[#d6f5df] border-l-[3px] border-l-[#1f7a45] bg-[#eef4ef] px-4 py-3">
            <div className="text-[12px] font-bold text-[#14532d]">
              Ordered by time-to-breach, not by creation date
            </div>
            <div className="mt-1 text-[11.5px] leading-5 text-[#4b5563]">
              A P1 raised five minutes ago outranks a P4 raised yesterday. This keeps SLA performance honest.
            </div>
          </div>

          {/* KPI tiles */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { k: 'Total assigned', v: mockTickets.length, d: '↑ 12% vs yesterday', up: true },
              { k: 'Open tickets', v: openCount, d: '↑ 8% vs yesterday', up: true },
              { k: 'In progress', v: inProgressCount, d: '5 in your queue' },
              { k: 'Resolved today', v: resolvedCount, d: '↑ 14% vs yesterday', up: true },
            ].map(({ k, v, d, up }) => (
              <div key={k} className="rounded-[11px] border border-[#dfe5e1] bg-white p-3.5">
                <div className="text-[10.5px] font-semibold text-[#8b95a1]">{k}</div>
                <div className="my-1 text-[24px] font-extrabold tracking-tight text-[#1c2430]">{v}</div>
                <div className={`text-[10.5px] font-semibold ${up ? 'text-[#15803d]' : 'text-[#8b95a1]'}`}>
                  {d}
                </div>
              </div>
            ))}
          </div>

          {/* Ticket queue table */}
          <div className="rounded-[11px] border border-[#dfe5e1] bg-white">
            <div className="flex items-center justify-between border-b border-[#dfe5e1] px-4 py-3">
              <h3 className="text-[13.5px] font-bold text-[#1c2430]">Ticket queue</h3>

              <div className="flex gap-2">
                <select className="rounded-[7px] border border-[#dfe5e1] bg-white px-2.5 py-1.5 text-[11.5px] text-[#1c2430]">
                  <option>All categories</option>
                  <option>Billing</option>
                  <option>Technical</option>
                  <option>Account</option>
                </select>

                <select className="rounded-[7px] border border-[#dfe5e1] bg-white px-2.5 py-1.5 text-[11.5px] text-[#1c2430]">
                  <option>All priorities</option>
                  <option>P1</option>
                  <option>P2</option>
                  <option>P3</option>
                  <option>P4</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-[12px]">
                <thead className="bg-[#f8faf9]">
                  <tr className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-[#4b5563]">
                    <th className="px-4 py-2.5">Ticket</th>
                    <th className="px-3 py-2.5">Subject</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Pri</th>
                    <th className="px-3 py-2.5">SLA</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {mockTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`cursor-pointer border-b border-[#eef2f0] transition hover:bg-[#fafbfa] ${
                        selectedTicket?.id === ticket.id ? 'bg-[#eef4ef]/70' : ''
                      } ${
                        index === 0 ? 'bg-[#fffbeb]' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-[#1c2430]">
                        {ticket.id}
                      </td>

                      <td className="max-w-[260px] px-3 py-3">
                        <div className="truncate font-semibold text-[#1c2430]">
                          {ticket.subject}
                        </div>
                        <div className="mt-0.5 text-[10.5px] text-[#8b95a1]">
                          {ticket.customer}
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <CategoryTag category={ticket.category} />
                      </td>

                      <td className="px-3 py-3">
                        <PriorityBadge priority={ticket.priority} />
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-[5px] w-[52px] overflow-hidden rounded-full bg-[#eef2f0]">
                            <div
                              className="h-full rounded-full bg-[#15803d]"
                              style={{ width: '40%' }}
                            />
                          </div>
                          <span className="font-mono text-[10.5px] font-bold">
                            {ticket.slaTimeRemaining}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <StatusBadge status={ticket.status} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                          className="rounded-[7px] border border-[#dfe5e1] bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-[#1c2430] hover:border-[#1f7a45]"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#dfe5e1] px-4 py-3">
              <span className="text-[11.5px] text-[#8b95a1]">
                Showing {mockTickets.length} tickets
              </span>
              <div className="flex gap-2">
                <button className="rounded-[7px] border border-[#dfe5e1] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-[#1c2430]">
                  ← Prev
                </button>
                <button className="rounded-[7px] border border-[#dfe5e1] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-[#1c2430]">
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Selected ticket detail */}
          {selectedTicket && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                <ShellCard
                  title="Ticket"
                  right={
                    <div className="flex gap-2">
                      <StatusBadge status={selectedTicket.status} />
                      <PriorityBadge priority={selectedTicket.priority} />
                    </div>
                  }
                >
                  <div className="grid gap-4 text-[12.5px]">
                    <div className="grid grid-cols-2 gap-4 border-b border-[#eef2f0] pb-4">
                      <div>
                        <div className="text-[10.5px] text-[#8b95a1]">Ticket ID</div>
                        <div className="mt-1 font-mono font-bold text-[#1c2430]">
                          {selectedTicket.id}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10.5px] text-[#8b95a1]">Category</div>
                        <div className="mt-1">
                          <CategoryTag category={selectedTicket.category} />
                        </div>
                      </div>

                      <div>
                        <div className="text-[10.5px] text-[#8b95a1]">Customer</div>
                        <div className="mt-1 font-semibold text-[#1c2430]">
                          {selectedTicket.customer}
                        </div>
                        <div className="text-[10.5px] text-[#8b95a1]">
                          {selectedTicket.customerEmail}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10.5px] text-[#8b95a1]">SLA deadline</div>
                        <div className="mt-1 font-semibold text-[#1c2430]">
                          {selectedTicket.slaDeadline}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10.5px] text-[#8b95a1]">Subject</div>
                      <div className="mt-1 font-semibold text-[#1c2430]">
                        {selectedTicket.subject}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10.5px] text-[#8b95a1]">Description</div>
                      <div className="mt-1 rounded-[7px] bg-[#f8faf9] p-3 text-[12px] leading-relaxed text-[#4b5563]">
                        {selectedTicket.description}
                      </div>
                    </div>

                    {selectedTicket.attachment && (
                      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#14532d]">
                        <FiPaperclip className="h-3.5 w-3.5" />
                        {selectedTicket.attachment}
                      </div>
                    )}
                  </div>
                </ShellCard>

                <ShellCard title="Conversation">
                  <div className="space-y-3">
                    {selectedTicket.conversation?.map((msg) => (
                      <div key={msg.id}>
                        <div className="mb-1 flex items-center gap-2 text-[11px]">
                          <span className="font-bold text-[#1c2430]">{msg.sender}</span>
                          <span className="text-[#8b95a1]">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`rounded-[7px] border p-2.5 text-[12px] leading-relaxed ${
                            msg.isAi
                              ? 'border-[#a7f3d0] bg-[#f0fdf4]'
                              : 'border-[#dfe5e1] bg-[#f8faf9]'
                          }`}
                        >
                          {msg.isAi && (
                            <div className="mb-1.5 flex items-center justify-between border-b border-[#a7f3d0] pb-1.5">
                              <span className="text-[10px] font-bold uppercase text-[#15803d]">
                                AI suggested response
                              </span>
                              <button
                                onClick={handleApplyAiResponse}
                                className="rounded-[6px] bg-[#15803d] px-2 py-1 text-[10px] font-bold text-white"
                              >
                                Use response
                              </button>
                            </div>
                          )}
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendResponse} className="mt-4 border-t border-[#eef2f0] pt-4">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Add a response…"
                      rows={3}
                      className="w-full resize-none rounded-[7px] border border-[#dfe5e1] px-3 py-2 text-[12.5px] outline-none focus:border-[#1f7a45]"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex gap-1 text-[#8b95a1]">
                        <button type="button" className="rounded p-1.5 hover:bg-[#eef4ef]">
                          <FiPaperclip className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded p-1.5 hover:bg-[#eef4ef]">
                          <FiSmile className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#14532d] px-3.5 py-2 text-[11.5px] font-bold text-white hover:bg-[#0f2b1d]"
                      >
                        <FiSend className="h-3.5 w-3.5" />
                        Send response
                      </button>
                    </div>
                  </form>
                </ShellCard>
              </div>

              {/* Right sidebar panel */}
              <div className="space-y-3">
                <ShellCard title="AI classification">
                  <div className="space-y-2 text-[11.5px]">
                    <div className="flex justify-between border-b border-dashed border-[#eef2f0] py-2">
                      <span className="text-[#4b5563]">Category</span>
                      <span className="font-bold">
                        {selectedTicket.aiInsights?.predictedCategory || selectedTicket.category}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-dashed border-[#eef2f0] py-2">
                      <span className="text-[#4b5563]">Priority</span>
                      <PriorityBadge
                        priority={selectedTicket.aiInsights?.predictedPriority || selectedTicket.priority}
                      />
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#4b5563]">Path</span>
                      <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#475569]">
                        FAST
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2">
                    <div className="flex justify-between text-[11.5px]">
                      <span className="text-[#8b95a1]">Confidence</span>
                      <span className="font-extrabold text-[#15803d]">
                        {selectedTicket.aiInsights?.confidence || '92%'}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eef2f0]">
                      <div
                        className="h-full rounded-full bg-[#1f7a45]"
                        style={{ width: selectedTicket.aiInsights?.confidence || '92%' }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-[10.5px] leading-5 text-[#8b95a1]">
                    Corrections to AI labels help improve future classification quality.
                  </div>
                </ShellCard>

                <ShellCard
                  title="SLA"
                  right={<StatusBadge status={selectedTicket.status} />}
                >
                  <div className="text-center">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-[#1f7a45] border-t-amber-400">
                      <div>
                        <div className="text-xs font-bold text-[#1c2430]">
                          {selectedTicket.slaTimeRemaining}
                        </div>
                        <div className="text-[9px] text-[#8b95a1]">remaining</div>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-[#4b5563]">
                      Deadline: <span className="font-semibold">{selectedTicket.slaDeadline}</span>
                    </p>
                  </div>
                </ShellCard>

                {selectedTicket.aiInsights?.similarTickets?.length > 0 && (
                  <ShellCard title="Similar tickets">
                    <div className="space-y-1.5">
                      {selectedTicket.aiInsights.similarTickets.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between rounded-[7px] bg-[#f8faf9] px-2.5 py-2 text-[11px]"
                        >
                          <span className="font-mono font-bold text-[#14532d]">{st.id}</span>
                          <StatusBadge status={st.status} />
                        </div>
                      ))}
                    </div>
                  </ShellCard>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}