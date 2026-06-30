import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';

export default function DivisionMaster() {
  const [form, setForm] = useState({
    divisionName: '',
    divisionCode: '',
    lowerPercentage: undefined,
    upperPercentage: undefined,
    status: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Division Master"
      description="Manage Division Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Division Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Division Code"
            value={form.divisionCode}
            onChange={v => handleChange('divisionCode', v)}
            placeholder="Enter Division Code"
          />
          <TextBox
            label="Division Name"
            value={form.divisionName}
            onChange={v => handleChange('divisionName', v)}
            placeholder="Enter Division Name"
          />
          <NumberBox
            label="Lower Percentage"
            value={form.lowerPercentage}
            onChange={v => handleChange('lowerPercentage', v)}
            placeholder="Lower Percentage"
          />
          <NumberBox
            label="Upper Percentage"
            value={form.upperPercentage}
            onChange={v => handleChange('upperPercentage', v)}
            placeholder="Upper Percentage"
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
