import { FormCard, FormPage } from 'shared/new-components';
import { notificationTemplates } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentDownloadsNotifications() {
  const downloads = [
    {
      name: 'Grievance Acknowledgment Letter — GRV/2026/00101',
      date: '12 Jul 2026',
      size: '84 KB',
      icon: '📄',
    },
    {
      name: 'Resolution Letter — GRV/2026/00099 (Closed)',
      date: '05 Jul 2026',
      size: '118 KB',
      icon: '📄',
    },
  ];

  const notifications = [
    {
      id: 'N1',
      message:
        'Your grievance GRV/2026/00101 has been assigned to the SCSIT Department Officer.',
      date: '12 Jul 2026 09:15 AM',
      read: false,
    },
    {
      id: 'N2',
      message:
        'Department Officer has initiated a green notesheet for GRV/2026/00102. Track status updated.',
      date: '11 Jul 2026 03:30 PM',
      read: true,
    },
    {
      id: 'N3',
      message:
        'Your grievance GRV/2026/00099 has been resolved and closed. Download the Resolution Letter.',
      date: '05 Jul 2026 11:00 AM',
      read: true,
    },
  ];

  return (
    <FormPage
      title="Downloads & Notifications"
      description="Download grievance documents and view notifications"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Downloads' },
      ]}
    >
      <FormCard title="📁 Downloadable Documents">
        <div className="space-y-3">
          {downloads.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-50 rounded border text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <p className="font-medium text-slate-700">{d.name}</p>
                  <p className="text-xs text-slate-400">
                    {d.date} · {d.size}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                Download
              </button>
            </div>
          ))}
        </div>
      </FormCard>

      <FormCard title="🔔 Recent Notifications">
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-3 rounded border text-sm ${n.read ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex justify-between items-start gap-2">
                <p
                  className={`text-sm ${n.read ? 'text-slate-600' : 'text-slate-800 font-medium'}`}
                >
                  {n.message}
                </p>
                {!n.read && (
                  <span className="text-[9px] px-2 py-0.5 bg-blue-600 text-white rounded-full whitespace-nowrap">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{n.date}</p>
            </div>
          ))}
        </div>
      </FormCard>

      <FormCard title="📢 Active Notification Events">
        <p className="text-xs text-slate-500 mb-3">
          These are the system events that trigger automatic notifications to
          you:
        </p>
        <div className="space-y-2">
          {notificationTemplates.map(t => (
            <div
              key={t.id}
              className="flex items-center justify-between p-2 rounded border bg-slate-50 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-700">{t.event}</span>
                <span className="ml-2 text-slate-400">via {t.channel}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
              >
                {t.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
