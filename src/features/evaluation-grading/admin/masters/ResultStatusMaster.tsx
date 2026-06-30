import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, TextArea } from 'shared/components/forms';

export default function ResultStatusMaster() {
  const [form, setForm] = useState({
    statusCode: '',
    statusName: '',
    status: '',
    description: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Result Status Master"
      description="Manage Result Status Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Result Status Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Status Code"
            value={form.statusCode}
            onChange={v => handleChange('statusCode', v)}
            placeholder="Enter Status Code"
          />
          <TextBox
            label="Status Name"
            value={form.statusName}
            onChange={v => handleChange('statusName', v)}
            placeholder="Enter Status Name (e.g. Promoted)"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={v => handleChange('status', v)}
            data={[
              { text: 'Active', value: 'active' },
              { text: 'Inactive', value: 'inactive' },
            ]}
            placeholder="Select Status"
          />
          <div className="col-span-4 lg:col-span-3">
            <TextArea
              label="Description"
              value={form.description}
              onChange={(v: any) => handleChange('description', v)}
              placeholder="Enter Description"
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard>
        <div className="flex items-center gap-4 mt-8">
          <Button label="Save" variant="success" className="min-w-[120px]" />
          <Button
            label="Clear"
            variant="danger"
            className="min-w-[120px]"
            onClick={() => window.location.reload()}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
