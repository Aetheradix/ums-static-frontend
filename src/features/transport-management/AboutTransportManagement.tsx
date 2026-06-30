import { FormPage, FormCard } from 'shared/new-components';

export default function AboutTransportManagement() {
  return (
    <FormPage
      title="About Transport Management System"
      description="System overview, modules, and version details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'About' },
      ]}
    >
      <div className="grid grid-cols-1 gap-6">
        <FormCard title="System Overview">
          <div className="p-4 space-y-4 text-gray-700">
            <p>
              The <strong>Transport Management System (TMS)</strong> is designed
              to efficiently manage the end-to-end transportation needs of the
              university and its affiliated colleges. It bridges the gap between
              university administrators, college transport incharges,
              transporters, and the students.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Core Modules
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Master Setups:</strong> Configuration of fuel types,
                vehicle types, insurance companies, routes, and bus stops.
              </li>
              <li>
                <strong>Registration & Onboarding:</strong> Management of
                Transporters, Vehicles, Drivers, Attenders, and College
                Transport Incharges.
              </li>
              <li>
                <strong>Mapping & Allocation:</strong> Linking transporters and
                vehicles to specific colleges, and assigning drivers to vehicles
                on specific routes.
              </li>
              <li>
                <strong>Student Operations:</strong> Student route mapping,
                daily pickup/drop tracking, leave management, and pickup
                cancellations.
              </li>
              <li>
                <strong>Maintenance & Tracking:</strong> Vehicle maintenance
                lifecycle (Requests, Approvals, Execution), Insurance tracking,
                and Live GPS Tracking of buses.
              </li>
              <li>
                <strong>Finance & Reporting:</strong> Transporter bill uploads,
                payment tracking, gate pass reports, and maintenance expenditure
                logs.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Version Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p>
                <strong>Version:</strong> 2.1.0
              </p>
              <p>
                <strong>Last Updated:</strong> June 2026
              </p>
              <p>
                <strong>Developed By:</strong> University IT Cell
              </p>
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
