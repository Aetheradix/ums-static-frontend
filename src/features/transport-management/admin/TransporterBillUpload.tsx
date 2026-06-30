import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';

const transporters = [
  { name: 'Rajesh Travels', value: 'rajesh_travels' },
  { name: 'City Bus Service', value: 'cbs' },
];

const months = [
  { name: 'January 2026', value: '01-2026' },
  { name: 'February 2026', value: '02-2026' },
  { name: 'March 2026', value: '03-2026' },
];

export default function TransporterBillUpload() {
  const [form, setForm] = useState({
    transporter: '',
    month: '',
    billNumber: '',
    billDate: undefined,
    amount: '',
    billPdf: null,
    approvalStatus: 'Pending',
    paymentStatus: 'Unpaid',
    remarks: '',
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Transporter Bill Upload"
      description="Upload and manage transporter bills and payments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Admin Login',
          to: '/transport-management/admin-login/dashboard',
        },
        { label: 'Transporter Bill Upload' },
      ]}
    >
      <FormCard title="Bill Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Transporter"
            data={transporters}
            value={form.transporter}
            onChange={v => handleChange('transporter', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Transporter"
            required
          />
          <DropDownList
            label="Month"
            data={months}
            value={form.month}
            onChange={v => handleChange('month', String(v))}
            textField="name"
            optionValue="value"
            placeholder="Select Month"
            required
          />
          <TextBox
            label="Bill Number"
            value={form.billNumber}
            onChange={v => handleChange('billNumber', v)}
            placeholder="Enter Bill No"
            required
          />
          <DatePicker
            label="Bill Date"
            value={form.billDate}
            onChange={v => handleChange('billDate', v)}
            placeholder="DD/MM/YYYY"
            required
          />
          <TextBox
            label="Amount (₹)"
            value={form.amount}
            onChange={v => handleChange('amount', v)}
            placeholder="Enter Amount"
            required
          />
          <FileUpload
            label="Upload Bill PDF"
            value={form.billPdf}
            onChange={file => handleChange('billPdf', file)}
          />
          <TextBox
            label="Remarks"
            value={form.remarks}
            onChange={v => handleChange('remarks', v)}
            placeholder="Any notes"
          />
        </FormGrid>
      </FormCard>

      <div className="flex items-center gap-4 mt-8">
        <Button
          label="Upload Bill"
          variant="success"
          className="min-w-[120px]"
        />
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
