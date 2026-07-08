import { useState } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { civilWorks as initialWorks, raBills as initialBills } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function BudgetAllocation() {
  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [bills] = useState(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  // Budget allocation view
  const allocations = works.map((w: any) => {
    const utilized = bills
      .filter((b: any) => b.workId === w.id && (b.status === 'Paid' || b.status === 'Finance Cleared'))
      .reduce((s: number, b: any) => s + b.netPayable, 0);

    return {
      id: w.id,
      workId: w.workId,
      workName: w.name,
      category: w.category,
      department: w.department,
      workBasis: w.workBasis,
      fundingSource: w.fundingSource,
      aaAmount: w.aaAmount || w.estimatedCost * 0.98,
      tsAmount: w.tsAmount || 0,
      utilizedAmount: utilized,
      utilizationPct: w.tsAmount > 0 ? Math.round((utilized / w.tsAmount) * 100) : 0,
    };
  });

  const totalTs = allocations.reduce((s: number, a: any) => s + a.tsAmount, 0);
  const totalUtilized = allocations.reduce((s: number, a: any) => s + a.utilizedAmount, 0);

  return (
    <FormPage
      title="Budget Allocation Register"
      description="Finance view of approved TS allocations per work, utilization tracking, and available balance by funding source."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'Budget Allocation' },
      ]}
    >
      {/* Summary */}
      <div className="civil-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total TS Allocation', value: `₹${(totalTs / 10000000).toFixed(2)} Cr`, color: '#7c3aed' },
          { label: 'Utilized', value: `₹${(totalUtilized / 100000).toFixed(1)}L`, color: '#16a34a' },
          { label: 'Balance Available', value: `₹${((totalTs - totalUtilized) / 100000).toFixed(1)}L`, color: '#2563eb' },
          { label: 'Overall Utilization', value: `${totalTs > 0 ? ((totalUtilized / totalTs) * 100).toFixed(1) : 0}%`, color: '#d97706' },
        ].map(s => (
          <FormCard key={s.label}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </FormCard>
        ))}
      </div>

      <FormCard title="Work-wise Budget Register" subtitle="TS Allocation vs. utilization as of today">
        <GridPanel
          data={allocations}
          columns={[
            { field: 'workId', header: 'Work ID', cell: (a: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{a.workId}</span> },
            { field: 'workName', header: 'Work Name' },
            { field: 'category', header: 'Work Type', cell: (a: any) => <span style={{ fontSize: '0.75rem' }}>{a.category}</span> },
            { field: 'department', header: 'Category' },
            { field: 'workBasis', header: 'Work Basis', cell: (a: any) => <span className={`civil-pill ${a.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}>{a.workBasis ?? 'SOR Based'}</span> },
            { field: 'fundingSource', header: 'Funding', cell: (a: any) => <span className="civil-pill teal" style={{ fontSize: '0.65rem' }}>{a.fundingSource}</span> },
            { field: 'tsAmount', header: 'TS Amount (₹)', cell: (a: any) => <span style={{ fontWeight: 600 }}>₹{(a.tsAmount / 100000).toFixed(2)}L</span> },
            { field: 'utilizedAmount', header: 'Utilized (₹)', cell: (a: any) => <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{(a.utilizedAmount / 100000).toFixed(2)}L</span> },
            { field: 'utilizationPct', header: 'Utilization %', cell: (a: any) => (
              <div className="civil-progress-bar-wrap">
                <div className="civil-progress-bar-track">
                  <div className={`civil-progress-bar-fill ${a.utilizationPct >= 75 ? 'high' : a.utilizationPct >= 40 ? 'medium' : 'low'}`} style={{ width: `${a.utilizationPct}%` }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', width: 32 }}>{a.utilizationPct}%</span>
              </div>
            ) },
            { field: 'tsAmount', header: 'Balance (₹)', cell: (a: any) => <span style={{ fontWeight: 700, color: '#2563eb' }}>₹{((a.tsAmount - a.utilizedAmount) / 100000).toFixed(2)}L</span> },
          ]}
          searchBox searchPlaceholder="Filter allocations..."
          exportExcel
        />
      </FormCard>
    </FormPage>
  );
}
