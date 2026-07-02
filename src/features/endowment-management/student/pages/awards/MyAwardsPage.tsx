import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import { useApplications, useDisbursements } from '../../../queries';

export default function MyAwardsPage() {
  const { data: applications } = useApplications();
  const { data: disbursements } = useDisbursements();

  // Find selected applications
  const selectedApps =
    applications?.filter(app => app.status === 'Selected') || [];

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Scheme Name', field: 'schemeName' },
    { header: 'Date Awarded', field: 'date' },
    {
      header: 'Disbursement Status',
      field: 'disbursed',
      cell: (row: any) => {
        // Mock check if this app has a disbursement record
        const hasDisbursement = disbursements?.find(
          d => d.schemeName === row.schemeName
        );
        return hasDisbursement ? (
          <StatusBadge label="Processed" variant="approved" />
        ) : (
          <StatusBadge label="Pending Payment" variant="pending" />
        );
      },
    },
    {
      header: 'Certificate',
      field: 'cert',
      cell: () => (
        <Button
          label="Download"
          size="small"
          variant="outlined"
          icon="download"
          onClick={() =>
            ToastService.success('Downloading award certificate...')
          }
        />
      ),
    },
  ];

  return (
    <FormPage
      title="My Awards"
      description="View your selected awards and download certificates."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Student Portal', to: '/endowment-management/student' },
        { label: 'My Awards' },
      ]}
    >
      {selectedApps.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
            workspace_premium
          </span>
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            No Awards Yet
          </h3>
          <p className="text-gray-500">
            You haven't been selected for any endowment awards yet.
          </p>
        </div>
      ) : (
        <GridPanel
          title="Awarded Schemes"
          columns={columns}
          data={selectedApps}
        />
      )}
    </FormPage>
  );
}
