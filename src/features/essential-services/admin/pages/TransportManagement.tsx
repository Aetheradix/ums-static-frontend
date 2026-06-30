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
import { type TransportBooking, initialTransportBookings } from '../../data';
import { essentialServicesUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: TransportBooking }
  | { mode: 'view'; item: TransportBooking }
  | { mode: 'approve'; item: TransportBooking };

const ACCOUNT_OPTIONS = [
  { name: 'Employee', value: 'Employee' },
  { name: 'Administrative', value: 'Administrative' },
];

const REQUEST_FOR_OPTIONS = [
  { name: 'Self', value: 'Self' },
  { name: 'Guest', value: 'Guest' },
  { name: 'Official Work', value: 'Official Work' },
];

const VEHICLE_TYPES = [
  { name: 'Car', value: 'Car' },
  { name: 'Bus', value: 'Bus' },
  { name: 'Van', value: 'Van' },
];

const IS_UNIVERSITY_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const EMPTY_FORM: {
  vehicleType: string;
  capacity: number;
  requestFor: 'Self' | 'Guest' | 'Official Work';
  guestName: string;
  address: string;
  contact: string;
  departureFrom: string;
  arrivalTo: string;
  reason: string;
  accountType: 'Employee' | 'Administrative';
  inchargeName: string;
  startDate: string;
  endDate: string;
  otherInfo: string;
} = {
  vehicleType: 'Car',
  capacity: 4,
  requestFor: 'Self',
  guestName: '',
  address: '',
  contact: '',
  departureFrom: '',
  arrivalTo: '',
  reason: '',
  accountType: 'Employee',
  inchargeName: '',
  startDate: '',
  endDate: '',
  otherInfo: '',
};

export default function TransportManagement() {
  const [data, setData] = useState<TransportBooking[]>(
    initialTransportBookings
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [assignForm, setAssignForm] = useState({
    isUniversity: 'Yes' as 'Yes' | 'No',
    vehicleDetails: '',
    driverName: '',
    remarks: '',
  });

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: TransportBooking) => {
    setForm({
      vehicleType: item.vehicleType,
      capacity: item.capacity,
      requestFor: item.requestFor,
      guestName: item.guestName,
      address: item.address,
      contact: item.contact,
      departureFrom: item.departureFrom,
      arrivalTo: item.arrivalTo,
      reason: item.reason,
      accountType: item.accountType,
      inchargeName: item.inchargeName,
      startDate: item.startDate,
      endDate: item.endDate,
      otherInfo: item.otherInfo || '',
    });
    setPopup({ mode: 'edit', item });
  };

  const openView = (item: TransportBooking) => {
    setPopup({ mode: 'view', item });
  };

  const openApprove = (item: TransportBooking) => {
    setAssignForm({
      isUniversity: item.assignedVehicle?.isUniversity || 'Yes',
      vehicleDetails: item.assignedVehicle?.vehicleDetails || '',
      driverName: item.assignedVehicle?.driverName || '',
      remarks: item.assignedVehicle?.remarks || '',
    });
    setPopup({ mode: 'approve', item });
  };

  const saveBooking = () => {
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { id: `TRP-00${prev.length + 1}`, ...form, status: 'Pending' },
      ]);
      ToastService.success('Transport booking request registered.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(b => (b.id === popup.item.id ? { ...b, ...form } : b))
      );
      ToastService.success('Booking request details updated.');
    }
    closePopup();
  };

  const saveAssignment = () => {
    if (popup.mode === 'approve') {
      setData(prev =>
        prev.map(b =>
          b.id === popup.item.id
            ? {
                ...b,
                status: 'Approved',
                assignedVehicle: {
                  isUniversity: assignForm.isUniversity,
                  vehicleDetails: assignForm.vehicleDetails,
                  driverName: assignForm.driverName,
                  remarks: assignForm.remarks,
                },
              }
            : b
        )
      );
      ToastService.success('Vehicle and driver assigned. Request approved.');
    }
    closePopup();
  };

  const cancelBooking = (booking: TransportBooking) => {
    setData(prev =>
      prev.map(b =>
        b.id === booking.id ? { ...b, status: 'Cancelled' as const } : b
      )
    );
    ToastService.success('Transport request cancelled.');
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
      title="Transport Division"
      description="Manage official transport bookings, assign fleet vehicles, allocate drivers, and print trip details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Transport Division' },
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
            { field: 'id', header: 'Request ID', width: '120px' },
            { field: 'vehicleType', header: 'Vehicle Class', width: '130px' },
            { field: 'guestName', header: 'Passenger' },
            { field: 'departureFrom', header: 'From' },
            { field: 'arrivalTo', header: 'To' },
            { field: 'startDate', header: 'Travel Start', width: '130px' },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
              cell: (item: TransportBooking) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Actions',
              width: '280px',
              cell: (item: TransportBooking) => (
                <div className="flex gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                  />
                  {item.status === 'Pending' && (
                    <Button
                      label="Assign Driver"
                      icon="car"
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
                        onClick={() => cancelBooking(item)}
                      />
                    )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Request Transport"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      {/* View Booking Details Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title="View Transport Request"
        subtitle={popup.mode === 'view' ? popup.item.id : ''}
        size="lg"
      >
        {popup.mode === 'view' && (
          <div className="space-y-4 text-sm text-gray-700">
            <FormGrid columns={3}>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Vehicle Category
                </span>
                <p className="font-semibold">{popup.item.vehicleType}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Required Capacity
                </span>
                <p className="font-semibold">{popup.item.capacity} Seats</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Request For
                </span>
                <p className="font-semibold">{popup.item.requestFor}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Passenger Name
                </span>
                <p className="font-semibold">{popup.item.guestName}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Passenger Contact
                </span>
                <p className="font-semibold">{popup.item.contact}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Workflow Status
                </span>
                <div className="mt-1">
                  <StatusBadge
                    label={popup.item.status}
                    variant={getStatusVariant(popup.item.status)}
                  />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Departure (From)
                </span>
                <p className="font-semibold">{popup.item.departureFrom}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Arrival (To)
                </span>
                <p className="font-semibold">{popup.item.arrivalTo}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Scheduled Date
                </span>
                <p className="font-semibold">
                  {popup.item.startDate} to {popup.item.endDate}
                </p>
              </div>
            </FormGrid>
            <div>
              <span className="text-xs uppercase font-semibold text-gray-400">
                Reason for Request
              </span>
              <p className="p-3 bg-slate-50 border rounded mt-1">
                {popup.item.reason}
              </p>
            </div>

            {popup.item.assignedVehicle && (
              <div className="p-3 bg-orange-50 border border-orange-100 rounded space-y-2">
                <span className="text-xs uppercase font-bold text-orange-700">
                  Assigned Fleet Details
                </span>
                <FormGrid columns={2}>
                  <div>
                    <span className="text-xs text-orange-600">
                      University Fleet?
                    </span>
                    <p className="font-semibold">
                      {popup.item.assignedVehicle.isUniversity}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-orange-600">
                      Vehicle / Driver
                    </span>
                    <p className="font-semibold">
                      {popup.item.assignedVehicle.vehicleDetails}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Driver: {popup.item.assignedVehicle.driverName}
                    </p>
                  </div>
                </FormGrid>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                label="Print Trip details"
                icon="print"
                variant="primary"
                onClick={() =>
                  ToastService.success('Printing transit manifest...')
                }
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
          popup.mode === 'create'
            ? 'Request Transport Booking'
            : 'Edit Booking details'
        }
        subtitle="Fill in passengers and itinerary locations."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Type of Vehicle Required"
            data={VEHICLE_TYPES}
            textField="name"
            optionValue="value"
            placeholder="Select Type"
            value={form.vehicleType}
            onChange={v =>
              setForm(f => ({ ...f, vehicleType: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="Required Seating Capacity"
            value={String(form.capacity)}
            onChange={v => setForm(f => ({ ...f, capacity: Number(v) }))}
            required
          />
          <DropDownList
            label="Request For"
            data={REQUEST_FOR_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.requestFor}
            onChange={v => setForm(f => ({ ...f, requestFor: v as any }))}
            required
          />
          <TextBox
            label="Passenger / Guest Name"
            placeholder="Full Name"
            value={form.guestName}
            onChange={v => setForm(f => ({ ...f, guestName: v }))}
            required
          />
          <TextBox
            label="Contact Mobile Number"
            placeholder="+1 (555) 019-1234"
            value={form.contact}
            onChange={v => setForm(f => ({ ...f, contact: v }))}
            required
          />
          <TextBox
            label="Departure Location (From)"
            placeholder="Pickup address"
            value={form.departureFrom}
            onChange={v => setForm(f => ({ ...f, departureFrom: v }))}
            required
          />
          <TextBox
            label="Arrival Location (To)"
            placeholder="Drop-off address"
            value={form.arrivalTo}
            onChange={v => setForm(f => ({ ...f, arrivalTo: v }))}
            required
          />
          <TextBox
            label="Start Date"
            placeholder="YYYY-MM-DD HH:MM"
            value={form.startDate}
            onChange={v => setForm(f => ({ ...f, startDate: v }))}
            required
          />
          <TextBox
            label="End Date"
            placeholder="YYYY-MM-DD HH:MM"
            value={form.endDate}
            onChange={v => setForm(f => ({ ...f, endDate: v }))}
            required
          />
          <DropDownList
            label="Type of Account"
            data={ACCOUNT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.accountType}
            onChange={v => setForm(f => ({ ...f, accountType: v as any }))}
            required
          />
          <TextBox
            label="University Incharge Coordinator"
            placeholder="Responsible official"
            value={form.inchargeName}
            onChange={v => setForm(f => ({ ...f, inchargeName: v }))}
            required
          />
          <div className="col-span-2">
            <TextArea
              label="Reason / Purpose of Booking"
              placeholder="e.g. Guest pickup from airport..."
              value={form.reason}
              onChange={v => setForm(f => ({ ...f, reason: v }))}
              rows={2}
              required
            />
          </div>
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Submit booking"
            variant="primary"
            onClick={saveBooking}
          />
        </div>
      </FormPopup>

      {/* Assign Vehicle Popup */}
      <FormPopup
        visible={popup.mode === 'approve'}
        onHide={closePopup}
        title="Assign Driver & Fleet Vehicle"
        subtitle={popup.mode === 'approve' ? popup.item.id : ''}
        size="default"
      >
        <FormGrid columns={1}>
          <DropDownList
            label="University Fleet Vehicle?"
            data={IS_UNIVERSITY_OPTIONS}
            textField="name"
            optionValue="value"
            value={assignForm.isUniversity}
            onChange={v =>
              setAssignForm(f => ({ ...f, isUniversity: v as any }))
            }
            required
          />
          <TextBox
            label="Vehicle Details (Model & Registration)"
            placeholder="e.g. Toyota Camry (DL4CAF7781)"
            value={assignForm.vehicleDetails}
            onChange={v => setAssignForm(f => ({ ...f, vehicleDetails: v }))}
            required
          />
          <TextBox
            label="Driver Name & Contact"
            placeholder="e.g. Sanjay Kumar (+1 555-019-3344)"
            value={assignForm.driverName}
            onChange={v => setAssignForm(f => ({ ...f, driverName: v }))}
            required
          />
          <TextArea
            label="Remarks / Transit Instructions (Optional)"
            placeholder="Special instructions for the trip..."
            value={assignForm.remarks}
            onChange={v => setAssignForm(f => ({ ...f, remarks: v }))}
            rows={2}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Approve & Assign"
            variant="primary"
            onClick={saveAssignment}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
