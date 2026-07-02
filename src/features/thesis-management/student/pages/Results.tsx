import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function Results() {
  return (
    <FormPage
      title="Viva Results"
      description="View your PhD viva defense evaluation scorecard, jury verdict and correction instructions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Results' },
      ]}
    >
      <div
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #16a34a 0%, #0891b2 100%)',
          borderRadius: 16,
          color: '#fff',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
          PhD Viva Defense Result
        </p>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>
          🎓 Degree Recommended
        </h2>
        <p style={{ opacity: 0.9 }}>
          Doctor of Philosophy — Subject to minor corrections
        </p>
      </div>

      <div className="dbt-stats-grid">
        <StatCard
          title="Viva Score"
          value="89 / 100"
          icon="emoji_events"
          colorScheme="green"
          subtitle="Consolidated jury score"
        />
        <StatCard
          title="Verdict"
          value="Awarded"
          icon="verified"
          colorScheme="blue"
          subtitle="Minor corrections only"
        />
        <StatCard
          title="Correction Deadline"
          value="31 Jul 2026"
          icon="event"
          colorScheme="orange"
          subtitle="Submit corrected thesis"
        />
        <StatCard
          title="Degree Award Date"
          value="Sep 2026"
          icon="school"
          colorScheme="purple"
          subtitle="Convocation ceremony"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Jury Scorecard Breakdown">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              {
                parameter: 'Research Quality & Depth',
                score: 22,
                max: 25,
                examiner: 'External',
              },
              {
                parameter: 'Methodology & Rigor',
                score: 19,
                max: 25,
                examiner: 'External',
              },
              {
                parameter: 'Presentation & Communication',
                score: 24,
                max: 25,
                examiner: 'Internal',
              },
              {
                parameter: 'Q&A Responses',
                score: 24,
                max: 25,
                examiner: 'Internal',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '0.625rem 0.875rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    {item.parameter}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#1e40af',
                    }}
                  >
                    {item.score}/{item.max}
                  </span>
                </div>
                <div
                  style={{ height: 6, background: '#e5e7eb', borderRadius: 3 }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(item.score / item.max) * 100}%`,
                      background: '#3b82f6',
                      borderRadius: 3,
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: '#9ca3af',
                    marginTop: 2,
                  }}
                >
                  {item.examiner} Examiner
                </p>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Jury Remarks & Correction Instructions">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                padding: '0.875rem',
                background: '#f0fdf4',
                borderRadius: 8,
                border: '1px solid #bbf7d0',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#166534',
                  marginBottom: 4,
                }}
              >
                Consolidated Jury Feedback:
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#14532d',
                  fontStyle: 'italic',
                }}
              >
                "Excellent defense presentation. Candidate demonstrated deep
                understanding of low-resource NLP challenges and answered all
                queries with confidence. Research contributions are novel and
                significant."
              </p>
            </div>
            <div
              style={{
                padding: '0.875rem',
                background: '#fffbeb',
                borderRadius: 8,
                border: '1px solid #fde68a',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#92400e',
                  marginBottom: 4,
                }}
              >
                Required Corrections (Minor):
              </p>
              <ul
                style={{
                  fontSize: '0.688rem',
                  color: '#78350f',
                  paddingLeft: '1rem',
                }}
              >
                <li>
                  Correct reference formatting in Appendix A (use IEEE format
                  consistently)
                </li>
                <li>
                  Add comparative table for BLEU scores in Chapter 4 Table 4.3
                </li>
                <li>
                  Update Abstract to mention Gondi dialect results explicitly
                </li>
              </ul>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Button
                label="📥 Download Result Certificate"
                variant="primary"
                onClick={() =>
                  ToastService.success('Downloading result certificate...')
                }
              />
              <Button
                label="📤 Upload Corrected Thesis"
                variant="outlined"
                onClick={() =>
                  ToastService.success('Corrections upload dialog opened!')
                }
              />
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
