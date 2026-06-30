// Student Helplines — student portal breadcrumbs
import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormPopup } from 'shared/new-components';
import { type Helpline, helplines } from '../../mocks';
import { smsUrls } from '../../urls';

export default function StudentHelplines() {
  const [popup, setPopup] = useState<{
    visible: boolean;
    item: Helpline | null;
  }>({ visible: false, item: null });

  return (
    <FormPage
      title="University Helplines"
      description="Emergency and helpline numbers. Save these for quick access."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Student Portal', to: smsUrls.student.portal },
        { label: 'Helplines' },
      ]}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          borderRadius: 12,
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: 'white',
        }}
      >
        <i
          className="pi pi-exclamation-triangle"
          style={{ fontSize: '2rem' }}
        />
        <div>
          <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
            Emergency? Call Immediately!
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            Security: <strong>1800-333-333</strong> · Medical:{' '}
            <strong>1800-222-222</strong> · Police: <strong>100</strong> · Fire:{' '}
            <strong>101</strong>
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {helplines
          .filter(h => h.status === 'Active')
          .map(h => (
            <div
              key={h.id}
              style={{
                border: '1px solid #f3f4f6',
                borderRadius: 12,
                padding: '1.25rem',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setPopup({ visible: true, item: h })}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                el.style.borderColor = '#2563eb';
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
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className="pi pi-phone" style={{ color: '#dc2626' }} />
                </div>
                <span
                  style={{
                    fontSize: '0.688rem',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  {h.availability}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  marginBottom: '0.25rem',
                }}
              >
                {h.helplineName}
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.75rem',
                }}
              >
                {h.department}
              </p>
              <p
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#2563eb',
                }}
              >
                {h.contactNumber}
              </p>
            </div>
          ))}
      </div>

      {popup.item && (
        <FormPopup
          visible={popup.visible}
          onHide={() => setPopup({ visible: false, item: null })}
          title={popup.item.helplineName}
          subtitle={`${popup.item.department} · ${popup.item.availability}`}
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
              { label: 'Primary Contact', value: popup.item.contactNumber },
              { label: 'Alternate', value: popup.item.alternateNumber || '—' },
              { label: 'Email', value: popup.item.email || '—' },
              { label: 'Availability', value: popup.item.availability },
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
              About
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
