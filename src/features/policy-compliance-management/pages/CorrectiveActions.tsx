import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  FormActions,
  GridPanel,
  StatusBadge,
  PreviewField,
} from 'shared/new-components';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'shared/components/buttons';
import { INITIAL_CORRECTIVE_ACTIONS, type CorrectiveAction } from '../data';

export default function CorrectiveActions() {
  const [actions, setActions] = useState<CorrectiveAction[]>(
    INITIAL_CORRECTIVE_ACTIONS
  );
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    issue: '',
    rootCause: '',
    correctiveAction: '',
    preventiveAction: '',
    completionDate: null as Date | null,
    documents: '',
    submittedBy: '',
  });

  const resetForm = () => {
    setFormData({
      issue: '',
      rootCause: '',
      correctiveAction: '',
      preventiveAction: '',
      completionDate: null,
      documents: '',
      submittedBy: '',
    });
    setFormError('');
  };

  const handleCreate = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: CorrectiveAction) => {
    setFormData({
      issue: item.issue,
      rootCause: item.rootCause,
      correctiveAction: item.correctiveAction,
      preventiveAction: item.preventiveAction,
      completionDate: item.completionDate
        ? new Date(item.completionDate)
        : null,
      documents: item.documents.join(', '),
      submittedBy: item.submittedBy,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (
      !formData.submittedBy ||
      !formData.completionDate ||
      !formData.issue ||
      !formData.rootCause ||
      !formData.correctiveAction ||
      !formData.preventiveAction
    ) {
      setFormError('Please fill all required fields before saving.');
      return;
    }

    if (editingId) {
      setActions(prev =>
        prev.map(action =>
          action.id === editingId
            ? {
                ...action,
                issue: formData.issue,
                rootCause: formData.rootCause,
                correctiveAction: formData.correctiveAction,
                preventiveAction: formData.preventiveAction,
                completionDate: formData.completionDate
                  ? formData.completionDate.toISOString().split('T')[0]
                  : '',
                documents: formData.documents
                  .split(',')
                  .map(d => d.trim())
                  .filter(Boolean),
                submittedBy: formData.submittedBy,
              }
            : action
        )
      );
    } else {
      const newAction: CorrectiveAction = {
        id: `CAPA-${String(actions.length + 1).padStart(3, '0')}`,
        nonComplianceId: '',
        issue: formData.issue,
        rootCause: formData.rootCause,
        correctiveAction: formData.correctiveAction,
        preventiveAction: formData.preventiveAction,
        completionDate: formData.completionDate
          ? formData.completionDate.toISOString().split('T')[0]
          : '',
        documents: formData.documents
          .split(',')
          .map(d => d.trim())
          .filter(Boolean),
        status: 'Submitted',
        submittedBy: formData.submittedBy,
      };
      setActions(prev => [...prev, newAction]);
    }
    setShowForm(false);
    resetForm();
    setEditingId(null);
  };

  const handleView = (item: CorrectiveAction) => {
    setSelectedAction(item);
    setShowDetail(true);
  };

  return (
    <FormPage
      title="Corrective and Preventive Actions"
      description="Manage corrective and preventive actions for non-compliance issues"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Corrective Actions' },
      ]}
      headerAction={
        <Button label="Submit Action" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All Corrective Actions" icon="wrench">
        <GridPanel
          data={actions}
          columns={[
            { field: 'id', header: 'Action ID', width: '100px' },
            {
              field: 'issue',
              header: 'Issue',
              cell: (item: any) => (
                <span className="text-sm text-gray-700 truncate block max-w-48">
                  {item.issue}
                </span>
              ),
            },
            { field: 'submittedBy', header: 'Submitted By' },
            {
              field: 'completionDate',
              header: 'Completion Date',
              width: '130px',
              cell: (item: any) => {
                if (!item.completionDate) return '';
                const parts = item.completionDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.completionDate;
              },
            },
            {
              field: 'documents',
              header: 'Docs',
              width: '80px',
              cell: (item: any) => (
                <span className="text-sm text-gray-600">
                  {item.documents.length}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: '110px',
              cell: (item: any) => {
                const variant =
                  item.status === 'Verified' || item.status === 'Closed'
                    ? 'approved'
                    : item.status === 'Submitted'
                      ? 'pending'
                      : 'neutral';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '100px',
              cell: (item: any) => (
                <div className="flex items-center gap-2">
                  <button
                    className="text-amber-600 hover:text-amber-800 text-lg transition-colors p-1"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg transition-colors p-1"
                    onClick={() => handleView(item)}
                    title="View"
                  >
                    <i className="pi pi-eye"></i>
                  </button>
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search records..."
        />
      </FormCard>

      {/* ── Create / Edit Action Form ── */}
      <FormPopup
        title={
          editingId ? 'Edit Corrective Action' : 'Submit Corrective Action'
        }
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        footer={
          <FormActions
            onSave={handleSave}
            onReset={resetForm}
            saveLabel={editingId ? 'Save Changes' : 'Submit Action'}
          />
        }
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm flex items-center gap-2">
            <i className="pi pi-exclamation-circle"></i>
            {formError}
          </div>
        )}
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Submitted By <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.submittedBy}
              onChange={e =>
                setFormData({ ...formData, submittedBy: e.target.value })
              }
              placeholder="Enter name"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Completion Date <span className="text-red-500">*</span>
            </label>
            <Calendar
              value={formData.completionDate}
              onChange={e =>
                setFormData({
                  ...formData,
                  completionDate: e.value as Date,
                })
              }
              dateFormat="dd-mm-yy"
              placeholder="Select date"
              showIcon
              className="w-full"
            />
          </div>
        </FormGrid>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Issue <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={formData.issue}
              onChange={e =>
                setFormData({ ...formData, issue: e.target.value })
              }
              rows={2}
              placeholder="Describe the issue..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Root Cause <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={formData.rootCause}
              onChange={e =>
                setFormData({ ...formData, rootCause: e.target.value })
              }
              rows={2}
              placeholder="Root cause analysis..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Corrective Action <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={formData.correctiveAction}
              onChange={e =>
                setFormData({
                  ...formData,
                  correctiveAction: e.target.value,
                })
              }
              rows={2}
              placeholder="Corrective action taken..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Preventive Action <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={formData.preventiveAction}
              onChange={e =>
                setFormData({
                  ...formData,
                  preventiveAction: e.target.value,
                })
              }
              rows={2}
              placeholder="Preventive measures..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Supporting Documents (comma separated)
            </label>
            <InputText
              value={formData.documents}
              onChange={e =>
                setFormData({ ...formData, documents: e.target.value })
              }
              placeholder="e.g. report.pdf, evidence.zip"
              className="w-full"
            />
          </div>
        </div>
      </FormPopup>

      {/* ── Action Detail View ── */}
      <FormPopup
        title={`Action: ${selectedAction?.id || ''}`}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedAction(null);
        }}
      >
        {selectedAction && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <PreviewField
                label="Submitted By"
                value={selectedAction.submittedBy}
                className="border-none pb-0"
              />
              <PreviewField
                label="Completion Date"
                value={selectedAction.completionDate}
                className="border-none pb-0"
              />
              <PreviewField
                label="Status"
                className="border-none pb-0"
                value={
                  <StatusBadge
                    label={selectedAction.status}
                    variant={
                      selectedAction.status === 'Verified' ||
                      selectedAction.status === 'Closed'
                        ? 'approved'
                        : selectedAction.status === 'Submitted'
                          ? 'pending'
                          : 'neutral'
                    }
                  />
                }
              />
            </FormGrid>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Issue
              </span>
              <p className="text-sm text-red-700 bg-red-50 p-3 border border-red-100 rounded-lg mt-1">
                {selectedAction.issue}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Root Cause
              </span>
              <p className="text-sm text-amber-700 bg-amber-50 p-3 border border-amber-100 rounded-lg mt-1">
                {selectedAction.rootCause}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Corrective Action
              </span>
              <p className="text-sm text-green-700 bg-green-50 p-3 border border-green-100 rounded-lg mt-1">
                {selectedAction.correctiveAction}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Preventive Action
              </span>
              <p className="text-sm text-blue-700 bg-blue-50 p-3 border border-blue-100 rounded-lg mt-1">
                {selectedAction.preventiveAction}
              </p>
            </div>

            {selectedAction.documents.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                  Supporting Documents
                </span>
                <div className="space-y-2 mt-1">
                  {selectedAction.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg"
                    >
                      <i className="pi pi-file text-blue-500 text-lg"></i>
                      <span className="text-sm font-medium text-slate-800">
                        {doc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
