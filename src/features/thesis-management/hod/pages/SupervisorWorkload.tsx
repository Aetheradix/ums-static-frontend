import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { supervisors } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function SupervisorWorkload() {
  const available = supervisors.filter(
    s => s.status === 'Active' && s.currentAllocation < s.maxLimit
  ).length;
  const full = supervisors.filter(
    s => s.currentAllocation >= s.maxLimit
  ).length;
  const inactive = supervisors.filter(s => s.status === 'Inactive').length;

  return (
    <FormPage
      title="Supervisor Workload"
      description="Monitor supervisor allocation versus maximum allowed PhD scholars limit and availability status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Supervisor Workload' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Supervisors"
          value={supervisors.length}
          icon="groups"
          colorScheme="blue"
          subtitle="Registered in department"
        />
        <StatCard
          title="Available"
          value={available}
          icon="check_circle"
          colorScheme="green"
          subtitle="Can take more scholars"
        />
        <StatCard
          title="Fully Allocated"
          value={full}
          icon="block"
          colorScheme="red"
          subtitle="At maximum capacity"
        />
        <StatCard
          title="Inactive"
          value={inactive}
          icon="person_off"
          subtitle="Not currently active"
        />
      </div>

      <FormCard title="Supervisor Allocation Matrix">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Supervisor</th>
                <th>Designation</th>
                <th>Specialization</th>
                <th>Allocated</th>
                <th>Max Limit</th>
                <th>Capacity Bar</th>
                <th>Status</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map(s => {
                const pct = Math.round(
                  (s.currentAllocation / s.maxLimit) * 100
                );
                const barColor =
                  pct >= 100 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#22c55e';
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td style={{ fontSize: '0.75rem' }}>{s.designation}</td>
                    <td style={{ fontSize: '0.75rem' }}>{s.specialization}</td>
                    <td style={{ fontWeight: 700, textAlign: 'center' }}>
                      {s.currentAllocation}
                    </td>
                    <td style={{ textAlign: 'center', color: '#6b7280' }}>
                      {s.maxLimit}
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          minWidth: 100,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 8,
                            background: '#e5e7eb',
                            borderRadius: 4,
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.min(pct, 100)}%`,
                              background: barColor,
                              borderRadius: 4,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '0.688rem',
                            fontWeight: 700,
                            color: barColor,
                            minWidth: 32,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${s.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${s.availability === 'Available' ? 'submitted' : 'rejected'}`}
                      >
                        {s.availability}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
