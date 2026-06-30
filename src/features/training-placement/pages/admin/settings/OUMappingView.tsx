import { useNavigate, useParams } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function OUMappingView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the view
  const mapping = {
    id,
    administeringOu: 'Training & Placement Cell',
    administeredOus: [
      'Computer Science Engineering',
      'Electronics Engineering',
    ],
    remarks: 'Mapping for engineering departments',
    coordinators: [
      'John Doe (john@example.com)',
      'Alice Smith (alice@example.com)',
    ],
  };

  return (
    <FormPage
      title="View OU Mapping"
      description="Details of the Training & Placement Cell to academic department mapping."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Settings', to: tpUrls.admin.settings.hub },
        { label: 'OU Mappings', to: tpUrls.admin.settings.ouMapping },
        { label: 'View' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={() => navigate(tpUrls.admin.settings.ouMapping)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(tpUrls.admin.settings.ouMappingEdit(id!))}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Mapping
          </button>
        </div>
      }
    >
      <FormCard title="Mapping Details">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Administering OU
            </h4>
            <p className="mt-1 text-base text-gray-900">
              {mapping.administeringOu}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Remarks</h4>
            <p className="mt-1 text-base text-gray-900">
              {mapping.remarks || 'N/A'}
            </p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">
              Administered OU(s)
            </h4>
            <ul className="mt-2 list-disc pl-5 text-gray-900">
              {mapping.administeredOus.map((ou, idx) => (
                <li key={idx} className="mb-1">
                  {ou}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FormCard>

      <div className="mt-6">
        <FormCard title="Assigned Coordinators">
          <ul className="divide-y divide-gray-200">
            {mapping.coordinators.map((coord, idx) => (
              <li
                key={idx}
                className="py-3 text-sm text-gray-900 flex items-center gap-3"
              >
                <i className="pi pi-user text-gray-400" />
                {coord}
              </li>
            ))}
          </ul>
        </FormCard>
      </div>
    </FormPage>
  );
}
