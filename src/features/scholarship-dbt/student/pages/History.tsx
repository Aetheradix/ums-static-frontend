import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function StudentHistory() {
  const allApps = studentApplications;

  return (
    <FormPage
      title="Scholarship History"
      description="All your previous and current scholarship applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Scholarship History' },
      ]}
    >
      <FormCard title={`All Applications (${allApps.length})`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>App No.</th>
                <th>Academic Year</th>
                <th>Scheme Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allApps.map((app, idx) => (
                <tr key={app.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 700 }}>{app.appNo}</td>
                  <td>{app.academicYear}</td>
                  <td style={{ maxWidth: 200, wordBreak: 'break-word' }}>
                    {app.schemeName}
                  </td>
                  <td>
                    <span
                      className="dbt-status-pill"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      {app.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{app.amount.toLocaleString()}
                  </td>
                  <td>{app.submittedDate}</td>
                  <td>
                    <StatusBadge
                      label={app.status}
                      variant={
                        app.status === 'Credited'
                          ? 'approved'
                          : app.status === 'Rejected'
                            ? 'rejected'
                            : app.status === 'Draft'
                              ? 'neutral'
                              : 'pending'
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      style={{
                        padding: '0.25rem 0.625rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        color: '#374151',
                      }}
                    >
                      View
                    </button>
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
