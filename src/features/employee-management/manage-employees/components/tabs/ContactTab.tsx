import { useGetEmployeeByIdQuery } from '../../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface ContactTabProps {
  data: EmployeeProfileData;
}

export default function ContactTab({ data }: ContactTabProps) {
  return (
    <div className="employee-profile-card-grid">
      <section className="employee-profile-info-card">
        <div className="employee-profile-info-card-title">
          <span>
            <i className="pi pi-phone" />
          </span>
          <h4>Contact Information</h4>
        </div>

        <div className="employee-profile-info-grid">
          <InfoItem label="Official Email" value={data.officialEmail} />
          <InfoItem label="Mobile Number" value={data.mobileNumber} />
          <InfoItem label="Alternate Email" value="N/A" />
          <InfoItem label="Emergency Contact" value="N/A" />
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
