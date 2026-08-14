import { useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { NumberBox, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { APPLICATION_FEE_DATA } from '../data';
import type { ApplicationFeeItem } from '../data';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ApplicationFeeItem };

const EMPTY_FORM = { feeType: '', amount: null as number | null };

export default function List() {
  const [rows, setRows] = useState<ApplicationFeeItem[]>(APPLICATION_FEE_DATA);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = () => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: ApplicationFeeItem) => {
    setForm({ feeType: item.feeType, amount: item.amount });
    setPopup({ mode: 'edit', item });
  };

  const isFormValid = form.feeType.trim() && form.amount && form.amount > 0;

  const handleSave = () => {
    if (!isFormValid) return;

    if (popup.mode === 'create') {
      setRows(prev => [
        ...prev,
        {
          applicationFeeId:
            Math.max(0, ...prev.map(r => r.applicationFeeId)) + 1,
          feeType: form.feeType.trim(),
          amount: form.amount as number,
          isActive: true,
        },
      ]);
      ToastService.success('Fee type added successfully.');
    } else if (popup.mode === 'edit') {
      const editingId = popup.item.applicationFeeId;
      setRows(prev =>
        prev.map(r =>
          r.applicationFeeId === editingId
            ? {
                ...r,
                feeType: form.feeType.trim(),
                amount: form.amount as number,
              }
            : r
        )
      );
      ToastService.success('Fee type updated successfully.');
    }
    closePopup();
  };

  const handleToggleStatus = (item: ApplicationFeeItem) => {
    setRows(prev =>
      prev.map(r =>
        r.applicationFeeId === item.applicationFeeId
          ? { ...r, isActive: !r.isActive }
          : r
      )
    );
  };

  return (
    <FormPage
      title="Application Fees"
      description="Manage the fee types collected with college registration applications."
    >
      <FormCard>
        <GridPanel
          data={rows}
          onEdit={openEdit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '40px',
              sortable: false,
            },
            { field: 'feeType', header: 'Fee Type' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (item: ApplicationFeeItem) => (
                <span>
                  {new Intl.NumberFormat('en-IN').format(item.amount)}
                </span>
              ),
            },
            {
              cell: (item: ApplicationFeeItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Fee Type"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
          searchFields={['feeType']}
        />
      </FormCard>

      {popup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={popup.mode === 'create' ? 'Add Fee Type' : 'Edit Fee Type'}
          subtitle="Fee type name and the amount to be collected."
          footer={
            <>
              <Button label="Cancel" variant="outlined" onClick={closePopup} />
              <Button
                label="Save"
                variant="primary"
                icon="save"
                disabled={!isFormValid}
                onClick={handleSave}
              />
            </>
          }
        >
          <div className="p-4">
            <FormGrid columns={1}>
              <TextBox
                label="Fee Type"
                placeholder="e.g. Application Fees"
                value={form.feeType}
                onChange={val =>
                  setForm(prev => ({ ...prev, feeType: val ?? '' }))
                }
                required
              />
              <NumberBox
                label="Amount (₹)"
                placeholder="e.g. 1500"
                value={form.amount ?? undefined}
                onChange={val =>
                  setForm(prev => ({ ...prev, amount: val ?? null }))
                }
                required
              />
            </FormGrid>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
