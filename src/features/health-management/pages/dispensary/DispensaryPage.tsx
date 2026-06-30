import { useMemo } from 'react';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { dispensaries } from '../../data';
import { hmsUrls } from '../../urls';

export default function DispensaryPage() {
  const data = useMemo(() => dispensaries, []);

  return (
    <FormPage
      title="Dispensary"
      description="View dispensed medicines and manage prescription fulfillment."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Dispensary' },
      ]}
    >
      <FormCard title="Dispensed Items">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={['patientName', 'dispensedBy']}
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
            { field: 'dispensedBy', header: 'Dispensed By', width: '160px' },
            { field: 'dispensedOn', header: 'Date', width: '110px' },
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
