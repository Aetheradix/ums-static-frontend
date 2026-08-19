import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
  Stepper,
} from 'shared/new-components';

const applicationSteps = [
  {
    label: 'Application Submitted',
    description: 'College affiliation form submitted on 05 Aug 2026.',
    icon: 'pi pi-send',
  },
  {
    label: 'Affiliation Admin Approval',
    description:
      'Application verified and approved by the affiliation admin on 08 Aug 2026.',
    icon: 'pi pi-verified',
  },
  {
    label: 'Inspection Team Assigned',
    description:
      'Inspection committee assigned; physical visit scheduled for 18 Aug 2026.',
    icon: 'pi pi-calendar',
  },
  {
    label: 'Physical Inspection',
    description:
      'On-site inspection will be conducted at the college on the scheduled date.',
    icon: 'pi pi-search',
  },
  {
    label: 'Inspection Report Upload',
    description:
      'Inspection outcome will be uploaded by admin on behalf of the inspection team.',
    icon: 'pi pi-file',
  },
  {
    label: 'Standing Committee Decision',
    description:
      'The standing committee will review the inspection report and record its decision.',
    icon: 'pi pi-users',
  },
  {
    label: 'Final Approval',
    description: 'Final affiliation decision will be issued to the college.',
    icon: 'pi pi-check-circle',
  },
  {
    label: 'Affiliation Certificate Generated',
    description:
      'The affiliation certificate will be generated and shared with the college.',
    icon: 'pi pi-file-check',
  },
];

export default function ApplicationStatusView() {
  return (
    <FormPage
      title="Application Status"
      description="Track where your college affiliation application is in the approval process."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Affiliation Management System' },
        { label: 'Application Status' },
      ]}
    >
      <FormCard
        title="Application Summary"
        subtitle="Details of your submitted affiliation application."
        icon="info-circle"
        headerAction={<StatusBadge label="In Progress" variant="info" />}
      >
        <FormGrid columns={3}>
          <TextBox label="Application ID" value="AFF-2026-00124" readOnly />
          <TextBox
            label="College Name"
            value="Global Institute of Technology"
            readOnly
          />
          <TextBox label="Affiliation Type" value="New Affiliation" readOnly />
          <TextBox label="Submitted On" value="05 Aug 2026" readOnly />
          <TextBox label="Current Stage" value="Physical Inspection" readOnly />
          <TextBox
            label="Scheduled Inspection Date"
            value="18 Aug 2026"
            readOnly
          />
        </FormGrid>
        <div className="mt-4">
          <TextArea
            label="Latest Remark"
            value="Inspection team has been assigned. Physical inspection is scheduled for 18 Aug 2026 at the college campus."
            rows={2}
            readOnly
          />
        </div>
      </FormCard>

      <FormCard
        title="Application Progress"
        subtitle="Stage-wise status of your affiliation request."
        icon="history"
      >
        <Stepper
          steps={applicationSteps}
          activeStep={3}
          orientation="vertical"
        />
      </FormCard>
    </FormPage>
  );
}
