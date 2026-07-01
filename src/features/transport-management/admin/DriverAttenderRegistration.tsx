import { useState } from 'react';
import {
  Checkbox,
  DatePicker,
  DropDownList,
  TextBox,
} from 'shared/components/forms';
import Grid from 'shared/components/grid/Grid';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';

const staffTypes = [
  { name: 'Driver', value: 'driver' },
  { name: 'Attender', value: 'attender' },
];

export default function DriverAttenderRegistration() {
  const [form, setForm] = useState({
    staffType: 'driver',
    name: '',
    fatherName: '',
    mobile: '',
    aadhaar: '',
    drivingLicenseNo: '',
    licenseExpiry: undefined,
    experience: '',
    address: '',
    joiningDate: undefined,
    isActive: true,
  });

  const [records, setRecords] = useState([
    {
      name: 'Ramesh Singh',
      role: 'Driver',
      mobile: '9876543210',
      drivingLicenseNo: 'MP04 20121111',
      experience: '8',
      isActive: true,
    },
    {
      name: 'Vikram Yadav',
      role: 'Driver',
      mobile: '9123456789',
      drivingLicenseNo: 'MP04 20152222',
      experience: '5',
      isActive: true,
    },
    {
      name: 'Sunil Kumar',
      role: 'Attender',
      mobile: '9988776655',
      drivingLicenseNo: '-',
      experience: '-',
      isActive: false,
    },
  ]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) return;
    setRecords(prev => [
      ...prev,
      {
        name: form.name,
        role: form.staffType === 'driver' ? 'Driver' : 'Attender',
        mobile: form.mobile,
        drivingLicenseNo:
          form.staffType === 'driver' ? form.drivingLicenseNo || '-' : '-',
        experience: form.staffType === 'driver' ? form.experience || '-' : '-',
        isActive: form.isActive,
      },
    ]);
    setForm({
      staffType: 'driver',
      name: '',
      fatherName: '',
      mobile: '',
      aadhaar: '',
      drivingLicenseNo: '',
      licenseExpiry: undefined,
      experience: '',
      address: '',
      joiningDate: undefined,
      isActive: true,
    });
  };

  const isDriver = form.staffType === 'driver';

  return (
    <FormPage
      title="Driver & Attender Registration"
      description="Register drivers and attenders."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Driver & Attender Registration' },
      ]}
    >
      <FormCard title="Staff Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Staff Type"
            data={staffTypes}
            value={form.staffType}
            onChange={v => handleChange('staffType', String(v))}
            textField="name"
            optionValue="value"
            required
          />
          <TextBox
            label="Name"
            value={form.name}
            onChange={v => handleChange('name', v)}
            placeholder="Enter Name"
            required
          />
          {isDriver && (
            <TextBox
              label="Father Name"
              value={form.fatherName}
              onChange={v => handleChange('fatherName', v)}
              placeholder="Enter Father Name"
            />
          )}
          <TextBox
            label="Mobile Number"
            value={form.mobile}
            onChange={v => handleChange('mobile', v)}
            placeholder="Enter Mobile"
            required
          />
          <TextBox
            label="Aadhaar Number"
            value={form.aadhaar}
            onChange={v => handleChange('aadhaar', v)}
            placeholder="Enter Aadhaar"
            required
          />
          <TextBox
            label="Address"
            value={form.address}
            onChange={v => handleChange('address', v)}
            placeholder="Enter Full Address"
          />
          <DatePicker
            label="Joining Date"
            value={form.joiningDate}
            onChange={v => handleChange('joiningDate', v)}
            placeholder="DD/MM/YYYY"
            required
          />

          {isDriver && (
            <>
              <TextBox
                label="Driving License No"
                value={form.drivingLicenseNo}
                onChange={v => handleChange('drivingLicenseNo', v)}
                placeholder="Enter DL Number"
                required
              />
              <DatePicker
                label="License Expiry"
                value={form.licenseExpiry}
                onChange={v => handleChange('licenseExpiry', v)}
                placeholder="DD/MM/YYYY"
                required
              />
              <TextBox
                label="Experience (Years)"
                value={form.experience}
                onChange={v => handleChange('experience', v)}
                placeholder="Ex: 5"
              />
            </>
          )}

          <div className="flex items-center pt-6">
            <Checkbox
              label="Status (Active/InActive)"
              checked={form.isActive}
              onChange={(e: any) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Registered Staff (Dummy Data)" className="mt-4">
        <Grid
          data={records}
          columns={[
            { field: 'name', header: 'Name' },
            { field: 'role', header: 'Role' },
            { field: 'mobile', header: 'Contact No' },
            { field: 'drivingLicenseNo', header: 'License No' },
            {
              field: 'experience',
              header: 'Experience',
              cell: (rowData: any) => (
                <span>
                  {rowData.experience === '-'
                    ? '-'
                    : `${rowData.experience} Years`}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (rowData: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${rowData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {rowData.isActive ? 'Active' : 'Inactive'}
                </span>
              ),
            },
          ]}
          onEdit={() => {}}
          onRemove={() => {}}
        />

        <div className="mt-4 border-t border-gray-200 pt-4">
          <FormActions
            align="left"
            onSave={handleSave}
            onReset={() => window.location.reload()}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
