import { useState } from 'react';
import { FormCard, FormPage, FormPopup, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, DatePicker } from 'shared/components/forms';
import GridPanel from 'shared/new-components/GridPanel';
import { ToastService } from 'services';

// Mock Colleges
const dummyColleges = [
  {
    id: 1,
    name: 'Global Institute of Technology',
    code: 'GIT101',
    applicationNo: 'APP-74921',
  },
  {
    id: 2,
    name: 'National Science College',
    code: 'NSC102',
    applicationNo: 'APP-18239',
  },
  {
    id: 3,
    name: 'Sunrise Commerce Academy',
    code: 'SCA103',
    applicationNo: 'APP-90234',
  },
  {
    id: 4,
    name: 'Pioneer Engineering College',
    code: 'PEC104',
    applicationNo: 'APP-48231',
  },
  {
    id: 5,
    name: 'Govt Engineering College',
    code: 'GEC105',
    applicationNo: 'APP-33921',
  },
];

// Mock Inspection Reports
const INITIAL_REPORTS = [
  {
    id: 1,
    collegeName: 'Global Institute of Technology',
    applicationNo: 'APP-74921',
    inspectionDate: new Date('2026-07-15'),
    committeeMembers: 'Dr. John Doe, Prof. Jane Smith',
    fileNames: ['GIT101_Inspection_Report.pdf', 'GIT101_Site_Photos.pdf'],
  },
  {
    id: 2,
    collegeName: 'National Science College',
    applicationNo: 'APP-18239',
    inspectionDate: new Date('2026-07-20'),
    committeeMembers: 'Dr. R. K. Verma, Prof. S. Sen',
    fileNames: ['NSC102_Inspection_Report.pdf'],
  },
];

export default function InspectionCommitteeList() {
  const [data, setData] = useState(INITIAL_REPORTS);
  const [showPopup, setShowPopup] = useState(false);

  // Form states
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null
  );
  const [applicationNumber, setApplicationNumber] = useState('');
  const [inspectionDate, setInspectionDate] = useState<Date | undefined>(
    undefined
  );
  const [committeeMembers, setCommitteeMembers] = useState('');
  const [inspectionFiles, setInspectionFiles] = useState<File[]>([]);

  const handleOpenPopup = () => {
    setSelectedCollegeId(null);
    setApplicationNumber('');
    setInspectionDate(undefined);
    setCommitteeMembers('');
    setInspectionFiles([]);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    ToastService.success('Inspection report deleted successfully.');
  };

  const handleSave = () => {
    if (!selectedCollegeId) {
      ToastService.error('Please select a college.');
      return;
    }
    if (!inspectionDate) {
      ToastService.error('Please select an inspection date.');
      return;
    }
    if (!committeeMembers.trim()) {
      ToastService.error('Please enter committee members.');
      return;
    }
    if (inspectionFiles.length === 0) {
      ToastService.error('Please upload at least one inspection document.');
      return;
    }

    const college = dummyColleges.find(c => c.id === selectedCollegeId);
    if (!college) return;

    const newReport = {
      id: Date.now(),
      collegeName: college.name,
      applicationNo: college.applicationNo,
      inspectionDate: inspectionDate,
      committeeMembers: committeeMembers,
      fileNames: inspectionFiles.map(f => f.name),
    };

    setData(prev => [newReport, ...prev]);
    ToastService.success('Inspection reports uploaded successfully.');
    handleClosePopup();
  };

  return (
    <FormPage
      title="Inspection Committee Uploads"
      description="Upload and view college physical inspection report documents."
    >
      <FormCard
        title="Uploaded Inspection Reports"
        headerAction={
          <Button
            variant="primary"
            onClick={handleOpenPopup}
            label="Upload Report"
            icon="pi pi-upload"
          />
        }
      >
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search colleges..."
          searchFields={['collegeName', 'applicationNo']}
          emptyMessage="No inspection reports found."
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '60px',
              sortable: false,
            },
            {
              field: 'collegeName',
              header: 'College Name',
              sortable: true,
            },
            {
              field: 'applicationNo',
              header: 'Application Number',
              sortable: true,
            },
            {
              field: 'inspectionDate',
              header: 'Inspection Date',
              sortable: true,
              cell: item => (
                <span>
                  {item.inspectionDate
                    ? new Date(item.inspectionDate).toLocaleDateString()
                    : '-'}
                </span>
              ),
            },
            {
              field: 'committeeMembers',
              header: 'Committee Members',
            },
            {
              field: 'fileNames',
              header: 'Report Documents',
              cell: item => (
                <div className="flex flex-col gap-1.5">
                  {item.fileNames.map((name: string, index: number) => (
                    <a
                      key={index}
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        ToastService.success(`Downloading ${name}...`);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5"
                    >
                      <i className="pi pi-file-pdf text-red-500 text-base" />
                      <span>{name}</span>
                    </a>
                  ))}
                </div>
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '120px',
              cell: item => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                    icon="pi pi-trash"
                    label="Delete"
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={handleClosePopup}
        title="Upload Inspection Report"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="outlined"
              onClick={handleClosePopup}
              label="Cancel"
            />
            <Button
              variant="primary"
              onClick={handleSave}
              label="Save"
              icon="pi pi-check"
            />
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-5">
          <FormGrid columns={2}>
            <DropDownList
              label="Select College"
              defaultOptionText="Select College"
              placeholder="Select College"
              data={dummyColleges}
              textField="name"
              valueField="id"
              value={selectedCollegeId}
              onChange={val => {
                const collegeId = val as number;
                setSelectedCollegeId(collegeId);
                const college = dummyColleges.find(c => c.id === collegeId);
                if (college) {
                  setApplicationNumber(college.applicationNo);
                } else {
                  setApplicationNumber('');
                }
              }}
              required
            />

            <TextBox
              label="Application Number"
              value={applicationNumber}
              readOnly
              placeholder="Application number will auto-fill"
            />
          </FormGrid>

          <FormGrid columns={2}>
            <DatePicker
              label="Inspection Date"
              placeholder="DD/MM/YYYY"
              value={inspectionDate}
              onChange={val => setInspectionDate(val || undefined)}
              maxDate={new Date()}
              required
            />

            <TextBox
              label="Inspection Committee Members"
              placeholder="Enter names of committee members (comma separated)"
              value={committeeMembers}
              onChange={val => setCommitteeMembers(val)}
              required
            />
          </FormGrid>

          {/* Multiple File Upload Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Attach Scanned copy of Inspection Reports (PDF, JPEG, PNG){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={e => {
                  if (e.target.files) {
                    const filesArray = Array.from(e.target.files);
                    setInspectionFiles(prev => [...prev, ...filesArray]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <i className="pi pi-cloud-upload text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Drag & drop files here or{' '}
                <span className="text-blue-600 hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: PDF, Images (Max 2MB per file)
              </p>
            </div>

            {/* List of currently selected files to upload */}
            {inspectionFiles.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 border border-gray-200 rounded-lg p-3 bg-white max-h-60 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Selected Files ({inspectionFiles.length})
                </p>
                {inspectionFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <i
                        className={
                          file.type === 'application/pdf'
                            ? 'pi pi-file-pdf text-red-500'
                            : 'pi pi-image text-blue-500'
                        }
                      />
                      <span className="font-medium text-gray-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="text"
                      icon="pi pi-times"
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={() =>
                        setInspectionFiles(prev =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
