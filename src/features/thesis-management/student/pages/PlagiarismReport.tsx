import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

const ME = scholars[0];

export default function PlagiarismReport() {
  const similarity = ME.similarity;
  const isPass = similarity <= 10;

  return (
    <FormPage
      title="Plagiarism Report"
      description="Turnitin similarity verification report for your submitted research proposal."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Plagiarism Report' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Similarity Index"
          value={`${similarity}%`}
          icon="verified_user"
          colorScheme={isPass ? 'green' : 'red'}
          subtitle={isPass ? 'Below Threshold ✓' : 'Above Threshold ✗'}
        />
        <StatCard
          title="University Threshold"
          value="10.0%"
          icon="rule"
          colorScheme="blue"
          subtitle="Max allowed similarity"
        />
        <StatCard
          title="Verification Engine"
          value="Turnitin"
          icon="security"
          colorScheme="purple"
          subtitle="iThenticate API"
        />
        <StatCard
          title="Checked On"
          value="12 Mar 2025"
          icon="event"
          colorScheme="teal"
          subtitle="Research Cell Officer"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Similarity Score Breakdown">
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                margin: '0 auto',
                background: `conic-gradient(${isPass ? '#22c55e' : '#ef4444'} ${similarity * 3.6}deg, #e5e7eb ${similarity * 3.6}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: isPass ? '#16a34a' : '#dc2626',
                  }}
                >
                  {similarity}%
                </span>
                <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                  Similarity
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <span
                className={`dbt-status-pill ${isPass ? 'approved' : 'rejected'}`}
                style={{ fontSize: '0.875rem', padding: '0.375rem 1rem' }}
              >
                {isPass
                  ? '✓ Proposal Cleared for Submission'
                  : '✗ Revision Required — Above Threshold'}
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Report Details & Breakdown">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.813rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: 6,
              }}
            >
              <span style={{ color: '#6b7280' }}>Matching Journals/Books</span>
              <span style={{ fontWeight: 700 }}>3.2%</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: 6,
              }}
            >
              <span style={{ color: '#6b7280' }}>Internet Sources</span>
              <span style={{ fontWeight: 700 }}>2.8%</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: 6,
              }}
            >
              <span style={{ color: '#6b7280' }}>Student Papers Overlap</span>
              <span style={{ fontWeight: 700 }}>1.1%</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: 6,
              }}
            >
              <span style={{ color: '#6b7280' }}>DAVV Repository</span>
              <span style={{ fontWeight: 700 }}>0.0%</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: 6,
              }}
            >
              <span style={{ color: '#6b7280' }}>Excluded (Quotes & Refs)</span>
              <span style={{ fontWeight: 700 }}>1.4%</span>
            </div>
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: isPass ? '#f0fdf4' : '#fef2f2',
                borderRadius: 6,
                border: `1px solid ${isPass ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isPass ? '#15803d' : '#b91c1c',
                }}
              >
                Officer Remarks:
              </p>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: isPass ? '#166534' : '#991b1b',
                  marginTop: 2,
                }}
              >
                {isPass
                  ? 'Proposal passed plagiarism threshold. Cleared for HOD and Cell registration.'
                  : 'Similarity exceeds university threshold. Please revise and resubmit within 7 days.'}
              </p>
            </div>
            <Button
              label="Download Full Turnitin Report"
              variant="primary"
              onClick={() =>
                ToastService.success('Downloading Turnitin report PDF...')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
