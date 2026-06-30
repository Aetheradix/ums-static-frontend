import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, FormPopup } from 'shared/new-components';
import { type AwarenessProgram, awarenessPrograms } from '../../mocks';
import { smsUrls } from '../../urls';

const STATUS_BG: Record<string, string> = {
  Upcoming: '#dbeafe',
  Ongoing: '#dcfce7',
  Completed: '#f3f4f6',
  Cancelled: '#fee2e2',
};

const STATUS_COLOR: Record<string, string> = {
  Upcoming: '#2563eb',
  Ongoing: '#16a34a',
  Completed: '#6b7280',
  Cancelled: '#dc2626',
};

export default function EmployeeAwarenessPrograms() {
  const [popup, setPopup] = useState<{
    visible: boolean;
    item: AwarenessProgram | null;
  }>({ visible: false, item: null });

  const upcoming = awarenessPrograms.filter(p => p.status === 'Upcoming');
  const past = awarenessPrograms.filter(p => p.status !== 'Upcoming');

  const ProgramCard = ({ program }: { program: AwarenessProgram }) => (
    <div
      style={{
        border: '1px solid #f3f4f6',
        borderRadius: 12,
        padding: '1.25rem',
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onClick={() => setPopup({ visible: true, item: program })}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        el.style.borderColor = '#8b5cf6';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        el.style.borderColor = '#f3f4f6';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: '#ede9fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i
            className="pi pi-megaphone"
            style={{ color: '#7c3aed', fontSize: '1.125rem' }}
          />
        </div>
        <span
          style={{
            fontSize: '0.688rem',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 999,
            background: STATUS_BG[program.status],
            color: STATUS_COLOR[program.status],
          }}
        >
          {program.status}
        </span>
      </div>
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: '#111827',
          marginBottom: '0.25rem',
        }}
      >
        {program.programName}
      </p>
      <p
        style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          marginBottom: '0.5rem',
        }}
      >
        By {program.speaker}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.688rem',
            color: '#6b7280',
          }}
        >
          <i className="pi pi-calendar" style={{ fontSize: '0.688rem' }} />
          {program.date}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.688rem',
            color: '#6b7280',
          }}
        >
          <i className="pi pi-clock" style={{ fontSize: '0.688rem' }} />
          {program.time}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.688rem',
            color: '#6b7280',
          }}
        >
          <i className="pi pi-map-marker" style={{ fontSize: '0.688rem' }} />
          {program.venue}
        </span>
      </div>
    </div>
  );

  return (
    <FormPage
      title="Awareness Programs"
      description="Upcoming and past safety awareness programs, workshops and drills."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Employee Portal', to: smsUrls.employee.portal },
        { label: 'Awareness Programs' },
      ]}
    >
      {upcoming.length > 0 && (
        <FormCard
          title="Upcoming Programs"
          subtitle="Don't miss these upcoming safety events"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {upcoming.map(p => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </FormCard>
      )}

      {past.length > 0 && (
        <FormCard title="Past Programs" subtitle="Completed awareness programs">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {past.map(p => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </FormCard>
      )}

      {popup.item && (
        <FormPopup
          visible={popup.visible}
          onHide={() => setPopup({ visible: false, item: null })}
          title={popup.item.programName}
          subtitle={`${popup.item.date} · ${popup.item.time} · ${popup.item.venue}`}
          size="lg"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            {[
              { label: 'Speaker', value: popup.item.speaker },
              { label: 'Venue', value: popup.item.venue },
              {
                label: 'Date & Time',
                value: `${popup.item.date} ${popup.item.time}`,
              },
              { label: 'Department', value: popup.item.department },
              { label: 'Audience', value: popup.item.audience },
              { label: 'Status', value: popup.item.status },
            ].map(f => (
              <div key={f.label}>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {f.label}
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              background: '#f9fafb',
              borderRadius: 8,
              padding: '0.75rem',
              border: '1px solid #f3f4f6',
            }}
          >
            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              About this Program
            </p>
            <p
              style={{
                fontSize: '0.813rem',
                color: '#374151',
                lineHeight: 1.6,
              }}
            >
              {popup.item.description}
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Close"
              variant="outlined"
              onClick={() => setPopup({ visible: false, item: null })}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
