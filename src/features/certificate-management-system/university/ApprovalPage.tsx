import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  FormGrid,
  StatusBadge,
} from 'shared/new-components';
import { TextBox } from 'shared/components/forms';

export default function ApprovalPage() {
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState('');

  const handleAction = (action: string) => {
    alert(`Application ${action} Successfully by University!`);
    if (action === 'Approved') {
      navigate('/certificate-management-system/university/generate');
    }
  };

  return (
    <FormPage
      title="University Approval Portal"
      description="Review and give final approval for certificate generation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'University Portal', to: '/home/sub-menu/university-portal' },
        { label: 'Approve Certificates' },
      ]}
    >
      <FormCard title="Application Overview">
        <FormGrid columns={3}>
          <TextBox
            label="Application Number"
            value="RGPV/BON/2026/0099"
            disabled
          />
          <TextBox label="Student Name" value="Ahmed Khan" disabled />
          <TextBox
            label="Certificate Type"
            value="Bonafide Certificate"
            disabled
          />
          <TextBox label="College Name" value="Main Campus" disabled />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Verification Status
            </label>
            <div className="mt-2">
              <StatusBadge label="Verified by College" variant="approved" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <div className="mt-2">
              <StatusBadge label="Paid (TXN123456)" variant="approved" />
            </div>
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Review Actions">
        <FormGrid columns={1}>
          <TextBox
            label="Remarks (Mandatory for Rejection/Return)"
            value={remarks}
            onChange={v => setRemarks(v)}
          />
        </FormGrid>

        <div className="flex gap-4 mt-6 border-t pt-4 border-gray-200">
          <Button
            label="Return to College"
            variant="outlined"
            onClick={() => handleAction('Returned')}
          />
          <Button
            label="Reject Application"
            variant="danger"
            onClick={() => handleAction('Rejected')}
          />
          <div className="flex-1" />
          <Button
            label="Approve for Generation"
            variant="primary"
            icon="verified"
            onClick={() => handleAction('Approved')}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
