import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type EOTRequest, eotRequests as initialData, civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const statusVariant = (s: string) =>
  s === 'Approved' ? 'approved' : s === 'Rejected' ? 'rejected' : s === 'Applied' || s === 'Under Review' ? 'pending' : 'neutral';

export default function AdminEOTRequest() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_eot_requests');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [popup, setPopup] = useState<{ mode: 'closed' | 'review'; item?: any }>({ mode: 'closed' });
  const [approvedDays, setApprovedDays] = useState('');
  const [approvedBudget, setApprovedBudget] = useState('');
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_eot_requests', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(works));
  }, [works]);

  const handleOpenReview = (item: any) => {
    setApprovedDays(String(item.daysRequested ?? ''));
    setApprovedBudget(String(item.additionalBudget ?? ''));
    setResolution(item.resolutionRemarks ?? '');
    setPopup({ mode: 'review', item });
  };

  const handleProcess = (approve: boolean) => {
    if (!popup.item) return;
    const item = popup.item;

    if (approve) {
      if (item.type === 'Extension of Time' && (!approvedDays || Number(approvedDays) <= 0)) {
        ToastService.error('Please specify valid approved days.');
        return;
      }
      if (item.type === 'Revised Estimate' && (!approvedBudget || Number(approvedBudget) <= 0)) {
        ToastService.error('Please specify valid approved budget.');
        return;
      }
    }

    // 1. Update EOT Request
    const updatedData = data.map((e: any) => {
      if (e.id === item.id) {
        return {
          ...e,
          status: (approve ? 'Approved' : 'Rejected') as any,
          approvedDays: item.type === 'Extension of Time' && approve ? Number(approvedDays) : undefined,
          approvedBudget: item.type === 'Revised Estimate' && approve ? Number(approvedBudget) : undefined,
          resolutionRemarks: resolution,
        };
      }
      return e;
    });
    setData(updatedData);

    // 2. If approved, update civil work timeline or budget
    if (approve) {
      const updatedWorks = works.map((w: any) => {
        if (w.id === item.workId || w.workId === item.workId) {
          if (item.type === 'Extension of Time') {
            const originalDate = w.expectedEndDate ? new Date(w.expectedEndDate) : new Date();
            const newDate = new Date(originalDate.getTime() + Number(approvedDays) * 24 * 60 * 60 * 1000);
            return {
              ...w,
              expectedEndDate: newDate.toISOString().split('T')[0],
            };
          } else if (item.type === 'Revised Estimate') {
            return {
              ...w,
              estimatedCost: w.estimatedCost + Number(approvedBudget),
              tsAmount: w.tsAmount ? (w.tsAmount + Number(approvedBudget)) : w.tsAmount,
            };
          }
        }
        return w;
      });
      setWorks(updatedWorks);
      ToastService.success(`Request approved. Project ${item.type === 'Extension of Time' ? 'schedule extended' : 'budget revised'} in system database.`);
    } else {
      ToastService.error('EOT Request application marked as Rejected.');
    }

    setPopup({ mode: 'closed' });
  };

  const pendingCount = data.filter((e: any) => e.status === 'Applied' || e.status === 'Under Review').length;
  const approvedEotCount = data.filter((e: any) => e.status === 'Approved' && e.type === 'Extension of Time').length;
  const totalRevisedAmt = data
    .filter((e: any) => e.status === 'Approved' && e.type === 'Revised Estimate')
    .reduce((s: number, e: any) => s + (e.approvedBudget ?? 0), 0);

  return (
    <FormPage
      title="EOT & Revised Estimate Decisions"
      description="Process contractor applications for project schedule extension (Extension of Time) or scope budget revision."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'EOT Requests' },
      ]}
    >
      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        <FormCard>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-exclamation-circle" style={{ fontSize: '1.2rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pendingCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Pending Applications</div>
            </div>
          </div>
        </FormCard>

        <FormCard>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-calendar-plus" style={{ fontSize: '1.2rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{approvedEotCount} Works</div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Approved Time Extensions</div>
            </div>
          </div>
        </FormCard>

        <FormCard>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-money-bill" style={{ fontSize: '1.2rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{(totalRevisedAmt / 100000).toFixed(1)} Lakh</div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Sanctioned Cost Escalation</div>
            </div>
          </div>
        </FormCard>
      </div>

      <FormCard title="EOT & Revised Estimate Applications Register">
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'eotNo', header: 'EOT No', cell: (e: EOTRequest) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: '0.75rem' }}>{e.eotNo}</span> },
            { field: 'workName', header: 'Work Name' },
            { field: 'type', header: 'Type',
              cell: (e: EOTRequest) => <span className={`civil-pill ${e.type === 'Extension of Time' ? 'blue' : 'amber'}`}>{e.type}</span> },
            { field: 'applicationDate', header: 'Applied' },
            { field: 'daysRequested', header: 'Request Value',
              cell: (e: EOTRequest) => e.daysRequested
                ? <span>{e.daysRequested} days</span>
                : <span>₹{(e.additionalBudget ?? 0).toLocaleString('en-IN')}</span> },
            { field: 'reason', header: 'Reason' },
            { field: 'status', header: 'Status', cell: (e: EOTRequest) => <StatusBadge label={e.status} variant={statusVariant(e.status)} /> },
            { field: 'id', header: 'Decision', sortable: false,
              cell: (item: EOTRequest) => (
                <Button
                  size="small"
                  label={['Applied', 'Under Review'].includes(item.status) ? 'Review' : 'View'}
                  icon={['Applied', 'Under Review'].includes(item.status) ? 'check-circle' : 'eye'}
                  variant={['Applied', 'Under Review'].includes(item.status) ? 'primary' : 'outlined'}
                  onClick={() => handleOpenReview(item)}
                />
              ) },
          ]}
          searchBox searchPlaceholder="Search EOT applications..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`EOT Request Review — ${popup.item?.eotNo}`}
        subtitle="Review contractor justification and record final resolution."
        size="lg"
      >
        {popup.item && (
          <>
            {/* Request Information Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem', marginBottom: '1rem' }}>
              {[
                ['Application Number', popup.item.eotNo],
                ['Work Name', popup.item.workName],
                ['Request Type', popup.item.type],
                ['Requested By', popup.item.requestedBy],
                ['Original Deadline', popup.item.originalEndDate],
                ['Proposed Deadline', popup.item.proposedEndDate || 'N/A'],
                ['Impact Metrics', popup.item.daysRequested ? `${popup.item.daysRequested} days delay` : `₹${(popup.item.additionalBudget ?? 0).toLocaleString('en-IN')} addition`],
                ['Reason category', popup.item.reason],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
              <div style={{ color: '#4b5563', fontWeight: 700, marginBottom: '0.25rem' }}>Contractor Justification:</div>
              <div style={{ color: '#1f2937', fontStyle: 'italic' }}>"{popup.item.justification}"</div>
            </div>

            {/* Resolution Fields */}
            {['Applied', 'Under Review'].includes(popup.item.status) ? (
              <>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                  Administrative Determination
                </h4>
                <FormGrid columns={2}>
                  {popup.item.type === 'Extension of Time' ? (
                    <TextBox
                      label="Approved Delay Extension (Days) *"
                      value={approvedDays}
                      onChange={setApprovedDays}
                      placeholder="e.g. 90"
                    />
                  ) : (
                    <TextBox
                      label="Sanctioned Revised Estimate Budget (₹) *"
                      value={approvedBudget}
                      onChange={setApprovedBudget}
                      placeholder="e.g. 250000"
                    />
                  )}
                  <div style={{ background: '#fef3c7', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', borderLeft: '3px solid #d97706', fontSize: '0.75rem', color: '#b45309', display: 'flex', alignItems: 'center' }}>
                    <span>Selecting "Approve" will modify contract milestones, expected completion, and budget figures in active registries.</span>
                  </div>
                </FormGrid>
                <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                  <TextArea
                    label="Executive Engineer Resolution Remarks *"
                    placeholder="Provide comments, reasons, or details of approval/rejection..."
                    value={resolution}
                    onChange={setResolution}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4 border-top pt-4">
                  <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
                  <Button label="Reject Application" variant="danger" icon="times" onClick={() => handleProcess(false)} />
                  <Button label="Approve Application" variant="primary" icon="check" onClick={() => handleProcess(true)} />
                </div>
              </>
            ) : (
              <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #9ca3af', fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 700, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  EE Decision Resolution Profile ({popup.item.status})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Approved Extension:</span>
                    <div style={{ fontWeight: 700 }}>
                      {popup.item.type === 'Extension of Time'
                        ? `${popup.item.approvedDays ?? 0} Days`
                        : `₹${(popup.item.approvedBudget ?? 0).toLocaleString('en-IN')}`}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Decision Date:</span>
                    <div style={{ fontWeight: 700 }}>{popup.item.applicationDate}</div>
                  </div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>EE Determination Remarks:</span>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{popup.item.resolutionRemarks ?? '—'}</div>
                </div>
              </div>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
