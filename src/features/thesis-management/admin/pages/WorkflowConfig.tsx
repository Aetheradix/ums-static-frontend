import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface WorkflowStep {
  id: string;
  stepName: string;
  role: string;
  sequence: number;
  autoEscalateDays: number;
  status: 'Active' | 'Inactive';
}

const initialSteps: WorkflowStep[] = [
  {
    id: 'ws-1',
    stepName: 'Guide Technical Endorsement',
    role: 'Supervisor',
    sequence: 1,
    autoEscalateDays: 14,
    status: 'Active',
  },
  {
    id: 'ws-2',
    stepName: 'Departmental Specialization Review',
    role: 'Head of Department',
    sequence: 2,
    autoEscalateDays: 10,
    status: 'Active',
  },
  {
    id: 'ws-3',
    stepName: 'URC Cell Document Verification',
    role: 'Research Cell Officer',
    sequence: 3,
    autoEscalateDays: 7,
    status: 'Active',
  },
  {
    id: 'ws-4',
    stepName: 'Defense Schedule Authorization',
    role: 'Dean Academic',
    sequence: 4,
    autoEscalateDays: 20,
    status: 'Inactive',
  },
];

export default function WorkflowConfig() {
  const [list, setList] = useState<WorkflowStep[]>(initialSteps);
  const [editId, setEditId] = useState<string | null>(null);
  const [stepName, setStepName] = useState('');
  const [role, setRole] = useState('Supervisor');
  const [sequence, setSequence] = useState('');
  const [autoEscalateDays, setAutoEscalateDays] = useState('');

  const reset = () => {
    setEditId(null);
    setStepName('');
    setRole('Supervisor');
    setSequence('');
    setAutoEscalateDays('');
  };

  const handleEdit = (w: WorkflowStep) => {
    setEditId(w.id);
    setStepName(w.stepName);
    setRole(w.role);
    setSequence(String(w.sequence));
    setAutoEscalateDays(String(w.autoEscalateDays));
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(w => w.id !== id));
    ToastService.success('Workflow step configuration deleted.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' }
          : w
      )
    );
    ToastService.success('Workflow step status updated.');
  };

  const handleSave = () => {
    if (!stepName || !sequence || !autoEscalateDays) {
      ToastService.error('All fields are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(w =>
          w.id === editId
            ? {
                ...w,
                stepName,
                role,
                sequence: Number(sequence),
                autoEscalateDays: Number(autoEscalateDays),
              }
            : w
        )
      );
      ToastService.success('Workflow configuration step updated.');
    } else {
      const newW: WorkflowStep = {
        id: `ws-${Date.now()}`,
        stepName,
        role,
        sequence: Number(sequence),
        autoEscalateDays: Number(autoEscalateDays),
        status: 'Active',
      };
      setList(prev => [...prev, newW]);
      ToastService.success('New workflow step created.');
    }
    reset();
  };

  return (
    <FormPage
      title="Workflow Configuration"
      description="Define approval flow steps, actor roles, sequence constraints and escalation periods."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Workflow Config' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Approval Workflow Steps">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Seq</th>
                  <th>Step Name</th>
                  <th>Actor Role</th>
                  <th>SLA Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list
                  .sort((a, b) => a.sequence - b.sequence)
                  .map(w => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 700, textAlign: 'center' }}>
                        {w.sequence}
                      </td>
                      <td style={{ fontWeight: 700 }}>{w.stepName}</td>
                      <td>{w.role}</td>
                      <td>{w.autoEscalateDays} Days</td>
                      <td>
                        <span
                          className={`dbt-status-pill ${w.status === 'Active' ? 'approved' : 'draft'}`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(w)}
                            style={{
                              padding: '0.2rem 0.5rem',
                              border: '1px solid #3b82f6',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: '0.688rem',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggle(w.id)}
                            style={{
                              padding: '0.2rem 0.5rem',
                              border: '1px solid #f59e0b',
                              background: '#fffbeb',
                              color: '#d97706',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: '0.688rem',
                            }}
                          >
                            {w.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(w.id)}
                            style={{
                              padding: '0.2rem 0.5rem',
                              border: '1px solid #ef4444',
                              background: '#fff',
                              color: '#b91c1c',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: '0.688rem',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard
          title={editId ? 'Edit Workflow Step' : 'Create Approval Step'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Step Name"
              value={stepName}
              onChange={setStepName}
              required
            />
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Actor Role
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="Supervisor">Supervisor</option>
                <option value="Head of Department">Head of Department</option>
                <option value="Research Cell Officer">
                  Research Cell Officer
                </option>
                <option value="Dean Academic">Dean Academic</option>
              </select>
            </div>
            <TextBox
              label="Sequence Level"
              type="number"
              value={sequence}
              onChange={setSequence}
              required
            />
            <TextBox
              label="SLA Period (Auto-escalation days)"
              type="number"
              value={autoEscalateDays}
              onChange={setAutoEscalateDays}
              required
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Step' : 'Save Step'}
                variant="primary"
                onClick={handleSave}
              />
              {editId && (
                <Button label="Cancel" variant="outlined" onClick={reset} />
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
