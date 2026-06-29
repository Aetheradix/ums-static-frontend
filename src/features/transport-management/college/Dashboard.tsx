import { FormPage } from 'shared/new-components';

export default function CollegeDashboard() {
  return (
    <FormPage
      title="College Login Dashboard"
      description="Welcome to the College Transport Management system. Please select an option from the sidebar to continue."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'College Login',
          to: '/transport-management/college-login/dashboard',
        },
      ]}
    >
      <div className="flex items-center justify-center h-64 text-gray-500">
        Please select a menu option from the sidebar to get started.
      </div>
    </FormPage>
  );
}
