import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  initialParkingRequests,
  initialConferenceBookings,
  initialGuestHouseBookings,
  initialTransportBookings,
} from '../../data';
import { essentialServicesUrls } from '../../urls';

const ACCOUNT_OPTIONS = [
  { name: 'All Accounts', value: '' },
  { name: 'Employee', value: 'Employee' },
  { name: 'Administrative', value: 'Administrative' },
];

const VEHICLE_OPTIONS = [
  { name: 'All Vehicles', value: '' },
  { name: 'Two-Wheeler', value: 'Two-Wheeler' },
  { name: 'Four-Wheeler', value: 'Four-Wheeler' },
];

const LEVEL_OPTIONS = [
  { name: 'All Levels', value: '' },
  { name: 'Departmental', value: 'Departmental' },
  { name: 'University', value: 'University' },
  { name: 'National', value: 'National' },
  { name: 'International', value: 'International' },
];

const TRANSPORT_REQUEST_FOR = [
  { name: 'All Purposes', value: '' },
  { name: 'Self', value: 'Self' },
  { name: 'Guest', value: 'Guest' },
  { name: 'Official Work', value: 'Official Work' },
];

export default function ReportsPage() {
  // Query filters
  const [parkingFilter, setParkingFilter] = useState({
    name: '',
    type: '',
    vehicle: '',
    registration: '',
  });
  const [confFilter, setConfFilter] = useState({
    name: '',
    level: '',
    title: '',
  });
  const [ghFilter, setGhFilter] = useState({
    name: '',
    type: '',
    guestName: '',
    designation: '',
  });
  const [trFilter, setTrFilter] = useState({
    type: '',
    purpose: '',
    guestName: '',
  });

  // Grid datasets
  const [parkingData, setParkingData] = useState(initialParkingRequests);
  const [confData, setConfData] = useState(initialConferenceBookings);
  const [ghData, setGhData] = useState(initialGuestHouseBookings);
  const [trData, setTrData] = useState(initialTransportBookings);

  const handleParkingSearch = () => {
    let filtered = initialParkingRequests;
    if (parkingFilter.name) {
      filtered = filtered.filter(p =>
        p.userName.toLowerCase().includes(parkingFilter.name.toLowerCase())
      );
    }
    if (parkingFilter.type) {
      filtered = filtered.filter(p => p.accountType === parkingFilter.type);
    }
    if (parkingFilter.vehicle) {
      filtered = filtered.filter(p => p.vehicleType === parkingFilter.vehicle);
    }
    if (parkingFilter.registration) {
      filtered = filtered.filter(p =>
        p.registrationNumber
          .toLowerCase()
          .includes(parkingFilter.registration.toLowerCase())
      );
    }
    setParkingData(filtered);
    ToastService.success(
      `Found ${filtered.length} matching parking request records.`
    );
  };

  const handleConfSearch = () => {
    let filtered = initialConferenceBookings;
    if (confFilter.name) {
      filtered = filtered.filter(c =>
        c.coordinatorName.toLowerCase().includes(confFilter.name.toLowerCase())
      );
    }
    if (confFilter.level) {
      filtered = filtered.filter(c => c.level === confFilter.level);
    }
    if (confFilter.title) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(confFilter.title.toLowerCase())
      );
    }
    setConfData(filtered);
    ToastService.success(
      `Found ${filtered.length} matching conference booking records.`
    );
  };

  const handleGhSearch = () => {
    let filtered = initialGuestHouseBookings;
    if (ghFilter.name) {
      filtered = filtered.filter(g =>
        g.userName.toLowerCase().includes(ghFilter.name.toLowerCase())
      );
    }
    if (ghFilter.type) {
      filtered = filtered.filter(g => g.accountType === ghFilter.type);
    }
    if (ghFilter.guestName) {
      filtered = filtered.filter(g =>
        g.guestName.toLowerCase().includes(ghFilter.guestName.toLowerCase())
      );
    }
    if (ghFilter.designation) {
      filtered = filtered.filter(g =>
        g.designation.toLowerCase().includes(ghFilter.designation.toLowerCase())
      );
    }
    setGhData(filtered);
    ToastService.success(
      `Found ${filtered.length} matching guest house booking records.`
    );
  };

  const handleTrSearch = () => {
    let filtered = initialTransportBookings;
    if (trFilter.type) {
      filtered = filtered.filter(t => t.vehicleType === trFilter.type);
    }
    if (trFilter.purpose) {
      filtered = filtered.filter(t => t.requestFor === trFilter.purpose);
    }
    if (trFilter.guestName) {
      filtered = filtered.filter(t =>
        t.guestName.toLowerCase().includes(trFilter.guestName.toLowerCase())
      );
    }
    setTrData(filtered);
    ToastService.success(
      `Found ${filtered.length} matching transport booking records.`
    );
  };

  const triggerExport = (format: 'CSV' | 'PDF' | 'Copy', type: string) => {
    if (format === 'Copy') {
      ToastService.success(`Copied ${type} report rows to clipboard.`);
    } else {
      ToastService.success(`Downloaded ${type} report as ${format}.`);
    }
  };

  const renderToolbar = (type: string) => (
    <div className="flex gap-2">
      <Button
        label="Export CSV"
        icon="file-excel"
        variant="outlined"
        onClick={() => triggerExport('CSV', type)}
      />
      <Button
        label="Download PDF"
        icon="file-pdf"
        variant="outlined"
        onClick={() => triggerExport('PDF', type)}
      />
      <Button
        label="Copy Data"
        icon="copy"
        variant="outlined"
        onClick={() => triggerExport('Copy', type)}
      />
    </div>
  );

  return (
    <FormPage
      title="Analytical Reports"
      description="Query system records by account parameters, travel directions, or stay dates and download spreadsheets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Analytical Reports' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Parking Report',
            content: (
              <div className="space-y-6">
                <FormCard title="Search Filter Parameters" icon="search">
                  <FormGrid columns={4}>
                    <TextBox
                      label="Employee / Account Name"
                      placeholder="e.g. Ramesh Chandra"
                      value={parkingFilter.name}
                      onChange={v => setParkingFilter(f => ({ ...f, name: v }))}
                    />
                    <DropDownList
                      label="Type of Account"
                      data={ACCOUNT_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={parkingFilter.type}
                      onChange={v =>
                        setParkingFilter(f => ({ ...f, type: String(v ?? '') }))
                      }
                    />
                    <DropDownList
                      label="Vehicle Type"
                      data={VEHICLE_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={parkingFilter.vehicle}
                      onChange={v =>
                        setParkingFilter(f => ({
                          ...f,
                          vehicle: String(v ?? ''),
                        }))
                      }
                    />
                    <TextBox
                      label="Vehicle Registration Number"
                      placeholder="e.g. DL11AB"
                      value={parkingFilter.registration}
                      onChange={v =>
                        setParkingFilter(f => ({ ...f, registration: v }))
                      }
                    />
                  </FormGrid>
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                    <Button
                      label="Reset filters"
                      variant="outlined"
                      onClick={() =>
                        setParkingFilter({
                          name: '',
                          type: '',
                          vehicle: '',
                          registration: '',
                        })
                      }
                    />
                    <Button
                      label="Generate Search Report"
                      icon="search"
                      variant="primary"
                      onClick={handleParkingSearch}
                    />
                  </div>
                </FormCard>

                <FormCard title="Query Report Result">
                  <GridPanel
                    data={parkingData}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '120px' },
                      {
                        field: 'accountType',
                        header: 'Account Type',
                        width: '130px',
                      },
                      { field: 'userName', header: 'Employee/Admin Name' },
                      {
                        field: 'vehicleType',
                        header: 'Vehicle',
                        width: '130px',
                      },
                      {
                        field: 'registrationNumber',
                        header: 'Registration No',
                        width: '150px',
                      },
                      {
                        field: 'allottedSlot',
                        header: 'Parking Slot',
                        cell: (item: any) => (
                          <span>{item.allottedSlot || 'Not Allotted'}</span>
                        ),
                        width: '130px',
                      },
                      {
                        field: 'startDate',
                        header: 'Start Date',
                        width: '130px',
                      },
                      { field: 'endDate', header: 'End Date', width: '130px' },
                      {
                        field: 'status',
                        header: 'Status',
                        width: '130px',
                        cell: (item: any) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Approved'
                                ? 'approved'
                                : 'neutral'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={renderToolbar('Parking')}
                  />
                </FormCard>
              </div>
            ),
          },
          {
            title: 'Conference Report',
            content: (
              <div className="space-y-6">
                <FormCard title="Search Filter Parameters" icon="search">
                  <FormGrid columns={3}>
                    <TextBox
                      label="Coordinator Name"
                      placeholder="e.g. Alan Turing"
                      value={confFilter.name}
                      onChange={v => setConfFilter(f => ({ ...f, name: v }))}
                    />
                    <DropDownList
                      label="Conference Level"
                      data={LEVEL_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={confFilter.level}
                      onChange={v =>
                        setConfFilter(f => ({ ...f, level: String(v ?? '') }))
                      }
                    />
                    <TextBox
                      label="Title of Conference"
                      placeholder="e.g. Robotics"
                      value={confFilter.title}
                      onChange={v => setConfFilter(f => ({ ...f, title: v }))}
                    />
                  </FormGrid>
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                    <Button
                      label="Reset filters"
                      variant="outlined"
                      onClick={() =>
                        setConfFilter({ name: '', level: '', title: '' })
                      }
                    />
                    <Button
                      label="Generate Search Report"
                      icon="search"
                      variant="primary"
                      onClick={handleConfSearch}
                    />
                  </div>
                </FormCard>

                <FormCard title="Query Report Result">
                  <GridPanel
                    data={confData}
                    columns={[
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
                        cell: (item: any) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Approved'
                                ? 'approved'
                                : 'neutral'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={renderToolbar('Conference')}
                  />
                </FormCard>
              </div>
            ),
          },
          {
            title: 'Guest House Report',
            content: (
              <div className="space-y-6">
                <FormCard title="Search Filter Parameters" icon="search">
                  <FormGrid columns={4}>
                    <TextBox
                      label="Requester Employee Name"
                      placeholder="e.g. Ramesh Chandra"
                      value={ghFilter.name}
                      onChange={v => setGhFilter(f => ({ ...f, name: v }))}
                    />
                    <DropDownList
                      label="Type of Account"
                      data={ACCOUNT_OPTIONS}
                      textField="name"
                      optionValue="value"
                      value={ghFilter.type}
                      onChange={v =>
                        setGhFilter(f => ({ ...f, type: String(v ?? '') }))
                      }
                    />
                    <TextBox
                      label="Guest Name"
                      placeholder="e.g. Richard Feynman"
                      value={ghFilter.guestName}
                      onChange={v => setGhFilter(f => ({ ...f, guestName: v }))}
                    />
                    <TextBox
                      label="Guest Designation"
                      placeholder="e.g. Professor"
                      value={ghFilter.designation}
                      onChange={v =>
                        setGhFilter(f => ({ ...f, designation: v }))
                      }
                    />
                  </FormGrid>
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                    <Button
                      label="Reset filters"
                      variant="outlined"
                      onClick={() =>
                        setGhFilter({
                          name: '',
                          type: '',
                          guestName: '',
                          designation: '',
                        })
                      }
                    />
                    <Button
                      label="Generate Search Report"
                      icon="search"
                      variant="primary"
                      onClick={handleGhSearch}
                    />
                  </div>
                </FormCard>

                <FormCard title="Query Report Result">
                  <GridPanel
                    data={ghData}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '120px' },
                      { field: 'guestName', header: 'Guest Name' },
                      { field: 'designation', header: 'Designation' },
                      {
                        field: 'roomType',
                        header: 'Lodging Room Type',
                        width: '150px',
                      },
                      {
                        field: 'allottedRooms',
                        header: 'Allotted Room',
                        cell: (item: any) => (
                          <span>{item.allottedRooms || 'Not Allotted'}</span>
                        ),
                        width: '130px',
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
                        field: 'status',
                        header: 'Status',
                        width: '130px',
                        cell: (item: any) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Check-In' ||
                              item.status === 'Approved'
                                ? 'approved'
                                : 'neutral'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={renderToolbar('GuestHouse')}
                  />
                </FormCard>
              </div>
            ),
          },
          {
            title: 'Transport Report',
            content: (
              <div className="space-y-6">
                <FormCard title="Search Filter Parameters" icon="search">
                  <FormGrid columns={3}>
                    <TextBox
                      label="Vehicle Type Required"
                      placeholder="e.g. Car / Bus"
                      value={trFilter.type}
                      onChange={v => setTrFilter(f => ({ ...f, type: v }))}
                    />
                    <DropDownList
                      label="Request Purpose (For)"
                      data={TRANSPORT_REQUEST_FOR}
                      textField="name"
                      optionValue="value"
                      value={trFilter.purpose}
                      onChange={v =>
                        setTrFilter(f => ({ ...f, purpose: String(v ?? '') }))
                      }
                    />
                    <TextBox
                      label="Passenger / Guest Name"
                      placeholder="e.g. Feynman"
                      value={trFilter.guestName}
                      onChange={v => setTrFilter(f => ({ ...f, guestName: v }))}
                    />
                  </FormGrid>
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                    <Button
                      label="Reset filters"
                      variant="outlined"
                      onClick={() =>
                        setTrFilter({ type: '', purpose: '', guestName: '' })
                      }
                    />
                    <Button
                      label="Generate Search Report"
                      icon="search"
                      variant="primary"
                      onClick={handleTrSearch}
                    />
                  </div>
                </FormCard>

                <FormCard title="Query Report Result">
                  <GridPanel
                    data={trData}
                    columns={[
                      { field: 'id', header: 'Request ID', width: '120px' },
                      {
                        field: 'vehicleType',
                        header: 'Vehicle',
                        width: '130px',
                      },
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
                        cell: (item: any) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Approved'
                                ? 'approved'
                                : 'neutral'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={renderToolbar('Transport')}
                  />
                </FormCard>
              </div>
            ),
          },
        ]}
      />
    </FormPage>
  );
}
