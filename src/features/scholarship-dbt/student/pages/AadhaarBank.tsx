import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const STUDENT = studentApplications[0];

export default function StudentAadhaarBank() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [bankVerified, setBankVerified] = useState(STUDENT.npciSeeded);

  const handleSendOtp = () => {
    setOtpSent(true);
    ToastService.success('OTP sent to Aadhaar registered mobile number.');
  };
  const handleVerifyOtp = () => {
    if (otp === '123456' || otp.length === 6) {
      setVerified(true);
      ToastService.success('Aadhaar verified successfully via UIDAI.');
    } else {
      ToastService.error('Invalid OTP. Please try again.');
    }
  };
  const handleBankValidate = () => {
    setTimeout(() => {
      setBankVerified(true);
      ToastService.success('Bank account validated. NPCI seeding active.');
    }, 1000);
  };

  return (
    <FormPage
      title="Aadhaar & Bank Verification"
      description="Verify your Aadhaar identity and confirm Aadhaar-bank seeding for DBT transfer."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Aadhaar & Bank Verification' },
      ]}
    >
      <div style={{ maxWidth: 760 }}>
        {/* Aadhaar Section */}
        <FormCard title="Aadhaar Identity Verification" icon="verified_user">
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: verified ? '#f0fdf4' : '#fef3c7',
              borderRadius: 8,
              border: `1px solid ${verified ? '#bbf7d0' : '#fde68a'}`,
            }}
          >
            <i
              className={`pi pi-${verified ? 'check-circle' : 'exclamation-triangle'}`}
              style={{
                fontSize: '1.25rem',
                color: verified ? '#16a34a' : '#d97706',
              }}
            />
            <div>
              <p
                style={{
                  fontSize: '0.813rem',
                  fontWeight: 700,
                  color: verified ? '#15803d' : '#b45309',
                }}
              >
                {verified
                  ? 'Aadhaar Verified Successfully via UIDAI'
                  : 'Aadhaar Verification Pending'}
              </p>
              <p
                style={{ fontSize: '0.688rem', color: '#6b7280', marginTop: 2 }}
              >
                {verified
                  ? 'Your identity has been authenticated.'
                  : 'Complete OTP verification to authenticate your Aadhaar.'}
              </p>
            </div>
          </div>

          <FormGrid columns={2}>
            {[
              { label: 'Aadhaar Number', value: '2345 XXXX XXXX 7890' },
              { label: 'Masked Aadhaar', value: 'XXXX XXXX XXXX 7890' },
              { label: 'Virtual ID (VID)', value: 'VID892345678901234' },
              { label: 'Registered Name', value: STUDENT.studentName },
              { label: 'Registered Mobile', value: '+91 98765 XXXXX' },
              {
                label: 'Verification Status',
                value: verified ? 'Verified ✓' : 'Pending',
              },
            ].map(f => (
              <div key={f.label} className="dbt-info-field">
                <p className="dbt-info-label">{f.label}</p>
                <p
                  className="dbt-info-value"
                  style={{
                    color:
                      f.label === 'Verification Status'
                        ? verified
                          ? '#16a34a'
                          : '#b45309'
                        : '#111827',
                  }}
                >
                  {f.value}
                </p>
              </div>
            ))}
          </FormGrid>

          {!verified && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '0.813rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem',
                }}
              >
                OTP Verification
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '0.625rem',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      fontSize: '0.875rem',
                      outline: 'none',
                      letterSpacing: '0.2em',
                      fontWeight: 700,
                    }}
                  />
                </div>
                <Button
                  label={otpSent ? 'Resend OTP' : 'Send OTP'}
                  variant="outlined"
                  icon="key"
                  onClick={handleSendOtp}
                />
                <Button
                  label="Verify OTP"
                  variant="primary"
                  icon="check"
                  onClick={handleVerifyOtp}
                  disabled={!otpSent || otp.length < 6}
                />
              </div>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginTop: '0.375rem',
                }}
              >
                {otpSent
                  ? 'OTP sent. Valid for 10 minutes. (Use 123456 for demo)'
                  : 'Click Send OTP to receive on Aadhaar registered mobile.'}
              </p>
            </div>
          )}
        </FormCard>

        {/* Bank Verification */}
        <FormCard
          title="Bank Account & NPCI Seeding"
          className="mt-4"
          icon="account_balance"
        >
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: bankVerified ? '#f0fdf4' : '#fef2f2',
              borderRadius: 8,
              border: `1px solid ${bankVerified ? '#bbf7d0' : '#fca5a5'}`,
            }}
          >
            <i
              className={`pi pi-${bankVerified ? 'check-circle' : 'times-circle'}`}
              style={{
                fontSize: '1.25rem',
                color: bankVerified ? '#16a34a' : '#b91c1c',
              }}
            />
            <div>
              <p
                style={{
                  fontSize: '0.813rem',
                  fontWeight: 700,
                  color: bankVerified ? '#15803d' : '#b91c1c',
                }}
              >
                {bankVerified
                  ? 'NPCI Aadhaar Seeding: Active'
                  : 'NPCI Aadhaar Seeding: Inactive'}
              </p>
              <p
                style={{ fontSize: '0.688rem', color: '#6b7280', marginTop: 2 }}
              >
                {bankVerified
                  ? 'Bank account seeded with Aadhaar. DBT transfer enabled.'
                  : 'Contact your bank to activate Aadhaar seeding for DBT.'}
              </p>
            </div>
          </div>

          <FormGrid columns={2}>
            {[
              { label: 'Bank Name', value: STUDENT.bankName },
              { label: 'Bank Branch', value: 'Vijay Nagar, Indore' },
              { label: 'Account Number', value: '3456XXXX12' },
              { label: 'IFSC Code', value: STUDENT.ifsc },
              {
                label: 'NPCI Mapping',
                value: bankVerified ? 'Mapped ✓' : 'Not Mapped',
              },
              { label: 'Aadhaar Seeded', value: bankVerified ? 'Yes ✓' : 'No' },
            ].map(f => (
              <div key={f.label} className="dbt-info-field">
                <p className="dbt-info-label">{f.label}</p>
                <p
                  className="dbt-info-value"
                  style={{
                    color:
                      f.label === 'NPCI Mapping' || f.label === 'Aadhaar Seeded'
                        ? bankVerified
                          ? '#16a34a'
                          : '#b91c1c'
                        : '#111827',
                  }}
                >
                  {f.value}
                </p>
              </div>
            ))}
          </FormGrid>

          {!bankVerified && (
            <div style={{ marginTop: '0.75rem' }}>
              <Button
                label="Validate via NPCI"
                variant="primary"
                icon="check"
                onClick={handleBankValidate}
              />
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginTop: '0.5rem',
                }}
              >
                This will verify your bank-Aadhaar linking status via NPCI
                Mapper API.
              </p>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
