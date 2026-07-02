import { Button } from 'primereact/button';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';

export default function AdmissionLetter() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <FormPage
      title="Your Admission Letter"
      description="Download or print your official admission letter."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admission Letter' },
      ]}
      headerAction={
        <Button
          label="Download / Print PDF"
          icon="pi pi-print"
          onClick={handlePrint}
          severity="secondary"
          className="shadow-sm font-bold print:hidden"
        />
      }
    >
      <div className="max-w-4xl mx-auto">
        <FormCard className="shadow-2xl rounded-sm print:shadow-none print:border-none print:m-0 print:p-0 overflow-hidden bg-white">
          <div
            className="p-8 md:p-12 text-gray-800 font-serif"
            id="admission-letter"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-gray-800 pb-6 mb-8 gap-6 md:gap-0">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center text-white shadow-md shrink-0">
                  <i className="pi pi-building text-4xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-indigo-900 tracking-wider m-0 mb-1">
                    Aetheradix University
                  </h2>
                  <p className="text-sm text-gray-600 italic font-medium m-0 mb-1">
                    Excellence in Education & Research
                  </p>
                  <p className="text-xs text-gray-500 m-0">
                    123 University Avenue, Tech City, 10001
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded border border-gray-100 md:border-none">
                <p className="text-sm font-semibold text-gray-700 m-0 mb-1">
                  <span className="text-gray-500 uppercase text-xs tracking-wider">
                    Ref:
                  </span>{' '}
                  AU/ADM/2026/8921
                </p>
                <p className="text-sm font-semibold text-gray-700 m-0">
                  <span className="text-gray-500 uppercase text-xs tracking-wider">
                    Date:
                  </span>{' '}
                  15 May 2026
                </p>
              </div>
            </div>

            {/* Letter Body */}
            <div className="space-y-6 text-justify leading-relaxed text-gray-800">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 inline-block pr-12">
                <p className="font-bold mb-1">To,</p>
                <p className="font-bold text-lg mb-2">Mr. John Doe</p>
                <p className="text-sm mb-1 text-gray-600">
                  <span className="font-semibold text-gray-700">
                    Application ID:
                  </span>{' '}
                  APP-2026-98765
                </p>
                <p className="text-sm m-0 text-gray-600">
                  <span className="font-semibold text-gray-700">Email:</span>{' '}
                  johndoe@example.com
                </p>
              </div>

              <div className="mt-8">
                <p className="font-bold text-lg underline decoration-gray-400 underline-offset-4 mb-6">
                  Subject: Offer of Admission for Academic Session 2026-2027
                </p>
                <p className="font-medium">Dear John Doe,</p>
              </div>

              <p className="text-gray-700">
                Congratulations! We are pleased to inform you that based on your
                academic record and performance in the entrance examination, you
                have been selected for admission to the{' '}
                <span className="font-bold text-indigo-900 bg-indigo-50 px-1 py-0.5 rounded">
                  Bachelor of Technology in Computer Science and Engineering
                </span>{' '}
                program at Aetheradix University for the academic session
                2026-2027.
              </p>

              <div className="border border-gray-200 rounded-lg my-8 overflow-hidden">
                <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                  <h4 className="font-bold text-gray-800 m-0 uppercase tracking-wider text-sm">
                    Admission Details
                  </h4>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-5 font-semibold text-gray-600 w-1/3 text-sm uppercase tracking-wide">
                        Programme
                      </td>
                      <td className="py-3 px-5 font-bold text-gray-800">
                        B.Tech Computer Science and Engineering
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <td className="py-3 px-5 font-semibold text-gray-600 text-sm uppercase tracking-wide">
                        Allotted Roll Number
                      </td>
                      <td className="py-3 px-5 font-bold text-indigo-700 font-mono text-lg tracking-widest">
                        26BTCSE045
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-5 font-semibold text-gray-600 text-sm uppercase tracking-wide">
                        Reporting Date
                      </td>
                      <td className="py-3 px-5 font-bold text-gray-800 flex items-center gap-2">
                        <i className="pi pi-calendar text-gray-400"></i>
                        01 August 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <td className="py-3 px-5 font-semibold text-gray-600 text-sm uppercase tracking-wide">
                        Reporting Time & Venue
                      </td>
                      <td className="py-3 px-5 font-bold text-gray-800">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2">
                            <i className="pi pi-clock text-gray-400"></i> 09:00
                            AM
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="pi pi-map-marker text-gray-400"></i>{' '}
                            Main Auditorium
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700">
                This admission is provisional and subject to the verification of
                all original documents and certificates at the time of physical
                reporting. Please ensure you bring the following documents:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-lg my-4 shadow-inner">
                <ul className="list-none space-y-2 m-0 p-0 text-gray-800">
                  <li className="flex items-start gap-2">
                    <i className="pi pi-check-circle text-green-600 mt-1"></i>{' '}
                    <span>Original Marksheets (10th and 12th Standard)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="pi pi-check-circle text-green-600 mt-1"></i>{' '}
                    <span>Transfer Certificate / Migration Certificate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="pi pi-check-circle text-green-600 mt-1"></i>{' '}
                    <span>Aadhar Card or valid Photo ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="pi pi-check-circle text-green-600 mt-1"></i>{' '}
                    <span>Four recent passport-size photographs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="pi pi-check-circle text-green-600 mt-1"></i>{' '}
                    <span>Printed copy of this Admission Letter</span>
                  </li>
                </ul>
              </div>

              <p className="mt-8 font-medium italic text-gray-600 border-l-4 border-indigo-200 pl-4 py-1">
                We look forward to welcoming you to the Aetheradix University
                family and wish you a successful and enriching academic journey.
              </p>

              <div className="mt-16 flex flex-col-reverse md:flex-row justify-between items-center md:items-end gap-10 md:gap-0 pt-8 border-t border-dashed border-gray-300">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="p-2 border-2 border-gray-200 rounded-lg shadow-sm bg-white mb-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/30/QR_code_example.png"
                      alt="QR Code"
                      className="w-24 h-24 mix-blend-multiply opacity-80"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                    Scan to verify
                  </p>
                </div>
                <div className="text-center bg-gray-50 px-8 py-6 rounded-lg border border-gray-100 relative">
                  <div className="absolute -top-4 right-4 text-blue-900/10 transform rotate-12">
                    <i className="pi pi-verified text-6xl"></i>
                  </div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.png"
                    alt="Signature"
                    className="w-32 mx-auto mb-2 opacity-80 filter contrast-125"
                  />
                  <div className="w-48 border-b-2 border-gray-800 mb-3 mx-auto"></div>
                  <p className="font-black text-gray-900 uppercase tracking-widest mb-1">
                    Registrar
                  </p>
                  <p className="text-sm font-semibold text-gray-600 mb-0">
                    Admissions Authority
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Aetheradix University
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FormCard>

        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #admission-letter, #admission-letter * {
              visibility: visible;
            }
            #admission-letter {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 2cm !important;
            }
          }
        `}</style>
      </div>
    </FormPage>
  );
}
