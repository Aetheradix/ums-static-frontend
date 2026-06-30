import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const STUDENT = studentApplications[2]; // Anita Patel

export default function CellBonafideApproval() {
  const [signed, setSigned] = useState(false);
  const [approving, setApproving] = useState(false);

  const handleApprove = () => {
    if (!signed) {
      ToastService.error('Please add digital signature before approving.');
      return;
    }
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      ToastService.success(
        'Bonafide certificate approved. Student can download from portal.'
      );
    }, 1000);
  };

  return (
    <FormPage
      title="Bonafide Certificate Approval"
      description="Review, digitally sign and approve student bonafide certificate requests."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Bonafide Approval' },
      ]}
    >
      <div style={{ maxWidth: 820 }}>
        <FormCard title="Pending Bonafide Requests" className="mb-4">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              {
                name: 'Priya Sharma',
                enr: 'CS2023001',
                purpose: 'Scholarship Application',
                date: '29 Jun 2025',
                status: 'Pending',
              },
              {
                name: 'Anita Patel',
                enr: 'MBA2024010',
                purpose: 'Scholarship Application',
                date: '28 Jun 2025',
                status: 'Pending',
              },
              {
                name: 'Meena Rajput',
                enr: 'PHD2022005',
                purpose: 'Bank Account Opening',
                date: '27 Jun 2025',
                status: 'Approved',
              },
            ].map((r, i) => (
              <div
                key={r.enr}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  background: i === 0 ? '#eff6ff' : '#fff',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    {r.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {r.enr} · {r.purpose}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                    {r.date}
                  </p>
                </div>
                <span className={`dbt-status-pill ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Certificate Preview */}
        <FormCard title="Certificate Preview — Anita Patel (MBA2024010)">
          <div
            style={{
              border: '2px solid #1e3a8a',
              borderRadius: 8,
              padding: '2rem',
              background: '#fff',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                borderBottom: '2px solid #1e3a8a',
                paddingBottom: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a' }}
              >
                DEVI AHILYA VISHWAVIDYALAYA, INDORE
              </p>
              <p
                style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}
              >
                Scholarship & Direct Benefit Transfer Cell
              </p>
              <p
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginTop: '0.75rem',
                  color: '#111827',
                }}
              >
                BONAFIDE CERTIFICATE
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Ref No: BON/2025/0090 &nbsp;|&nbsp; Dated: 29 Jun 2025
              </p>
            </div>
            <p
              style={{ fontSize: '0.875rem', lineHeight: 2, color: '#374151' }}
            >
              This is to certify that <strong>{STUDENT.studentName}</strong>{' '}
              (Enrollment No. <strong>{STUDENT.enrollmentNo}</strong>) is a bona
              fide student of <strong>{STUDENT.department}</strong>, enrolled in{' '}
              <strong>
                {STUDENT.course} ({STUDENT.branch})
              </strong>
              , <strong>{STUDENT.semester}</strong> of this University for the
              Academic Year <strong>{STUDENT.academicYear}</strong>. Her
              attendance is <strong>{STUDENT.attendancePct}%</strong> and CGPA
              is <strong>{STUDENT.cgpa}</strong>. She belongs to{' '}
              <strong>{STUDENT.category}</strong> category and has been issued
              this certificate for the purpose of{' '}
              <strong>Scholarship Application</strong>.
            </p>
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  University Seal
                </p>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    border: '2px dashed #d1d5db',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.625rem',
                      color: '#9ca3af',
                      textAlign: 'center',
                    }}
                  >
                    SEAL
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                {signed ? (
                  <div>
                    <p
                      style={{
                        fontSize: '1.125rem',
                        fontStyle: 'italic',
                        color: '#1e3a8a',
                        fontWeight: 700,
                      }}
                    >
                      Dr. R. K. Sharma
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Scholarship Cell Officer
                    </p>
                    <p
                      style={{
                        fontSize: '0.688rem',
                        color: '#16a34a',
                        fontWeight: 600,
                      }}
                    >
                      ✓ Digitally Signed
                    </p>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        width: 120,
                        height: 50,
                        border: '1px dashed #9ca3af',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        Signature Pending
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: 4,
                      }}
                    >
                      Scholarship Cell Officer
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <Button
              label={signed ? 'Signature Added ✓' : 'Add Digital Signature'}
              variant={signed ? 'outlined' : 'primary'}
              icon={signed ? 'check' : 'pencil'}
              onClick={() => {
                setSigned(true);
                ToastService.success('Digital signature added.');
              }}
            />
            <Button
              label="Approve & Generate"
              variant="primary"
              icon="badge"
              isLoading={approving}
              onClick={handleApprove}
            />
            <Button
              label="Reject Request"
              variant="danger"
              icon="times"
              onClick={() => ToastService.error('Request rejected.')}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
