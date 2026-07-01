import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, Stepper } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { StudentSeedService } from '../../seed/students';

export default function ImportStudents() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    admissionType: '',
    academicSession: '',
    programmeId: '',
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const ALLOWED_TYPES = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  const MAX_SIZE_MB = 10;

  const handleFileSelect = (file: File) => {
    if (
      !ALLOWED_TYPES.includes(file.type) &&
      !file.name.match(/\.(xlsx|csv)$/i)
    ) {
      ToastService.error(
        'Invalid file type. Please upload a .xlsx or .csv file.'
      );
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      ToastService.error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFile(file);
    ToastService.success(`File "${file.name}" selected successfully.`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDownloadTemplate = () => {
    const headers =
      'First Name,Last Name,Email,Phone,Gender,Date of Birth,Roll No,Enrolment No';
    const sample =
      'Ravi,Kumar,ravi.kumar@example.com,9876543210,Male,2002-05-15,RL001,EN001';
    const csvContent = `${headers}\n${sample}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    setImporting(true);
    // Simulate API delay for parsing and importing
    setTimeout(async () => {
      try {
        await StudentSeedService.bulkAdd([
          {
            enrolmentNo: `EN${Math.floor(Math.random() * 10000)}`,
            rollNo: `RL${Math.floor(Math.random() * 10000)}`,
            firstName: 'Demo',
            lastName: 'Imported',
            email: 'demo.imported@example.com',
            phone: '1112223334',
            gender: 'Male',
            dateOfBirth: '2000-01-01',
            programmeId: Number(formData.programmeId) || 1,
            programmeName:
              formData.programmeId === '2'
                ? 'MBA Finance'
                : 'B.Tech Computer Science',
            academicSession: formData.academicSession || '2024-2025',
            status: 'Active',
            abcLinked: false,
          },
          {
            enrolmentNo: `EN${Math.floor(Math.random() * 10000)}`,
            rollNo: `RL${Math.floor(Math.random() * 10000)}`,
            firstName: 'Test',
            lastName: 'Student',
            email: 'test.student@example.com',
            phone: '5556667778',
            gender: 'Female',
            dateOfBirth: '2001-02-02',
            programmeId: Number(formData.programmeId) || 1,
            programmeName:
              formData.programmeId === '2'
                ? 'MBA Finance'
                : 'B.Tech Computer Science',
            academicSession: formData.academicSession || '2024-2025',
            status: 'Active',
            abcLinked: false,
          },
        ]);
        ToastService.success('Students imported successfully');
        navigate('/student-management/admin/directory');
      } catch (err) {
        ToastService.error('Failed to import students');
      } finally {
        setImporting(false);
      }
    }, 1500);
  };

  return (
    <FormPage
      title="Bulk Import Students"
      description="Upload an Excel file to import multiple students into a specific programme and session."
      breadcrumbs={[
        { label: 'Admin', to: '/student-management/admin' },
        { label: 'Import Students', to: '' },
      ]}
    >
      <FormCard>
        <div className="mb-8">
          <Stepper
            activeStep={step - 1}
            steps={[
              { label: 'Configure Details' },
              { label: 'Upload File' },
              { label: 'Review & Import' },
            ]}
          />
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <DropDownList
              label="Admission Type"
              value={formData.admissionType}
              onChange={(v: any) =>
                setFormData({ ...formData, admissionType: v })
              }
              data={[
                { label: 'Regular Admission', value: 'Regular' },
                { label: 'Lateral Entry', value: 'Lateral' },
              ]}
              textField="label"
              valueField="value"
            />
            <DropDownList
              label="Academic Session"
              value={formData.academicSession}
              onChange={(v: any) =>
                setFormData({ ...formData, academicSession: v })
              }
              data={[
                { label: '2024-2025', value: '2024-2025' },
                { label: '2023-2024', value: '2023-2024' },
              ]}
              textField="label"
              valueField="value"
            />
            <DropDownList
              label="Programme"
              value={formData.programmeId}
              onChange={(v: any) =>
                setFormData({ ...formData, programmeId: v })
              }
              data={[
                { label: 'B.Tech Computer Science', value: '1' },
                { label: 'MBA Finance', value: '2' },
                { label: 'B.Sc Physics', value: '3' },
              ]}
              textField="label"
              valueField="value"
            />
            <div className="flex justify-end mt-4">
              <Button
                label="Next Step"
                variant="primary"
                onClick={handleNext}
                disabled={
                  !formData.admissionType ||
                  !formData.academicSession ||
                  !formData.programmeId
                }
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center gap-6 py-8">
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center w-full max-w-2xl transition-colors cursor-pointer
                ${isDragOver ? 'border-blue-500 bg-blue-50' : selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
              `}
            >
              {selectedFile ? (
                <>
                  <i className="pi pi-file-excel text-4xl text-green-500 mb-4 block" />
                  <h3 className="text-lg font-semibold text-green-700">
                    File Selected
                  </h3>
                  <p className="text-green-600 mt-1 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Click to replace file
                  </p>
                </>
              ) : (
                <>
                  <i className="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Click or drag Excel / CSV file to upload
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Supports .xlsx, .csv (Max size 10MB)
                  </p>
                  <Button
                    label="Browse File"
                    variant="outlined"
                    className="mt-6"
                    onClick={() => fileInputRef.current?.click()}
                  />
                </>
              )}
            </div>

            <div className="text-sm text-gray-500 flex gap-2 items-center">
              <i className="pi pi-info-circle" />
              Please ensure your file matches the required template structure.
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-primary hover:underline ml-1 font-medium"
              >
                Download Template
              </button>
            </div>

            <div className="flex justify-between w-full max-w-2xl mt-4">
              <Button
                label="Previous"
                variant="outlined"
                onClick={handlePrev}
              />
              <Button
                label="Next Step"
                variant="primary"
                onClick={handleNext}
                disabled={!selectedFile}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-md flex items-center gap-3">
              <i className="pi pi-check-circle text-xl"></i>
              <div>
                <p className="font-semibold">File parsed successfully!</p>
                <p className="text-sm">Found 2 valid records to import.</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">
                      First Name
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-600">
                      Last Name
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-600">
                      Gender
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">Demo</td>
                    <td className="px-4 py-3">Imported</td>
                    <td className="px-4 py-3">demo.imported@example.com</td>
                    <td className="px-4 py-3">Male</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">Test</td>
                    <td className="px-4 py-3">Student</td>
                    <td className="px-4 py-3">test.student@example.com</td>
                    <td className="px-4 py-3">Female</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                label="Previous"
                variant="outlined"
                onClick={handlePrev}
                disabled={importing}
              />
              <Button
                label={importing ? 'Importing...' : 'Confirm & Import'}
                variant="primary"
                onClick={handleImport}
                isLoading={importing}
                icon="pi pi-check"
              />
            </div>
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
