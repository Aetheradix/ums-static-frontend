import { useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { learningUrls } from '../../urls';

export default function ViewCertificate() {
  const navigate = useNavigate();
  const [certData, setCertData] = useState({
    title: 'Certificate of Completion',
    subheading: 'This is to certify that',
    studentName: 'Jane Smith',
    description: 'has successfully completed the course',
    courseName: 'Bachelor of Computer Applications (BCA)',
    date: '2026-06-20',
    signature: 'Dr. Admin Signature',
  });

  const handleSave = () => {
    ToastService.success('Certificate details saved successfully');
  };

  return (
    <FormPage
      title="Certificate Designer"
      description="Edit and preview the certificate layout."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Certificate Designer' }
      ]}
    >
      <div className="flex justify-end gap-2 mb-4">
        <Button
          label="Save Changes"
          variant="primary"
          icon="save"
          onClick={handleSave}
        />
        <Button
          label="Back to List"
          variant="outlined"
          onClick={() => navigate('/home/lms/certification/generate')}
        />
      </div>
      <FormCard>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Panel */}
          <div className="flex flex-col gap-4 w-full lg:w-1/3 border-r pr-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Edit Details
            </h3>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Title</label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.title}
                onChange={e =>
                  setCertData({ ...certData, title: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                Subheading
              </label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.subheading}
                onChange={e =>
                  setCertData({ ...certData, subheading: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                Student Name
              </label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.studentName}
                onChange={e =>
                  setCertData({ ...certData, studentName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                Description
              </label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.description}
                onChange={e =>
                  setCertData({ ...certData, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                Course Name
              </label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.courseName}
                onChange={e =>
                  setCertData({ ...certData, courseName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Date</label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.date}
                onChange={e =>
                  setCertData({ ...certData, date: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                Signature Name
              </label>
              <input
                className="border p-2 rounded text-sm w-full"
                value={certData.signature}
                onChange={e =>
                  setCertData({ ...certData, signature: e.target.value })
                }
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-2/3 flex justify-center items-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 overflow-auto min-h-[500px]">
            <div className="bg-white shadow-xl w-[800px] h-[550px] border-[10px] border-indigo-900 p-12 flex flex-col items-center justify-center relative flex-shrink-0 text-center">
              <h1 className="text-4xl font-serif font-bold text-indigo-900 mb-2">
                {certData.title}
              </h1>
              <div className="w-24 h-1 bg-amber-500 mb-8"></div>
              <p className="text-xl italic text-gray-600 mb-6">
                {certData.subheading}
              </p>
              <h2 className="text-5xl font-serif text-gray-800 mb-6 border-b-2 border-gray-200 px-12 pb-2">
                {certData.studentName}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {certData.description}
              </p>
              <h3 className="text-3xl font-semibold text-indigo-800 mb-12">
                {certData.courseName}
              </h3>

              <div className="flex justify-between w-full mt-auto px-12 border-t pt-8 text-sm font-semibold">
                <div className="text-center">
                  <div>{certData.date}</div>
                  <div className="border-t border-black mt-2 pt-1">Date</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-700 font-cursive italic text-xl -mt-4">
                    {certData.signature}
                  </div>
                  <div className="border-t border-black mt-2 pt-1">
                    Authorized Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
