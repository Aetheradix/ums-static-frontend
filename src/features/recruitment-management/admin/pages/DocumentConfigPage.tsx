import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  Checkbox,
  DropDownList,
  NumberBox,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DocumentConfig {
  id: number;
  documentName: string;
  designation: string;
  subject: string;
  priority: string;
  category: string;
  facultyType: string;
  sequence: number;
  isActive: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const DESIGNATIONS = [
  { label: 'Varg2 - Madhymik Shikshak', value: 'VARG2' },
  { label: 'Varg1 - Uchatar Madhymik', value: 'VARG1' },
  { label: 'Principal', value: 'PRINCIPAL' },
];

const SUBJECTS = [
  { label: 'Hindi - MS Teachers', value: 'HINDI_MS' },
  { label: 'English - MS Teachers', value: 'ENG_MS' },
  { label: 'Mathematics - MS Teachers', value: 'MATH_MS' },
  { label: 'Science - HS Teachers', value: 'SCI_HS' },
];

const PRIORITIES = [
  { label: 'Required', value: 'REQUIRED' },
  { label: 'Optional', value: 'OPTIONAL' },
];

const CATEGORIES = [
  { label: 'General', value: 'GEN' },
  { label: 'OBC', value: 'OBC' },
  { label: 'SC', value: 'SC' },
  { label: 'ST', value: 'ST' },
  { label: 'EWS', value: 'EWS' },
  { label: 'All', value: 'ALL' },
];

const FACULTY_TYPES = [
  { label: 'All', value: 'ALL' },
  { label: 'Regular', value: 'REGULAR' },
  { label: 'Contract', value: 'CONTRACT' },
];

const MOCK_DOCUMENTS: DocumentConfig[] = [
  {
    id: 1,
    documentName: '10th Marksheet',
    designation: 'Varg2 - Madhymik Shikshak',
    subject: 'Hindi - MS Teachers',
    priority: 'Required',
    category: 'All',
    facultyType: 'All',
    sequence: 1,
    isActive: true,
  },
  {
    id: 2,
    documentName: '12th Marksheet',
    designation: 'Varg2 - Madhymik Shikshak',
    subject: 'Hindi - MS Teachers',
    priority: 'Required',
    category: 'All',
    facultyType: 'All',
    sequence: 2,
    isActive: true,
  },
  {
    id: 3,
    documentName: 'Graduation Certificate',
    designation: 'Varg1 - Uchatar Madhymik',
    subject: 'Mathematics - MS Teachers',
    priority: 'Required',
    category: 'All',
    facultyType: 'Regular',
    sequence: 1,
    isActive: true,
  },
  {
    id: 4,
    documentName: 'OBC Certificate',
    designation: 'Varg2 - Madhymik Shikshak',
    subject: 'English - MS Teachers',
    priority: 'Optional',
    category: 'OBC',
    facultyType: 'All',
    sequence: 3,
    isActive: false,
  },
];

const EMPTY_FORM = {
  documentName: '',
  designation: '',
  subject: '',
  priority: '',
  category: '',
  facultyType: '',
  sequence: 1,
  isActive: true,
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DocumentConfigPage() {
  const [documents, setDocuments] = useState<DocumentConfig[]>(MOCK_DOCUMENTS);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowPopup(true);
  };

  const openEdit = (doc: DocumentConfig) => {
    setForm({
      documentName: doc.documentName,
      designation:
        DESIGNATIONS.find(d => d.label === doc.designation)?.value ?? '',
      subject: SUBJECTS.find(s => s.label === doc.subject)?.value ?? '',
      priority: PRIORITIES.find(p => p.label === doc.priority)?.value ?? '',
      category: CATEGORIES.find(c => c.label === doc.category)?.value ?? '',
      facultyType:
        FACULTY_TYPES.find(f => f.label === doc.facultyType)?.value ?? '',
      sequence: doc.sequence,
      isActive: doc.isActive,
    });
    setEditId(doc.id);
    setShowPopup(true);
  };

  const handleSave = () => {
    const designation =
      DESIGNATIONS.find(d => d.value === form.designation)?.label ?? '';
    const subject = SUBJECTS.find(s => s.value === form.subject)?.label ?? '';
    const priority =
      PRIORITIES.find(p => p.value === form.priority)?.label ?? '';
    const category =
      CATEGORIES.find(c => c.value === form.category)?.label ?? '';
    const facultyType =
      FACULTY_TYPES.find(f => f.value === form.facultyType)?.label ?? '';

    if (editId !== null) {
      setDocuments(prev =>
        prev.map(d =>
          d.id === editId
            ? {
                ...d,
                ...form,
                designation,
                subject,
                priority,
                category,
                facultyType,
              }
            : d
        )
      );
    } else {
      const newDoc: DocumentConfig = {
        id: Date.now(),
        documentName: form.documentName,
        designation,
        subject,
        priority,
        category,
        facultyType,
        sequence: form.sequence,
        isActive: form.isActive,
      };
      setDocuments(prev => [...prev, newDoc]);
    }

    setShowPopup(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const columns: Controls.ColumnProps<DocumentConfig>[] = [
    { field: 'documentName', header: 'Document Name' },
    { field: 'designation', header: 'Designation' },
    { field: 'subject', header: 'Subject' },
    { field: 'priority', header: 'Priority' },
    { field: 'category', header: 'Category' },
    { field: 'facultyType', header: 'Faculty Type' },
    { field: 'sequence', header: 'Sequence' },
    {
      header: 'Active',
      cell: (row: DocumentConfig) => (
        <span
          className={`font-semibold text-xs ${row.isActive ? 'text-emerald-500' : 'text-slate-500'}`}
        >
          {row.isActive ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: DocumentConfig) => (
        <Button
          label="Edit"
          icon="pencil"
          type="button"
          variant="outlined"
          onClick={() => openEdit(row)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Document Configuration"
      description="Define required documents for candidates per designation and subject."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin', to: '/recruitment-management/admin' },
        { label: 'Document Configuration' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard
          title="Candidate Document Setup"
          icon="description"
          headerAction={
            <Button
              label="Add Document"
              icon="plus"
              type="button"
              variant="success"
              onClick={openCreate}
            />
          }
        >
          <GridPanel
            data={documents}
            columns={columns}
            searchBox
            searchPlaceholder="Search documents..."
          />
        </FormCard>
      </div>

      {/* ── Create / Edit Popup ── */}
      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title={
          editId !== null
            ? 'Edit Candidate Document Setup'
            : 'Create Candidate Document Setup'
        }
        size="xl"
        footer={
          <div className="form-actions-container form-actions-right">
            <Button
              label="Reset"
              type="button"
              icon="refresh"
              variant="outlined"
              onClick={handleReset}
            />
            <Button
              label="Save"
              type="button"
              icon="save"
              variant="success"
              disabled={
                !form.documentName ||
                !form.designation ||
                !form.subject ||
                !form.priority ||
                !form.facultyType
              }
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid columns={4}>
          <TextBox
            id="doc-name"
            label="Candidate Document Name"
            required
            value={form.documentName}
            onChange={(val: string) =>
              setForm(f => ({ ...f, documentName: val }))
            }
            placeholder="e.g. 10Th Marksheet"
          />
          <DropDownList
            id="doc-designation"
            label="Designation"
            required
            data={DESIGNATIONS}
            textField="label"
            valueField="value"
            value={form.designation}
            defaultOptionText="Select Designation"
            onChange={v =>
              setForm(f => ({ ...f, designation: (v as string) ?? '' }))
            }
          />
          <DropDownList
            id="doc-subject"
            label="Subject"
            required
            data={SUBJECTS}
            textField="label"
            valueField="value"
            value={form.subject}
            defaultOptionText="Select Subject"
            onChange={v =>
              setForm(f => ({ ...f, subject: (v as string) ?? '' }))
            }
          />
          <DropDownList
            id="doc-priority"
            label="Priority"
            required
            data={PRIORITIES}
            textField="label"
            valueField="value"
            value={form.priority}
            defaultOptionText="Select Priority"
            onChange={v =>
              setForm(f => ({ ...f, priority: (v as string) ?? '' }))
            }
          />
        </FormGrid>

        <FormGrid columns={4}>
          <DropDownList
            id="doc-category"
            label="Category"
            data={CATEGORIES}
            textField="label"
            valueField="value"
            value={form.category}
            defaultOptionText="Select"
            onChange={v =>
              setForm(f => ({ ...f, category: (v as string) ?? '' }))
            }
          />
          <DropDownList
            id="doc-faculty-type"
            label="Faculty Type"
            required
            data={FACULTY_TYPES}
            textField="label"
            valueField="value"
            value={form.facultyType}
            defaultOptionText="Select Faculty Type"
            onChange={v =>
              setForm(f => ({ ...f, facultyType: (v as string) ?? '' }))
            }
          />
          <NumberBox
            id="doc-sequence"
            label="Sequence"
            required
            value={form.sequence}
            onChange={(v: number | null | undefined) =>
              setForm(f => ({ ...f, sequence: v ?? 1 }))
            }
            min={1}
          />
          <Checkbox
            id="doc-is-active"
            label="Is Active"
            checked={form.isActive}
            onChange={(v: boolean) => setForm(f => ({ ...f, isActive: v }))}
          />
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
