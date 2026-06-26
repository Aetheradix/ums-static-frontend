import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button, StatusButton } from 'shared/components/buttons';
import { useHallsQuery, useHallStatusMutation } from '../../../queries';
import HallForm from '../../../components/HallForm';

export default function HallList() {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const cid = Number(centerId);
  const { data, isLoading } = useHallsQuery(cid);
  const { mutateAsync: toggleStatus } = useHallStatusMutation();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });

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
          toolbar={
            <Button
              label="Add Hall"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
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
            {
              header: 'Actions',
              cell: (item: Examination.HallItem) => (
                <Button
                  icon="pencil"
                  variant="text"
                  tooltip="Edit"
                  onClick={() => setPopup({ mode: 'edit', id: item.id })}
                />
              ),
            },
          ]}
        />
      </FormCard>
      <div className="mt-4">
        <Button
          label="Back to Centers"
          icon="arrow-left"
          variant="text"
          onClick={() => navigate('/examination-management/setup/centers')}
        />
      </div>
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'create' ? 'Add Hall' : 'Edit Hall'}
        subtitle={`Manage hall for center #${cid}`}
      >
        <HallForm
          centerId={cid}
          id={popup.mode === 'edit' ? popup.id : undefined}
          onClose={() => setPopup({ mode: 'closed' })}
        />
      </FormPopup>
    </FormPage>
  );
}
