import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextBox,
  TextArea,
  Switch,
} from 'shared/components/forms';
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
  type GuestHouse,
  type RoomDetail,
  type TaxMethod,
  type GuestType,
  type ExpenditureHead,
  type GuestHouseBooking,
  initialGuestHouses,
  initialRoomDetails,
  initialTaxMethods,
  initialGuestTypes,
  initialExpenditureHeads,
  initialGuestHouseBookings,
  currentPaymentDetailConfig as initialPaymentConfig,
  guestTypeWiseChargesSwitch as initialChargesSwitch,
  guestHouseCancelDisableTime as initialDisableTime,
  guestHouseAlertDisclaimer as initialDisclaimer,
} from '../../data';
import { essentialServicesUrls } from '../../urls';

const MEAL_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const MEAL_PREFS = [
  { name: 'Veg', value: 'Veg' },
  { name: 'Non-Veg', value: 'Non-Veg' },
  { name: 'Other', value: 'Other' },
];

const PAYMENT_CAPTURES = [
  { name: 'At Approval Of Request', value: 'At Approval Of Request' },
  { name: 'At the time of Check-In', value: 'At the time of Check-In' },
  { name: 'At the time of Check-Out', value: 'At the time of Check-Out' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'checkin'; item: GuestHouseBooking }
  | { mode: 'checkout'; item: GuestHouseBooking }
  | { mode: 'allot'; item: GuestHouseBooking }
  | { mode: 'createBooking' }
  | { mode: 'editBooking'; item: GuestHouseBooking }
  | { mode: 'viewBooking'; item: GuestHouseBooking };

const ACCOUNT_OPTIONS = [
  { name: 'Employee', value: 'Employee' },
  { name: 'Administrative', value: 'Administrative' },
];

export default function GuestHouseManagement() {
  const [guestHouses] = useState<GuestHouse[]>(initialGuestHouses);
  const [rooms] = useState<RoomDetail[]>(initialRoomDetails);
  const [taxes] = useState<TaxMethod[]>(initialTaxMethods);
  const [guestTypes] = useState<GuestType[]>(initialGuestTypes);
  const [expenditures] = useState<ExpenditureHead[]>(initialExpenditureHeads);
  const [bookings, setBookings] = useState<GuestHouseBooking[]>(
    initialGuestHouseBookings
  );

  // Settings states
  const [paymentConfig, setPaymentConfig] = useState(initialPaymentConfig);
  const [chargesSwitch, setChargesSwitch] = useState(
    initialChargesSwitch === 'Yes'
  );
  const [disableTime, setDisableTime] = useState(initialDisableTime);
  const [disclaimer, setDisclaimer] = useState(initialDisclaimer);

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Booking details form state
  const [bookingForm, setBookingForm] = useState<{
    guestHouseName: string;
    guestType: string;
    expenditureHead: string;
    guestName: string;
    designation: string;
    contact: string;
    email: string;
    nationality: string;
    accountType: 'Employee' | 'Administrative';
    userName: string;
    purpose: string;
    accompanyingPerson: string;
    arrivalDate: string;
    departureDate: string;
    roomType: string;
    occupancyCount: number;
    roomsRequired: number;
    mealIncluded: 'Yes' | 'No';
    mealPreference: 'Veg' | 'Non-Veg' | 'Other';
    specialRequirements: string;
  }>({
    guestHouseName: 'Main Campus Guest House',
    guestType: 'Official Institutional Guest',
    expenditureHead: 'Dean Academics Budget',
    guestName: '',
    designation: '',
    contact: '',
    email: '',
    nationality: 'Indian',
    accountType: 'Employee',
    userName: '',
    purpose: '',
    accompanyingPerson: 'None',
    arrivalDate: '',
    departureDate: '',
    roomType: 'Single Standard',
    occupancyCount: 1,
    roomsRequired: 1,
    mealIncluded: 'No',
    mealPreference: 'Veg',
    specialRequirements: '',
  });

  // Action forms state
  const [allotRoomNo, setAllotRoomNo] = useState('');
  const [checkinRefDoc, setCheckinRefDoc] = useState('');
  const [checkinVisitorId, setCheckinVisitorId] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
  }, []);

  const openAllot = (item: GuestHouseBooking) => {
    setAllotRoomNo(item.allottedRooms || 'GH-101');
    setPopup({ mode: 'allot', item });
  };

  const openCheckin = (item: GuestHouseBooking) => {
    setCheckinRefDoc(item.referenceDoc || '');
    setCheckinVisitorId(item.visitorIdProof || '');
    setPopup({ mode: 'checkin', item });
  };

  const openCheckout = (item: GuestHouseBooking) => {
    setCheckoutDate(new Date().toISOString().split('T')[0] + ' 12:00');
    setPopup({ mode: 'checkout', item });
  };

  const saveBooking = () => {
    if (popup.mode === 'createBooking') {
      setBookings(prev => [
        ...prev,
        {
          id: `GHB-00${prev.length + 1}`,
          ...bookingForm,
          status: 'Pending',
        },
      ]);
      ToastService.success('Guest House booking request submitted.');
    } else if (popup.mode === 'editBooking') {
      setBookings(prev =>
        prev.map(b => (b.id === popup.item.id ? { ...b, ...bookingForm } : b))
      );
      ToastService.success('Booking details updated successfully.');
    }
    closePopup();
  };

  const saveAllotment = () => {
    if (popup.mode === 'allot') {
      setBookings(prev =>
        prev.map(b =>
          b.id === popup.item.id
            ? { ...b, status: 'Approved', allottedRooms: allotRoomNo }
            : b
        )
      );
      ToastService.success(`Rooms allotted and booking request approved.`);
    }
    closePopup();
  };

  const saveCheckin = () => {
    if (popup.mode === 'checkin') {
      setBookings(prev =>
        prev.map(b =>
          b.id === popup.item.id
            ? {
                ...b,
                status: 'Check-In',
                referenceDoc: checkinRefDoc || 'reference_doc.pdf',
                visitorIdProof: checkinVisitorId || 'visitor_id.png',
              }
            : b
        )
      );
      ToastService.success('Guest check-in registered successfully.');
    }
    closePopup();
  };

  const saveCheckout = () => {
    if (popup.mode === 'checkout') {
      setBookings(prev =>
        prev.map(b =>
          b.id === popup.item.id
            ? { ...b, status: 'Check-Out', departureDate: checkoutDate }
            : b
        )
      );
      ToastService.success('Guest check-out finalized.');
    }
    closePopup();
  };

  const cancelBooking = (booking: GuestHouseBooking) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === booking.id ? { ...b, status: 'Cancelled' as const } : b
      )
    );
    ToastService.success('Booking cancelled.');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Check-In':
      case 'Active':
        return 'approved';
      case 'Pending':
        return 'pending';
      case 'Check-Out':
        return 'neutral';
      case 'Rejected':
      case 'Cancelled':
      default:
        return 'rejected';
    }
  };

  return (
    <FormPage
      title="Guest House Management"
      description="Manage campus guest lodgings, room details, pricing structures, taxes, stays, check-in checks, and checkout billing."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Guest House Section' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Stay Bookings',
            content: (
              <FormCard>
                <GridPanel
                  data={bookings}
                  onEdit={item => {
                    setBookingForm({
                      guestHouseName: item.guestHouseName,
                      guestType: item.guestType,
                      expenditureHead: item.expenditureHead,
                      guestName: item.guestName,
                      designation: item.designation,
                      contact: item.contact,
                      email: item.email,
                      nationality: item.nationality,
                      accountType: item.accountType,
                      userName: item.userName,
                      purpose: item.purpose,
                      accompanyingPerson: item.accompanyingPerson,
                      arrivalDate: item.arrivalDate,
                      departureDate: item.departureDate,
                      roomType: item.roomType,
                      occupancyCount: item.occupancyCount,
                      roomsRequired: item.roomsRequired,
                      mealIncluded: item.mealIncluded,
                      mealPreference: item.mealPreference || 'Veg',
                      specialRequirements: item.specialRequirements || '',
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
                    { field: 'guestName', header: 'Guest Name' },
                    { field: 'guestType', header: 'Guest Type' },
                    { field: 'arrivalDate', header: 'Arrival', width: '130px' },
                    {
                      field: 'departureDate',
                      header: 'Departure',
                      width: '130px',
                    },
                    {
                      field: 'allottedRooms',
                      header: 'Allotted Room',
                      cell: (item: GuestHouseBooking) => (
                        <span>{item.allottedRooms || 'Not Allotted'}</span>
                      ),
                      width: '130px',
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '130px',
                      cell: (item: GuestHouseBooking) => (
                        <StatusBadge
                          label={item.status}
                          variant={getStatusVariant(item.status)}
                        />
                      ),
                    },
                    {
                      header: 'Lodging Actions',
                      width: '320px',
                      cell: (item: GuestHouseBooking) => (
                        <div className="flex gap-2">
                          <Button
                            label="View"
                            icon="eye"
                            variant="outlined"
                            onClick={() =>
                              setPopup({ mode: 'viewBooking', item })
                            }
                          />
                          {item.status === 'Pending' && (
                            <Button
                              label="Allot Room"
                              icon="check"
                              variant="primary"
                              onClick={() => openAllot(item)}
                            />
                          )}
                          {item.status === 'Approved' && (
                            <Button
                              label="Check-In"
                              icon="sign-in"
                              variant="primary"
                              onClick={() => openCheckin(item)}
                            />
                          )}
                          {item.status === 'Check-In' && (
                            <Button
                              label="Check-Out"
                              icon="sign-out"
                              variant="primary"
                              onClick={() => openCheckout(item)}
                            />
                          )}
                          {item.status !== 'Check-Out' &&
                            item.status !== 'Cancelled' &&
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
                      label="Request Lodging Stay"
                      icon="plus"
                      variant="primary"
                      onClick={() => {
                        setBookingForm({
                          guestHouseName: 'Main Campus Guest House',
                          guestType: 'Official Institutional Guest',
                          expenditureHead: 'Dean Academics Budget',
                          guestName: '',
                          designation: '',
                          contact: '',
                          email: '',
                          nationality: 'Indian',
                          accountType: 'Employee',
                          userName: '',
                          purpose: '',
                          accompanyingPerson: 'None',
                          arrivalDate: '',
                          departureDate: '',
                          roomType: 'Single Standard',
                          occupancyCount: 1,
                          roomsRequired: 1,
                          mealIncluded: 'No',
                          mealPreference: 'Veg',
                          specialRequirements: '',
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
            title: 'Guest House Master & Rooms',
            content: (
              <div className="space-y-6">
                <FormCard title="Registered Guest Houses">
                  <GridPanel
                    data={guestHouses}
                    columns={[
                      {
                        cell: (_, option) => (
                          <span className="font-semibold text-gray-700">
                            {option.rowIndex + 1}
                          </span>
                        ),
                        width: '50px',
                      },
                      { field: 'name', header: 'Guest House Name' },
                      { field: 'location', header: 'Location' },
                      {
                        field: 'genderEligibility',
                        header: 'Gender Eligibility',
                        width: '150px',
                      },
                      { field: 'incharge', header: 'Incharge' },
                      {
                        field: 'status',
                        header: 'Status',
                        width: '120px',
                        cell: (item: GuestHouse) => (
                          <StatusBadge
                            label={item.status}
                            variant={getStatusVariant(item.status)}
                          />
                        ),
                      },
                      {
                        field: 'isPublished',
                        header: 'Publish Status',
                        width: '140px',
                        cell: (item: GuestHouse) => (
                          <StatusBadge
                            label={item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                            variant={item.isPublished ? 'approved' : 'pending'}
                          />
                        ),
                      },
                    ]}
                    searchBox
                  />
                </FormCard>

                <FormCard title="Room Details Mapping">
                  <GridPanel
                    data={rooms}
                    columns={[
                      {
                        cell: (_, option) => (
                          <span className="font-semibold text-gray-700">
                            {option.rowIndex + 1}
                          </span>
                        ),
                        width: '50px',
                      },
                      { field: 'roomNo', header: 'Room No', width: '130px' },
                      { field: 'roomType', header: 'Room Type' },
                      {
                        field: 'amount',
                        header: 'Base Price',
                        cell: (item: RoomDetail) => <span>${item.amount}</span>,
                      },
                      { field: 'facilities', header: 'Facilities Provided' },
                      {
                        field: 'status',
                        header: 'Status',
                        width: '120px',
                        cell: (item: RoomDetail) => (
                          <StatusBadge
                            label={item.status}
                            variant={getStatusVariant(item.status)}
                          />
                        ),
                      },
                    ]}
                    searchBox
                  />
                </FormCard>
              </div>
            ),
          },
          {
            title: 'Config Parameters',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard title="Payment Workflow capture Configuration">
                  <div className="space-y-4">
                    <DropDownList
                      label="At what Action capture guest house payments detail?"
                      data={PAYMENT_CAPTURES.map(p => ({
                        name: p.name,
                        value: p.value,
                      }))}
                      textField="name"
                      optionValue="value"
                      value={paymentConfig}
                      onChange={v => setPaymentConfig(String(v))}
                    />
                    <Button
                      label="Save Config"
                      variant="primary"
                      onClick={() =>
                        ToastService.success(
                          'Payment capture workflow configuration updated.'
                        )
                      }
                    />
                  </div>
                </FormCard>

                <FormCard title="Stay Charges & Disclaimers">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Enable Guest Type-Wise Billing Charges
                      </span>
                      <Switch
                        checked={chargesSwitch}
                        onChange={setChargesSwitch}
                      />
                    </div>
                    <TextBox
                      label="Cancel Button Auto-Disable Time Limit"
                      value={disableTime}
                      onChange={setDisableTime}
                    />
                    <TextArea
                      label="Guest House Alert / Disclaimer Message"
                      value={disclaimer}
                      onChange={setDisclaimer}
                      rows={3}
                    />
                    <Button
                      label="Save Stay Parameters"
                      variant="primary"
                      onClick={() =>
                        ToastService.success(
                          'Stay parameters and disclaimers updated.'
                        )
                      }
                    />
                  </div>
                </FormCard>

                <FormCard title="Tax Methods Configuration">
                  <GridPanel
                    data={taxes}
                    columns={[
                      { field: 'name', header: 'Tax Method Name' },
                      {
                        field: 'percentage',
                        header: 'Tax Percentage',
                        cell: (item: TaxMethod) => (
                          <span>{item.percentage}%</span>
                        ),
                      },
                      { field: 'description', header: 'Description' },
                      {
                        field: 'status',
                        header: 'Status',
                        cell: (item: TaxMethod) => (
                          <StatusBadge
                            label={item.status}
                            variant={getStatusVariant(item.status)}
                          />
                        ),
                      },
                    ]}
                  />
                </FormCard>

                <FormCard title="Guest Classifications & Expenditure Heads">
                  <div className="space-y-4">
                    <div className="border p-3 rounded space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Active Guest Types
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {guestTypes.map(g => (
                          <span
                            key={g.id}
                            className="text-xs bg-slate-100 px-2 py-1 border rounded"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border p-3 rounded space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Expenditure Heads
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {expenditures.map(e => (
                          <span
                            key={e.id}
                            className="text-xs bg-slate-100 px-2 py-1 border rounded"
                          >
                            {e.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FormCard>
              </div>
            ),
          },
        ]}
      />

      {/* Lodging stay edit popup */}
      <FormPopup
        visible={popup.mode === 'createBooking' || popup.mode === 'editBooking'}
        onHide={closePopup}
        title={
          popup.mode === 'createBooking'
            ? 'Submit Guest House Stay Request'
            : 'Edit Stay Request'
        }
        subtitle="Specify guest profile, room type, and occupancy details."
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
            label="Employee Name / Account Name"
            placeholder="e.g. Dr. Ramesh Chandra"
            value={bookingForm.userName}
            onChange={v => setBookingForm(f => ({ ...f, userName: v }))}
            required
          />
          <TextBox
            label="Name of the Guest"
            placeholder="Full Name"
            value={bookingForm.guestName}
            onChange={v => setBookingForm(f => ({ ...f, guestName: v }))}
            required
          />
          <TextBox
            label="Designation & Address"
            placeholder="Official title and organization location"
            value={bookingForm.designation}
            onChange={v => setBookingForm(f => ({ ...f, designation: v }))}
            required
          />
          <TextBox
            label="Contact Mobile Number"
            placeholder="+1 (555) 019-4455"
            value={bookingForm.contact}
            onChange={v => setBookingForm(f => ({ ...f, contact: v }))}
            required
          />
          <TextBox
            label="Email Address"
            placeholder="guest@email.com"
            value={bookingForm.email}
            onChange={v => setBookingForm(f => ({ ...f, email: v }))}
            required
          />
          <TextBox
            label="Nationality"
            value={bookingForm.nationality}
            onChange={v => setBookingForm(f => ({ ...f, nationality: v }))}
            required
          />
          <TextBox
            label="Date of Arrival (Check-In)"
            placeholder="YYYY-MM-DD HH:MM"
            value={bookingForm.arrivalDate}
            onChange={v => setBookingForm(f => ({ ...f, arrivalDate: v }))}
            required
          />
          <TextBox
            label="Date of Departure (Check-Out)"
            placeholder="YYYY-MM-DD HH:MM"
            value={bookingForm.departureDate}
            onChange={v => setBookingForm(f => ({ ...f, departureDate: v }))}
            required
          />
          <TextBox
            label="Room Type Required"
            placeholder="e.g. VIP Suite"
            value={bookingForm.roomType}
            onChange={v => setBookingForm(f => ({ ...f, roomType: v }))}
            required
          />
          <TextBox
            label="Number of Occupants"
            value={String(bookingForm.occupancyCount)}
            onChange={v =>
              setBookingForm(f => ({ ...f, occupancyCount: Number(v) }))
            }
            required
          />
          <TextBox
            label="Number of Rooms Required"
            value={String(bookingForm.roomsRequired)}
            onChange={v =>
              setBookingForm(f => ({ ...f, roomsRequired: Number(v) }))
            }
            required
          />
          <DropDownList
            label="Meal Included?"
            data={MEAL_OPTIONS}
            textField="name"
            optionValue="value"
            value={bookingForm.mealIncluded}
            onChange={v =>
              setBookingForm(f => ({ ...f, mealIncluded: v as any }))
            }
            required
          />
          {bookingForm.mealIncluded === 'Yes' && (
            <DropDownList
              label="Meal Preference"
              data={MEAL_PREFS}
              textField="name"
              optionValue="value"
              value={bookingForm.mealPreference}
              onChange={v =>
                setBookingForm(f => ({ ...f, mealPreference: v as any }))
              }
            />
          )}
          <div className="col-span-2">
            <TextArea
              label="Purpose of Visit"
              placeholder="e.g. Attending convocation..."
              value={bookingForm.purpose}
              onChange={v => setBookingForm(f => ({ ...f, purpose: v }))}
              rows={2}
              required
            />
          </div>
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Submit stay" variant="primary" onClick={saveBooking} />
        </div>
      </FormPopup>

      {/* Allot rooms popup */}
      <FormPopup
        visible={popup.mode === 'allot'}
        onHide={closePopup}
        title="Allot Room Number & Approve stay"
        subtitle={popup.mode === 'allot' ? popup.item.id : ''}
        size="default"
      >
        <FormGrid columns={1}>
          <div className="bg-slate-50 border p-3 rounded text-xs text-slate-700">
            <p>
              <strong>Guest Name:</strong>{' '}
              {popup.mode === 'allot' ? popup.item.guestName : ''}
            </p>
            <p className="mt-1">
              <strong>Room Type:</strong>{' '}
              {popup.mode === 'allot' ? popup.item.roomType : ''}
            </p>
            <p className="mt-1">
              <strong>Required:</strong>{' '}
              {popup.mode === 'allot'
                ? `${popup.item.roomsRequired} room(s)`
                : ''}
            </p>
          </div>
          <TextBox
            label="Allot Room Number(s) (comma separated)"
            placeholder="e.g. Room GH-101, GH-102"
            value={allotRoomNo}
            onChange={v => setAllotRoomNo(v)}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Approve stay"
            variant="primary"
            onClick={saveAllotment}
          />
        </div>
      </FormPopup>

      {/* Check-In Action Popup */}
      <FormPopup
        visible={popup.mode === 'checkin'}
        onHide={closePopup}
        title="Register Guest Arrival Check-In"
        subtitle={popup.mode === 'checkin' ? popup.item.id : ''}
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Upload Reference Document Link"
            placeholder="e.g. approval_letter.pdf"
            value={checkinRefDoc}
            onChange={v => setCheckinRefDoc(v)}
            required
          />
          <TextBox
            label="Upload Visitor Identity Proof Link"
            placeholder="e.g. passport_scan.png"
            value={checkinVisitorId}
            onChange={v => setCheckinVisitorId(v)}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Check-In Guest"
            variant="primary"
            onClick={saveCheckin}
          />
        </div>
      </FormPopup>

      {/* Check-Out Action Popup */}
      <FormPopup
        visible={popup.mode === 'checkout'}
        onHide={closePopup}
        title="Register Guest Check-Out"
        subtitle={popup.mode === 'checkout' ? popup.item.id : ''}
        size="default"
      >
        <FormGrid columns={1}>
          <div className="bg-slate-50 border p-3 rounded text-xs text-slate-700">
            <p>
              <strong>Lodger stay:</strong>{' '}
              {popup.mode === 'checkout' ? popup.item.guestName : ''}
            </p>
            <p className="mt-1">
              <strong>Room stay:</strong>{' '}
              {popup.mode === 'checkout' ? popup.item.allottedRooms : ''}
            </p>
            <p className="mt-1">
              <strong>Billing status:</strong> Payment configuration captures:{' '}
              <strong>{paymentConfig}</strong>
            </p>
          </div>
          <TextBox
            label="Departure Date & Time"
            placeholder="YYYY-MM-DD HH:MM"
            value={checkoutDate}
            onChange={v => setCheckoutDate(v)}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Complete Check-Out"
            variant="primary"
            onClick={saveCheckout}
          />
        </div>
      </FormPopup>

      {/* View Booking Details Popup */}
      <FormPopup
        visible={popup.mode === 'viewBooking'}
        onHide={closePopup}
        title="View Lodging Booking Request"
        subtitle={popup.mode === 'viewBooking' ? popup.item.id : ''}
        size="lg"
      >
        {popup.mode === 'viewBooking' && (
          <div className="space-y-4 text-sm text-gray-700">
            <FormGrid columns={3}>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Guest Name
                </span>
                <p className="font-semibold">{popup.item.guestName}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Nationality
                </span>
                <p className="font-semibold">{popup.item.nationality}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Guest Contact
                </span>
                <p className="font-semibold">{popup.item.contact}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Designation
                </span>
                <p className="font-semibold">{popup.item.designation}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Expenditure Head
                </span>
                <p className="font-semibold">{popup.item.expenditureHead}</p>
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
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Arrival Date
                </span>
                <p className="font-semibold">{popup.item.arrivalDate}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Departure Date
                </span>
                <p className="font-semibold">{popup.item.departureDate}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">
                  Allotted Rooms
                </span>
                <p className="font-semibold text-amber-600 font-bold">
                  {popup.item.allottedRooms || 'Not Allotted'}
                </p>
              </div>
            </FormGrid>
            <div>
              <span className="text-xs uppercase font-semibold text-gray-400">
                Purpose of Visit
              </span>
              <p className="p-3 bg-slate-50 border rounded mt-1">
                {popup.item.purpose}
              </p>
            </div>
            {popup.item.referenceDoc && (
              <div className="flex gap-2">
                <div className="flex items-center gap-2 p-2 bg-slate-100 border rounded text-xs">
                  <i className="pi pi-file text-red-500"></i>
                  <span>
                    <strong>Check-in reference:</strong>{' '}
                    {popup.item.referenceDoc}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-100 border rounded text-xs">
                  <i className="pi pi-image text-blue-500"></i>
                  <span>
                    <strong>Check-in Identity ID:</strong>{' '}
                    {popup.item.visitorIdProof}
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                label="Print Bill Receipt"
                icon="print"
                variant="primary"
                onClick={() => ToastService.success('Printing invoice PDF...')}
              />
              <Button label="Close" variant="outlined" onClick={closePopup} />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
