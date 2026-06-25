import { useGetEmployeeByIdQuery } from '../../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface OverviewTabProps {
  data: EmployeeProfileData;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="employee-profile-card-grid">
      <section className="employee-profile-info-card">
        <div className="employee-profile-info-card-title">
          <span>
            <i className="pi pi-user" />
          </span>
          <h4>Personal Information</h4>
        </div>

        <div className="employee-profile-info-grid">
          <InfoItem label="Employee Code" value={data.employeeCode} />
          <InfoItem label="Gender" value={data.gender} />
          <InfoItem label="Mobile Number" value={data.mobileNumber} />
          <InfoItem label="Official Email" value={data.officialEmail} />
        </div>
      </section>

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
        </div>
      </section>

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
