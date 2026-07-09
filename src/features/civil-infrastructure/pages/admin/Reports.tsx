import { useState, useEffect } from 'react';
import { FormCard, FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { civilWorks, raBills, contractors, milestones as initialMilestones } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function AdminReports() {
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });
  const [milestonesList, setMilestonesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });
  const [paymentRequests, setPaymentRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestone_payment_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [bills, setBills] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_ra_bills');
    return saved ? JSON.parse(saved) : raBills;
  });

  const [popup, setPopup] = useState<{ visible: boolean; work?: any }>({ visible: false });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) setWorks(JSON.parse(savedWorks));
      const savedMilestones = localStorage.getItem('civil_milestones');
      if (savedMilestones) setMilestonesList(JSON.parse(savedMilestones));
      const savedRequests = localStorage.getItem('civil_milestone_payment_requests');
      if (savedRequests) setPaymentRequests(JSON.parse(savedRequests));
      const savedBills = localStorage.getItem('civil_ra_bills');
      if (savedBills) setBills(JSON.parse(savedBills));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const totalAA = works.reduce((s, w) => s + w.aaAmount, 0);
  const totalContract = works.reduce((s, w) => s + w.contractAmount, 0);
  const totalPaid = bills
    .filter(b => b.status === 'Paid')
    .reduce((s, b) => s + b.netPayable, 0);

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
          {
            label: 'Total Works',
            value: String(civilWorks.length),
            color: '#2563eb',
          },
          {
            label: 'Total AA Sanctioned',
            value: `₹${(totalAA / 10000000).toFixed(2)} Cr`,
            color: '#7c3aed',
          },
          {
            label: 'Total Contract Value',
            value: `₹${(totalContract / 10000000).toFixed(2)} Cr`,
            color: '#0d9488',
          },
          {
            label: 'Total Paid (FY)',
            value: `₹${(totalPaid / 100000).toFixed(1)}L`,
            color: '#16a34a',
          },
        ].map(s => (
          <FormCard key={s.label}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '0.375rem',
              }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}
            >
              {s.value}
            </div>
          </FormCard>
        ))}
      </div>

      {/* Work Status Report */}
      <FormCard
        title="Work-wise Status Report"
        subtitle="All registered civil works with lifecycle position"
      >
        <GridPanel
          data={works}
          columns={[
            {
              field: 'workId',
              header: 'Work ID',
              cell: (w: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {w.workId}
                </span>
              ),
            },
            { field: 'name', header: 'Work Name' },
            {
              field: 'category',
              header: 'Category',
              cell: (w: any) => (
                <span style={{ fontSize: '0.75rem' }}>{w.category}</span>
              ),
            },
            {
              field: 'aaAmount',
              header: 'AA Amount',
              cell: (w: any) => (
                <span>₹{(w.aaAmount / 100000).toFixed(1)}L</span>
              ),
            },
            {
              field: 'contractAmount',
              header: 'Contract Amt',
              cell: (w: any) =>
                w.contractAmount > 0 ? (
                  <span>₹{(w.contractAmount / 100000).toFixed(1)}L</span>
                ) : (
                  <span style={{ color: '#9ca3af' }}>—</span>
                ),
            },
            {
              field: 'physicalProgress',
              header: 'Physical %',
              cell: (w: any) => (
                <div className="civil-progress-bar-wrap">
                  <div className="civil-progress-bar-track">
                    <div
                      className={`civil-progress-bar-fill ${w.physicalProgress >= 75 ? 'high' : w.physicalProgress >= 40 ? 'medium' : 'low'}`}
                      style={{ width: `${w.physicalProgress}%` }}
                    />
                  </div>
                  <span
                    style={{ fontSize: '0.7rem', color: '#6b7280', width: 28 }}
                  >
                    {w.physicalProgress}%
                  </span>
                </div>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (w: any) => (
                <span
                  className={`civil-pill ${['Completed', 'DLP Active'].includes(w.status) ? 'green' : w.status === 'In Progress' ? 'blue' : 'amber'}`}
                >
                  {w.status}
                </span>
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (w: any) => (
                <Button
                  size="small"
                  label="Preview"
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ visible: true, work: w })}
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Filter works..."
          exportExcel
        />
      </FormCard>

      {/* Contractor Performance */}
      <div style={{ marginTop: '1.5rem' }}>
        <FormCard
          title="Contractor Performance"
          subtitle="Work completion history for registered contractors"
        >
          <GridPanel
            data={contractors}
            columns={[
              {
                field: 'companyName',
                header: 'Contractor',
                cell: (c: any) => (
                  <span style={{ fontWeight: 600 }}>{c.companyName}</span>
                ),
              },
              {
                field: 'grade',
                header: 'Grade',
                cell: (c: any) => (
                  <span className="civil-pill blue">{c.grade}</span>
                ),
              },
              {
                field: 'completedWorks',
                header: 'Works Completed',
                cell: (c: any) => (
                  <span style={{ fontWeight: 700 }}>{c.completedWorks}</span>
                ),
              },
              {
                field: 'totalWorksDone',
                header: 'Total Value',
                cell: (c: any) => (
                  <span>₹{(c.totalWorksDone / 10000000).toFixed(2)} Cr</span>
                ),
              },
              {
                field: 'status',
                header: 'Vendor Status',
                cell: (c: any) => (
                  <span
                    className={`civil-pill ${c.status === 'Active' ? 'green' : 'red'}`}
                  >
                    {c.status}
                  </span>
                ),
              },
            ]}
          />
        </FormCard>

        {/* RA Bills Summary */}
        <div style={{ marginTop: '1.5rem' }}>
          <FormCard
            title="RA Bills Payment Register"
            subtitle="Running account bill payment positions"
          >
            <GridPanel
              data={raBills}
              columns={[
                {
                  field: 'billNo',
                  header: 'Bill No',
                  cell: (b: any) => (
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {b.billNo}
                    </span>
                  ),
                },
                { field: 'workName', header: 'Work' },
                { field: 'contractorName', header: 'Contractor' },
                {
                  field: 'grossAmount',
                  header: 'Gross Amt',
                  cell: (b: any) => (
                    <span>₹{(b.grossAmount / 100000).toFixed(2)}L</span>
                  ),
                },
                {
                  field: 'advanceRecovery',
                  header: 'Adv. Recovery',
                  cell: (b: any) => (
                    <span style={{ color: '#d97706' }}>
                      -₹{(b.advanceRecovery / 1000).toFixed(0)}K
                    </span>
                  ),
                },
                {
                  field: 'securityDeposit',
                  header: 'SD Deducted',
                  cell: (b: any) => (
                    <span style={{ color: '#7c3aed' }}>
                      -₹{(b.securityDeposit / 1000).toFixed(0)}K
                    </span>
                  ),
                },
                {
                  field: 'netPayable',
                  header: 'Net Payable',
                  cell: (b: any) => (
                    <span style={{ fontWeight: 700 }}>
                      ₹{(b.netPayable / 100000).toFixed(2)}L
                    </span>
                  ),
                },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (b: any) => (
                    <span
                      className={`civil-pill ${b.status === 'Paid' ? 'green' : b.status === 'Rejected' ? 'red' : 'amber'}`}
                    >
                      {b.status}
                    </span>
                  ),
                },
              ]}
              exportExcel
            />
          </FormCard>
        </div>
      </div>

      <FormPopup
        visible={popup.visible}
        onHide={() => setPopup({ visible: false })}
        title={popup.work ? `Project Lifecycle Position — ${popup.work.workId}` : 'Project Details'}
        subtitle="Consolidated technical logs, milestone progress, and financial release positions."
        size="lg"
      >
        {popup.work && (() => {
          const w = popup.work;
          const workMs = milestonesList.filter((m: any) => m.workId === w.id);
          const workRequests = paymentRequests.filter((r: any) => r.workId === w.id);
          const workRaBills = bills.filter((b: any) => b.workId === w.id || b.workName === w.name);

          const totalPaidOnWork = workRaBills
            .filter((b: any) => b.status === 'Paid')
            .reduce((sum: number, b: any) => sum + b.netPayable, 0) + 
            workRequests
            .filter((r: any) => r.status === 'Payment Released')
            .reduce((sum: number, r: any) => sum + r.amountToRelease, 0);

          return (
            <>
              {/* Project Card Info */}
              <FormCard title="Project Sanction & Executive Info" subtitle="">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem 1.5rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  {[
                    ['Work ID', w.workId],
                    ['Work Name', w.name],
                    ['Category', w.category],
                    ['Department', w.department],
                    ['Campus', w.campus],
                    ['Execution Route', w.executionRoute || 'Tender / L1 Agency'],
                    ['Estimated Cost', `₹${(w.estimatedCost / 100000).toFixed(2)}L`],
                    ['AA Amount', `₹${(w.aaAmount / 100000).toFixed(2)}L`],
                    ['Contract Value', w.contractAmount > 0 ? `₹${(w.contractAmount / 100000).toFixed(2)}L` : '—'],
                    ['Site Engineer', w.siteEngineer || 'Er. Rajesh Verma'],
                    ['Contractor / Agency', w.externalAgency || 'Sharma Constructions Pvt Ltd'],
                    ['Overall Status', w.status],
                  ].map(([k, v]) => (
                    <div key={k} style={{ gridColumn: k === 'Work Name' ? 'span 2' : 'span 1' }}>
                      <div
                        style={{
                          color: '#9ca3af',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          marginBottom: 2,
                        }}
                      >
                        {k}
                      </div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </FormCard>

              {/* Milestones Audit Section */}
              <div style={{ marginTop: '1.25rem' }}>
                <FormCard
                  title={`Milestones Status Audit (${workMs.length} Stages)`}
                  subtitle="Detailed weights, milestone timelines, and completion positions."
                >
                  {workMs.length > 0 ? (
                    <table className="civil-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Seq</th>
                          <th>Milestone Name</th>
                          <th>Weightage</th>
                          <th>Planned End</th>
                          <th>Actual End</th>
                          <th>Status / Workflow</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workMs.map((m: any) => {
                          const req = workRequests.find((r: any) => r.milestoneId === m.id);
                          const currentStatus = req ? req.status : m.status;
                          let statusCls = 'gray';
                          if (currentStatus === 'Completed' || currentStatus === 'Payment Released') statusCls = 'green';
                          if (currentStatus === 'In Progress') statusCls = 'blue';
                          if (currentStatus === 'Pending Sign-off' || currentStatus === 'Pending Admin Approval' || currentStatus === 'Approved by Admin') statusCls = 'amber';
                          if (currentStatus === 'Delayed' || currentStatus === 'Rejected by Admin') statusCls = 'red';

                          return (
                            <tr key={m.id}>
                              <td style={{ fontWeight: 700 }}>#{m.sequenceNo}</td>
                              <td style={{ fontWeight: 600 }}>{m.milestoneName}</td>
                              <td style={{ fontWeight: 700 }}>{m.weightage}%</td>
                              <td>{m.plannedEndDate}</td>
                              <td>{m.actualEndDate || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                              <td>
                                <span className={`civil-pill ${statusCls}`}>
                                  {currentStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '1rem', color: '#9ca3af', textAlign: 'center', fontSize: '0.8125rem' }}>
                      No milestones defined for this project.
                    </div>
                  )}
                </FormCard>
              </div>

              {/* Financial Ledger Section */}
              <div style={{ marginTop: '1.25rem' }}>
                <FormCard
                  title={`Financial Releases Ledger — Total Disbursed: ₹${totalPaidOnWork.toLocaleString('en-IN')}`}
                  subtitle="Running account bills and milestone sanction logs combined."
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    {/* RA Bills */}
                    <div>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2937' }}>
                        Running Account (RA) Bills
                      </h4>
                      {workRaBills.length > 0 ? (
                        <table className="civil-table" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <th>Bill No</th>
                              <th>Gross Amount</th>
                              <th>Deductions (Adv + SD)</th>
                              <th>Net Paid</th>
                              <th>Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workRaBills.map((b: any) => (
                              <tr key={b.billNo}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{b.billNo}</td>
                                <td>₹{b.grossAmount.toLocaleString('en-IN')}</td>
                                <td style={{ color: '#ef4444' }}>
                                  -₹{(b.advanceRecovery + b.securityDeposit).toLocaleString('en-IN')}
                                </td>
                                <td style={{ fontWeight: 700 }}>₹{b.netPayable.toLocaleString('en-IN')}</td>
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
                        <div style={{ padding: '0.75rem', color: '#9ca3af', fontSize: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                          No RA bills logged for this work.
                        </div>
                      )}
                    </div>

                    {/* Milestone Release Requests */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2937' }}>
                        Milestone Payment Requests
                      </h4>
                      {workRequests.length > 0 ? (
                        <table className="civil-table" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <th>Milestone</th>
                              <th>Requested Amt</th>
                              <th>Request Date</th>
                              <th>Approval Status</th>
                              <th>UTR / NEFT Reference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workRequests.map((r: any) => (
                              <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.milestoneName} (Seq #{r.sequenceNo})</td>
                                <td style={{ fontWeight: 700 }}>₹{Number(r.amountToRelease).toLocaleString('en-IN')}</td>
                                <td>{r.requestDate}</td>
                                <td>
                                  <span className={`civil-pill ${r.status === 'Payment Released' ? 'green' : r.status === 'Rejected by Admin' ? 'red' : 'amber'}`}>
                                    {r.status}
                                  </span>
                                </td>
                                <td style={{ fontFamily: 'monospace' }}>{r.paymentRef || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: '0.75rem', color: '#9ca3af', fontSize: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                          No milestone payments requested for this work.
                        </div>
                      )}
                    </div>
                  </div>
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
