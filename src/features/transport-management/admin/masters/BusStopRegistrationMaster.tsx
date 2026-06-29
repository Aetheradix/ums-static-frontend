import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, Checkbox } from 'shared/components/forms';

export default function BusStopRegistrationMaster() {
  const [form, setForm] = useState({
    stopName: '',
    landmark: '',
    latitude: '',
    longitude: '',
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Bus Stop Registration Master"
      description="Register bus stops and pickup points."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Bus Stop Registration' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Add / Edit Stop">
            <FormGrid columns={1}>
              <TextBox
                label="Stop Name"
                value={form.stopName}
                onChange={v => handleChange('stopName', v)}
                placeholder="Ex: Main Square"
                required
              />
              <TextBox
                label="Landmark"
                value={form.landmark}
                onChange={v => handleChange('landmark', v)}
                placeholder="Near XYZ building"
              />
              <TextBox
                label="Latitude"
                value={form.latitude}
                onChange={v => handleChange('latitude', v)}
                placeholder="Ex: 23.2599"
              />
              <TextBox
                label="Longitude"
                value={form.longitude}
                onChange={v => handleChange('longitude', v)}
                placeholder="Ex: 77.4126"
              />
              <div className="flex items-center pt-2">
                <Checkbox
                  label="Is Active"
                  checked={form.isActive}
                  onChange={(e: any) =>
                    handleChange('isActive', e.target.checked)
                  }
                />
              </div>
            </FormGrid>
            <div className="flex items-center gap-4 mt-6">
              <Button label="Save" variant="success" className="w-full" />
              <Button
                label="Clear"
                variant="danger"
                className="w-full"
                onClick={() => window.location.reload()}
              />
            </div>
          </FormCard>
        </div>

        <div className="md:col-span-2">
          <FormCard title="Registered Stops List">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">S.No</th>
                    <th className="px-4 py-3 font-semibold">Stop Name</th>
                    <th className="px-4 py-3 font-semibold">Landmark</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 font-medium">Main Square</td>
                    <td className="px-4 py-3">Near Clock Tower</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Edit"
                        variant="primary"
                        icon="pencil"
                        className="p-1 text-xs h-8"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
