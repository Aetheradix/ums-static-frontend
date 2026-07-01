import { useState } from 'react';
import {
  FormPage,
  FormCard,
  FormGrid,
  FormActions,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, Checkbox } from 'shared/components/forms';

export default function RouteRegistrationMaster() {
  const [form, setForm] = useState({
    routeNo: '',
    routeName: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Route Registration Master"
      description="Register main routes for transport."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Route Registration Master' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Add / Edit Route">
            <FormGrid columns={1}>
              <TextBox
                label="Route No"
                value={form.routeNo}
                onChange={v => handleChange('routeNo', v)}
                placeholder="Ex: R-01"
                required
              />
              <TextBox
                label="Route Name"
                value={form.routeName}
                onChange={v => handleChange('routeName', v)}
                placeholder="Ex: City Center Express"
                required
              />
              <TextBox
                label="Start Point"
                value={form.startPoint}
                onChange={v => handleChange('startPoint', v)}
                placeholder="Ex: Main Square"
              />
              <TextBox
                label="End Point"
                value={form.endPoint}
                onChange={v => handleChange('endPoint', v)}
                placeholder="Ex: College Campus"
              />
              <TextBox
                label="Approx Distance (Km)"
                value={form.distance}
                onChange={v => handleChange('distance', v)}
                placeholder="Ex: 15"
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
          <FormCard title="Registered Routes List">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Route No</th>
                    <th className="px-4 py-3 font-semibold">Route Name</th>
                    <th className="px-4 py-3 font-semibold">Path</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">R-01</td>
                    <td className="px-4 py-3 font-medium">
                      City Center Express
                    </td>
                    <td className="px-4 py-3">Square to Campus</td>
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
