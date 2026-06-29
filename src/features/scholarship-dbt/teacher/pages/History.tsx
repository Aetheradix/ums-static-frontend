import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const HISTORY = studentApplications.filter(a => a.teacherRemarks);

export default function TeacherHistory() {
  return (
    <FormPage
      title="Verification History"
      description="All previously verified scholarship applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Verification History' },
      ]}
    >
      <FormCard title={`Verified Applications (${HISTORY.length})`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>App No.</th>
                <th>Student</th>
                <th>Course</th>
                <th>Scheme</th>
                <th>Amount</th>
                <th>Verified On</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((app, i) => (
                <tr key={app.id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{app.appNo}</td>
                  <td>{app.studentName}</td>
                  <td>{app.course}</td>
                  <td style={{ maxWidth: 180, wordBreak: 'break-word' }}>
                    {app.schemeName.slice(0, 35)}…
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{app.amount.toLocaleString()}
                  </td>
                  <td>18 Sep 2025</td>
                  <td>
                    <StatusBadge
                      label={app.status}
                      variant={
                        app.status === 'Rejected'
                          ? 'rejected'
                          : app.status === 'Credited'
                            ? 'approved'
                            : 'pending'
                      }
                    />
                  </td>
                  <td
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      maxWidth: 180,
                      wordBreak: 'break-word',
                    }}
                  >
                    {app.teacherRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
