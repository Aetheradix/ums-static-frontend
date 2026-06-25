import { useMemo, useState } from 'react';
import { DropDownList, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useHostel } from '../context';

type Status = 'All' | HostelManagement.Application['status'];

const STATUS_TABS: Status[] = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
  'Sent Back',
];

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
  'Sent Back': 'bg-orange-100 text-orange-700',
};

export default function AdminDesk() {
  const { applications, setApplications, triggerNotification } = useHostel();
  const [filter, setFilter] = useState<Status>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? applications
        : applications.filter(a => a.status === filter),
    [applications, filter]
  );

  const selected = useMemo(
    () => applications.find(a => a.id === selectedId) ?? null,
    [applications, selectedId]
  );

  const counts = useMemo(
    () => ({
      pending: applications.filter(a => a.status === 'Pending').length,
      approved: applications.filter(a => a.status === 'Approved').length,
      rejected: applications.filter(a => a.status === 'Rejected').length,
      sentBack: applications.filter(a => a.status === 'Sent Back').length,
    }),
    [applications]
  );

  const handleAction = (newStatus: HostelManagement.Application['status']) => {
    if (!selected) return;
    if (!remarks.trim()) {
      triggerNotification('Admin remarks are required.', 'error');
      return;
    }
    setApplications(prev =>
      prev.map(a =>
        a.id === selected.id
          ? { ...a, status: newStatus, adminRemarks: remarks }
          : a
      )
    );
    triggerNotification(`Application ${selected.id} marked as: ${newStatus}`);
    setSelectedId(null);
    setRemarks('');
  };

  // Status filter dropdown data
  const filterDD = STATUS_TABS.map(s => ({
    id: s,
    text: s,
  })) as Data.DataItem<string>[];

  return (
    <FormPage
      title="Admin Desk — Application Review"
      description="Verify student intake profiles and approve, reject or send back for correction"
      breadcrumbs={[
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Admin Desk' },
      ]}
    >
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Pending Review',
            count: counts.pending,
            color: 'border-amber-400 bg-amber-50',
            text: 'text-amber-700',
          },
          {
            label: 'Approved',
            count: counts.approved,
            color: 'border-emerald-400 bg-emerald-50',
            text: 'text-emerald-700',
          },
          {
            label: 'Rejected',
            count: counts.rejected,
            color: 'border-red-400 bg-red-50',
            text: 'text-red-700',
          },
          {
            label: 'Sent Back',
            count: counts.sentBack,
            color: 'border-orange-400 bg-orange-50',
            text: 'text-orange-700',
          },
        ].map(c => (
          <div key={c.label} className={`rounded-xl border-l-4 p-4 ${c.color}`}>
            <p className={`text-2xl font-black ${c.text}`}>{c.count}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Application list ── */}
      <FormCard title="Applications Queue" icon="list">
        <div className="mb-4 w-48">
          <DropDownList
            label=""
            data={filterDD}
            textField="text"
            valueField="id"
            value={filter}
            onChange={v => setFilter(v as Status)}
          />
        </div>

        <GridPanel
          data={filtered}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'id', header: 'App ID' },
            { field: 'name', header: 'Student Name' },
            { field: 'enrollmentNo', header: 'Enrollment No.' },
            { field: 'college', header: 'College' },
            { field: 'hostelPreference', header: 'Pref. Hostel' },
            {
              header: 'Status',
              sortable: false,
              cell: (item: HostelManagement.Application) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_COLORS[item.status] ?? ''}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: HostelManagement.Application) => (
                <Button
                  label="Review"
                  icon="eye"
                  variant="primary"
                  onClick={() => {
                    setSelectedId(item.id);
                    setRemarks(item.adminRemarks);
                  }}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* ── Review panel ── */}
      {selected && (
        <FormCard
          title={`Review: ${selected.name} — ${selected.id}`}
          icon="check-square"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            {[
              ['Enrollment No.', selected.enrollmentNo],
              ['Gender', selected.gender],
              ['College', selected.college],
              ['Course', selected.course],
              ['Branch', selected.branch],
              ['Semester', selected.semester],
              ['Hostel Pref.', selected.hostelPreference],
              ['Room Pref.', selected.roomPreference],
              ['Needs Mess', selected.needMess],
              ['Check-In Date', selected.checkInDate],
              ['Blood Group', selected.bloodGroup],
              ['Medical', selected.medicalCondition],
            ].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-xs text-slate-400 font-semibold">{label}</p>
                <p className="font-semibold text-slate-800">{val || '—'}</p>
              </div>
            ))}
          </div>

          {selected.adminRemarks && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-4">
              <strong>Previous Remarks:</strong> {selected.adminRemarks}
            </div>
          )}

          <TextArea
            label="Admin Remarks *"
            placeholder="Write your evaluation remarks here..."
            value={remarks}
            onChange={v => setRemarks(v)}
            rows={3}
          />

          <div className="form-actions-row mt-4">
            <Button
              label="Approve"
              icon="check"
              variant="primary"
              onClick={() => handleAction('Approved')}
            />
            <Button
              label="Send Back"
              icon="undo"
              variant="outlined"
              onClick={() => handleAction('Sent Back')}
            />
            <Button
              label="Reject"
              icon="times"
              variant="danger"
              onClick={() => handleAction('Rejected')}
            />
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => {
                setSelectedId(null);
                setRemarks('');
              }}
            />
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
