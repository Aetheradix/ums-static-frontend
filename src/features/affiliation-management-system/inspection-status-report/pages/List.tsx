import { FormCard, FormPage } from 'shared/new-components';

export default function List() {
  return (
    <FormPage
      title="Inspection Status Report"
      description="View the history and observations of college inspections."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Reports' },
        { label: 'Inspection Status' },
      ]}
    >
      <FormCard title="Inspection History">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                <th className="p-4 font-semibold">Inspection Type</th>
                <th className="p-4 font-semibold">Inspector Name</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Overall Status</th>
                <th className="p-4 font-semibold">Key Observations</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium">
                  Physical Infrastructure Visit
                </td>
                <td className="p-4 text-sm text-gray-700">Dr. A. Sharma</td>
                <td className="p-4 text-sm text-gray-700">05 Oct 2025</td>
                <td className="p-4 text-sm font-semibold text-green-600">
                  Satisfactory
                </td>
                <td className="p-4 text-sm text-gray-500">
                  Infrastructure is up to the mark. Labs are well-equipped.
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium">Academic Audit</td>
                <td className="p-4 text-sm text-gray-700">Prof. R. Gupta</td>
                <td className="p-4 text-sm text-gray-700">10 Nov 2025</td>
                <td className="p-4 text-sm font-semibold text-blue-600">
                  Excellent
                </td>
                <td className="p-4 text-sm text-gray-500">
                  Faculty strength and qualifications exceed norms.
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium">Surprise Visit</td>
                <td className="p-4 text-sm text-gray-700">Dr. M. Singh</td>
                <td className="p-4 text-sm text-gray-700">22 Dec 2025</td>
                <td className="p-4 text-sm font-semibold text-orange-500">
                  Requires Improvement
                </td>
                <td className="p-4 text-sm text-gray-500">
                  Library books need updating to the latest syllabus.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
