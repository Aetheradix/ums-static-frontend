import { useState } from 'react';
import { FormCard, FormPage, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList, TextArea } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import type { NotificationKind } from '../../types';
import { BRANCHES, DEFAULT_MATRIX } from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { formatDateTime, toRoman } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const CATEGORIES: { value: NotificationKind; label: string }[] = [
  { value: 'info', label: 'General Announcement' },
  { value: 'deadline', label: 'Academic Deadline' },
  { value: 'exam', label: 'Examination Update' },
  { value: 'result', label: 'Results Broadcast' },
  { value: 'fee', label: 'Fees Notice' },
];

export default function AdminAnnouncements() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const broadcast = useLifecycleStore(s => s.broadcast);
  const notifications = useLifecycleStore(s => s.notifications);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [kind, setKind] = useState<NotificationKind>('info');
  const [branch, setBranch] = useState('all');
  const [sem, setSem] = useState('all');

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canSend = perms.includes('announcements.send');

  if (!canSend) {
    return (
      <FormPage
        title="Broadcast Announcements"
        description="Access Denied. You do not have permissions to broadcast announcements."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const sentList = notifications.filter(n => n.id.startsWith('bc-'));

  const handleBroadcast = () => {
    if (!title.trim() || !message.trim()) {
      ToastService.error(
        'Please enter a valid title and notice description.',
        'Missing Fields'
      );
      return;
    }
    const targetString =
      branch === 'all' && sem === 'all'
        ? ''
        : ` [${branch === 'all' ? 'All Branches' : branch}${sem === 'all' ? '' : ` · Semester ${toRoman(Number(sem))}`}]`;

    broadcast({
      title: title.trim(),
      message: message.trim() + targetString,
      kind,
    });
    ToastService.success('Announcement broadcasted to active student portals.');
    setTitle('');
    setMessage('');
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Announcements Bulletin' },
  ];

  const gridColumns = [
    {
      field: 'title',
      header: 'Announcement & Notice Details',
      cell: (n: (typeof sentList)[0]) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-700 border border-blue-100 dark:border-blue-900/30">
              {n.kind}
            </span>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {n.title}
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
            {n.message}
          </p>
        </div>
      ),
    },
    {
      field: 'date',
      header: 'Broadcast Time',
      sortable: true,
      cell: (n: (typeof sentList)[0]) => (
        <span className="text-[10px] font-bold text-slate-400 font-mono">
          {formatDateTime(n.date)}
        </span>
      ),
    },
  ];

  const branchOptions = [
    { text: 'All Branches', value: 'all' },
    ...BRANCHES.map(b => ({ text: b.code, value: b.code })),
  ];

  const semesterOptions = [
    { text: 'All Semesters', value: 'all' },
    ...Array.from({ length: 8 }, (_, i) => i + 1).map(n => ({
      text: `Semester ${toRoman(n)}`,
      value: String(n),
    })),
  ];

  return (
    <FormPage
      title="Announcements Bulletin"
      description="Broadcast official announcements and notifications targeted to specific semester classes and engineering branches."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 lg:grid-cols-2 w-full">
        {/* Compose Form */}
        <FormCard title="Compose Broadcast">
          <div className="flex flex-col gap-4">
            <FormGrid columns={1}>
              <TextBox
                label="Announcement Title *"
                value={title}
                onChange={val => setTitle(val ?? '')}
                placeholder="e.g. CBCS Mid-Semester Test-I schedule"
              />
            </FormGrid>

            <FormGrid columns={1}>
              <TextArea
                label="Notice Details *"
                value={message}
                onChange={val => setMessage(val ?? '')}
                placeholder="Details of the announcement that students will view in their dashboard feeds..."
              />
            </FormGrid>

            <FormGrid columns={3}>
              <DropDownList
                label="Category"
                value={kind}
                data={CATEGORIES.map(c => ({ text: c.label, value: c.value }))}
                textField="text"
                valueField="value"
                onChange={val => setKind(val as any)}
              />

              <DropDownList
                label="Branch Target"
                value={branch}
                data={branchOptions}
                textField="text"
                valueField="value"
                onChange={val => setBranch(val as string)}
              />

              <DropDownList
                label="Sem Target"
                value={sem}
                data={semesterOptions}
                textField="text"
                valueField="value"
                onChange={val => setSem(val as string)}
              />
            </FormGrid>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleBroadcast}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:-translate-y-px active:translate-y-0 flex items-center gap-1.5"
              >
                <Icon name="send" className="text-xs" />
                <span>Broadcast Notice</span>
              </button>
            </div>
          </div>
        </FormCard>

        {/* History of broadcasts */}
        <FormCard
          title="Broadcasts History (Current Session)"
          className="p-0 overflow-hidden"
        >
          <GridPanel
            data={sentList}
            dataKey="id"
            emptyMessage="No notices have been sent out in the current session."
            columns={gridColumns as any}
            scrollHeight="320px"
            scrollable
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
