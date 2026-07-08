import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useResearch } from '../context';
import '../research.css';

const MILESTONE_OPTIONS: Data.DataItem<string>[] = [
  { id: '', text: '-- Choose Milestone --' },
  { id: '1', text: 'Milestone Tranche #1' },
  { id: '2', text: 'Milestone Tranche #2' },
  { id: '3', text: 'Milestone Tranche #3' },
];

export default function LedgerDisbursement() {
  const {
    projects,
    disbursedLogs,
    setDisbursedLogs,
    setProjects,
    triggerNotification,
  } = useResearch();

  const [selectedProjCode, setSelectedProjCode] = useState('');
  const [disbAmount, setDisbAmount] = useState('');
  const [disbMilestone, setDisbMilestone] = useState('');
  const [disbRemarks, setDisbRemarks] = useState('');

  const projectOptions: Data.DataItem<string>[] = [
    { id: '', text: '-- Choose Active Project --' },
    ...projects.map(p => ({
      id: p.code,
      text: `${p.code} â€” ${p.piName} (Ethics: ${p.ethicsStatus})`,
    })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjCode || !disbAmount || !disbMilestone) {
      triggerNotification('All allocation coordinates are required.', 'error');
      return;
    }

    const matched = projects.find(p => p.code === selectedProjCode);
    if (!matched) {
      triggerNotification('System record mismatch for project code.', 'error');
      return;
    }

    if (matched.ethicsStatus !== 'Approved') {
      triggerNotification(
        `Disbursement Blocked! Active Institutional Ethics Clearance is mandatory. Current status: ${matched.ethicsStatus}`,
        'error'
      );
      return;
    }

    const amount = parseFloat(disbAmount);
    if (matched.disbursedFunds + amount > matched.approvedBudget) {
      triggerNotification(
        `Allocation Out of Bounds! Requested â‚¹${amount.toLocaleString()} exceeds the remaining budget ceiling.`,
        'error'
      );
      return;
    }

    setProjects(prev =>
      prev.map(p =>
        p.code === selectedProjCode
          ? { ...p, disbursedFunds: p.disbursedFunds + amount }
          : p
      )
    );

    const newLog: ResearchManagement.DisbursedLog = {
      code: selectedProjCode,
      piName: matched.piName,
      agency: matched.agency,
      milestone: disbMilestone,
      amount,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
    setDisbursedLogs(prev => [newLog, ...prev]);

    triggerNotification(
      `Tranche successfully processed and credited to the project ledger!`
    );
    setSelectedProjCode('');
    setDisbAmount('');
    setDisbMilestone('');
    setDisbRemarks('');
  };

  return (
    <FormPage
      title="Milestone Tranche Ledger Controller"
      description="Safely disburse milestone tranches to active projects while enforcing ethics clearance and budget ceiling guards"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Research Management', to: '/research-management/dashboard' },
        { label: 'Ledger Disbursement' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disbursement form */}
        <FormCard title="New Disbursement Allocation Slip" icon="credit-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Ethics Lock Alert */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs font-semibold flex items-start gap-2 leading-relaxed">
              <i className="pi pi-shield text-rose-600 mt-0.5 text-base shrink-0" />
              <div>
                <p className="font-extrabold uppercase tracking-wide">
                  Ethics Clearance Lock Checkpoint:
                </p>
                <p>
                  Under university research bylaws, no fund tranche releases can
                  be generated if a project's ethics board clearance status is
                  anything other than <strong>'Approved'</strong>. Verified
                  dockets are required to release ledger codes.
                </p>
              </div>
            </div>

            <DropDownList
              label="Select Active Research Project *"
              data={projectOptions}
              textField="text"
              valueField="id"
              value={selectedProjCode}
              onChange={v => setSelectedProjCode(v as string)}
            />

            <FormGrid columns={2}>
              <DropDownList
                label="Target Milestone Tranche No. *"
                data={MILESTONE_OPTIONS}
                textField="text"
                valueField="id"
                value={disbMilestone}
                onChange={v => setDisbMilestone(v as string)}
              />
              <TextBox
                label="Disbursement Tranche Amount (INR) *"
                placeholder="e.g. 500000"
                value={disbAmount}
                onChange={v => setDisbAmount(v)}
              />
            </FormGrid>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Utilization Certificate & Delivery Audit Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Utilization certificate submitted for Milestone 1. Deliverables validated via industrial test results."
                value={disbRemarks}
                onChange={e => setDisbRemarks(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end">
              <Button
                label="Authorize Tranche Disbursement âœ“"
                variant="primary"
                type="submit"
              />
            </div>
          </form>
        </FormCard>

        {/* Audit log */}
        <FormCard title="STU Disbursement Audit Registry Log" icon="receipt">
          <div className="space-y-3 max-h-[520px] overflow-y-auto">
            {disbursedLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs"
              >
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{log.piName}</p>
                  <p className="text-slate-500 font-mono">
                    {log.agency} â€¢ Code: {log.code}
                  </p>
                  <p className="text-slate-400">
                    Milestone #{log.milestone} Tranche Released | {log.date}
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2.5 py-1.5 rounded-lg font-mono shrink-0">
                  â‚¹{log.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {disbursedLogs.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No disbursements recorded yet.
              </p>
            )}
          </div>

          {/* Project budget overview */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-extrabold text-slate-600 uppercase mb-3">
              Project Budget Overview
            </p>
            <GridPanel
              data={projects.map(p => ({
                ...p,
                remaining: p.approvedBudget - p.disbursedFunds,
                utilized:
                  p.approvedBudget > 0
                    ? `${Math.round((p.disbursedFunds / p.approvedBudget) * 100)}%`
                    : '0%',
              }))}
              columns={[
                { field: 'code', header: 'Code' },
                { field: 'piName', header: 'PI Name' },
                {
                  field: 'approvedBudget',
                  header: 'Budget',
                  cell: (item: ResearchManagement.Project) => (
                    <span className="font-mono text-xs">
                      â‚¹{item.approvedBudget.toLocaleString()}
                    </span>
                  ),
                },
                {
                  field: 'disbursedFunds',
                  header: 'Released',
                  cell: (item: ResearchManagement.Project) => (
                    <span className="font-mono text-xs text-indigo-700 font-bold">
                      â‚¹{item.disbursedFunds.toLocaleString()}
                    </span>
                  ),
                },
                {
                  field: 'ethicsStatus',
                  header: 'Ethics',
                  cell: (item: ResearchManagement.Project) => (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.ethicsStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700 animate-pulse'
                      }`}
                    >
                      {item.ethicsStatus}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
