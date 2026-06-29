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
  Tabs,
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
        <FormCard title="Upload Candidate Merit List" icon="upload">
          <FormGrid columns={4}>
            <DropDownList
              id="test-select"
              label="Test"
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
              label="Exam"
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
          </FormGrid>

          <FormGrid columns={1}>
            <div className="max-w-md">
              <FileUpload
                id="merit-file"
                label="Upload Merit List File"
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
              label="Save Merit List"
              type="button"
              icon="save"
              variant="success"
              disabled={!isParsed || !selectedTest || !meritDate}
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
