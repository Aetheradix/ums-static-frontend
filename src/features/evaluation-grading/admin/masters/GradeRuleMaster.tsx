import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox } from 'shared/components/forms';

export default function GradeRuleMaster() {
  const [form, setForm] = useState({
    gradeGroup: '',
    fromMarks: undefined,
    toMarks: undefined,
    gradeLetter: '',
    gradePoint: undefined,
    resultStatus: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Grade Rule Master"
      description="Manage Grade Rule Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Grade Rule Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Grade Group"
            value={form.gradeGroup}
            onChange={v => handleChange('gradeGroup', v)}
            data={[
              { text: 'Undergraduate', value: 'UG' },
              { text: 'Postgraduate', value: 'PG' },
              { text: 'Diploma', value: 'DIP' },
              { text: 'Doctorate', value: 'PHD' },
            ]}
            placeholder="Select Group"
          />
          <NumberBox
            label="From Marks"
            value={form.fromMarks}
            onChange={v => handleChange('fromMarks', v)}
            placeholder="From Marks"
          />
          <NumberBox
            label="To Marks"
            value={form.toMarks}
            onChange={v => handleChange('toMarks', v)}
            placeholder="To Marks"
          />
          <DropDownList
            label="Grade Letter"
            value={form.gradeLetter}
            onChange={v => handleChange('gradeLetter', v)}
            data={[
              { text: 'O', value: 'O' },
              { text: 'A+', value: 'A+' },
              { text: 'A', value: 'A' },
              { text: 'B+', value: 'B+' },
              { text: 'B', value: 'B' },
              { text: 'C', value: 'C' },
              { text: 'P', value: 'P' },
              { text: 'F', value: 'F' },
            ]}
            placeholder="Select Letter"
          />
          <NumberBox
            label="Grade Point"
            value={form.gradePoint}
            onChange={v => handleChange('gradePoint', v)}
            placeholder="Enter Grade Point"
          />
          <DropDownList
            label="Result Status"
            value={form.resultStatus}
            onChange={v => handleChange('resultStatus', v)}
            data={[
              { text: 'Pass', value: 'pass' },
              { text: 'Fail', value: 'fail' },
              { text: 'Promoted', value: 'promoted' },
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
