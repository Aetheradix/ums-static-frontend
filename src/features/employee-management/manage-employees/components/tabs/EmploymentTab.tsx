import { useGetEmployeeByIdQuery } from '../../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface EmploymentTabProps {
  data: EmployeeProfileData;
}

export default function EmploymentTab({ data }: EmploymentTabProps) {
  return (
    <div className="employee-profile-card-grid">
      <section className="employee-profile-info-card">
        <div className="employee-profile-info-card-title">
          <span>
            <i className="pi pi-briefcase" />
          </span>
          <h4>Employment Information</h4>
        </div>

        <div className="employee-profile-info-grid">
          <InfoItem label="Employee Type" value={data.employeeType} />
          <InfoItem label="Nature of Employment" value={data.employeeNature} />
          <InfoItem label="Post" value={data.post} />
          {data.subjectSpecialization && (
            <InfoItem
              label="Subject / Specialization"
              value={data.subjectSpecialization}
            />
          )}
          <InfoItem label="Seniority Rank" value={data.seniorityRank} />
          <InfoItem label="Appointed Category" value={data.casteId} />
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
