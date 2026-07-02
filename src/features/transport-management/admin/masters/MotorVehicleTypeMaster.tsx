import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, Checkbox } from 'shared/components/forms';

export default function MotorVehicleTypeMaster() {
  const [form, setForm] = useState({
    vehicleType: '',
    description: '',
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Motor Vehicle Type Master"
      description="Manage different types of motor vehicles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Vehicle Type Master' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Add / Edit Vehicle Type">
            <FormGrid columns={1}>
              <TextBox
                label="Vehicle Type"
                value={form.vehicleType}
                onChange={v => handleChange('vehicleType', v)}
                placeholder="Ex: Bus, Van, Car"
                required
              />
              <TextBox
                label="Description"
                value={form.description}
                onChange={v => handleChange('description', v)}
                placeholder="Type details"
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
            <FormActions
              align="left"
              onReset={() => window.location.reload()}
            />
          </FormCard>
        </div>

        <div className="md:col-span-2">
          <FormCard title="Vehicle Types List">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">S.No</th>
                    <th className="px-4 py-3 font-semibold">Vehicle Type</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 font-medium">Bus</td>
                    <td className="px-4 py-3">Heavy Passenger Vehicle</td>
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
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3 font-medium">Van</td>
                    <td className="px-4 py-3">Light Passenger Vehicle</td>
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
