import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications, type StudentApplication } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const RULES = [
  {
    label: 'Category',
    param: 'SC',
    required: 'SC/ST/OBC/EWS',
    status: (a: StudentApplication) =>
      ['SC', 'ST', 'OBC', 'EWS'].includes(a.category),
  },
  {
    label: 'Annual Income',
    param: '< ₹2,50,000',
    required: '< ₹2,50,000',
    status: (a: StudentApplication) => a.annualIncome < 250000,
  },
  {
    label: 'Attendance',
    param: '≥ 75%',
    required: '≥ 75%',
    status: (a: StudentApplication) => a.attendancePct >= 75,
  },
  {
    label: 'CGPA',
    param: '≥ 6.0',
    required: '≥ 6.0',
    status: (a: StudentApplication) => a.cgpa >= 6.0,
  },
  {
    label: 'NPCI Seeding',
    param: 'Active',
    required: 'Active',
    status: (a: StudentApplication) => a.npciSeeded,
  },
  {
    label: 'Not Duplicate',
    param: 'No duplicate',
    required: 'No duplicate',
    status: () => true,
  },
];

export default function CellEligibilityEngine() {
  const [selectedApp, setSelectedApp] = useState('');
  const [result, setResult] = useState<StudentApplication | null>(null);

  const handleCheck = () => {
    const app = studentApplications.find(a => a.id === selectedApp);
    if (!app) {
      ToastService.error('Please select a student.');
      return;
    }
    setResult(app);
    ToastService.success('Eligibility check complete.');
  };

  const allPass = result ? RULES.every(r => r.status(result)) : false;

  return (
    <FormPage
      title="Eligibility Engine"
      description="Run live eligibility checks against all scholarship criteria."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Eligibility Engine' },
      ]}
    >
      <div style={{ maxWidth: 800 }}>
        {/* Selector */}
        <FormCard title="Select Student Application to Check" className="mb-4">
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 260 }}>
              <DropDownList
                label="Student Application"
                data={studentApplications.map(a => ({
                  name: `${a.studentName} — ${a.appNo}`,
                  value: a.id,
                }))}
                textField="name"
                optionValue="value"
                value={selectedApp}
                onChange={v => setSelectedApp(String(v ?? ''))}
                placeholder="Select student application..."
              />
            </div>
            <Button
              label="Run Eligibility Check"
              variant="primary"
              icon="search"
              onClick={handleCheck}
            />
          </div>
        </FormCard>

        {/* Result */}
        {result && (
          <>
            <FormCard className="mb-4">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {result.studentName}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {result.appNo} · {result.schemeName}
                  </p>
                </div>
                <span
                  style={{
                    padding: '0.375rem 1rem',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    background: allPass ? '#d1fae5' : '#fee2e2',
                    color: allPass ? '#15803d' : '#b91c1c',
                  }}
                >
                  {allPass ? '✓ ELIGIBLE' : '✗ INELIGIBLE'}
                </span>
              </div>
            </FormCard>

            <FormCard title="Eligibility Rules Result">
              {RULES.map(rule => {
                const pass = rule.status(result);
                return (
                  <div
                    key={rule.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderRadius: 8,
                      marginBottom: '0.5rem',
                      background: pass ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${pass ? '#bbf7d0' : '#fca5a5'}`,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        {rule.label}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Required: {rule.required}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: pass ? '#16a34a' : '#b91c1c',
                        }}
                      >
                        {pass ? '✓ PASS' : '✗ FAIL'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Actual: {rule.param}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  gap: '0.625rem',
                }}
              >
                <Button
                  label="Approve Eligibility"
                  variant="primary"
                  icon="check"
                  onClick={() =>
                    ToastService.success(
                      'Marked as eligible. Proceeding to final approval.'
                    )
                  }
                  disabled={!allPass}
                />
                <Button
                  label="Mark Ineligible"
                  variant="danger"
                  icon="times"
                  onClick={() => ToastService.error('Marked as ineligible.')}
                  disabled={allPass}
                />
              </div>
            </FormCard>
          </>
        )}
      </div>
    </FormPage>
  );
}
