import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { type SORItem, sorItems as initialData } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState = { mode: 'closed' } | { mode: 'view'; item: SORItem };

export default function SORMaster() {
  const [data] = useState(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  return (
    <FormPage
      title="SOR Master — Schedule of Rates"
      description="Government-notified SOR items locked at official rates. Engineers select items; system auto-calculates costs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'SOR Master' },
      ]}
    >
      <div style={{ background: '#f0f9ff', border: '1px solid #7dd3fc', borderRadius: '0.875rem', padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#0c4a6e', marginBottom: '1.25rem' }}>
        <strong>SOR Integration Rule:</strong> All rates are locked from the State Govt SOR 2025-26. Engineers can only SELECT items — they cannot modify rates. These locked rates flow through to BOQ → MB → Bill → Payment.
      </div>

      {/* SOR Category Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {['Concrete Works', 'Steel Works', 'Masonry', 'Finishing'].map(cat => {
          const items = data.filter(d => d.category === cat || (cat === 'Finishing' && ['Flooring', 'Painting', 'Plastering'].includes(d.category)));
          return (
            <FormCard key={cat}>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>{cat}</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.25rem' }}>{items.length} Items</div>
            </FormCard>
          );
        })}
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'SOR Code', cell: (s: SORItem) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: '0.75rem' }}>{s.code}</span> },
            { field: 'description', header: 'Item Description', cell: (s: SORItem) => <span style={{ fontWeight: 500 }}>{s.description}</span> },
            { field: 'category', header: 'Category', cell: (s: SORItem) => <span className="civil-pill blue" style={{ fontSize: '0.65rem' }}>{s.category}</span> },
            { field: 'unit', header: 'Unit', cell: (s: SORItem) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.unit}</span> },
            { field: 'govtRate', header: 'Govt Rate (₹)', cell: (s: SORItem) => <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{s.govtRate.toLocaleString('en-IN')}</span> },
            { field: 'year', header: 'SOR Year', cell: (s: SORItem) => <span className="civil-pill teal">{s.year}</span> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: SORItem) => (
                <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
              ) },
          ]}
          searchBox searchPlaceholder="Search SOR items..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`SOR Item — ${(popup as any).item?.code ?? ''}`}
        subtitle="Government rate master — read only."
        size="lg"
      >
        {popup.mode === 'view' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 2rem', fontSize: '0.8125rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
            {[
              ['SOR Code', popup.item.code],
              ['Category', popup.item.category],
              ['Description', popup.item.description],
              ['Unit of Measurement', popup.item.unit],
              ['Govt Rate (₹)', `₹${popup.item.govtRate.toLocaleString('en-IN')} per ${popup.item.unit}`],
              ['SOR Financial Year', popup.item.year],
              ['Rate Source', 'State Govt PWD SOR 2025-26'],
              ['Modification Allowed', 'No — Locked by ERP'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                <div style={{ fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
