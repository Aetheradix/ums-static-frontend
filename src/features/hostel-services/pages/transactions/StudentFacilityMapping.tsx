import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function StudentFacilityMapping() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentName: '',
    facilityId: '',
    mappedDate: '',
  });

  return (
    <FormPage
      title="Student-Facility Mapping"
      description="Map optional facilities (like Gym, Laundry) to students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/student-facility-mapping',
        },
        { label: 'Facility Mapping' },
      ]}
    >
      <FormCard title="Bulk Import" icon="upload_file">
        <div className="flex items-center gap-4 py-4">
          <Button
            label="Download Excel Format"
            variant="outlined"
            icon="download"
            onClick={() => {}}
          />
          <input type="file" className="border border-gray-300 rounded p-1" />
          <Button
            label="Import Facilities"
            variant="primary"
            icon="upload"
            onClick={() => {}}
          />
        </div>
      </FormCard>

      <FormCard title="Map Individual Facility" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <DropDownList
            label="Facility *"
            data={data.facilities.map(f => ({ id: f.id, text: f.name }))}
            textField="text"
            valueField="id"
            value={form.facilityId}
            onChange={v => setForm({ ...form, facilityId: v as string })}
          />
          <TextBox
            label="Mapped Date"
            type="date"
            value={form.mappedDate}
            onChange={v => setForm({ ...form, mappedDate: v })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Map Facility" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Mapped Facilities List" icon="list">
        <GridPanel
          data={data.studentFacilities}
          columns={[
            { field: 'studentName', header: 'Student Name' },
            {
              field: 'facilityId',
              header: 'Facility',
              cell: (item: any) => (
                <>{data.facilities.find(f => f.id === item.facilityId)?.name}</>
              ),
            },
            { field: 'mappedDate', header: 'Date Mapped' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
