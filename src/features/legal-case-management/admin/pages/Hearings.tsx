import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import {
  hearingStatusVariant,
  type Attendance,
  type Hearing,
  type HearingStatus,
} from '../../mocks';
import {
  useCasesQuery,
  useCreateHearingMutation,
  useHearingsQuery,
} from '../../queries';
import { legalUrls } from '../../urls';

const ATTENDANCE_OPTIONS = [
  { name: 'Attended', value: 'Attended' },
  { name: 'Not Attended', value: 'Not Attended' },
];

const STATUS_OPTIONS = [
  { name: 'Scheduled', value: 'Scheduled' },
  { name: 'Completed', value: 'Completed' },
  { name: 'Adjourned', value: 'Adjourned' },
];

const formatDate = (d?: Date) =>
  d
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

export default function Hearings() {
  const { data: cases } = useCasesQuery();
  const { data: hearings, isLoading } = useHearingsQuery();
  const createMutation = useCreateHearingMutation();

  const [open, setOpen] = useState(false);
  const [caseId, setCaseId] = useState<number | null>(null);
  const [hearingDate, setHearingDate] = useState<Date | undefined>();
  const [attendance, setAttendance] = useState<Attendance>('Attended');
  const [notes, setNotes] = useState('');
  const [nextHearingDate, setNextHearingDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<HearingStatus>('Scheduled');

  const resetForm = () => {
    setCaseId(null);
    setHearingDate(undefined);
    setAttendance('Attended');
    setNotes('');
    setNextHearingDate(undefined);
    setStatus('Scheduled');
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!caseId) {
      ToastService.error('Please select a case.');
      return;
    }
    if (!hearingDate) {
      ToastService.error('Please select a hearing date.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        caseId,
        hearingDate: formatDate(hearingDate) ?? '',
        attendance,
        notes,
        nextHearingDate: formatDate(nextHearingDate),
        status,
      });
      ToastService.success('Hearing scheduled successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to save the hearing.');
    }
  };

  return (
    <FormPage
      title="Hearings"
      description="Schedule and track hearing dates, attendance and adjournments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Administrator', to: legalUrls.admin.portal },
        { label: 'Hearings' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={hearings}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by case no. or court..."
          toolbar={
            <Button
              label="Schedule Hearing"
              icon="plus"
              variant="outlined"
              onClick={handleOpen}
            />
          }
          columns={[
            { field: 'caseNumber', header: 'Case No.', sortable: true },
            { field: 'hearingDate', header: 'Hearing Date' },
            { field: 'courtName', header: 'Court' },
            { field: 'attendance', header: 'Attendance' },
            { field: 'nextHearingDate', header: 'Next Hearing' },
            {
              header: 'Status',
              cell: (h: Hearing) => (
                <StatusBadge
                  label={h.status}
                  variant={hearingStatusVariant(h.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title="Schedule Hearing"
        subtitle="Record a hearing date, attendance and outcome."
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Case"
            placeholder="Select Case"
            data={cases}
            textField="caseNumber"
            valueField="id"
            value={caseId}
            onChange={val => setCaseId(val as number)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DatePicker
              label="Hearing Date"
              placeholder="Select hearing date"
              value={hearingDate}
              onChange={val => setHearingDate(val ?? undefined)}
              required
            />
            <DatePicker
              label="Next Hearing Date"
              placeholder="Select next date (if any)"
              value={nextHearingDate}
              onChange={val => setNextHearingDate(val ?? undefined)}
            />
            <DropDownList
              label="Attendance"
              data={ATTENDANCE_OPTIONS}
              textField="name"
              valueField="value"
              value={attendance}
              onChange={val => setAttendance(val as Attendance)}
            />
            <DropDownList
              label="Status"
              data={STATUS_OPTIONS}
              textField="name"
              valueField="value"
              value={status}
              onChange={val => setStatus(val as HearingStatus)}
            />
          </div>
          <TextArea
            label="Notes"
            placeholder="Proceedings summary / observations"
            value={notes}
            onChange={setNotes}
            rows={3}
          />

          <div className="mt-2 flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setOpen(false)}
            />
            <Button
              label="Save"
              variant="primary"
              isLoading={createMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
