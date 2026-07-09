import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { civilWorks, milestones, qualityTests } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function CompletionCertificate() {
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });
  const [ccRequests, setCcRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_cc_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'certify';
    item?: any;
  }>({ mode: 'closed' });
  const [certNo, setCertNo] = useState('');
  const [certRemarks, setCertRemarks] = useState('');
  const [certified, setCertified] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('civil_certified_set');
    return saved ? new Set(JSON.parse(saved)) : new Set(['5']);
  });

  useEffect(() => {
    localStorage.setItem(
      'civil_certified_set',
      JSON.stringify(Array.from(certified))
    );
  }, [certified]);

  // Sync state on storage updates
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
      const savedCert = localStorage.getItem('civil_certified_set');
      if (savedCert) {
        setCertified(new Set(JSON.parse(savedCert)));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCertify = () => {
    if (!certNo) {
      ToastService.error('Certificate number is required.');
      return;
    }
    const item = popup.item; // CCRequest item
    setCertified(prev => new Set([...prev, item.workId]));

    // Update ccRequests status in local storage
    const updatedRequests = ccRequests.map((r: any) =>
      r.workId === item.workId
        ? {
            ...r,
            status: 'Certificate Issued',
            certificateNo: certNo,
            issueDate: new Date().toISOString().split('T')[0],
            adminRemarks: certRemarks,
          }
        : r
    );
    localStorage.setItem('civil_cc_requests', JSON.stringify(updatedRequests));
    setCcRequests(updatedRequests);

    // Update work status to DLP Active in civil_works
    const updatedWorks = works.map((w: any) =>
      w.id === item.workId ? { ...w, status: 'DLP Active' as any } : w
    );
    setWorks(updatedWorks);
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));

    window.dispatchEvent(new Event('storage'));

    ToastService.success(
      'Project Completion Certificate issued. DLP timer automatically started.'
    );
    setPopup({ mode: 'closed' });
  };

  const workMilestones = (wid: string) =>
    milestones.filter(m => m.workId === wid);
  const workTests = (wid: string) => qualityTests.filter(q => q.workId === wid);
  const allPassed = (wid: string) =>
    workTests(wid).every(t => t.result === 'Pass' || t.result === 'Pending');

  const data = ccRequests;

  return (
    <FormPage
      title="Project Completion Certificate"
      description="Joint technical audit aggregates structural logs, lab passes, and milestone sign-offs to generate the official Completion Certificate."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Completion Certificate' },
      ]}
    >
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#15803d',
          marginBottom: '1.25rem',
        }}
      >
        <strong>Completion Criteria:</strong> Project Completion Certificate is
        only issued after (a) 100% physical progress recorded, (b) all mandatory
        quality test passes logged, and (c) all milestones signed-off by EE.
        Issuing this certificate automatically triggers the Defect Liability
        Period timer.
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              field: 'workId',
              header: 'Work ID',
              cell: (r: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {r.workNo}
                </span>
              ),
            },
            { field: 'workName', header: 'Work Name' },
            {
              field: 'category',
              header: 'Work Type',
              cell: (r: any) => {
                const w = works.find(x => x.id === r.workId);
                return <span style={{ fontSize: '0.75rem' }}>{w?.category || 'General'}</span>;
              },
            },
            {
              field: 'department',
              header: 'Category',
              cell: (r: any) => {
                const w = works.find(x => x.id === r.workId);
                return <span>{w?.department || 'Civil'}</span>;
              },
            },
            {
              field: 'workBasis',
              header: 'Work Basis',
              cell: (r: any) => {
                const w = works.find(x => x.id === r.workId);
                return (
                  <span
                    className={`civil-pill ${w?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                  >
                    {w?.workBasis ?? 'SOR Based'}
                  </span>
                );
              },
            },
            {
              field: 'physicalProgress',
              header: 'Physical %',
              cell: (r: any) => {
                const w = works.find(x => x.id === r.workId);
                return (
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    {w?.physicalProgress || 100}%
                  </span>
                );
              },
            },
            {
              field: 'status',
              header: 'Work Status',
              cell: (r: any) => (
                <StatusBadge
                  label={r.status}
                  variant={
                    r.status === 'Certificate Issued'
                      ? 'approved'
                      : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'QA Status',
              cell: (r: any) =>
                allPassed(r.workId) ? (
                  <span className="civil-pill green">QA Cleared ✓</span>
                ) : (
                  <span className="civil-pill amber">Tests Pending</span>
                ),
            },
            { field: 'actualCompletionDate', header: 'Completion Date' },
            {
              field: 'id',
              header: 'Certificate',
              sortable: false,
              cell: (r: any) =>
                certified.has(r.workId) || r.status === 'Certificate Issued' ? (
                  <span className="civil-pill green">✓ Cert Issued</span>
                ) : (
                  <Button
                    size="small"
                    label="Issue Certificate"
                    icon="star"
                    variant="primary"
                    onClick={() => {
                      setCertNo(
                        `COMP/CW/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
                      );
                      setCertRemarks('');
                      setPopup({ mode: 'certify', item: r });
                    }}
                  />
                ),
            },
          ]}
          searchBox
          searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Issue Completion Certificate — ${popup.item?.workNo}`}
        subtitle="Joint audit confirmation and DLP trigger."
        size="lg"
      >
        {popup.item && (
          <>
            {/* Milestone Audit */}
            <FormCard
              title="Milestone Audit"
              subtitle="All milestones must be completed before issuance."
            >
              <table className="civil-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Milestone</th>
                    <th>Status</th>
                    <th>QA Test</th>
                  </tr>
                </thead>
                <tbody>
                  {workMilestones(popup.item.id).map(m => (
                    <tr key={m.id}>
                      <td>{m.sequenceNo}</td>
                      <td>{m.milestoneName}</td>
                      <td>
                        <span
                          className={`civil-pill ${m.status === 'Completed' ? 'green' : m.status === 'In Progress' ? 'blue' : m.status === 'Delayed' ? 'red' : 'gray'}`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td>
                        {m.qualityTestRequired ? (
                          <span
                            className={`civil-pill ${m.qualityTestStatus === 'Pass' ? 'green' : m.qualityTestStatus === 'Fail' ? 'red' : 'amber'}`}
                          >
                            {m.qualityTestStatus ?? 'Not Started'}
                          </span>
                        ) : (
                          <span
                            style={{ color: '#9ca3af', fontSize: '0.75rem' }}
                          >
                            N/A
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FormCard>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '0.75rem',
              }}
            >
              <TextBox
                label="Certificate Number"
                value={certNo}
                onChange={setCertNo}
                required
              />
              <TextBox
                label="Joint Inspection Date"
                value={new Date().toISOString().split('T')[0]}
                onChange={() => {}}
                disabled
              />
            </div>
            <TextArea
              label="Completion Remarks"
              placeholder="Overall inspection remarks, punch list items..."
              value={certRemarks}
              onChange={setCertRemarks}
              rows={3}
            />
            <div
              style={{
                background: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '0.75rem',
                padding: '0.875rem 1rem',
                fontSize: '0.8125rem',
                color: '#1e40af',
                marginTop: '0.75rem',
              }}
            >
              <strong>ℹ DLP Trigger:</strong> On issuance, the ERP automatically
              starts a 12-month Defect Liability Period (DLP) timer. Retention
              money will be released only after successful DLP completion.
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Issue Completion Certificate & Start DLP"
                variant="primary"
                icon="star"
                onClick={handleCertify}
              />
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
