import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { tpUrls } from '../../urls';

export default function OpportunityForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const isAdmin = location.pathname.includes('/admin/');
  const isCompany = location.pathname.includes('/company/');

  const [formData, setFormData] = useState({
    title: isEdit ? 'Software Development Engineer' : '',
    opportunityType: isEdit ? 'Placement' : 'Internship',
    description: isEdit ? 'Looking for a skilled developer...' : '',
    seasonId: 'PL2025-JUN',
    designation: isEdit ? 'SDE-1' : '',
    opportunityNature: 'Full time',
    processType: 'On-Campus',
    ctc: isEdit ? '12 LPA' : '',
    location: isEdit ? 'Bangalore' : '',
    eligibility: isEdit ? 'Minimum 7.5 CGPA' : '',
    skillSet: 'React, Node.js, TypeScript',
  });

  const handleCancel = () => {
    if (isAdmin) navigate(tpUrls.admin.opportunities);
    else if (isCompany) navigate(tpUrls.company.opportunities);
  };

  const handleSave = () => {
    // Save logic
    handleCancel();
  };

  return (
    <FormPage
      title={isEdit ? 'Edit Opportunity' : 'Add Opportunity'}
      description="Create or update a job / internship posting."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        {
          label: isAdmin ? 'Admin Portal' : 'Company Portal',
          to: isAdmin ? tpUrls.admin.portal : tpUrls.company.portal,
        },
        {
          label: 'Opportunities',
          to: isAdmin
            ? tpUrls.admin.opportunities
            : tpUrls.company.opportunities,
        },
        { label: isEdit ? 'Edit' : 'Add' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
          >
            Save Opportunity
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Section A: Basic Details">
          <FormGrid>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.opportunityType}
                onChange={e =>
                  setFormData({ ...formData, opportunityType: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Placement">Placement (Full-Time)</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Season <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.seasonId}
                onChange={e =>
                  setFormData({ ...formData, seasonId: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="PL2025-JUN">PL2025-JUN (Active)</option>
              </select>
            </div>
            <div className="col-span-12">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={e =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nature
              </label>
              <select
                value={formData.opportunityNature}
                onChange={e =>
                  setFormData({
                    ...formData,
                    opportunityNature: e.target.value,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Process Type
              </label>
              <select
                value={formData.processType}
                onChange={e =>
                  setFormData({ ...formData, processType: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="On-Campus">On-Campus</option>
                <option value="Off-Campus">Off-Campus</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>
          </FormGrid>
        </FormCard>

        <FormCard title="Section B: Eligibility">
          <FormGrid>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Eligibility Criteria <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.eligibility}
                onChange={e =>
                  setFormData({ ...formData, eligibility: e.target.value })
                }
                rows={3}
                placeholder="E.g., Minimum 7.5 CGPA, No active backlogs"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Required Skills
              </label>
              <textarea
                value={formData.skillSet}
                onChange={e =>
                  setFormData({ ...formData, skillSet: e.target.value })
                }
                rows={3}
                placeholder="Comma separated skills..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </FormGrid>
        </FormCard>

        <FormCard title="Section C: Compensation & Logistics">
          <FormGrid>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Compensation (CTC / Stipend){' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ctc}
                onChange={e =>
                  setFormData({ ...formData, ctc: e.target.value })
                }
                placeholder="E.g. 12 LPA or 25k/month"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Posting Location(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="E.g. Bangalore, Mumbai"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </FormGrid>
        </FormCard>
      </div>
    </FormPage>
  );
}
