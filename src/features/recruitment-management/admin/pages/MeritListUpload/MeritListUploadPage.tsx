import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FileUpload,
  TextBox,
} from 'shared/components/forms';
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
    appNo: 'APP2025001',
    name: 'Priya Sharma',
    category: 'General',
    post: 'Assistant Professor',
    merit: 1,
  },
  {
    appNo: 'APP2025002',
    name: 'Amit Kumar',
    category: 'OBC',
    post: 'Assistant Professor',
    merit: 2,
  },
  {
    appNo: 'APP2025003',
    name: 'Sunita Yadav',
    category: 'OBC',
    post: 'Assistant Professor',
    merit: 3,
  },
];

const MOCK_INVALID = [
  {
    appNo: 'APP2025099',
    name: 'Unknown X',
    category: '',
    post: '',
    merit: 0,
    error: 'Missing category field',
  },
  {
    appNo: 'APP2025100',
    name: 'Bad Record',
    category: 'GEN',
    post: 'Prof',
    merit: 0,
    error: 'Invalid post value',
  },
];

const validColumns: Controls.ColumnProps<(typeof MOCK_VALID)[0]>[] = [
  { field: 'appNo', header: 'Application No.' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'post', header: 'Post Applied' },
  { field: 'merit', header: 'Merit Rank' },
];

const invalidColumns: Controls.ColumnProps<(typeof MOCK_INVALID)[0]>[] = [
  { field: 'appNo', header: 'Application No.' },
  { field: 'name', header: 'Name' },
  { field: 'error', header: 'Validation Error' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MeritListUploadPage() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [meritDate, setMeritDate] = useState<Date | undefined>(undefined);
  const [isParsed, setIsParsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-populated fields based on selected test
  const examName = selectedTest ? 'State Eligibility Test (SET)' : '';
  const examDates = selectedTest ? '01/04/2025 - 30/04/2025' : '';

  const handleFileChange = (f: File | null) => {
    if (f) {
      setIsParsed(true);
      ToastService.success(
        `File "${f.name}" parsed successfully. Review results before saving.`
      );
    } else {
      setIsParsed(false);
    }
  };

  const handleReset = () => {
    setSelectedTest(null);
    setMeritDate(undefined);
    setIsParsed(false);
    ToastService.success('Form reset successfully.');
  };

  const handleSave = () => {
    if (!selectedTest) {
      ToastService.error('Please select a Test / Drive.');
      return;
    }
    if (!meritDate) {
      ToastService.error('Please select a Merit List Date.');
      return;
    }
    if (!isParsed) {
      ToastService.error('Please upload and parse a Merit List file.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsParsed(false);
      setSelectedTest(null);
      setMeritDate(undefined);
      ToastService.success(
        'Merit list saved successfully. 148 valid records imported.'
      );
    }, 1000);
  };

  return (
    <FormPage
      title="Merit List Upload"
      description="Upload the final candidate merit list from the examination agency."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin', to: '/recruitment-management/admin' },
        { label: 'Merit List Upload' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── Upload Form ── */}
        <FormCard title="Upload Merit List File" icon="cloud_upload">
          <FormGrid columns={4}>
            <DropDownList
              id="test-select"
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
              id="exam-name"
              label="Exam Name"
              disabled
              value={examName}
              placeholder="Exam Name"
            />
            <TextBox
              id="exam-dates"
              label="Exam (From Date - To Date)"
              disabled
              value={examDates}
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
            />
            <DatePicker
              id="merit-date"
              label="Merit List Date"
              required
              value={meritDate}
              onChange={v => setMeritDate(v ?? undefined)}
            />
            <FileUpload
              id="merit-file"
              label="Upload Merit List File"
              mode="file"
              required
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
          </FormGrid>

          <div className="flex gap-3 mt-6">
            <Button
              label="Save Merit List"
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
          title="Candidate Merit List Details"
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
                label="Upload Merit List Details"
                icon="upload"
                type="button"
                variant="primary"
                onClick={() => ToastService.success('Upload dialog opening…')}
              />
            </div>
          }
        >
          <p className="text-[11px] text-slate-500 mb-4">
            * Download the template, fill in the candidate merit list details,
            and upload using the &apos;Upload Merit List Details&apos; button.
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
              searchPlaceholder="Search by name, roll no, application no..."
            />
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
