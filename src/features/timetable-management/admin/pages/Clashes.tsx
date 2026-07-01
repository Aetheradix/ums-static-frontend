import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import { statusVariant, type Clash, type ClashStatus } from '../../mocks';
import { useClashesQuery, useResolveClashMutation } from '../../queries';
import { timetableUrls } from '../../urls';

const STATUS_OPTIONS = [
  { name: 'Detected', value: 'Detected' },
  { name: 'Under Review', value: 'Under Review' },
  { name: 'Resolved', value: 'Resolved' },
];

export default function Clashes() {
  const { data: clashes, isLoading } = useClashesQuery();
  const resolveMutation = useResolveClashMutation();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Clash | null>(null);
  const [status, setStatus] = useState<ClashStatus>('Resolved');
  const [resolution, setResolution] = useState('');

  const handleOpen = (clash: Clash) => {
    setActive(clash);
    setStatus(clash.status === 'Detected' ? 'Resolved' : clash.status);
    setResolution(clash.resolution ?? '');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!active) return;
    if (!resolution.trim()) {
      ToastService.error('Please describe the resolution.');
      return;
    }
    try {
      await resolveMutation.mutateAsync({
        id: active.id,
        form: { status, resolution },
      });
      ToastService.success('Clash updated successfully.');
      setOpen(false);
    } catch {
      ToastService.error('Failed to update the clash.');
    }
  };

  return (
    <FormPage
      title="Scheduling Clashes"
      description="Review and resolve faculty, room, section and equipment conflicts."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Timetable Admin', to: timetableUrls.admin.portal },
        { label: 'Clashes' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={clashes}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by code, type or description..."
          columns={[
            { field: 'code', header: 'Clash', sortable: true },
            { field: 'type', header: 'Type' },
            { field: 'description', header: 'Description' },
            { field: 'day', header: 'Day' },
            { field: 'timeLabel', header: 'Slot' },
            {
              header: 'Severity',
              cell: (c: Clash) => (
                <StatusBadge
                  label={c.severity}
                  variant={statusVariant(c.severity)}
                />
              ),
            },
            {
              header: 'Status',
              cell: (c: Clash) => (
                <StatusBadge
                  label={c.status}
                  variant={statusVariant(c.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '110px',
              cell: (c: Clash) => (
                <Button
                  label="Resolve"
                  icon="check-circle"
                  variant="text"
                  size="small"
                  onClick={() => handleOpen(c)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={open}
        onHide={() => setOpen(false)}
        title={active ? `Resolve ${active.code}` : 'Resolve Clash'}
        subtitle={active?.description}
        size="lg"
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            valueField="value"
            value={status}
            onChange={val => setStatus(val as ClashStatus)}
          />
          <TextArea
            label="Resolution"
            placeholder="Describe how the conflict was resolved"
            value={resolution}
            onChange={setResolution}
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
              isLoading={resolveMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
