import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type BOQItem,
  boqItems as initialBOQ,
  civilWorks,
  sorItems,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; item: BOQItem };

export default function AdminBOQCompilation() {
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [data, setData] = useState<BOQItem[]>(initialBOQ);
  const [selectedWorkId, setSelectedWorkId] = useState('1'); // Default to Academic Block
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Add/Edit Form State
  const [selectedSorId, setSelectedSorId] = useState('');
  const [qty, setQty] = useState('');

  // Watch storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) {
        setWorks(JSON.parse(savedWorks));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentWork = works.find(w => w.id === selectedWorkId);
  const workBOQItems = data.filter(b => b.workId === selectedWorkId);
  const totalBOQAmount = workBOQItems.reduce((s, i) => s + i.amount, 0);
  const isLocked =
    workBOQItems.length > 0 && workBOQItems.every(i => i.isLocked);

  const getSorItem = () => sorItems.find(s => s.id === selectedSorId);
  const selectedSor = getSorItem();
  const calculatedAmt =
    selectedSor && qty ? Number(qty) * selectedSor.govtRate : 0;

  const handleSaveItem = () => {
    if (popup.mode === 'add') {
      if (!selectedSorId) {
        ToastService.error('SOR Item must be selected.');
        return;
      }
      if (!qty || Number(qty) <= 0) {
        ToastService.error('Quantity must be greater than 0.');
        return;
      }

      // Check if item already exists in BOQ
      if (workBOQItems.some(i => i.sorItemId === selectedSorId)) {
        ToastService.error(
          'This SOR Item is already added to the BOQ. Edit its quantity instead.'
        );
        return;
      }

      const newItem: BOQItem = {
        id: String(Date.now()),
        boqId: `BOQ-${selectedWorkId.padStart(3, '0')}`,
        workId: selectedWorkId,
        sorItemId: selectedSorId,
        sorCode: selectedSor?.code ?? '',
        description: selectedSor?.description ?? '',
        unit: selectedSor?.unit ?? '',
        govtRate: selectedSor?.govtRate ?? 0,
        approvedQty: Number(qty),
        amount: calculatedAmt,
        isLocked: false,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Item added to BOQ compiler.');
    } else if (popup.mode === 'edit' && popup.item) {
      if (!qty || Number(qty) <= 0) {
        ToastService.error('Quantity must be greater than 0.');
        return;
      }
      setData(prev =>
        prev.map(item =>
          item.id === popup.item.id
            ? {
                ...item,
                approvedQty: Number(qty),
                amount: Number(qty) * item.govtRate,
              }
            : item
        )
      );
      ToastService.success('BOQ item quantity updated.');
    }
    setPopup({ mode: 'closed' });
    setSelectedSorId('');
    setQty('');
  };

  const handleDeleteItem = (itemId: string) => {
    setData(prev => prev.filter(i => i.id !== itemId));
    ToastService.success('Item removed from BOQ compiler.');
  };

  const handleLockBOQ = () => {
    if (workBOQItems.length === 0) {
      ToastService.error('Cannot lock an empty BOQ. Add items first.');
      return;
    }
    setData(prev =>
      prev.map(item =>
        item.workId === selectedWorkId ? { ...item, isLocked: true } : item
      )
    );
    ToastService.success(
      'BOQ compiled baseline has been locked. AA/TS is now authorized.'
    );
  };

  return (
    <FormPage
      title="Admin BOQ Compilation & Baseline Lock"
      description="Compile the Bill of Quantities (BOQ) by linking approved SOR rate codes and standard quantities. Lock baseline to fix cost ceiling."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'BOQ Compilation' },
      ]}
    >
      <div className="civil-chain" style={{ marginBottom: '1.25rem' }}>
        <span className="civil-chain-item done">SOR Master</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">
          Admin BOQ Baseline Lock ← You are here
        </span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">AA / TS Sanctions</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Tender publish</span>
      </div>

      <div
        style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#92400e',
          marginBottom: '1.25rem',
        }}
      >
        <strong>🔒 ERP Fiscal Rule:</strong> The compiled BOQ establishes the
        official project budget ceiling. Site engineers cannot claim payments
        for any non-BOQ items or exceed cumulative BOQ quantities unless a
        Revised Estimate is formally sanctioned.
      </div>

      {/* Select Project & Summary Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <FormCard
          title="Select Civil Work"
          subtitle="Compile or modify BOQ baseline for the selected project"
        >
          <div style={{ marginTop: '0.5rem' }}>
            <DropDownList
              label="Work In-Progress / Registered *"
              data={works.map(w => ({
                name: `${w.workId} — ${w.name} (${w.status})`,
                value: w.id,
              }))}
              textField="name"
              optionValue="value"
              value={selectedWorkId}
              onChange={v => {
                setSelectedWorkId(v as string);
              }}
            />
          </div>
        </FormCard>

        <FormCard
          title="BOQ Summary"
          subtitle="Selected project baseline stats"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f3f4f6',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Total Items:
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                {workBOQItems.length}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f3f4f6',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                BOQ Valuation:
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#16a34a',
                }}
              >
                ₹{totalBOQAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Lock Status:
              </span>
              <span className={`civil-pill ${isLocked ? 'green' : 'amber'}`}>
                {isLocked ? '🔒 Locked Baseline' : '🔓 Draft Mode'}
              </span>
            </div>
          </div>
        </FormCard>
      </div>

      {/* BOQ Grid */}
      <FormCard
        title="BOQ Items Configuration"
        subtitle={`Work ID: ${currentWork?.workId ?? ''} — ${currentWork?.name ?? ''}`}
      >
        <GridPanel
          data={workBOQItems}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'sorCode',
              header: 'SOR Code',
              cell: (item: BOQItem) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {item.sorCode}
                </span>
              ),
            },
            {
              field: 'description',
              header: 'Description',
              cell: (item: BOQItem) => (
                <span style={{ fontSize: '0.8125rem' }}>
                  {item.description}
                </span>
              ),
            },
            {
              field: 'govtRate',
              header: 'SOR Rate',
              cell: (item: BOQItem) => (
                <span>
                  ₹{item.govtRate.toLocaleString('en-IN')} / {item.unit}
                </span>
              ),
            },
            {
              field: 'approvedQty',
              header: 'Approved Qty',
              cell: (item: BOQItem) => (
                <span style={{ fontWeight: 700 }}>
                  {item.approvedQty.toLocaleString('en-IN')} {item.unit}
                </span>
              ),
            },
            {
              field: 'amount',
              header: 'Total Value (₹)',
              cell: (item: BOQItem) => (
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: BOQItem) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {!isLocked && (
                    <>
                      <Button
                        size="small"
                        label=""
                        icon="pencil"
                        variant="outlined"
                        onClick={() => {
                          setQty(String(item.approvedQty));
                          setPopup({ mode: 'edit', item });
                        }}
                      />
                      <Button
                        size="small"
                        label=""
                        icon="trash"
                        variant="danger"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </>
                  )}
                  {isLocked && (
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      🔒 baseline locked
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {!isLocked && (
                <>
                  <Button
                    label="Add Item to BOQ"
                    icon="plus"
                    variant="primary"
                    onClick={() => {
                      setSelectedSorId('');
                      setQty('');
                      setPopup({ mode: 'add' });
                    }}
                  />
                  <Button
                    label="Lock & Save Baseline"
                    icon="lock"
                    variant="success"
                    onClick={handleLockBOQ}
                  />
                </>
              )}
              {isLocked && (
                <div
                  style={{
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.8125rem',
                    color: '#15803d',
                    fontWeight: 600,
                  }}
                >
                  ✓ BOQ Baseline is locked. Budget allocations can proceed.
                </div>
              )}
            </div>
          }
        />
      </FormCard>

      {/* Popups */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add'
            ? 'Add Item to BOQ Compilation'
            : 'Edit BOQ Item Quantity'
        }
        subtitle="Aggregate materials/labour items linked to SOR code entries."
        size="lg"
      >
        {popup.mode === 'add' && (
          <div style={{ marginBottom: '1rem' }}>
            <DropDownList
              label="Select Item from Government SOR Master *"
              data={sorItems.map(s => ({
                name: `${s.code} — ${s.description.substring(0, 70)}... (₹${s.govtRate}/${s.unit})`,
                value: s.id,
              }))}
              textField="name"
              optionValue="value"
              value={selectedSorId}
              onChange={v => {
                setSelectedSorId(v as string);
                setQty('');
              }}
            />
          </div>
        )}

        {popup.mode === 'edit' && popup.item && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#f9fafb',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              marginBottom: '1rem',
              fontSize: '0.8125rem',
            }}
          >
            <strong>Item Description:</strong> {popup.item.description} (
            {popup.item.sorCode})<br />
            <strong>Govt Standard Rate:</strong> ₹
            {popup.item.govtRate.toLocaleString('en-IN')} per {popup.item.unit}
          </div>
        )}

        <FormGrid columns={2}>
          <TextBox
            label={
              popup.mode === 'add' && selectedSor
                ? `Quantity (${selectedSor.unit}) *`
                : popup.mode === 'edit' && popup.item
                  ? `Quantity (${popup.item.unit}) *`
                  : 'Approved Quantity *'
            }
            placeholder="e.g. 500"
            value={qty}
            onChange={setQty}
            required
          />
          <TextBox
            label="Calculated Estimated Cost (₹)"
            value={
              popup.mode === 'add' && calculatedAmt > 0
                ? `₹${calculatedAmt.toLocaleString('en-IN')}`
                : popup.mode === 'edit' && popup.item && qty
                  ? `₹ ${(Number(qty) * popup.item.govtRate).toLocaleString('en-IN')}`
                  : '—'
            }
            onChange={() => {}}
            disabled
          />
        </FormGrid>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setPopup({ mode: 'closed' })}
          />
          <Button
            label={popup.mode === 'add' ? 'Add Item to BOQ' : 'Update Quantity'}
            variant="primary"
            icon="save"
            onClick={handleSaveItem}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
