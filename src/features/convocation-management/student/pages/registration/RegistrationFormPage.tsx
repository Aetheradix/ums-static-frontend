import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { FileUpload, FormWizard } from 'shared/components/forms';
import { FormPage } from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function RegistrationFormPage() {
  const navigate = useNavigate();

  // Form State
  const [attendMode, setAttendMode] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(0);
  const [address, setAddress] = useState('');

  const handleComplete = () => {
    ToastService.success('Registration completed successfully!');
    navigate(CONVOCATION_URLS.STUDENT.DASHBOARD);
  };

  const steps = [
    {
      label: 'Eligibility',
      icon: 'pi-user',
      content: (
        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Personal Details Verification
          </h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-100">
            <div>
              <span className="text-sm text-gray-500 block">
                Full Name (as per records)
              </span>
              <span className="font-semibold text-gray-900">Rahul Sharma</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Roll Number</span>
              <span className="font-semibold text-gray-900">CS-2024-041</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Programme</span>
              <span className="font-semibold text-gray-900">
                B.Tech Computer Science
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">
                No Dues Status
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                Cleared
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Note: If any of the above details are incorrect, please contact the
            admin office before proceeding.
          </p>
        </div>
      ),
    },
    {
      label: 'Mode of Reception',
      icon: 'pi-calendar-plus',
      content: (
        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Ceremony Options
          </h3>

          <div className="field">
            <label className="block text-sm font-semibold mb-2">
              How will you receive your degree?
            </label>
            <Dropdown
              value={attendMode}
              onChange={e => setAttendMode(e.value)}
              options={[
                { label: 'In-Person (Attend Ceremony)', value: 'in_person' },
                { label: 'In-Absentia (By Post)', value: 'in_absentia' },
              ]}
              placeholder="Select mode of reception"
              className="w-full"
            />
          </div>

          {attendMode === 'in_person' && (
            <div className="field animate-fade-in">
              <label className="block text-sm font-semibold mb-2">
                Number of Accompanying Guests
              </label>
              <Dropdown
                value={guests}
                onChange={e => setGuests(e.value)}
                options={[
                  { label: 'None (0)', value: 0 },
                  { label: '1 Guest', value: 1 },
                  { label: '2 Guests', value: 2 },
                ]}
                className="w-full"
              />
              <small className="text-gray-500 mt-1 block">
                Maximum 2 guests allowed per student. Extra charges may apply.
              </small>
            </div>
          )}

          {attendMode === 'in_absentia' && (
            <div className="field animate-fade-in">
              <label className="block text-sm font-semibold mb-2">
                Postal Address for Dispatch
              </label>
              <InputTextarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={4}
                className="w-full"
                placeholder="Enter complete address with PIN code"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      label: 'Document Upload',
      icon: 'pi-cloud-upload',
      content: (
        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Upload Required Documents
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your recent passport size photograph and a valid ID proof.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              mode="avatar"
              label="Passport Photograph"
              uploadNote="Max 2MB (JPG/PNG)"
              accept="image/jpeg, image/png"
              maxSizeKB={2048}
            />
            <FileUpload
              mode="file"
              label="Government ID Proof"
              uploadNote="Max 2MB (PDF/JPG)"
              accept="application/pdf, image/jpeg"
              maxSizeKB={2048}
            />
          </div>
        </div>
      ),
    },
    {
      label: 'Payment',
      icon: 'pi-credit-card',
      content: (
        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Fee Payment</h3>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Base Convocation Fee</span>
              <span className="font-semibold">₹1,500</span>
            </div>
            {attendMode === 'in_person' && guests > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">
                  Guest Fee ({guests} x ₹500)
                </span>
                <span className="font-semibold">₹{guests * 500}</span>
              </div>
            )}
            {attendMode === 'in_absentia' && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Postal Dispatch Charges</span>
                <span className="font-semibold">₹200</span>
              </div>
            )}
            <div className="flex justify-between py-3 mt-2 text-lg">
              <span className="font-bold text-gray-900">Total Payable</span>
              <span className="font-bold text-indigo-600">
                ₹{1500 + (attendMode === 'in_person' ? guests * 500 : 200)}
              </span>
            </div>
          </div>

          <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg flex items-start space-x-3 text-sm">
            <span className="material-symbols-outlined text-indigo-600 shrink-0">
              info
            </span>
            <p>
              By proceeding to pay, you agree to the university terms and
              conditions regarding convocation attendance and degree dispatch.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Convocation Registration"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Student Portal', to: CONVOCATION_URLS.STUDENT.ROOT },
        { label: 'Registration' },
      ]}
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <FormWizard steps={steps} onComplete={handleComplete} hideReset />
      </div>
    </FormPage>
  );
}
