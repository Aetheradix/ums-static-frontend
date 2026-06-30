import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';

export default function ExamTypeMaster() {
  const [form, setForm] = useState({
    examCode: '',
    examName: '',
    category: '',
    weightage: undefined,
    status: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Exam Type Master"
      description="Manage Exam Type Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Exam Type Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Exam Code"
            value={form.examCode}
            onChange={v => handleChange('examCode', v)}
            placeholder="Enter Exam Code"
          />
          <TextBox
            label="Exam Name"
            value={form.examName}
            onChange={v => handleChange('examName', v)}
            placeholder="Enter Exam Name"
          />
          <DropDownList
            label="Category"
            value={form.category}
            onChange={v => handleChange('category', v)}
            data={[
              { text: 'Regular', value: 'regular' },
              { text: 'Supplementary', value: 'supplementary' },
              { text: 'Improvement', value: 'improvement' },
              { text: 'Back Paper', value: 'back_paper' },
            ]}
            placeholder="Select Category"
          />
          <NumberBox
            label="Weightage %"
            value={form.weightage}
            onChange={v => handleChange('weightage', v)}
            placeholder="Enter Weightage %"
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
