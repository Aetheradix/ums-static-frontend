import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { type BOQItem, boqItems, civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function BOQCompilation() {
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view';
    workId?: string;
  }>({ mode: 'closed' });

  const [civilWorksList] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const worksWithBOQ = [...new Set(boqItems.map(b => b.workId))];
  const worksList = civilWorksList.filter((w: any) =>
    worksWithBOQ.includes(w.id)
  );

  const workBOQ = (wid: string) => boqItems.filter(b => b.workId === wid);
  const boqTotal = (items: BOQItem[]) =>
    items.reduce((s, i) => s + i.amount, 0);

  return (
    <FormPage
      title="BOQ Compilation"
      description="The module aggregates SOR item entries into the formal Bill of Quantities (BOQ). Once locked, this becomes the un-editable financial baseline for all subsequent approvals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'BOQ Compilation' },
      ]}
    >
      {/* Chain */}
      <div className="civil-chain" style={{ marginBottom: '1.25rem' }}>
        <span className="civil-chain-item">SOR Master</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">BOQ ← Current</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">AA / TS</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Tender</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">E-MB</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">RA Bill</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Payment</span>
      </div>

      <div
        style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#991b1b',
          marginBottom: '1.25rem',
        }}
      >
        <strong>🔒 BOQ Lock Rule:</strong> Once AA/TS is granted and BOQ is
        approved, it is locked as the financial baseline. No items can be added
        or rates modified. Any deviation requires a Revised Estimate.
      </div>

      {/* BOQ Work List */}
      <FormCard>
        <GridPanel
          data={worksList}
          columns={[
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
            {
              field: 'name',
              header: 'Work Name',
              cell: (w: any) => (
                <span style={{ fontWeight: 600 }}>{w.name}</span>
              ),
            },
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
              field: 'id',
              header: 'BOQ Items',
              cell: (w: any) => (
                <span style={{ fontWeight: 700 }}>
                  {workBOQ(w.id).length} items
                </span>
              ),
            },
            {
              field: 'id',
              header: 'BOQ Total (₹)',
              cell: (w: any) => (
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  ₹{(boqTotal(workBOQ(w.id)) / 100000).toFixed(2)}L
                </span>
              ),
            },
            {
              field: 'id',
              header: 'BOQ Status',
              cell: (w: any) => {
                const b = workBOQ(w.id);
                const allLocked = b.every(item => item.isLocked);
                return allLocked ? (
                  <span className="civil-pill green">🔒 Locked Baseline</span>
                ) : (
                  <span className="civil-pill amber">Draft</span>
                );
              },
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: any) => (
                <Button
                  size="small"
                  label="View BOQ"
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'view', workId: item.id })}
                />
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
        title={`BOQ — ${civilWorksList.find((w: any) => w.id === popup.workId)?.workId ?? ''}`}
        subtitle="Locked bill of quantities. All items linked to approved SOR codes."
        size="lg"
      >
        {popup.workId &&
          (() => {
            const items = workBOQ(popup.workId);
            const total = boqTotal(items);
            return (
              <>
                {/* Summary */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  {[
                    { label: 'Total BOQ Items', value: items.length },
                    {
                      label: 'BOQ Total (₹)',
                      value: `₹${(total / 100000).toFixed(2)}L`,
                    },
                    {
                      label: 'Status',
                      value: items.every(i => i.isLocked)
                        ? '🔒 Locked'
                        : 'Draft',
                    },
                  ].map(s => (
                    <div
                      key={s.label}
                      style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        background: '#f9fafb',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: '#9ca3af',
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: 800,
                          color: '#111827',
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                <table className="civil-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>SOR Code</th>
                      <th>Description</th>
                      <th>Unit</th>
                      <th>Rate (₹)</th>
                      <th>BOQ Qty</th>
                      <th>Amount (₹)</th>
                      <th>Lock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#1d4ed8',
                            }}
                          >
                            {item.sorCode}
                          </span>
                        </td>
                        <td style={{ maxWidth: 200 }}>{item.description}</td>
                        <td>{item.unit}</td>
                        <td>₹{item.govtRate.toLocaleString('en-IN')}</td>
                        <td style={{ fontWeight: 700 }}>
                          {item.approvedQty.toLocaleString('en-IN')}
                        </td>
                        <td style={{ fontWeight: 700, color: '#16a34a' }}>
                          ₹{(item.amount / 100000).toFixed(2)}L
                        </td>
                        <td>
                          {item.isLocked ? (
                            <span className="civil-pill green">🔒</span>
                          ) : (
                            <span className="civil-pill amber">Draft</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f0fdf4' }}>
                      <td
                        colSpan={6}
                        style={{ textAlign: 'right', fontWeight: 700 }}
                      >
                        Grand Total
                      </td>
                      <td style={{ fontWeight: 800, color: '#15803d' }}>
                        ₹{(total / 100000).toFixed(2)}L
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </>
            );
          })()}
      </FormPopup>
    </FormPage>
  );
}
