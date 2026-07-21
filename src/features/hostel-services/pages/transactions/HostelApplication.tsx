import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function HostelApplication() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    hostelId: '',
    applicationDate: '',
    status: 'Pending',
  });

  return (
    <FormPage
      title="Hostel Application"
      description="Manage student applications for hostel accommodation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/application',
        },
        { label: 'Hostel Application' },
      ]}
    >
      <FormCard title="New Application" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Student ID *"
            value={form.studentId}
            onChange={v => setForm({ ...form, studentId: v })}
          />
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <DropDownList
            label="Applied Hostel *"
            data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
            textField="text"
            valueField="id"
            value={form.hostelId}
            onChange={v => setForm({ ...form, hostelId: v as string })}
          />
          <TextBox
            label="Application Date"
            type="date"
            value={form.applicationDate}
            onChange={v => setForm({ ...form, applicationDate: v })}
          />
          <DropDownList
            label="Status"
            data={[
              { id: 'Pending', text: 'Pending' },
              { id: 'Approved', text: 'Approved' },
              { id: 'Rejected', text: 'Rejected' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Submit" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Applications List" icon="list">
        <GridPanel
          data={data.applications}
          columns={[
            { field: 'studentId', header: 'Student ID' },
            { field: 'studentName', header: 'Student Name' },
            {
              field: 'hostelId',
              header: 'Applied Hostel',
              cell: (item: any) => (
                <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
              ),
            },
            { field: 'applicationDate', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
