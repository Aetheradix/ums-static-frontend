import { Button } from 'primereact/button';
import { FormPage } from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function ConvocationPassPage() {
  return (
    <FormPage
      title="My Convocation Pass"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Student Portal', to: CONVOCATION_URLS.STUDENT.ROOT },
        { label: 'My Pass' },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-end mb-4">
          <Button
            label="Download PDF"
            icon="pi pi-download"
            className="p-button-outlined p-button-indigo mr-3"
          />
          <Button
            label="Print Pass"
            icon="pi pi-print"
            className="p-button-primary"
            onClick={() => window.print()}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg print:shadow-none print:border-none">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                24th Annual Convocation
              </h2>
              <p className="text-indigo-200 font-medium tracking-wide uppercase">
                Entry Pass
              </p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">
                    Student Name
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    Rahul Sharma
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">
                    Roll Number
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    CS-2024-041
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">
                    Programme
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    B.Tech in Computer Science
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Mode</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    In-Person
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">
                    Guests Allowed
                  </span>
                  <span className="text-lg font-bold text-gray-900">2</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-start space-x-3 text-gray-700">
                  <span className="material-symbols-outlined text-indigo-500">
                    event
                  </span>
                  <div>
                    <span className="block font-semibold">
                      15th August 2026, 09:30 AM
                    </span>
                    <span className="text-sm text-gray-500 block">
                      Reporting Time: 08:00 AM
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-gray-700 mt-4">
                  <span className="material-symbols-outlined text-indigo-500">
                    location_on
                  </span>
                  <div>
                    <span className="block font-semibold">
                      Main University Auditorium
                    </span>
                    <span className="text-sm text-gray-500 block">
                      Gate No. 4, North Campus
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right QR & Photo */}
            <div className="flex flex-col items-center justify-center border-l-0 md:border-l border-gray-200 pl-0 md:pl-8 space-y-6">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src="https://api.dicebear.com/7.x/initials/svg?seed=Rahul Sharma&backgroundColor=4f46e5"
                  alt="Student Photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-32 bg-white p-2 border-2 border-gray-900 rounded-lg">
                {/* Mock QR Code Pattern using generic SVG or CSS blocks */}
                <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1">
                  <div className="bg-gray-900 col-span-2 row-span-2"></div>
                  <div className="bg-white"></div>
                  <div className="bg-gray-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-gray-900 col-span-2 row-span-2"></div>
                  <div className="bg-gray-900"></div>
                  <div className="bg-gray-900 col-span-2"></div>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-mono tracking-widest text-center mt-2">
                #CNV-2024-88392
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
            This is a computer-generated pass. Please carry a valid government
            ID along with this pass for entry.
          </div>
        </div>
      </div>
    </FormPage>
  );
}
