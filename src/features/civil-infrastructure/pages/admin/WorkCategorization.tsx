import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard, FormPage, FormPopup, GridPanel, StatusBadge,
} from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const CATEGORY_RULES: Record<string, { color: string; rule: string; lifecycle: string }> = {
  'New Capital Construction': { color: 'blue',   rule: 'Standard lifecycle — Sequential online approvals required.',          lifecycle: 'AA → TS → Budget Lock → Tender → Work Order → Execution → Completion' },
  'Maintenance/Overhaul':     { color: 'teal',   rule: 'Standard lifecycle — Minor works may use limited tender.',            lifecycle: 'AA → TS → Budget Lock → Tender → Work Order → Execution → Completion' },
  'Renewal':                  { color: 'purple', rule: 'Standard lifecycle — Quantity-based tracking mandatory.',             lifecycle: 'AA → TS → Budget Lock → Tender → Work Order → Execution → Completion' },
  'Strengthening':            { color: 'amber',  rule: 'Standard lifecycle — Structural assessment certificate required.',    lifecycle: 'AA → TS → Budget Lock → Tender → Work Order → Execution → Completion' },
  'Deposit Work':             { color: 'green',  rule: 'External agency execution — Funds deposited with PWD/PIU/MPSEDC.',   lifecycle: 'AA → TS → Budget Deposit → Agency Assignment → Monitoring → Completion' },
  'Emergency Work':           { color: 'red',    rule: 'HIGH PRIORITY — Bypasses sequential online approvals. Retrospective sanctioning recorded.', lifecycle: 'Emergency AA (Retrospective) → Execution → Post-facto TS → Final Bill' },
};

export default function WorkCategorization() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });
  const [popup, setPopup] = useState<{ mode: 'closed' | 'tag' | 'view'; item?: any }>({ mode: 'closed' });
  const [newCategory, setNewCategory] = useState('');
  const [tagRemarks, setTagRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const handleTag = () => {
    if (!newCategory) { ToastService.error('Category must be selected.'); return; }
    setData((prev: any[]) => prev.map((d: any) => d.id === popup.item?.id
      ? { ...d, category: newCategory as any }
      : d
    ));
    ToastService.success(`Work Type tagged as "${newCategory}". Workflow routing updated.`);
    setPopup({ mode: 'closed' });
  };

  const rule = (cat: string) => CATEGORY_RULES[cat] ?? { color: 'gray', rule: '—', lifecycle: '—' };

  return (
    <FormPage
      title="Work Categorization"
      description="Tag each work type to route workflow logic, financial accounting rules, and approval speed-tracks."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Work Categorization' },
      ]}
    >
      {/* Category Rules Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {Object.entries(CATEGORY_RULES).map(([cat, info]) => (
          <div key={cat} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '0.875rem 1rem', borderLeft: '4px solid' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.25rem' }}>{cat}</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.5 }}>{info.rule}</div>
          </div>
        ))}
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'workId', header: 'Work ID', cell: (w: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{w.workId}</span> },
            { field: 'name', header: 'Work Name' },
            { field: 'category', header: 'Work Type',
              cell: (w: any) => {
                const r = rule(w.category);
                return <span className={`civil-pill ${r.color}`}>{w.category}</span>;
              } },
            { field: 'department', header: 'Category' },
            { field: 'workBasis', header: 'Work Basis', cell: (w: any) => <span className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}>{w.workBasis ?? 'SOR Based'}</span> },
            { field: 'executionRoute', header: 'Execution Route (for issuing tender)', cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.executionRoute}</span> },
            { field: 'status', header: 'Status', cell: (w: any) => <StatusBadge label={w.status} variant="neutral" /> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => setPopup({ mode: 'view', item })} />
                  <Button size="small" label="Re-tag" icon="tag" variant="outlined"
                    onClick={() => { setNewCategory(item.category); setTagRemarks(''); setPopup({ mode: 'tag', item }); }} />
                </div>
              ) },
          ]}
          searchBox searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Categorize Work — ${popup.item?.workId}`}
        subtitle="Tagging determines financial rules and approval routing."
        size="lg"
      >
        {popup.item && (
          <>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>{popup.item.name}</div>
            <div style={{ color: '#6b7280', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Current category: <strong>{popup.item.category}</strong>
            </div>

            <DropDownList
              label="Work Category / Operational Tag"
              data={Object.keys(CATEGORY_RULES).map(v => ({ name: v, value: v }))}
              textField="name" optionValue="value"
              value={newCategory}
              onChange={v => setNewCategory(v as string)}
              disabled={popup.mode === 'view'}
            />

            {newCategory && (
              <div style={{ marginTop: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Workflow to be Applied:</div>
                <div style={{ color: '#6b7280', lineHeight: 1.6 }}>{CATEGORY_RULES[newCategory]?.lifecycle}</div>
                <div style={{ marginTop: '0.5rem', color: '#92400e', background: '#fef3c7', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
                  {CATEGORY_RULES[newCategory]?.rule}
                </div>
              </div>
            )}

            {popup.mode === 'tag' && (
              <>
                <div style={{ marginTop: '0.75rem' }}>
                  <TextArea label="Tagging Remarks" placeholder="Reason for this categorization..." value={tagRemarks} onChange={setTagRemarks} rows={2} />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
                  <Button label="Apply Category Tag" variant="primary" icon="tag" onClick={handleTag} />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
