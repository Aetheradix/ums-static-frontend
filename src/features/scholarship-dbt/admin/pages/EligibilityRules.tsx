import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminEligibilityRules() {
  const [minAttendance, setMinAttendance] = useState('75');
  const [minCgpa, setMinCgpa] = useState('6.0');
  const [incomeLimit, setIncomeLimit] = useState('250000');

  const handleSave = () => {
    ToastService.success(
      'Global Eligibility Engine Rules updated successfully.'
    );
  };

  return (
    <FormPage
      title="Eligibility Rule Engine"
      description="Configure target limits and conditions evaluated by the eligibility engine."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Eligibility Rules' },
      ]}
    >
      <div style={{ maxWidth: 680 }}>
        <FormCard title="Global Verification Thresholds">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <TextBox
              label="Minimum Attendance Required (%)"
              type="number"
              value={minAttendance}
              onChange={setMinAttendance}
              required
            />
            <TextBox
              label="Minimum CGPA required in previous Semester"
              type="number"
              value={minCgpa}
              onChange={setMinCgpa}
              required
            />
            <TextBox
              label="Maximum Family Income Limit (Annual ₹)"
              type="number"
              value={incomeLimit}
              onChange={setIncomeLimit}
              required
            />

            <div
              style={{
                padding: '0.75rem',
                background: '#eff6ff',
                borderRadius: 8,
                border: '1px solid #bfdbfe',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#1d4ed8',
                  fontWeight: 600,
                }}
              >
                ✓ Auto-duplicate check is always active based on Aadhaar number
                mapping across active intakes.
              </p>
            </div>

            <div>
              <Button
                label="Save Engine Configurations"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
