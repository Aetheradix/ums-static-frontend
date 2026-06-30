import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useResearch } from '../context';

export default function AdminReview() {
  const {
    proposals,
    setProposals,
    projects,
    setProjects,
    triggerNotification,
  } = useResearch();

  const [selectedProp, setSelectedProp] =
    useState<ResearchManagement.Proposal | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [reviewFilter, setReviewFilter] = useState<string>('All');

  const pendingCount = proposals.filter(p => p.status === 'Pending').length;
  const approvedCount = proposals.filter(p => p.status === 'Approved').length;

  const handleReviewAction = (
    status: 'Approved' | 'Sent Back' | 'Rejected'
  ) => {
    if (!selectedProp) return;
    if (!adminRemarks.trim()) {
      triggerNotification(
        'Evaluation analysis remarks are mandatory.',
        'error'
      );
      return;
    }

    setProposals(prev =>
      prev.map(p =>
        p.id === selectedProp.id ? { ...p, status, adminRemarks } : p
      )
    );

    if (status === 'Approved') {
      const projCode = `STU-GR-2026-00${projects.length + 1}`;
      const newProject: ResearchManagement.Project = {
        code: projCode,
        title: selectedProp.title,
        agency: selectedProp.agency,
        type: 'Competitive Grant',
        category: 'Technology Core',
        approvedBudget: selectedProp.totalRequestedFunds as number,
        disbursedFunds: 0,
        overheadPercentage: parseInt(selectedProp.overheadProposed),
        piName: selectedProp.piName,
        piMobile: selectedProp.mobile,
        piEmail: selectedProp.email,
        durationMonths: parseInt(selectedProp.durationMonths),
        ethicsStatus:
          selectedProp.hasEthicsClearance === 'Yes' ? 'Approved' : 'Expired',
        milestonesCount: selectedProp.milestones.length,
        completedMilestones: 0,
        status: 'Active',
        synopsis: selectedProp.abstract,
      };
      setProjects(prev => [...prev, newProject]);
      triggerNotification(
        `Proposal approved. Project ${projCode} established in registry.`
      );
    } else {
      triggerNotification(`Proposal ${selectedProp.id} — Status: ${status}`);
    }

    setSelectedProp(null);
    setAdminRemarks('');
  };

  const filtered = proposals.filter(
    p => reviewFilter === 'All' || p.status === reviewFilter
  );

  const filterButtons = [
    { label: 'All', count: proposals.length },
    { label: 'Pending', count: pendingCount },
    { label: 'Approved', count: approvedCount },
    {
      label: 'Sent Back',
      count: proposals.filter(p => p.status === 'Sent Back').length,
    },
  ];

  return (
    <FormPage
      title="Compliance Screening & Ethics Review Desk"
      description="Examine plagiarism overlap factors, confirm ethical clearance codes, and release baseline proposal decisions"
      breadcrumbs={[
        { label: 'Research Management', to: '/research-management/dashboard' },
        { label: 'Admin Review' },
      ]}
    >
      {/* Filter bar */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
        {filterButtons.map(fb => (
          <button
            key={fb.label}
            onClick={() => setReviewFilter(fb.label)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              reviewFilter === fb.label
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {fb.label} ({fb.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposal list panel */}
        <div className="lg:col-span-1">
          <FormCard title="Submitted Proposals" icon="list">
            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto -mx-4 -mb-4">
              {filtered.map(prop => (
                <div
                  key={prop.id}
                  onClick={() => {
                    setSelectedProp(prop);
                    setAdminRemarks('');
                  }}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-all ${
                    selectedProp?.id === prop.id
                      ? 'bg-amber-50 border-l-4 border-amber-500'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {prop.piName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {prop.enrollmentNo}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        prop.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prop.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                    <span>{prop.department.substring(11)}</span>
                    <span className="font-bold text-indigo-700">
                      ₹
                      {((prop.totalRequestedFunds as number) / 100000).toFixed(
                        1
                      )}
                      L
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">
                  No proposals in this queue.
                </p>
              )}
            </div>
          </FormCard>
        </div>

        {/* Detail / review panel */}
        <div className="lg:col-span-2">
          {selectedProp ? (
            <div className="space-y-4">
              <FormCard
                title={`Screening: ${selectedProp.id} — ${selectedProp.piName}`}
                icon="search"
              >
                {/* Proposal coordinates */}
                <div className="space-y-3">
                  <p className="text-xs font-extrabold text-amber-600 uppercase border-b pb-1.5">
                    1. Sponsoring Target & Overheads
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <p>
                      <strong className="text-slate-500">
                        Sponsoring Body:
                      </strong>{' '}
                      {selectedProp.agency}
                    </p>
                    <p>
                      <strong className="text-slate-500">Term:</strong>{' '}
                      {selectedProp.durationMonths} months
                    </p>
                    <p>
                      <strong className="text-slate-500">Overhead:</strong>{' '}
                      {selectedProp.overheadProposed}%
                    </p>
                    <p>
                      <strong className="text-slate-500">Mobile:</strong>{' '}
                      {selectedProp.mobile}
                    </p>
                    <p>
                      <strong className="text-slate-500">Email:</strong>{' '}
                      {selectedProp.email}
                    </p>
                    <p>
                      <strong className="text-slate-500">Co-PI:</strong>{' '}
                      {selectedProp.coInvestigators || 'None'}
                    </p>
                  </div>
                </div>

                {/* Abstract */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-extrabold text-amber-600 uppercase border-b pb-1.5">
                    2. Research Abstract
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedProp.abstract}
                  </p>
                </div>

                {/* Integrity indicators */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-extrabold text-amber-600 uppercase border-b pb-1.5">
                    3. Plagiarism & Integrity Indicators
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase font-black">
                          Plagiarism Overlap Factor
                        </span>
                        <strong
                          className={`text-lg font-black ${
                            selectedProp.plagiarismScore > 15
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {selectedProp.plagiarismScore}% Similarity
                        </strong>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                          selectedProp.plagiarismScore > 15
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {selectedProp.plagiarismScore > 15
                          ? 'Flagged ⚠'
                          : 'Safe ✓'}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase font-black">
                          Ethics Clearance Ref
                        </span>
                        <strong className="text-sm font-black text-slate-800">
                          {selectedProp.ethicsRefNo || 'Not declared'}
                        </strong>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-slate-100 text-slate-600 border">
                        {selectedProp.hasEthicsClearance === 'Yes'
                          ? 'Has Clearance'
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-extrabold text-amber-600 uppercase border-b pb-1.5">
                    4. Milestones Overview
                  </p>
                  <GridPanel
                    data={selectedProp.milestones}
                    columns={[
                      { field: 'id', header: '#', width: '40px' },
                      { field: 'title', header: 'Milestone Title' },
                      {
                        field: 'budgetPercent',
                        header: 'Budget %',
                        cell: (item: ResearchManagement.Milestone) => (
                          <span className="font-mono font-bold text-indigo-700">
                            {item.budgetPercent}%
                          </span>
                        ),
                      },
                      { field: 'deliverables', header: 'Deliverables' },
                    ]}
                  />
                </div>

                {/* Evaluation remarks & actions */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 mt-4">
                  <label className="block text-xs font-extrabold text-slate-700">
                    Compliance & Evaluation Analysis Remarks (Mandatory) *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Proposal passes structural plagiarism checking. Baseline SERB targets validated."
                    value={adminRemarks}
                    onChange={e => setAdminRemarks(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none bg-white"
                  />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button
                      label="Authorize Project ✓"
                      variant="primary"
                      onClick={() => handleReviewAction('Approved')}
                    />
                    <Button
                      label="Flag for Revision 🔂"
                      variant="outlined"
                      onClick={() => handleReviewAction('Sent Back')}
                    />
                    <Button
                      label="Reject ❌"
                      variant="danger"
                      onClick={() => handleReviewAction('Rejected')}
                    />
                  </div>
                </div>
              </FormCard>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <p className="font-black text-slate-700 text-lg">
                Select a proposal from the queue
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Choose an incoming grant submission to analyze compliance
                references.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormPage>
  );
}
