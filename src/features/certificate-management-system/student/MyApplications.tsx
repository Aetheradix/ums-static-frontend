import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

interface Application {
  id: string;
  appNo: string;
  type: string;
  date: string;
  status: string;
  paymentStatus: string;
  actions?: any;
}

const mockApplications: Application[] = [
  {
    id: '1',
    appNo: 'RGPV/2026/BON/000001',
    type: 'Bonafide Certificate',
    date: '25-06-2026',
    status: 'Approved',
    paymentStatus: 'Paid',
  },
  {
    id: '2',
    appNo: 'RGPV/2026/MIG/000002',
    type: 'Migration Certificate',
    date: '26-06-2026',
    status: 'Pending Verification',
    paymentStatus: 'Unpaid',
  },
  {
    id: '3',
    appNo: 'RGPV/2026/DEG/000003',
    type: 'Degree Certificate',
    date: '27-06-2026',
    status: 'Returned for Correction',
    paymentStatus: 'Unpaid',
  },
  {
    id: '4',
    appNo: 'RGPV/2026/CHA/000004',
    type: 'Character Certificate',
    date: '28-06-2026',
    status: 'Rejected',
    paymentStatus: 'Refunded',
  },
];

export default function MyApplications() {
  const navigate = useNavigate();

  const handleApplyNew = () => {
    navigate('/certificate-management-system/student/apply');
  };

  const handleView = (item: Application) => {
    navigate(`/certificate-management-system/student/applications/${item.id}`);
  };

  const handleDownload = (item: Application) => {
    if (item.status === 'Approved') {
      alert(`Downloading Certificate for ${item.appNo}...`);
    } else {
      alert(`Certificate for ${item.appNo} is not yet ready for download.`);
    }
  };

  return (
    <FormPage
      title="My Applications"
      description="Track the status of your existing certificate applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        { label: 'My Applications' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={mockApplications}
          columns={[
            { field: 'appNo', header: 'Application No' },
            { field: 'type', header: 'Certificate Type' },
            { field: 'date', header: 'Applied Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Application) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Approved' ? 'approved' : 'pending'}
                />
              ),
            },
            {
              field: 'paymentStatus',
              header: 'Payment Status',
              cell: (item: Application) => (
                <StatusBadge
                  label={item.paymentStatus}
                  variant={
                    item.paymentStatus === 'Paid' ? 'approved' : 'rejected'
                  }
                />
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: (item: Application) => (
                <div className="flex gap-2">
                  <div title="View Details">
                    <Button
                      label="View"
                      icon="visibility"
                      variant="outlined"
                      onClick={() => handleView(item)}
                    />
                  </div>
                  <div title="Download Certificate">
                    <Button
                      icon="download"
                      variant="text"
                      disabled={item.status !== 'Approved'}
                      onClick={() => handleDownload(item)}
                    />
                  </div>
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Apply New"
              icon="add"
              variant="primary"
              onClick={handleApplyNew}
            />
          }
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
