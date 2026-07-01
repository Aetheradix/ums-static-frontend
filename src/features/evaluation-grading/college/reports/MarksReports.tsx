import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList } from 'shared/components/forms';

export default function MarksReports() {
  const [showReport, setShowReport] = useState(false);

  const mockData = [
    {
      id: 1,
      studentName: 'John Doe',
      rollNo: 'CS2021001',
      program: 'B.Tech',
      semester: '4',
      status: 'Pass',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      rollNo: 'CS2021002',
      program: 'B.Tech',
      semester: '4',
      status: 'Pass',
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      rollNo: 'CS2021003',
      program: 'B.Tech',
      semester: '4',
      status: 'Fail',
    },
    {
      id: 4,
      studentName: 'Emily Davis',
      rollNo: 'CS2021004',
      program: 'B.Tech',
      semester: '4',
      status: 'Pass',
    },
    {
      id: 5,
      studentName: 'Chris Wilson',
      rollNo: 'CS2021005',
      program: 'B.Tech',
      semester: '4',
      status: 'Withheld',
    },
  ];

  const [form, setForm] = useState({
    programme: '',
    batch: '',
    semester: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Marks Reports"
      description="Manage Marks Reports"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Marks Reports' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Programme"
            value={form.programme}
            onChange={(v: any) => handleChange('programme', v)}
            data={[
              { text: 'B.Tech', value: 'B.Tech' },
              { text: 'MBA', value: 'MBA' },
              { text: 'M.Tech', value: 'M.Tech' },
            ]}
            placeholder="Select Programme"
          />
          <DropDownList
            label="Batch"
            value={form.batch}
            onChange={(v: any) => handleChange('batch', v)}
            data={[
              { text: '2021', value: '2021' },
              { text: '2022', value: '2022' },
              { text: '2023', value: '2023' },
            ]}
            placeholder="Select Batch"
          />
          <DropDownList
            label="Semester"
            value={form.semester}
            onChange={(v: any) => handleChange('semester', v)}
            data={[
              { text: '1', value: '1' },
              { text: '2', value: '2' },
              { text: '3', value: '3' },
              { text: '4', value: '4' },
            ]}
            placeholder="Select Semester"
          />
        </FormGrid>
      </FormCard>

      <FormCard>
        <div className="flex items-center gap-4 mt-8">
          <Button
            label="Generate Report"
            variant="success"
            className="min-w-[150px]"
            onClick={() => setShowReport(true)}
          />
          <Button
            label="Clear"
            variant="danger"
            className="min-w-[120px]"
            onClick={() => window.location.reload()}
          />
        </div>
      </FormCard>

      {showReport && (
        <div className="mt-8">
          <FormCard title="Generated Report Results">
            <DataTable
              value={mockData}
              stripedRows
              paginator
              rows={5}
              className="w-full"
            >
              <Column field="rollNo" header="Roll No" />
              <Column field="studentName" header="Student Name" />
              <Column field="program" header="Program" />
              <Column field="semester" header="Semester" />
              <Column field="status" header="Status" />
            </DataTable>
          </FormCard>
        </div>
      )}
    </FormPage>
  );
}
