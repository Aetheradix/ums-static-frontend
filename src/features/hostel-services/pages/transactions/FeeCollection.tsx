import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_ID,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function FeeCollection() {
  const { data, addRecord } = useHostelContext();
  const { isStudent, isAdmin, activePortal } = useHostelRole();

  const initialForm = {
    studentId: '',
    studentName: '',
    feeComponentId: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    receiptNo: `REC-${Math.floor(100 + Math.random() * 900)}`,
    status: 'Paid' as const,
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.studentId || !form.studentName || !form.amountPaid) {
      alert(
        'Please fill in all required fields (Student ID, Name, and Amount Paid).'
      );
      return;
    }

    addRecord('feeCollections', {
      id: `FCX${Date.now()}`,
      studentId: form.studentId,
      studentName: form.studentName,
      feeComponentId: form.feeComponentId || 'FC1',
      amountPaid: parseFloat(form.amountPaid) || 0,
      paymentDate: form.paymentDate,
      receiptNo:
        form.receiptNo || `REC-${Math.floor(100 + Math.random() * 900)}`,
      status: form.status,
    });

    setForm({
      ...initialForm,
      receiptNo: `REC-${Math.floor(100 + Math.random() * 900)}`,
    });
  };

  // Filter data based on role
  const filteredCollections = isStudent
    ? data.feeCollections.filter(fc => fc.studentId === MOCK_STUDENT_ID)
    : data.feeCollections;

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={isStudent ? 'My Fee Payments' : 'Fee Collection & Receipt'}
      description={
        isStudent
          ? 'View your fee payment history and download receipts.'
          : 'Record student fee payments and generate receipts.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: isStudent ? 'Fee Payment' : 'Fee Collection' },
      ]}
    >
      {/* Only Admin can record payments */}
      {isAdmin && (
        <FormCard title="Record Payment" icon="price_check">
          <FormGrid columns={4}>
            <TextBox
              label="Student ID *"
              value={form.studentId}
              onChange={v => setForm({ ...form, studentId: v })}
            />
            <TextBox
              label="Student Name *"
              value={form.studentName}
              onChange={v => setForm({ ...form, studentName: v })}
            />
            <DropDownList
              label="Fee Component *"
              data={data.feeComponents.map(fc => ({
                id: fc.id,
                text: fc.name,
              }))}
              textField="text"
              valueField="id"
              value={form.feeComponentId}
              onChange={v => setForm({ ...form, feeComponentId: v as string })}
            />
            <TextBox
              label="Amount Paid (₹) *"
              value={form.amountPaid}
              onChange={v => setForm({ ...form, amountPaid: v })}
            />

            <TextBox
              label="Payment Date"
              type="date"
              value={form.paymentDate}
              onChange={v => setForm({ ...form, paymentDate: v })}
            />
            <TextBox
              label="Receipt No."
              value={form.receiptNo}
              onChange={v => setForm({ ...form, receiptNo: v })}
            />
            <DropDownList
              label="Status"
              data={[
                { id: 'Paid', text: 'Paid' },
                { id: 'Pending', text: 'Pending' },
              ]}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v => setForm({ ...form, status: v as any })}
            />
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Record Payment"
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

      <FormCard
        title={isStudent ? 'My Payment History' : 'Collection List'}
        icon="list"
      >
        <GridPanel
          data={filteredCollections}
          columns={[
            { field: 'receiptNo', header: 'Receipt No' },
            ...(!isStudent
              ? [{ field: 'studentId', header: 'Student ID' }]
              : []),
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
            {
              field: 'feeComponentId',
              header: 'Fee Component',
              cell: (item: any) =>
                (
                  <>
                    {
                      data.feeComponents.find(
                        fc => fc.id === item.feeComponentId
                      )?.name
                    }
                  </>
                ) || 'Hostel Fee',
            },
            { field: 'amountPaid', header: 'Amount Paid (₹)' },
            { field: 'paymentDate', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
