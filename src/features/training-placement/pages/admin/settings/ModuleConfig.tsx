import { useState } from 'react';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function ModuleConfig() {
  const [formData, setFormData] = useState({
    registrationUrl: 'https://ums.example.com/register/company',
    enablePublicCompanyRegistration: true,
    defaultPlacementFeeCompany: 25000,
    defaultPlacementFeeStudent: 500,
    notifyOnNewRegistration: true,
  });

  const handleSave = () => {
    // Save logic
  };

  return (
    <FormPage
      title="Module Configuration"
      description="Global settings and defaults for the Training & Placement module."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Settings', to: tpUrls.admin.settings.hub },
        { label: 'Module Configuration' },
      ]}
      headerAction={
        <button
          onClick={handleSave}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Configuration
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormCard title="General Settings">
          <FormGrid>
            <div className="col-span-12">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Public Company Registration URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.registrationUrl}
                  readOnly
                  className="w-full rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus:outline-none"
                />
                <button
                  className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  onClick={() =>
                    navigator.clipboard.writeText(formData.registrationUrl)
                  }
                >
                  <i className="pi pi-copy" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Share this link with companies for self-registration.
              </p>
            </div>

            <div className="col-span-12 mt-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.enablePublicCompanyRegistration}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      enablePublicCompanyRegistration: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Public Company Registration
                </span>
              </label>
            </div>

            <div className="col-span-12">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.notifyOnNewRegistration}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      notifyOnNewRegistration: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notify TPOs via email on new company registration
                </span>
              </label>
            </div>
          </FormGrid>
        </FormCard>

        <FormCard title="Default Fees">
          <FormGrid>
            <div className="col-span-12">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Default Placement Fee (Company)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.defaultPlacementFeeCompany}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      defaultPlacementFeeCompany: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Applies to new Placement Seasons by default.
              </p>
            </div>

            <div className="col-span-12">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Default Placement Fee (Student)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.defaultPlacementFeeStudent}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      defaultPlacementFeeStudent: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </FormGrid>
        </FormCard>
      </div>
    </FormPage>
  );
}
