import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function CellReports() {
  return (
    <FormPage
      title="Research Cell Operational Reports"
      description="Generate University Research Cell level reports for registrations, milestone statistics and publications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Reports' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Registered"
          value="4"
          icon="how_to_reg"
          colorScheme="blue"
          subtitle="PhD Scholars"
        />
        <StatCard
          title="Defenses Scheduled"
          value="1"
          icon="event"
          colorScheme="green"
          subtitle="This Quarter"
        />
        <StatCard
          title="Average Similarity"
          value="7.9%"
          icon="verified_user"
          colorScheme="teal"
          subtitle="Turnitin Checked"
        />
        <StatCard
          title="DOIs Registered"
          value="0"
          icon="link"
          colorScheme="purple"
          subtitle="Crossref Database"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Operational Reports List">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            {[
              {
                name: 'University-wide Scholar Enrollment Report',
                desc: 'Active scholars, registered domains, and guide allocations across all departments',
                color: '#3b82f6',
              },
              {
                name: 'Advisory Committee (RAC) Meeting Logs',
                desc: 'Consolidated list of meeting frequencies and notes by supervisor',
                color: '#10b981',
              },
              {
                name: 'Plagiarism Audit Clearance Report',
                desc: 'Similarity score compliance and turnitin submission histories',
                color: '#7c3aed',
              },
              {
                name: 'Jury Composition & Viva Schedules',
                desc: 'Scheduled defense calendars with examiner panel structures',
                color: '#f59e0b',
              },
              {
                name: 'Repository Publishing Status Report',
                desc: 'Thesis uploads to Shodhganga and assigned Crossref DOI handles',
                color: '#ef4444',
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
                      ToastService.success(`Generating ${r.name} PDF...`)
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

        <FormCard title="Operational Filters">
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
                Faculty/Department
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Departments</option>
                <option>School of Computer Science & IT</option>
                <option>School of Electronics</option>
                <option>School of Physics</option>
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
                Scholar Registration Batch
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Years</option>
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
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
                Research Progress Status
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Phases</option>
                <option>Proposal Approved</option>
                <option>Writing Thesis</option>
                <option>Synopsis Pending</option>
                <option>Viva Defense Scheduled</option>
              </select>
            </div>
            <Button
              label="Generate Custom Report"
              variant="primary"
              onClick={() =>
                ToastService.success('Operational custom report generated!')
              }
            />
            <Button
              label="Export to CSV"
              variant="outlined"
              onClick={() =>
                ToastService.success(
                  'Operational custom report exported to CSV!'
                )
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
