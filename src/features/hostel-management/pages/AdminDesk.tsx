import { useMemo, useState } from 'react';
import { DropDownList, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useHostel } from '../context';
import '../hostel.css';

type Status = 'All' | HostelManagement.Application['status'];

const STATUS_TABS: Status[] = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
  'Sent Back',
];

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

  const getStatusClass = (status: string) => {
    if (status === 'Approved') return 'hm-badge--approved';
    if (status === 'Pending') return 'hm-badge--pending';
    if (status === 'Sent Back') return 'hm-badge--sent-back';
    return 'hm-badge--rejected';
  };

  return (
    <FormPage
      title="Admin Desk — Application Review"
      description="Verify student intake profiles and approve, reject or send back for correction"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Admin Desk' },
      ]}
    >
      {/* Summary Stat Cards */}
      <div className="hm-stats-grid">
        <div className="hm-stat-card hm-stat-card--amber">
          <div>
            <div className="hm-stat-label">Pending Review</div>
            <div className="hm-stat-value" style={{ color: '#92400e' }}>
              {counts.pending}
            </div>
          </div>
          <div className="hm-stat-icon hm-stat-icon--amber">
            <i className="pi pi-clock" />
          </div>
        </div>
        <div className="hm-stat-card hm-stat-card--emerald">
          <div>
            <div className="hm-stat-label">Approved</div>
            <div className="hm-stat-value" style={{ color: '#065f46' }}>
              {counts.approved}
            </div>
          </div>
          <div className="hm-stat-icon hm-stat-icon--emerald">
            <i className="pi pi-check-circle" />
          </div>
        </div>
        <div className="hm-stat-card hm-stat-card--rose">
          <div>
            <div className="hm-stat-label">Rejected</div>
            <div className="hm-stat-value" style={{ color: '#9f1239' }}>
              {counts.rejected}
            </div>
          </div>
          <div className="hm-stat-icon hm-stat-icon--rose">
            <i className="pi pi-times-circle" />
          </div>
        </div>
        <div className="hm-stat-card hm-stat-card--indigo">
          <div>
            <div className="hm-stat-label">Sent Back</div>
            <div className="hm-stat-value" style={{ color: '#3730a3' }}>
              {counts.sentBack}
            </div>
          </div>
          <div className="hm-stat-icon hm-stat-icon--indigo">
            <i className="pi pi-refresh" />
          </div>
        </div>
      </div>

      {/* Application List */}
      <FormCard title="Applications Queue" icon="list">
        <div className="hm-filter-bar">
          <span className="hm-filter-label">Filter:</span>
          {STATUS_TABS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`hm-filter-pill ${filter === s ? 'hm-filter-pill--active' : 'hm-filter-pill--inactive'}`}
            >
              {s}
            </button>
          ))}
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
                <span className={`hm-badge ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: HostelManagement.Application) => (
                <button
                  className="hm-btn-inspect"
                  onClick={() => {
                    setSelectedId(item.id);
                    setRemarks(item.adminRemarks);
                  }}
                >
                  <i className="pi pi-search" style={{ fontSize: '0.65rem' }} />{' '}
                  Review
                </button>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* Review Panel */}
      {selected && (
        <FormCard
          title={`Review: ${selected.name} — ${selected.id}`}
          icon="check-square"
        >
          <div className="hm-inspector-card mb-4">
            <span className="hm-inspector-id">{selected.id}</span>
            <p className="hm-inspector-name">{selected.name}</p>
            <p className="hm-inspector-meta">
              {selected.college} · {selected.course}
            </p>
          </div>

          <div className="hm-detail-grid">
            {[
              ['Enrollment No.', selected.enrollmentNo],
              ['Gender', selected.gender],
              ['Branch', selected.branch],
              ['Semester', selected.semester],
              ['Hostel Pref.', selected.hostelPreference],
              ['Room Pref.', selected.roomPreference],
              ['Needs Mess', selected.needMess],
              ['Check-In Date', selected.checkInDate],
              ['Blood Group', selected.bloodGroup],
              ['Medical', selected.medicalCondition],
            ].map(([label, val]) => (
              <div key={label as string} className="hm-detail-field">
                <div className="hm-detail-label">{label}</div>
                <div className="hm-detail-value">{val || '—'}</div>
              </div>
            ))}
          </div>

          {selected.adminRemarks && (
            <div className="hm-alert hm-alert--warning mb-4">
              <i className="pi pi-info-circle" />
              <div>
                <strong>Previous Remarks:</strong> {selected.adminRemarks}
              </div>
            </div>
          )}

          <label className="hm-remarks-label">Admin Remarks *</label>
          <TextArea
            label=""
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


