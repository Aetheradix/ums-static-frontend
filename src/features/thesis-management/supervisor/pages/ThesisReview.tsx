import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function ThesisReview() {
  return (
    <FormPage
      title="Thesis Review"
      description="Conduct chapter-by-chapter technical review of the final thesis before clearance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Thesis Review' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Chapter-wise Review Checklist">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            {[
              {
                chapter: 'Chapter 1: Introduction & Motivation',
                status: 'Approved',
                remarks: 'Well written. Clear motivation and scope.',
              },
              {
                chapter: 'Chapter 2: Literature Review',
                status: 'Approved',
                remarks: 'Comprehensive with 70+ references.',
              },
              {
                chapter: 'Chapter 3: Research Methodology',
                status: 'Revision Needed',
                remarks: 'Add ablation study for tokenizer configurations.',
              },
              {
                chapter: 'Chapter 4: Experiments & Results',
                status: 'Under Review',
                remarks: '',
              },
              {
                chapter: 'Chapter 5: Conclusion & Future Scope',
                status: 'Pending',
                remarks: '',
              },
              {
                chapter: 'Appendix & Bibliography',
                status: 'Pending',
                remarks: '',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem',
                  background:
                    item.status === 'Approved'
                      ? '#f0fdf4'
                      : item.status === 'Revision Needed'
                        ? '#fffbeb'
                        : '#f9fafb',
                  borderRadius: 8,
                  border: `1px solid ${item.status === 'Approved' ? '#bbf7d0' : item.status === 'Revision Needed' ? '#fde68a' : '#e5e7eb'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 700,
                      color: '#1f2937',
                    }}
                  >
                    {item.chapter}
                  </p>
                  <span
                    className={`dbt-status-pill ${item.status === 'Approved' ? 'approved' : item.status === 'Revision Needed' ? 'draft' : 'submitted'}`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.remarks && (
                  <p
                    style={{
                      fontSize: '0.688rem',
                      color: '#6b7280',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Final Thesis Clearance">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                padding: '0.875rem',
                background: '#eff6ff',
                borderRadius: 8,
                border: '1px solid #bfdbfe',
              }}
            >
              <p
                style={{
                  fontSize: '0.813rem',
                  fontWeight: 700,
                  color: '#1e40af',
                  marginBottom: 4,
                }}
              >
                Scholar: Rajesh Kumar Sahu
              </p>
              <p style={{ fontSize: '0.75rem', color: '#374151' }}>
                Thesis: "Optimizing Low-Resource Translation for Central Indian
                Dialects"
              </p>
              <p
                style={{ fontSize: '0.688rem', color: '#6b7280', marginTop: 4 }}
              >
                Submitted: 15 Jun 2026 · Pages: 218 · Similarity: 8.5%
              </p>
            </div>
            <TextArea
              label="Overall Supervisor Clearance Note"
              onChange={() => {}}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Button
                label="✓ Grant Clearance — Forward to URC"
                variant="primary"
                onClick={() =>
                  ToastService.success(
                    'Thesis clearance granted. URC Cell notified!'
                  )
                }
              />
              <Button
                label="↩ Request Chapter Revisions"
                variant="outlined"
                onClick={() =>
                  ToastService.success('Revision request sent to scholar.')
                }
              />
              <button
                type="button"
                onClick={() =>
                  ToastService.success('Downloading thesis PDF...')
                }
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                  color: '#374151',
                }}
              >
                📥 Download Thesis PDF
              </button>
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
