import { useGetEmployeeByIdQuery } from '../../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface OrganizationTabProps {
  data: EmployeeProfileData;
}

export default function OrganizationTab({ data }: OrganizationTabProps) {
  return (
    <div className="employee-profile-card-grid">
      <section className="employee-profile-info-card">
        <div className="employee-profile-info-card-title">
          <span>
            <i className="pi pi-building" />
          </span>
          <h4>Organizational Information</h4>
        </div>

        <div className="employee-profile-info-grid">
          <InfoItem label="Organization Unit" value={data.organizationUnit} />
          <InfoItem label="Department" value="N/A" />
          <InfoItem label="Reporting To" value="N/A" />
          <InfoItem label="Location" value="N/A" />
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="employee-profile-info-item">
      <span>{label}</span>
      <strong>{value || 'N/A'}</strong>
    </div>
  );
}
