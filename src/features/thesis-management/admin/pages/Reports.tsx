import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function AdminReports() {
  return (
    <FormPage
      title="Admin System-wide Reports"
      description="Generate and analyze system-wide PhD research statistics, supervisor loads and completion timelines."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Reports' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Registered"
          value="4"
          icon="school"
          colorScheme="blue"
          subtitle="PhD scholars active"
        />
        <StatCard
          title="On-time Ratio"
          value="75.0%"
          icon="check_circle"
          colorScheme="green"
          subtitle="Milestone compliance"
        />
        <StatCard
          title="Supervisors Loading"
          value="65.2%"
          icon="groups"
          colorScheme="purple"
          subtitle="Avg guide loading capacity"
        />
        <StatCard
          title="Publications"
          value="18"
          icon="article"
          colorScheme="teal"
          subtitle="Total Scopus/WoS indexed"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="System-wide Master Reports">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            {[
              {
                name: 'PhD Milestone Compliance Analytics',
                desc: 'Detailed report showing scholars lagging behind milestones sequence limits',
                color: '#ef4444',
              },
              {
                name: 'Supervisor Guide Capacities Log',
                desc: 'Faculty-wise distribution of supervisor limits vs allocated loads',
                color: '#10b981',
              },
              {
                name: 'Research Area Output Metrics',
                desc: 'Specialization-wise publications count and impact index summary',
                color: '#7c3aed',
              },
              {
                name: 'Turnitin Similarity Audit Trails',
                desc: 'Historical similarity index check records across all proposals',
                color: '#3b82f6',
              },
              {
                name: 'Crossref DOI Deposit Registry Audit',
                desc: 'Success and error logs of Crossref metadata transfers',
                color: '#f59e0b',
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

        <FormCard title="Generate Dynamic Audit Report">
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
                Degree Program Filter
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Programs</option>
                <option>Doctor of Philosophy (Ph.D.)</option>
                <option>Master of Philosophy (M.Phil.)</option>
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
                Specialization Domain Filter
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Domains</option>
                <option>Artificial Intelligence & NLP</option>
                <option>Cyber Security & Cloud</option>
                <option>Deep Learning & Vision</option>
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
                Compliance Status Filter
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option>All Compliance States</option>
                <option>On-Track</option>
                <option>Delayed & Overdue</option>
                <option>Jury Panel Scheduled</option>
              </select>
            </div>
            <Button
              label="Generate Custom Audit PDF"
              variant="primary"
              onClick={() =>
                ToastService.success('Admin dynamic report generated!')
              }
            />
            <Button
              label="Export to CSV"
              variant="outlined"
              onClick={() =>
                ToastService.success('Admin dynamic CSV exported!')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
