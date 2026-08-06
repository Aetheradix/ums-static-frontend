import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import Modal from 'shared/components/popups/Modal';

export default function HostelFacilityMapping() {
  const { data, addRecord, updateRecord } = useHostelContext();

  const initialForm = {
    hostelId: '',
    facilityId: '',
    feeApplicable: 'N',
    status: 'Active',
    visible: 'Yes',
  };
  const [form, setForm] = useState<any>(initialForm);
  const [editForm, setEditForm] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <FormPage
      title="Hostel - Facility Mapping"
      description="Map facilities to specific hostels and configure fee requirements."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Masters',
          to: '/hostel-services/masters/hostel-facility-mapping',
        },
        { label: 'Hostel Facility Mapping' },
      ]}
    >
      <FormCard title="Map Facility" icon="add_circle">
        <FormGrid columns={3}>
          <DropDownList
            label="Hostel *"
            data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
            textField="text"
            valueField="id"
            value={form.hostelId}
            onChange={v => setForm({ ...form, hostelId: v as string })}
          />
          <DropDownList
            label="Facility *"
            data={data.facilities.map(f => ({ id: f.id, text: f.name }))}
            textField="text"
            valueField="id"
            value={form.facilityId}
            onChange={v => setForm({ ...form, facilityId: v as string })}
          />
          <DropDownList
            label="Fee Applicable"
            data={[
              { id: 'Y', text: 'Yes' },
              { id: 'N', text: 'No' },
            ]}
            textField="text"
            valueField="id"
            value={form.feeApplicable}
            onChange={v => setForm({ ...form, feeApplicable: v as string })}
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
              if (!form.hostelId || !form.facilityId) {
                alert('Please fill all required fields');
                return;
              }
              addRecord('hostelFacilities', {
                ...form,
                id: `HF${Date.now()}`,
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

      <FormCard title="Mappings List" icon="list">
        <GridPanel
          data={data.hostelFacilities}
          columns={[
            {
              field: 'hostelId',
              header: 'Hostel',
              cell: (item: any) => (
                <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
              ),
            },
            {
              field: 'facilityId',
              header: 'Facility',
              cell: (item: any) => (
                <>{data.facilities.find(f => f.id === item.facilityId)?.name}</>
              ),
            },
            {
              field: 'feeApplicable',
              header: 'Fee Applicable',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${item.feeApplicable === 'Y' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {item.feeApplicable === 'Y' ? 'Yes' : 'No'}
                </span>
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
        header="Edit Hostel Facility Mapping"
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
              <DropDownList
                label="Hostel *"
                data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
                textField="text"
                valueField="id"
                value={editForm.hostelId}
                onChange={v =>
                  setEditForm({ ...editForm, hostelId: v as string })
                }
              />
              <DropDownList
                label="Facility *"
                data={data.facilities.map(f => ({ id: f.id, text: f.name }))}
                textField="text"
                valueField="id"
                value={editForm.facilityId}
                onChange={v =>
                  setEditForm({ ...editForm, facilityId: v as string })
                }
              />
              <DropDownList
                label="Fee Applicable"
                data={[
                  { id: 'Y', text: 'Yes' },
                  { id: 'N', text: 'No' },
                ]}
                textField="text"
                valueField="id"
                value={editForm.feeApplicable}
                onChange={v =>
                  setEditForm({ ...editForm, feeApplicable: v as string })
                }
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
                  if (!editForm.hostelId || !editForm.facilityId) {
                    alert('Please fill all required fields');
                    return;
                  }
                  updateRecord('hostelFacilities', editForm.id, editForm);
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
