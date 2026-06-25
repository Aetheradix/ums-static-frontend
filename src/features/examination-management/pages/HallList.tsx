import { useParams, useNavigate } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button, StatusButton } from 'shared/components/buttons';
import { useHallsQuery, useHallStatusMutation } from '../queries';

export default function HallList() {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const cid = Number(centerId);
  const { data, isLoading } = useHallsQuery(cid);
  const { mutateAsync: toggleStatus } = useHallStatusMutation();

  const handleToggleStatus = async (item: Examination.HallItem) => {
    await toggleStatus({
      centerId: cid,
      id: item.id,
      isActive: !item.isActive,
    });
  };

  return (
    <FormPage
      title="Hall Management"
      description={`Halls / rooms for center #${cid}`}
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search halls..."
          columns={[
            { field: 'hallCode', header: 'Hall Code' },
            { field: 'hallName', header: 'Hall Name' },
            { field: 'floor', header: 'Floor' },
            { field: 'capacity', header: 'Capacity' },
            { field: 'hallType', header: 'Type' },
            {
              header: 'Status',
              cell: (item: Examination.HallItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <div className="mt-4">
        <Button
          label="Navigate to Hall List"
          icon="pi-external-link"
          onClick={() => navigate('/examination-management/centers')}
        />
      </div>
    </FormPage>
  );
}
