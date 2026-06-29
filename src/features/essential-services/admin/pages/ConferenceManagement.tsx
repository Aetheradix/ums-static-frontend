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
  Tabs,
} from 'shared/new-components';
import {
  type ConferenceHallType,
  type ConferenceHall,
  type ConferenceBooking,
  initialConferenceHallTypes,
  initialConferenceHalls,
  initialConferenceBookings,
} from '../../data';
import { essentialServicesUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'createType' }
  | { mode: 'editType'; item: ConferenceHallType }
  | { mode: 'createHall' }
  | { mode: 'editHall'; item: ConferenceHall }
  | { mode: 'viewHall'; item: ConferenceHall }
  | { mode: 'createBooking' }
  | { mode: 'editBooking'; item: ConferenceBooking }
  | { mode: 'approveBooking'; item: ConferenceBooking };

const ACTIVE_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const ACCOUNT_OPTIONS = [
  { name: 'Employee', value: 'Employee' },
  { name: 'Administrative', value: 'Administrative' },
];

const LEVEL_OPTIONS = [
  { name: 'Departmental', value: 'Departmental' },
  { name: 'University', value: 'University' },
  { name: 'National', value: 'National' },
  { name: 'International', value: 'International' },
];

export default function ConferenceManagement() {
  const [types, setTypes] = useState<ConferenceHallType[]>(
    initialConferenceHallTypes
  );
  const [halls, setHalls] = useState<ConferenceHall[]>(initialConferenceHalls);
  const [bookings, setBookings] = useState<ConferenceBooking[]>(
    initialConferenceBookings
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Type form state
  const [typeForm, setTypeForm] = useState<{
    type: string;
    status: 'Active' | 'Inactive';
  }>({ type: '', status: 'Active' });
  // Hall form state
  const [hallForm, setHallForm] = useState<{
    hallNo: string;
    name: string;
    incharge: string;
    inchargeMobile: string;
    inchargeEmail: string;
    description: string;
    status: 'Active' | 'Inactive';
  }>({
    hallNo: '',
    name: '',
    incharge: '',
    inchargeMobile: '',
    inchargeEmail: '',
    description: '',
    status: 'Active',
  });
  // Booking form state
  const [bookingForm, setBookingForm] = useState<{
    accountType: 'Employee' | 'Administrative';
    coordinatorName: string;
    level: 'Departmental' | 'University' | 'National' | 'International';
    title: string;
    purpose: string;
    startDate: string;
    endDate: string;
    hallNo: string;
    participants: number;
  }>({
    accountType: 'Employee',
    coordinatorName: '',
    level: 'Departmental',
    title: '',
    purpose: '',
    startDate: '',
    endDate: '',
    hallNo: '',
    participants: 10,
  });
  // Allocation state
  const [allotmentHallNo, setAllotmentHallNo] = useState('');

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
  }, []);

  const saveType = () => {
    if (popup.mode === 'createType') {
      setTypes(prev => [
        ...prev,
        {
          id: String(Date.now()),
          type: typeForm.type,
          status: typeForm.status,
        },
      ]);
      ToastService.success('Conference hall type registered.');
    } else if (popup.mode === 'editType') {
      setTypes(prev =>
        prev.map(t =>
          t.id === popup.item.id
            ? { ...t, type: typeForm.type, status: typeForm.status }
            : t
        )
      );
      ToastService.success('Conference hall type modified.');
    }
    closePopup();
  };

  const saveHall = () => {
    if (popup.mode === 'createHall') {
      setHalls(prev => [
        ...prev,
        { id: String(Date.now()), ...hallForm, isPublished: false },
      ]);
      ToastService.success('Conference hall added to configuration.');
    } else if (popup.mode === 'editHall') {
      setHalls(prev =>
        prev.map(h => (h.id === popup.item.id ? { ...h, ...hallForm } : h))
      );
      ToastService.success('Conference hall details updated.');
    }
    closePopup();
  };

  const publishHall = (hall: ConferenceHall) => {
    setHalls(prev =>
      prev.map(h => (h.id === hall.id ? { ...h, isPublished: true } : h))
    );
    ToastService.success(
      `${hall.name} published successfully and is now active for bookings.`
    );
  };

  const saveBooking = () => {
    if (popup.mode === 'createBooking') {
      setBookings(prev => [
        ...prev,
        { id: `CRQ-00${prev.length + 1}`, ...bookingForm, status: 'Pending' },
      ]);
      ToastService.success('Conference hall booking request submitted.');
    } else if (popup.mode === 'editBooking') {
      setBookings(prev =>
        prev.map(b => (b.id === popup.item.id ? { ...b, ...bookingForm } : b))
      );
      ToastService.success('Booking details updated.');
    }
    closePopup();
  };

  const saveApproval = () => {
    if (popup.mode === 'approveBooking') {
      setBookings(prev =>
        prev.map(b =>
          b.id === popup.item.id
            ? { ...b, status: 'Approved', hallNo: allotmentHallNo }
            : b
        )
      );
      ToastService.success(
        `Booking request approved and Hall ${allotmentHallNo} allotted.`
      );
    }
    closePopup();
  };

  const cancelBooking = (booking: ConferenceBooking) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === booking.id ? { ...b, status: 'Cancelled' as const } : b
      )
    );
    ToastService.success('Booking request cancelled.');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return 'approved';
      case 'Pending':
        return 'pending';
      case 'Rejected':
        return 'rejected';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Conference Hall Management"
      description="Manage campus meeting rooms, define hall coordinators, monitor availability calendars, and approve booking allocations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Conference Halls' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Bookings List',
            content: (
              <FormCard>
                <GridPanel
                  data={bookings}
                  onEdit={item => {
                    setBookingForm({
                      accountType: item.accountType,
                      coordinatorName: item.coordinatorName,
                      level: item.level,
                      title: item.title,
                      purpose: item.purpose,
                      startDate: item.startDate,
                      endDate: item.endDate,
                      hallNo: item.hallNo,
                      participants: item.participants,
                    });
                    setPopup({ mode: 'editBooking', item });
                  }}
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
                    { field: 'coordinatorName', header: 'Coordinator' },
                    { field: 'level', header: 'Level', width: '130px' },
                    { field: 'title', header: 'Conference Title' },
                    {
                      field: 'startDate',
                      header: 'Start Date',
                      width: '130px',
                    },
                    { field: 'endDate', header: 'End Date', width: '130px' },
                    { field: 'hallNo', header: 'Hall Slot', width: '120px' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '130px',
                      cell: (item: ConferenceBooking) => (
                        <StatusBadge
                          label={item.status}
                          variant={getStatusVariant(item.status)}
                        />
                      ),
                    },
                    {
                      header: 'Actions',
                      width: '280px',
                      cell: (item: ConferenceBooking) => (
                        <div className="flex gap-2">
                          {item.status === 'Pending' && (
                            <Button
                              label="Approve"
                              icon="check"
                              variant="primary"
                              onClick={() => {
                                setAllotmentHallNo(item.hallNo);
                                setPopup({ mode: 'approveBooking', item });
                              }}
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
                      label="Request Conference Hall"
                      icon="plus"
                      variant="primary"
                      onClick={() => {
                        setBookingForm({
                          accountType: 'Employee',
                          coordinatorName: '',
                          level: 'Departmental',
                          title: '',
                          purpose: '',
                          startDate: '',
                          endDate: '',
                          hallNo: 'CONF-101',
                          participants: 10,
                        });
                        setPopup({ mode: 'createBooking' });
                      }}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Conference Hall Master',
            content: (
              <FormCard>
                <GridPanel
                  data={halls}
                  onEdit={item => {
                    setHallForm({
                      hallNo: item.hallNo,
                      name: item.name,
                      incharge: item.incharge,
                      inchargeMobile: item.inchargeMobile,
                      inchargeEmail: item.inchargeEmail,
                      description: item.description,
                      status: item.status,
                    });
                    setPopup({ mode: 'editHall', item });
                  }}
                  columns={[
                    {
                      cell: (_, option) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'hallNo', header: 'Hall Number', width: '130px' },
                    { field: 'name', header: 'Hall Name' },
                    { field: 'incharge', header: 'Incharge' },
                    { field: 'inchargeMobile', header: 'Contact' },
                    { field: 'inchargeEmail', header: 'Email' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '120px',
                      cell: (item: ConferenceHall) => (
                        <StatusBadge
                          label={item.status}
                          variant={getStatusVariant(item.status)}
                        />
                      ),
                    },
                    {
                      field: 'isPublished',
                      header: 'Lock Status',
                      width: '140px',
                      cell: (item: ConferenceHall) => (
                        <StatusBadge
                          label={item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          variant={item.isPublished ? 'approved' : 'pending'}
                        />
                      ),
                    },
                    {
                      header: 'Publication',
                      width: '180px',
                      cell: (item: ConferenceHall) => (
                        <div className="flex gap-2">
                          <Button
                            label="View"
                            icon="eye"
                            variant="outlined"
                            onClick={() => setPopup({ mode: 'viewHall', item })}
                          />
                          {!item.isPublished && (
                            <Button
                              label="Publish"
                              icon="lock"
                              variant="primary"
                              onClick={() => publishHall(item)}
                            />
                          )}
                        </div>
                      ),
                    },
                  ]}
                  toolbar={
                    <Button
                      label="Add Conference Hall"
                      icon="plus"
                      variant="primary"
                      onClick={() => {
                        setHallForm({
                          hallNo: '',
                          name: '',
                          incharge: '',
                          inchargeMobile: '',
                          inchargeEmail: '',
                          description: '',
                          status: 'Active',
                        });
                        setPopup({ mode: 'createHall' });
                      }}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Hall Type Master',
            content: (
              <FormCard>
                <GridPanel
                  data={types}
                  onEdit={item => {
                    setTypeForm({ type: item.type, status: item.status });
                    setPopup({ mode: 'editType', item });
                  }}
                  columns={[
                    {
                      cell: (_, option) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'type', header: 'Conference Hall Type' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '130px',
                      cell: (item: ConferenceHallType) => (
                        <StatusBadge
                          label={item.status}
                          variant={getStatusVariant(item.status)}
                        />
                      ),
                    },
                  ]}
                  toolbar={
                    <Button
                      label="Add Hall Type"
                      icon="plus"
                      variant="primary"
                      onClick={() => {
                        setTypeForm({ type: '', status: 'Active' });
                        setPopup({ mode: 'createType' });
                      }}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
        ]}
      />

      {/* Hall Type popup */}
      <FormPopup
        visible={popup.mode === 'createType' || popup.mode === 'editType'}
        onHide={closePopup}
        title={popup.mode === 'createType' ? 'Add Hall Type' : 'Edit Hall Type'}
        subtitle="Manage available configurations for room classifications."
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Hall Type"
            placeholder="e.g. Executive Boardroom"
            value={typeForm.type}
            onChange={v => setTypeForm(f => ({ ...f, type: v }))}
            required
          />
          <DropDownList
            label="Status"
            data={ACTIVE_OPTIONS}
            textField="name"
            optionValue="value"
            value={typeForm.status}
            onChange={v => setTypeForm(f => ({ ...f, status: v as any }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save Changes" variant="primary" onClick={saveType} />
        </div>
      </FormPopup>

      {/* Hall Master popup */}
      <FormPopup
        visible={popup.mode === 'createHall' || popup.mode === 'editHall'}
        onHide={closePopup}
        title={
          popup.mode === 'createHall'
            ? 'Add Conference Hall'
            : 'Edit Conference Hall'
        }
        subtitle="Enter hall details and supervisor assignments."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Hall No (Unique)"
            placeholder="e.g. CONF-101"
            value={hallForm.hallNo}
            onChange={v => setHallForm(f => ({ ...f, hallNo: v }))}
            disabled={
              popup.mode === 'editHall' && (popup as any).item?.isPublished
            }
            required
          />
          <TextBox
            label="Hall Name"
            placeholder="e.g. Tagore Auditorium"
            value={hallForm.name}
            onChange={v => setHallForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Hall Incharge Name"
            placeholder="Select authority..."
            value={hallForm.incharge}
            onChange={v => setHallForm(f => ({ ...f, incharge: v }))}
            required
          />
          <TextBox
            label="Incharge Mobile Number"
            placeholder="+1 (555) 012-3456"
            value={hallForm.inchargeMobile}
            onChange={v => setHallForm(f => ({ ...f, inchargeMobile: v }))}
            required
          />
          <TextBox
            label="Incharge Email Address"
            placeholder="incharge@univ.edu"
            value={hallForm.inchargeEmail}
            onChange={v => setHallForm(f => ({ ...f, inchargeEmail: v }))}
            required
          />
          <DropDownList
            label="Hall Status"
            data={ACTIVE_OPTIONS}
            textField="name"
            optionValue="value"
            value={hallForm.status}
            onChange={v => setHallForm(f => ({ ...f, status: v as any }))}
            required
          />
          <div className="col-span-2">
            <TextArea
              label="Hall Description"
              placeholder="Capacity, equipment details..."
              value={hallForm.description}
              onChange={v => setHallForm(f => ({ ...f, description: v }))}
              rows={3}
            />
          </div>
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save Details" variant="primary" onClick={saveHall} />
        </div>
      </FormPopup>

      {/* Hall View Details / Uploads Popup */}
      <FormPopup
        visible={popup.mode === 'viewHall'}
        onHide={closePopup}
        title="Conference Hall Details"
        subtitle={popup.mode === 'viewHall' ? popup.item.name : ''}
        size="lg"
      >
        {popup.mode === 'viewHall' && (
          <div className="space-y-4 text-sm text-gray-700">
            <FormGrid columns={2}>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Hall Number
                </span>
                <p className="font-semibold">{popup.item.hallNo}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Lock Status
                </span>
                <div className="mt-1">
                  <StatusBadge
                    label={popup.item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    variant={popup.item.isPublished ? 'approved' : 'pending'}
                  />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Responsible Incharge
                </span>
                <p className="font-semibold">{popup.item.incharge}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Incharge Contact
                </span>
                <p className="font-semibold">
                  {popup.item.inchargeMobile} • {popup.item.inchargeEmail}
                </p>
              </div>
            </FormGrid>
            <div>
              <span className="text-xs uppercase font-semibold text-gray-400">
                Room description & Facilities
              </span>
              <p className="p-3 bg-slate-50 border rounded mt-1">
                {popup.item.description}
              </p>
            </div>

            {/* Upload Mock Reference */}
            <div className="pt-4 border-t">
              <span className="text-xs uppercase font-semibold text-gray-400">
                Uploaded Layouts & Assets
              </span>
              <div className="flex gap-2 mt-2">
                <div className="flex items-center gap-2 p-2 bg-slate-100 border rounded text-xs">
                  <i className="pi pi-file-pdf text-red-500"></i>
                  <span>hall_layout_v2.pdf</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-100 border rounded text-xs">
                  <i className="pi pi-image text-blue-500"></i>
                  <span>projector_spec.jpg</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <Button
                  label="Add Uploads"
                  icon="upload"
                  variant="outlined"
                  onClick={() =>
                    ToastService.success('Upload flow initiated...')
                  }
                />
                <Button label="Close" variant="outlined" onClick={closePopup} />
              </div>
            </div>
          </div>
        )}
      </FormPopup>

      {/* Booking Form popup */}
      <FormPopup
        visible={popup.mode === 'createBooking' || popup.mode === 'editBooking'}
        onHide={closePopup}
        title={
          popup.mode === 'createBooking'
            ? 'Submit Conference Hall Request'
            : 'Edit Booking Request'
        }
        subtitle="Fill in coordinator and scheduling details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Type of Account"
            data={ACCOUNT_OPTIONS}
            textField="name"
            optionValue="value"
            value={bookingForm.accountType}
            onChange={v =>
              setBookingForm(f => ({ ...f, accountType: v as any }))
            }
            required
          />
          <TextBox
            label="Conference Coordinator / Account Name"
            placeholder="e.g. Dr. Alan Turing"
            value={bookingForm.coordinatorName}
            onChange={v => setBookingForm(f => ({ ...f, coordinatorName: v }))}
            required
          />
          <DropDownList
            label="Conference Level"
            data={LEVEL_OPTIONS}
            textField="name"
            optionValue="value"
            value={bookingForm.level}
            onChange={v => setBookingForm(f => ({ ...f, level: v as any }))}
            required
          />
          <TextBox
            label="Title of Conference"
            placeholder="Official name of the event"
            value={bookingForm.title}
            onChange={v => setBookingForm(f => ({ ...f, title: v }))}
            required
          />
          <TextBox
            label="Start Date & Time"
            placeholder="YYYY-MM-DD HH:MM"
            value={bookingForm.startDate}
            onChange={v => setBookingForm(f => ({ ...f, startDate: v }))}
            required
          />
          <TextBox
            label="End Date & Time"
            placeholder="YYYY-MM-DD HH:MM"
            value={bookingForm.endDate}
            onChange={v => setBookingForm(f => ({ ...f, endDate: v }))}
            required
          />
          <TextBox
            label="Hall Number"
            placeholder="e.g. CONF-101"
            value={bookingForm.hallNo}
            onChange={v => setBookingForm(f => ({ ...f, hallNo: v }))}
            required
          />
          <TextBox
            label="Expected Participants Count"
            placeholder="e.g. 150"
            value={String(bookingForm.participants)}
            onChange={v =>
              setBookingForm(f => ({ ...f, participants: Number(v) }))
            }
            required
          />
          <div className="col-span-2">
            <TextArea
              label="Purpose of Booking"
              placeholder="Objective of hosting the meeting..."
              value={bookingForm.purpose}
              onChange={v => setBookingForm(f => ({ ...f, purpose: v }))}
              rows={2}
              required
            />
          </div>
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Submit Booking"
            variant="primary"
            onClick={saveBooking}
          />
        </div>
      </FormPopup>

      {/* Approval Slot Booking Popup */}
      <FormPopup
        visible={popup.mode === 'approveBooking'}
        onHide={closePopup}
        title="Allot Hall & Approve Request"
        subtitle={popup.mode === 'approveBooking' ? popup.item.id : ''}
        size="default"
      >
        <FormGrid columns={1}>
          <div className="bg-blue-25 border border-blue-100 p-3 rounded text-xs text-blue-700">
            <p>
              <strong>Conference Title:</strong>{' '}
              {popup.mode === 'approveBooking' ? popup.item.title : ''}
            </p>
            <p className="mt-1">
              <strong>Dates:</strong>{' '}
              {popup.mode === 'approveBooking'
                ? `${popup.item.startDate} to ${popup.item.endDate}`
                : ''}
            </p>
          </div>
          <TextBox
            label="Allot Hall Number"
            placeholder="e.g. CONF-101"
            value={allotmentHallNo}
            onChange={v => setAllotmentHallNo(v)}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Approve Booking"
            variant="primary"
            onClick={saveApproval}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
