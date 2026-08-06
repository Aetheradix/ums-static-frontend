import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function FeeComponentMaster() {
  const { data, addRecord, updateRecord } = useHostelContext();

  const initialForm = {
    name: '',
    facilityId: '',
    amount: '',
    oneTime: 'N',
    lateFeeApplicable: 'Y',
    billingStartDate: '',
    billingLastDate: '',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <FormPage
      title="Fee Component Master"
      description="Define hostel fees, security deposits, and optional facility charges."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Masters', to: '/hostel-services/masters/fee-component' },
        { label: 'Fee Component Master' },
      ]}
    >
      <FormCard title="Add Fee Component" icon="add_circle">
        <FormGrid columns={3}>
          <TextBox
            label="Component Name *"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
            placeholder="e.g. Security Deposit"
          />
          <DropDownList
            label="Linked Facility (Optional)"
            data={[
              { id: '', text: 'None (Global Fee)' },
              ...data.facilities.map(f => ({ id: f.id, text: f.name })),
            ]}
            textField="text"
            valueField="id"
            value={form.facilityId}
            onChange={v => setForm({ ...form, facilityId: v as string })}
          />
          <TextBox
            label="Amount (₹) *"
            value={form.amount}
            onChange={v => setForm({ ...form, amount: v })}
          />

          <DropDownList
            label="One Time Fee?"
            data={[
              { id: 'Y', text: 'Yes' },
              { id: 'N', text: 'No (Recurring)' },
            ]}
            textField="text"
            valueField="id"
            value={form.oneTime}
            onChange={v => setForm({ ...form, oneTime: v as string })}
          />
          <DropDownList
            label="Late Fee Applicable?"
            data={[
              { id: 'Y', text: 'Yes' },
              { id: 'N', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.lateFeeApplicable}
            onChange={v => setForm({ ...form, lateFeeApplicable: v as string })}
          />

          <TextBox
            label="Billing Start Date"
            type="date"
            value={form.billingStartDate}
            onChange={v => setForm({ ...form, billingStartDate: v })}
          />
          <TextBox
            label="Billing Last Date"
            type="date"
            value={form.billingLastDate}
            onChange={v => setForm({ ...form, billingLastDate: v })}
          />

          <DropDownList
            label="Status"
            data={[
              { id: 'Active', text: 'Active' },
              { id: 'Inactive', text: 'Inactive' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Save"
            variant="primary"
            onClick={() => {
              if (!form.name || !form.amount) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('feeComponents', {
                ...form,
                amount: Number(form.amount),
                id: `FC${Date.now()}`,
              });
              setForm(initialForm);
            }}
          />
          <Button
            label="Clear"
            variant="outlined"
            onClick={() => setForm(initialForm)}
          />
        </div>
      </FormCard>

      <FormCard title="Fee Components List" icon="list">
        <GridPanel
          data={data.feeComponents}
          columns={[
            { field: 'name', header: 'Fee Name' },
            { field: 'amount', header: 'Amount (₹)' },
            {
              field: 'facilityId',
              header: 'Linked Facility',
              cell: (item: any) => (
                <>
                  {item.facilityId
                    ? data.facilities.find(f => f.id === item.facilityId)?.name
                    : 'N/A'}
                </>
              ),
            },
            {
              field: 'oneTime',
              header: 'Type',
              cell: (item: any) => (
                <>{item.oneTime === 'Y' ? 'One Time' : 'Recurring'}</>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              field: 'actions',
              header: 'Action',
              cell: (item: any) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditForm(item);
                      setIsEditModalOpen(true);
                    }}
                    className="p-1.5 border border-gray-200 rounded shadow-sm hover:bg-gray-50 text-blue-600 flex items-center justify-center"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </button>
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <Modal
        header="Edit Fee Component"
        visible={isEditModalOpen}
        onHide={() => {
          setIsEditModalOpen(false);
          setEditForm(null);
        }}
        size="large"
      >
        {editForm && (
          <div className="p-4">
            <FormGrid columns={3}>
              <TextBox
                label="Component Name *"
                value={editForm.name}
                onChange={v => setEditForm({ ...editForm, name: v })}
                placeholder="e.g. Security Deposit"
              />
              <DropDownList
                label="Linked Facility (Optional)"
                data={[
                  { id: '', text: 'None (Global Fee)' },
                  ...data.facilities.map(f => ({ id: f.id, text: f.name })),
                ]}
                textField="text"
                valueField="id"
                value={editForm.facilityId}
                onChange={v =>
                  setEditForm({ ...editForm, facilityId: v as string })
                }
              />
              <TextBox
                label="Amount (₹) *"
                value={editForm.amount}
                onChange={v => setEditForm({ ...editForm, amount: v })}
              />

              <DropDownList
                label="One Time Fee?"
                data={[
                  { id: 'Y', text: 'Yes' },
                  { id: 'N', text: 'No (Recurring)' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.oneTime}
                onChange={v =>
                  setEditForm({ ...editForm, oneTime: v as string })
                }
              />
              <DropDownList
                label="Late Fee Applicable?"
                data={[
                  { id: 'Y', text: 'Yes' },
                  { id: 'N', text: 'No' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.lateFeeApplicable}
                onChange={v =>
                  setEditForm({ ...editForm, lateFeeApplicable: v as string })
                }
              />

              <TextBox
                label="Billing Start Date"
                type="date"
                value={editForm.billingStartDate}
                onChange={v =>
                  setEditForm({ ...editForm, billingStartDate: v })
                }
              />
              <TextBox
                label="Billing Last Date"
                type="date"
                value={editForm.billingLastDate}
                onChange={v => setEditForm({ ...editForm, billingLastDate: v })}
              />

              <DropDownList
                label="Status"
                data={[
                  { id: 'Active', text: 'Active' },
                  { id: 'Inactive', text: 'Inactive' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.status}
                onChange={v =>
                  setEditForm({ ...editForm, status: v as string })
                }
              />
            </FormGrid>
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditForm(null);
                }}
              />
              <Button
                label="Update"
                variant="primary"
                onClick={() => {
                  if (!editForm.name || !editForm.amount) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('feeComponents', editForm.id, {
                    ...editForm,
                    amount: Number(editForm.amount),
                  });
                  setIsEditModalOpen(false);
                  setEditForm(null);
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </FormPage>
  );
}
