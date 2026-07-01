import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, FormPopup } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { mockCertificates, type Certificate } from '../../mocks';
import { learningUrls } from '../../urls';

export default function StudentCertificates() {
  const [data] = useState<Certificate[]>(mockCertificates);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);

  const triggerDownload = (cert: Certificate) => {
    setViewingCert(cert);
  };

  const handlePrint = () => {
    ToastService.success('Sending certificate document to printer...');
  };

  return (
    <FormPage
      title="Certificates & Achievements"
      description="Access and download your verified course completion certificates and view earned badges."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Student Portal', to: learningUrls.student.portal },
        { label: 'Certificates' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left Column: Completed Courses & Certificates */}
        <div className="lg:col-span-2 space-y-4">
          <FormCard title="Verified Certificates">
            <div className="space-y-4">
              {data.map(cert => (
                <div
                  key={cert.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-yellow-150 bg-amber-50/20 rounded-xl gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 text-amber-700 p-3 rounded-lg flex items-center justify-center border border-amber-200">
                      <Icon name="workspace_premium" className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{cert.courseName}</h4>
                      <p className="text-xxs text-gray-500 mt-1">
                        Issued on {cert.issueDate} • Credential ID: {cert.credentialId}
                      </p>
                    </div>
                  </div>
                  <Button
                    label="View Certificate"
                    variant="primary"
                    size="small"
                    icon="file-download"
                    onClick={() => triggerDownload(cert)}
                  />
                </div>
              ))}
            </div>
          </FormCard>

          <FormCard title="Completed Courses History">
            <div className="space-y-3">
              {[
                { name: 'Bachelor of Computer Applications', code: 'BCA', date: 'June 10, 2026', grade: 'A+' },
                { name: 'Introduction to Advanced Programming in C++', code: 'BTECH-CS', date: 'May 12, 2026', grade: 'A' },
                { name: 'Database Management Systems & SQL', code: 'BTECH-CS', date: 'June 18, 2026', grade: 'A+' },
              ].map((c, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <h5 className="text-xs font-bold text-gray-800">{c.name}</h5>
                    <p className="text-xxs text-gray-400 mt-0.5">Completed: {c.date} • Grade: {c.grade}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xxs font-bold bg-green-150 text-green-700">Completed</span>
                </div>
              ))}
            </div>
          </FormCard>
        </div>

        {/* Right Column: Badges */}
        <FormCard title="Achievement Badges Collection">
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Fast Learner', desc: 'Completed module in 1 day', icon: 'bolt', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
              { title: 'Perfect Score', desc: 'Got 100% on C++ Quiz', icon: 'stars', color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { title: 'Code Warrior', desc: 'Completed all C++ lab assignments', icon: 'code', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
              { title: 'Attendance Star', desc: 'Maintained 85%+ attendance rate', icon: 'schedule', color: 'text-green-600 bg-green-50 border-green-200' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-4 border rounded-2xl text-center transition-transform hover:scale-105 ${badge.color}`}
              >
                <Icon name={badge.icon} className="text-3xl mb-2" />
                <h5 className="text-xs font-bold text-gray-800">{badge.title}</h5>
                <p className="text-xxs text-gray-500 mt-1 leading-tight">{badge.desc}</p>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      {/* Certificate Viewer Modal */}
      {viewingCert && (
        <FormPopup
          visible={true}
          onHide={() => setViewingCert(null)}
          title="Certificate Viewer"
          size="lg"
        >
          <div className="flex flex-col items-center">
            {/* The Certificate design */}
            <div
              style={{
                width: '100%',
                maxWidth: '680px',
                border: '12px double #b45309',
                padding: '2.5rem',
                backgroundColor: '#fffbeb',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontFamily: 'serif',
                position: 'relative',
              }}
              className="rounded-lg my-4"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-700"><Icon name="filter_vintage" /></div>
              <div className="absolute top-2 right-2 text-amber-700"><Icon name="filter_vintage" /></div>
              <div className="absolute bottom-2 left-2 text-amber-700"><Icon name="filter_vintage" /></div>
              <div className="absolute bottom-2 right-2 text-amber-700"><Icon name="filter_vintage" /></div>

              <h2 className="text-amber-800 font-bold uppercase tracking-widest text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                Octagon University
              </h2>
              <p className="text-gray-500 text-xxs tracking-wider mt-1 uppercase">
                Learning Management Certification
              </p>

              <div className="my-6">
                <p className="text-gray-600 text-xs italic">This is to verify that</p>
                <h3 className="text-2xl font-bold text-gray-900 my-2 italic border-b border-amber-200 pb-1 inline-block px-8">
                  {viewingCert.recipientName}
                </h3>
                <p className="text-gray-600 text-xs italic">has successfully completed all requirements of</p>
                <h4 className="text-lg font-bold text-amber-900 mt-2 uppercase tracking-wide">
                  {viewingCert.courseName}
                </h4>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-left border-t border-amber-100 pt-6">
                <div>
                  <p className="text-xxs text-gray-400 uppercase">Verification Hash</p>
                  <p className="text-xxs font-mono text-gray-700 font-semibold">{viewingCert.credentialId}</p>
                  <p className="text-xxs text-gray-400 uppercase mt-2">Issue Date</p>
                  <p className="text-xxs text-gray-700 font-bold">{viewingCert.issueDate}</p>
                </div>
                <div className="text-right flex flex-col justify-end items-end">
                  <div className="w-32 border-b border-gray-400 pb-1 text-center italic text-xs font-semibold text-gray-800">
                    {viewingCert.facultyName}
                  </div>
                  <p className="text-xxs text-gray-400 uppercase mt-1">Authorized Instructor</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setViewingCert(null)}
              />
              <Button
                label="Print Certificate"
                variant="primary"
                icon="print"
                onClick={handlePrint}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
