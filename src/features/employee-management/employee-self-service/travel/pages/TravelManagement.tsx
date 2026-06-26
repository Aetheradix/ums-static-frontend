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
  GridPanel,
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

    const selectedPurpose =
      typeof data.purpose === 'object' && data.purpose
        ? data.purpose.id || data.purpose.name
        : data.purpose;

    const selectedMode =
      typeof data.mode === 'object' && data.mode
        ? data.mode.id || data.mode.name
        : data.mode;

    const newTravel: TravelRecord = {
      id: `TRV-${Math.floor(5000 + Math.random() * 4999)}`,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      destination: data.destination || 'Bhopal',
      purpose: selectedPurpose || 'Official Duty',
      mode: selectedMode || 'Train',
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
        <GridPanel
          data={history}
          pagination={false}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '40px',
            },
            {
              field: 'id',
              header: 'Sanction Ref',
              cell: (item: TravelRecord) => (
                <span className="font-semibold text-gray-900">{item.id}</span>
              ),
            },
            {
              field: 'destination',
              header: 'Destination',
              cell: (item: TravelRecord) => (
                <span className="font-medium text-gray-900">
                  {item.destination}
                </span>
              ),
            },
            {
              header: 'Dates',
              cell: (item: TravelRecord) => (
                <span className="text-xs font-medium text-gray-700">
                  {item.startDate} to {item.endDate}
                </span>
              ),
            },
            {
              field: 'purpose',
              header: 'Purpose',
              cell: (item: TravelRecord) => (
                <span className="truncate max-w-xs block" title={item.purpose}>
                  {item.purpose}
                </span>
              ),
            },
            {
              field: 'mode',
              header: 'Mode',
              cell: (item: TravelRecord) => (
                <span className="font-bold text-gray-800">{item.mode}</span>
              ),
            },
            {
              field: 'sanctionedBy',
              header: 'Approved By',
              cell: (item: TravelRecord) => (
                <span className="text-xs font-semibold text-gray-600">
                  {item.sanctionedBy}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: TravelRecord) => (
                <StatusBadge
                  variant={
                    item.status === 'Completed' || item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Pending'
                        ? 'pending'
                        : 'rejected'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
