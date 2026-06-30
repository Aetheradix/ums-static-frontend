import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  StatusBadge,
} from 'shared/new-components';
import IncidentTimeline from '../../shared/IncidentTimeline';
import { type Incident, incidents } from '../../mocks';
import { smsUrls } from '../../urls';
import '../../super-admin/pages/Dashboard.css';

const MY_NAME = 'Prof. Ramesh Gupta';
const myIncidents = incidents.filter(i => i.reportedBy === MY_NAME);

const STATUS_VARIANT: Record<
  string,
  'pending' | 'approved' | 'rejected' | 'neutral'
> = {
  Open: 'rejected',
  Assigned: 'pending',
  'Under Investigation': 'pending',
  'Action Taken': 'pending',
  Resolved: 'approved',
  Closed: 'neutral',
};

export default function EmployeeMyIncidents() {
  const [popup, setPopup] = useState<{
    visible: boolean;
    item: Incident | null;
  }>({ visible: false, item: null });

  return (
    <FormPage
      title="My Incidents"
      description="Track the status of your reported incidents with real-time timeline updates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Employee Portal', to: smsUrls.employee.portal },
        { label: 'My Incidents' },
      ]}
    >
      {myIncidents.length === 0 ? (
        <FormCard>
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <i
              className="pi pi-shield"
              style={{
                fontSize: '3rem',
                color: '#22c55e',
                display: 'block',
                marginBottom: '1rem',
              }}
            />
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              No Incidents Reported
            </p>
            <p style={{ fontSize: '0.813rem', color: '#6b7280' }}>
              You haven't reported any security incidents yet. Stay safe!
            </p>
          </div>
        </FormCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myIncidents.map(inc => (
            <FormCard key={inc.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#111827',
                      }}
                    >
                      {inc.incidentId}
                    </h3>
                    <StatusBadge
                      label={inc.status}
                      variant={STATUS_VARIANT[inc.status] ?? 'neutral'}
                    />
                    <span
                      className={`sms-priority-chip priority-${inc.priority.toLowerCase()}`}
                    >
                      {inc.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                    {inc.category} · {inc.incidentType} · {inc.location}
                  </p>
                  <p
                    style={{
                      fontSize: '0.688rem',
                      color: '#9ca3af',
                      marginTop: 4,
                    }}
                  >
                    Reported on {inc.reportedDate}
                  </p>
                </div>
                <Button
                  size="small"
                  label="View Details"
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ visible: true, item: inc })}
                />
              </div>

              {/* Mini Timeline */}
              <div
                style={{
                  background: '#f9fafb',
                  borderRadius: 8,
                  padding: '0.75rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.688rem',
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                  }}
                >
                  Incident Progress
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    overflowX: 'auto',
                  }}
                >
                  {(
                    [
                      'Reported',
                      'Assigned',
                      'Investigation',
                      'Resolved',
                      'Closed',
                    ] as const
                  ).map((step, idx) => {
                    const stepStatuses: Record<string, string[]> = {
                      Reported: [
                        'Open',
                        'Assigned',
                        'Under Investigation',
                        'Action Taken',
                        'Resolved',
                        'Closed',
                      ],
                      Assigned: [
                        'Assigned',
                        'Under Investigation',
                        'Action Taken',
                        'Resolved',
                        'Closed',
                      ],
                      Investigation: [
                        'Under Investigation',
                        'Action Taken',
                        'Resolved',
                        'Closed',
                      ],
                      Resolved: ['Resolved', 'Closed'],
                      Closed: ['Closed'],
                    };
                    const isActive = stepStatuses[step]?.includes(inc.status);
                    return (
                      <div
                        key={step}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: isActive ? '#2563eb' : '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <i
                              className="pi pi-check"
                              style={{
                                fontSize: '0.625rem',
                                color: isActive ? 'white' : '#9ca3af',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: '0.625rem',
                              color: isActive ? '#2563eb' : '#9ca3af',
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {step}
                          </span>
                        </div>
                        {idx < 4 && (
                          <div
                            style={{
                              width: 40,
                              height: 2,
                              background: isActive ? '#2563eb' : '#e5e7eb',
                              marginBottom: 14,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </FormCard>
          ))}
        </div>
      )}

      {popup.item && (
        <FormPopup
          visible={popup.visible}
          onHide={() => setPopup({ visible: false, item: null })}
          title={`Incident Details — ${popup.item.incidentId}`}
          subtitle={`${popup.item.category} · ${popup.item.location}`}
          size="xl"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            {[
              { label: 'Incident ID', value: popup.item.incidentId },
              { label: 'Category', value: popup.item.category },
              { label: 'Type', value: popup.item.incidentType },
              { label: 'Location', value: popup.item.location },
              { label: 'Priority', value: popup.item.priority },
              {
                label: 'Assigned To',
                value: popup.item.assignedTo || 'Pending Assignment',
              },
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
              Your Report
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
          <p
            style={{
              fontSize: '0.813rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: '#374151',
            }}
          >
            Case Timeline
          </p>
          <IncidentTimeline steps={popup.item.timeline} />
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
