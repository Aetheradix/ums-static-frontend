import { useMemo } from 'react';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { LinkButton } from 'shared/components/buttons';
import { guestUsers } from '../../data';
import { hmsUrls } from '../../urls';

export default function GuestUsersPage() {
  const data = useMemo(() => guestUsers, []);

  return (
    <FormPage
      title="Guest Users"
      description="Manage guest health service users."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Guest Users' },
      ]}
      headerAction={
        <LinkButton to={hmsUrls.addGuestUser} label="Add Guest" icon="add" />
      }
    >
      <FormCard title="All Guest Users">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={['name', 'email', 'mobile']}
          columns={[
            {
              field: 'name',
              header: 'Name',
              cell: (r: any) => <span className="font-medium">{r.name}</span>,
            },
            { field: 'email', header: 'Email', width: '220px' },
            { field: 'mobile', header: 'Mobile', width: '140px' },
            { field: 'gender', header: 'Gender', width: '80px' },
            { field: 'bloodGroup', header: 'Blood', width: '80px' },
            {
              header: 'Status',
              width: '90px',
              cell: (r: any) => {
                const c =
                  r.status === 'Active'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700';
                return (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${c}`}
                  >
                    {r.status}
                  </span>
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
