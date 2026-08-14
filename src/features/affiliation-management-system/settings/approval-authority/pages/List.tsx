import { useState } from 'react';
import { ToastService } from 'services';
import { Button, StatusButton } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { APPROVAL_AUTHORITY_DATA } from '../data';
import type { ApprovalAuthorityItem } from '../data';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ApprovalAuthorityItem };

const EMPTY_FORM = {
  educationType: '',
  authorityName: '',
  documentLabel: '',
};

export default function List() {
  const [rows, setRows] = useState<ApprovalAuthorityItem[]>(
    APPROVAL_AUTHORITY_DATA
  );
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

  const openEdit = (item: ApprovalAuthorityItem) => {
    setForm({
      educationType: item.educationType,
      authorityName: item.authorityName,
      documentLabel: item.documentLabel,
    });
    setPopup({ mode: 'edit', item });
  };

  const isFormValid =
    form.educationType.trim() &&
    form.authorityName.trim() &&
    form.documentLabel.trim();

  const handleSave = () => {
    if (!isFormValid) return;

    if (popup.mode === 'create') {
      setRows(prev => [
        ...prev,
        {
          approvalAuthorityId:
            Math.max(0, ...prev.map(r => r.approvalAuthorityId)) + 1,
          educationType: form.educationType.trim(),
          authorityName: form.authorityName.trim(),
          documentLabel: form.documentLabel.trim(),
          isActive: true,
        },
      ]);
      ToastService.success('Approval authority mapping added successfully.');
    } else if (popup.mode === 'edit') {
      const editingId = popup.item.approvalAuthorityId;
      setRows(prev =>
        prev.map(r =>
          r.approvalAuthorityId === editingId
            ? {
                ...r,
                educationType: form.educationType.trim(),
                authorityName: form.authorityName.trim(),
                documentLabel: form.documentLabel.trim(),
              }
            : r
        )
      );
      ToastService.success('Approval authority mapping updated successfully.');
    }
    closePopup();
  };

  const handleToggleStatus = (item: ApprovalAuthorityItem) => {
    setRows(prev =>
      prev.map(r =>
        r.approvalAuthorityId === item.approvalAuthorityId
          ? { ...r, isActive: !r.isActive }
          : r
      )
    );
  };

  return (
    <FormPage
      title="Approval / Regulatory Authority"
      description="Map each education type to its approval authority and the document label shown on the college registration form."
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
            { field: 'educationType', header: 'Education Type' },
            { field: 'authorityName', header: 'Approval Authority' },
            { field: 'documentLabel', header: 'Document Upload Label' },
            {
              cell: (item: ApprovalAuthorityItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Mapping"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
          searchFields={['educationType', 'authorityName', 'documentLabel']}
        />
      </FormCard>

      {popup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={
            popup.mode === 'create'
              ? 'Add Authority Mapping'
              : 'Edit Authority Mapping'
          }
          subtitle="Education type, approval authority and the upload label used on the registration form."
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
                label="Education Type"
                placeholder="e.g. Technical & Management Education"
                value={form.educationType}
                onChange={val =>
                  setForm(prev => ({ ...prev, educationType: val ?? '' }))
                }
                required
              />
              <TextBox
                label="Approval Authority"
                placeholder="e.g. AICTE"
                value={form.authorityName}
                onChange={val =>
                  setForm(prev => ({ ...prev, authorityName: val ?? '' }))
                }
                required
              />
              <TextBox
                label="Document Upload Label"
                placeholder="e.g. Upload AICTE Approval / NOC Document"
                value={form.documentLabel}
                onChange={val =>
                  setForm(prev => ({ ...prev, documentLabel: val ?? '' }))
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
