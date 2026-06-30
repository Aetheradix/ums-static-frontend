import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  UploadValidationTabs,
} from 'shared/new-components';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TESTS = [
  { label: 'Assistant Professor Recruitment 2025', value: 'DRV-2025-01' },
  { label: 'Lecturer Recruitment 2025', value: 'DRV-2025-02' },
];
const MOCK_VALID = [
  {
    testName: 'Assistant Professor Recruitment 2025',
    subject: 'Computer Science',
    district: 'Main Campus',
    division: 'Central',
    designation: 'Assistant Professor',
    districtVacancy: 0,
    divisionVacancy: 5,
  },
  {
    testName: 'Assistant Professor Recruitment 2025',
    subject: 'Physics',
    district: 'North Campus',
    division: 'Central',
    designation: 'Assistant Professor',
    districtVacancy: 2,
    divisionVacancy: 3,
  },
  {
    testName: 'Assistant Professor Recruitment 2025',
    subject: 'Mathematics',
    district: 'South Campus',
    division: 'Eastern',
    designation: 'Associate Professor',
    districtVacancy: 1,
    divisionVacancy: 2,
  },
];

const MOCK_INVALID = [
  {
    row: 4,
    subject: 'XYZ-Invalid',
    district: '',
    division: '',
    designation: '',
    error: 'Unknown subject code',
  },
  {
    row: 7,
    subject: 'Chemistry',
    district: 'UNKNOWN',
    division: 'Eastern',
    designation: '',
    error: 'Invalid district value',
  },
];

const validColumns: Controls.ColumnProps<(typeof MOCK_VALID)[0]>[] = [
  { field: 'testName', header: 'Test Name' },
  { field: 'subject', header: 'Department (Subject)' },
  { field: 'district', header: 'Campus (District)' },
  { field: 'division', header: 'Region (Division)' },
  { field: 'designation', header: 'Post' },
  { field: 'districtVacancy', header: 'Campus Level' },
  { field: 'divisionVacancy', header: 'Region Level' },
];

const invalidColumns: Controls.ColumnProps<(typeof MOCK_INVALID)[0]>[] = [
  { field: 'row', header: 'Row #' },
  { field: 'subject', header: 'Subject' },
  { field: 'district', header: 'District' },
  { field: 'designation', header: 'Post' },
  { field: 'error', header: 'Validation Error' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function VacancyUploadPage() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isParsed, setIsParsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const examName = selectedTest ? 'State Eligibility Test (SET)' : '';
  const examDates = selectedTest ? '01/04/2025 - 30/04/2025' : '';

  const handleFileChange = (f: File | null) => {
    if (f) setIsParsed(true);
    else setIsParsed(false);
  };

  const handleReset = () => {
    setSelectedTest(null);
    setIsParsed(false);
  };

  const handleSave = () => {
    if (!selectedTest) {
      ToastService.error('Please select a Test / Drive.');
      return;
    }
    if (!isParsed) {
      ToastService.error('Please upload and parse a Vacancy file.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsParsed(false);
      setSelectedTest(null);
      ToastService.success('Vacancy details saved successfully.');
    }, 1000);
  };

  return (
    <FormPage
      title="Vacancy Upload & Detail"
      description="Bulk import vacancy data linked to a specific test/drive. Tracks openings by department, campus, and post."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin', to: '/recruitment-management/admin' },
        { label: 'Vacancy Upload' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── Upload Form ── */}
        <FormCard title="Upload Vacancy File" icon="cloud_upload">
          <FormGrid columns={4}>
            <DropDownList
              id="vacancy-test-select"
              label="Test / Drive"
              required
              data={TESTS}
              textField="label"
              valueField="value"
              value={selectedTest}
              defaultOptionText="Select Test"
              onChange={v => setSelectedTest(v as string | null)}
            />
            <TextBox
              id="vacancy-exam-name"
              label="Exam Name"
              disabled
              value={examName}
              placeholder="Auto-populated"
            />
            <TextBox
              id="vacancy-exam-dates"
              label="Exam (From Date - To Date)"
              disabled
              value={examDates}
              placeholder="Auto-populated"
            />
            <FileUpload
              id="vacancy-file"
              label="Upload Vacancy File"
              mode="file"
              required
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
          </FormGrid>

          <div className="flex gap-3 mt-6">
            <Button
              label="Save Details"
              type="button"
              icon="save"
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
            />
            <Button
              label="Reset"
              type="button"
              icon="refresh"
              variant="outlined"
              onClick={handleReset}
            />
          </div>
        </FormCard>

        {/* ── Table / Validation Results ── */}
        <FormCard
          title="Vacancy Details"
          icon="fact_check"
          headerAction={
            <div className="flex items-center gap-2">
              <Button
                label="Download Template"
                icon="download"
                type="button"
                variant="outlined"
                onClick={() => ToastService.success('Template downloading…')}
              />
              <Button
                label="Upload Vacancy Details"
                icon="upload"
                type="button"
                variant="primary"
                onClick={() => ToastService.success('Upload dialog opening…')}
              />
            </div>
          }
        >
          <p className="text-[11px] text-slate-500 mb-4">
            * Download the template, fill in the vacancy details, and upload
            using the &apos;Upload Vacancy Details&apos; button.
          </p>

          {isParsed ? (
            <UploadValidationTabs
              isParsed={isParsed}
              validData={MOCK_VALID}
              validColumns={validColumns}
              invalidData={MOCK_INVALID}
              invalidColumns={invalidColumns}
            />
          ) : (
            <GridPanel
              data={MOCK_VALID}
              columns={validColumns}
              searchBox
              searchPlaceholder="Search by subject, district, designation..."
            />
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
