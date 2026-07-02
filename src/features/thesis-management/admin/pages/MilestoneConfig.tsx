import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface MilestoneConfiguration {
  id: string;
  stageName: string;
  dueMonths: number;
  sequenceIndex: number;
  mandatory: boolean;
}

const initialMilestones: MilestoneConfiguration[] = [
  {
    id: 'mc-1',
    stageName: 'Topic Registration',
    dueMonths: 3,
    sequenceIndex: 1,
    mandatory: true,
  },
  {
    id: 'mc-2',
    stageName: 'Proposal Submission',
    dueMonths: 6,
    sequenceIndex: 2,
    mandatory: true,
  },
  {
    id: 'mc-3',
    stageName: 'Plagiarism Check & URC Registration',
    dueMonths: 8,
    sequenceIndex: 3,
    mandatory: true,
  },
  {
    id: 'mc-4',
    stageName: 'Progress Report 1',
    dueMonths: 12,
    sequenceIndex: 4,
    mandatory: true,
  },
  {
    id: 'mc-5',
    stageName: 'Progress Report 2',
    dueMonths: 18,
    sequenceIndex: 5,
    mandatory: true,
  },
  {
    id: 'mc-6',
    stageName: 'Synopsis Seminar',
    dueMonths: 30,
    sequenceIndex: 6,
    mandatory: true,
  },
  {
    id: 'mc-7',
    stageName: 'Final Thesis Submission',
    dueMonths: 36,
    sequenceIndex: 7,
    mandatory: true,
  },
  {
    id: 'mc-8',
    stageName: 'Viva Defense',
    dueMonths: 42,
    sequenceIndex: 8,
    mandatory: true,
  },
];

export default function MilestoneConfig() {
  const [list, setList] = useState<MilestoneConfiguration[]>(initialMilestones);
  const [editId, setEditId] = useState<string | null>(null);
  const [stageName, setStageName] = useState('');
  const [dueMonths, setDueMonths] = useState('');
  const [sequenceIndex, setSequenceIndex] = useState('');
  const [mandatory, setMandatory] = useState(true);

  const reset = () => {
    setEditId(null);
    setStageName('');
    setDueMonths('');
    setSequenceIndex('');
    setMandatory(true);
  };

  const handleEdit = (m: MilestoneConfiguration) => {
    setEditId(m.id);
    setStageName(m.stageName);
    setDueMonths(String(m.dueMonths));
    setSequenceIndex(String(m.sequenceIndex));
    setMandatory(m.mandatory);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(m => m.id !== id));
    ToastService.success('Milestone configuration deleted.');
  };

  const handleSave = () => {
    if (!stageName || !dueMonths || !sequenceIndex) {
      ToastService.error('All fields are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(m =>
          m.id === editId
            ? {
                ...m,
                stageName,
                dueMonths: Number(dueMonths),
                sequenceIndex: Number(sequenceIndex),
                mandatory,
              }
            : m
        )
      );
      ToastService.success('Milestone configuration updated.');
    } else {
      const newM: MilestoneConfiguration = {
        id: `mc-${Date.now()}`,
        stageName,
        dueMonths: Number(dueMonths),
        sequenceIndex: Number(sequenceIndex),
        mandatory,
      };
      setList(prev => [...prev, newM]);
      ToastService.success('New milestone stage created.');
    }
    reset();
  };

  return (
    <FormPage
      title="Milestone Configuration"
      description="Configure standard research stages, timeline expectations, sequence indexes, and mandatory flags."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Milestone Config' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Configured Milestone Stages">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Seq</th>
                  <th>Stage Name</th>
                  <th>Timeline Limit</th>
                  <th>Mandatory</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list
                  .sort((a, b) => a.sequenceIndex - b.sequenceIndex)
                  .map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700, textAlign: 'center' }}>
                        {m.sequenceIndex}
                      </td>
                      <td style={{ fontWeight: 700 }}>{m.stageName}</td>
                      <td>{m.dueMonths} Months</td>
                      <td>
                        <span
                          className={`dbt-status-pill ${m.mandatory ? 'approved' : 'draft'}`}
                        >
                          {m.mandatory ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(m)}
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
                            onClick={() => handleDelete(m.id)}
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
          title={editId ? 'Edit Milestone Stage' : 'Create Milestone Stage'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Stage Name (e.g. Synopsis Seminar)"
              value={stageName}
              onChange={setStageName}
              required
            />
            <TextBox
              label="Timeline Deadline (Months from registration)"
              type="number"
              value={dueMonths}
              onChange={setDueMonths}
              required
            />
            <TextBox
              label="Sequence index (Ordering priority)"
              type="number"
              value={sequenceIndex}
              onChange={setSequenceIndex}
              required
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              <input
                type="checkbox"
                id="mandatoryCheck"
                checked={mandatory}
                onChange={e => setMandatory(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label
                htmlFor="mandatoryCheck"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Mandatory Stage
              </label>
            </div>
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Milestone' : 'Save Milestone'}
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
