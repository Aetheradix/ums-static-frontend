import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface Notification {
  id: string;
  type: 'Alert' | 'Reminder' | 'Approval' | 'Info';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 'n-1',
    type: 'Reminder',
    title: 'Milestone Upcoming: Progress Report 1 Due',
    message:
      'Progress Report 1 is due on 30 Sep 2025. Please submit your report through the portal.',
    date: '28 Jun 2026',
    read: false,
  },
  {
    id: 'n-2',
    type: 'Approval',
    title: 'Proposal Approved by Supervisor',
    message:
      'Dr. Sanjay Tanwani has approved your research proposal (V1.2). Proceed with Research Cell registration.',
    date: '15 Mar 2026',
    read: false,
  },
  {
    id: 'n-3',
    type: 'Info',
    title: 'Research Code Allocated',
    message:
      'Your URC research registration code DAVV-SCS-PHD-2025-0891 has been allocated. Save this code for all future correspondence.',
    date: '01 Jun 2026',
    read: false,
  },
  {
    id: 'n-4',
    type: 'Alert',
    title: 'Synopsis Seminar Reminder',
    message:
      'Your synopsis seminar milestone is due on 30 Sep 2026. Please coordinate with your supervisor to schedule the seminar.',
    date: '25 Jun 2026',
    read: true,
  },
  {
    id: 'n-5',
    type: 'Approval',
    title: 'Progress Report Approved',
    message:
      'Your Jul-Dec 2025 semester progress report has been approved by Dr. Sanjay Tanwani.',
    date: '15 Jan 2026',
    read: true,
  },
];

const typeColor: Record<string, string> = {
  Alert: '#ef4444',
  Reminder: '#f59e0b',
  Approval: '#22c55e',
  Info: '#3b82f6',
};
const typeIcon: Record<string, string> = {
  Alert: '⚠️',
  Reminder: '🔔',
  Approval: '✅',
  Info: 'ℹ️',
};

export default function Notifications() {
  const [list, setList] = useState<Notification[]>(initialNotifications);

  const markRead = (id: string) => {
    setList(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    ToastService.success('Notification marked as read.');
  };

  const deleteNotif = (id: string) => {
    setList(prev => prev.filter(n => n.id !== id));
    ToastService.success('Notification dismissed.');
  };

  const markAllRead = () => {
    setList(prev => prev.map(n => ({ ...n, read: true })));
    ToastService.success('All notifications marked as read.');
  };

  const unreadCount = list.filter(n => !n.read).length;

  return (
    <FormPage
      title="Notifications"
      description="View all research portal alerts, deadline reminders and approval notifications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Notifications' },
      ]}
    >
      <FormCard title={`Notifications (${unreadCount} Unread)`}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={markAllRead}
            style={{
              padding: '0.375rem 1rem',
              border: '1px solid #3b82f6',
              background: '#eff6ff',
              color: '#1e40af',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Mark All as Read
          </button>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {list.map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                gap: '0.875rem',
                padding: '1rem',
                background: n.read ? '#f9fafb' : '#fff',
                borderRadius: 10,
                border: `1px solid ${n.read ? '#e5e7eb' : typeColor[n.type]}30`,
                borderLeft: `4px solid ${typeColor[n.type]}`,
              }}
            >
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                {typeIcon[n.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 4,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        color: typeColor[n.type],
                        background: `${typeColor[n.type]}15`,
                        padding: '0.1rem 0.4rem',
                        borderRadius: 3,
                        marginBottom: 4,
                        display: 'inline-block',
                      }}
                    >
                      {n.type}
                    </span>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: n.read ? 600 : 800,
                        color: '#1f2937',
                      }}
                    >
                      {n.title}
                    </p>
                  </div>
                  {!n.read && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: typeColor[n.type],
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                  }}
                >
                  {n.message}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                    {n.date}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #22c55e',
                          background: '#f0fdf4',
                          color: '#16a34a',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteNotif(n.id)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        border: '1px solid #ef4444',
                        background: '#fff',
                        color: '#b91c1c',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: '#9ca3af',
                padding: '3rem',
                fontSize: '0.875rem',
              }}
            >
              🎉 All caught up! No notifications pending.
            </p>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
