import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { scholars, supervisors } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function SupervisorAllocation() {
  const [allocations, setAllocations] = useState(
    scholars.map(s => ({
      scholarId: s.id,
      scholarName: s.name,
      supervisor: s.supervisor,
      coSupervisor: s.coSupervisor,
      phase: s.phase,
    }))
  );

  const handleChange = (
    scholarId: string,
    field: 'supervisor' | 'coSupervisor',
    value: string
  ) => {
    setAllocations(prev =>
      prev.map(a => (a.scholarId === scholarId ? { ...a, [field]: value } : a))
    );
  };

  const handleSave = (scholarName: string) => {
    ToastService.success(
      `Supervisor allocation saved for ${scholarName} and scholar notified.`
    );
  };

  const availableSupervisors = supervisors.filter(s => s.status === 'Active');

  return (
    <FormPage
      title="Supervisor Allocation"
      description="Assign and re-assign supervisors and co-supervisors to registered scholars."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Supervisor Allocation' },
      ]}
    >
      <FormCard title="Scholar–Supervisor Allocation Matrix">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Phase</th>
                <th>Primary Supervisor</th>
                <th>Co-Supervisor (Optional)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.scholarId}>
                  <td style={{ fontWeight: 700 }}>{a.scholarName}</td>
                  <td style={{ fontSize: '0.75rem' }}>{a.phase}</td>
                  <td>
                    <select
                      className="dbt-filter-select"
                      style={{ height: 32, width: '100%', fontSize: '0.75rem' }}
                      value={a.supervisor}
                      onChange={e =>
                        handleChange(a.scholarId, 'supervisor', e.target.value)
                      }
                    >
                      {availableSupervisors.map(sv => (
                        <option key={sv.id} value={sv.name}>
                          {sv.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="dbt-filter-select"
                      style={{ height: 32, width: '100%', fontSize: '0.75rem' }}
                      value={a.coSupervisor}
                      onChange={e =>
                        handleChange(
                          a.scholarId,
                          'coSupervisor',
                          e.target.value
                        )
                      }
                    >
                      <option value="">— None —</option>
                      {availableSupervisors.map(sv => (
                        <option key={sv.id} value={sv.name}>
                          {sv.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleSave(a.scholarName)}
                      style={{
                        padding: '0.25rem 0.625rem',
                        border: '1px solid #22c55e',
                        background: '#f0fdf4',
                        color: '#16a34a',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '0.688rem',
                        fontWeight: 700,
                      }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>

      <FormCard title="Supervisor Availability Summary">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Supervisor</th>
                <th>Designation</th>
                <th>Allocated</th>
                <th>Max Limit</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {availableSupervisors.map(sv => (
                <tr key={sv.id}>
                  <td style={{ fontWeight: 700 }}>{sv.name}</td>
                  <td style={{ fontSize: '0.75rem' }}>{sv.designation}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>
                    {sv.currentAllocation}
                  </td>
                  <td style={{ textAlign: 'center', color: '#6b7280' }}>
                    {sv.maxLimit}
                  </td>
                  <td>
                    <span
                      className={`dbt-status-pill ${sv.availability === 'Available' ? 'approved' : 'rejected'}`}
                    >
                      {sv.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
