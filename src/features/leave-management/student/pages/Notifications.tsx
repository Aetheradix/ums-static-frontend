import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { lmsUrls } from '../../urls';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'success', title: 'Leave Approved', message: 'Your medical leave application (LMS-2024-0003) has been approved by Prof. Vijay Reddy.', time: '2 hours ago', read: false },
  { id: '2', type: 'error', title: 'Leave Rejected', message: 'Your casual leave application was rejected. Reason: Attendance below 75%.', time: '1 day ago', read: false },
  { id: '3', type: 'info', title: 'Leave Application Submitted', message: 'Your leave application (LMS-2024-0001) has been submitted and is awaiting teacher approval.', time: '3 days ago', read: true },
  { id: '4', type: 'warning', title: 'Attendance Alert', message: 'Your attendance has dropped to 87%. Please ensure regular attendance to avoid eligibility issues.', time: '5 days ago', read: false },
  { id: '5', type: 'info', title: 'Biometric Missing', message: 'Your biometric punch out was not recorded on 15 Jun 2024. Please contact admin.', time: '1 week ago', read: true },
  { id: '6', type: 'warning', title: 'Leave Balance Low', message: 'Your Casual Leave balance is now 8 days. Plan your leaves wisely.', time: '1 week ago', read: true },
  { id: '7', type: 'success', title: 'Leave Special Approved', message: 'Your special leave for the national science competition has been approved.', time: '2 weeks ago', read: true },
];

const TYPE_STYLES: Record<string, { bg: string; border: string; iconBg: string; iconColor: string; icon: string }> = {
  success: { bg: '#f0fdf4', border: '#86efac', iconBg: '#dcfce7', iconColor: '#15803d', icon: 'check-circle' },
  error: { bg: '#fef2f2', border: '#fca5a5', iconBg: '#fee2e2', iconColor: '#b91c1c', icon: 'times-circle' },
  warning: { bg: '#fffbeb', border: '#fcd34d', iconBg: '#fef3c7', iconColor: '#b45309', icon: 'exclamation-triangle' },
  info: { bg: '#f0f9ff', border: '#93c5fd', iconBg: '#dbeafe', iconColor: '#1d4ed8', icon: 'info-circle' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <FormPage
      title="Notifications"
      description="Stay updated on your leave applications and attendance alerts."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Student Portal', to: lmsUrls.student.portal },
        { label: 'Notifications' },
      ]}
    >
      <FormCard
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        headerAction={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              {(['all', 'unread'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: filter === f ? '#3b82f6' : 'transparent', color: filter === f ? '#fff' : '#6b7280', transition: 'all 0.15s' }}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <i className="pi pi-bell" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }} />
              <p style={{ fontWeight: 600 }}>No notifications</p>
            </div>
          ) : displayed.map(notif => {
            const styles = TYPE_STYLES[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                style={{
                  display: 'flex', gap: '0.875rem', padding: '0.875rem 1rem',
                  border: `1px solid ${notif.read ? '#f3f4f6' : styles.border}`,
                  borderRadius: 10, background: notif.read ? '#f9fafb' : styles.bg,
                  cursor: 'pointer', transition: 'all 0.15s',
                  opacity: notif.read ? 0.8 : 1,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: styles.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`pi pi-${styles.icon}`} style={{ fontSize: '0.875rem', color: styles.iconColor }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                      {notif.title}
                      {!notif.read && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', marginLeft: 6, verticalAlign: 'middle' }} />}
                    </p>
                    <span style={{ fontSize: '0.688rem', color: '#9ca3af', flexShrink: 0, marginLeft: '0.5rem' }}>{notif.time}</span>
                  </div>
                  <p style={{ fontSize: '0.813rem', color: '#6b7280', lineHeight: 1.5 }}>{notif.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </FormCard>
    </FormPage>
  );
}
