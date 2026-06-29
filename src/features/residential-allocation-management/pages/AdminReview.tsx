import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
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

  return (
    <FormPage
      title="Seniority Screener & Admin Desk"
      description="Evaluate faculty housing applications based on date of joining, basic pay, and grade matrix rules"
      breadcrumbs={[
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
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Filter Status:
              </span>
              <div className="flex gap-2">
                {['All', 'Pending', 'Approved', 'Sent Back'].map(st => (
                  <button
                    key={st}
                    onClick={() => setReviewFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      reviewFilter === st
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
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
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : item.status === 'Sent Back'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
                },
                {
                  field: 'action',
                  header: 'Action',
                  cell: (
                    item: ResidentialAllocationManagement.StaffApplication
                  ) => (
                    <button
                      onClick={() => {
                        setSelectedApp(item);
                        setAdminRemarks(item.adminRemarks || '');
                      }}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      Inspect Profile
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
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-700">
                      {selectedApp.id}
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedApp.enrollmentNo}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    {selectedApp.name}
                  </h4>
                  <p className="text-slate-500">
                    {selectedApp.designation} • {selectedApp.department}
                  </p>
                </div>

                <div className="space-y-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <p className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider">
                    Seniority Metrics
                  </p>
                  <p className="text-slate-700">
                    STU Joining Date:{' '}
                    <strong className="text-indigo-700">
                      {selectedApp.dateOfJoining}
                    </strong>
                  </p>
                  <p className="text-slate-700">
                    Eligible Pay Band:{' '}
                    <strong className="text-indigo-700">
                      {selectedApp.payLevel}
                    </strong>
                  </p>
                  <p className="text-slate-700">
                    Requested Pref:{' '}
                    <strong className="text-indigo-700">
                      {selectedApp.quarterPreference}
                    </strong>
                  </p>
                </div>

                {selectedApp.specialRequirement && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <strong>Special Priority Note:</strong>{' '}
                    {selectedApp.specialRequirement}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <label className="block font-bold text-slate-700">
                    Admin Screener Remarks *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide evaluation notes..."
                    value={adminRemarks}
                    onChange={e => setAdminRemarks(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    label="Approve Seniority Intake ✓"
                    variant="primary"
                    onClick={() => handleReviewAction('Approved')}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      label="Flag for Correction"
                      variant="secondary"
                      onClick={() => handleReviewAction('Sent Back')}
                    />
                    <Button
                      label="Reject Application"
                      variant="secondary"
                      onClick={() => handleReviewAction('Rejected')}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                Select an application from the queue to inspect details and
                execute review actions.
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
