import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'grant'; item: (typeof civilWorks)[0] }
  | { mode: 'view'; item: (typeof civilWorks)[0] };

export default function TechnicalSanction() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    const worksList = saved ? JSON.parse(saved) : civilWorks;
    return worksList.map((w: any) => ({
      tsRemarks: '',
      tsGrantedBy: 'Superintending Engineer / PWD',
      ...w,
    }));
  });
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [tsAmt, setTsAmt] = useState('');
  const [tsRemarks, setTsRemarks] = useState('');

  useEffect(() => {
    // Strip temp properties before saving if necessary, but saving is fine directly
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const handleGrantTS = () => {
    if (!tsAmt || Number(tsAmt) <= 0) {
      ToastService.error('TS Amount is required.');
      return;
    }
    if (popup.mode !== 'grant') return;
    const aa = (popup as any).item.aaAmount;
    if (Number(tsAmt) > aa) {
      ToastService.error('Technical Sanction Amount cannot exceed AA Amount.');
      return;
    }
    setData((prev: any[]) =>
      prev.map((d: any) =>
        d.id === (popup as any).item.id
          ? {
              ...d,
              tsAmount: Number(tsAmt),
              status: 'TS Granted' as any,
              tsRemarks,
            }
          : d
      )
    );
    ToastService.success(
      'Technical Sanction granted. Structural soundness certified.'
    );
    setPopup({ mode: 'closed' });
    setTsAmt('');
    setTsRemarks('');
  };

  return (
    <FormPage
      title="Technical Sanction (TS)"
      description="Engineering wing certifies structural soundness and issues the official TS Amount — independent of AA."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Technical Sanction' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workId',
              header: 'Work ID',
              cell: (w: any) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {w.workId}
                </span>
              ),
            },
            { field: 'name', header: 'Work Name' },
            {
              field: 'category',
              header: 'Work Type',
              cell: (w: any) => (
                <span style={{ fontSize: '0.75rem' }}>{w.category}</span>
              ),
            },
            { field: 'department', header: 'Category' },
            {
              field: 'workBasis',
              header: 'Work Basis',
              cell: (w: any) => (
                <span
                  className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                >
                  {w.workBasis ?? 'SOR Based'}
                </span>
              ),
            },
            {
              field: 'aaAmount',
              header: 'AA Amount',
              cell: (w: any) => (
                <span>₹{(w.aaAmount / 100000).toFixed(2)}L</span>
              ),
            },
            {
              field: 'tsAmount',
              header: 'TS Amount (₹)',
              cell: (w: any) =>
                w.tsAmount > 0 ? (
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{(w.tsAmount / 100000).toFixed(2)}L
                  </span>
                ) : (
                  <span className="civil-pill amber">Not Yet Granted</span>
                ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (w: any) => (
                <StatusBadge
                  label={w.status}
                  variant={w.status === 'TS Granted' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: any) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {item.status === 'AA Approved' && (
                    <Button
                      size="small"
                      label="Grant TS"
                      icon="verified"
                      variant="primary"
                      onClick={() => {
                        setTsAmt(String(item.aaAmount * 0.995));
                        setTsRemarks('');
                        setPopup({ mode: 'grant', item });
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search works..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'grant'
            ? `Grant Technical Sanction — ${(popup as any).item?.workId}`
            : `View — ${(popup as any).item?.workId}`
        }
        subtitle="TS certifies architectural drawings and structural soundness. TS Amount ≤ AA Amount."
        size="lg"
      >
        {popup.mode !== 'closed' && (
          <>
            <div className="civil-chain">
              <span className="civil-chain-item done">AA Granted</span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item active">TS ← Current</span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item">Budget Lock</span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item">Tender</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem 2rem',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
              }}
            >
              {[
                ['Work ID', (popup as any).item.workId],
                [
                  'AA Amount',
                  `₹${((popup as any).item.aaAmount / 100000).toFixed(2)}L`,
                ],
                ['Category', (popup as any).item.category],
                ['Execution Route', (popup as any).item.executionRoute],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {popup.mode === 'grant' && (
              <>
                <FormGrid columns={2}>
                  <TextBox
                    label="TS Amount (₹) — Must be ≤ AA Amount"
                    placeholder="e.g. 27650000"
                    value={tsAmt}
                    onChange={setTsAmt}
                    required
                  />
                  <TextBox
                    label="TS Granted By (Authority)"
                    value="Superintending Engineer / PWD"
                    onChange={() => {}}
                    disabled
                  />
                </FormGrid>
                <TextArea
                  label="TS Verification Remarks"
                  placeholder="Structural certification remarks, drawing references..."
                  value={tsRemarks}
                  onChange={setTsRemarks}
                  rows={3}
                />
                <div
                  style={{
                    background: '#e0f2fe',
                    border: '1px solid #7dd3fc',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    fontSize: '0.8125rem',
                    color: '#0c4a6e',
                    marginTop: '0.75rem',
                  }}
                >
                  <strong>ℹ Note:</strong> Technical Sanction Amount cannot
                  exceed the AA Amount (₹
                  {((popup as any).item.aaAmount / 100000).toFixed(2)}L). Any
                  cost overrun requires a Revised Estimate.
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Issue Technical Sanction"
                    variant="primary"
                    icon="verified"
                    onClick={handleGrantTS}
                  />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
