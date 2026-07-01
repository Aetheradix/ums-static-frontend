import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { eventStatusVariant, type Event } from '../../mocks';
import { useEventsQuery } from '../../queries';
import { eventUrls } from '../../urls';

export default function EventList() {
  const navigate = useNavigate();
  const { data, isLoading } = useEventsQuery();

  return (
    <FormPage
      title="Events"
      description="All university events — create, edit and drill into event details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Event Administrator', to: eventUrls.admin.portal },
        { label: 'Events' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by title, code or category..."
          toolbar={
            <Button
              label="Create Event"
              icon="plus"
              variant="outlined"
              onClick={() => navigate(eventUrls.admin.eventNew)}
            />
          }
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'title', header: 'Title', sortable: true },
            { field: 'categoryName', header: 'Category' },
            {
              header: 'Status',
              cell: (item: Event) => (
                <StatusBadge
                  label={item.status}
                  variant={eventStatusVariant(item.status)}
                />
              ),
            },
            { field: 'startDate', header: 'Start Date' },
            {
              header: 'Registered',
              cell: (item: Event) => (
                <span>
                  {item.registered}/{item.capacity}
                </span>
              ),
            },
            {
              header: 'Actions',
              width: '150px',
              cell: (item: Event) => (
                <div className="flex items-center gap-2">
                  <Button
                    icon="eye"
                    variant="text"
                    size="small"
                    tooltip="View"
                    ariaLabel="View event"
                    onClick={() =>
                      navigate(eventUrls.admin.eventDetail(item.id))
                    }
                  />
                  <Button
                    icon="pencil"
                    variant="text"
                    size="small"
                    tooltip="Edit"
                    ariaLabel="Edit event"
                    onClick={() => navigate(eventUrls.admin.eventEdit(item.id))}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
