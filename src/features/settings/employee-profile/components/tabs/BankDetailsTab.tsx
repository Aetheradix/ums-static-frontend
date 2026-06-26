import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

export default function BankDetailsTab({ data }: any) {
  if (!data) return null;

  const isBankDetailsFilled = !!(data.bankName && data.accountNumber);

  return (
    <div className="flex flex-col gap-6">
      {!isBankDetailsFilled && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <i className="pi pi-exclamation-triangle text-lg text-amber-500" />
          <div>
            <strong>Onboarding Action Needed:</strong> Complete onboarding is
            done only when bank details are filled.
          </div>
        </div>
      )}
      <FormCard
        title="Salary Bank Details"
        icon="wallet"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <PreviewField label="Bank Name" value={data.bankName} />
          <PreviewField label="Account Number" value={data.accountNumber} />
          <PreviewField label="IFSC Code" value={data.ifscCode} />
          <PreviewField label="Branch Name" value={data.branchName} />
          <PreviewField
            label="Account Holder Name"
            value={data.accountHolderName}
          />
          <PreviewField label="Account Type" value={data.accountType} />
        </FormGrid>
      </FormCard>
    </div>
  );
}
