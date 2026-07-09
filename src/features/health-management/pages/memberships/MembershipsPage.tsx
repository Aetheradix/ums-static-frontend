import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { memberships } from '../../data';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  Inactive: 'bg-red-50 text-red-700',
};

function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block ${statusColors[label] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {label}
    </span>
  );
}

export default function MembershipsPage() {
  const navigate = useNavigate();
  const data = useMemo(() => memberships, []);

  return (
    <FormPage
      title="Memberships"
      description="Manage health memberships for employees, students, and guests."
      breadcrumbs={getHmsBreadcrumbs('Memberships')}
      headerAction={
        <Button
          onClick={() => navigate(hmsUrls.addMembership)}
          label="Add Membership"
          icon="plus"
        />
      }
    >
      <FormCard title="All Memberships">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={[
            'memberName',
            'memberType',
            'membershipTypeName',
            'healthCenter',
          ]}
          columns={[
            {
              field: 'memberName',
              header: 'Member Name',
              cell: (r: any) => (
                <span className="font-medium">{r.memberName}</span>
              ),
            },
            { field: 'memberType', header: 'Type', width: '100px' },
            { field: 'membershipTypeName', header: 'Plan', width: '160px' },
            { field: 'healthCenter', header: 'Health Center', width: '160px' },
            { field: 'validFrom', header: 'Valid From', width: '110px' },
            {
              field: 'validTill',
              header: 'Valid Till',
              width: '110px',
              cell: (r: any) =>
                r.validTill ||
                (r.validityType === 'Lifetime' ? (
                  <StatusBadge label="Lifetime" />
                ) : (
                  '-'
                )),
            },
            {
              header: 'Dependents',
              width: '100px',
              cell: (r: any) => <span>{r.dependents?.length ?? 0}</span>,
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
