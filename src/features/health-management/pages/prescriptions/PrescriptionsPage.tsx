import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { prescriptions } from '../../data';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const data = useMemo(() => prescriptions, []);

  return (
    <FormPage
      title="Prescriptions"
      description="Issue and manage medicine prescriptions."
      breadcrumbs={getHmsBreadcrumbs('Prescriptions')}
      headerAction={
        <Button
          onClick={() => navigate(hmsUrls.addPrescription)}
          label="New Prescription"
          icon="plus"
        />
      }
    >
      <FormCard title="All Prescriptions">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={['patientName', 'prescribedBy']}
          columns={[
            {
              field: 'id',
              header: 'ID',
              width: '100px',
              cell: (r: any) => <span className="font-medium">{r.id}</span>,
            },
            {
              field: 'patientName',
              header: 'Patient',
              cell: (r: any) => (
                <span className="font-medium">{r.patientName}</span>
              ),
            },
            { field: 'prescribedBy', header: 'Doctor', width: '160px' },
            { field: 'prescribedOn', header: 'Date', width: '110px' },
            {
              header: 'Items',
              width: '80px',
              cell: (r: any) => <span>{r.items?.length ?? 0}</span>,
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
