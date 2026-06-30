import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';

const routes = [{ name: 'R-01 (City Center)', value: 'r1' }];

const stops = [
  { name: 'Main Square', value: 's1' },
  { name: 'Clock Tower', value: 's2' },
];

export default function BusStopEnrollment() {
  const [form, setForm] = useState({
    route: '',
    stop: '',
    admissionNo: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Bus Stop Enrollment"
      description="Quickly enroll students to a specific route and bus stop."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
        { label: 'Bus Stop Enrollment' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FormCard title="Enroll Student">
            <FormGrid columns={1}>
              <DropDownList
                label="Route"
                data={routes}
                value={form.route}
                onChange={v => handleChange('route', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Route"
                required
              />
              <DropDownList
                label="Stop"
                data={stops}
                value={form.stop}
                onChange={v => handleChange('stop', String(v))}
                textField="name"
                optionValue="value"
                placeholder="Select Stop"
                required
              />

              <div className="border-t pt-4 mt-2">
                <TextBox
                  label="Admission No"
                  value={form.admissionNo}
                  onChange={v => handleChange('admissionNo', v)}
                  placeholder="Ex: 2026/055"
                />
                <Button
                  label="Enroll to Stop"
                  variant="success"
                  className="w-full mt-4"
                  icon="plus"
                />
              </div>
            </FormGrid>
          </FormCard>
        </div>

        <div className="md:col-span-2">
          <FormCard title="Enrolled Students at Selected Stop">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg">
                <thead className="bg-[#f48b50] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Adm No</th>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Course / Branch</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">2026/001</td>
                    <td className="px-4 py-3">Rahul Sharma</td>
                    <td className="px-4 py-3">B.Tech / CSE</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        label="Remove"
                        variant="danger"
                        className="p-1 text-xs h-8"
                        icon="trash"
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
