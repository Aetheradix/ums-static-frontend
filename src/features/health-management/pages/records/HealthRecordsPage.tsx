import { useMemo } from 'react';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { LinkButton } from 'shared/components/buttons';
import { healthRecords } from '../../data';
import { hmsUrls } from '../../urls';

const recordColors: Record<string, string> = {
  Yes: 'bg-amber-50 text-amber-700',
  No: 'bg-green-50 text-green-700',
};

function ReferralBadge({ label }: { label: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block ${recordColors[label] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {label}
    </span>
  );
}

export default function HealthRecordsPage() {
  const data = useMemo(() => healthRecords, []);

  return (
    <FormPage
      title="Health Records"
      description="View and manage patient health records across all health centers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Health Records' },
      ]}
      headerAction={
        <LinkButton to={hmsUrls.addRecord} label="Add Record" icon="add" />
      }
    >
      <FormCard title="All Health Records">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={[
            'memberName',
            'chiefComplaint',
            'createdBy',
            'healthCenter',
          ]}
          columns={[
            {
              field: 'memberName',
              header: 'Patient',
              cell: (r: any) => (
                <span className="font-medium">{r.memberName}</span>
              ),
            },
            { field: 'membershipTypeName', header: 'Plan', width: '140px' },
            { field: 'healthCenter', header: 'Center', width: '150px' },
            { field: 'dateOfVisit', header: 'Visit Date', width: '110px' },
            { field: 'timeOfVisit', header: 'Time', width: '80px' },
            {
              field: 'chiefComplaint',
              header: 'Complaint',
              cell: (r: any) => (
                <span className="truncate block max-w-[200px]">
                  {r.chiefComplaint}
                </span>
              ),
            },
            {
              header: 'Referred',
              width: '90px',
              cell: (r: any) => <ReferralBadge label={r.referredToHospital} />,
            },
            { field: 'createdBy', header: 'Doctor', width: '150px' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
