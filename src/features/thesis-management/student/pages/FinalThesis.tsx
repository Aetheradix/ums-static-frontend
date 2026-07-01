import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function FinalThesis() {
  return (
    <FormPage
      title="Final Thesis Submission"
      description="Submit your consolidated final thesis PDF with declaration, publications and digital consent."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Final Thesis' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Thesis Status"
          value="Draft"
          icon="description"
          colorScheme="orange"
          subtitle="Not yet submitted"
        />
        <StatCard
          title="Publications Required"
          value="2 Minimum"
          icon="article"
          colorScheme="blue"
          subtitle="Scopus/WoS indexed"
        />
        <StatCard
          title="Plagiarism Cleared"
          value="8.5%"
          icon="verified_user"
          colorScheme="green"
          subtitle="Below 10% threshold"
        />
        <StatCard
          title="Expected Submission"
          value="Jun 2027"
          icon="calendar_month"
          colorScheme="purple"
          subtitle="Based on timeline"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Thesis Document Submission Form">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Number of Publications (Scopus/WoS Indexed)"
              placeholder="e.g. 3"
            />
            <TextBox
              label="Journal DOI / Link (Primary Publication)"
              placeholder="e.g. https://doi.org/10.1016/j.eswa.2026..."
            />
            <TextBox
              label="Co-Authors (Comma separated)"
              placeholder="e.g. Dr. S. Tanwani, Dr. P. Saxena"
            />

            <div
              style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '0.813rem',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '0.75rem',
                }}
              >
                Scholar's Digital Declaration
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {[
                  'I declare that the research work is original and free from unauthorized content.',
                  'I grant DAVV University licensing rights for institutional archive publishing.',
                  'I confirm that minimum 2 publications are accepted/published in indexed journals.',
                ].map((text, i) => (
                  <label
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'flex-start',
                      fontSize: '0.75rem',
                      color: '#4b5563',
                      cursor: 'pointer',
                    }}
                  >
                    <input type="checkbox" style={{ marginTop: 2 }} />
                    {text}
                  </label>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem',
                border: '2px dashed #cbd5e1',
                borderRadius: 10,
                textAlign: 'center',
                background: '#f8fafc',
              }}
            >
              <i
                className="pi pi-file-pdf"
                style={{ fontSize: '2.5rem', color: '#ef4444' }}
              />
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginTop: '0.5rem',
                }}
              >
                Upload Final Thesis PDF
              </p>
              <Button
                label="Browse Thesis File"
                variant="primary"
                onClick={() => ToastService.success('Thesis PDF selected!')}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => ToastService.success('Draft saved.')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                }}
              >
                Save Draft
              </button>
              <button
                onClick={() =>
                  ToastService.success(
                    'Final thesis submitted for supervisor review!'
                  )
                }
                style={{
                  flex: 2,
                  padding: '0.5rem',
                  background: '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                }}
              >
                Submit Final Thesis
              </button>
            </div>
          </div>
        </FormCard>

        <FormCard title="Pre-Submission Checklist">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              { item: 'Topic registration approved by supervisor', done: true },
              { item: 'Proposal passed plagiarism check (≤ 10%)', done: true },
              { item: 'Research Cell Code allocated', done: true },
              { item: '2+ Semester progress reports approved', done: true },
              { item: 'Synopsis seminar conducted', done: false },
              { item: '2+ indexed publications accepted', done: false },
              { item: 'Pre-submission seminar completed', done: false },
              { item: 'Supervisor NOC obtained', done: false },
              { item: 'Final plagiarism check (thesis full)', done: false },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  background: item.done ? '#f0fdf4' : '#f9fafb',
                  borderRadius: 6,
                  border: `1px solid ${item.done ? '#bbf7d0' : '#e5e7eb'}`,
                }}
              >
                <span style={{ fontSize: '0.875rem' }}>
                  {item.done ? '✅' : '⬜'}
                </span>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: item.done ? '#166534' : '#4b5563',
                    fontWeight: item.done ? 600 : 400,
                  }}
                >
                  {item.item}
                </p>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
