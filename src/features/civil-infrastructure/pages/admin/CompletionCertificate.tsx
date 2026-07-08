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
  const [works, setWorks] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
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

  const handleCertify = () => {
    if (!certNo) {
      ToastService.error('Certificate number is required.');
      return;
    }
    setCertified(prev => new Set([...prev, popup.item?.id]));

    // Update work status to DLP Active/Completed
    const updatedWorks = works.map((w: any) =>
      w.id === popup.item?.id ? { ...w, status: 'DLP Active' as any } : w
    );
    setWorks(updatedWorks);
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));

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

  const data = works.filter(
    (w: any) =>
      w.physicalProgress >= 95 ||
      w.status === 'Completed' ||
      w.status === 'DLP Active'
  );

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
              header: 'Work Type',
              cell: (w: any) => (
                <span style={{ fontSize: '0.75rem' }}>{w.category}</span>
              ),
            },
            { field: 'department', header: 'Category' },
            {
              field: 'workBasis',
              header: 'Work Basis',
              cell: (w: any) => (
                <span
                  className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                >
                  {w.workBasis ?? 'SOR Based'}
                </span>
              ),
            },
            {
              field: 'physicalProgress',
              header: 'Physical %',
              cell: (w: any) => (
                <span
                  style={{
                    fontWeight: 700,
                    color: w.physicalProgress >= 100 ? '#16a34a' : '#d97706',
                  }}
                >
                  {w.physicalProgress}%
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Work Status',
              cell: (w: any) => (
                <StatusBadge
                  label={w.status}
                  variant={
                    w.status === 'Completed' || w.status === 'DLP Active'
                      ? 'approved'
                      : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'QA Status',
              cell: (w: any) =>
                allPassed(w.id) ? (
                  <span className="civil-pill green">QA Cleared ✓</span>
                ) : (
                  <span className="civil-pill amber">Tests Pending</span>
                ),
            },
            { field: 'expectedEndDate', header: 'Completion Date' },
            {
              field: 'id',
              header: 'Certificate',
              sortable: false,
              cell: (item: any) =>
                certified.has(item.id) ? (
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
                      setPopup({ mode: 'certify', item });
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
        title={`Issue Completion Certificate — ${popup.item?.workId}`}
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
