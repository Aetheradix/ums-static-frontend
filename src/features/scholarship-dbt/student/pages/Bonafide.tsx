import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

type BonafideStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';

const TIMELINE_STEPS = [
  {
    key: 'None',
    label: 'Request Submitted',
    icon: 'send',
    color: '#2563eb',
    bg: '#dbeafe',
  },
  {
    key: 'Pending',
    label: 'Under Review by Scholarship Cell',
    icon: 'search',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    key: 'Approved',
    label: 'Approved & Ready to Download',
    icon: 'check-circle',
    color: '#16a34a',
    bg: '#d1fae5',
  },
];

export default function StudentBonafide() {
  const [status, setStatus] = useState<BonafideStatus>('None');
  const [purpose, setPurpose] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestId] = useState('BON/2025/0089');

  const handleRequest = () => {
    if (!purpose) {
      ToastService.error('Please select purpose.');
      return;
    }
    if (!reason.trim()) {
      ToastService.error('Please provide reason/usage details.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStatus('Pending');
      ToastService.success(
        'Bonafide certificate request submitted successfully!'
      );
    }, 900);
  };

  const handleDownload = () => {
    ToastService.success('Bonafide certificate PDF downloading...');
  };

  return (
    <FormPage
      title="Bonafide Certificate"
      description="Request, track and download your bonafide certificate for scholarship purposes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Bonafide Certificate' },
      ]}
    >
      <div style={{ maxWidth: 720 }}>
        {/* Request Form */}
        {status === 'None' && (
          <FormCard title="Generate Bonafide Certificate Request">
            <div
              style={{
                padding: '0.75rem',
                background: '#eff6ff',
                borderRadius: 8,
                marginBottom: '1rem',
                border: '1px solid #bfdbfe',
              }}
            >
              <p
                style={{
                  fontSize: '0.813rem',
                  color: '#1d4ed8',
                  fontWeight: 600,
                }}
              >
                ℹ Bonafide certificates are required for scholarship portals
                like NSP and State Portal.
              </p>
            </div>
            <FormGrid columns={2}>
              <DropDownList
                label="Purpose"
                data={[
                  {
                    name: 'Scholarship Application',
                    value: 'Scholarship Application',
                  },
                  {
                    name: 'Bank Account Opening',
                    value: 'Bank Account Opening',
                  },
                  { name: 'Hostel Admission', value: 'Hostel Admission' },
                  { name: 'VISA / Passport', value: 'VISA / Passport' },
                  { name: 'Other', value: 'Other' },
                ]}
                textField="name"
                optionValue="value"
                value={purpose}
                onChange={v => setPurpose(String(v ?? ''))}
                placeholder="Select purpose..."
                required
              />
              <div />
            </FormGrid>
            <TextArea
              label="Reason / Usage Details"
              placeholder="Describe how this bonafide certificate will be used..."
              value={reason}
              onChange={setReason}
              rows={3}
              required
            />
            <div style={{ marginTop: '0.75rem' }}>
              <Button
                label="Submit Request"
                variant="primary"
                icon="send"
                isLoading={submitting}
                onClick={handleRequest}
              />
            </div>
          </FormCard>
        )}

        {/* Status Card */}
        {status !== 'None' && (
          <FormCard title="Bonafide Request Status">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  Request ID: {requestId}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: 2,
                  }}
                >
                  Purpose: {purpose || 'Scholarship Application'}
                </p>
              </div>
              <span className={`dbt-status-pill ${status.toLowerCase()}`}>
                {status}
              </span>
            </div>

            {/* Timeline */}
            <div className="dbt-timeline">
              {TIMELINE_STEPS.map((step, i) => {
                const isReached =
                  i === 0 ||
                  (status === 'Pending' && i <= 1) ||
                  status === 'Approved';
                return (
                  <div key={step.key} className="dbt-timeline-step">
                    <div className="dbt-timeline-icon-wrap">
                      <div
                        className="dbt-timeline-icon"
                        style={{
                          background: isReached ? step.bg : '#f3f4f6',
                          color: isReached ? step.color : '#9ca3af',
                        }}
                      >
                        <i
                          className={`pi pi-${step.icon}`}
                          style={{ fontSize: '0.875rem' }}
                        />
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div
                          className="dbt-timeline-line"
                          style={{
                            background: isReached ? step.color : '#e5e7eb',
                          }}
                        />
                      )}
                    </div>
                    <div className="dbt-timeline-body">
                      <p
                        className="dbt-timeline-title"
                        style={{ color: isReached ? '#111827' : '#9ca3af' }}
                      >
                        {step.label}
                      </p>
                      <p
                        className="dbt-timeline-date"
                        style={{ color: isReached ? '#6b7280' : '#d1d5db' }}
                      >
                        {isReached
                          ? i === 0
                            ? '29 Jun 2025'
                            : i === 1
                              ? '30 Jun 2025'
                              : 'Estimated: 01 Jul 2025'
                          : 'Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {status === 'Approved' && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f0fdf4',
                  borderRadius: 8,
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 700,
                      color: '#15803d',
                    }}
                  >
                    Certificate Ready to Download
                  </p>
                  <p
                    style={{
                      fontSize: '0.688rem',
                      color: '#4b7c5f',
                      marginTop: 2,
                    }}
                  >
                    Approved by: Dr. Anil Sharma · 01 Jul 2025
                  </p>
                </div>
                <Button
                  label="Download PDF"
                  variant="primary"
                  icon="download"
                  onClick={handleDownload}
                />
              </div>
            )}

            <div
              style={{ marginTop: '1rem', display: 'flex', gap: '0.625rem' }}
            >
              <Button
                label="New Request"
                variant="outlined"
                icon="plus"
                onClick={() => setStatus('None')}
              />
              {status === 'Pending' && (
                <Button
                  label="Simulate Approval"
                  variant="primary"
                  icon="check"
                  onClick={() => {
                    setStatus('Approved');
                    ToastService.success('Certificate approved.');
                  }}
                />
              )}
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
