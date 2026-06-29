import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  Checkbox,
} from 'shared/components/forms';

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
    registrationDate: undefined,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

      <div className="flex items-center gap-4 mt-8">
        <Button label="Save" variant="success" className="min-w-[120px]" />
        <Button
          label="Clear"
          variant="danger"
          className="min-w-[120px]"
          onClick={() => window.location.reload()}
        />
      </div>
    </FormPage>
  );
}
