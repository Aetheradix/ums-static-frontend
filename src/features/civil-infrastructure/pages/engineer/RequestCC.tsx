import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'request'; item: any }
  | { mode: 'view'; requestItem: any };

export default function RequestCC() {
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [ccRequests, setCcRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_cc_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  
  // Form fields
  const [completionDate, setCompletionDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [finalBillNo, setFinalBillNo] = useState('');

  // Storage listener to synchronize updates across portals
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCC = localStorage.getItem('civil_cc_requests');
      if (savedCC) {
        setCcRequests(JSON.parse(savedCC));
      }
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) {
        setWorks(JSON.parse(savedWorks));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCreateRequest = () => {
    if (popup.mode !== 'request') return;
    if (!completionDate) {
      ToastService.error('Completion date is required.');
      return;
    }
    if (!remarks.trim()) {
      ToastService.error('Justification remarks are required.');
      return;
    }

    const item = popup.item;
    const newRequest = {
      id: item.id, // using workId as key
      workId: item.id,
      workNo: item.workId,
      workName: item.name,
      contractorName: item.externalAgency || 'Sharma Constructions Pvt Ltd',
      actualCompletionDate: completionDate,
      seRemarks: remarks.trim(),
      finalBillNo: finalBillNo || 'BILL/FW/' + Math.floor(Math.random() * 10000),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending Admin Action',
    };

    const updatedCC = [...ccRequests.filter(r => r.workId !== item.id), newRequest];
    localStorage.setItem('civil_cc_requests', JSON.stringify(updatedCC));
    setCcRequests(updatedCC);

    // Also update physical progress to 100% and status to Completed in civil_works
    const updatedWorks = works.map(w =>
      w.id === item.id ? { ...w, physicalProgress: 100, status: 'Completed' } : w
    );
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));
    setWorks(updatedWorks);

    window.dispatchEvent(new Event('storage'));

    ToastService.success(
      'Completion Certificate (CC) request submitted successfully to Admin.'
    );
    setPopup({ mode: 'closed' });
    setCompletionDate('');
    setRemarks('');
    setFinalBillNo('');
  };

  return (
    <FormPage
      title="Request Completion Certificate"
      description="Apply for project completion audits and final technical closures for completed works."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Request CC' },
      ]}
    >
      <FormCard subtitle="Only works with high physical progress are eligible for final CC requests.">
        <GridPanel
          data={works}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workId',
              header: 'Work ID',
              cell: (w: any) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>
                  {w.workId}
                </span>
              ),
            },
            { field: 'name', header: 'Work Name' },
            {
              field: 'category',
              header: 'Work Type',
              cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.category}</span>,
            },
            {
              field: 'physicalProgress',
              header: 'Physical Progress',
              cell: (w: any) => (
                <span style={{ fontWeight: 700, color: w.physicalProgress >= 100 ? '#16a34a' : '#d97706' }}>
                  {w.physicalProgress}%
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Work Status',
              cell: (w: any) => {
                const req = ccRequests.find(r => r.workId === w.id);
                const currentStatus = req ? req.status : w.status;
                let pillCls = 'gray';
                if (currentStatus === 'Pending Admin Action') pillCls = 'amber';
                if (currentStatus === 'Certificate Issued' || currentStatus === 'DLP Active') pillCls = 'green';
                return <span className={`civil-pill ${pillCls}`}>{currentStatus}</span>;
              },
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: any) => {
                const req = ccRequests.find(r => r.workId === item.id);
                if (req) {
                  return (
                    <Button
                      size="small"
                      label="View Request"
                      icon="eye"
                      variant="outlined"
                      onClick={() => setPopup({ mode: 'view', requestItem: req })}
                    />
                  );
                }
                const isEligible = item.physicalProgress >= 90;
                return (
                  <Button
                    size="small"
                    label="Request CC"
                    icon="send"
                    variant="primary"
                    disabled={!isEligible}
                    tooltip={!isEligible ? 'Physical progress must be >= 90% to apply' : 'Apply for Completion Certificate'}
                    onClick={() => {
                      setCompletionDate(new Date().toISOString().split('T')[0]);
                      setRemarks('');
                      setFinalBillNo('');
                      setPopup({ mode: 'request', item });
                    }}
                  />
                );
              },
            },
          ]}
          searchBox
          searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'request'
            ? `Submit CC Request — ${(popup as any).item?.workId}`
            : `CC Request Details — ${(popup as any).requestItem?.workNo}`
        }
        subtitle={
          popup.mode === 'request'
            ? 'Declare physical execution completion and initiate administrative audit.'
            : 'Audit log of technical closure request.'
        }
        size="lg"
      >
        {popup.mode === 'request' && popup.item && (
          <>
            <FormCard title="Project Summary" subtitle="">
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
                  ['Work ID / Name', popup.item.name],
                  ['Contractor / Agency', popup.item.externalAgency || 'Sharma Constructions Pvt Ltd'],
                  ['Category / Campus', `${popup.item.category} / ${popup.item.campus}`],
                  ['Current Physical Progress', `${popup.item.physicalProgress}%`],
                ].map(([k, v]) => (
                  <div key={k} style={{ gridColumn: k === 'Work ID / Name' ? 'span 2' : 'span 1' }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </FormCard>

            <FormGrid columns={2}>
              <TextBox
                type="date"
                label="Actual Completion Date *"
                value={completionDate}
                onChange={setCompletionDate}
                required
              />
              <TextBox
                label="Final Measurement Bill Ref. No."
                placeholder="e.g. BILL/FW/2026/894"
                value={finalBillNo}
                onChange={setFinalBillNo}
              />
            </FormGrid>
            <TextArea
              label="Site Engineer Audit Justification / Remarks *"
              placeholder="Certify that all BOQ items are measured, quality passes recorded, and physical handover is completed..."
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
                label="Submit CC Request"
                variant="primary"
                icon="send"
                onClick={handleCreateRequest}
              />
            </div>
          </>
        )}

        {popup.mode === 'view' && popup.requestItem && (
          <>
            <FormCard title="Technical Closure Audit Details" subtitle="">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem 2rem',
                  fontSize: '0.8125rem',
                }}
              >
                {[
                  ['Work ID / Name', popup.requestItem.workName],
                  ['Contractor Name', popup.requestItem.contractorName],
                  ['Request Status', popup.requestItem.status],
                  ['Request Date', popup.requestItem.requestDate],
                  ['Actual Completion Date', popup.requestItem.actualCompletionDate],
                  ['Final Bill Ref No.', popup.requestItem.finalBillNo],
                  ['Site Engineer Remarks', popup.requestItem.seRemarks],
                  ['Admin Certificate No.', popup.requestItem.certificateNo || '—'],
                  ['Admin Issue Date', popup.requestItem.issueDate || '—'],
                  ['Admin Review Remarks', popup.requestItem.adminRemarks || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ gridColumn: k === 'Site Engineer Remarks' || k === 'Admin Review Remarks' || k === 'Work ID / Name' ? 'span 2' : 'span 1' }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </FormCard>
            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
