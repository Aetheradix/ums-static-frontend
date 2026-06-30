import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  FormActions,
  GridPanel,
  StatusBadge,
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
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = () => {
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
    setShowForm(false);
    resetForm();
  };

  const handleView = (item: CorrectiveAction) => {
    setSelectedAction(item);
    setShowDetail(true);
  };

  return (
    <FormPage
      title="Corrective Actions (CAPA)"
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
        <Button label="Submit CAPA" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All CAPA Records" icon="build">
        <GridPanel
          data={actions}
          columns={[
            { field: 'id', header: 'CAPA ID', width: '100px' },
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
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => handleView(item)}
                >
                  <i className="pi pi-eye mr-1"></i>View
                </button>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search CAPA records..."
        />
      </FormCard>

      {/* ── Submit CAPA Form ── */}
      <FormPopup
        title="Submit Corrective Action (CAPA)"
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Submitted By *
            </label>
            <InputText
              value={formData.submittedBy}
              onChange={e =>
                setFormData({ ...formData, submittedBy: e.target.value })
              }
              placeholder="Enter name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Completion Date *
            </label>
            <Calendar
              value={formData.completionDate}
              onChange={e =>
                setFormData({
                  ...formData,
                  completionDate: e.value as Date,
                })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select date"
              showIcon
            />
          </div>
        </FormGrid>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Issue *
            </label>
            <InputTextarea
              value={formData.issue}
              onChange={e =>
                setFormData({ ...formData, issue: e.target.value })
              }
              rows={2}
              placeholder="Describe the issue..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Root Cause *
            </label>
            <InputTextarea
              value={formData.rootCause}
              onChange={e =>
                setFormData({ ...formData, rootCause: e.target.value })
              }
              rows={2}
              placeholder="Root cause analysis..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Corrective Action *
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
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Preventive Action *
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
            />
          </div>
        </div>
        <FormActions
          onSave={handleSave}
          onReset={resetForm}
          saveLabel="Submit CAPA"
        />
      </FormPopup>

      {/* ── CAPA Detail View ── */}
      <FormPopup
        title={`CAPA: ${selectedAction?.id || ''}`}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedAction(null);
        }}
      >
        {selectedAction && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Submitted By
                </span>
                <span className="text-sm font-medium">
                  {selectedAction.submittedBy}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Completion Date
                </span>
                <span className="text-sm font-medium">
                  {selectedAction.completionDate}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </span>
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
              </div>
            </FormGrid>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Issue
              </span>
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                {selectedAction.issue}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Root Cause
              </span>
              <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                {selectedAction.rootCause}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Corrective Action
              </span>
              <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                {selectedAction.correctiveAction}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Preventive Action
              </span>
              <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                {selectedAction.preventiveAction}
              </p>
            </div>

            {selectedAction.documents.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Supporting Documents
                </span>
                {selectedAction.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <i className="pi pi-file text-blue-500"></i>
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
