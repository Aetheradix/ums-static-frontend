import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function HodReports() {
  return (
    <FormPage
      title="Department Reports"
      description="Generate department-level research output, completion rates and timeline delay reports."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Reports' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Scholars"
          value="4"
          icon="school"
          colorScheme="blue"
          subtitle="Active + Completed"
        />
        <StatCard
          title="On-Track"
          value="3"
          icon="check_circle"
          colorScheme="green"
          subtitle="Meeting milestones"
        />
        <StatCard
          title="Delayed"
          value="1"
          icon="warning"
          colorScheme="red"
          subtitle="Synopsis overdue"
        />
        <StatCard
          title="Completion Rate"
          value="85%"
          icon="emoji_events"
          colorScheme="teal"
          subtitle="Dept historical"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Available Reports">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            {[
              {
                name: 'Scholar Phase Summary Report',
                desc: 'All scholars with current phase and milestone status',
                color: '#3b82f6',
              },
              {
                name: 'Supervisor Workload Report',
                desc: 'Allocation vs capacity for all active supervisors',
                color: '#10b981',
              },
              {
                name: 'Research Output Report',
                desc: 'Publications, patents and research outputs by scholar',
                color: '#7c3aed',
              },
              {
                name: 'Timeline Compliance Report',
                desc: 'Scholars meeting vs missing milestone deadlines',
                color: '#f59e0b',
              },
              {
                name: 'Plagiarism Status Report',
                desc: 'Turnitin similarity scores for all scholars',
                color: '#ef4444',
              },
              {
                name: 'Completion History Report',
                desc: 'Year-wise PhD completion data (last 10 years)',
                color: '#0891b2',
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  borderLeft: `3px solid ${r.color}`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 700,
                      color: '#1f2937',
                    }}
                  >
                    {r.name}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    {r.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() =>
                      ToastService.success(`Generating ${r.name}...`)
                    }
                    style={{
                      padding: '0.25rem 0.625rem',
                      border: `1px solid ${r.color}`,
                      background: '#fff',
                      color: r.color,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.688rem',
                      fontWeight: 700,
                    }}
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      ToastService.success(`Exporting ${r.name} to Excel...`)
                    }
                    style={{
                      padding: '0.25rem 0.625rem',
                      border: '1px solid #16a34a',
                      background: '#fff',
                      color: '#16a34a',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.688rem',
                      fontWeight: 700,
                    }}
                  >
                    Excel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Generate Custom Report">
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
              >
                <option>Scholar Status Report</option>
                <option>Phase Wise Report</option>
                <option>Milestone Report</option>
                <option>Annual Research Report</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Academic Year
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>2025-26</option>
                <option>2024-25</option>
                <option>2023-24</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Filter by Status
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Scholars</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Overdue</option>
              </select>
            </div>
            <Button
              label="Generate Report"
              variant="primary"
              onClick={() => ToastService.success('Custom report generated!')}
            />
            <Button
              label="Export to Excel"
              variant="outlined"
              onClick={() => ToastService.success('Exported to Excel!')}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
