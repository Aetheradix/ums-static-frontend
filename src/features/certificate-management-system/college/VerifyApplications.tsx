import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

interface CollegeApplication {
  id: string;
  appNo: string;
  enrollmentNo: string;
  studentName: string;
  type: string;
  appliedDate: string;
  status: string;
  actions?: any;
}

const mockApplications: CollegeApplication[] = [
  {
    id: '1',
    appNo: 'RGPV/2026/BON/000001',
    enrollmentNo: '0802CS221001',
    studentName: 'Ahmed Khan',
    type: 'Bonafide Certificate',
    appliedDate: '25-06-2026',
    status: 'Pending Verification',
  },
  {
    id: '2',
    appNo: 'RGPV/2026/MIG/000002',
    enrollmentNo: '0802IT221045',
    studentName: 'Priya Sharma',
    type: 'Migration Certificate',
    appliedDate: '26-06-2026',
    status: 'Pending Verification',
  },
  {
    id: '3',
    appNo: 'RGPV/2026/DEG/000003',
    enrollmentNo: '0802EC221012',
    studentName: 'Rahul Verma',
    type: 'Degree Certificate',
    appliedDate: '27-06-2026',
    status: 'Returned by University',
  },
  {
    id: '4',
    appNo: 'RGPV/2026/CHA/000004',
    enrollmentNo: '0802ME221099',
    studentName: 'Neha Singh',
    type: 'Character Certificate',
    appliedDate: '28-06-2026',
    status: 'Verified',
  },
  {
    id: '5',
    appNo: 'RGPV/2026/BON/000005',
    enrollmentNo: '0802CE221055',
    studentName: 'Vikram Patel',
    type: 'Bonafide Certificate',
    appliedDate: '29-06-2026',
    status: 'Returned to Student',
  },
];

export default function VerifyApplications() {
  const navigate = useNavigate();

  const handleVerify = (item: CollegeApplication) => {
    navigate(`/certificate-management-system/college/verify/${item.id}`);
  };

  return (
    <FormPage
      title="College Portal - Applications"
      description="View and verify certificate applications submitted by students of your college."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'College Portal', to: '/home/sub-menu/college-portal' },
        { label: 'Applications List' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={mockApplications}
          columns={[
            { field: 'appNo', header: 'App No' },
            { field: 'enrollmentNo', header: 'Enrollment' },
            { field: 'studentName', header: 'Student Name' },
            { field: 'type', header: 'Certificate Type' },
            { field: 'appliedDate', header: 'Applied Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: CollegeApplication) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Verified'
                      ? 'approved'
                      : item.status.includes('Returned')
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: (item: CollegeApplication) => (
                <div className="flex gap-2">
                  <div
                    title={
                      item.status === 'Pending Verification' ||
                      item.status === 'Returned by University'
                        ? 'Start Verification'
                        : 'View Details'
                    }
                  >
                    <Button
                      label={
                        item.status === 'Pending Verification' ||
                        item.status === 'Returned by University'
                          ? 'Verify'
                          : 'View'
                      }
                      icon={
                        item.status === 'Pending Verification' ||
                        item.status === 'Returned by University'
                          ? 'fact_check'
                          : 'visibility'
                      }
                      variant={
                        item.status === 'Pending Verification' ||
                        item.status === 'Returned by University'
                          ? 'primary'
                          : 'outlined'
                      }
                      onClick={() => handleVerify(item)}
                    />
                  </div>
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
