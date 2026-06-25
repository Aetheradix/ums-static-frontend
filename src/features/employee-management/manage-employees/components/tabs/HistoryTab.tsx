import { useGetEmployeeByIdQuery } from '../../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface HistoryTabProps {
  data: EmployeeProfileData;
}

export default function HistoryTab({ data }: HistoryTabProps) {
  return (
    <div className="employee-profile-card-grid">
      <section className="employee-profile-info-card">
        <div className="employee-profile-info-card-title">
          <span>
            <i className="pi pi-history" />
          </span>
          <h4>Employee History</h4>
        </div>

        <div className="employee-profile-info-grid">
          <InfoItem label="Employee Code" value={data.employeeCode} />
          <InfoItem label="Last Updated" value="N/A" />
          <InfoItem label="Status History" value="N/A" />
          <InfoItem label="Action History" value="N/A" />
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
