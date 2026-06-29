import { mockAlumniProfiles } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function VerifiedAlumni() {
  const verifiedAlumni = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  );

  const columns = [
    { field: 'enrolmentNo', header: 'Enrolment No' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'program', header: 'Program' },
    { field: 'yearOfPassing', header: 'Year of Passing' },
    { field: 'ouCode', header: 'Department' },
    { field: 'emailAddress', header: 'Email' },
    { field: 'mobileNumber', header: 'Mobile' },
    { field: 'currentCity', header: 'City' },
    { field: 'currentEmployer', header: 'Employer' },
    { field: 'designation', header: 'Designation' },
    {
      field: 'status',
      header: 'Status',
      body: () => <StatusBadge label="Verified" variant="approved" />,
    },
  ];

  return (
    <FormPage
      title="Verified Alumni Directory"
      description="Complete directory of all verified alumni — search, filter and view profiles"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Verified Alumni' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            data={verifiedAlumni}
            columns={columns as any}
            editCaption="View Profile"
            onEdit={() => {}}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
