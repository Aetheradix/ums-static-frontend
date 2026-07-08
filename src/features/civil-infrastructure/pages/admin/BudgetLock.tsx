import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard, FormGrid, FormPage, FormPopup, GridPanel,
} from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function BudgetLock() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    const worksList = saved ? JSON.parse(saved) : civilWorks;
    return worksList.map((w: any) => ({
      budgetHead: 'Civil Works',
      financialYear: '2025-26',
      lockedBy: 'Finance Officer',
      budgetLocked: w.status === 'Budget Locked' || w.tsAmount > 0 && w.contractAmount > 0,
      ...w,
    }));
  });
  const [popup, setPopup] = useState<{ mode: 'closed' | 'lock' | 'view'; item?: any }>({ mode: 'closed' });
  const [fYear, setFYear] = useState('2025-26');
  const [bHead, setBHead] = useState('Civil Works');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const handleLock = () => {
    if (!popup.item) return;
    setData((prev: any[]) => prev.map((d: any) => d.id === popup.item.id
      ? { ...d, status: 'Budget Locked' as any, budgetLocked: true, financialYear: fYear, budgetHead: bHead }
      : d
    ));
    ToastService.success('Fiscal budget locked in ledger. Tender publication now unblocked.');
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Fiscal Budget Allocation Lock"
      description="The ledger locks funds against the Work ID. Hard stop enforced — tender cannot publish without locked budget."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Budget Lock' },
      ]}
    >
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '0.75rem', padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#92400e', marginBottom: '1.25rem' }}>
        <strong>🔒 ERP Hard Stop:</strong> The system prevents tender publication unless an explicitly allocated and available fiscal budget is locked against the Work ID in this ledger. Finance must lock budget before the Tender module activates.
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'workId', header: 'Work ID', cell: (w: any) => <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>{w.workId}</span> },
            { field: 'name', header: 'Work Name' },
            { field: 'category', header: 'Work Type', cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.category}</span> },
            { field: 'department', header: 'Category' },
            { field: 'workBasis', header: 'Work Basis', cell: (w: any) => <span className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}>{w.workBasis ?? 'SOR Based'}</span> },
            { field: 'tsAmount', header: 'TS Amount', cell: (w: any) => <span>₹{(w.tsAmount / 100000).toFixed(2)}L</span> },
            { field: 'financialYear', header: 'FY', cell: (w: any) => <span>{w.financialYear}</span> },
            { field: 'budgetHead', header: 'Budget Head', cell: (w: any) => <span style={{ fontSize: '0.75rem' }}>{w.budgetHead}</span> },
            { field: 'budgetLocked', header: 'Budget Status',
              cell: (w: any) => w.budgetLocked
                ? <span className="civil-pill green">🔒 Locked</span>
                : <span className="civil-pill red">🔓 Not Locked</span> },
            { field: 'id', header: 'Action', sortable: false,
              cell: (item: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {!item.budgetLocked && item.tsAmount > 0 && (
                    <Button size="small" label="Lock Budget" icon="lock" variant="primary"
                      onClick={() => { setFYear('2025-26'); setBHead('Civil Works'); setRemarks(''); setPopup({ mode: 'lock', item }); }} />
                  )}
                  {item.budgetLocked && <span className="civil-pill green">Locked ✓</span>}
                </div>
              ) },
          ]}
          searchBox searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Lock Budget — ${popup.item?.workId}`}
        subtitle="Fund allocation in accounting sub-module. Once locked, tender can be published."
        size="lg"
      >
        {popup.mode === 'lock' && popup.item && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.5rem', fontSize: '0.8125rem', marginBottom: '1.25rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
              {[
                ['Work Name', popup.item.name],
                ['TS Amount', `₹${(popup.item.tsAmount / 100000).toFixed(2)}L`],
                ['Funding Source', popup.item.fundingSource],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#9ca3af', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <FormGrid columns={3}>
              <TextBox label="Financial Year" value={fYear} onChange={setFYear} required />
              <DropDownList
                label="Budget Head"
                data={['Civil Works', 'Electrical Works', 'Equipment', 'MEP', 'Miscellaneous'].map(v => ({ name: v, value: v }))}
                textField="name" optionValue="value"
                value={bHead} onChange={v => setBHead(v as string)}
              />
              <TextBox label="Amount to Lock (₹)" value={String(popup.item.tsAmount)} onChange={() => {}} disabled />
            </FormGrid>
            <TextArea label="Ledger Remarks" placeholder="Lock reference, account code..." value={remarks} onChange={setRemarks} rows={2} />
            <div className="flex justify-end gap-3 mt-4">
              <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
              <Button label="Lock Budget in Ledger" variant="primary" icon="lock" onClick={handleLock} />
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
