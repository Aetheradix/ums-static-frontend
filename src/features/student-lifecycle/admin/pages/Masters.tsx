import { useState } from 'react';
import { FormCard, FormPage, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import type { BranchCode, CalendarEvent } from '../../types';
import { BRANCHES, GRADE_SCALE, DEFAULT_MATRIX } from '../../data/domain';
import { CALENDAR } from '../../data';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { formatDate } from '../../utils';
import { GradeBadge } from '../../components';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function AdminMasters() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const extraBranches = useLifecycleStore(s => s.extraBranches);
  const addBranch = useLifecycleStore(s => s.addBranch);
  const extraEvents = useLifecycleStore(s => s.extraEvents);
  const addEvent = useLifecycleStore(s => s.addEvent);

  const [bCode, setBCode] = useState('');
  const [bName, setBName] = useState('');
  const [bIntake, setBIntake] = useState('60');

  const [eTitle, setETitle] = useState('');
  const [eDate, setEDate] = useState('');
  const [eType, setEType] = useState<CalendarEvent['type']>('exam');

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canEdit = perms.includes('masters.edit');

  if (!canEdit) {
    return (
      <FormPage
        title="Master Configuration"
        description="Access Denied. You do not have permissions to edit master data."
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

  const branches = [...BRANCHES, ...extraBranches];
  const events = [...extraEvents, ...CALENDAR];

  const handleAddBranch = () => {
    if (!bCode.trim() || !bName.trim()) {
      ToastService.error(
        'Please enter a valid branch code and name.',
        'Missing Details'
      );
      return;
    }
    addBranch({
      code: bCode.trim().toUpperCase() as BranchCode,
      name: bName.trim(),
      intake: Number(bIntake) || 0,
    });
    ToastService.success(`Branch "${bName.trim()}" successfully added.`);
    setBCode('');
    setBName('');
  };

  const handleAddEvent = () => {
    if (!eTitle.trim() || !eDate) {
      ToastService.error(
        'Please enter a valid event title and date.',
        'Missing Details'
      );
      return;
    }
    addEvent({
      id: `ev-${Date.now()}`,
      title: eTitle.trim(),
      date: eDate,
      type: eType,
    });
    ToastService.success(
      `Academic event "${eTitle.trim()}" registered in calendar.`
    );
    setETitle('');
    setEDate('');
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Master Settings' },
  ];

  const branchColumns = [
    {
      field: 'code',
      header: 'Code',
      sortable: true,
      cell: (b: (typeof branches)[0]) => (
        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
          {b.code}
        </span>
      ),
    },
    {
      field: 'name',
      header: 'Branch Name',
      sortable: true,
      cell: (b: (typeof branches)[0]) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {b.name}
        </span>
      ),
    },
    {
      field: 'intake',
      header: 'Sanctioned Seats',
      sortable: true,
      cell: (b: (typeof branches)[0]) => (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
          {b.intake}
        </span>
      ),
    },
  ];

  const eventColumns = [
    {
      field: 'title',
      header: 'Event Title',
      sortable: true,
      cell: (e: (typeof events)[0]) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            {e.title}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            {e.detail ?? formatDate(e.date)}
          </span>
        </div>
      ),
    },
    {
      field: 'type',
      header: 'Type',
      sortable: true,
      cell: (e: (typeof events)[0]) => (
        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 border border-blue-100 dark:border-blue-900/30">
          {e.type}
        </span>
      ),
    },
  ];

  const gradeScaleColumns = [
    {
      field: 'letter',
      header: 'Letter Grade',
      sortable: true,
      cell: (g: (typeof GRADE_SCALE)[0]) => <GradeBadge grade={g.letter} />,
    },
    {
      field: 'min',
      header: 'Marks Range',
      sortable: true,
      cell: (g: (typeof GRADE_SCALE)[0]) => (
        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
          {g.min} – {g.max}
        </span>
      ),
    },
    {
      field: 'point',
      header: 'Grade Points Value',
      sortable: true,
      cell: (g: (typeof GRADE_SCALE)[0]) => (
        <span className="font-mono font-black text-slate-800 dark:text-slate-200">
          {g.point}
        </span>
      ),
    },
    {
      field: 'label',
      header: 'Classification Rating',
      sortable: true,
      cell: (g: (typeof GRADE_SCALE)[0]) => (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {g.label}
        </span>
      ),
    },
  ];

  const eventTypeOptions = [
    'exam',
    'registration',
    'result',
    'fee',
    'holiday',
    'class',
    'form',
  ].map(t => ({
    text: t,
    value: t,
  }));

  return (
    <FormPage
      title="Master Configurations"
      description="Manage active academic branches, configure calendar terms schedules, and inspect CBCS grading parameters."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid gap-6 lg:grid-cols-2 w-full">
        {/* Branches list card */}
        <FormCard title="Academic Branches" className="p-0 overflow-hidden">
          <GridPanel
            data={branches}
            dataKey="code"
            emptyMessage="No branches configured."
            columns={branchColumns as any}
            scrollHeight="240px"
            scrollable
          />

          <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/20">
            <FormGrid columns={3}>
              <TextBox
                label="Branch Code"
                value={bCode}
                onChange={val => setBCode(val ?? '')}
                placeholder="CSE"
              />
              <TextBox
                label="Branch Name"
                value={bName}
                onChange={val => setBName(val ?? '')}
                placeholder="Computer Science..."
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <TextBox
                    label="Sanctioned Intake"
                    value={bIntake}
                    onChange={val => setBIntake(val ?? '')}
                    placeholder="60"
                  />
                </div>
                <button
                  onClick={handleAddBranch}
                  className="px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm h-[38px] shrink-0"
                >
                  <Icon name="add" className="text-xs" />
                  <span>Add</span>
                </button>
              </div>
            </FormGrid>
          </div>
        </FormCard>

        {/* Academic Calendar card */}
        <FormCard title="Academic Calendar" className="p-0 overflow-hidden">
          <GridPanel
            data={events}
            dataKey="id"
            emptyMessage="No calendar events loaded."
            columns={eventColumns as any}
            scrollHeight="240px"
            scrollable
          />

          <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/20">
            <FormGrid columns={3}>
              <TextBox
                label="Event Title"
                value={eTitle}
                onChange={val => setETitle(val ?? '')}
                placeholder="MST-2 Exams"
              />
              <TextBox
                label="Event Date"
                type="date"
                value={eDate}
                onChange={val => setEDate(val ?? '')}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1 select-no-label">
                  <DropDownList
                    label=""
                    value={eType}
                    data={eventTypeOptions}
                    textField="text"
                    valueField="value"
                    onChange={val => setEType(val as any)}
                  />
                </div>
                <button
                  onClick={handleAddEvent}
                  className="px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm h-[38px] shrink-0"
                >
                  <Icon name="add" className="text-xs" />
                  <span>Add</span>
                </button>
              </div>
            </FormGrid>
          </div>
        </FormCard>

        {/* CBCS Grading Parameters Card */}
        <FormCard className="p-0 overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
            <Icon name="grade" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              CBCS 10-Point Grade Scales Scheme
            </h3>
          </div>

          <GridPanel
            data={GRADE_SCALE}
            dataKey="letter"
            emptyMessage="Grade scales mapping unavailable."
            columns={gradeScaleColumns as any}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
