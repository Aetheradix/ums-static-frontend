import { useNavigate, useParams } from 'react-router-dom';
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormWizard } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import { statusVariant, timeSlots, type Session } from '../../mocks';
import type { SessionFormValues } from '../../api';
import {
  useCreateSessionMutation,
  useSessionsQuery,
  useUpdateSessionMutation,
} from '../../queries';
import { timetableUrls } from '../../urls';
import { useSetupForm, type SetupFormData } from './setup.hook';

const STATUS_OPTIONS = [
  { name: 'Draft', value: 'Draft' },
  { name: 'Active', value: 'Active' },
];

const formatDate = (d?: Date) =>
  d
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

const parseDate = (s?: string) => (s ? new Date(s) : undefined);

function toInitialData(s: Session): Partial<SetupFormData> {
  return {
    name: s.name,
    code: s.code,
    academicYear: s.academicYear,
    startDate: parseDate(s.startDate),
    endDate: parseDate(s.endDate),
    periodsPerDay: s.periodsPerDay,
    examWindowStart: parseDate(s.examWindowStart),
    examWindowEnd: parseDate(s.examWindowEnd),
    status: s.status,
    remarks: s.remarks,
  };
}

function SetupWizardInner({ existing }: { existing?: Session }) {
  const navigate = useNavigate();
  const isEdit = !!existing;
  const createMutation = useCreateSessionMutation();
  const updateMutation = useUpdateSessionMutation();

  const { register, handleSubmit, reset, trigger } = useSetupForm(
    async data => {
      const payload: SessionFormValues = {
        name: data.name,
        code: data.code,
        academicYear: data.academicYear,
        startDate: formatDate(data.startDate) ?? '',
        endDate: formatDate(data.endDate) ?? '',
        periodsPerDay: Number(data.periodsPerDay),
        examWindowStart: formatDate(data.examWindowStart),
        examWindowEnd: formatDate(data.examWindowEnd),
        status: data.status,
        remarks: data.remarks,
      };

      try {
        if (isEdit && existing) {
          await updateMutation.mutateAsync({ id: existing.id, form: payload });
          ToastService.success('Session updated successfully.');
        } else {
          await createMutation.mutateAsync(payload);
          ToastService.success('Session created successfully.');
        }
        navigate(timetableUrls.admin.setup);
      } catch {
        ToastService.error('Failed to save the session. Please try again.');
      }
    },
    existing ? toInitialData(existing) : undefined
  );

  const steps: WizardStep[] = [
    {
      label: 'Session',
      icon: 'calendar',
      content: (
        <FormCard title="Academic Session" icon="calendar">
          <FormGrid columns={2}>
            <TextBox
              {...register('name')}
              label="Session Name"
              placeholder="e.g. Odd Semester 2024-25"
              required
              maxLength={80}
            />
            <TextBox
              {...register('code')}
              label="Session Code"
              placeholder="e.g. ODD-2425"
              required
              maxLength={20}
            />
            <TextBox
              {...register('academicYear')}
              label="Academic Year"
              placeholder="e.g. 2024-2025"
              required
              maxLength={20}
            />
            <DropDownList
              {...register('status')}
              label="Status"
              placeholder="Select Status"
              data={STATUS_OPTIONS}
              textField="name"
              valueField="value"
              required
            />
            <DatePicker
              {...register('startDate')}
              label="Start Date"
              placeholder="Select session start"
              required
            />
            <DatePicker
              {...register('endDate')}
              label="End Date"
              placeholder="Select session end"
              required
            />
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Time Periods',
      icon: 'list',
      content: (
        <FormCard title="Daily Time Periods" icon="list">
          <FormGrid columns={2}>
            <NumberBox
              {...register('periodsPerDay')}
              label="Periods per Day"
              min={1}
              max={12}
              required
            />
          </FormGrid>
          <div className="mt-4 ttm-week-scroll">
            <table className="ttm-week-table">
              <thead>
                <tr className="ttm-week-head">
                  <th>Period</th>
                  <th>Label</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot.id}>
                    <td>{slot.period}</td>
                    <td>{slot.label}</td>
                    <td>{slot.startTime}</td>
                    <td>{slot.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      ),
    },
    {
      label: 'Exam Window',
      icon: 'check-circle',
      content: (
        <FormCard title="Examination Window" icon="check-circle">
          <FormGrid columns={2}>
            <DatePicker
              {...register('examWindowStart')}
              label="Exam Window Start"
              placeholder="Select start date (if any)"
            />
            <DatePicker
              {...register('examWindowEnd')}
              label="Exam Window End"
              placeholder="Select end date (if any)"
            />
            <div className="col-span-full">
              <TextArea
                {...register('remarks')}
                label="Remarks"
                placeholder="Working days, holidays or special notes"
                rows={3}
              />
            </div>
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Review',
      icon: 'eye',
      content: (
        <FormCard title="Review & Confirm" icon="eye">
          <p className="text-sm text-gray-600">
            Please review the session details on the previous steps. On
            confirmation the session will be {isEdit ? 'updated' : 'created'}{' '}
            and made available for timetable generation.
          </p>
          <div className="mt-4">
            <StatusBadge
              label={isEdit ? 'Editing existing session' : 'New session'}
              variant={statusVariant(isEdit ? 'Active' : 'Draft')}
            />
          </div>
        </FormCard>
      ),
    },
  ];

  return (
    <FormPage
      title={isEdit ? 'Edit Session Setup' : 'New Session Setup'}
      description={
        isEdit
          ? 'Update the academic session, periods and exam window.'
          : 'Configure a new academic session, its periods and exam window.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Sessions & Time-slots', to: timetableUrls.admin.setup },
        { label: isEdit ? 'Edit' : 'New' },
      ]}
    >
      <FormWizard
        steps={steps}
        onComplete={handleSubmit as () => void}
        isSaving={createMutation.isPending || updateMutation.isPending}
        triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
        onReset={reset}
        isEdit={isEdit}
      />
    </FormPage>
  );
}

export default function SetupWizard() {
  const { id } = useParams();
  const isEdit = !!id;
  const { data, isLoading } = useSessionsQuery();
  const existing = isEdit ? data.find(s => String(s.id) === id) : undefined;

  if (isEdit && !existing) {
    return (
      <FormPage
        title="Edit Session Setup"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Timetable Management', to: timetableUrls.portal },
          { label: 'Sessions & Time-slots', to: timetableUrls.admin.setup },
          { label: 'Edit' },
        ]}
      >
        <FormCard>
          <p className="p-4 text-sm text-gray-500">
            {isLoading ? 'Loading session…' : 'Session not found.'}
          </p>
        </FormCard>
      </FormPage>
    );
  }

  return <SetupWizardInner key={existing?.id ?? 'new'} existing={existing} />;
}
