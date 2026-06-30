// Security Admin — read-only Helpline view (same data as super admin)
import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type Helpline, helplines } from '../../mocks';
import { smsUrls } from '../../urls';
import '../../super-admin/pages/Dashboard.css';

export default function SecurityAdminHelpline() {
  const [popup, setPopup] = useState<{ visible: boolean; item: Helpline | null }>({ visible: false, item: null });

  return (
    <FormPage
      title="University Helplines"
      description="View all emergency and departmental helplines."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Security Admin', to: smsUrls.securityAdmin.portal },
        { label: 'Helplines' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={helplines}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'helplineName', header: 'Helpline Name' },
            { field: 'department', header: 'Department' },
            {
              field: 'contactNumber', header: 'Contact',
              cell: (item: Helpline) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <i className="pi pi-phone" style={{ color: '#16a34a', fontSize: '0.75rem' }} />
                  <strong>{item.contactNumber}</strong>
                </span>
              ),
            },
            { field: 'alternateNumber', header: 'Alternate' },
            { field: 'availability', header: 'Availability' },
            {
              field: 'status', header: 'Status',
              cell: (item: Helpline) => <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'rejected'} />,
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: Helpline) => (
                <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ visible: true, item })} />
              ),
            },
          ]}
          searchBox searchPlaceholder="Search helplines..."
        />
      </FormCard>

      {popup.item && (
        <FormPopup visible={popup.visible} onHide={() => setPopup({ visible: false, item: null })}
          title={popup.item.helplineName}
          subtitle={`${popup.item.department} · ${popup.item.availability}`}
          size="lg"
        >
          <FormGrid columns={2}>
            {[
              { label: 'Contact Number', value: popup.item.contactNumber },
              { label: 'Alternate Number', value: popup.item.alternateNumber || '—' },
              { label: 'Email', value: popup.item.email || '—' },
              { label: 'Availability', value: popup.item.availability },
              { label: 'Department', value: popup.item.department },
              { label: 'Status', value: popup.item.status },
            ].map(f => (
              <div key={f.label}>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{f.value}</p>
              </div>
            ))}
          </FormGrid>
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '0.75rem', marginTop: '0.75rem', border: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
            <p style={{ fontSize: '0.813rem', color: '#374151' }}>{popup.item.description}</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={() => setPopup({ visible: false, item: null })} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
