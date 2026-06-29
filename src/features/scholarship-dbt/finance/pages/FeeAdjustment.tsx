import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function FinanceFeeAdjustment() {
  const [selectedApp, setSelectedApp] = useState(studentApplications[0]);
  const [totalFees, setTotalFees] = useState(45000);
  const [scholarshipAmt] = useState(selectedApp.amount);
  const [calculated, setCalculated] = useState(false);

  const handleAdjust = () => {
    ToastService.success(
      `Fee adjusted. Offset Applied: ₹${Math.min(totalFees, scholarshipAmt).toLocaleString()}. Student Ledger Updated.`
    );
  };

  const outstanding = Math.max(0, totalFees - scholarshipAmt);
  const refundAmount = Math.max(0, scholarshipAmt - totalFees);

  return (
    <FormPage
      title="Fee Adjustment / Offset"
      description="Apply scholarship offset against tuition fees and calculate outstanding/refund amounts."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Finance Office', to: dbtUrls.finance.portal },
        { label: 'Fee Adjustment' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Adjust Student Fee against Scholarship">
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}
            >
              Select Student
            </label>
            <select
              className="dbt-filter-select"
              style={{ width: '100%', marginTop: 4, height: 38 }}
              onChange={e => {
                const found = studentApplications.find(
                  a => a.id === e.target.value
                );
                if (found) {
                  setSelectedApp(found);
                  setCalculated(false);
                }
              }}
            >
              {studentApplications.map(a => (
                <option key={a.id} value={a.id}>
                  {a.studentName} ({a.enrollmentNo}) — ₹
                  {a.amount.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <TextBox
            label="Total Academic Fees for current Semester (₹)"
            type="number"
            value={totalFees.toString()}
            onChange={v => {
              setTotalFees(Number(v));
              setCalculated(false);
            }}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button
              label="Calculate Offset"
              variant="primary"
              onClick={() => setCalculated(true)}
            />
          </div>
        </FormCard>

        {calculated && (
          <FormCard title="Calculation Summary">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #e5e7eb',
                  paddingBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                  Student Name
                </span>
                <span
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {selectedApp.studentName}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #e5e7eb',
                  paddingBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                  Scholarship Amount
                </span>
                <span
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#2563eb',
                  }}
                >
                  ₹{scholarshipAmt.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #e5e7eb',
                  paddingBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                  Semester Fees
                </span>
                <span
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  ₹{totalFees.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #e5e7eb',
                  paddingBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                  Fee Offset Applied
                </span>
                <span
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#16a34a',
                  }}
                >
                  ₹{Math.min(totalFees, scholarshipAmt).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed #e5e7eb',
                  paddingBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                  Remaining Outstanding Fees
                </span>
                <span
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#b91c1c',
                  }}
                >
                  ₹{outstanding.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                  Excess Refundable Amount
                </span>
                <span
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#0ea5e9',
                  }}
                >
                  ₹{refundAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Button
                label="Post & Adjust Fee Ledger"
                variant="primary"
                onClick={handleAdjust}
              />
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
