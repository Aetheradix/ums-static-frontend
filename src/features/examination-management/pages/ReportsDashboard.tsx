import { FormPage, FormCard } from 'shared/new-components';

export default function ReportsDashboard() {
  return (
    <FormPage
      title="Examination Reports Dashboard"
      description="Consolidated reporting analytics for the Examination Management System."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormCard
          title="Subject-wise Pass Percentage"
          className="h-64 flex items-center justify-center"
        >
          <p className="text-gray-500">Chart Visualization Placeholder</p>
        </FormCard>
        <FormCard
          title="Top Performers"
          className="h-64 flex items-center justify-center"
        >
          <p className="text-gray-500">List/Table Placeholder</p>
        </FormCard>
        <FormCard
          title="Failure Analysis"
          className="h-64 flex items-center justify-center"
        >
          <p className="text-gray-500">Chart Visualization Placeholder</p>
        </FormCard>
        <FormCard
          title="Attendance Statistics"
          className="h-64 flex items-center justify-center"
        >
          <p className="text-gray-500">Bar Chart Placeholder</p>
        </FormCard>
        <FormCard
          title="Grade Distribution"
          className="h-64 flex items-center justify-center"
        >
          <p className="text-gray-500">Pie Chart Placeholder</p>
        </FormCard>
      </div>
    </FormPage>
  );
}
