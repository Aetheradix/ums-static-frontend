import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type MaintenanceRequest,
  initialMaintenanceRequests,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'edit'; item: MaintenanceRequest };

const REQ_STATUS_OPTIONS = [
  { name: 'Assigned', value: 'Assigned' },
  { name: 'Inspection Pending', value: 'Inspection Pending' },
  { name: 'Inspection Approved', value: 'Inspection Approved' },
  { name: 'Completed', value: 'Completed' },
];

export default function AssignedRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(() =>
    initialMaintenanceRequests.filter(m => m.assignedTo !== '')
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState({ status: '', closureReport: '' });

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm({ status: '', closureReport: '' });
  }, []);

  const handleSave = () => {
    if (popup.mode === 'edit') {
      setRequests(prev =>
        prev.map(r =>
          r.id === popup.item.id
            ? {
                ...r,
                status: form.status as any,
                closureReport: form.closureReport,
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : r
        )
      );
      ToastService.success('Assigned Request updated successfully.');
    }
    closePopup();
  };

  const openEdit = (item: MaintenanceRequest) => {
    setForm({ status: item.status, closureReport: item.closureReport });
    setPopup({ mode: 'edit', item });
  };

  return (
    <FormPage
      title="Assigned Requests"
      description="View and update maintenance requests assigned to you or your team."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Assigned Requests' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={requests}
          onEdit={openEdit}
          columns={[
            {
              cell: (_: unknown, option: { rowIndex: number }) => (
                <span className="font-semibold text-gray-700">
                  {option.rowIndex + 1}
                </span>
              ),
              width: '50px',
            },
            { field: 'id', header: 'Request ID', width: '110px' },
            { field: 'requestType', header: 'Type', width: '180px' },
            {
              field: 'priority',
              header: 'Priority',
              width: '100px',
              cell: (item: MaintenanceRequest) => (
                <StatusBadge
                  label={item.priority}
                  variant={
                    item.priority === 'Critical' || item.priority === 'High'
                      ? 'rejected'
                      : 'neutral'
                  }
                />
              ),
            },
            { field: 'entityId', header: 'Entity / Location' },
            {
              field: 'assignedTo',
              header: 'Assigned Maintainer',
              width: '180px',
            },
            { field: 'updatedDate', header: 'Last Update', width: '110px' },
            {
              field: 'status',
              header: 'Status',
              width: '150px',
              cell: (item: MaintenanceRequest) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Completed' ? 'approved' : 'pending'}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Update Assigned Request Status"
        subtitle="Update request completion status and record closure reports."
        size="default"
      >
        <FormGrid columns={1}>
          <DropDownList
            label="Work Status"
            data={REQ_STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: String(v ?? '') }))}
            required
          />
          <TextArea
            label="Closure Report / Remarks"
            placeholder="Record the actions taken to resolve this maintenance issue..."
            value={form.closureReport}
            onChange={v => setForm(f => ({ ...f, closureReport: v }))}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Update Status"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
