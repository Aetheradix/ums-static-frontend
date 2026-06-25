import { useGetEmployeeByIdQuery } from '../../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface DocumentsTabProps {
  data: EmployeeProfileData;
}

export default function DocumentsTab({ data }: DocumentsTabProps) {
  return (
    <div className="employee-profile-card-grid">
      <section className="employee-profile-info-card">
        <div className="employee-profile-info-card-title">
          <span>
            <i className="pi pi-file" />
          </span>
          <h4>Documents</h4>
        </div>

        <div className="employee-profile-info-grid">
          <InfoItem label="Employee Code" value={data.employeeCode} />
          <InfoItem label="Identity Proof" value="N/A" />
          <InfoItem label="Qualification Document" value="N/A" />
          <InfoItem label="Experience Document" value="N/A" />
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
