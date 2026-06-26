import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import AttendanceCalendar from '../../../shared/AttendanceCalendar';
import { lmsUrls } from '../../../urls';

const LEGEND_ITEMS = [
  { type: 'working' as const, label: 'Working Day', color: '#dcfce7', border: '#86efac' },
  { type: 'holiday' as const, label: 'Holiday / Weekend', color: '#f0f9ff', border: '#93c5fd' },
  { type: 'vacation' as const, label: 'Vacation / Break', color: '#fef3c7', border: '#fcd34d' },
  { type: 'exam' as const, label: 'Exam Days', color: '#faf5ff', border: '#c4b5fd' },
];

const UPCOMING_EVENTS = [
  { date: '28 Jun 2024', label: 'Internal Assessment — Sem 6', type: 'exam', color: '#7c3aed' },
  { date: '15 Jul 2024', label: 'Mid Semester Break Begins', type: 'vacation', color: '#b45309' },
  { date: '15 Aug 2024', label: 'Independence Day (Holiday)', type: 'holiday', color: '#0369a1' },
  { date: '2 Sep 2024', label: 'Sem 7 Registration Deadline', type: 'working', color: '#15803d' },
  { date: '20 Sep 2024', label: 'End Semester Exams Begin', type: 'exam', color: '#7c3aed' },
  { date: '2 Oct 2024', label: 'Gandhi Jayanti (Holiday)', type: 'holiday', color: '#0369a1' },
];

export default function AcademicCalendar() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = selectedType
    ? UPCOMING_EVENTS.filter(e => e.type === selectedType)
    : UPCOMING_EVENTS;

  return (
    <FormPage
      title="Academic Calendar"
      description="View and manage working days, holidays, vacations and exam schedules."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Academic Calendar' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Calendar */}
        <FormCard title="Monthly Calendar — June 2024">
          <AttendanceCalendar />
        </FormCard>

        {/* Legend + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormCard title="Calendar Legend">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {LEGEND_ITEMS.map(item => (
                <div
                  key={item.type}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                  onClick={() => setSelectedType(prev => prev === item.type ? null : item.type)}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: item.color, border: `2px solid ${item.border}`, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.813rem', color: selectedType === item.type ? '#1d4ed8' : '#374151', fontWeight: selectedType === item.type ? 600 : 400 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>

          <FormCard title="Monthly Stats">
            {[
              { label: 'Working Days', value: 20, color: '#16a34a' },
              { label: 'Holidays', value: 8, color: '#0369a1' },
              { label: 'Exam Days', value: 2, color: '#7c3aed' },
              { label: 'Vacation Days', value: 0, color: '#b45309' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>{stat.label}</span>
                <span style={{ fontSize: '0.938rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </FormCard>
        </div>
      </div>

      {/* Upcoming Events */}
      <FormCard title="Upcoming Events & Important Dates" headerAction={
        selectedType && (
          <button type="button" style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedType(null)}>
            Clear Filter ×
          </button>
        )
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div style={{ width: 8, borderRadius: 4, background: ev.color, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', marginBottom: 2 }}>{ev.label}</p>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>{ev.date}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.813rem' }}>
              No events found for selected filter.
            </div>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
