import { useState } from 'react';
import { ToastService } from 'services';
import {
  DatePicker,
  DropDownList,
  FileUpload,
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

interface TravelRecord {
  id: string;
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  mode: string;
  sanctionedBy: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Completed';
}

const INITIAL_HISTORY: TravelRecord[] = [
  {
    id: 'TRV-4410',
    startDate: '2026-05-15',
    endDate: '2026-05-18',
    destination: 'New Delhi (JNU Campus)',
    purpose: 'Academic Conference Presentation',
    mode: 'Air',
    sanctionedBy: 'Registrar',
    status: 'Completed',
  },
  {
    id: 'TRV-4822',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    destination: 'Bhopal (RGPV University)',
    purpose: 'External PhD Viva Examination Duty',
    mode: 'Train',
    sanctionedBy: 'Dean Academics',
    status: 'Approved',
  },
];

export default function TravelManagement() {
  const { register, handleSubmit, reset } = useAppForm({});
  const [history, setHistory] = useState<TravelRecord[]>(INITIAL_HISTORY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const purposes = [
    { id: 'Conference', name: 'Conference Presentation' },
    { id: 'Training', name: 'Faculty Training Program' },
    { id: 'Official Duty', name: 'Official University Duty' },
    { id: 'Inspection', name: 'Campus Affiliation Inspection' },
  ];

  const travelModes = [
    { id: 'Air', name: 'Air' },
    { id: 'Train', name: 'Train' },
    { id: 'Road', name: 'Road' },
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTravel: TravelRecord = {
      id: `TRV-${Math.floor(5000 + Math.random() * 4999)}`,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      destination: data.destination || 'Bhopal',
      purpose: data.purpose || 'Official Duty',
      mode: data.mode || 'Train',
      sanctionedBy: data.sanctionedBy || 'Registrar',
      status: 'Pending',
    };

    setHistory([newTravel, ...history]);
    setIsSubmitting(false);
    ToastService.success('Travel sanction application logged successfully!');
    reset();
  };

  return (
    <FormPage
      title="Travel History & Sanctions"
      description="Apply for travel sanctions, document official tours, and log travel histories."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        {
          label: 'Employee Management',
          to: '/employee-management/manage-employees',
        },
        { label: 'ESS Portal', to: '#' },
        { label: 'Travel History', to: '#' },
      ]}
    >
      {/* Travel Sanction Request Form */}
      <FormCard title="Request Travel Sanction (Official Duty)" icon="send">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGrid columns={3}>
            <DatePicker
              {...register('startDate')}
              label="Departure Date"
              placeholder="Select departure date"
              required
            />

            <DatePicker
              {...register('endDate')}
              label="Return Date"
              placeholder="Select return date"
              required
            />

            <TextBox
              {...register('destination')}
              label="Destination City / Institution"
              placeholder="e.g. IISc Bangalore"
              required
            />

            <DropDownList
              {...register('purpose')}
              label="Purpose of Visit"
              placeholder="Select Purpose"
              data={purposes}
              textField="name"
              valueField="id"
              required
            />

            <DropDownList
              {...register('mode')}
              label="Proposed Mode of Travel"
              placeholder="Select Mode"
              data={travelModes}
              textField="name"
              valueField="id"
              required
            />

            <TextBox
              {...register('sanctionedBy')}
              label="Sanctioning Authority"
              placeholder="e.g. Dean Academics / Registrar"
              required
            />

            <FileUpload
              {...register('dutyOrder')}
              label="Upload Invitation / Duty Order (PDF)"
              accept=".pdf,.doc,.docx"
              mode="file"
              uploadNote="PDF or Word document, max 5 MB"
            />
          </FormGrid>

          <FormActions
            isLoading={isSubmitting}
            saveLabel="Submit Request"
            onReset={() => reset()}
          />
        </form>
      </FormCard>

      {/* Travel History Logs */}
      <FormCard title="My Travel Log History" icon="compass">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 border-none">Sanction Ref</th>
                <th className="px-6 py-3 border-none">Destination</th>
                <th className="px-6 py-3 border-none">Dates</th>
                <th className="px-6 py-3 border-none">Purpose</th>
                <th className="px-6 py-3 border-none text-center">Mode</th>
                <th className="px-6 py-3 border-none">Approved By</th>
                <th className="px-6 py-3 border-none text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.destination}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-700">
                    {item.startDate} to {item.endDate}
                  </td>
                  <td
                    className="px-6 py-4 truncate max-w-xs"
                    title={item.purpose}
                  >
                    {item.purpose}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">
                    {item.mode}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                    {item.sanctionedBy}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge
                      variant={
                        item.status === 'Completed' ||
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
