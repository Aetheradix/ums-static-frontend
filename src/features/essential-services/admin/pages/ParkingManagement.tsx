import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type ParkingRequest,
  initialParkingRequests,
  parkingEndYearSetting as initialEndYear,
} from '../../data';
import { essentialServicesUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ParkingRequest }
  | { mode: 'view'; item: ParkingRequest }
  | { mode: 'approve'; item: ParkingRequest };

const ACCOUNT_OPTIONS = [
  { name: 'Employee', value: 'Employee' },
  { name: 'Administrative', value: 'Administrative' },
];

const VEHICLE_OPTIONS = [
  { name: 'Two-Wheeler', value: 'Two-Wheeler' },
  { name: 'Four-Wheeler', value: 'Four-Wheeler' },
];

const STATUS_OPTIONS = [
  { name: 'Pending', value: 'Pending' },
  { name: 'Approved', value: 'Approved' },
  { name: 'Rejected', value: 'Rejected' },
  { name: 'Cancelled', value: 'Cancelled' },
];

const EMPTY_FORM: {
  accountType: 'Employee' | 'Administrative';
  userName: string;
  vehicleType: 'Two-Wheeler' | 'Four-Wheeler';
  registrationNumber: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Approved' | 'Rejected' | 'Cancelled' | 'Pending';
} = {
  accountType: 'Employee',
  userName: '',
  vehicleType: 'Two-Wheeler',
  registrationNumber: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'Pending',
};

export default function ParkingManagement() {
  const [data, setData] = useState<ParkingRequest[]>(initialParkingRequests);
  const [endYear, setEndYear] = useState(initialEndYear);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [approvalForm, setApprovalForm] = useState({
    allottedSlot: '',
    reason: '',
    status: 'Approved' as 'Approved' | 'Rejected' | 'Cancelled',
  });

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
    setApprovalForm({ allottedSlot: '', reason: '', status: 'Approved' });
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: ParkingRequest) => {
    setForm({
      accountType: item.accountType,
      userName: item.userName,
      vehicleType: item.vehicleType,
      registrationNumber: item.registrationNumber,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const openView = (item: ParkingRequest) => {
    setPopup({ mode: 'view', item });
  };

  const openApprove = (item: ParkingRequest) => {
    setApprovalForm({
      allottedSlot: item.allottedSlot || '',
      reason: item.reason || '',
      status: 'Approved',
    });
    setPopup({ mode: 'approve', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: ParkingRequest = {
        id: `PRK-00${data.length + 1}`,
        accountType: form.accountType,
        userName: form.userName,
        vehicleType: form.vehicleType,
        registrationNumber: form.registrationNumber,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Parking request created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(r =>
          r.id === popup.item.id
            ? {
                ...r,
                accountType: form.accountType,
                userName: form.userName,
                vehicleType: form.vehicleType,
                registrationNumber: form.registrationNumber,
                description: form.description,
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
              }
            : r
        )
      );
      ToastService.success('Parking request updated successfully.');
    }
    closePopup();
  };

  const handleSaveApproval = () => {
    if (popup.mode === 'approve') {
      setData(prev =>
        prev.map(r =>
          r.id === popup.item.id
            ? {
                ...r,
                status: approvalForm.status,
                allottedSlot: approvalForm.allottedSlot,
                reason: approvalForm.reason,
              }
            : r
        )
      );
      ToastService.success(
        `Parking request ${approvalForm.status} successfully.`
      );
    }
    closePopup();
  };

  const handleCancelRequest = (item: ParkingRequest) => {
    setData(prev =>
      prev.map(r =>
        r.id === item.id ? { ...r, status: 'Cancelled' as const } : r
      )
    );
    ToastService.success('Parking request cancelled.');
  };

  const handleSaveConfig = () => {
    ToastService.success(`Parking End Year limit updated to: ${endYear}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Pending':
        return 'pending';
      case 'Rejected':
        return 'rejected';
      case 'Cancelled':
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Parking Section"
      description="Centrally manage parking allocations, enforce maximum end years, allot slots, and verify vehicle registrations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Parking Section' },
      ]}
    >
      {/* Configuration Section */}
      <div className="mb-6">
        <FormCard title="Parking System-Level Configuration" icon="cog">
          <div className="flex items-end gap-4 max-w-md">
            <TextBox
              label="Parking End Year (Max permissible end year for bookings)"
              placeholder="e.g. 2030"
              value={String(endYear)}
              onChange={v => setEndYear(Number(v))}
              required
            />
            <Button
              label="Update Limit"
              variant="primary"
              onClick={handleSaveConfig}
            />
          </div>
        </FormCard>
      </div>

      {/* Grid List */}
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
            { field: 'id', header: 'Request ID', width: '120px' },
            { field: 'accountType', header: 'Account Type', width: '130px' },
            { field: 'userName', header: 'Name' },
            { field: 'vehicleType', header: 'Vehicle', width: '130px' },
            {
              field: 'registrationNumber',
              header: 'Registration No',
              width: '150px',
            },
            {
              field: 'allottedSlot',
              header: 'Allotted Slot',
              cell: (item: ParkingRequest) => (
                <span>{item.allottedSlot || 'Not Allotted'}</span>
              ),
              width: '130px',
            },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
              cell: (item: ParkingRequest) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '280px',
              cell: (item: ParkingRequest) => (
                <div className="flex gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                  />
                  {item.status === 'Pending' && (
                    <Button
                      label="Approve / Reject"
                      icon="check"
                      variant="primary"
                      onClick={() => openApprove(item)}
                    />
                  )}
                  {item.status !== 'Cancelled' &&
                    item.status !== 'Rejected' && (
                      <Button
                        label="Cancel"
                        icon="times"
                        variant="outlined"
                        onClick={() => handleCancelRequest(item)}
                      />
                    )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Request Parking Space"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      {/* View Details Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title="View Parking Allocation"
        subtitle={popup.mode === 'view' ? popup.item.id : ''}
        size="lg"
      >
        {popup.mode === 'view' && (
          <div className="space-y-4 text-sm text-gray-700">
            <FormGrid columns={2}>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Account Type
                </span>
                <p className="font-semibold">{popup.item.accountType}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Applicant Name
                </span>
                <p className="font-semibold">{popup.item.userName}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Vehicle Category
                </span>
                <p className="font-semibold">{popup.item.vehicleType}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Registration Number
                </span>
                <p className="font-semibold">{popup.item.registrationNumber}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Start Date
                </span>
                <p className="font-semibold">{popup.item.startDate}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  End Date
                </span>
                <p className="font-semibold">{popup.item.endDate}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Allotted Slot Number
                </span>
                <p className="font-semibold text-teal-600 font-bold">
                  {popup.item.allottedSlot || 'Not Allotted'}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Booking Status
                </span>
                <div className="mt-1">
                  <StatusBadge
                    label={popup.item.status}
                    variant={getStatusVariant(popup.item.status)}
                  />
                </div>
              </div>
            </FormGrid>
            {popup.item.description && (
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Remarks
                </span>
                <p className="p-3 bg-slate-50 border rounded mt-1">
                  {popup.item.description}
                </p>
              </div>
            )}
            {popup.item.reason && (
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Rejection / Process Reason
                </span>
                <p className="p-3 bg-red-25 border border-red-100 rounded mt-1 text-red-700 font-medium">
                  {popup.item.reason}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                label="Print Permit"
                icon="print"
                variant="primary"
                onClick={() => ToastService.success('Printing permit PDF...')}
              />
              <Button label="Close" variant="outlined" onClick={closePopup} />
            </div>
          </div>
        )}
      </FormPopup>

      {/* Create / Edit Popup */}
      <FormPopup
        visible={popup.mode === 'create' || popup.mode === 'edit'}
        onHide={closePopup}
        title={
          popup.mode === 'create' ? 'Request Parking Space' : 'Edit Request'
        }
        subtitle="Fill in vehicle registration and dates."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Type of Account"
            data={ACCOUNT_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Account"
            value={form.accountType}
            onChange={v => setForm(f => ({ ...f, accountType: v as any }))}
            required
          />
          <TextBox
            label="Employee Name / Account Name"
            placeholder="e.g. Dr. Ramesh Chandra"
            value={form.userName}
            onChange={v => setForm(f => ({ ...f, userName: v }))}
            required
          />
          <DropDownList
            label="Type of Vehicle"
            data={VEHICLE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Vehicle Type"
            value={form.vehicleType}
            onChange={v => setForm(f => ({ ...f, vehicleType: v as any }))}
            required
          />
          <TextBox
            label="Vehicle Registration Number"
            placeholder="e.g. DL11AB1234"
            value={form.registrationNumber}
            onChange={v => setForm(f => ({ ...f, registrationNumber: v }))}
            required
          />
          <TextBox
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={form.startDate}
            onChange={v => setForm(f => ({ ...f, startDate: v }))}
            required
          />
          <TextBox
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={form.endDate}
            onChange={v => setForm(f => ({ ...f, endDate: v }))}
            required
          />
          <div className="col-span-2">
            <TextArea
              label="Description (Optional)"
              placeholder="e.g. Temporary visit details..."
              value={form.description}
              onChange={v => setForm(f => ({ ...f, description: v }))}
              rows={2}
            />
          </div>
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Submit Details"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormPopup>

      {/* Approval Details Popup */}
      <FormPopup
        visible={popup.mode === 'approve'}
        onHide={closePopup}
        title="Approve / Reject Parking Request"
        subtitle={popup.mode === 'approve' ? popup.item.id : ''}
        size="default"
      >
        <FormGrid columns={1}>
          <DropDownList
            label="Decision"
            data={STATUS_OPTIONS.filter(o => o.value !== 'Pending')}
            textField="name"
            optionValue="value"
            value={approvalForm.status}
            onChange={v => setApprovalForm(f => ({ ...f, status: v as any }))}
            required
          />
          {approvalForm.status === 'Approved' ? (
            <TextBox
              label="Allotted Parking Slot No"
              placeholder="e.g. Slot A-24"
              value={approvalForm.allottedSlot}
              onChange={v => setApprovalForm(f => ({ ...f, allottedSlot: v }))}
              required
            />
          ) : (
            <TextArea
              label="Reason (Mandatory for rejection or hold)"
              placeholder="Provide reason detail..."
              value={approvalForm.reason}
              onChange={v => setApprovalForm(f => ({ ...f, reason: v }))}
              rows={2}
              required
            />
          )}
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Submit Decision"
            variant="primary"
            onClick={handleSaveApproval}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
