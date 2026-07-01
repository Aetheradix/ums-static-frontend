import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { ToastService } from 'services';
import { statusVariant, type Timetable } from '../../mocks';
import { usePublishTimetableMutation, useTimetablesQuery } from '../../queries';
import { timetableUrls } from '../../urls';

export default function Timetables() {
  const { data, isLoading } = useTimetablesQuery();
  const publishMutation = usePublishTimetableMutation();

  const handlePublish = async (timetable: Timetable) => {
    try {
      await publishMutation.mutateAsync(timetable.id);
      ToastService.success(`${timetable.name} published.`);
    } catch {
      ToastService.error('Failed to publish the timetable.');
    }
  };

  return (
    <FormPage
      title="Timetables"
      description="Browse generated timetables and publish them for students and faculty."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Timetable Admin', to: timetableUrls.admin.portal },
        { label: 'Timetables' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by name, section or session..."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'name', header: 'Timetable', sortable: true },
            { field: 'sectionName', header: 'Section' },
            { field: 'sessionName', header: 'Session' },
            { field: 'classesCount', header: 'Classes' },
            { field: 'generatedOn', header: 'Generated On' },
            {
              header: 'Status',
              cell: (t: Timetable) => (
                <StatusBadge
                  label={t.status}
                  variant={statusVariant(t.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '120px',
              cell: (t: Timetable) => (
                <Button
                  label="Publish"
                  icon="check-circle"
                  variant="text"
                  size="small"
                  isLoading={
                    publishMutation.isPending &&
                    publishMutation.variables === t.id
                  }
                  onClick={() => handlePublish(t)}
                  ariaLabel="Publish timetable"
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
