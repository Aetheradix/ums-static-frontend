import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type BOQItem,
  type CivilWork,
  boqItems as initialBOQ,
  civilWorks,
  sorItems,
  initialSORTypes,
  initialSORChapters,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; item: BOQItem };

export default function AdminBOQCompilation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const workIdParam = searchParams.get('workId') || '1';

  const [works, setWorks] = useState<CivilWork[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [data, setData] = useState<BOQItem[]>(initialBOQ);
  const [selectedWorkId, setSelectedWorkId] = useState<string>(workIdParam);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Add/Edit Form State
  const [selectedSorId, setSelectedSorId] = useState('');
  const [qty, setQty] = useState('');
  const [nonSorDescription, setNonSorDescription] = useState('');
  const [nonSorRate, setNonSorRate] = useState('');
  const [nonSorUnit, setNonSorUnit] = useState('');

  // SOR Hierarchy Masters State
  const [sorTypes] = useState<CivilManagement.SORType[]>(() => {
    const saved = localStorage.getItem('civil_sor_types');
    return saved ? JSON.parse(saved) : initialSORTypes;
  });
  const [sorChapters] = useState<CivilManagement.SORChapter[]>(() => {
    const saved = localStorage.getItem('civil_sor_chapters');
    return saved ? JSON.parse(saved) : initialSORChapters;
  });
  const [sorTypeFilter, setSorTypeFilter] = useState('ALL');
  const [sorChapterFilter, setSorChapterFilter] = useState('ALL');

  useEffect(() => {
    if (workIdParam && workIdParam !== selectedWorkId) {
      setSelectedWorkId(workIdParam);
    }
  }, [workIdParam]);

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

  const currentWork = works.find(
    w => String(w.workRegistrationId || w.id) === selectedWorkId
  );
  const workBOQItems = data.filter(b => String(b.workId) === selectedWorkId);
  const totalBOQAmount = workBOQItems.reduce((s, i) => s + i.amount, 0);
  const isLocked =
    workBOQItems.length > 0 && workBOQItems.every(i => i.isLocked);

  const getSorItem = () => sorItems.find(s => s.id === selectedSorId);
  const selectedSor = getSorItem();

  // Non-SOR detection
  const isNonSOR =
    currentWork?.workBasis === 'Non-SOR' || currentWork?.workBasis === 'NonSor';

  const calculatedAmt = (() => {
    if (isNonSOR) {
      const rate = Number(nonSorRate);
      const q = Number(qty);
      return rate > 0 && q > 0 ? rate * q : 0;
    }
    return selectedSor && qty ? Number(qty) * selectedSor.govtRate : 0;
  })();

  const handleWorkChange = (val: unknown) => {
    const strVal = String(val || '');
    setSelectedWorkId(strVal);
    if (strVal) {
      setSearchParams({ workId: strVal });
    } else {
      setSearchParams({});
    }
  };

  const handleSaveItem = () => {
    if (popup.mode === 'add') {
      if (isNonSOR) {
        if (!nonSorDescription.trim()) {
          ToastService.error('Item description is required for Non-SOR work.');
          return;
        }
        if (!nonSorRate || Number(nonSorRate) <= 0) {
          ToastService.error('Rate must be greater than 0 for Non-SOR item.');
          return;
        }
        if (!qty || Number(qty) <= 0) {
          ToastService.error('Quantity must be greater than 0.');
          return;
        }
        const refSor = sorItems[0];
        const newItem: BOQItem = {
          id: String(Date.now()),
          boqId: `BOQ-${selectedWorkId.padStart(3, '0')}`,
          workId: selectedWorkId,
          sorItemId: refSor?.id ?? 'non-sor',
          sorCode: 'NON-SOR',
          description: nonSorDescription,
          unit: nonSorUnit || refSor?.unit || 'Unit',
          govtRate: Number(nonSorRate),
          approvedQty: Number(qty),
          amount: calculatedAmt,
          isLocked: false,
        };
        setData(prev => [...prev, newItem]);
        ToastService.success('Non-SOR item added to BOQ compiler.');
      } else {
        if (!selectedSorId) {
          ToastService.error('SOR Item must be selected.');
          return;
        }
        if (!qty || Number(qty) <= 0) {
          ToastService.error('Quantity must be greater than 0.');
          return;
        }
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
      }
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
    setNonSorDescription('');
    setNonSorRate('');
    setNonSorUnit('');
  };

  const handleDeleteItem = (item: BOQItem) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete line item "${item.sorCode || item.description}"? This action cannot be undone.`
    );
    if (!isConfirmed) return;

    setData(prev => prev.filter(i => i.id !== item.id));
    ToastService.success('Item removed from BOQ compiler.');
  };

  const handleLockBOQ = () => {
    if (workBOQItems.length === 0) {
      ToastService.error('Cannot lock an empty BOQ. Add items first.');
      return;
    }

    const isConfirmed = window.confirm(
      `Locking the baseline will freeze all ${workBOQItems.length} line items totalling ₹${totalBOQAmount.toLocaleString('en-IN')}. Once locked, items cannot be edited or deleted without administrative override.`
    );
    if (!isConfirmed) return;

    setData(prev =>
      prev.map(item =>
        String(item.workId) === selectedWorkId
          ? { ...item, isLocked: true }
          : item
      )
    );
    ToastService.success(
      'BOQ compiled baseline has been locked. AA/TS is now authorized.'
    );
  };

  const handleApproveBOQ = () => {
    if (workBOQItems.length === 0) {
      ToastService.error('Cannot approve an empty BOQ. Add items first.');
      return;
    }

    const isConfirmed = window.confirm(
      `Approve BOQ for "${currentWork?.name || selectedWorkId}" with total valuation of ₹${totalBOQAmount.toLocaleString('en-IN')}? This will update the work status and lock the baseline.`
    );
    if (!isConfirmed) return;

    setData(prev =>
      prev.map(item =>
        String(item.workId) === selectedWorkId
          ? { ...item, isLocked: true }
          : item
      )
    );
    setWorks(prev => {
      const updated = prev.map(w =>
        String(w.workRegistrationId || w.id) === selectedWorkId
          ? { ...w, status: 'AA Approved' }
          : w
      );
      localStorage.setItem('civil_works', JSON.stringify(updated));
      return updated;
    });
    ToastService.success(
      'BOQ approved by Admin. Baseline is locked for Administrative Sanction.'
    );
  };

  const workOptions = works.map(w => {
    const basisBadge =
      w.workBasis === 'Non-SOR' || w.workBasis === 'NonSor'
        ? 'Non-SOR'
        : w.workBasis === 'SOR' || w.workBasis === 'SOR Based'
          ? 'SOR Based'
          : 'BOQ Based';
    const id = String(w.workRegistrationId || w.id);
    const code = w.code || w.workId || `CW-${id.padStart(3, '0')}`;
    return {
      value: id,
      text: `${code} — ${w.name} [${basisBadge}]`,
    };
  });

  return (
    <FormPage
      title="Admin BOQ Compilation & Baseline Lock"
      description="Compile the Bill of Quantities (BOQ) by linking approved SOR rate codes and standard quantities. Lock baseline to fix cost ceiling."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
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
      <FormGrid columns={2}>
        <FormCard
          title="Select Civil Work"
          subtitle="Compile or modify BOQ baseline for the selected project"
        >
          <div style={{ marginTop: '0.5rem' }}>
            <DropDownList
              label="Work In-Progress / Registered *"
              data={workOptions}
              textField="text"
              optionValue="value"
              value={selectedWorkId}
              onChange={handleWorkChange}
              placeholder="Search by work code or project name..."
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
                ₹
                {totalBOQAmount.toLocaleString('en-IN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Lock Status:
              </span>
              <StatusBadge
                label={isLocked ? 'Locked Baseline' : 'Draft Mode'}
                variant={isLocked ? 'approved' : 'pending'}
              />
            </div>
          </div>
        </FormCard>
      </FormGrid>

      {/* BOQ Grid */}
      <FormCard
        title="BOQ Items Configuration"
        subtitle={
          currentWork
            ? `Work ID: ${currentWork.code || currentWork.workId} — ${currentWork.name}`
            : undefined
        }
        headerAction={
          isLocked ? (
            <StatusBadge label="Baseline Locked" variant="approved" />
          ) : undefined
        }
      >
        <GridPanel
          data={workBOQItems}
          columns={[
            {
              field: 'id',
              header: '#',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              width: '50px',
            },
            {
              field: 'sorCode',
              header: 'Serial Number',
              cell: (item: BOQItem) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {item.sorCode || '—'}
                </span>
              ),
              width: '120px',
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
              width: '130px',
            },
            {
              field: 'approvedQty',
              header: 'Approved Qty',
              cell: (item: BOQItem) => (
                <span style={{ fontWeight: 700 }}>
                  {item.approvedQty.toLocaleString('en-IN')} {item.unit}
                </span>
              ),
              width: '130px',
            },
            {
              field: 'amount',
              header: 'Total Value (₹)',
              cell: (item: BOQItem) => (
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  ₹{' '}
                  {item.amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              ),
              width: '140px',
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: BOQItem) =>
                item.isLocked || isLocked ? (
                  <StatusBadge label="Baseline Locked" variant="approved" />
                ) : (
                  <GridActionButtons
                    onEdit={() => {
                      setQty(String(item.approvedQty));
                      setPopup({ mode: 'edit', item });
                    }}
                    onDelete={() => handleDeleteItem(item)}
                    editTooltip="Edit Line Item"
                    deleteTooltip="Delete Line Item"
                  />
                ),
              width: '130px',
            },
          ]}
          toolbar={
            !isLocked ? (
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <Button
                  label="Add Item to BOQ"
                  icon="plus"
                  variant="primary"
                  onClick={() => {
                    setSelectedSorId('');
                    setQty('');
                    setNonSorDescription('');
                    setNonSorRate('');
                    setNonSorUnit('');
                    setPopup({ mode: 'add' });
                  }}
                />
                <Button
                  label="Approve BOQ (Admin)"
                  icon="check"
                  variant="success"
                  onClick={handleApproveBOQ}
                  disabled={workBOQItems.length === 0}
                />
                <Button
                  label="Lock Baseline"
                  icon="lock"
                  variant="outlined"
                  onClick={handleLockBOQ}
                  disabled={workBOQItems.length === 0}
                />
              </div>
            ) : (
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
                ✓ BOQ Baseline is locked. Administrative and Technical Sanctions
                can proceed.
              </div>
            )
          }
          searchBox
          searchPlaceholder="Search BOQ items..."
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
          <div>
            {isNonSOR ? (
              <div>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    fontSize: '0.8125rem',
                    color: '#166534',
                  }}
                >
                  <strong>ℹ️ Non-SOR Work:</strong> This work is classified as{' '}
                  <strong>Non-SOR</strong>. Please provide a custom item
                  description, unit, rate, and quantity for this item.
                </div>
                <FormGrid columns={2}>
                  <TextBox
                    label="Item Description *"
                    placeholder="e.g. Providing and laying interlocking paver blocks"
                    value={nonSorDescription}
                    onChange={setNonSorDescription}
                    required
                  />
                  <TextBox
                    label="Unit *"
                    placeholder="e.g. Sqm, Cum, RM"
                    value={nonSorUnit}
                    onChange={setNonSorUnit}
                  />
                  <TextBox
                    label="Rate per Unit (₹) *"
                    placeholder="e.g. 850"
                    value={nonSorRate}
                    onChange={setNonSorRate}
                    required
                  />
                  <TextBox
                    label="Approved Quantity *"
                    placeholder="e.g. 500"
                    value={qty}
                    onChange={setQty}
                    required
                  />
                </FormGrid>
                {calculatedAmt > 0 && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8125rem',
                      color: '#1d4ed8',
                      fontWeight: 600,
                    }}
                  >
                    💰 Estimated Total: ₹{calculatedAmt.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <DropDownList
                    label="SOR Classification (Type)"
                    data={[
                      { label: 'All Classifications', value: 'ALL' },
                      ...sorTypes.map(t => ({
                        label: `${t.code} — ${t.name}`,
                        value: t.id,
                      })),
                    ]}
                    textField="label"
                    optionValue="value"
                    value={sorTypeFilter}
                    onChange={v => {
                      setSorTypeFilter(v as string);
                      setSorChapterFilter('ALL');
                    }}
                  />
                  <DropDownList
                    label="SOR Chapter"
                    data={[
                      { label: 'All Chapters', value: 'ALL' },
                      ...sorChapters
                        .filter(
                          c =>
                            sorTypeFilter === 'ALL' ||
                            c.sorTypeId === sorTypeFilter
                        )
                        .map(c => ({
                          label: `Ch-${c.chapterNo}: ${c.name}`,
                          value: c.id,
                        })),
                    ]}
                    textField="label"
                    optionValue="value"
                    value={sorChapterFilter}
                    onChange={v => setSorChapterFilter(v as string)}
                  />
                </div>
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
          {!isNonSOR && (
            <>
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
            </>
          )}
          {isNonSOR && popup.mode === 'edit' && popup.item && (
            <>
              <TextBox
                label={`Quantity (${popup.item.unit}) *`}
                placeholder="e.g. 500"
                value={qty}
                onChange={setQty}
                required
              />
              <TextBox
                label="Calculated Cost (₹)"
                value={
                  qty
                    ? `₹ ${(Number(qty) * popup.item.govtRate).toLocaleString('en-IN')}`
                    : '—'
                }
                onChange={() => {}}
                disabled
              />
            </>
          )}
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
