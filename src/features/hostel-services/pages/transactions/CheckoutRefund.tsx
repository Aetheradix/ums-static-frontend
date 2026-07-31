import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_NAME,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function CheckoutRefund() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isAdmin, activePortal } = useHostelRole();

  const initialForm = {
    roomId: '',
    vacateDate: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.roomId) {
      alert('Please fill in Room No.');
      return;
    }

    addRecord('checkouts', {
      id: `CO${Date.now()}`,
      studentName: MOCK_STUDENT_NAME,
      roomId: form.roomId,
      vacateDate: form.vacateDate,
      depositAmount: 5000,
      refundAmount: 5000,
      refundStatus: 'Pending',
    });

    setForm(initialForm);
  };

  // Filter data based on role
  const filteredCheckouts = isStudent
    ? data.checkouts.filter(c => c.studentName === MOCK_STUDENT_NAME)
    : data.checkouts;

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={
        isStudent ? 'Vacate / Checkout' : 'Vacate/Checkout & Deposit Refund'
      }
      description={
        isStudent
          ? 'Initiate hostel checkout and track your deposit refund status.'
          : 'Review student checkouts and process deposit refunds.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: isStudent ? 'Vacate / Checkout' : 'Checkout & Refund' },
      ]}
    >
      {/* Form is only shown to Students to initiate checkout */}
      {isStudent && (
        <FormCard title="Initiate Checkout Request" icon="exit_to_app">
          <FormGrid columns={2}>
            <TextBox
              label="Room No *"
              value={form.roomId}
              onChange={v => setForm({ ...form, roomId: v })}
            />
            <TextBox
              label="Vacate Date *"
              type="date"
              value={form.vacateDate}
              onChange={v => setForm({ ...form, vacateDate: v })}
            />
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Submit Checkout Request"
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

      {/* Admin sees only the checkout list with Process Refund action */}
      <FormCard
        title={isStudent ? 'My Checkout History' : 'Checkout Logs'}
        icon="list"
      >
        <GridPanel
          data={filteredCheckouts}
          columns={[
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
            { field: 'roomId', header: 'Room No' },
            { field: 'vacateDate', header: 'Vacate Date' },
            { field: 'depositAmount', header: 'Deposit (₹)' },
            { field: 'refundAmount', header: 'Refund (₹)' },
            {
              field: 'refundStatus',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.refundStatus === 'Processed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.refundStatus}
                </span>
              ),
            },
            // Admin can process refund
            ...(isAdmin
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (item: any) => (
                      <div className="flex gap-2">
                        {item.refundStatus === 'Pending' && (
                          <Button
                            label="Process Refund"
                            variant="primary"
                            size="small"
                            icon="payments"
                            onClick={() =>
                              updateRecord('checkouts', item.id, {
                                ...item,
                                refundStatus: 'Processed',
                              })
                            }
                          />
                        )}
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
