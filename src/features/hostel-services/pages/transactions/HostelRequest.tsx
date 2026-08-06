import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_NAME,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function HostelRequest() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isWarden, isAdmin, activePortal } = useHostelRole();

  const initialForm = {
    categoryId: 'Maintenance',
    type: 'Electrical Repair',
    description: '',
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.description) {
      alert('Please fill in Description.');
      return;
    }

    addRecord('requests', {
      id: `REQ${Date.now()}`,
      studentName: MOCK_STUDENT_NAME,
      categoryId: form.categoryId,
      type: form.type || form.categoryId,
      description: form.description,
      resolution: '',
      resolutionDate: '',
      status: 'Open',
    });

    setForm(initialForm);
  };

  // Filter data based on role — students see only their own requests
  const filteredRequests = isStudent
    ? data.requests.filter(r => r.studentName === MOCK_STUDENT_NAME)
    : data.requests;

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={
        isStudent ? 'My Requests & Complaints' : 'Hostel Request / Complaint'
      }
      description={
        isStudent
          ? 'Raise maintenance requests and complaints to hostel administration.'
          : 'Track and resolve student maintenance requests and complaints.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Requests & Complaints' },
      ]}
    >
      {/* Form is only shown to Students to raise requests */}
      {isStudent && (
        <FormCard title="Raise New Request" icon="feedback">
          <FormGrid columns={3}>
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
              data={data.requestTypes.map(rt => ({
                id: rt.name,
                text: rt.name,
              }))}
              textField="text"
              valueField="id"
              value={form.type}
              onChange={v => setForm({ ...form, type: v as string })}
            />
            <div className="col-span-3">
              <TextBox
                label="Description *"
                value={form.description}
                onChange={v => setForm({ ...form, description: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Submit Request"
              variant="primary"
              onClick={handleSubmit}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(initialForm)}
            />
          </div>
        </FormCard>
      )}

      {/* Admin / Warden sees only the requests list with Resolve action */}
      <FormCard title={isStudent ? 'My Requests' : 'Requests List'} icon="list">
        <GridPanel
          data={filteredRequests}
          columns={[
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
            { field: 'categoryId', header: 'Category' },
            { field: 'type', header: 'Type' },
            { field: 'description', header: 'Description' },
            ...(!isStudent
              ? [{ field: 'resolution', header: 'Resolution Note' }]
              : []),
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
            // Warden/Admin can resolve
            ...(isWarden || isAdmin
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (item: any) => (
                      <div className="flex gap-2">
                        {item.status === 'Open' && (
                          <Button
                            label="Resolve"
                            variant="primary"
                            size="small"
                            icon="check"
                            onClick={() =>
                              updateRecord('requests', item.id, {
                                ...item,
                                status: 'Resolved',
                                resolution: 'Resolved by Admin/Warden',
                                resolutionDate: new Date()
                                  .toISOString()
                                  .split('T')[0],
                              })
                            }
                          />
                        )}
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
