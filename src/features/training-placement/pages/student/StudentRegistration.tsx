import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Toast } from 'primereact/toast';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

export default function StudentRegistration() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useLocalStorage('tp_student_registration', {
    optIn: true,
    resumeLink: '',
    agreedToTerms: false,
  });

  const handleSave = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Registration settings updated successfully.',
      life: 3000,
    });
    setTimeout(() => navigate(tpUrls.student.dashboard), 1500);
  };

  return (
    <FormPage
      title="T&P Registration"
      description="Manage your participation status and core profile details for placements."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Student Portal', to: tpUrls.student.portal },
        { label: 'Registration' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <button
            onClick={() => navigate(tpUrls.student.dashboard)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.agreedToTerms && formData.optIn}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            Save Settings
          </button>
        </div>
      }
    >
      <Toast ref={toast} />
      <div className="flex flex-col gap-6 lg:w-2/3">
        <FormCard title="Participation Status">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="optIn"
                  checked={formData.optIn}
                  onChange={() => setFormData({ ...formData, optIn: true })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Opt-in for Placements
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="optIn"
                  checked={!formData.optIn}
                  onChange={() => setFormData({ ...formData, optIn: false })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Opt-out
                </span>
              </label>
            </div>
            {!formData.optIn && (
              <p className="mt-4 text-sm text-orange-600 bg-orange-50 p-3 rounded-md border border-orange-200">
                Warning: By opting out, you will not be able to apply for any
                upcoming placement drives or internships through the university
                portal.
              </p>
            )}
          </div>
        </FormCard>

        {formData.optIn && (
          <>
            <FormCard title="Profile Details">
              <div className="grid grid-cols-1 gap-6 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Resume Link (Google Drive / DropBox)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.resumeLink}
                    onChange={e =>
                      setFormData({ ...formData, resumeLink: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Make sure the link is publicly accessible.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Note on Academic Details
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your academic records (CGPA, marks, current semester) are
                    automatically fetched from the Student Information System.
                    If you spot any discrepancies, please contact the admin
                    desk.
                  </p>
                </div>
              </div>
            </FormCard>

            <FormCard title="Terms & Conditions">
              <div className="p-4">
                <div className="h-40 overflow-y-auto bg-gray-50 p-4 border border-gray-200 rounded-md text-sm text-gray-600 mb-4">
                  <p className="mb-2 font-semibold">1. Code of Conduct</p>
                  <p className="mb-4">
                    Students must maintain professional behavior during all
                    placement activities.
                  </p>
                  <p className="mb-2 font-semibold">2. Offer Policy</p>
                  <p>
                    Once a student accepts a job offer, they may be restricted
                    from applying to further companies as per the university
                    policy.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        agreedToTerms: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    I have read and agree to the Terms & Conditions
                  </span>
                </label>
              </div>
            </FormCard>
          </>
        )}
      </div>
    </FormPage>
  );
}
