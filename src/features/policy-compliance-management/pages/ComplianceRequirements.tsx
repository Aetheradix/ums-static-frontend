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
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_COMPLIANCE_REQUIREMENTS,
  DEPARTMENT_OPTIONS,
  FREQUENCY_OPTIONS,
  APPLICABLE_TO_OPTIONS,
  type ComplianceRequirement,
} from '../data';

export default function ComplianceRequirements() {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>(
    INITIAL_COMPLIANCE_REQUIREMENTS
  );
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ComplianceRequirement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: '',
    department: '',
    applicableTo: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      frequency: '',
      department: '',
      applicableTo: '',
    });
    setEditing(null);
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: ComplianceRequirement) => {
    setEditing(item);
    setFormData({
      name: item.name,
      description: item.description,
      frequency: item.frequency,
      department: item.department,
      applicableTo: item.applicableTo,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editing) {
      setRequirements(prev =>
        prev.map(r => (r.id === editing.id ? { ...r, ...formData } : r))
      );
    } else {
      const newReq: ComplianceRequirement = {
        id: `COMP-${String(requirements.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setRequirements(prev => [...prev, newReq]);
    }
    setShowForm(false);
    resetForm();
  };

  const frequencyOptions = FREQUENCY_OPTIONS.map(f => ({ label: f, value: f }));
  const departmentOptions = DEPARTMENT_OPTIONS.map(d => ({
    label: d,
    value: d,
  }));
  const applicableOptions = APPLICABLE_TO_OPTIONS.map(a => ({
    label: a,
    value: a,
  }));

  return (
    <FormPage
      title="Compliance Requirements"
      description="Compliance Officer creates compliance activities with defined frequency"
      breadcrumbs={[
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Compliance Requirements' },
      ]}
      headerAction={
        <Button label="Create Compliance" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All Compliance Requirements" icon="assignment">
        <GridPanel
          data={requirements}
          columns={[
            { field: 'id', header: 'ID', width: '100px' },
            { field: 'name', header: 'Compliance Name' },
            { field: 'frequency', header: 'Frequency', width: '130px' },
            { field: 'department', header: 'Department' },
            { field: 'applicableTo', header: 'Applicable To', width: '120px' },
            {
              field: 'status',
              header: 'Status',
              width: '100px',
              cell: (item: any) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
            { field: 'createdDate', header: 'Created', width: '110px' },
            {
              field: 'actions',
              header: 'Actions',
              width: '100px',
              cell: (item: any) => (
                <button
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  onClick={() => handleEdit(item)}
                >
                  <i className="pi pi-pencil mr-1"></i>Edit
                </button>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search compliance requirements..."
        />
      </FormCard>

      {/* ── Create/Edit Form ── */}
      <FormPopup
        title={
          editing
            ? 'Edit Compliance Requirement'
            : 'Create Compliance Requirement'
        }
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Compliance Name *
            </label>
            <InputText
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter compliance name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Frequency *
            </label>
            <Dropdown
              value={formData.frequency}
              options={frequencyOptions}
              onChange={e => setFormData({ ...formData, frequency: e.value })}
              placeholder="Select frequency"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Department *
            </label>
            <Dropdown
              value={formData.department}
              options={departmentOptions}
              onChange={e => setFormData({ ...formData, department: e.value })}
              placeholder="Select department"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Applicable To *
            </label>
            <Dropdown
              value={formData.applicableTo}
              options={applicableOptions}
              onChange={e =>
                setFormData({ ...formData, applicableTo: e.value })
              }
              placeholder="Select applicable group"
            />
          </div>
        </FormGrid>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Description *
          </label>
          <InputTextarea
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            placeholder="Enter compliance description"
          />
        </div>
        <FormActions
          isEditMode={!!editing}
          onSave={handleSave}
          onReset={resetForm}
        />
      </FormPopup>
    </FormPage>
  );
}
