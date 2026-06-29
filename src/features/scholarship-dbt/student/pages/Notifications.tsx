import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

type NType = 'All' | 'Portal' | 'Government';

interface Notification {
  id: string;
  type: NType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: string;
  color: string;
  bg: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'Portal',
    title: 'Document Verified',
    message:
      'Your income certificate has been verified by the scholarship cell. Application progressing to finance.',
    date: '29 Jun 2025, 10:00 AM',
    read: false,
    icon: 'check-circle',
    color: '#16a34a',
    bg: '#d1fae5',
  },
  {
    id: 'n2',
    type: 'Government',
    title: 'NSP Registration Alert',
    message:
      'Your application DAVV/SCH/2025/001 has been successfully registered on the National Scholarship Portal (NSP) with reference NSP2025001234.',
    date: '28 Jun 2025, 03:30 PM',
    read: false,
    icon: 'globe',
    color: '#2563eb',
    bg: '#dbeafe',
  },
  {
    id: 'n3',
    type: 'Portal',
    title: 'NPCI Seeding Confirmed',
    message:
      'Your bank account has been successfully seeded with Aadhaar. DBT transfer has been activated for your account.',
    date: '27 Jun 2025, 11:15 AM',
    read: false,
    icon: 'verified',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    id: 'n4',
    type: 'Government',
    title: 'MP Scholarship Portal Sync',
    message:
      'Your application data has been synced with the MP Scholarship Portal. Status: Under Review.',
    date: '26 Jun 2025, 09:00 AM',
    read: true,
    icon: 'sync',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    id: 'n5',
    type: 'Portal',
    title: 'Bonafide Certificate Approved',
    message:
      'Your bonafide certificate request (BON/2025/0089) has been approved and is ready for download.',
    date: '25 Jun 2025, 04:45 PM',
    read: true,
    icon: 'badge',
    color: '#0891b2',
    bg: '#cffafe',
  },
  {
    id: 'n6',
    type: 'Government',
    title: 'Scholarship Last Date Reminder',
    message:
      'Last date for MMVY scheme application is 30 Sep 2025. Complete your application before the deadline.',
    date: '24 Jun 2025, 08:00 AM',
    read: true,
    icon: 'alarm',
    color: '#b91c1c',
    bg: '#fee2e2',
  },
];

export default function StudentNotifications() {
  const [tab, setTab] = useState<NType>('All');
  const filtered =
    tab === 'All' ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.type === tab);
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <FormPage
      title="Notifications"
      description="All alerts, portal messages and government scholarship notifications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Notifications' },
      ]}
    >
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          background: '#f3f4f6',
          padding: '0.25rem',
          borderRadius: 8,
          width: 'fit-content',
          marginBottom: '1.25rem',
        }}
      >
        {(['All', 'Portal', 'Government'] as NType[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: '0.375rem 1rem',
              borderRadius: 6,
              border: 'none',
              background: tab === t ? '#fff' : 'transparent',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontSize: '0.813rem',
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            {t}{' '}
            {t === 'All' && unread > 0 && (
              <span
                style={{
                  marginLeft: '0.375rem',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 9999,
                  padding: '0.1rem 0.375rem',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                }}
              >
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      <FormCard>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {filtered.map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                gap: '0.875rem',
                padding: '0.875rem',
                borderRadius: 10,
                border: '1px solid #f3f4f6',
                background: n.read ? '#fff' : '#fafafa',
                borderLeft: n.read
                  ? '3px solid #f3f4f6'
                  : `3px solid ${n.color}`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: n.bg,
                  color: n.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i
                  className={`pi pi-${n.icon}`}
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: n.read ? 500 : 700,
                      color: '#111827',
                    }}
                  >
                    {n.title}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.375rem',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {!n.read && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: '#ef4444',
                          display: 'inline-block',
                        }}
                      />
                    )}
                    <span
                      style={{
                        padding: '0.1rem 0.5rem',
                        background: '#f3f4f6',
                        borderRadius: 4,
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        color: '#6b7280',
                      }}
                    >
                      {n.type}
                    </span>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '0.813rem',
                    color: '#6b7280',
                    marginTop: 4,
                    lineHeight: 1.5,
                  }}
                >
                  {n.message}
                </p>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginTop: '0.375rem',
                  }}
                >
                  {n.date}
                </p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="dbt-empty">
              <i className="pi pi-bell" />
              <p>No {tab} notifications found.</p>
            </div>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
