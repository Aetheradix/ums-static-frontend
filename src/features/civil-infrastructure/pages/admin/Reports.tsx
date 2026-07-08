import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { civilWorks, raBills, contractors } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function AdminReports() {
  const totalAA = civilWorks.reduce((s, w) => s + w.aaAmount, 0);
  const totalContract = civilWorks.reduce((s, w) => s + w.contractAmount, 0);
  const totalPaid = raBills.filter(b => b.status === 'Paid').reduce((s, b) => s + b.netPayable, 0);

  return (
    <FormPage
      title="Civil Infrastructure — Reports"
      description="Summary reports for admin/VC review: financial position, work-wise status, and contractor performance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Reports' },
      ]}
    >
      {/* Summary Cards */}
      <div className="civil-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Works', value: String(civilWorks.length), color: '#2563eb' },
          { label: 'Total AA Sanctioned', value: `₹${(totalAA / 10000000).toFixed(2)} Cr`, color: '#7c3aed' },
          { label: 'Total Contract Value', value: `₹${(totalContract / 10000000).toFixed(2)} Cr`, color: '#0d9488' },
          { label: 'Total Paid (FY)', value: `₹${(totalPaid / 100000).toFixed(1)}L`, color: '#16a34a' },
        ].map(s => (
          <FormCard key={s.label}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.375rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </FormCard>
        ))}
      </div>

      {/* Work Status Report */}
      <FormCard title="Work-wise Status Report" subtitle="All registered civil works with lifecycle position">
        <GridPanel
          data={civilWorks}
          columns={[
            { field: 'workId', header: 'Work ID', cell: (w: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{w.workId}</span> },
            { field: 'name', header: 'Work Name' },
            { field: 'category', header: 'Category', cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.category}</span> },
            { field: 'aaAmount', header: 'AA Amount', cell: (w: any) => <span>₹{(w.aaAmount / 100000).toFixed(1)}L</span> },
            { field: 'contractAmount', header: 'Contract Amt', cell: (w: any) => w.contractAmount > 0 ? <span>₹{(w.contractAmount / 100000).toFixed(1)}L</span> : <span style={{ color: '#9ca3af' }}>—</span> },
            { field: 'physicalProgress', header: 'Physical %', cell: (w: any) => (
              <div className="civil-progress-bar-wrap">
                <div className="civil-progress-bar-track">
                  <div className={`civil-progress-bar-fill ${w.physicalProgress >= 75 ? 'high' : w.physicalProgress >= 40 ? 'medium' : 'low'}`} style={{ width: `${w.physicalProgress}%` }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', width: 28 }}>{w.physicalProgress}%</span>
              </div>
            ) },
            { field: 'status', header: 'Status', cell: (w: any) => <span className={`civil-pill ${['Completed','DLP Active'].includes(w.status) ? 'green' : w.status === 'In Progress' ? 'blue' : 'amber'}`}>{w.status}</span> },
          ]}
          searchBox searchPlaceholder="Filter works..."
          exportExcel
        />
      </FormCard>

      {/* Contractor Performance */}
      <div style={{ marginTop: '1.5rem' }}>
        <FormCard title="Contractor Performance" subtitle="Work completion history for registered contractors">
        <GridPanel
          data={contractors}
          columns={[
            { field: 'companyName', header: 'Contractor', cell: (c: any) => <span style={{ fontWeight: 600 }}>{c.companyName}</span> },
            { field: 'grade', header: 'Grade', cell: (c: any) => <span className="civil-pill blue">{c.grade}</span> },
            { field: 'completedWorks', header: 'Works Completed', cell: (c: any) => <span style={{ fontWeight: 700 }}>{c.completedWorks}</span> },
            { field: 'totalWorksDone', header: 'Total Value', cell: (c: any) => <span>₹{(c.totalWorksDone / 10000000).toFixed(2)} Cr</span> },
            { field: 'status', header: 'Vendor Status', cell: (c: any) => <span className={`civil-pill ${c.status === 'Active' ? 'green' : 'red'}`}>{c.status}</span> },
          ]}
        />
      </FormCard>

      {/* RA Bills Summary */}
      <div style={{ marginTop: '1.5rem' }}>
        <FormCard title="RA Bills Payment Register" subtitle="Running account bill payment positions">
        <GridPanel
          data={raBills}
          columns={[
            { field: 'billNo', header: 'Bill No', cell: (b: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{b.billNo}</span> },
            { field: 'workName', header: 'Work' },
            { field: 'contractorName', header: 'Contractor' },
            { field: 'grossAmount', header: 'Gross Amt', cell: (b: any) => <span>₹{(b.grossAmount / 100000).toFixed(2)}L</span> },
            { field: 'advanceRecovery', header: 'Adv. Recovery', cell: (b: any) => <span style={{ color: '#d97706' }}>-₹{(b.advanceRecovery / 1000).toFixed(0)}K</span> },
            { field: 'securityDeposit', header: 'SD Deducted', cell: (b: any) => <span style={{ color: '#7c3aed' }}>-₹{(b.securityDeposit / 1000).toFixed(0)}K</span> },
            { field: 'netPayable', header: 'Net Payable', cell: (b: any) => <span style={{ fontWeight: 700 }}>₹{(b.netPayable / 100000).toFixed(2)}L</span> },
            { field: 'status', header: 'Status', cell: (b: any) => <span className={`civil-pill ${b.status === 'Paid' ? 'green' : b.status === 'Rejected' ? 'red' : 'amber'}`}>{b.status}</span> },
          ]}
          exportExcel
        />
      </FormCard>
      </div>
      </div>
    </FormPage>
  );
}
