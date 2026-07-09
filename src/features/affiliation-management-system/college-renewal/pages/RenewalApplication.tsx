import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  Checkbox,
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';

const academicYearOptions = [
  { text: '2024-2025', value: '2024-2025' },
  { text: '2025-2026', value: '2025-2026' },
  { text: '2026-2027', value: '2026-2027' },
];

export default function RenewalApplication() {
  const navigate = useNavigate();

  const [isPaid, setIsPaid] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      applicationNo: 'APP2025-0012',
      collegeName: 'Global Institute of Technology',
      collegeCode: 'COL001',
      lastRenewalDate: '2025-08-15',
      renewalExpiryDate: '2026-08-15',
      academicYear: '2025-2026',
      affiliationOrderNo: '',
      infrastructureChanges: '',
      mandatoryDisclosures: null as File | null,
      declaration: false,
    },
  });

  const onSubmit = async (data: any) => {
    if (!isPaid) {
      ToastService.error(
        'Please complete the renewal fee payment before submitting.'
      );
      return;
    }

    if (!data.declaration) {
      ToastService.error('Please accept the declaration to proceed.');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      ToastService.success('Renewal application submitted successfully.');
      navigate('/affiliation-management-system/college-login');
    } catch {
      ToastService.error('Failed to submit renewal application.');
    }
  };

  const handlePayment = () => {
    // Mock payment gateway delay
    setTimeout(() => {
      setPaymentId('TXN' + Math.floor(Math.random() * 1000000000));
      setIsPaid(true);
      ToastService.success('Payment completed successfully.');
    }, 800);
  };

  return (
    <FormPage
      title="Apply for Affiliation Renewal"
      description="Submit your annual affiliation renewal application to the University."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Affiliation Management',
          to: '/affiliation-management-system',
        },
        {
          label: 'College Login',
          to: '/affiliation-management-system/college-login',
        },
        { label: 'Renewal Application' },
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard title="College Details">
          <FormGrid columns={3}>
            <TextBox
              label="Application Number"
              name="applicationNo"
              control={control}
              disabled
            />
            <TextBox
              label="College Name"
              name="collegeName"
              control={control}
              disabled
            />
            <TextBox
              label="College Code"
              name="collegeCode"
              control={control}
              disabled
            />
            <TextBox
              label="Last Renewal Date"
              name="lastRenewalDate"
              control={control}
              disabled
            />
            <TextBox
              label="Renewal Expiry Date"
              name="renewalExpiryDate"
              control={control}
              disabled
            />
          </FormGrid>
        </FormCard>

        <FormCard title="Renewal Details" className="mt-6">
          <FormGrid columns={2}>
            <DropDownList
              label="Academic Year for Renewal"
              name="academicYear"
              control={control}
              data={academicYearOptions}
              textField="text"
              valueField="value"
              required
            />
            <TextBox
              label="Existing Affiliation Order No."
              name="affiliationOrderNo"
              control={control}
              placeholder="e.g., AFF/2024/001"
              required
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <TextArea
                label="Changes in Infrastructure / Intake since last affiliation?"
                name="infrastructureChanges"
                control={control}
                placeholder="Describe any major changes, if applicable."
              />
            </div>

            <FileUpload
              label="Upload Mandatory Disclosures (PDF)"
              name="mandatoryDisclosures"
              control={control}
              onChange={() => {}}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Renewal Fee (₹ 50,000) <span className="text-red-500">*</span>
              </label>
              <div className="pt-1">
                {isPaid ? (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center gap-2">
                    <i className="pi pi-check-circle" />
                    <span className="font-medium">
                      Payment Successful (TXN: {paymentId})
                    </span>
                  </div>
                ) : (
                  <Button
                    label="Pay Now (₹ 50,000)"
                    variant="primary"
                    icon="wallet"
                    onClick={handlePayment}
                  />
                )}
              </div>
            </div>
          </FormGrid>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <Checkbox
              label="I hereby declare that all the information provided in this renewal application is true, complete, and correct to the best of my knowledge and belief."
              name="declaration"
              control={control}
              required
            />
          </div>

          <p className="mt-4 text-xs font-bold text-red-600">
            Note: All Asterisk (*) Marked Fields Are Mandatory
          </p>

          <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-6">
            <FormActions
              align="left"
              isLoading={isSubmitting}
              onSave={handleSubmit(onSubmit)}
              onReset={() => reset()}
              saveLabel="Submit Application"
            />
          </div>
        </FormCard>
      </form>
    </FormPage>
  );
}
