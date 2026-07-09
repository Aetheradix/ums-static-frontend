import { useEffect, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { civilWorks, raBills, mbEntries } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState = { visible: boolean; work?: any };

export default function MBReport() {
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [mbList, setMbList] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_mb_entries');
    return saved ? JSON.parse(saved) : mbEntries;
  });

  const [bills, setBills] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : raBills;
  });

  const [popup, setPopup] = useState<PopupState>({ visible: false });

  // Sync state on storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) setWorks(JSON.parse(savedWorks));
      const savedMB = localStorage.getItem('civil_mb_entries');
      if (savedMB) setMbList(JSON.parse(savedMB));
      const savedBills = localStorage.getItem('civil_ra_bills');
      if (savedBills) setBills(JSON.parse(savedBills));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Compute work-wise aggregated values
  const reportData = works.map((w: any) => {
    const workBills = bills.filter((b: any) => b.workId === w.id || b.workName === w.name);
    const workMBs = mbList.filter((m: any) => m.workId === w.id);

    const totalGross = workBills.reduce((sum, b) => sum + (b.grossAmount || 0), 0);
    const totalDeductions = workBills.reduce((sum, b) => sum + (Number(b.advanceRecovery) || 0) + (Number(b.securityDeposit) || 0), 0);
    const totalNetPaid = workBills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.netPayable || 0), 0);
    
    // Estimate total advance taken as 10% of contract value if not defined
    const contractVal = w.contractAmount || w.estimatedCost || 15000000;
    const totalAdvanceTaken = Math.round(contractVal * 0.1); 
    
    const totalAdvanceDeducted = workBills.reduce((sum, b) => sum + (Number(b.advanceRecovery) || Number(b.advanceAdjusted) || 0), 0);

    const approvedBillsCount = workBills.filter(b => b.status === 'Paid' || b.status === 'Approved').length;
    const pendingBillsCount = workBills.filter(b => b.status === 'Submitted' || b.status === 'Verified').length;

    return {
      ...w,
      contractVal,
      totalGross,
      totalDeductions,
      totalNetPaid,
      totalAdvanceTaken,
      totalAdvanceDeducted,
      approvedBillsCount,
      pendingBillsCount,
      totalBillsCount: workBills.length,
      workBills,
      workMBs,
    };
  });

  return (
    <FormPage
      title="E-Measurement Book (E-MB) Status Report"
      description="Work-wise analysis of measurement books, advances taken, recovery balances, and RA bill clearance cycles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'E-MB Report' },
      ]}
    >
      <FormCard title="Work-wise Measurement & Payment Aggregates" subtitle="Comprehensive statement of running bills and mobilization advances.">
        <GridPanel
          data={reportData}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workId',
              header: 'Work ID',
              cell: (r: any) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>
                  {r.workId}
                </span>
              ),
            },
            { field: 'name', header: 'Work Name' },
            {
              field: 'contractVal',
              header: 'Tender Value (₹)',
              cell: (r: any) => <span>₹{(r.contractVal / 100000).toFixed(2)}L</span>,
            },
            {
              field: 'totalAdvanceTaken',
              header: 'Advance Taken (₹)',
              cell: (r: any) => <span style={{ color: '#2563eb' }}>₹{(r.totalAdvanceTaken / 100000).toFixed(2)}L</span>,
            },
            {
              field: 'totalAdvanceDeducted',
              header: 'Adv. Deducted (₹)',
              cell: (r: any) => <span style={{ color: '#ef4444' }}>₹{(r.totalAdvanceDeducted / 100000).toFixed(2)}L</span>,
            },
            {
              field: 'totalNetPaid',
              header: 'Net Paid (₹)',
              cell: (r: any) => <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{(r.totalNetPaid / 100000).toFixed(2)}L</span>,
            },
            {
              field: 'totalBillsCount',
              header: 'Bills (Approved/Tot)',
              cell: (r: any) => (
                <span className="civil-pill blue">
                  {r.approvedBillsCount} / {r.totalBillsCount}
                </span>
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (r: any) => (
                <Button
                  size="small"
                  label="View Statement"
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ visible: true, work: r })}
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search works..."
          exportExcel
        />
      </FormCard>

      <FormPopup
        visible={popup.visible}
        onHide={() => setPopup({ visible: false })}
        title={popup.work ? `E-MB Ledger Summary — ${popup.work.workId}` : 'E-MB Statement'}
        subtitle="Work-wise measurements logs and detailed running bill breakdown."
        size="lg"
      >
        {popup.work && (() => {
          const w = popup.work;
          return (
            <>
              {/* Financial Balance Summary */}
              <div className="civil-stats-grid" style={{ marginBottom: '1.25rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[
                  { label: 'Tender Cost', value: `₹${(w.contractVal / 100000).toFixed(2)}L`, color: '#111827' },
                  { label: 'Mobilization Adv.', value: `₹${(w.totalAdvanceTaken / 100000).toFixed(2)}L`, color: '#2563eb' },
                  { label: 'Advance Recovered', value: `₹${(w.totalAdvanceDeducted / 100000).toFixed(2)}L`, color: '#ef4444' },
                  { label: 'Total Paid (Net)', value: `₹${(w.totalNetPaid / 100000).toFixed(2)}L`, color: '#16a34a' },
                ].map(stat => (
                  <div key={stat.label} style={{ padding: '0.875rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: stat.color }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* MB Entries Log */}
              <FormCard title="Measurement Book (MB) Entries log" subtitle="Quantities executed and verified by Site Engineer.">
                {w.workMBs.length > 0 ? (
                  <table className="civil-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>MB No</th>
                        <th>SOR/BOQ Item</th>
                        <th>Executed Qty</th>
                        <th>Bill Rate</th>
                        <th>Deductions Check</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {w.workMBs.map((mb: any) => (
                        <tr key={mb.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{mb.mbNo}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{mb.sorCode}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{mb.description}</div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{mb.executedQty} {mb.unit}</td>
                          <td>₹{mb.govtRate}</td>
                          <td style={{ fontSize: '0.75rem', color: '#d97706' }}>
                            Adv Deduct: ₹{mb.advanceAdjusted?.toLocaleString('en-IN') || '0'}
                          </td>
                          <td>
                            <span className={`civil-pill ${mb.status === 'Approved by EE' || mb.status === 'Verified' ? 'green' : 'blue'}`}>
                              {mb.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '1rem', color: '#9ca3af', textAlign: 'center', fontSize: '0.8125rem' }}>
                    No measurement book entries logged for this project.
                  </div>
                )}
              </FormCard>

              {/* Running Account Bills Log */}
              <div style={{ marginTop: '1.25rem' }}>
                <FormCard title="Running Account (RA) Bills History" subtitle="Breakdown of mobilization deductions and net cleared payments.">
                  {w.workBills.length > 0 ? (
                    <table className="civil-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Bill No</th>
                          <th>Gross Value</th>
                          <th>Advance Deduct</th>
                          <th>SD Deduct</th>
                          <th>Net Paid</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {w.workBills.map((b: any) => (
                          <tr key={b.billNo}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{b.billNo}</td>
                            <td>₹{b.grossAmount?.toLocaleString('en-IN')}</td>
                            <td style={{ color: '#ef4444' }}>-₹{b.advanceRecovery?.toLocaleString('en-IN')}</td>
                            <td style={{ color: '#7c3aed' }}>-₹{b.securityDeposit?.toLocaleString('en-IN')}</td>
                            <td style={{ fontWeight: 700, color: '#16a34a' }}>₹{b.netPayable?.toLocaleString('en-IN')}</td>
                            <td>
                              <span className={`civil-pill ${b.status === 'Paid' ? 'green' : b.status === 'Rejected' ? 'red' : 'amber'}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '1rem', color: '#9ca3af', textAlign: 'center', fontSize: '0.8125rem' }}>
                      No bills processed yet.
                    </div>
                  )}
                </FormCard>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  label="Close"
                  variant="outlined"
                  onClick={() => setPopup({ visible: false })}
                />
              </div>
            </>
          );
        })()}
      </FormPopup>
    </FormPage>
  );
}
