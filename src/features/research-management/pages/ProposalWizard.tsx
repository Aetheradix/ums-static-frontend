import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useResearch } from '../context';
import '../research.css';
import { AGENCY_OPTIONS, BLANK_PROPOSAL, DEPARTMENT_OPTIONS } from '../data';

const STEP_TITLES: Record<number, string> = {
  1: 'Principal Investigator Profile',
  2: 'Agency & Sponsoring Targets',
  3: 'Research Abstract & Goals',
  4: 'Core Milestones Budget Allocations',
  5: 'Associated Co-Investigators (Co-PI)',
  6: 'Institutional Overhead Configuration',
  7: 'Ethics Clearances Ref Details',
  8: 'Audit Document Attachments',
  9: 'Declaration & Commitment Signature',
};

const STEP_LABELS: Record<number, string> = {
  1: 'Faculty Profile',
  2: 'Sponsorships',
  3: 'Abstract',
  4: 'Milestones',
  5: 'Co-PI Group',
  6: 'Overhead',
  7: 'Ethics',
  8: 'Documents',
  9: 'Declaration',
};

const DEPT_DROPDOWN: Data.DataItem<string>[] = DEPARTMENT_OPTIONS.map(d => ({
  id: d,
  text: d,
}));

const AGENCY_DROPDOWN: Data.DataItem<string>[] = AGENCY_OPTIONS.map(a => ({
  id: a,
  text: a,
}));

const DURATION_OPTIONS: Data.DataItem<string>[] = [
  { id: '12', text: '12 Months (1 Year)' },
  { id: '18', text: '18 Months (1.5 Years)' },
  { id: '24', text: '24 Months (2 Years)' },
  { id: '36', text: '36 Months (3 Years)' },
];

const OVERHEAD_OPTIONS: Data.DataItem<string>[] = [
  { id: '10', text: '10% Default Deduction Tier' },
  { id: '12', text: '12% Intermediary Tier' },
  { id: '15', text: '15% Premium Infrastructure Tier' },
];

const ETHICS_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Yes', text: 'Yes, Active Clearance Reference exists' },
  { id: 'No', text: 'No, Human/Serology clearances not applicable' },
];

export default function ProposalWizard() {
  const {
    proposals,
    setProposals,
    projects,
    setProjects,
    proposalForm,
    setProposalForm,
    proposalStep,
    setProposalStep,
    triggerNotification,
  } = useResearch();

  const [revisionLookupPI, setRevisionLookupPI] = useState('');

  const set = <K extends keyof ResearchManagement.ProposalForm>(
    key: K,
    value: ResearchManagement.ProposalForm[K]
  ) => setProposalForm(prev => ({ ...prev, [key]: value }));

  const handleRetrieveRevision = () => {
    if (!revisionLookupPI.trim()) {
      triggerNotification(
        'Please enter an Enrollment/Faculty ID to pull.',
        'error'
      );
      return;
    }
    const match = proposals.find(
      p =>
        p.enrollmentNo.toLowerCase() === revisionLookupPI.toLowerCase() &&
        p.status === 'Sent Back'
    );
    if (match) {
      setProposalForm({
        ...match,
        totalRequestedFunds: String(match.totalRequestedFunds),
      });
      setProposalStep(1);
      triggerNotification(
        'Docket pulled successfully! Proceed to edit and resubmit.'
      );
    } else {
      triggerNotification(
        'No correction queue record found matching this Faculty ID.',
        'error'
      );
    }
  };

  const handleSubmit = () => {
    if (!proposalForm.declaration) {
      triggerNotification(
        'Please check the digital declaration box in Step 9.',
        'error'
      );
      return;
    }
    if (
      !proposalForm.enrollmentNo ||
      !proposalForm.piName ||
      !proposalForm.title
    ) {
      triggerNotification(
        'Core academic and profile details are required in Step 1.',
        'error'
      );
      return;
    }
    const milestoneSum = proposalForm.milestones.reduce(
      (acc, m) => acc + (m.budgetPercent || 0),
      0
    );
    if (milestoneSum !== 100) {
      triggerNotification(
        `Milestone budget allocations must equal 100%. Current: ${milestoneSum}%`,
        'error'
      );
      return;
    }

    if (proposalForm.id) {
      // Resubmission of a sent-back docket
      setProposals(prev =>
        prev.map(p =>
          p.id === proposalForm.id
            ? {
                ...p,
                ...proposalForm,
                totalRequestedFunds:
                  parseFloat(String(proposalForm.totalRequestedFunds)) || 0,
                status: 'Pending',
                adminRemarks: 'Corrected proposal docket resubmitted by PI.',
                plagiarismScore: p.plagiarismScore,
              }
            : p
        )
      );
      triggerNotification(
        `Proposal docket ${proposalForm.id} returned to Compliance Queue.`
      );
    } else {
      const generatedId = `PROP-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const newProposal: ResearchManagement.Proposal = {
        ...proposalForm,
        id: generatedId,
        totalRequestedFunds:
          parseFloat(String(proposalForm.totalRequestedFunds)) || 0,
        plagiarismScore: Math.floor(Math.random() * 12),
        status: 'Pending',
        adminRemarks: '',
      };
      setProposals(prev => [...prev, newProposal]);
      triggerNotification(`Proposal registered! Generated ID: ${generatedId}`);
    }

    setProposalStep(1);
    setProposalForm({ ...BLANK_PROPOSAL });

    void projects;
    void setProjects;
  };

  const updateMilestone = (
    idx: number,
    key: keyof ResearchManagement.Milestone,
    value: string | number
  ) => {
    const list = [...proposalForm.milestones];
    (list[idx] as any)[key] = value;
    set('milestones', list);
  };

  return (
    <FormPage
      title="STU Grant Proposal Submission Desk"
      description="Submit a baseline research proposal or pull revision dockets returned by the Compliance Evaluation Board"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Research Management', to: '/research-management/dashboard' },
        { label: 'Proposal Wizard' },
      ]}
    >
      {/* Revision Lookup */}
      <FormCard title="Revision Docket Lookup (PI ID)" icon="refresh">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[220px]">
            <TextBox
              label="Faculty / Enrollment ID"
              placeholder="e.g. STU-FAC-102"
              value={revisionLookupPI}
              onChange={v => setRevisionLookupPI(v.toUpperCase())}
            />
          </div>
          <Button
            label="Pull Proposal"
            icon="search"
            variant="outlined"
            onClick={handleRetrieveRevision}
          />
        </div>
        {proposalForm.id && (
          <div className="mt-3 inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <i className="pi pi-exclamation-triangle" />
            In Revision State: {proposalForm.id}
          </div>
        )}
      </FormCard>

      {/* Step Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 overflow-x-auto">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(stepNum => (
          <div
            key={stepNum}
            className="flex flex-col items-center min-w-[72px]"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                proposalStep === stepNum
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                  : proposalStep > stepNum
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-400 border'
              }`}
            >
              {stepNum}
            </div>
            <span className="text-[10px] font-bold text-slate-500 mt-1.5 whitespace-nowrap">
              {STEP_LABELS[stepNum]}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <FormCard
        title={`Step ${proposalStep} of 9: ${STEP_TITLES[proposalStep]}`}
        icon="file-edit"
      >
        {/* Step 1: PI Profile */}
        {proposalStep === 1 && (
          <FormGrid columns={2}>
            <TextBox
              label="Faculty Registration ID (PI) *"
              placeholder="e.g. STU-FAC-782"
              value={String(proposalForm.enrollmentNo)}
              onChange={v => set('enrollmentNo', v.toUpperCase())}
            />
            <TextBox
              label="Principal Investigator Name *"
              placeholder="Dr. First Middle Last"
              value={proposalForm.piName}
              onChange={v => set('piName', v)}
            />
            <DropDownList
              label="Department *"
              data={DEPT_DROPDOWN}
              textField="text"
              valueField="id"
              value={proposalForm.department}
              onChange={v => set('department', v as string)}
            />
            <TextBox
              label="Contact Mobile Number *"
              placeholder="10-digit number"
              value={proposalForm.mobile}
              onChange={v => set('mobile', v)}
            />
            <TextBox
              label="Principal Email Address *"
              placeholder="example@stu.ac.in"
              value={proposalForm.email}
              onChange={v => set('email', v)}
            />
          </FormGrid>
        )}

        {/* Step 2: Sponsorship */}
        {proposalStep === 2 && (
          <FormGrid columns={2}>
            <DropDownList
              label="Target Sponsoring Body *"
              data={AGENCY_DROPDOWN}
              textField="text"
              valueField="id"
              value={proposalForm.agency}
              onChange={v => set('agency', v as string)}
            />
            <TextBox
              label="Total Requested Funding (INR) *"
              placeholder="e.g. 3800000"
              value={String(proposalForm.totalRequestedFunds)}
              onChange={v => set('totalRequestedFunds', v)}
            />
            <DropDownList
              label="Proposed Duration (Months)"
              data={DURATION_OPTIONS}
              textField="text"
              valueField="id"
              value={proposalForm.durationMonths}
              onChange={v => set('durationMonths', v as string)}
            />
          </FormGrid>
        )}

        {/* Step 3: Abstract */}
        {proposalStep === 3 && (
          <div className="space-y-4">
            <TextBox
              label="Grant Proposal Project Title *"
              placeholder="Full research title"
              value={proposalForm.title}
              onChange={v => set('title', v)}
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Executive Summary / Abstract *
              </label>
              <textarea
                rows={5}
                placeholder="Provide background parameters, methods mapping, deliverables targeted..."
                value={proposalForm.abstract}
                onChange={e => set('abstract', e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Milestones */}
        {proposalStep === 4 && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs font-semibold">
              Milestone budget allocations must sum to exactly{' '}
              <strong>100%</strong>. Current total:{' '}
              <strong>
                {proposalForm.milestones.reduce(
                  (a, m) => a + m.budgetPercent,
                  0
                )}
                %
              </strong>
            </div>
            {proposalForm.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 bg-slate-50 border rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <TextBox
                  label={`Milestone #${m.id} Title`}
                  value={m.title}
                  onChange={v => updateMilestone(idx, 'title', v)}
                />
                <TextBox
                  label="Budget Allocation (%)"
                  value={String(m.budgetPercent)}
                  onChange={v =>
                    updateMilestone(idx, 'budgetPercent', parseInt(v) || 0)
                  }
                />
                <TextBox
                  label="Deliverables Summary"
                  value={m.deliverables}
                  onChange={v => updateMilestone(idx, 'deliverables', v)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Co-PI */}
        {proposalStep === 5 && (
          <TextBox
            label="Co-Investigators List (comma separated)"
            placeholder="Dr. Sunita Sen, Prof. H.S. Rawat"
            value={proposalForm.coInvestigators}
            onChange={v => set('coInvestigators', v)}
          />
        )}

        {/* Step 6: Overhead */}
        {proposalStep === 6 && (
          <div className="space-y-2">
            <DropDownList
              label="Proposed Institutional Overhead Percentage (%)"
              data={OVERHEAD_OPTIONS}
              textField="text"
              valueField="id"
              value={proposalForm.overheadProposed}
              onChange={v => set('overheadProposed', v as string)}
            />
            <p className="text-[11px] text-slate-400">
              Calculated as deductions allocated to university research pools on
              each released tranche.
            </p>
          </div>
        )}

        {/* Step 7: Ethics */}
        {proposalStep === 7 && (
          <FormGrid columns={2}>
            <DropDownList
              label="Requires Ethics Board Clearance?"
              data={ETHICS_OPTIONS}
              textField="text"
              valueField="id"
              value={proposalForm.hasEthicsClearance}
              onChange={v => set('hasEthicsClearance', v as 'Yes' | 'No')}
            />
            <TextBox
              label="Ethics Clearance Reference No."
              placeholder="STU-ETH-2026-XX"
              value={proposalForm.ethicsRefNo}
              onChange={v => set('ethicsRefNo', v.toUpperCase())}
            />
          </FormGrid>
        )}

        {/* Step 8: Documents */}
        {proposalStep === 8 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-center">
              <i className="pi pi-file-check text-2xl text-slate-400" />
              <p className="text-xs font-bold text-slate-600">
                Ethics Board Clearance Dossier
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {proposalForm.ethicsDocs} — Verified ✓
              </span>
            </div>
            <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-center">
              <i className="pi pi-file-check text-2xl text-slate-400" />
              <p className="text-xs font-bold text-slate-600">
                Budget Justification Spreadsheet
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {proposalForm.budgetDocs} — Verified ✓
              </span>
            </div>
          </div>
        )}

        {/* Step 9: Declaration */}
        {proposalStep === 9 && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-3 leading-relaxed">
              <p className="font-bold text-slate-800 text-sm">
                STU Intellectual Property & Research Ethics Commitment
                Declarations:
              </p>
              <p>
                1. I hereby guarantee that all details filled inside this
                proposal are absolute and true to my scientific understanding
                and do not infringe any active patents.
              </p>
              <p>
                2. I understand that any overlapping funding proposals
                discovered with SERB/DST/CSIR will lead to immediate
                cancellation of STU eligibility indices.
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={proposalForm.declaration}
                onChange={e => set('declaration', e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-amber-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                I accept all STU Research Bylaws, Compliance frameworks, and
                Funding declarations.
              </span>
            </label>
            <TextBox
              label="Investigator Electronic Signature Name *"
              placeholder="Type your Full Name to digitally sign"
              value={proposalForm.signature}
              onChange={v => set('signature', v)}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button
            label="â—€ Prev Stage"
            variant="outlined"
            onClick={() => setProposalStep(s => Math.max(1, s - 1))}
          />
          <div className="flex gap-2">
            <Button
              label="Save Draft"
              variant="outlined"
              onClick={() =>
                triggerNotification('Docket saved to revision loop.')
              }
            />
            {proposalStep < 9 ? (
              <Button
                label="Next Stage â–¶"
                variant="primary"
                onClick={() => setProposalStep(s => Math.min(9, s + 1))}
              />
            ) : (
              <Button
                label="Submit Proposal ✓"
                variant="primary"
                onClick={handleSubmit}
              />
            )}
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
