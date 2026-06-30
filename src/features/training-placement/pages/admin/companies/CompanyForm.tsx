import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { tpUrls } from '../../../urls';

export default function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) || location.pathname.includes('/profile/edit');
  const isCompanyPortal = location.pathname.includes('/company/');

  const [formData, setFormData] = useState({
    companyName: isEdit ? 'Infosys Technologies Ltd' : '',
    companyDetails: isEdit ? 'Global IT services company' : '',
    headOffice: isEdit ? 'Electronic City, Bangalore' : '',
    website: isEdit ? 'https://infosys.com' : '',
    hrName: isEdit ? 'Priya Sharma' : '',
    hrContact: isEdit ? '+91-9876543210' : '',
    hrEmail: isEdit ? 'priya.sharma@infosys.com' : '',
  });

  const handleSave = () => {
    if (isCompanyPortal) {
      navigate(tpUrls.company.profile);
    } else {
      navigate(tpUrls.admin.companies);
    }
  };

  const handleCancel = () => {
    if (isCompanyPortal) {
      navigate(tpUrls.company.profile);
    } else {
      navigate(tpUrls.admin.companies);
    }
  };

  const getBreadcrumbs = () => {
    const list: Array<{ label: string; to?: string }> = [
      { label: 'Training & Placement', to: tpUrls.root },
      {
        label: isCompanyPortal ? 'Company Portal' : 'Admin Portal',
        to: isCompanyPortal ? tpUrls.company.portal : tpUrls.admin.portal,
      },
    ];

    if (!isCompanyPortal) {
      list.push({ label: 'Companies', to: tpUrls.admin.companies });
    } else {
      list.push({ label: 'Profile', to: tpUrls.company.profile });
    }

    list.push({ label: isEdit ? 'Edit' : 'Add' });
    return list;
  };

  return (
    <FormPage
      title={isEdit ? 'Edit Company Profile' : 'Add Company'}
      description="Create or edit a recruiting company profile."
      breadcrumbs={getBreadcrumbs()}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Profile
          </button>
        </div>
      }
    >
      <FormCard title="Basic Information">
        <FormGrid>
          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={e =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Infosys Technologies Ltd"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={e =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://company.com"
            />
          </div>

          <div className="col-span-12">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Head Office Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.headOffice}
              onChange={e =>
                setFormData({ ...formData, headOffice: e.target.value })
              }
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-12">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Details / Description{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.companyDetails}
              onChange={e =>
                setFormData({ ...formData, companyDetails: e.target.value })
              }
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </FormGrid>
      </FormCard>

      <div className="mt-6">
        <FormCard title="HR / Primary Contact Information">
          <FormGrid>
            <div className="col-span-12 md:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hrName}
                onChange={e =>
                  setFormData({ ...formData, hrName: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.hrEmail}
                onChange={e =>
                  setFormData({ ...formData, hrEmail: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hrContact}
                onChange={e =>
                  setFormData({ ...formData, hrContact: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </FormGrid>
        </FormCard>
      </div>
    </FormPage>
  );
}
