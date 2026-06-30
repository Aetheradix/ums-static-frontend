import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function OUMappingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    administeringOuId: isEdit ? 'ou-1' : '',
    administeredOuIds: isEdit ? ['ou-2', 'ou-3'] : [],
    remarks: isEdit ? 'Mapping for engineering departments' : '',
  });

  const administeringOuOptions = [
    { label: 'Training & Placement Cell', value: 'ou-1' },
    { label: 'Management T&P Cell', value: 'ou-4' },
  ];

  const administeredOuOptions = [
    { label: 'Computer Science Engineering', value: 'ou-2' },
    { label: 'Electronics Engineering', value: 'ou-3' },
    { label: 'Mechanical Engineering', value: 'ou-5' },
    { label: 'MBA', value: 'ou-6' },
  ];

  const handleSave = () => {
    // Save logic would go here
    navigate(tpUrls.admin.settings.ouMapping);
  };

  return (
    <FormPage
      title={isEdit ? 'Edit OU Mapping' : 'Add OU Mapping'}
      description="Map a Training & Placement Cell to the departments it administers."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Settings', to: tpUrls.admin.settings.hub },
        { label: 'OU Mappings', to: tpUrls.admin.settings.ouMapping },
        { label: isEdit ? 'Edit' : 'Add' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={() => navigate(tpUrls.admin.settings.ouMapping)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Mapping
          </button>
        </div>
      }
    >
      <FormCard title="Mapping Details">
        <FormGrid>
          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Administering OU <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.administeringOuId}
              onChange={e =>
                setFormData({ ...formData, administeringOuId: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Administering OU</option>
              {administeringOuOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Administered OU(s) <span className="text-red-500">*</span>
            </label>
            <select
              multiple
              value={formData.administeredOuIds}
              onChange={e => {
                const values = Array.from(
                  e.target.selectedOptions,
                  option => option.value
                );
                setFormData({ ...formData, administeredOuIds: values });
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              size={4}
            >
              {administeredOuOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>

          <div className="col-span-12">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={e =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Any additional notes..."
            />
          </div>
        </FormGrid>
      </FormCard>
    </FormPage>
  );
}
