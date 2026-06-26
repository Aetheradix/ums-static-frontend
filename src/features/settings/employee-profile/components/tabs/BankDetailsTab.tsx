import { FormCard, FormGrid } from 'shared/new-components';

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 text-sm text-gray-500 min-h-[38px] flex items-center">
        {value || '-'}
      </div>
    </div>
  );
}

export default function BankDetailsTab({ data }: any) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Salary Bank Details"
        icon="wallet"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <ReadOnlyField label="Bank Name" value={data.bankName} />
          <ReadOnlyField label="Account Number" value={data.accountNumber} />
          <ReadOnlyField label="IFSC Code" value={data.ifscCode} />
          <ReadOnlyField label="Branch Name" value={data.branchName} />
          <ReadOnlyField
            label="Account Holder Name"
            value={data.accountHolderName}
          />
          <ReadOnlyField label="Account Type" value={data.accountType} />
        </FormGrid>
      </FormCard>
    </div>
  );
}
