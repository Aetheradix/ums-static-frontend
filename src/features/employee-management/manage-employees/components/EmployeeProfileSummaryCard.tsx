import { useGetEmployeeByIdQuery } from '../queries';

type EmployeeProfileData = NonNullable<
  ReturnType<typeof useGetEmployeeByIdQuery>['data']
>;

interface EmployeeProfileSummaryCardProps {
  data: EmployeeProfileData;
  employeeName: string;
  employeeInitials: string;
}

export default function EmployeeProfileSummaryCard({
  data,
  employeeName,
  employeeInitials,
}: EmployeeProfileSummaryCardProps) {
  return (
    <section className="employee-profile-summary-card">
      <div className="employee-profile-main-info">
        <div className="employee-profile-avatar">
          <span>{employeeInitials}</span>
          <span
            className={`employee-profile-avatar-status ${
              data.isActive ? 'active' : 'inactive'
            }`}
          />
        </div>

        <div className="employee-profile-identity">
          <h3>{employeeName}</h3>

          <span className="employee-profile-code">{data.employeeCode}</span>

          <div className="employee-profile-chips">
            <span className="employee-profile-chip">
              <i className="pi pi-user" />
              {data.gender || 'N/A'}
            </span>

            <span className="employee-profile-chip">
              <i className="pi pi-briefcase" />
              {data.employeeType || 'N/A'}
            </span>

            <span className="employee-profile-chip">
              <i className="pi pi-shield" />
              {data.employeeNature || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="employee-profile-summary-meta">
        <div className="employee-profile-contact-box">
          <div className="employee-profile-contact-item">
            <span className="employee-profile-status-label">Phone No</span>

            <strong className="employee-profile-contact-value">
              <i className="pi pi-phone" />
              {data.mobileNumber || 'N/A'}
            </strong>
          </div>

          <div className="employee-profile-contact-item">
            <span className="employee-profile-status-label">Email ID</span>

            <strong className="employee-profile-contact-value">
              <i className="pi pi-envelope" />
              {data.officialEmail || 'N/A'}
            </strong>
          </div>
        </div>

        <div className="employee-profile-status-box">
          <div>
            <span className="employee-profile-status-label">
              Employee Status
            </span>

            <span
              className={`employee-profile-status ${
                data.isActive ? 'active' : 'inactive'
              }`}
            >
              <span />
              {data.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div>
            <span className="employee-profile-status-label">
              Date of Joining
            </span>
            <strong>N/A</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
