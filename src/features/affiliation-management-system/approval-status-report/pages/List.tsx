import { FormCard, FormPage } from 'shared/new-components';

export default function List() {
  return (
    <FormPage
      title="Approval Status Report"
      description="View the history and current status of affiliation approvals."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Reports' },
        { label: 'Approval Status' },
      ]}
    >
      <FormCard title="Approval Status History">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                <th className="p-4 font-semibold">Approval Type</th>
                <th className="p-4 font-semibold">Authority</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium">Initial Affiliation</td>
                <td className="p-4 text-sm text-gray-700">Vice Chancellor</td>
                <td className="p-4 text-sm font-semibold text-green-600">
                  Approved
                </td>
                <td className="p-4 text-sm text-gray-700">12 Oct 2025</td>
                <td className="p-4 text-sm text-gray-500">
                  All conditions met satisfactorily.
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium">Programme Extension</td>
                <td className="p-4 text-sm text-gray-700">Dean of Colleges</td>
                <td className="p-4 text-sm font-semibold text-orange-500">
                  Pending
                </td>
                <td className="p-4 text-sm text-gray-700">15 Jan 2026</td>
                <td className="p-4 text-sm text-gray-500">
                  Awaiting final committee review.
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium">Increase Intake</td>
                <td className="p-4 text-sm text-gray-700">Registrar</td>
                <td className="p-4 text-sm font-semibold text-red-600">
                  Rejected
                </td>
                <td className="p-4 text-sm text-gray-700">02 Feb 2026</td>
                <td className="p-4 text-sm text-gray-500">
                  Insufficient infrastructure for expansion.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
