import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  Tabs,
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
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsParsed(false);
      setSelectedTest(null);
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
        <FormCard title="Upload Vacancy Detail" icon="cloud_upload">
          <FormGrid columns={3}>
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
          </FormGrid>

          <FormGrid columns={1}>
            <div className="max-w-md">
              <FileUpload
                id="vacancy-file"
                label="Upload Vacancy File"
                mode="file"
                required
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </div>
          </FormGrid>

          <div className="form-actions-container form-actions-right mt-4">
            <Button
              label="Reset"
              type="button"
              icon="refresh"
              variant="outlined"
              onClick={handleReset}
            />
            <Button
              label="Save Details"
              type="button"
              icon="save"
              variant="success"
              disabled={!isParsed || !selectedTest}
              onClick={handleSave}
              isLoading={isSaving}
            />
          </div>
        </FormCard>

        {/* ── Validation Results ── */}
        {isParsed && (
          <FormCard title="Validation Results" icon="list">
            <Tabs
              tabs={[
                {
                  title: `Valid Data (${MOCK_VALID.length})`,
                  content: (
                    <div className="pt-4">
                      <GridPanel data={MOCK_VALID} columns={validColumns} />
                    </div>
                  ),
                },
                {
                  title: `Invalid Data (${MOCK_INVALID.length})`,
                  content: (
                    <div className="pt-4">
                      <GridPanel data={MOCK_INVALID} columns={invalidColumns} />
                    </div>
                  ),
                },
              ]}
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
