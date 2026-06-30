import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { progressReports } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Report = (typeof progressReports)[0];

export default function ProgressReports() {
  const [list, setList] = useState<Report[]>(
    progressReports.filter(r => r.scholarId === 'sch-1')
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [type, setType] = useState<'Monthly' | 'Quarterly' | 'Semester'>(
    'Semester'
  );
  const [period, setPeriod] = useState('');
  const [workCompleted, setWorkCompleted] = useState('');
  const [problemsFaced, setProblemsFaced] = useState('');
  const [futurePlan, setFuturePlan] = useState('');

  const reset = () => {
    setEditId(null);
    setType('Semester');
    setPeriod('');
    setWorkCompleted('');
    setProblemsFaced('');
    setFuturePlan('');
  };

  const handleEdit = (r: Report) => {
    setEditId(r.id);
    setType(r.type);
    setPeriod(r.period);
    setWorkCompleted(r.workCompleted);
    setProblemsFaced(r.problemsFaced);
    setFuturePlan(r.futurePlan);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(r => r.id !== id));
    ToastService.success('Progress report removed.');
  };

  const handleSave = () => {
    if (!period || !workCompleted) {
      ToastService.error('Period and Work Completed are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(r =>
          r.id === editId
            ? { ...r, type, period, workCompleted, problemsFaced, futurePlan }
            : r
        )
      );
      ToastService.success('Progress report updated.');
    } else {
      const newR: Report = {
        id: `pr-${Date.now()}`,
        scholarId: 'sch-1',
        type,
        period,
        workCompleted,
        problemsFaced,
        futurePlan,
        submittedOn: '30 Jun 2026',
        status: 'Submitted',
      };
      setList(prev => [newR, ...prev]);
      ToastService.success('Progress report submitted to supervisor.');
    }
    reset();
  };

  const statusColor: Record<string, string> = {
    Approved: 'approved',
    Submitted: 'submitted',
    Draft: 'draft',
    Returned: 'rejected',
  };

  return (
    <FormPage
      title="Progress Reports"
      description="Submit monthly, quarterly and semester research progress reports for supervisor evaluation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Progress Reports' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Submitted Progress Reports">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.type}</td>
                    <td>{r.period}</td>
                    <td>{r.submittedOn}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
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
                          onClick={() => handleDelete(r.id)}
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
          {list.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: '#9ca3af',
                padding: '2rem',
                fontSize: '0.875rem',
              }}
            >
              No progress reports submitted yet.
            </p>
          )}
        </FormCard>

        <FormCard
          title={editId ? 'Edit Progress Report' : 'Submit New Progress Report'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Report Type
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semester">Semester</option>
              </select>
            </div>
            <TextBox
              label="Period (e.g. Jan–Jun 2026)"
              value={period}
              onChange={setPeriod}
              required
            />
            <TextArea
              label="Research Work Completed"
              value={workCompleted}
              onChange={setWorkCompleted}
              required
            />
            <TextArea
              label="Problems Faced (if any)"
              value={problemsFaced}
              onChange={setProblemsFaced}
            />
            <TextArea
              label="Future Plan for Next Period"
              value={futurePlan}
              onChange={setFuturePlan}
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Report' : 'Submit Report'}
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
