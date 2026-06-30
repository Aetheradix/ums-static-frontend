import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { defenseSchedules } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function VivaSchedule() {
  const schedule = defenseSchedules[0];

  return (
    <FormPage
      title="Viva Defense Schedule"
      description="Your PhD defense examination schedule, jury composition and venue details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Viva Schedule' },
      ]}
    >
      <div
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
          borderRadius: 16,
          color: '#fff',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 4 }}>
            PhD Viva Defense Examination
          </p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {schedule.date}
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginTop: 4 }}>
            {schedule.time} · {schedule.venue}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              background: '#22c55e',
              padding: '0.375rem 1rem',
              borderRadius: 20,
              fontSize: '0.813rem',
              fontWeight: 700,
            }}
          >
            {schedule.status}
          </span>
        </div>
      </div>

      <div className="dbt-stats-grid">
        <StatCard
          title="Defense Date"
          value={schedule.date}
          icon="event"
          colorScheme="blue"
          subtitle="Viva examination day"
        />
        <StatCard
          title="Time Slot"
          value={schedule.time}
          icon="schedule"
          colorScheme="purple"
          subtitle="Reporting 15 mins early"
        />
        <StatCard
          title="Venue"
          value="Hall #2"
          icon="location_on"
          colorScheme="teal"
          subtitle={schedule.venue}
        />
        <StatCard
          title="Status"
          value={schedule.status}
          icon="flag"
          colorScheme="green"
          subtitle="Defense calendar"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <FormCard title="Jury Panel Composition">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[
              {
                role: 'Chairperson',
                name: schedule.chairperson,
                institution: 'DAVV University',
                badge: '#1e40af',
              },
              {
                role: 'External Examiner',
                name: schedule.externalExaminer,
                institution: 'IIT Indore',
                badge: '#7c3aed',
              },
              {
                role: 'Internal Examiner',
                name: schedule.internalExaminer,
                institution: 'DAVV University',
                badge: '#0891b2',
              },
              {
                role: 'Research Guide',
                name: 'Dr. Sanjay Tanwani',
                institution: 'DAVV University',
                badge: '#16a34a',
              },
            ].map((jury, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: jury.badge,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {jury.name.charAt(0)}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: jury.badge,
                      background: `${jury.badge}15`,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 3,
                    }}
                  >
                    {jury.role}
                  </span>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 700,
                      color: '#1f2937',
                      marginTop: 2,
                    }}
                  >
                    {jury.name}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    {jury.institution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Preparation Instructions">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
              fontSize: '0.813rem',
            }}
          >
            <div
              style={{
                padding: '0.75rem',
                background: '#eff6ff',
                borderRadius: 6,
                border: '1px solid #bfdbfe',
              }}
            >
              <p style={{ fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>
                📊 Presentation Requirements
              </p>
              <p style={{ color: '#1e3a8a' }}>
                Prepare 20-30 slides covering: objectives, methodology, results,
                contributions and Q&A readiness.
              </p>
            </div>
            <div
              style={{
                padding: '0.75rem',
                background: '#f0fdf4',
                borderRadius: 6,
                border: '1px solid #bbf7d0',
              }}
            >
              <p style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>
                📋 Documents to Carry
              </p>
              <p style={{ color: '#14532d' }}>
                ID Card · Thesis hardcopy (3 copies) · Publications proof · NOC
                from supervisor
              </p>
            </div>
            <div
              style={{
                padding: '0.75rem',
                background: '#fffbeb',
                borderRadius: 6,
                border: '1px solid #fde68a',
              }}
            >
              <p style={{ fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
                ⏰ Timing Guidelines
              </p>
              <p style={{ color: '#78350f' }}>
                Report 15 minutes before the scheduled time. Defense duration:
                45-60 minutes.
              </p>
            </div>
            <Button
              label="📅 Add to Calendar"
              variant="outlined"
              onClick={() => ToastService.success('Defense added to calendar!')}
            />
            <Button
              label="📥 Download Viva Notice"
              variant="primary"
              onClick={() =>
                ToastService.success('Downloading viva notice PDF...')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
