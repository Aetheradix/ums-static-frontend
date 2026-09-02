import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewField,
  PreviewSection,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { EmptyState } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Grievance } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const STATUS_VARIANT = {
  Open: 'pending',
  'In Progress': 'info',
  Resolved: 'success',
  Closed: 'muted',
} as const;

const PRIORITY_VARIANT = {
  Low: 'neutral',
  Medium: 'warning',
  High: 'danger',
} as const;

const STATUS_OPTIONS = [
  { id: 'Open', text: 'Open' },
  { id: 'In Progress', text: 'In Progress' },
  { id: 'Resolved', text: 'Resolved' },
  { id: 'Closed', text: 'Closed' },
];

const blank = () => ({
  categoryId: '',
  subject: '',
  description: '',
  priority: 'Medium' as Grievance['priority'],
});

export default function Grievances() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState(blank);
  const [acting, setActing] = useState<Grievance | null>(null);
  const [action, setAction] = useState({
    actionTaken: '',
    status: 'Resolved' as Grievance['status'],
  });

  const rows = useMemo(
    () =>
      isStudent
        ? data.grievances.filter(g => g.studentId === MOCK_STUDENT_ID)
        : data.grievances.filter(g => g.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.grievances, isStudent]
  );

  const counts = useMemo(
    () => ({
      open: rows.filter(g => g.status === 'Open').length,
      inProgress: rows.filter(g => g.status === 'In Progress').length,
      resolved: rows.filter(
        g => g.status === 'Resolved' || g.status === 'Closed'
      ).length,
      high: rows.filter(g => g.priority === 'High').length,
    }),
    [rows]
  );

  const categoryName = (id: string) =>
    data.grievanceCategories.find(c => c.id === id)?.name ?? '—';
  const categoryDept = (id: string) =>
    data.grievanceCategories.find(c => c.id === id)?.department ?? '—';

  const handleRaise = () => {
    const sequence = data.grievances.length + 1;
    add('grievances', {
      id: uid('GR'),
      grievanceNo: `GRV/${new Date().getFullYear()}/${String(sequence).padStart(4, '0')}`,
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      categoryId: form.categoryId,
      subject: form.subject,
      description: form.description,
      priority: form.priority,
      raisedOn: today(),
      status: 'Open',
      actionTaken: '',
      actionBy: '',
      actionDate: '',
    });
    setForm(blank());
    ToastService.success('Grievance registered with the warden.');
  };

  const handleSaveAction = () => {
    if (!acting) return;
    update('grievances', acting.id, {
      ...acting,
      actionTaken: action.actionTaken.trim(),
      status: action.status,
      actionBy: MOCK_WARDEN_NAME,
      actionDate: today(),
    });
    ToastService.success('Action recorded against the grievance.');
    setActing(null);
  };

  return (
    <FormPage
      title={isStudent ? 'My Grievances' : 'Student Grievances'}
      description={
        isStudent
          ? 'Raise a complaint about anything in the hostel and follow the action taken on it.'
          : 'Complaints raised by your residents. Record the action taken and move each one to resolution.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Grievances')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Open"
          value={counts.open}
          icon="error"
          colorScheme="orange"
        />
        <StatCard
          title="In Progress"
          value={counts.inProgress}
          icon="autorenew"
          colorScheme="blue"
        />
        <StatCard
          title="Resolved"
          value={counts.resolved}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="High Priority"
          value={counts.high}
          icon="priority_high"
          colorScheme="red"
        />
      </FormGrid>

      {isStudent && (
        <FormCard
          title="Raise a Grievance"
          subtitle="Pick the category so it reaches the right desk."
          icon="flag"
        >
          <FormGrid columns={3}>
            <DropDownList
              label="Category"
              data={data.grievanceCategories.map(c => ({
                id: c.id,
                text: `${c.name} — ${c.department}`,
              }))}
              textField="text"
              valueField="id"
              value={form.categoryId}
              onChange={v =>
                setForm({ ...form, categoryId: (v as string) ?? '' })
              }
            />
            <TextBox
              label="Subject"
              placeholder="e.g. No hot water on the second floor"
              value={form.subject}
              onChange={v => setForm({ ...form, subject: v })}
            />
            <DropDownList
              label="Priority"
              data={[
                { id: 'Low', text: 'Low' },
                { id: 'Medium', text: 'Medium' },
                { id: 'High', text: 'High' },
              ]}
              textField="text"
              valueField="id"
              value={form.priority}
              onChange={v =>
                setForm({
                  ...form,
                  priority: (v as Grievance['priority']) ?? 'Medium',
                })
              }
            />
            <div className="md:col-span-3">
              <TextArea
                label="Description"
                rows={3}
                placeholder="What the problem is, since when, and how it affects you"
                value={form.description}
                onChange={v => setForm({ ...form, description: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Submit Grievance"
              icon="send"
              variant="primary"
              onClick={handleRaise}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(blank())}
            />
          </div>
        </FormCard>
      )}

      <FormCard
        title={isStudent ? 'Grievance History' : 'All Grievances'}
        icon="list"
      >
        {rows.length === 0 ? (
          <EmptyState
            icon="flag"
            title="No grievances"
            hint={
              isStudent
                ? 'Anything you raise here reaches the warden straight away.'
                : 'Complaints from your residents will appear here.'
            }
          />
        ) : (
          <GridPanel<Grievance>
            data={rows}
            searchBox
            searchPlaceholder="Search by grievance no., subject or student..."
            searchFields={['grievanceNo', 'subject', 'studentName']}
            pagination
            columns={[
              {
                field: 'grievanceNo',
                header: 'Grievance No.',
                width: 155,
                cell: item => (
                  <span className="font-mono text-xs">{item.grievanceNo}</span>
                ),
              },
              ...(isStudent
                ? []
                : [
                    {
                      field: 'studentName' as const,
                      header: 'Student',
                      width: 170,
                      cell: (item: Grievance) => (
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {item.studentName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {item.studentId}
                          </span>
                        </div>
                      ),
                    },
                  ]),
              {
                field: 'categoryId',
                header: 'Category',
                width: 195,
                cell: item => (
                  <div className="flex flex-col">
                    <span>{categoryName(item.categoryId)}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {categoryDept(item.categoryId)}
                    </span>
                  </div>
                ),
              },
              { field: 'subject', header: 'Subject', width: 250 },
              {
                field: 'priority',
                header: 'Priority',
                width: 110,
                cell: item => (
                  <StatusBadge
                    label={item.priority}
                    variant={PRIORITY_VARIANT[item.priority]}
                  />
                ),
              },
              { field: 'raisedOn', header: 'Raised On', width: 125 },
              {
                field: 'status',
                header: 'Status',
                width: 130,
                cell: item => (
                  <StatusBadge
                    label={item.status}
                    variant={STATUS_VARIANT[item.status]}
                  />
                ),
              },
              {
                field: 'actionTaken',
                header: 'Action Taken',
                width: 260,
                cell: item => (
                  <>
                    {item.actionTaken || (
                      <span className="text-slate-400">Awaiting action</span>
                    )}
                  </>
                ),
              },
              ...(isStudent
                ? []
                : [
                    {
                      header: 'Action',
                      sortable: false,
                      width: 150,
                      cell: (item: Grievance) => (
                        <Button
                          label="Record Action"
                          icon="pencil"
                          variant="primary"
                          size="small"
                          onClick={() => {
                            setActing(item);
                            setAction({
                              actionTaken: item.actionTaken,
                              status:
                                item.status === 'Open'
                                  ? 'In Progress'
                                  : item.status,
                            });
                          }}
                        />
                      ),
                    },
                  ]),
            ]}
          />
        )}
      </FormCard>

      <FormPopup
        visible={Boolean(acting)}
        onHide={() => setActing(null)}
        title="Record Action Taken"
        subtitle={acting ? `${acting.grievanceNo} — ${acting.subject}` : ''}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setActing(null)}
            />
            <Button label="Save" variant="primary" onClick={handleSaveAction} />
          </div>
        }
      >
        {acting && (
          <>
            <PreviewSection title="Grievance Details">
              <PreviewField label="Student" value={acting.studentName} />
              <PreviewField
                label="Category"
                value={categoryName(acting.categoryId)}
              />
              <PreviewField
                label="Department"
                value={categoryDept(acting.categoryId)}
              />
              <PreviewField label="Priority" value={acting.priority} />
              <PreviewField label="Raised On" value={acting.raisedOn} />
              <PreviewField
                label="Description"
                value={acting.description}
                fullWidth
              />
            </PreviewSection>

            <FormGrid columns={1}>
              <DropDownList
                label="Set Status"
                data={STATUS_OPTIONS}
                textField="text"
                valueField="id"
                value={action.status}
                onChange={v =>
                  setAction({
                    ...action,
                    status: (v as Grievance['status']) ?? 'Resolved',
                  })
                }
              />
              <TextArea
                label="Action Taken"
                rows={4}
                placeholder="What was done, by whom, and when"
                value={action.actionTaken}
                onChange={v => setAction({ ...action, actionTaken: v })}
              />
            </FormGrid>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
