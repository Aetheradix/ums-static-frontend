import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type Guideline, guidelines } from '../../mocks';
import { smsUrls } from '../../urls';

export default function SecurityAdminGuidelines() {
  const [popup, setPopup] = useState<{ visible: boolean; item: Guideline | null }>({ visible: false, item: null });

  const getVariant = (status: string) => status === 'Active' ? 'approved' : status === 'Draft' ? 'pending' : 'rejected';

  return (
    <FormPage
      title="Safety Guidelines"
      description="View all university safety guidelines and standard operating procedures."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Security Admin', to: smsUrls.securityAdmin.portal },
        { label: 'Guidelines' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={guidelines}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'title', header: 'Title' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'applicableFor', header: 'Applicable For' },
            { field: 'effectiveDate', header: 'Effective Date' },
            {
              field: 'status', header: 'Status',
              cell: (item: Guideline) => <StatusBadge label={item.status} variant={getVariant(item.status) as any} />,
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: Guideline) => (
                <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ visible: true, item })} />
              ),
            },
          ]}
          searchBox searchPlaceholder="Search guidelines..."
        />
      </FormCard>

      {popup.item && (
        <FormPopup visible={popup.visible} onHide={() => setPopup({ visible: false, item: null })}
          title={popup.item.title}
          subtitle={`${popup.item.category} · Effective: ${popup.item.effectiveDate}`}
          size="xl"
        >
          <FormGrid columns={2}>
            {[
              { label: 'Category', value: popup.item.category },
              { label: 'Department', value: popup.item.department },
              { label: 'Applicable For', value: popup.item.applicableFor },
              { label: 'Effective Date', value: popup.item.effectiveDate },
              { label: 'Status', value: popup.item.status },
              { label: 'PDF Document', value: popup.item.pdfUrl || '—' },
            ].map(f => (
              <div key={f.label}>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{f.value}</p>
              </div>
            ))}
          </FormGrid>
          {popup.item.videoUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Video Resource</p>
              <a href={popup.item.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontSize: '0.813rem' }}>
                <i className="pi pi-youtube" /> Watch Video
              </a>
            </div>
          )}
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '0.75rem', marginTop: '0.75rem', border: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
            <p style={{ fontSize: '0.813rem', color: '#374151', lineHeight: 1.6 }}>{popup.item.description}</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Download PDF" icon="download" variant="outlined" onClick={() => {}} />
            <Button label="Close" variant="outlined" onClick={() => setPopup({ visible: false, item: null })} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
