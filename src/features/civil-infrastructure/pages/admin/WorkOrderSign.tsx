import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  workOrders as initialWorkOrders,
  contractors as initialContractors,
  civilWorks as initialWorks,
  milestones as initialMilestones,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function WorkOrderSign() {
  // Load data from localStorage
  const [workOrders, setWorkOrders] = useState(() => {
    const saved = localStorage.getItem('civil_work_orders');
    return saved ? JSON.parse(saved) : initialWorkOrders;
  });
  const [contractors] = useState(() => {
    const saved = localStorage.getItem('civil_contractors');
    return saved ? JSON.parse(saved) : initialContractors;
  });
  const [civilWorks] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });
  const [milestones] = useState(() => {
    const saved = localStorage.getItem('civil_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'sign';
    item?: any;
  }>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  const contractor = (id: string) => contractors.find((c: any) => c.id === id);

  const handleSign = () => {
    if (!popup.item) return;
    const updated = workOrders.map((w: any) =>
      w.id === popup.item.id
        ? {
            ...w,
            signedByContractor: true,
            signedByEE: true,
            status: 'Work Started' as any,
          }
        : w
    );
    setWorkOrders(updated);

    // Also update civil work status in localStorage to "In Progress"
    const updatedWorks = civilWorks.map((w: any) =>
      w.id === popup.item.workId || w.workId === popup.item.workId
        ? { ...w, status: 'In Progress' as any }
        : w
    );
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));

    ToastService.success(
      'Work Order digitally signed. Notice to Proceed issued. Project start timestamp recorded.'
    );
    setPopup({ mode: 'closed' });
  };

  const statusVariant = (s: string) =>
    s === 'Completed'
      ? 'approved'
      : s === 'Terminated'
        ? 'rejected'
        : s === 'Work Started'
          ? 'pending'
          : 'neutral';

  return (
    <FormPage
      title="Work Order & Agreement"
      description="Generate digitized contract. Upon digital signature, formally transmit Work Order (Notice to Proceed) and record project start timestamp."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Work Order & Agreement' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={workOrders}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workOrderNo',
              header: 'WO No',
              cell: (w: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {w.workOrderNo}
                </span>
              ),
            },
            { field: 'workName', header: 'Work Name' },
            {
              field: 'contractorName',
              header: 'Contractor',
              cell: (w: any) => (
                <span style={{ fontWeight: 600 }}>{w.contractorName}</span>
              ),
            },
            {
              field: 'tpiAgencyName' as any,
              header: 'TPI Agency',
              cell: (w: any) => (
                <span style={{ fontSize: '0.75rem' }}>
                  {w.tpiAgencyName ?? '—'}
                </span>
              ),
            },
            {
              field: 'qualityLabName' as any,
              header: 'Quality Lab',
              cell: (w: any) => (
                <span style={{ fontSize: '0.75rem' }}>
                  {w.qualityLabName ?? '—'}
                </span>
              ),
            },
            {
              field: 'contractAmount',
              header: 'Contract Amount',
              cell: (w: any) => (
                <span>₹{(w.contractAmount / 100000).toFixed(1)}L</span>
              ),
            },
            { field: 'commencementDate', header: 'Start Date' },
            { field: 'completionDate', header: 'Completion Date' },
            {
              field: 'signedByContractor',
              header: 'Contractor Sig.',
              cell: (w: any) =>
                w.signedByContractor ? (
                  <span className="civil-pill green">✓ Signed</span>
                ) : (
                  <span className="civil-pill amber">Pending</span>
                ),
            },
            {
              field: 'signedByEE',
              header: 'EE Sig.',
              cell: (w: any) =>
                w.signedByEE ? (
                  <span className="civil-pill green">✓ Signed</span>
                ) : (
                  <span className="civil-pill amber">Pending</span>
                ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (w: any) => (
                <StatusBadge
                  label={w.status}
                  variant={statusVariant(w.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {!item.signedByEE && (
                    <Button
                      size="small"
                      label="Sign & Issue WO"
                      icon="pen"
                      variant="primary"
                      onClick={() => {
                        setRemarks('');
                        setPopup({ mode: 'sign', item });
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search work orders..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'sign'
            ? `Sign & Issue WO — ${popup.item?.workOrderNo}`
            : `Work Order — ${popup.item?.workOrderNo}`
        }
        subtitle="Digital agreement signing. Work order triggers project start."
        size="lg"
      >
        {popup.item && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem 2rem',
                fontSize: '0.8125rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {[
                ['Work Order No', popup.item.workOrderNo],
                ['Work Name', popup.item.workName],
                ['Contractor', popup.item.contractorName],
                [
                  'Contract Amount',
                  `₹${(popup.item.contractAmount / 100000).toFixed(2)}L`,
                ],
                ['Commencement Date', popup.item.commencementDate],
                ['Scheduled Completion', popup.item.completionDate],
                [
                  'Advance Paid',
                  `₹${(popup.item.advancePaid / 100000).toFixed(2)}L`,
                ],
                [
                  'Security Deposit',
                  `₹${(popup.item.sdAmount / 100000).toFixed(2)}L (${popup.item.sdPercentage}%)`,
                ],
                [
                  'Advance Recovery Rate',
                  `${popup.item.advanceRecoveryRate}% per RA Bill`,
                ],
                [
                  'Contractor GST No',
                  contractor(popup.item.contractorId)?.gstNo ?? '—',
                ],
              ].map(([k, v]) => (
                <div key={k}>
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
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Project Details & Milestones Preview */}
            <div
              style={{
                marginTop: '1.5rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '1.25rem',
              }}
            >
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className="pi pi-flag" style={{ color: '#2563eb' }} />
                <span>Project Milestone & Payment Release Preview</span>
              </h4>

              {(() => {
                const workId = popup.item.workId;
                const work = civilWorks.find(
                  (w: any) => w.id === workId || w.workId === workId
                );
                const workMls = milestones.filter(
                  (m: any) => m.workId === workId || m.workId === work?.id
                );

                return (
                  <div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '1rem',
                        background: '#f0f9ff',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '0.75rem',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: '#0369a1',
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          Project Basis
                        </span>
                        <strong>{work?.workBasis ?? 'SOR Based'}</strong>
                      </div>
                      <div>
                        <span
                          style={{
                            color: '#0369a1',
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          Project Budget (Est.)
                        </span>
                        <strong>
                          ₹{(work?.estimatedCost ?? 0).toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div>
                        <span
                          style={{
                            color: '#0369a1',
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          Contract Value
                        </span>
                        <strong style={{ color: '#16a34a' }}>
                          ₹{popup.item.contractAmount.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {workMls.length === 0 ? (
                      <div
                        style={{
                          padding: '1rem',
                          textAlign: 'center',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.8125rem',
                          color: '#6b7280',
                        }}
                      >
                        No milestones defined for this work. Please define
                        milestones in "Milestone Definition" page first.
                      </div>
                    ) : (
                      <table
                        className="civil-table"
                        style={{ width: '100%', fontSize: '0.78rem' }}
                      >
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th style={{ padding: '0.375rem 0.5rem' }}>Seq</th>
                            <th style={{ padding: '0.375rem 0.5rem' }}>
                              Milestone Stage
                            </th>
                            <th
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'center',
                              }}
                            >
                              Release %
                            </th>
                            <th
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'right',
                              }}
                            >
                              Equivalent Payment
                            </th>
                            <th style={{ padding: '0.375rem 0.5rem' }}>
                              QA Gate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {workMls.map((m: any) => {
                            const releaseAmt =
                              (popup.item.contractAmount * m.weightage) / 100;
                            return (
                              <tr key={m.id}>
                                <td
                                  style={{
                                    padding: '0.375rem 0.5rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  #{m.sequenceNo}
                                </td>
                                <td style={{ padding: '0.375rem 0.5rem' }}>
                                  {m.milestoneName}
                                </td>
                                <td
                                  style={{
                                    padding: '0.375rem 0.5rem',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    color: '#2563eb',
                                  }}
                                >
                                  {m.weightage}%
                                </td>
                                <td
                                  style={{
                                    padding: '0.375rem 0.5rem',
                                    textAlign: 'right',
                                    fontWeight: 700,
                                    color: '#16a34a',
                                  }}
                                >
                                  ₹{releaseAmt.toLocaleString('en-IN')}
                                </td>
                                <td style={{ padding: '0.375rem 0.5rem' }}>
                                  {m.qualityTestRequired ? (
                                    <span
                                      className="civil-pill red"
                                      style={{ fontSize: '0.625rem' }}
                                    >
                                      TPI Required
                                    </span>
                                  ) : (
                                    <span style={{ color: '#9ca3af' }}>
                                      N/A
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          <tr
                            style={{ background: '#f9fafb', fontWeight: 700 }}
                          >
                            <td
                              colSpan={2}
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'right',
                              }}
                            >
                              Total Scheduled Release:
                            </td>
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'center',
                                color: '#2563eb',
                              }}
                            >
                              {workMls.reduce(
                                (s: number, m: any) => s + m.weightage,
                                0
                              )}
                              %
                            </td>
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'right',
                                color: '#16a34a',
                              }}
                            >
                              ₹
                              {workMls
                                .reduce(
                                  (s: number, m: any) =>
                                    s +
                                    (popup.item.contractAmount * m.weightage) /
                                      100,
                                  0
                                )
                                .toLocaleString('en-IN')}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })()}
            </div>

            {popup.mode === 'sign' && (
              <>
                <div
                  style={{
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '0.875rem',
                    padding: '1rem',
                    marginTop: '1.25rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem',
                    color: '#15803d',
                  }}
                >
                  <strong>Digital Signature Verification:</strong> This action
                  records the digital signatures of both the Executive Engineer
                  and the Contractor, formally transmits the Work Order (Notice
                  to Proceed), and timestamps the official project start.
                </div>
                <TextArea
                  label="EE Signing Remarks"
                  placeholder="Agreement signing notes..."
                  value={remarks}
                  onChange={setRemarks}
                  rows={2}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Sign & Issue Work Order (Notice to Proceed)"
                    variant="primary"
                    icon="pen"
                    onClick={handleSign}
                  />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
