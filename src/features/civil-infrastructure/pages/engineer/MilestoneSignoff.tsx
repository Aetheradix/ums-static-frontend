import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type Milestone,
  civilWorks,
  milestones as initialData,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function MilestoneSignoff() {
  // One-time clean reset of milestones and requests to clear previously completed mock data
  if (!localStorage.getItem('civil_milestones_clean_reset_v3')) {
    localStorage.removeItem('civil_milestones');
    localStorage.removeItem('civil_milestone_payment_requests');
    localStorage.setItem('civil_milestones_clean_reset_v3', 'true');
  }

  const [data, setData] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('civil_milestones');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = parsed.map((m: any) => {
        const mockM = initialData.find((mw: any) => mw.id === m.id);
        if (mockM && mockM.qualityTestRequired) {
          return {
            ...m,
            testName: m.testName || mockM.testName,
            testType: m.testType || mockM.testType,
            materialTested: m.materialTested || mockM.materialTested,
            labName: m.labName || mockM.labName,
            requiredValue: m.requiredValue || mockM.requiredValue,
          };
        }
        return m;
      });
      const parsedIds = new Set(merged.map((m: any) => m.id));
      const missing = initialData.filter((m: any) => !parsedIds.has(m.id));
      const finalMerged = [...merged, ...missing];
      localStorage.setItem('civil_milestones', JSON.stringify(finalMerged));
      return finalMerged;
    }
    return initialData;
  });

  const [selectedWorkId, setSelectedWorkId] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'signoff' | 'view' | 'view_request';
    item?: Milestone;
    requestItem?: any;
  }>({ mode: 'closed' });

  const [remarks, setRemarks] = useState('');

  const [paymentRequests, setPaymentRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestone_payment_requests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('civil_milestone_payment_requests');
      if (saved) {
        setPaymentRequests(JSON.parse(saved));
      }
      const savedMilestones = localStorage.getItem('civil_milestones');
      if (savedMilestones) {
        setData(JSON.parse(savedMilestones));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const canSignOff = (m: Milestone) => {
    const req = paymentRequests.find(r => r.milestoneId === m.id);
    if (
      req &&
      (req.status === 'Pending Admin Approval' ||
        req.status === 'Approved by Admin')
    ) {
      return false;
    }
    const s = m.status as string;
    return s === 'In Progress' || s === 'Delayed' || s === 'Completed';
  };

  const handleSignOff = (item: Milestone) => {
    if (!remarks.trim()) {
      ToastService.error('Justification remarks are required.');
      return;
    }

    const work = civilWorks.find(w => w.id === item.workId);
    const contractAmt = work?.contractAmount || work?.estimatedCost || 15000000; // fallback default
    const contractorName =
      work?.externalAgency || 'Sharma Constructions Pvt Ltd';
    const releaseAmt = contractAmt * (item.weightage / 100);

    const savedRequests = localStorage.getItem(
      'civil_milestone_payment_requests'
    );
    const requestsList = savedRequests ? JSON.parse(savedRequests) : [];
    const newReq = {
      id: String(Date.now()),
      workId: item.workId,
      workName: work?.name || item.workName,
      milestoneId: item.id,
      milestoneName: item.milestoneName,
      sequenceNo: item.sequenceNo,
      contractorId: (work as any)?.l1ContractorId || 'CON-001',
      contractorName: contractorName,
      weightage: item.weightage,
      amountToRelease: releaseAmt,
      status: 'Pending Admin Approval',
      requestDate: new Date().toISOString().split('T')[0],
      remarks: remarks.trim(),
    };

    const updatedRequests = [...requestsList, newReq];
    localStorage.setItem(
      'civil_milestone_payment_requests',
      JSON.stringify(updatedRequests)
    );
    setPaymentRequests(updatedRequests);

    const updatedMilestones = data.map((m: any) =>
      m.id === item.id
        ? {
            ...m,
            status: 'Pending Sign-off' as any,
          }
        : m
    );
    setData(updatedMilestones);
    localStorage.setItem('civil_milestones', JSON.stringify(updatedMilestones));

    ToastService.success(
      'Milestone sign-off & payment release request submitted to Admin.'
    );
    window.dispatchEvent(new Event('storage'));
    setPopup({ mode: 'closed' });
    setRemarks('');
    setSelectedWorkId('');
    setSelectedMilestoneId('');
  };

  const statusCls = (s: string) => {
    if (
      s === 'Completed' ||
      s === 'Payment Released' ||
      s === 'Approved by Admin'
    )
      return 'green';
    if (s === 'In Progress') return 'blue';
    if (s === 'Delayed' || s === 'Quality Fail' || s === 'Rejected by Admin')
      return 'red';
    if (s === 'Pending Sign-off' || s === 'Pending Admin Approval')
      return 'amber';
    return 'gray';
  };

  const gridData = data.filter(m => {
    const req = paymentRequests.find(r => r.milestoneId === m.id);
    return canSignOff(m) || !!req;
  });

  return (
    <FormPage
      title="Milestone Sign-offs"
      description="Milestone sign-off is blocked if any mandatory quality test is failed or pending. Next phases cannot begin without sign-off."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Milestone Sign-offs' },
      ]}
    >
      <div
        style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#92400e',
          marginBottom: '1.25rem',
        }}
      >
        <strong>🚫 Dependency Rule:</strong> A milestone CANNOT be signed off
        and the subsequent phase CANNOT begin if: (a) a mandatory material test
        has failed, or (b) a test result has not been uploaded by the lab.
      </div>

      <FormCard
        title="Milestone Sign-off & Payment Readiness"
        subtitle="Manage and apply for sign-off releases on completed milestones."
        headerAction={
          <Button
            label="Apply Milestone Release"
            icon="plus"
            variant="primary"
            onClick={() => {
              setRemarks('');
              setSelectedWorkId('');
              setSelectedMilestoneId('');
              setPopup({ mode: 'signoff' });
            }}
          />
        }
      >
        <GridPanel
          data={gridData}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workName',
              header: 'Work',
              cell: (m: Milestone) => (
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {civilWorks.find(w => w.id === m.workId)?.workId}
                </span>
              ),
            },
            {
              field: 'sequenceNo',
              header: 'Seq.',
              cell: (m: Milestone) => (
                <span style={{ fontWeight: 700 }}>#{m.sequenceNo}</span>
              ),
            },
            {
              field: 'milestoneName',
              header: 'Milestone',
              cell: (m: Milestone) => (
                <span style={{ fontWeight: 600 }}>{m.milestoneName}</span>
              ),
            },
            {
              field: 'weightage',
              header: 'Weightage',
              cell: (m: Milestone) => (
                <span style={{ fontWeight: 700 }}>{m.weightage}%</span>
              ),
            },
            { field: 'plannedEndDate', header: 'Planned End' },

            {
              field: 'status',
              header: 'Status / Workflow',
              cell: (m: Milestone) => {
                const req = paymentRequests.find(r => r.milestoneId === m.id);
                const currentStatus = req ? req.status : m.status;
                return (
                  <span className={`civil-pill ${statusCls(currentStatus)}`}>
                    {currentStatus}
                  </span>
                );
              },
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: Milestone) => {
                const req = paymentRequests.find(
                  r => r.milestoneId === item.id
                );
                return (
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <Button
                      size="small"
                      label=""
                      icon="eye"
                      variant="outlined"
                      onClick={() => setPopup({ mode: 'view', item })}
                    />
                    {req ? (
                      <Button
                        size="small"
                        label="View Request"
                        icon="file"
                        variant="outlined"
                        onClick={() =>
                          setPopup({ mode: 'view_request', requestItem: req })
                        }
                      />
                    ) : (
                      canSignOff(item) && (
                        <Button
                          size="small"
                          label="Apply Release"
                          icon="check-circle"
                          variant="primary"
                          onClick={() => {
                            setRemarks('');
                            setSelectedWorkId(item.workId);
                            setSelectedMilestoneId(item.id);
                            setPopup({ mode: 'signoff', item });
                          }}
                        />
                      )
                    )}
                  </div>
                );
              },
            },
          ]}
          searchBox
          searchPlaceholder="Search milestones..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view_request'
            ? `Release Request — ${popup.requestItem?.milestoneName}`
            : popup.item
              ? `Milestone — ${popup.item?.milestoneName}`
              : 'Apply Milestone Sign-off & Payment Release'
        }
        subtitle={
          popup.mode === 'signoff'
            ? 'Apply for sign-off & payment release authorization.'
            : 'Details of milestone stage and request logs.'
        }
        size="lg"
      >
        {popup.mode === 'view_request' && popup.requestItem && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem 2rem',
              fontSize: '0.8125rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.75rem',
            }}
          >
            {[
              ['Work ID / Name', popup.requestItem.workName],
              [
                'Milestone Stage',
                `${popup.requestItem.milestoneName} (Milestone ${popup.requestItem.sequenceNo})`,
              ],
              ['Contractor / Vendor', popup.requestItem.contractorName],
              ['Milestone Weightage', `${popup.requestItem.weightage}%`],
              [
                'Amount to Release',
                `₹${popup.requestItem.amountToRelease.toLocaleString('en-IN')}`,
              ],
              ['Request Date', popup.requestItem.requestDate],
              ['Status', popup.requestItem.status],
              ['Justification Remarks', popup.requestItem.remarks],
              ['Approval Date', popup.requestItem.approvalDate || '—'],
              ['Approval Remarks', popup.requestItem.approvalRemarks || '—'],
              ['Payment Date', popup.requestItem.paymentDate || '—'],
              ['Payment NEFT/UTR Ref', popup.requestItem.paymentRef || '—'],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  gridColumn:
                    k === 'Justification Remarks' ||
                    k === 'Approval Remarks' ||
                    k === 'Work ID / Name'
                      ? 'span 2'
                      : 'span 1',
                }}
              >
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
        )}

        {popup.mode === 'signoff' && (
          <>
            {!popup.item && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#4b5563',
                      display: 'block',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Select Work / Project *
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      outline: 'none',
                      background: '#fff',
                    }}
                    value={selectedWorkId}
                    onChange={e => {
                      setSelectedWorkId(e.target.value);
                      setSelectedMilestoneId('');
                    }}
                  >
                    <option value="">-- Choose Work --</option>
                    {civilWorks.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.workId} — {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedWorkId && (
                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#4b5563',
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Select Completed Milestone Stage *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: '#fff',
                      }}
                      value={selectedMilestoneId}
                      onChange={e => setSelectedMilestoneId(e.target.value)}
                    >
                      <option value="">-- Choose Milestone --</option>
                      {data
                        .filter(m => m.workId === selectedWorkId)
                        .map(m => {
                          const req = paymentRequests.find(
                            r => r.milestoneId === m.id
                          );
                          const isEligible = canSignOff(m);
                          let label = `${m.milestoneName} (Milestone #${m.sequenceNo})`;
                          const isActiveRequest =
                            req &&
                            (req.status === 'Pending Admin Approval' ||
                              req.status === 'Approved by Admin');

                          if (isActiveRequest) {
                            label += ` — Request Pending/Approved (${req.status})`;
                          } else if (req?.status === 'Payment Released') {
                            label += ' — Payment Released (Ready to Re-apply)';
                          } else if (!isEligible) {
                            label += ' — Not Started';
                          } else {
                            label += ' — Ready to Release';
                          }
                          return (
                            <option
                              key={m.id}
                              value={m.id}
                              disabled={isActiveRequest || !isEligible}
                            >
                              {label}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* If popup.item is defined OR a milestone is selected in the dropdown */}
            {(popup.item || selectedMilestoneId) &&
              (() => {
                const activeItem =
                  popup.item || data.find(m => m.id === selectedMilestoneId);
                if (!activeItem) return null;

                const work = civilWorks.find(w => w.id === activeItem.workId);
                const contractAmt =
                  work?.contractAmount || work?.estimatedCost || 15000000;
                const contractorName =
                  work?.externalAgency || 'Sharma Constructions Pvt Ltd';
                const releaseAmt = contractAmt * (activeItem.weightage / 100);

                const isEligible = canSignOff(activeItem);

                return (
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
                        ['Work / Project', work?.name || activeItem.workName],
                        ['Milestone', activeItem.milestoneName],
                        ['Weightage', `${activeItem.weightage}%`],
                        ['Contractor / Vendor', contractorName],
                        [
                          'Project Contract Value',
                          `₹${contractAmt.toLocaleString('en-IN')}`,
                        ],
                        [
                          'Release Amount (Calculated)',
                          `₹${releaseAmt.toLocaleString('en-IN')}`,
                        ],
                        ['Planned End', activeItem.plannedEndDate],
                        [
                          'QA Test Required',
                          activeItem.qualityTestRequired ? 'Yes' : 'No',
                        ],
                        ['QA Status', activeItem.qualityTestStatus ?? 'N/A'],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            gridColumn:
                              k === 'Work / Project' ? 'span 2' : 'span 1',
                          }}
                        >
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

                    {!isEligible && (
                      <div
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: '0.75rem',
                          padding: '0.875rem 1rem',
                          color: '#991b1b',
                          fontSize: '0.8125rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        ❌ This milestone stage is not currently in progress or
                        has already been signed off. Sign-off application is
                        blocked.
                      </div>
                    )}

                    {isEligible && (
                      <>
                        <div
                          style={{
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: '0.75rem',
                            padding: '0.875rem 1rem',
                            color: '#b45309',
                            fontSize: '0.8125rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          ⚠️ Clicking Submit will apply for Milestone Sign-off
                          and request a payment release of{' '}
                          <strong>₹{releaseAmt.toLocaleString('en-IN')}</strong>{' '}
                          to the Contractor.
                        </div>
                        <TextArea
                          label="Justification Remarks *"
                          placeholder="Detail the percentage progress of construction, field check status, and metrics achieved..."
                          value={remarks}
                          onChange={setRemarks}
                          rows={3}
                          required
                        />
                        <div className="flex justify-end gap-3 mt-4">
                          <Button
                            label="Cancel"
                            variant="outlined"
                            onClick={() => setPopup({ mode: 'closed' })}
                          />
                          <Button
                            label="Submit Sign-off & Payment Request"
                            variant="primary"
                            icon="send"
                            onClick={() => handleSignOff(activeItem)}
                          />
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
          </>
        )}

        {popup.mode === 'view' &&
          popup.item &&
          (() => {
            const work = civilWorks.find(w => w.id === popup.item!.workId);
            const contractAmt =
              work?.contractAmount || work?.estimatedCost || 15000000;
            const contractorName =
              work?.externalAgency || 'Sharma Constructions Pvt Ltd';
            const releaseAmt = contractAmt * (popup.item!.weightage / 100);

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem 2rem',
                  fontSize: '0.8125rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.75rem',
                }}
              >
                {[
                  ['Work / Project', work?.name || popup.item!.workName],
                  ['MilestoneName', popup.item!.milestoneName],
                  ['Weightage', `${popup.item!.weightage}%`],
                  ['Contractor / Vendor', contractorName],
                  [
                    'Project Contract Value',
                    `₹${contractAmt.toLocaleString('en-IN')}`,
                  ],
                  [
                    'Release Amount (Calculated)',
                    `₹${releaseAmt.toLocaleString('en-IN')}`,
                  ],
                  ['Planned End', popup.item!.plannedEndDate],
                  [
                    'QA Test Required',
                    popup.item!.qualityTestRequired ? 'Yes' : 'No',
                  ],
                  ['QA Status', popup.item!.qualityTestStatus ?? 'N/A'],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      gridColumn: k === 'Work / Project' ? 'span 2' : 'span 1',
                    }}
                  >
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
            );
          })()}
      </FormPopup>
    </FormPage>
  );
}
