import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
export default function EquipmentIssueReturnPage() {
  const [formData, setFormData] = useState({
    studentNo: '',
    equipment: '',
    quantity: '',
    dueDate: undefined,
  });

  const equipmentOptions = [
    { id: '1', name: 'Cricket Bat (English Willow) - Avail: 8' },
    { id: '2', name: 'Football (Size 5) - Avail: 20' },
  ];

  const mockData = [
    {
      id: 1,
      student: 'John Doe (CS2025001)',
      equipment: 'Cricket Bat',
      qty: 1,
      issueDate: '2026-06-25',
      dueDate: '2026-07-25',
      returnDate: '-',
      status: 'Issued',
    },
    {
      id: 2,
      student: 'Jane Smith (EC2025042)',
      equipment: 'Football',
      qty: 2,
      issueDate: '2026-06-20',
      dueDate: '2026-06-22',
      returnDate: '2026-06-22',
      status: 'Returned',
    },
    {
      id: 3,
      student: 'Mike Ross (ME2025110)',
      equipment: 'Badminton Racket',
      qty: 1,
      issueDate: '2026-06-15',
      dueDate: '2026-06-20',
      returnDate: '-',
      status: 'Overdue',
    },
  ];

  const handleIssue = () => {
    ToastService.success('Equipment issued successfully!');
    setFormData({
      studentNo: '',
      equipment: '',
      quantity: '',
      dueDate: undefined,
    });
  };

  return (
    <FormPage
      title="Equipment Issue & Return"
      description="Issue sports equipment to students and track their returns."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Booking Management' },
        { label: 'Equipment Issue/Return' },
      ]}
    >
      <FormCard title="Issue Equipment">
        <FormGrid>
          <TextBox
            label="Student Roll No"
            placeholder="e.g. CS2025001"
            required
            value={formData.studentNo}
            onChange={(val: any) =>
              setFormData({ ...formData, studentNo: val })
            }
          />
          <DropDownList
            label="Select Equipment"
            data={equipmentOptions}
            textField="name"
            valueField="id"
            placeholder="Select Equipment"
            required
            value={formData.equipment}
            onChange={(val: any) =>
              setFormData({ ...formData, equipment: val })
            }
          />
          <TextBox
            label="Quantity Issued"
            type="number"
            placeholder="Ensure within available qty"
            required
            value={formData.quantity}
            onChange={(val: any) => setFormData({ ...formData, quantity: val })}
          />
          <DatePicker
            label="Return Due Date"
            required
            value={formData.dueDate}
            onChange={(val: any) => setFormData({ ...formData, dueDate: val })}
          />
        </FormGrid>
        <div className="flex justify-end mt-6">
          <Button
            label="Issue Equipment"
            variant="primary"
            icon="outbox"
            onClick={handleIssue}
          />
        </div>
      </FormCard>

      <FormCard title="Equipment Register" className="mt-6">
        <GridPanel
          data={mockData}
          columns={[
            { field: 'student', header: 'Student' },
            { field: 'equipment', header: 'Equipment' },
            { field: 'qty', header: 'Qty' },
            { field: 'issueDate', header: 'Issue Date' },
            { field: 'dueDate', header: 'Due Date' },
            { field: 'returnDate', header: 'Return Date' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Returned'
                      ? 'approved'
                      : item.status === 'Overdue'
                        ? 'rejected'
                        : 'neutral'
                  }
                  label={item.status}
                />
              ),
            },
            {
              header: 'Action',
              cell: (item: any) =>
                item.status === 'Issued' || item.status === 'Overdue' ? (
                  <Button
                    label="Mark Returned"
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      ToastService.success('Equipment marked as returned')
                    }
                  />
                ) : (
                  <span className="text-slate-400">-</span>
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
