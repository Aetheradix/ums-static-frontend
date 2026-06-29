import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type ApprovalHierarchy, initialApprovalHierarchies } from '../../data';
import { essentialServicesUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ApprovalHierarchy };

const TYPE_OPTIONS = [
  { name: 'Parking', value: 'Parking' },
  { name: 'Conference Hall', value: 'Conference Hall' },
  { name: 'Guest House', value: 'Guest House' },
  { name: 'Transport Request', value: 'Transport Request' },
];

const ACTIVE_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM: {
  type: 'Parking' | 'Conference Hall' | 'Guest House' | 'Transport Request';
  organisationUnit: string;
  verifierDetail: string;
  approverDetail: string;
  status: 'Active' | 'Inactive';
} = {
  type: 'Parking',
  organisationUnit: '',
  verifierDetail: '',
  approverDetail: '',
  status: 'Active',
};

export default function ApprovalHierarchyPage() {
  const [data, setData] = useState<ApprovalHierarchy[]>(
    initialApprovalHierarchies
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: ApprovalHierarchy) => {
    setForm({
      type: item.type,
      organisationUnit: item.organisationUnit,
      verifierDetail: item.verifierDetail,
      approverDetail: item.approverDetail,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: ApprovalHierarchy = {
        id: String(Date.now()),
        type: form.type,
        organisationUnit: form.organisationUnit,
        verifierDetail: form.verifierDetail,
        approverDetail: form.approverDetail,
        status: form.status,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Approval hierarchy configured successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(h =>
          h.id === popup.item.id
            ? {
                ...h,
                type: form.type,
                organisationUnit: form.organisationUnit,
                verifierDetail: form.verifierDetail,
                approverDetail: form.approverDetail,
                status: form.status,
              }
            : h
        )
      );
      ToastService.success('Approval hierarchy updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Approval Hierarchy Master"
      description="Define separate checking and final approval workflows for Parking, Conference, Guest House, and Transport services."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Approval Hierarchy' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            {
              cell: (_, option) => (
                <span className="font-semibold text-gray-700">
                  {option.rowIndex + 1}
                </span>
              ),
              width: '50px',
            },
            { field: 'type', header: 'Service Type' },
            { field: 'organisationUnit', header: 'Organisation Unit' },
            { field: 'verifierDetail', header: 'Verifier Authority (Level 1)' },
            { field: 'approverDetail', header: 'Approver Authority (Level 2)' },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
              cell: (item: ApprovalHierarchy) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Hierarchy"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create'
            ? 'Configure Approval Flow'
            : 'Edit Approval Flow'
        }
        subtitle="Specify levels and verifier/approver mapping."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Service / Facility Type"
            data={TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Type"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: v as any }))}
            required
          />
          <TextBox
            label="Organisation Unit / Department"
            placeholder="e.g. School of Engineering"
            value={form.organisationUnit}
            onChange={v => setForm(f => ({ ...f, organisationUnit: v }))}
            required
          />
          <TextBox
            label="Verifier Detail (Level 1 Check)"
            placeholder="e.g. Assistant Registrar / Head Clerk"
            value={form.verifierDetail}
            onChange={v => setForm(f => ({ ...f, verifierDetail: v }))}
            required
          />
          <TextBox
            label="Approver Detail (Level 2 Final)"
            placeholder="e.g. Registrar / Estate Officer"
            value={form.approverDetail}
            onChange={v => setForm(f => ({ ...f, approverDetail: v }))}
            required
          />
          <DropDownList
            label="Status"
            data={ACTIVE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Status"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Save Hierarchy"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
