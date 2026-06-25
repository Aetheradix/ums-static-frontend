import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, GridPanel, FormPopup } from 'shared/new-components';
import { FileUpload } from 'shared/components/forms';
import { ToastService } from 'services';
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  { id: 1, student: 'Jane Smith', course: 'BCA', completionDate: '2026-06-20', status: 'Generated' },
  { id: 2, student: 'John Doe', course: 'BCA', completionDate: '2026-06-25', status: 'Pending' },
];

export default function GenerateCertificate() {
  const [data] = useState(MOCK_DATA);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'generate' | 'view'; item?: any }>({ mode: 'closed' });
  const navigate = useNavigate();

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleGenerate = () => {
    ToastService.success(`Certificate generated successfully`);
    closePopup();
  };

  return (
    <FormPage title="Certificate Generation" description="Generate and issue certificates for completed courses.">
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'student', header: 'Student Name' },
            { field: 'course', header: 'Course' },
            { field: 'completionDate', header: 'Completion Date' },
            { 
              field: 'status', 
              header: 'Status',
              cell: (item: any) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === 'Generated' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.status}
                </span>
              )
            },
            {
               field: 'actions',
               header: 'Actions',
               sortable: false,
               cell: (item: any) => (
                 item.status === 'Pending' ? 
                 <Button label="Generate" size="small" variant="primary" onClick={() => setPopup({ mode: 'generate', item })} /> :
                 <Button label="View" size="small" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
               )
            }
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'generate' || popup.mode === 'view'}
        onHide={closePopup}
        title={popup.mode === 'generate' ? "Generate Certificate" : "Certificate Details"}
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div><strong>Student:</strong> {popup.item?.student}</div>
            <div><strong>Course:</strong> {popup.item?.course}</div>
            <div><strong>Completion Date:</strong> {popup.item?.completionDate}</div>
          </div>

          {popup.mode === 'generate' ? (
             <div className="mt-4 border-t pt-4">
               <h4 className="text-sm font-semibold mb-2">Upload Certificate Image</h4>
               <FileUpload label="Select Image File (.png, .jpg)" onChange={() => {}} />
             </div>
           ) : (
             <div className="mt-4 border-t pt-4">
                <div className="border-8 border-double border-gray-300 p-8 text-center bg-white shadow-lg relative">
                  <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Certificate of Completion</h2>
                  <p className="text-gray-500 mb-6 italic">This is to certify that</p>
                  <h3 className="text-4xl font-serif text-blue-600 font-bold mb-6">{popup.item?.student}</h3>
                  <p className="text-gray-600 mb-2">has successfully completed the course</p>
                  <h4 className="text-2xl font-bold text-gray-800 mb-8">{popup.item?.course}</h4>
                  <div className="flex justify-between items-end px-8 mt-12">
                    <div className="border-t-2 border-gray-400 pt-2 w-32">
                      <p className="text-sm font-semibold text-gray-600">{popup.item?.completionDate}</p>
                      <p className="text-xs text-gray-400">Date</p>
                    </div>
                    <div className="border-t-2 border-gray-400 pt-2 w-32">
                      <p className="text-sm font-semibold text-gray-600">Director</p>
                      <p className="text-xs text-gray-400">Signature</p>
                    </div>
                  </div>
                </div>
             </div>
           )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Close" variant="outlined" onClick={closePopup} />
          {popup.mode === 'generate' && <Button label="Generate" variant="primary" onClick={handleGenerate} />}
        </div>
      </FormPopup>
    </FormPage>
  );
}
