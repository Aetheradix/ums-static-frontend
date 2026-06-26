import { useState } from 'react';
import { ToastService } from 'services';
import {
  DatePicker,
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';

interface LeaveApplication {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const INITIAL_HISTORY: LeaveApplication[] = [
  {
    id: 'LV-1024',
    leaveType: 'Casual Leave',
    startDate: '2026-05-10',
    endDate: '2026-05-11',
    days: 2,
    reason: 'Family function at hometown.',
    status: 'Approved',
  },
  {
    id: 'LV-0985',
    leaveType: 'Medical Leave',
    startDate: '2026-04-12',
    endDate: '2026-04-15',
    days: 4,
    reason: 'Severe throat infection and fever.',
    status: 'Approved',
  },
  {
    id: 'LV-1120',
    leaveType: 'Earned Leave',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    days: 5,
    reason: 'Personal relocation work.',
    status: 'Pending',
  },
];

export default function LeaveManagement() {
  const { register, handleSubmit, reset } = useAppForm({});
  const [history, setHistory] = useState<LeaveApplication[]>(INITIAL_HISTORY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    { id: 'Casual Leave', name: 'Casual Leave' },
    { id: 'Earned Leave', name: 'Earned Leave' },
    { id: 'Medical Leave', name: 'Medical Leave' },
    { id: 'Maternity/Paternity Leave', name: 'Maternity/Paternity Leave' },
  ];

  const sessions = [
    { id: 'Full Day', name: 'Full Day' },
    { id: 'First Half', name: 'First Half' },
    { id: 'Second Half', name: 'Second Half' },
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedLeaveType =
      typeof data.leaveType === 'object' && data.leaveType
        ? data.leaveType.id || data.leaveType.name
        : data.leaveType;

    const newLeave: LeaveApplication = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      leaveType: selectedLeaveType || 'Casual Leave',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      days: 3,
      reason: data.reason || 'No reason provided.',
      status: 'Pending',
    };

    setHistory([newLeave, ...history]);
    setIsSubmitting(false);
    ToastService.success('Leave application submitted successfully!');
    reset();
  };

  return (
    <FormPage
      title="Request Leave"
      description="Apply for leaves, view balances, and check status of applications."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'ESS Portal', to: '#' },
        { label: 'Request Leave', to: '#' },
      ]}
    >
      {/* Leave Balances Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
            Casual Leave
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-indigo-900">8</span>
            <span className="text-sm font-medium text-indigo-700">
              / 12 days left
            </span>
          </div>
          <p className="text-xs text-indigo-600/80 mt-1 font-semibold">
            Carry Forward: 0
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
            Earned Leave
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-emerald-900">20</span>
            <span className="text-sm font-medium text-emerald-700">
              / 30 days left
            </span>
          </div>
          <p className="text-xs text-emerald-600/80 mt-1 font-semibold">
            Carry Forward: 5
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
            Medical Leave
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-amber-900">8</span>
            <span className="text-sm font-medium text-amber-700">
              / 10 days left
            </span>
          </div>
          <p className="text-xs text-amber-600/80 mt-1 font-semibold">
            Carry Forward: 2
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">
            Maternity/Paternity
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-purple-900">180</span>
            <span className="text-sm font-medium text-purple-700">
              / 180 days left
            </span>
          </div>
          <p className="text-xs text-purple-600/80 mt-1 font-semibold">
            Carry Forward: 0
          </p>
        </div>
      </div>

      {/* Application Form */}
      <FormCard title="Apply for Leave" icon="calendar-plus">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGrid columns={3}>
            <DropDownList
              {...register('leaveType')}
              label="Leave Type"
              placeholder="Select Leave Type"
              data={leaveTypes}
              textField="name"
              valueField="id"
              required
            />

            <DatePicker
              {...register('startDate')}
              label="From Date"
              placeholder="Select start date"
              required
            />

            <DatePicker
              {...register('endDate')}
              label="To Date"
              placeholder="Select end date"
              required
            />

            <DropDownList
              {...register('session')}
              label="Session"
              placeholder="Select Session"
              data={sessions}
              textField="name"
              valueField="id"
            />

            <TextBox
              {...register('alternateArrangement')}
              label="Alternate Arrangement"
              placeholder="Name of colleague covering duty"
            />

            <FileUpload
              {...register('document')}
              label="Supporting Document"
              accept=".pdf,.jpg,.jpeg,.png"
              mode="file"
              uploadNote="PDF or image, max 2 MB"
            />

            <div className="col-span-full">
              <TextArea
                {...register('reason')}
                label="Reason for Leave"
                placeholder="Enter reason for leave"
                rows={3}
                required
              />
            </div>
          </FormGrid>

          <FormActions
            isLoading={isSubmitting}
            saveLabel="Apply Leave"
            onReset={() => reset()}
          />
        </form>
      </FormCard>

      {/* History Table */}
      <FormCard title="My Leave Application History" icon="history">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 border-none">Application ID</th>
                <th className="px-6 py-3 border-none">Leave Type</th>
                <th className="px-6 py-3 border-none">Duration</th>
                <th className="px-6 py-3 border-none text-center">Days</th>
                <th className="px-6 py-3 border-none">Reason</th>
                <th className="px-6 py-3 border-none text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">{item.leaveType}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-700">
                    {item.startDate} to {item.endDate}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">
                    {item.days}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs">{item.reason}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge
                      variant={
                        item.status === 'Approved'
                          ? 'approved'
                          : item.status === 'Pending'
                            ? 'pending'
                            : 'rejected'
                      }
                      label={item.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
