import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, StatCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Student Certificate Dashboard"
      description="Manage and apply for university certificates seamlessly."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value="0"
          icon="description"
          colorScheme="blue"
          subtitle="All time"
        />
        <StatCard
          title="Approved"
          value="0"
          icon="check_circle"
          colorScheme="green"
          subtitle="Ready to download"
        />
        <StatCard
          title="Pending"
          value="0"
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting verification"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormCard title="Apply for Certificate">
          <p className="text-gray-600 mb-6 min-h-[48px]">
            Need a Bonafide, Migration, or Degree Certificate? Start your
            application here.
          </p>
          <Button
            label="Apply Now"
            icon="add"
            variant="primary"
            onClick={() =>
              navigate('/certificate-management-system/student/apply')
            }
          />
        </FormCard>

        <FormCard title="My Applications">
          <p className="text-gray-600 mb-6 min-h-[48px]">
            Track the status of your existing applications and download
            generated certificates.
          </p>
          <Button
            label="View Applications"
            icon="list_alt"
            variant="outlined"
            onClick={() =>
              navigate('/certificate-management-system/student/applications')
            }
          />
        </FormCard>

        <FormCard title="Need Help?">
          <p className="text-gray-600 mb-6 min-h-[48px]">
            Check the eligibility and requirements for each certificate type
            before applying.
          </p>
          <Button label="Read Guidelines" icon="info" variant="outlined" />
        </FormCard>
      </div>

      <div className="mt-8">
        <FormCard title="Recent Status">
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
            <i className="material-symbols-outlined text-4xl mb-2 text-gray-400">
              inbox
            </i>
            <p className="m-0">
              No recent activity found. Apply for a new certificate to see
              updates here.
            </p>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
