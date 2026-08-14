import { useEffect, useState } from 'react';
import type { Control, Path, UseFormSetValue } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import {
  DropDownList,
  TextBox,
  TextArea,
  Checkbox,
  FileUpload,
} from 'shared/components/forms';
import { Grid } from 'shared/components/grid';
import {
  FormCard,
  FormGrid,
  PaymentDialog,
  ReceiptDialog,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { APPROVAL_AUTHORITY_DATA } from '../../settings/approval-authority/data';
import { APPLICATION_FEE_DATA } from '../../settings/application-fee/data';
import '../pages/Create.css';

export const dummyStates = [{ id: 1, name: 'Madhya Pradesh' }];

export const dummyDistricts = [
  { id: 1, name: 'Indore' },
  { id: 2, name: 'Bhopal' },
  { id: 3, name: 'Jabalpur' },
  { id: 4, name: 'Gwalior' },
  { id: 5, name: 'Ujjain' },
];

export const dummyTypes = [
  { id: 1, name: 'Government' },
  { id: 2, name: 'Private' },
  { id: 3, name: 'Aided' },
  { id: 4, name: 'Unaided' },
  { id: 5, name: 'Other' },
];

// Education types come from the Approval Authority master
// (Affiliation Settings → Approval Authority).
const educationTypeOptions = APPROVAL_AUTHORITY_DATA.filter(
  item => item.isActive
).map(item => ({ id: item.approvalAuthorityId, name: item.educationType }));

// Fees payable with the application come from the Application Fees master
// (Affiliation Settings → Application Fees).
const applicableFees = APPLICATION_FEE_DATA.filter(
  fee => fee.isActive && fee.feeType === 'Application Fees'
);

const totalApplicationFee = applicableFees.reduce(
  (acc, fee) => acc + fee.amount,
  0
);

interface CollegeRegistrationStepProps {
  register: (
    key: Path<AffiliationManagementSystem.CollegeApplicationFormData>
  ) => {
    control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>;
  };
  control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
  setValue: UseFormSetValue<AffiliationManagementSystem.CollegeApplicationFormData>;
}

export default function CollegeRegistrationStep({
  register,
  control,
  setValue,
}: CollegeRegistrationStepProps) {
  const [captchaText, setCaptchaText] = useState('7A9x2');

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    transactionId: string;
    date: string;
  } | null>(null);
  const isPaid = paymentInfo !== null;

  const educationTypeId = useWatch({ control, name: 'educationTypeId' });

  const selectedAuthority = APPROVAL_AUTHORITY_DATA.find(
    item => item.approvalAuthorityId === educationTypeId
  );

  const regenerateCaptcha = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    regenerateCaptcha();
  }, []);

  return (
    <>
      <FormCard
        title="College Details"
        subtitle="Basic identity of the college being registered."
        icon="building"
      >
        <FormGrid columns={3}>
          <TextBox
            label="College Name"
            placeholder="Enter college name"
            {...register('collegeName')}
            onChange={val => {
              if (!val) return;
              const formatted = val
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              setValue('collegeName', formatted);
            }}
            maxLength={200}
            required
          />

          <DropDownList
            label="College Type"
            defaultOptionText="Select College Type"
            placeholder="Select College Type"
            data={dummyTypes}
            textField="name"
            valueField="id"
            {...register('collegeTypeId')}
            required
          />

          <TextBox
            label="College Official Email"
            placeholder="Enter college email"
            {...register('collegeEmail')}
            maxLength={255}
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="College Address"
        subtitle="Location details of the college campus."
        icon="map"
      >
        <FormGrid columns={3}>
          <DropDownList
            label="State"
            defaultOptionText="Select State"
            placeholder="Select State"
            data={dummyStates}
            textField="name"
            valueField="id"
            {...register('stateId')}
            required
          />

          <DropDownList
            label="District"
            defaultOptionText="Select District"
            placeholder="Select District"
            data={dummyDistricts}
            textField="name"
            valueField="id"
            {...register('districtId')}
            required
          />

          <TextBox
            label="Block / Tehsil"
            placeholder="Enter Block or Tehsil"
            {...register('blockTehsil')}
            maxLength={100}
            required
          />

          <TextBox
            label="PIN Code"
            placeholder="Enter 6-digit PIN Code"
            {...register('pinCode')}
            maxLength={6}
            required
          />

          <div className="affiliation-grid-full">
            <TextArea
              label="College Address"
              placeholder="Enter college address"
              {...register('collegeAddress')}
              required
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Principal Details"
        subtitle="Contact details of the principal / director."
        icon="user"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Principal Name"
            placeholder="Enter principal director name"
            {...register('principalDirectorName')}
            maxLength={100}
            required
          />

          <TextBox
            label="Principal Mobile Number"
            placeholder="Enter 10-digit mobile number"
            {...register('principalMobileNo')}
            maxLength={10}
            required
          />

          <TextBox
            label="Principal Email ID"
            placeholder="Enter principal email"
            {...register('principalEmail')}
            maxLength={255}
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Approval / Regulatory Authority"
        subtitle="Education type of the college and the approval document of its regulatory authority."
        icon="check-circle"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Education Type"
            defaultOptionText="Select Education Type"
            placeholder="Select Education Type"
            data={educationTypeOptions}
            textField="name"
            valueField="id"
            {...register('educationTypeId')}
            required
          />
          <FileUpload
            label={
              selectedAuthority
                ? selectedAuthority.documentLabel
                : 'Upload Approval Authority NOC Document'
            }
            name="authorityNocFile"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            uploadNote={
              selectedAuthority
                ? `Approval authority: ${selectedAuthority.authorityName}`
                : 'Select an education type to see the required document'
            }
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Application Fees"
        subtitle="Pay the application fees to submit the registration form."
        icon="money-bill"
      >
        <Grid
          data={applicableFees.map(fee => ({ ...fee, isPaid }))}
          columns={[
            { header: 'FEE TYPE', cell: (item: any) => item.feeType },
            {
              header: 'AMOUNT (₹)',
              cell: (item: any) =>
                new Intl.NumberFormat('en-IN').format(item.amount),
            },
            {
              header: 'PAYMENT STATUS',
              cell: (item: any) => (
                <StatusBadge
                  label={item.isPaid ? 'Paid' : 'Pending'}
                  variant={item.isPaid ? 'approved' : 'pending'}
                />
              ),
            },
          ]}
          pagination={false}
        />
        <div className="flex justify-end items-center mt-4 p-4 bg-gray-50 border rounded font-semibold text-lg">
          <span className="mr-4">Total Amount:</span>
          <span className="text-blue-700">
            ₹ {new Intl.NumberFormat('en-IN').format(totalApplicationFee)}
          </span>
        </div>

        {isPaid ? (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="pi pi-check text-green-600 text-lg" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-800">
                  Application Fees Paid Successfully
                </h4>
                <p className="text-xs text-green-700 mt-0.5">
                  Transaction ID:{' '}
                  <span className="font-mono font-semibold">
                    {paymentInfo?.transactionId}
                  </span>{' '}
                  · Paid on {paymentInfo?.date}
                </p>
              </div>
            </div>
            <Button
              label="View Receipt"
              icon="file"
              variant="outlined"
              onClick={() => setIsReceiptOpen(true)}
            />
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Button
              label="Proceed to Payment"
              icon="credit-card"
              variant="primary"
              onClick={() => setIsPaymentOpen(true)}
            />
          </div>
        )}
      </FormCard>

      <FormCard
        title="Verification & Declaration"
        subtitle="Verify the captcha and accept the declaration to complete the registration."
        icon="lock"
      >
        <div className="flex flex-row gap-6 items-start flex-wrap">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Captcha <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 h-[46px]">
              <div
                className="px-6 py-2 h-full bg-[#f0f4f8] text-[#1e293b] rounded-md font-extrabold tracking-[0.5em] text-2xl select-none pointer-events-none border border-gray-300 shadow-inner flex items-center justify-center min-w-[150px] relative overflow-hidden"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
                }}
              >
                <span className="relative z-10 drop-shadow-sm">
                  {captchaText}
                </span>
              </div>
              <Button
                variant="outlined"
                icon="pi pi-refresh"
                onClick={regenerateCaptcha}
                className="h-full px-4 rounded-md flex items-center justify-center border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors"
                tooltip="Refresh Captcha"
              />
            </div>
          </div>

          <div className="w-64">
            <TextBox
              label="Enter Captcha"
              placeholder="Enter the captcha code"
              {...register('captcha')}
              required
            />
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <Controller
            control={control}
            name="declaration"
            render={({ field, fieldState }) => (
              <Checkbox
                id="declaration"
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
                errorMessage={fieldState.error?.message}
                label="Declaration: I hereby declare that all the information provided above is true and correct to the best of my knowledge."
                required
              />
            )}
          />
        </div>
      </FormCard>

      <PaymentDialog
        visible={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalApplicationFee}
        title="Application Fee Payment"
        description="Pay the application fees to submit your college registration."
        onSuccess={transactionId => {
          const paidDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          setPaymentInfo({ transactionId, date: paidDate });
          setValue('applicationFeePaid', true);
          setValue('feeTransactionRef', transactionId);
          setValue('feePaidDate', paidDate);
          setIsPaymentOpen(false);
          setIsReceiptOpen(true);
        }}
      />

      <ReceiptDialog
        visible={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transactionId={paymentInfo?.transactionId || ''}
        amount={totalApplicationFee}
        date={paymentInfo?.date || ''}
        title="Payment Successful"
      />
    </>
  );
}
