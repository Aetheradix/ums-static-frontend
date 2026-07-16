import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { ToastService } from 'services';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

interface Message {
  id: string;
  from: 'me' | 'officer';
  name: string;
  role: string;
  text: string;
  time: string;
  read: boolean;
}

const mockThreads: Record<string, Message[]> = {
  'GRV/2026/00101': [
    {
      id: 'm1',
      from: 'officer',
      name: 'Dr. Amit Joshi',
      role: 'Dept Officer — SCSIT',
      text: 'We have received your grievance regarding examination result discrepancy. Please provide your admit card number and the subject(s) in question so we can initiate a formal check with the examination section.',
      time: '12 Jul 2026, 10:30 AM',
      read: true,
    },
    {
      id: 'm2',
      from: 'me',
      name: 'Arjun Sharma',
      role: 'Student',
      text: 'My admit card number is 2021CS0047. The discrepancy is in Advanced Java (CS-501) and Data Structures (CS-401).',
      time: '12 Jul 2026, 11:15 AM',
      read: true,
    },
    {
      id: 'm3',
      from: 'officer',
      name: 'Dr. Amit Joshi',
      role: 'Dept Officer — SCSIT',
      text: 'Thank you. The matter has been forwarded to the HoD for review. You will receive an update within 3 working days. Please track the notesheet for real-time status.',
      time: '12 Jul 2026, 02:45 PM',
      read: false,
    },
  ],
  'GRV/2026/00099': [
    {
      id: 'm4',
      from: 'officer',
      name: 'Registrar Office',
      role: 'Grievance Cell',
      text: 'Your earlier grievance regarding hostel fee refund has been reviewed and a Resolution Order has been issued. Please download the resolution letter from the Downloads section.',
      time: '05 Jul 2026, 11:00 AM',
      read: true,
    },
  ],
};

export default function StudentCommunicationCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname.includes('/teacher');
  const portalUrls = isTeacher ? grvUrls.teacher : grvUrls.student;

  const myComplaints = complaints.filter(
    c => c.complaintType === (isTeacher ? 'Teacher' : 'Student')
  );

  const [selectedTicket, setSelectedTicket] = useState<string | null>(
    myComplaints.length > 0 ? myComplaints[0].ticketNo : null
  );
  const [replyText, setReplyText] = useState('');
  const [localMessages, setLocalMessages] =
    useState<Record<string, Message[]>>(mockThreads);

  const thread = selectedTicket ? localMessages[selectedTicket] || [] : [];

  const handleSend = () => {
    if (!replyText.trim()) return;
    if (!selectedTicket) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      from: 'me',
      name: isTeacher ? 'Dr. Vivek Kumar' : 'Arjun Sharma',
      role: isTeacher ? 'Teaching Staff' : 'Student',
      text: replyText.trim(),
      time: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: true,
    };

    setLocalMessages(prev => ({
      ...prev,
      [selectedTicket]: [...(prev[selectedTicket] || []), newMsg],
    }));
    setReplyText('');
    ToastService.success('Message sent successfully!');
  };

  const unreadCount = (ticket: string) =>
    (localMessages[ticket] || []).filter(m => m.from === 'officer' && !m.read)
      .length;

  return (
    <FormPage
      title="Communication Center"
      description="Official correspondence with Grievance Cell and Department Officers"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        {
          label: isTeacher ? 'Employee Login' : 'Student Login',
          to: portalUrls.portal,
        },
        { label: 'Communication' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Back to Dashboard"
          variant="outlined"
          onClick={() => navigate(portalUrls.portal)}
        />
      </div>

      <div className="grv-alert info">
        <i className="pi pi-info-circle" />
        <div>
          <span className="font-bold">Official Channel:</span> All messages here
          are recorded on the grievance notesheet and form part of the official
          record. Do not share sensitive personal information.
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
        style={{ minHeight: '500px' }}
      >
        {/* Thread List */}
        <div className="md:col-span-1">
          <FormCard title="My Grievance Threads">
            {myComplaints.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm">No active grievances found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myComplaints.map(c => {
                  const unread = unreadCount(c.ticketNo);
                  const isActive = selectedTicket === c.ticketNo;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedTicket(c.ticketNo)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                        isActive
                          ? 'bg-blue-50 border-blue-400 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono font-bold text-blue-700 text-[11px]">
                          {c.ticketNo}
                        </span>
                        {unread > 0 && (
                          <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-slate-700 truncate">
                        {c.subject}
                      </p>
                      <p className="text-slate-400 mt-0.5">{c.category}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            c.status === 'Closed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </FormCard>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2">
          {!selectedTicket ? (
            <FormCard title="">
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <p className="text-5xl mb-4">💬</p>
                <p className="text-lg font-medium text-slate-500">
                  Select a grievance thread
                </p>
                <p className="text-sm text-slate-400">
                  Choose a complaint from the left to view messages
                </p>
              </div>
            </FormCard>
          ) : (
            <FormCard title={`Thread: ${selectedTicket}`}>
              {/* Messages */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-1">
                {thread.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="text-sm">
                      No messages yet. Start the conversation below.
                    </p>
                  </div>
                ) : (
                  thread.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs shadow-sm ${
                          msg.from === 'me'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-sm'
                        }`}
                      >
                        <div
                          className={`flex gap-2 items-center mb-1.5 ${msg.from === 'me' ? 'justify-end' : ''}`}
                        >
                          <span
                            className={`font-bold text-[11px] ${msg.from === 'me' ? 'text-blue-100' : 'text-blue-700'}`}
                          >
                            {msg.name}
                          </span>
                          <span
                            className={`text-[9px] ${msg.from === 'me' ? 'text-blue-200' : 'text-slate-400'}`}
                          >
                            · {msg.role}
                          </span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                        <p
                          className={`mt-1.5 text-[9px] ${msg.from === 'me' ? 'text-blue-200 text-right' : 'text-slate-400'}`}
                        >
                          {msg.time}
                          {msg.from === 'me' && (
                            <span className="ml-1">✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Box */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <TextArea
                      label=""
                      placeholder="Type your official reply here..."
                      value={replyText}
                      onChange={setReplyText}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[10px] text-slate-400">
                    This message will be recorded on the official notesheet.
                  </p>
                  <Button
                    label="Send Message →"
                    variant="primary"
                    onClick={handleSend}
                  />
                </div>
              </div>
            </FormCard>
          )}
        </div>
      </div>
    </FormPage>
  );
}
