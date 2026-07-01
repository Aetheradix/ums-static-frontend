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

const vehicleTypes = [
  { name: 'Bus', value: 'bus' },
  { name: 'Van', value: 'van' },
  { name: 'Car', value: 'car' },
];

const fuelTypes = [
  { name: 'Diesel', value: 'diesel' },
  { name: 'Petrol', value: 'petrol' },
  { name: 'CNG', value: 'cng' },
  { name: 'Electric', value: 'electric' },
];

export default function VehicleRegistration() {
  const [form, setForm] = useState({
    vehicleNumber: '',
    vehicleType: '',
    vehicleCompany: '',
    model: '',
    manufacturingYear: '',
    fuelType: '',
    seatingCapacity: '',
    engineNumber: '',
    chassisNumber: '',
    rcNumber: '',
    insuranceCompany: '',
    insuranceNumber: '',
    insuranceExpiry: undefined,
    fitnessExpiry: undefined,
    pucExpiry: undefined,
    registrationDate: undefined as Date | undefined,
    isActive: true,
  });

  const [records, setRecords] = useState([
    {
      vehicleNumber: 'MP04 AB 1234',
      type: 'Bus',
      fuelType: 'Diesel',
      capacity: '50',
      registrationDate: '12/05/2021',
      isActive: true,
    },
    {
      vehicleNumber: 'MP04 XY 9876',
      type: 'Van',
      fuelType: 'CNG',
      capacity: '15',
      registrationDate: '23/08/2023',
      isActive: true,
    },
    {
      vehicleNumber: 'MP04 ZQ 1122',
      type: 'Car',
      fuelType: 'Petrol',
      capacity: '4',
      registrationDate: '05/01/2024',
      isActive: false,
    },
  ]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.vehicleNumber || !form.vehicleType) return;
    setRecords(prev => [
      ...prev,
      {
        vehicleNumber: form.vehicleNumber,
        type:
          vehicleTypes.find(v => String(v.value) === String(form.vehicleType))
            ?.name || form.vehicleType,
        fuelType:
          fuelTypes.find(f => String(f.value) === String(form.fuelType))
            ?.name || form.fuelType,
        capacity: form.seatingCapacity,
        registrationDate:
          form.registrationDate instanceof Date
            ? (form.registrationDate as Date).toLocaleDateString('en-GB')
            : '-',
        isActive: form.isActive,
      },
    ]);

    setForm({
      vehicleNumber: '',
      vehicleType: '',
      vehicleCompany: '',
      model: '',
      manufacturingYear: '',
      fuelType: '',
      seatingCapacity: '',
      engineNumber: '',
      chassisNumber: '',
      rcNumber: '',
      insuranceCompany: '',
      insuranceNumber: '',
      insuranceExpiry: undefined,
      fitnessExpiry: undefined,
      pucExpiry: undefined,
      registrationDate: undefined,
      isActive: true,
    });
  };

  return (
    <FormPage
      title="Vehicle Registration"
      description="Register and manage all transport vehicles."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Vehicle Registration' },
      ]}
    >
      <FormCard title="Vehicle Details">
        <FormGrid columns={4}>
          <TextBox
            label="Vehicle Number"
            value={form.vehicleNumber}
            onChange={v => handleChange('vehicleNumber', v)}
            placeholder="Ex: MP04AB1234"
            required
          />
          <DropDownList
            label="Vehicle Type"
            data={vehicleTypes}
            value={form.vehicleType}
            onChange={v => handleChange('vehicleType', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select"
            required
          />
          <TextBox
            label="Vehicle Company"
            value={form.vehicleCompany}
            onChange={v => handleChange('vehicleCompany', v)}
            placeholder="Ex: Tata, Ashok Leyland"
          />
          <TextBox
            label="Model"
            value={form.model}
            onChange={v => handleChange('model', v)}
            placeholder="Enter Model"
          />
          <TextBox
            label="Manufacturing Year"
            value={form.manufacturingYear}
            onChange={v => handleChange('manufacturingYear', v)}
            placeholder="Ex: 2020"
          />
          <DropDownList
            label="Fuel Type"
            data={fuelTypes}
            value={form.fuelType}
            onChange={v => handleChange('fuelType', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select"
            required
          />
          <TextBox
            label="Seating Capacity"
            value={form.seatingCapacity}
            onChange={v => handleChange('seatingCapacity', v)}
            placeholder="Enter Capacity"
            required
          />
          <TextBox
            label="Engine Number"
            value={form.engineNumber}
            onChange={v => handleChange('engineNumber', v)}
            placeholder="Enter Engine Number"
          />
          <TextBox
            label="Chassis Number"
            value={form.chassisNumber}
            onChange={v => handleChange('chassisNumber', v)}
            placeholder="Enter Chassis Number"
          />
          <DatePicker
            label="Registration Date"
            value={form.registrationDate}
            onChange={v => handleChange('registrationDate', v)}
            placeholder="DD/MM/YYYY"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Status (Active/InActive)"
              checked={form.isActive}
              onChange={(e: any) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Compliance & Document Details" className="mt-4">
        <FormGrid columns={4}>
          <TextBox
            label="RC Number"
            value={form.rcNumber}
            onChange={v => handleChange('rcNumber', v)}
            placeholder="Enter RC Number"
            required
          />
          <TextBox
            label="Insurance Company"
            value={form.insuranceCompany}
            onChange={v => handleChange('insuranceCompany', v)}
            placeholder="Enter Insurance Company"
          />
          <TextBox
            label="Insurance Number"
            value={form.insuranceNumber}
            onChange={v => handleChange('insuranceNumber', v)}
            placeholder="Enter Insurance Policy No"
          />
          <DatePicker
            label="Insurance Expiry"
            value={form.insuranceExpiry}
            onChange={v => handleChange('insuranceExpiry', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <DatePicker
            label="Fitness Expiry"
            value={form.fitnessExpiry}
            onChange={v => handleChange('fitnessExpiry', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <DatePicker
            label="PUC Expiry"
            value={form.pucExpiry}
            onChange={v => handleChange('pucExpiry', v)}
            placeholder="DD/MM/YYYY"
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Registered Vehicles (Dummy Data)" className="mt-4">
        <Grid
          data={records}
          columns={[
            { field: 'vehicleNumber', header: 'Vehicle Number' },
            { field: 'type', header: 'Type' },
            { field: 'fuelType', header: 'Fuel Type' },
            { field: 'capacity', header: 'Capacity' },
            { field: 'registrationDate', header: 'Registration Date' },
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
