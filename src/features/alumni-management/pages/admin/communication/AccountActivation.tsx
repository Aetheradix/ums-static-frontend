import { mockAlumniProfiles } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function AccountActivation() {
  const verifiedAlumni = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  );

  const columns = [
    { field: 'enrolmentNo', header: 'Enrolment No' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'program', header: 'Program' },
    { field: 'emailAddress', header: 'Email Address' },
    { field: 'mobileNumber', header: 'Mobile' },
    {
      field: 'status',
      header: 'Verification Status',
      body: () => <StatusBadge label="Verified" variant="approved" />,
    },
    { field: 'actionDetails', header: 'Last Action' },
  ];

  return (
    <FormPage
      title="Account Activation Emails"
      description="Send account setup links to verified alumni who haven't activated yet"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Account Activation Emails' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            toolbar={<Button label="Send to Selected" icon="pi pi-send" />}
            data={verifiedAlumni}
            columns={columns as any}
            editCaption="Resend Link"
            onEdit={() => {}}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
