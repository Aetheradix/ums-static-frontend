import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function Repository() {
  return (
    <FormPage
      title="Thesis Repository"
      description="Access your published thesis in DAVV Shodhganga repository with DOI details and download links."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Repository' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Repository Status"
          value="Published"
          icon="library_books"
          colorScheme="green"
          subtitle="Shodhganga & INFLIBNET"
        />
        <StatCard
          title="DOI Assigned"
          value="Yes"
          icon="link"
          colorScheme="blue"
          subtitle="Crossref registered"
        />
        <StatCard
          title="ORCID Linked"
          value="Yes"
          icon="badge"
          colorScheme="purple"
          subtitle="Linked to profile"
        />
        <StatCard
          title="Total Downloads"
          value="47"
          icon="download"
          colorScheme="teal"
          subtitle="Since publication"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Published Thesis Details">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div
              style={{
                padding: '1.25rem',
                background: '#eff6ff',
                borderRadius: 10,
                border: '1px solid #bfdbfe',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#1e40af',
                  marginBottom: '0.5rem',
                }}
              >
                Optimizing Low-Resource Translation for Central Indian Dialects
                using Hybrid Transformer Ensembles
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#374151',
                }}
              >
                <p>
                  <strong>Author:</strong> Rajesh Kumar Sahu
                </p>
                <p>
                  <strong>Supervisor:</strong> Dr. Sanjay Tanwani
                </p>
                <p>
                  <strong>Year:</strong> 2028
                </p>
                <p>
                  <strong>University:</strong> Devi Ahilya Vishwavidyalaya,
                  Indore
                </p>
                <p>
                  <strong>Department:</strong> School of Computer Science & IT
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}
            >
              {[
                {
                  label: 'Shodhganga Handle',
                  value: 'http://hdl.handle.net/10603/456789',
                  color: '#1e40af',
                },
                {
                  label: 'Crossref DOI',
                  value: 'https://doi.org/10.1109/DAVV.2028.456',
                  color: '#7c3aed',
                },
                {
                  label: 'ORCID iD',
                  value: 'https://orcid.org/0000-0002-1234-5678',
                  color: '#0891b2',
                },
                {
                  label: 'Google Scholar',
                  value: 'https://scholar.google.com/...',
                  color: '#16a34a',
                },
              ].map((link, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.625rem',
                    background: '#f8fafc',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: '#9ca3af',
                      marginBottom: 2,
                    }}
                  >
                    {link.label}
                  </p>
                  <a
                    href={link.value}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.625rem',
                      color: link.color,
                      fontWeight: 600,
                      wordBreak: 'break-all',
                    }}
                  >
                    {link.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </FormCard>

        <FormCard title="Download Certificates & Documents">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[
              {
                label: 'Degree Award Certificate',
                icon: '🎓',
                color: '#16a34a',
              },
              {
                label: 'Viva Result Certificate',
                icon: '🏆',
                color: '#1e40af',
              },
              {
                label: 'Thesis Submission Acknowledgement',
                icon: '📋',
                color: '#7c3aed',
              },
              { label: 'DOI Assignment Letter', icon: '🔗', color: '#0891b2' },
              {
                label: 'Turnitin Clearance Certificate',
                icon: '✅',
                color: '#059669',
              },
              {
                label: 'Repository Publication Receipt',
                icon: '📚',
                color: '#d97706',
              },
            ].map((doc, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.625rem 0.875rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{doc.icon}</span>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    {doc.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    ToastService.success(`Downloading ${doc.label}...`)
                  }
                  style={{
                    padding: '0.25rem 0.625rem',
                    border: `1px solid ${doc.color}`,
                    background: '#fff',
                    color: doc.color,
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '0.688rem',
                    fontWeight: 700,
                  }}
                >
                  Download
                </button>
              </div>
            ))}
            <Button
              label="Share Repository Link"
              variant="outlined"
              onClick={() => {
                navigator.clipboard?.writeText(
                  'http://hdl.handle.net/10603/456789'
                );
                ToastService.success('Repository link copied to clipboard!');
              }}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
