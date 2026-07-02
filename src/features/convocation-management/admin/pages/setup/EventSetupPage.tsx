import { Button } from 'primereact/button';
import { useState } from 'react';
import { ToastService } from 'services';
import { DatePicker, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function EventSetupPage() {
  const [formData, setFormData] = useState({
    eventName: '2024 Annual Convocation',
    formPrefix: 'CONV2024',
    openDate: new Date(),
    closeDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    eventDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    portalContent:
      '<h3>Welcome to the Convocation Portal</h3><p>Please review the eligibility criteria before applying.</p>',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    ToastService.success('Convocation Event Setup saved successfully!');
  };

  return (
    <FormPage
      title="Convocation Event Setup"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Event Setup' },
      ]}
      headerAction={
        <Button
          label="Save Configuration"
          icon="pi pi-save"
          severity="info"
          onClick={handleSave}
        />
      }
    >
      <div className="space-y-6">
        <FormCard
          title="Basic Details"
          subtitle="Define the event name and application numbering prefix."
        >
          <FormGrid>
            <div className="flex flex-col gap-2">
              <TextBox
                label="Event Name"
                required
                value={formData.eventName}
                onChange={val => handleChange('eventName', val)}
                placeholder="e.g. 2024 Annual Convocation"
              />
            </div>
            <div className="flex flex-col gap-2">
              <TextBox
                label="Form ID Prefix"
                required
                value={formData.formPrefix}
                onChange={val => handleChange('formPrefix', val)}
                placeholder="e.g. CONV2024"
                subLabel="Applications will be numbered like CONV2024-0001"
              />
            </div>
          </FormGrid>
        </FormCard>

        <FormCard
          title="Timeline & Dates"
          subtitle="Set the schedule for the convocation process."
        >
          <FormGrid columns={3}>
            <div className="flex flex-col gap-2">
              <DatePicker
                label="Portal Open Date"
                required
                value={formData.openDate}
                onChange={val => handleChange('openDate', val)}
                placeholder="Select Date"
              />
            </div>
            <div className="flex flex-col gap-2">
              <DatePicker
                label="Portal Close Date"
                required
                value={formData.closeDate}
                onChange={val => handleChange('closeDate', val)}
                placeholder="Select Date"
              />
            </div>
            <div className="flex flex-col gap-2">
              <DatePicker
                label="Actual Event Date"
                required
                value={formData.eventDate}
                onChange={val => handleChange('eventDate', val)}
                placeholder="Select Date"
              />
            </div>
          </FormGrid>
        </FormCard>

        <FormCard
          title="Portal Content"
          subtitle="HTML content displayed on the student registration portal."
        >
          <div className="mt-4">
            <TextArea
              value={formData.portalContent}
              onChange={val => handleChange('portalContent', val)}
              rows={10}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
