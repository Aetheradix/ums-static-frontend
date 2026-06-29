import { useState } from 'react';
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
  type ParkingRequest,
  type ConferenceBooking,
  type GuestHouseBooking,
  type TransportBooking,
  initialParkingRequests,
  initialConferenceBookings,
  initialGuestHouseBookings,
  initialTransportBookings,
} from '../../data';
import { essentialServicesUrls } from '../../urls';

const VEHICLE_OPTIONS = [
  { name: 'Two-Wheeler', value: 'Two-Wheeler' },
  { name: 'Four-Wheeler', value: 'Four-Wheeler' },
];

const LEVEL_OPTIONS = [
  { name: 'Departmental', value: 'Departmental' },
  { name: 'University', value: 'University' },
  { name: 'National', value: 'National' },
  { name: 'International', value: 'International' },
];

const VEHICLE_TYPES = [
  { name: 'Car', value: 'Car' },
  { name: 'Bus', value: 'Bus' },
  { name: 'Van', value: 'Van' },
];

const REQUEST_FOR_OPTIONS = [
  { name: 'Self', value: 'Self' },
  { name: 'Guest', value: 'Guest' },
  { name: 'Official Work', value: 'Official Work' },
];

const MEAL_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const MEAL_PREFS = [
  { name: 'Veg', value: 'Veg' },
  { name: 'Non-Veg', value: 'Non-Veg' },
  { name: 'Other', value: 'Other' },
];

export default function EmployeeBookingsPage() {
  const [parking, setParking] = useState<ParkingRequest[]>(
    initialParkingRequests.filter(p => p.userName === 'Dr. Ramesh Chandra')
  );
  const [conference, setConference] = useState<ConferenceBooking[]>(
    initialConferenceBookings.filter(
      c => c.coordinatorName === 'Dr. Alan Turing'
    )
  );
  const [guestHouse, setGuestHouse] = useState<GuestHouseBooking[]>(
    initialGuestHouseBookings.filter(g => g.userName === 'Dr. Ramesh Chandra')
  );
  const [transport, setTransport] = useState<TransportBooking[]>(
    initialTransportBookings.filter(
      t => t.inchargeName === 'Dr. Ramesh Chandra'
    )
  );

  // New Request Form states
  const [parkingForm, setParkingForm] = useState<{
    vehicleType: 'Two-Wheeler' | 'Four-Wheeler';
    registrationNumber: string;
    startDate: string;
    endDate: string;
    description: string;
  }>({
    vehicleType: 'Two-Wheeler',
    registrationNumber: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [confForm, setConfForm] = useState<{
    level: 'Departmental' | 'University' | 'National' | 'International';
    title: string;
    purpose: string;
    startDate: string;
    endDate: string;
    hallNo: string;
    participants: number;
  }>({
    level: 'Departmental',
    title: '',
    purpose: '',
    startDate: '',
    endDate: '',
    hallNo: 'CONF-101',
    participants: 10,
  });

  const [ghForm, setGhForm] = useState<{
    guestHouseName: string;
    guestType: string;
    expenditureHead: string;
    guestName: string;
    designation: string;
    contact: string;
    email: string;
    nationality: string;
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

  const [trForm, setTrForm] = useState<{
    vehicleType: string;
    capacity: number;
    requestFor: 'Self' | 'Guest' | 'Official Work';
    guestName: string;
    address: string;
    contact: string;
    departureFrom: string;
    arrivalTo: string;
    reason: string;
    startDate: string;
    endDate: string;
    otherInfo: string;
  }>({
    vehicleType: 'Car',
    capacity: 4,
    requestFor: 'Self',
    guestName: 'Dr. Ramesh Chandra',
    address: 'Campus Main Gate',
    contact: '+1 (555) 019-4455',
    departureFrom: '',
    arrivalTo: '',
    reason: '',
    startDate: '',
    endDate: '',
    otherInfo: '',
  });

  const [viewItem, setViewItem] = useState<{ type: string; item: any } | null>(
    null
  );

  const handleParkingSubmit = () => {
    const newReq: ParkingRequest = {
      id: `PRK-EMP-${Date.now().toString().slice(-4)}`,
      accountType: 'Employee',
      userName: 'Dr. Ramesh Chandra',
      vehicleType: parkingForm.vehicleType,
      registrationNumber: parkingForm.registrationNumber,
      description: parkingForm.description,
      startDate: parkingForm.startDate,
      endDate: parkingForm.endDate,
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setParking(prev => [newReq, ...prev]);
    ToastService.success('Parking allocation request submitted.');
    // Reset Form
    setParkingForm({
      vehicleType: 'Two-Wheeler',
      registrationNumber: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  const handleConferenceSubmit = () => {
    const newReq: ConferenceBooking = {
      id: `CRQ-EMP-${Date.now().toString().slice(-4)}`,
      accountType: 'Employee',
      coordinatorName: 'Dr. Alan Turing',
      level: confForm.level,
      title: confForm.title,
      purpose: confForm.purpose,
      startDate: confForm.startDate,
      endDate: confForm.endDate,
      hallNo: confForm.hallNo,
      participants: confForm.participants,
      status: 'Pending',
    };
    setConference(prev => [newReq, ...prev]);
    ToastService.success('Conference room booking request submitted.');
    setConfForm({
      level: 'Departmental',
      title: '',
      purpose: '',
      startDate: '',
      endDate: '',
      hallNo: 'CONF-101',
      participants: 10,
    });
  };

  const handleGuestHouseSubmit = () => {
    const newReq: GuestHouseBooking = {
      id: `GHB-EMP-${Date.now().toString().slice(-4)}`,
      guestHouseName: ghForm.guestHouseName,
      guestType: ghForm.guestType,
      expenditureHead: ghForm.expenditureHead,
      guestName: ghForm.guestName,
      designation: ghForm.designation,
      contact: ghForm.contact,
      email: ghForm.email,
      nationality: ghForm.nationality,
      accountType: 'Employee',
      userName: 'Dr. Ramesh Chandra',
      purpose: ghForm.purpose,
      accompanyingPerson: ghForm.accompanyingPerson,
      arrivalDate: ghForm.arrivalDate,
      departureDate: ghForm.departureDate,
      roomType: ghForm.roomType,
      occupancyCount: ghForm.occupancyCount,
      roomsRequired: ghForm.roomsRequired,
      mealIncluded: ghForm.mealIncluded,
      mealPreference: ghForm.mealPreference,
      specialRequirements: ghForm.specialRequirements,
      status: 'Pending',
    };
    setGuestHouse(prev => [newReq, ...prev]);
    ToastService.success('Guest House lodging booking request submitted.');
    setGhForm({
      guestHouseName: 'Main Campus Guest House',
      guestType: 'Official Institutional Guest',
      expenditureHead: 'Dean Academics Budget',
      guestName: '',
      designation: '',
      contact: '',
      email: '',
      nationality: 'Indian',
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
  };

  const handleTransportSubmit = () => {
    const newReq: TransportBooking = {
      id: `TRP-EMP-${Date.now().toString().slice(-4)}`,
      vehicleType: trForm.vehicleType,
      capacity: trForm.capacity,
      requestFor: trForm.requestFor,
      guestName: trForm.guestName,
      address: trForm.address,
      contact: trForm.contact,
      departureFrom: trForm.departureFrom,
      arrivalTo: trForm.arrivalTo,
      reason: trForm.reason,
      accountType: 'Employee',
      inchargeName: 'Dr. Ramesh Chandra',
      startDate: trForm.startDate,
      endDate: trForm.endDate,
      otherInfo: trForm.otherInfo,
      status: 'Pending',
    };
    setTransport(prev => [newReq, ...prev]);
    ToastService.success('Transport dispatch request submitted.');
    setTrForm({
      vehicleType: 'Car',
      capacity: 4,
      requestFor: 'Self',
      guestName: 'Dr. Ramesh Chandra',
      address: 'Campus Main Gate',
      contact: '+1 (555) 019-4455',
      departureFrom: '',
      arrivalTo: '',
      reason: '',
      startDate: '',
      endDate: '',
      otherInfo: '',
    });
  };

  const cancelParking = (id: string) => {
    setParking(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Cancelled' } : p))
    );
    ToastService.success('Parking space request cancelled.');
  };

  const cancelConference = (id: string) => {
    setConference(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'Cancelled' } : c))
    );
    ToastService.success('Conference booking request cancelled.');
  };

  const cancelGuestHouse = (id: string) => {
    setGuestHouse(prev =>
      prev.map(g => (g.id === id ? { ...g, status: 'Cancelled' } : g))
    );
    ToastService.success('Guest House lodging booking request cancelled.');
  };

  const cancelTransport = (id: string) => {
    setTransport(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'Cancelled' } : t))
    );
    ToastService.success('Transport dispatch request cancelled.');
  };

  const printPermit = (type: string, id: string) => {
    ToastService.success(
      `Generating PDF print manifest for ${type} ticket: ${id}`
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Check-In':
        return 'approved';
      case 'Pending':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Facility Bookings & Requests"
      description="Submit new request tickets for institutional services, and check approval hierarchies or cancellation limits."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Employee Portal', to: essentialServicesUrls.employee.portal },
        { label: 'My Bookings' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'New Service Request Ticket',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Request Parking */}
                <FormCard
                  title="Request Parking Space Allocation"
                  icon="local-parking"
                >
                  <FormGrid columns={1}>
                    <DropDownList
                      label="Type of Vehicle"
                      data={VEHICLE_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={parkingForm.vehicleType}
                      onChange={v =>
                        setParkingForm(f => ({ ...f, vehicleType: v as any }))
                      }
                    />
                    <TextBox
                      label="Vehicle Registration Number"
                      placeholder="e.g. DL11AB1234"
                      value={parkingForm.registrationNumber}
                      onChange={v =>
                        setParkingForm(f => ({ ...f, registrationNumber: v }))
                      }
                      required
                    />
                    <TextBox
                      label="Start Date"
                      placeholder="YYYY-MM-DD"
                      value={parkingForm.startDate}
                      onChange={v =>
                        setParkingForm(f => ({ ...f, startDate: v }))
                      }
                      required
                    />
                    <TextBox
                      label="End Date"
                      placeholder="YYYY-MM-DD"
                      value={parkingForm.endDate}
                      onChange={v =>
                        setParkingForm(f => ({ ...f, endDate: v }))
                      }
                      required
                    />
                    <TextArea
                      label="Purpose Description"
                      placeholder="e.g. Commute of faculty member"
                      value={parkingForm.description}
                      onChange={v =>
                        setParkingForm(f => ({ ...f, description: v }))
                      }
                      rows={2}
                    />
                    <Button
                      label="Submit Vehicle details"
                      variant="primary"
                      onClick={handleParkingSubmit}
                    />
                  </FormGrid>
                </FormCard>

                {/* 2. Request Conference */}
                <FormCard
                  title="Reserve Conference Seminar Hall"
                  icon="co-present"
                >
                  <FormGrid columns={1}>
                    <DropDownList
                      label="Conference Level"
                      data={LEVEL_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={confForm.level}
                      onChange={v =>
                        setConfForm(f => ({ ...f, level: v as any }))
                      }
                    />
                    <TextBox
                      label="Title of Conference"
                      placeholder="Official event name"
                      value={confForm.title}
                      onChange={v => setConfForm(f => ({ ...f, title: v }))}
                      required
                    />
                    <TextBox
                      label="Start Date & Time"
                      placeholder="YYYY-MM-DD HH:MM"
                      value={confForm.startDate}
                      onChange={v => setConfForm(f => ({ ...f, startDate: v }))}
                      required
                    />
                    <TextBox
                      label="End Date & Time"
                      placeholder="YYYY-MM-DD HH:MM"
                      value={confForm.endDate}
                      onChange={v => setConfForm(f => ({ ...f, endDate: v }))}
                      required
                    />
                    <TextBox
                      label="Preferred Hall Number"
                      placeholder="e.g. CONF-101"
                      value={confForm.hallNo}
                      onChange={v => setConfForm(f => ({ ...f, hallNo: v }))}
                      required
                    />
                    <TextBox
                      label="Expected Speakers & Participants"
                      value={String(confForm.participants)}
                      onChange={v =>
                        setConfForm(f => ({ ...f, participants: Number(v) }))
                      }
                      required
                    />
                    <TextArea
                      label="Purpose of Booking"
                      placeholder="Objective of hosting the senate..."
                      value={confForm.purpose}
                      onChange={v => setConfForm(f => ({ ...f, purpose: v }))}
                      rows={2}
                      required
                    />
                    <Button
                      label="Submit Conference booking"
                      variant="primary"
                      onClick={handleConferenceSubmit}
                    />
                  </FormGrid>
                </FormCard>

                {/* 3. Request Guest House */}
                <FormCard title="Request Guest House Lodging Stay" icon="hotel">
                  <FormGrid columns={1}>
                    <TextBox
                      label="Name of the Guest"
                      placeholder="Full Name"
                      value={ghForm.guestName}
                      onChange={v => setGhForm(f => ({ ...f, guestName: v }))}
                      required
                    />
                    <TextBox
                      label="Designation & Address"
                      placeholder="Official title and address"
                      value={ghForm.designation}
                      onChange={v => setGhForm(f => ({ ...f, designation: v }))}
                      required
                    />
                    <TextBox
                      label="Contact Mobile Number"
                      placeholder="+1 (555) 019-4455"
                      value={ghForm.contact}
                      onChange={v => setGhForm(f => ({ ...f, contact: v }))}
                      required
                    />
                    <TextBox
                      label="Email Address"
                      placeholder="guest@caltech.edu"
                      value={ghForm.email}
                      onChange={v => setGhForm(f => ({ ...f, email: v }))}
                      required
                    />
                    <TextBox
                      label="Arrival Date & Time (Check-In)"
                      placeholder="YYYY-MM-DD HH:MM"
                      value={ghForm.arrivalDate}
                      onChange={v => setGhForm(f => ({ ...f, arrivalDate: v }))}
                      required
                    />
                    <TextBox
                      label="Departure Date & Time (Check-Out)"
                      placeholder="YYYY-MM-DD HH:MM"
                      value={ghForm.departureDate}
                      onChange={v =>
                        setGhForm(f => ({ ...f, departureDate: v }))
                      }
                      required
                    />
                    <TextBox
                      label="Room Type Required"
                      placeholder="e.g. VIP Suite"
                      value={ghForm.roomType}
                      onChange={v => setGhForm(f => ({ ...f, roomType: v }))}
                      required
                    />
                    <TextBox
                      label="Number of Rooms Required"
                      value={String(ghForm.roomsRequired)}
                      onChange={v =>
                        setGhForm(f => ({ ...f, roomsRequired: Number(v) }))
                      }
                      required
                    />
                    <DropDownList
                      label="Meal Included?"
                      data={MEAL_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={ghForm.mealIncluded}
                      onChange={v =>
                        setGhForm(f => ({ ...f, mealIncluded: v as any }))
                      }
                      required
                    />
                    {ghForm.mealIncluded === 'Yes' && (
                      <DropDownList
                        label="Meal Preference"
                        data={MEAL_PREFS}
                        textField="name"
                        optionValue="value"
                        value={ghForm.mealPreference}
                        onChange={v =>
                          setGhForm(f => ({ ...f, mealPreference: v as any }))
                        }
                      />
                    )}
                    <TextArea
                      label="Purpose of Visit"
                      placeholder="e.g. Guest speaker for research convocation"
                      value={ghForm.purpose}
                      onChange={v => setGhForm(f => ({ ...f, purpose: v }))}
                      rows={2}
                      required
                    />
                    <Button
                      label="Submit stay"
                      variant="primary"
                      onClick={handleGuestHouseSubmit}
                    />
                  </FormGrid>
                </FormCard>

                {/* 4. Request Transport */}
                <FormCard
                  title="Request Fleet Transport transit"
                  icon="directions-bus"
                >
                  <FormGrid columns={1}>
                    <DropDownList
                      label="Vehicle Type Class"
                      data={VEHICLE_TYPES}
                      textField="name"
                      optionValue="value"
                      value={trForm.vehicleType}
                      onChange={v =>
                        setTrForm(f => ({ ...f, vehicleType: String(v ?? '') }))
                      }
                    />
                    <DropDownList
                      label="Purpose Class (Request For)"
                      data={REQUEST_FOR_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={trForm.requestFor}
                      onChange={v =>
                        setTrForm(f => ({ ...f, requestFor: v as any }))
                      }
                    />
                    <TextBox
                      label="Passenger Full Name"
                      value={trForm.guestName}
                      onChange={v => setTrForm(f => ({ ...f, guestName: v }))}
                      required
                    />
                    <TextBox
                      label="Contact Number"
                      value={trForm.contact}
                      onChange={v => setTrForm(f => ({ ...f, contact: v }))}
                      required
                    />
                    <TextBox
                      label="Pickup Location (From)"
                      placeholder="Airport Terminal 3"
                      value={trForm.departureFrom}
                      onChange={v =>
                        setTrForm(f => ({ ...f, departureFrom: v }))
                      }
                      required
                    />
                    <TextBox
                      label="Drop-off Location (To)"
                      placeholder="Main Campus Guest House"
                      value={trForm.arrivalTo}
                      onChange={v => setTrForm(f => ({ ...f, arrivalTo: v }))}
                      required
                    />
                    <TextBox
                      label="Departure Travel Date"
                      placeholder="YYYY-MM-DD HH:MM"
                      value={trForm.startDate}
                      onChange={v => setTrForm(f => ({ ...f, startDate: v }))}
                      required
                    />
                    <TextBox
                      label="Arrival Travel Date"
                      placeholder="YYYY-MM-DD HH:MM"
                      value={trForm.endDate}
                      onChange={v => setTrForm(f => ({ ...f, endDate: v }))}
                      required
                    />
                    <TextArea
                      label="Reason for Travel Request"
                      placeholder="Explain travel logistics purpose..."
                      value={trForm.reason}
                      onChange={v => setTrForm(f => ({ ...f, reason: v }))}
                      rows={2}
                      required
                    />
                    <Button
                      label="Submit transit details"
                      variant="primary"
                      onClick={handleTransportSubmit}
                    />
                  </FormGrid>
                </FormCard>
              </div>
            ),
          },
          {
            title: 'My Request Ticket History',
            content: (
              <div className="space-y-6">
                <FormCard title="Parking Request Tickets">
                  <GridPanel
                    data={parking}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '130px' },
                      {
                        field: 'vehicleType',
                        header: 'Vehicle',
                        width: '130px',
                      },
                      {
                        field: 'registrationNumber',
                        header: 'Registration No',
                      },
                      {
                        field: 'startDate',
                        header: 'Start Date',
                        width: '130px',
                      },
                      { field: 'endDate', header: 'End Date', width: '130px' },
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
                        width: '240px',
                        cell: (item: ParkingRequest) => (
                          <div className="flex gap-2">
                            <Button
                              label="View"
                              icon="eye"
                              variant="outlined"
                              onClick={() =>
                                setViewItem({ type: 'Parking', item })
                              }
                            />
                            {item.status === 'Pending' && (
                              <Button
                                label="Cancel"
                                icon="times"
                                variant="outlined"
                                onClick={() => cancelParking(item.id)}
                              />
                            )}
                            {item.status === 'Approved' && (
                              <Button
                                label="Print"
                                icon="print"
                                variant="outlined"
                                onClick={() => printPermit('Parking', item.id)}
                              />
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </FormCard>

                <FormCard title="Conference Hall Request Tickets">
                  <GridPanel
                    data={conference}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '130px' },
                      { field: 'title', header: 'Conference Title' },
                      {
                        field: 'startDate',
                        header: 'Start Date',
                        width: '130px',
                      },
                      { field: 'endDate', header: 'End Date', width: '130px' },
                      { field: 'hallNo', header: 'Hall Slot', width: '130px' },
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
                        width: '240px',
                        cell: (item: ConferenceBooking) => (
                          <div className="flex gap-2">
                            <Button
                              label="View"
                              icon="eye"
                              variant="outlined"
                              onClick={() =>
                                setViewItem({ type: 'Conference', item })
                              }
                            />
                            {item.status === 'Pending' && (
                              <Button
                                label="Cancel"
                                icon="times"
                                variant="outlined"
                                onClick={() => cancelConference(item.id)}
                              />
                            )}
                            {item.status === 'Approved' && (
                              <Button
                                label="Print"
                                icon="print"
                                variant="outlined"
                                onClick={() =>
                                  printPermit('Conference', item.id)
                                }
                              />
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </FormCard>

                <FormCard title="Guest House Request Tickets">
                  <GridPanel
                    data={guestHouse}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '130px' },
                      { field: 'guestName', header: 'Guest Name' },
                      {
                        field: 'roomType',
                        header: 'Room Type',
                        width: '140px',
                      },
                      {
                        field: 'arrivalDate',
                        header: 'Arrival',
                        width: '130px',
                      },
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
                        header: 'Actions',
                        width: '240px',
                        cell: (item: GuestHouseBooking) => (
                          <div className="flex gap-2">
                            <Button
                              label="View"
                              icon="eye"
                              variant="outlined"
                              onClick={() =>
                                setViewItem({ type: 'GuestHouse', item })
                              }
                            />
                            {(item.status === 'Pending' ||
                              item.status === 'Approved') && (
                              <Button
                                label="Cancel"
                                icon="times"
                                variant="outlined"
                                onClick={() => cancelGuestHouse(item.id)}
                              />
                            )}
                            {(item.status === 'Approved' ||
                              item.status === 'Check-In' ||
                              item.status === 'Check-Out') && (
                              <Button
                                label="Print"
                                icon="print"
                                variant="outlined"
                                onClick={() =>
                                  printPermit('Guest House', item.id)
                                }
                              />
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </FormCard>

                <FormCard title="Transport Request Tickets">
                  <GridPanel
                    data={transport}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '130px' },
                      { field: 'guestName', header: 'Passenger' },
                      { field: 'departureFrom', header: 'From' },
                      { field: 'arrivalTo', header: 'To' },
                      {
                        field: 'startDate',
                        header: 'Travel Start',
                        width: '130px',
                      },
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
                        width: '240px',
                        cell: (item: TransportBooking) => (
                          <div className="flex gap-2">
                            <Button
                              label="View"
                              icon="eye"
                              variant="outlined"
                              onClick={() =>
                                setViewItem({ type: 'Transport', item })
                              }
                            />
                            {item.status === 'Pending' && (
                              <Button
                                label="Cancel"
                                icon="times"
                                variant="outlined"
                                onClick={() => cancelTransport(item.id)}
                              />
                            )}
                            {item.status === 'Approved' && (
                              <Button
                                label="Print"
                                icon="print"
                                variant="outlined"
                                onClick={() =>
                                  printPermit('Transport', item.id)
                                }
                              />
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </FormCard>
              </div>
            ),
          },
        ]}
      />

      {/* Ticket Details View Popup */}
      <FormPopup
        visible={viewItem !== null}
        onHide={() => setViewItem(null)}
        title={viewItem ? `View ${viewItem.type} request` : ''}
        subtitle={viewItem ? viewItem.item.id : ''}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4 text-sm text-gray-700">
            {viewItem.type === 'Parking' && (
              <FormGrid columns={2}>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Vehicle Class
                  </span>
                  <p className="font-semibold">{viewItem.item.vehicleType}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Registration Number
                  </span>
                  <p className="font-semibold">
                    {viewItem.item.registrationNumber}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Validity Schedule
                  </span>
                  <p className="font-semibold">
                    {viewItem.item.startDate} to {viewItem.item.endDate}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Allotted Slot
                  </span>
                  <p className="font-semibold text-teal-600 font-bold">
                    {viewItem.item.allottedSlot || 'Not Allotted Yet'}
                  </p>
                </div>
              </FormGrid>
            )}

            {viewItem.type === 'Conference' && (
              <FormGrid columns={2}>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Title of Conference
                  </span>
                  <p className="font-semibold">{viewItem.item.title}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Conference Level
                  </span>
                  <p className="font-semibold">{viewItem.item.level}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Schedule Period
                  </span>
                  <p className="font-semibold">
                    {viewItem.item.startDate} to {viewItem.item.endDate}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Allotted Hall Number
                  </span>
                  <p className="font-semibold text-green-600 font-bold">
                    {viewItem.item.hallNo || 'Not Assigned'}
                  </p>
                </div>
              </FormGrid>
            )}

            {viewItem.type === 'GuestHouse' && (
              <FormGrid columns={2}>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Guest Full Name
                  </span>
                  <p className="font-semibold">{viewItem.item.guestName}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Designation
                  </span>
                  <p className="font-semibold">{viewItem.item.designation}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Stay Schedule
                  </span>
                  <p className="font-semibold">
                    {viewItem.item.arrivalDate} to {viewItem.item.departureDate}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Allotted lodging Room
                  </span>
                  <p className="font-semibold text-amber-600 font-bold">
                    {viewItem.item.allottedRooms || 'Not Assigned'}
                  </p>
                </div>
              </FormGrid>
            )}

            {viewItem.type === 'Transport' && (
              <FormGrid columns={2}>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Passenger Name
                  </span>
                  <p className="font-semibold">{viewItem.item.guestName}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Travel Directions
                  </span>
                  <p className="font-semibold">
                    From: {viewItem.item.departureFrom} → To:{' '}
                    {viewItem.item.arrivalTo}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Travel Start
                  </span>
                  <p className="font-semibold">{viewItem.item.startDate}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold">
                    Assigned Fleet Details
                  </span>
                  <p className="font-semibold text-orange-600 font-bold">
                    {viewItem.item.assignedVehicle?.vehicleDetails ||
                      'Fleet Not Assigned Yet'}
                  </p>
                  {viewItem.item.assignedVehicle && (
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Driver: {viewItem.item.assignedVehicle.driverName}
                    </p>
                  )}
                </div>
              </FormGrid>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setViewItem(null)}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
