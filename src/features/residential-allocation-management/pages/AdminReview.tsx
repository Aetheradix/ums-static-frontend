import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import '../residential.css';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

export default function AdminReview() {
  const { applications, setApplications, triggerNotification } =
    useResidentialAllocation();

  const [selectedApp, setSelectedApp] =
    useState<ResidentialAllocationManagement.StaffApplication | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [reviewFilter, setReviewFilter] = useState('All');

  const filteredApps = applications.filter(
    app => reviewFilter === 'All' || app.status === reviewFilter
  );

  const handleReviewAction = (
    status: 'Approved' | 'Sent Back' | 'Rejected'
  ) => {
    if (!selectedApp) return;
    if (!adminRemarks.trim()) {
      triggerNotification(
        'Admin remarks are required to update application status.',
        'error'
      );
      return;
    }
    setApplications(prev =>
      prev.map(app =>
        app.id === selectedApp.id ? { ...app, status, adminRemarks } : app
      )
    );
    triggerNotification(
      `Application ${selectedApp.id} status changed to: ${status}`
    );
    setSelectedApp(null);
    setAdminRemarks('');
  };

  const getStatusClass = (status: string) => {
    if (status === 'Approved') return 'ram-badge--approved';
    if (status === 'Pending') return 'ram-badge--pending';
    if (status === 'Sent Back') return 'ram-badge--sent-back';
    return 'ram-badge--rejected';
  };

  return (
    <FormPage
      title="Seniority Screener & Admin Desk"
      description="Evaluate faculty housing applications based on date of joining, basic pay, and grade matrix rules"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Admin Review' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <FormCard title="Faculty Applications Queue" icon="list">
            {/* Filter Bar */}
            <div className="ram-filter-bar">
              <span className="ram-filter-label">Filter:</span>
              {['All', 'Pending', 'Approved', 'Sent Back'].map(st => (
                <button
                  key={st}
                  onClick={() => setReviewFilter(st)}
                  className={`ram-filter-pill ${reviewFilter === st ? 'ram-filter-pill--active' : 'ram-filter-pill--inactive'}`}
                >
                  {st}
                </button>
              ))}
            </div>

            <GridPanel
              data={filteredApps}
              columns={[
                { field: 'id', header: 'App ID' },
                { field: 'name', header: 'Faculty Name' },
                { field: 'designation', header: 'Designation' },
                { field: 'payLevel', header: 'Pay Band' },
                {
                  field: 'dateOfJoining',
                  header: 'Seniority Date',
                  cell: (
                    item: ResidentialAllocationManagement.StaffApplication
                  ) => (
                    <span className="font-mono text-xs font-bold text-indigo-700">
                      {item.dateOfJoining || 'N/A'}
                    </span>
                  ),
                },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (
                    item: ResidentialAllocationManagement.StaffApplication
                  ) => (
                    <span
                      className={`ram-badge ${getStatusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  ),
                },
                {
                  header: 'Action',
                  cell: (
                    item: ResidentialAllocationManagement.StaffApplication
                  ) => (
                    <button
                      onClick={() => {
                        setSelectedApp(item);
                        setAdminRemarks(item.adminRemarks || '');
                      }}
                      className="ram-btn-inspect"
                    >
                      <i
                        className="pi pi-search"
                        style={{ marginRight: '0.3rem', fontSize: '0.65rem' }}
                      />
                      Inspect
                    </button>
                  ),
                },
              ]}
            />
          </FormCard>
        </div>

        {/* Inspection Panel */}
        <div className="lg:col-span-1">
          <FormCard title="Evaluation Inspector" icon="search">
            {selectedApp ? (
              <div className="space-y-4">
                {/* Profile Card */}
                <div className="ram-inspector-card">
                  <div className="flex justify-between items-start mb-2">
                    <span className="ram-inspector-id-badge">
                      {selectedApp.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {selectedApp.enrollmentNo}
                    </span>
                  </div>
                  <p className="ram-inspector-name">{selectedApp.name}</p>
                  <p className="ram-inspector-meta">
                    {selectedApp.designation} &bull; {selectedApp.department}
                  </p>
                </div>

                {/* Seniority Metrics */}
                <div className="ram-metrics-panel">
                  <p className="ram-metrics-title">Seniority Metrics</p>
                  <div className="ram-metrics-row">
                    <span>STU Joining Date</span>
                    <strong>{selectedApp.dateOfJoining}</strong>
                  </div>
                  <div className="ram-metrics-row">
                    <span>Eligible Pay Band</span>
                    <strong>{selectedApp.payLevel}</strong>
                  </div>
                  <div className="ram-metrics-row">
                    <span>Requested Preference</span>
                    <strong>{selectedApp.quarterPreference}</strong>
                  </div>
                </div>

                {selectedApp.specialRequirement && (
                  <div className="ram-special-req">
                    <strong>Special Priority Note:</strong>{' '}
                    {selectedApp.specialRequirement}
                  </div>
                )}

                {/* Remarks */}
                <div>
                  <label className="ram-remarks-label">
                    Admin Screener Remarks *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide evaluation notes..."
                    value={adminRemarks}
                    onChange={e => setAdminRemarks(e.target.value)}
                    className="ram-remarks-textarea"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    label="Approve Seniority Intake ✓"
                    variant="primary"
                    onClick={() => handleReviewAction('Approved')}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      label="Flag for Correction"
                      variant="outlined"
                      onClick={() => handleReviewAction('Sent Back')}
                    />
                    <Button
                      label="Reject Application"
                      variant="danger"
                      onClick={() => handleReviewAction('Rejected')}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="ram-empty-state">
                <i className="pi pi-search" />
                <p>
                  Select an application from the queue to inspect details and
                  execute review actions.
                </p>
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}


