import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function HostelRequest() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentName: '',
    categoryId: '',
    type: '',
    description: '',
    status: 'Open',
  });

  return (
    <FormPage
      title="Hostel Request / Complaint"
      description="Log and manage student requests, issues, and complaints."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Transactions', to: '/hostel-services/transactions/request' },
        { label: 'Requests & Complaints' },
      ]}
    >
      <FormCard title="Log New Request" icon="feedback">
        <FormGrid columns={3}>
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <DropDownList
            label="Category *"
            data={['Maintenance', 'Facility', 'Disciplinary', 'General'].map(
              c => ({ id: c, text: c })
            )}
            textField="text"
            valueField="id"
            value={form.categoryId}
            onChange={v => setForm({ ...form, categoryId: v as string })}
          />
          <DropDownList
            label="Request Type *"
            data={data.requestTypes.map(rt => ({ id: rt.name, text: rt.name }))}
            textField="text"
            valueField="id"
            value={form.type}
            onChange={v => setForm({ ...form, type: v as string })}
          />

          <div className="col-span-3">
            <TextBox
              label="Description"
              value={form.description}
              onChange={v => setForm({ ...form, description: v })}
            />
          </div>
          <DropDownList
            label="Status"
            data={[
              { id: 'Open', text: 'Open' },
              { id: 'Resolved', text: 'Resolved' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Submit Request" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Requests List" icon="list">
        <GridPanel
          data={data.requests}
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'categoryId', header: 'Category' },
            { field: 'type', header: 'Type' },
            { field: 'description', header: 'Description' },
            { field: 'resolution', header: 'Resolution Note' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
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
