import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormPopup, StatusBadge } from 'shared/new-components';
import { type Guideline, guidelines } from '../../mocks';
import { smsUrls } from '../../urls';

const getVariant = (status: string) =>
  status === 'Active'
    ? 'approved'
    : status === 'Draft'
      ? 'pending'
      : 'rejected';

const CATEGORY_ICONS: Record<string, string> = {
  'Fire & Safety': 'pi-fire',
  'Lab Safety': 'pi-exclamation-triangle',
  'Hostel Safety': 'pi-home',
  'Harassment Prevention': 'pi-shield',
  'Cyber Security': 'pi-lock',
  'Natural Disaster': 'pi-globe',
  'General Safety': 'pi-info-circle',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Fire & Safety': '#ef4444',
  'Lab Safety': '#f59e0b',
  'Hostel Safety': '#8b5cf6',
  'Harassment Prevention': '#ec4899',
  'Cyber Security': '#3b82f6',
  'Natural Disaster': '#06b6d4',
  'General Safety': '#22c55e',
};

export default function EmployeeGuidelines() {
  const [popup, setPopup] = useState<{
    visible: boolean;
    item: Guideline | null;
  }>({ visible: false, item: null });

  return (
    <FormPage
      title="Safety Guidelines"
      description="University safety guidelines, SOPs and reference documents for your awareness."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Employee Portal', to: smsUrls.employee.portal },
        { label: 'Guidelines' },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {guidelines
          .filter(g => g.status === 'Active')
          .map(g => {
            const color = CATEGORY_COLORS[g.category] ?? '#6b7280';
            const icon = CATEGORY_ICONS[g.category] ?? 'pi-book';
            return (
              <div
                key={g.id}
                style={{
                  border: '1px solid #f3f4f6',
                  borderRadius: 12,
                  padding: '1.25rem',
                  background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setPopup({ visible: true, item: g })}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  el.style.borderColor = color;
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
                      background: color + '18',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i
                      className={`pi ${icon}`}
                      style={{ color, fontSize: '1.125rem' }}
                    />
                  </div>
                  <StatusBadge
                    label={g.status}
                    variant={getVariant(g.status) as any}
                  />
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '0.25rem',
                  }}
                >
                  {g.title}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.75rem',
                  }}
                >
                  {g.category} · {g.applicableFor}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {g.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                  }}
                >
                  {g.pdfUrl && (
                    <span
                      style={{
                        fontSize: '0.688rem',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <i className="pi pi-file-pdf" /> PDF
                    </span>
                  )}
                  {g.videoUrl && (
                    <span
                      style={{
                        fontSize: '0.688rem',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <i className="pi pi-youtube" /> Video
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {popup.item && (
        <FormPopup
          visible={popup.visible}
          onHide={() => setPopup({ visible: false, item: null })}
          title={popup.item.title}
          subtitle={`${popup.item.category} · Effective: ${popup.item.effectiveDate}`}
          size="xl"
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
              { label: 'Category', value: popup.item.category },
              { label: 'Department', value: popup.item.department },
              { label: 'Applicable For', value: popup.item.applicableFor },
              { label: 'Effective Date', value: popup.item.effectiveDate },
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
              marginBottom: '1rem',
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
              Description
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
          {popup.item.videoUrl && (
            <a
              href={popup.item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: '#2563eb',
                fontSize: '0.813rem',
                marginBottom: '1rem',
              }}
            >
              <i className="pi pi-youtube" /> Watch Related Video
            </a>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Download PDF"
              icon="download"
              variant="outlined"
              onClick={() => {}}
            />
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
