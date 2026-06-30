import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type AwarenessProgram, awarenessPrograms } from '../../mocks';
import { smsUrls } from '../../urls';

const getVariant = (status: string) => {
  switch (status) {
    case 'Upcoming':
      return 'pending';
    case 'Ongoing':
      return 'approved';
    case 'Completed':
      return 'neutral';
    case 'Cancelled':
      return 'rejected';
    default:
      return 'neutral';
  }
};

export default function SecurityAdminAwarenessPrograms() {
  const [popup, setPopup] = useState<{
    visible: boolean;
    item: AwarenessProgram | null;
  }>({ visible: false, item: null });

  return (
    <FormPage
      title="Awareness Programs"
      description="View upcoming and past safety awareness programs and workshops."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Security Admin', to: smsUrls.securityAdmin.portal },
        { label: 'Awareness Programs' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={awarenessPrograms}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'programName', header: 'Program Name' },
            { field: 'speaker', header: 'Speaker' },
            { field: 'venue', header: 'Venue' },
            { field: 'date', header: 'Date' },
            { field: 'time', header: 'Time' },
            { field: 'audience', header: 'Audience' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: AwarenessProgram) => (
                <StatusBadge
                  label={item.status}
                  variant={getVariant(item.status) as any}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: AwarenessProgram) => (
                <Button
                  size="small"
                  label=""
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ visible: true, item })}
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search programs..."
        />
      </FormCard>

      {popup.item && (
        <FormPopup
          visible={popup.visible}
          onHide={() => setPopup({ visible: false, item: null })}
          title={popup.item.programName}
          subtitle={`${popup.item.date} · ${popup.item.time} · ${popup.item.venue}`}
          size="lg"
        >
          <FormGrid columns={2}>
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
              { label: 'Attachments', value: popup.item.attachments || '—' },
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
          </FormGrid>
          <div
            style={{
              background: '#f9fafb',
              borderRadius: 8,
              padding: '0.75rem',
              marginTop: '0.75rem',
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
