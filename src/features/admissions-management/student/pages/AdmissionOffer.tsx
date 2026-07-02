import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';

export default function AdmissionOffer() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Admission Offer"
      description="Review and accept your offer of admission."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admission Offer' },
      ]}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <FormCard className="overflow-hidden border-0">
          <div className="h-2 w-full bg-gradient-to-r from-green-400 to-green-600 rounded-t-lg absolute top-0 left-0"></div>

          <div className="text-center pt-8 pb-4">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100 shadow-sm">
              <i className="pi pi-verified text-6xl text-green-500"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Congratulations!
            </h1>
            <p className="text-gray-600 text-lg">
              You have been selected for admission.
            </p>
          </div>

          <Divider className="my-2" />

          <div className="p-6 bg-white border border-gray-200 rounded-xl my-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-wide">
              <i className="pi pi-file text-blue-600"></i>
              Offer Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
              <div className="flex flex-col border-b md:border-b-0 border-gray-100 pb-3 md:pb-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Applicant Name
                </p>
                <p className="font-semibold text-gray-900 text-lg">John Doe</p>
              </div>
              <div className="flex flex-col border-b md:border-b-0 border-gray-100 pb-3 md:pb-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Application ID
                </p>
                <p className="font-semibold text-gray-900 text-lg font-mono bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-200 self-start">
                  APP-2026-98765
                </p>
              </div>
              <div className="flex flex-col border-b md:border-b-0 border-gray-100 pb-3 md:pb-0 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Programme Offered
                </p>
                <p className="font-bold text-blue-700 text-lg">
                  B.Tech Computer Science and Engineering
                </p>
              </div>
              <div className="flex flex-col border-b md:border-b-0 border-gray-100 pb-3 md:pb-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Academic Session
                </p>
                <p className="font-semibold text-gray-900 text-lg">2026-2027</p>
              </div>
              <div className="flex flex-col border-b md:border-b-0 border-gray-100 pb-3 md:pb-0">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Offer Valid Until
                </p>
                <p className="font-bold text-red-600 text-lg flex items-center gap-2">
                  <i className="pi pi-clock text-sm"></i>
                  25 May 2026
                </p>
              </div>
              <div className="flex flex-col pt-3 md:pt-4 border-t border-dashed border-gray-200 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Admission Fee Payable
                </p>
                <p className="font-bold text-green-700 text-3xl">₹ 45,000</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mb-8 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
              <i className="pi pi-info-circle text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2 uppercase tracking-wide text-sm">
                Important Instructions
              </h3>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-2 leading-relaxed">
                <li>
                  Please accept the offer and pay the admission fee before the
                  deadline.
                </li>
                <li>
                  <span className="font-semibold text-red-600">
                    Failure to pay the fee by the deadline will result in the
                    forfeiture of your seat.
                  </span>
                </li>
                <li>
                  Once the fee is paid, you will be able to download your final
                  Admission Letter.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4 mt-6 border-t border-gray-100 pt-6">
            <Button
              label="Decline Offer"
              icon="pi pi-times"
              severity="danger"
              outlined
              className="w-full sm:w-auto font-bold px-6 shadow-sm hover:shadow"
            />
            <Button
              label="Accept & Pay Fee"
              icon="pi pi-check"
              severity="success"
              className="w-full sm:w-auto font-bold px-8 shadow-md"
              onClick={() => navigate(admissionsUrls.student.feePayment)}
              size="large"
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
