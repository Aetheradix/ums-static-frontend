import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useNavigate } from 'react-router-dom';

export default function ApplicationScrutinyList() {
  const { studentApplications } = useHostel();
  const navigate = useNavigate();

  // In a real app we'd have filters, pagination etc.
  const applications = studentApplications.filter(
    a => a.status === 'SUBMITTED' || a.status === 'UNDER_SCRUTINY'
  );

  return (
    <FormPage
      title="Application Scrutiny List"
      description="View and scrutinize pending student hostel applications"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Scrutiny',
          to: '/hostel-management/student-application/scrutiny-list',
        },
      ]}
    >
      <FormCard title="Pending Applications" icon="fact_check">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">App ID</th>
                <th className="p-2">Enrollment No</th>
                <th className="p-2">Student Name</th>
                <th className="p-2">Hostel Preference</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    No pending applications for scrutiny.
                  </td>
                </tr>
              )}
              {applications.map(app => (
                <tr
                  key={app.id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2">{app.applicationDate}</td>
                  <td className="p-2">{app.id}</td>
                  <td className="p-2">{app.enrollmentNo}</td>
                  <td className="p-2">{app.studentName}</td>
                  <td className="p-2">{app.hostelName}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${app.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <Button
                      label="Review"
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/hostel-management/student-application/scrutiny-details/${app.id}`
                        )
                      }
                    />
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
