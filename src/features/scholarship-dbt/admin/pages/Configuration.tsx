import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminConfiguration() {
  const [openingDate, setOpeningDate] = useState('01 Jul 2025');
  const [closingDate, setClosingDate] = useState('31 Oct 2025');
  const [maxAmount, setMaxAmount] = useState('150000');

  const handleSave = () => {
    ToastService.success('Module portal configuration parameters updated.');
  };

  return (
    <FormPage
      title="Scholarship Configuration"
      description="Configure opening/closing dates, maximum disbursement limits and rules."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Scholarship Configuration' },
      ]}
    >
      <div style={{ maxWidth: 680 }}>
        <FormCard title="Module Parameters">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <TextBox
              label="Application Submission Start Date"
              value={openingDate}
              onChange={setOpeningDate}
              required
            />
            <TextBox
              label="Application Submission Deadline / Closing Date"
              value={closingDate}
              onChange={setClosingDate}
              required
            />
            <TextBox
              label="Maximum Scholarship Amount limit per Student (₹)"
              type="number"
              value={maxAmount}
              onChange={setMaxAmount}
              required
            />

            <div>
              <Button
                label="Save Parameters Configuration"
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
