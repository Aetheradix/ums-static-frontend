import { useState } from 'react';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function OUCoordinatorMapping() {
  const [formData, setFormData] = useState({
    userId: '',
    ouId: '',
  });

  const mockMappings = [
    {
      id: '1',
      user: 'John Doe (EMP001)',
      ou: 'Computer Science Engineering',
      assignedDate: '2024-01-15',
    },
    {
      id: '2',
      user: 'Alice Smith (EMP045)',
      ou: 'Mechanical Engineering',
      assignedDate: '2024-02-20',
    },
  ];

  const handleAssign = () => {
    // Add logic to save the assignment
    setFormData({ userId: '', ouId: '' });
  };

  return (
    <FormPage
      title="OU Coordinator Mapping"
      description="Assign faculty or staff members as Training & Placement Coordinators for specific Organization Units."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Settings', to: tpUrls.admin.settings.hub },
        { label: 'OU Coordinators' },
      ]}
    >
      <div className="mb-8">
        <FormCard title="Assign Coordinator">
          <FormGrid>
            <div className="col-span-12 md:col-span-5">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                User (Faculty/Staff) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.userId}
                onChange={e =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select User</option>
                <option value="user-1">John Doe (EMP001)</option>
                <option value="user-2">Alice Smith (EMP045)</option>
              </select>
            </div>

            <div className="col-span-12 md:col-span-5">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Organization Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ouId}
                onChange={e =>
                  setFormData({ ...formData, ouId: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Department/OU</option>
                <option value="ou-1">Computer Science Engineering</option>
                <option value="ou-2">Mechanical Engineering</option>
                <option value="ou-3">MBA</option>
              </select>
            </div>

            <div className="col-span-12 md:col-span-2 flex items-end">
              <button
                onClick={handleAssign}
                disabled={!formData.userId || !formData.ouId}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </FormGrid>
        </FormCard>
      </div>

      <FormCard title="Assigned Coordinators">
        <div className="p-4">
          <GridPanel
            data={mockMappings}
            dataKey="id"
            emptyMessage="No coordinators assigned yet."
            columns={
              [
                { field: 'user', header: 'Coordinator' },
                { field: 'ou', header: 'Department/OU' },
                { field: 'assignedDate', header: 'Assigned Date' },
                {
                  field: 'actions',
                  header: 'Actions',
                  body: () => (
                    <button className="text-red-600 hover:text-red-800 p-1">
                      <i className="pi pi-trash" />
                    </button>
                  ),
                },
              ] as never[]
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
