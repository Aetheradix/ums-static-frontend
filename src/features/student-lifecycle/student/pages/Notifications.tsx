import { Link } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import type { NotificationKind } from '../../types';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { formatDateTime } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const KIND_CONFIG: Record<NotificationKind, { icon: string; bgStyle: string }> =
  {
    deadline: {
      icon: 'schedule',
      bgStyle:
        'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200',
    },
    result: {
      icon: 'emoji_events',
      bgStyle:
        'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200',
    },
    warning: {
      icon: 'warning',
      bgStyle:
        'bg-red-50 dark:bg-red-950/40 text-red-700 border border-red-200',
    },
    fee: {
      icon: 'payments',
      bgStyle:
        'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200',
    },
    exam: {
      icon: 'school',
      bgStyle:
        'bg-blue-50 dark:bg-blue-950/40 text-blue-700 border border-blue-200',
    },
    info: {
      icon: 'info',
      bgStyle:
        'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800',
    },
  };

export default function StudentNotifications() {
  const notifications = useLifecycleStore(s => s.notifications);
  const markRead = useLifecycleStore(s => s.markNotificationRead);
  const markAllRead = useLifecycleStore(s => s.markAllNotificationsRead);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    markAllRead();
    ToastService.success('All notifications marked as read.');
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Notifications' },
  ];

  const headerAction =
    unreadCount > 0 ? (
      <button
        onClick={handleMarkAllRead}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
      >
        <Icon name="check-circle" className="text-xs" />
        <span>Mark All Read</span>
      </button>
    ) : undefined;

  return (
    <FormPage
      title="Notifications Inbox"
      description={
        unreadCount
          ? `You have ${unreadCount} unread notification alerts.`
          : "You're all caught up. No unread notifications."
      }
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        <FormCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
            <Icon name="notifications" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Alerts & Broadcast Feed
            </h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <Icon
                name="notifications-off"
                className="text-slate-300 text-5xl"
              />
              <h4 className="font-bold text-slate-500 dark:text-slate-400 mt-2">
                Inbox Empty
              </h4>
              <p className="text-xs text-slate-400">
                There are no announcements currently broadcasted.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {notifications.map(n => {
                const config = KIND_CONFIG[n.kind] || KIND_CONFIG.info;

                // Map the original hrefs from /registration to Student Lifecycle local sub-paths!
                let resolvedLink = '';
                if (n.href) {
                  if (n.href.includes('registration'))
                    resolvedLink = studentLifecycleUrls.student.registration;
                  else if (n.href.includes('results'))
                    resolvedLink = studentLifecycleUrls.student.results;
                  else if (n.href.includes('fees'))
                    resolvedLink = studentLifecycleUrls.student.fees;
                  else if (n.href.includes('examinations'))
                    resolvedLink = studentLifecycleUrls.student.examinations;
                  else if (n.href.includes('profile'))
                    resolvedLink = studentLifecycleUrls.student.profile;
                  else if (n.href.includes('services'))
                    resolvedLink = studentLifecycleUrls.student.services;
                }

                const rowContent = (
                  <div className="flex items-start gap-3.5 px-5 py-4 hover:bg-slate-50 dark:bg-slate-950/30 transition-colors">
                    <span
                      className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg ${config.bgStyle}`}
                    >
                      <Icon
                        name={config.icon}
                        className="text-base font-bold"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {!n.read && (
                          <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-amber-50 dark:bg-amber-950/400 animate-pulse" />
                        )}
                        <p
                          className={`text-sm ${n.read ? 'text-slate-600 dark:text-slate-400' : 'font-bold text-slate-800 dark:text-slate-200'}`}
                        >
                          {n.title}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="mt-2 text-[10px] font-bold text-slate-400 font-mono">
                        {formatDateTime(n.date)}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <li key={n.id}>
                    {resolvedLink ? (
                      <Link
                        to={resolvedLink}
                        onClick={() => markRead(n.id)}
                        className="block"
                      >
                        {rowContent}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="block w-full text-left focus:outline-none"
                      >
                        {rowContent}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
