import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { statusVariant, type Session } from '../../mocks';
import { useSessionsQuery } from '../../queries';
import { timetableUrls } from '../../urls';

export default function Sessions() {
  const navigate = useNavigate();
  const { data, isLoading } = useSessionsQuery();

  return (
    <FormPage
      title="Sessions & Time-slot Setup"
      description="Configure academic sessions, daily periods and examination windows."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Timetable Admin', to: timetableUrls.admin.portal },
        { label: 'Sessions & Time-slots' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by session name or code..."
          toolbar={
            <Button
              label="New Session Setup"
              icon="plus"
              variant="outlined"
              onClick={() => navigate(timetableUrls.admin.setupNew)}
            />
          }
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'name', header: 'Session', sortable: true },
            { field: 'code', header: 'Code' },
            { field: 'academicYear', header: 'Academic Year' },
            { field: 'startDate', header: 'Starts' },
            { field: 'endDate', header: 'Ends' },
            { field: 'periodsPerDay', header: 'Periods/Day' },
            {
              header: 'Status',
              cell: (s: Session) => (
                <StatusBadge
                  label={s.status}
                  variant={statusVariant(s.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '90px',
              cell: (s: Session) => (
                <Button
                  icon="pencil"
                  variant="text"
                  size="small"
                  tooltip="Edit"
                  ariaLabel="Edit session"
                  onClick={() => navigate(timetableUrls.admin.setupEdit(s.id))}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
