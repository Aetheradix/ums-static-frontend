import { Button } from 'primereact/button';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function StudentEligibilityPage() {
  // Mock data for eligible students
  const students = [
    {
      id: '1',
      name: 'Aarav Sharma',
      enrollmentNo: 'EN2024001',
      program: 'B.Tech CSE',
      passingYear: '2024',
      status: 'Eligible',
      dues: 'Clear',
    },
    {
      id: '2',
      name: 'Diya Patel',
      enrollmentNo: 'EN2024002',
      program: 'B.Tech ECE',
      passingYear: '2024',
      status: 'Eligible',
      dues: 'Clear',
    },
    {
      id: '3',
      name: 'Rohan Gupta',
      enrollmentNo: 'EN2024003',
      program: 'MBA',
      passingYear: '2024',
      status: 'Pending Dues',
      dues: '₹ 2,000',
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      enrollmentNo: 'EN2024004',
      program: 'M.Tech CSE',
      passingYear: '2024',
      status: 'Eligible',
      dues: 'Clear',
    },
  ];

  const statusBodyTemplate = (rowData: any) => {
    return (
      <StatusBadge
        variant={rowData.status === 'Eligible' ? 'success' : 'warning'}
        label={rowData.status}
      />
    );
  };

  return (
    <FormPage
      title="Student Eligibility"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Eligibility' },
      ]}
    >
      <div className="space-y-6">
        <FormCard
          title="Master Eligibility List"
          subtitle="Manage the list of students eligible for the upcoming convocation."
        >
          <GridPanel
            data={students}
            searchFields={['name', 'enrollmentNo', 'program']}
            searchBox
            searchPlaceholder="Search students..."
            actionButtons={
              <div className="flex gap-2">
                <Button
                  label="Import Eligibility List"
                  icon="pi pi-upload"
                  outlined
                  severity="info"
                />
                <Button label="Export CSV" icon="pi pi-download" outlined />
              </div>
            }
            columns={[
              {
                field: 'enrollmentNo',
                header: 'Enrollment No.',
                sortable: true,
                width: '15%',
              },
              {
                field: 'name',
                header: 'Student Name',
                sortable: true,
                width: '25%',
              },
              {
                field: 'program',
                header: 'Program',
                sortable: true,
                width: '20%',
              },
              {
                field: 'passingYear',
                header: 'Passing Year',
                sortable: true,
                width: '15%',
              },
              { field: 'dues', header: 'Dues', sortable: true, width: '10%' },
              { header: 'Status', cell: statusBodyTemplate, width: '15%' },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
