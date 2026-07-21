import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { GEO_TREE } from '../../mockData';

export default function HostelMaster() {
  const { hostels, setHostels, triggerNotification } = useHostel();
  const [showList, setShowList] = useState(false);

  // Form State
  const [hostelName, setHostelName] = useState('');
  const [hostelNameHindi, setHostelNameHindi] = useState('');
  const [hostelCode, setHostelCode] = useState('');
  const [campusId, setCampusId] = useState('');
  const [hostelType, setHostelType] = useState('BOYS');
  const [hostelCategory, setHostelCategory] = useState('UG');
  const [establishmentYear, setEstablishmentYear] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [totalRooms, setTotalRooms] = useState('');
  const [totalCapacity, setTotalCapacity] = useState('');

  const [isGirlsHostel, setIsGirlsHostel] = useState(false);
  const [twentyFourSevenSecurity, setTwentyFourSevenSecurity] = useState(false);
  const [restrictedVisitorHours, setRestrictedVisitorHours] = useState(false);

  const [psName, setPsName] = useState('');
  const [psAddress, setPsAddress] = useState('');
  const [psContact, setPsContact] = useState('');

  const [hospName, setHospName] = useState('');
  const [hospAddress, setHospAddress] = useState('');
  const [hospContact, setHospContact] = useState('');

  const [wardenName, setWardenName] = useState('');
  const [wardenMobile, setWardenMobile] = useState('');
  const [wardenDesignation, setWardenDesignation] = useState('');
  const [wardenEmail, setWardenEmail] = useState('');

  const [status, setStatus] = useState('ACTIVE');
  const [remarks, setRemarks] = useState('');

  const reset = () => {
    setHostelName('');
    setHostelNameHindi('');
    setHostelCode('');
    setCampusId('');
    setHostelType('BOYS');
    setHostelCategory('UG');
    setEstablishmentYear('');
    setAddress('');
    setContactNumber('');
    setTotalRooms('');
    setTotalCapacity('');
    setIsGirlsHostel(false);
    setTwentyFourSevenSecurity(false);
    setRestrictedVisitorHours(false);
    setPsName('');
    setPsAddress('');
    setPsContact('');
    setHospName('');
    setHospAddress('');
    setHospContact('');
    setWardenName('');
    setWardenMobile('');
    setWardenDesignation('');
    setWardenEmail('');
    setStatus('ACTIVE');
    setRemarks('');
  };

  const handleSave = () => {
    if (!hostelName || !hostelCode || !campusId) {
      triggerNotification(
        'Please fill mandatory fields: Name, Code, Campus',
        'error'
      );
      return;
    }
    const newHostel: HostelManagement.Hostel = {
      id: `H-${Date.now()}`,
      hostelName,
      hostelNameHindi,
      hostelCode,
      campusId,
      campusName:
        GEO_TREE[0].children?.find(c => c.id === campusId)?.name || 'Unknown',
      hostelType: hostelType as any,
      hostelCategory: hostelCategory as any,
      establishmentYear: parseInt(establishmentYear) || 2000,
      address,
      contactNumber,
      totalRooms: parseInt(totalRooms) || 0,
      totalCapacity: parseInt(totalCapacity) || 0,
      occupiedBeds: 0,
      availableBeds: parseInt(totalCapacity) || 0,
      amenities: [],
      policeStation: {
        name: psName,
        address: psAddress,
        contactNumber: psContact,
      },
      nearestHospital: {
        name: hospName,
        address: hospAddress,
        contactNumber: hospContact,
      },
      warden: {
        name: wardenName,
        mobile: wardenMobile,
        designation: wardenDesignation,
        email: wardenEmail,
      },
      isGirlsHostel,
      twentyFourSevenSecurity,
      restrictedVisitorHours,
      status: status as any,
      remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHostels([...hostels, newHostel]);
    triggerNotification('Hostel Master saved successfully.');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="New Hostel Registration"
        description="Manage university hostels"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'New Registration' },
        ]}
      >
        <FormCard title="Registered Hostels" icon="apartment">
          <Button
            label="New Registration"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">S.No</th>
                  <th className="p-2">Hostel Code</th>
                  <th className="p-2">Hostel Name</th>
                  <th className="p-2">Campus</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Capacity</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {hostels.map((h, i) => (
                  <tr
                    key={h.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{h.hostelCode}</td>
                    <td className="p-2">{h.hostelName}</td>
                    <td className="p-2">{h.campusName}</td>
                    <td className="p-2">{h.hostelType}</td>
                    <td className="p-2">{h.totalCapacity}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${h.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const campusOptions =
    GEO_TREE[0].children?.map(c => ({ id: c.id, text: c.name })) || [];

  return (
    <FormPage
      title="New Hostel Registration"
      description="Create or edit a hostel"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'New Registration' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Basic Details" icon="info">
        <FormGrid columns={3}>
          <TextBox
            label="Hostel Name (English) *"
            value={hostelName}
            onChange={setHostelName}
          />
          <TextBox
            label="Hostel Name (Hindi)"
            value={hostelNameHindi}
            onChange={setHostelNameHindi}
          />
          <TextBox
            label="Hostel Code *"
            value={hostelCode}
            onChange={setHostelCode}
          />
          <OptionDropDown
            label="Campus *"
            data={campusOptions}
            value={campusId}
            onChange={(v: any) => setCampusId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Hostel Type"
            data={[
              { id: 'BOYS', text: 'Boys' },
              { id: 'GIRLS', text: 'Girls' },
            ]}
            value={hostelType}
            onChange={(v: any) => {
              setHostelType(v);
              setIsGirlsHostel(v === 'GIRLS');
            }}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Hostel Category"
            data={[
              { id: 'UG', text: 'UG' },
              { id: 'PG', text: 'PG' },
              { id: 'RESEARCH', text: 'Research' },
              { id: 'STAFF', text: 'Staff' },
            ]}
            value={hostelCategory}
            onChange={(v: any) => setHostelCategory(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Establishment Year"
            type="number"
            value={establishmentYear}
            onChange={setEstablishmentYear}
          />
          <TextBox
            label="Total Rooms"
            type="number"
            value={totalRooms}
            onChange={setTotalRooms}
          />
          <TextBox
            label="Total Capacity"
            type="number"
            value={totalCapacity}
            onChange={setTotalCapacity}
          />
          <div className="col-span-3">
            <TextBox label="Address" value={address} onChange={setAddress} />
          </div>
        </FormGrid>
      </FormCard>

      {isGirlsHostel && (
        <FormCard title="Security (Girls Hostel)" icon="shield">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={twentyFourSevenSecurity}
                onChange={e => setTwentyFourSevenSecurity(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300"
              />
              <span className="text-sm font-medium">
                24/7 Security Available?
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={restrictedVisitorHours}
                onChange={e => setRestrictedVisitorHours(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300"
              />
              <span className="text-sm font-medium">
                Restricted Visitor Hours?
              </span>
            </label>
          </div>
        </FormCard>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormCard title="Police Station" icon="local_police">
          <FormGrid columns={1}>
            <TextBox label="Station Name" value={psName} onChange={setPsName} />
            <TextBox
              label="Address"
              value={psAddress}
              onChange={setPsAddress}
            />
            <TextBox
              label="Contact Number"
              value={psContact}
              onChange={setPsContact}
            />
          </FormGrid>
        </FormCard>
        <FormCard title="Nearest Hospital" icon="local_hospital">
          <FormGrid columns={1}>
            <TextBox
              label="Hospital Name"
              value={hospName}
              onChange={setHospName}
            />
            <TextBox
              label="Address"
              value={hospAddress}
              onChange={setHospAddress}
            />
            <TextBox
              label="Contact Number"
              value={hospContact}
              onChange={setHospContact}
            />
          </FormGrid>
        </FormCard>
      </div>

      <FormCard title="Warden Information" icon="badge">
        <FormGrid columns={4}>
          <TextBox label="Name" value={wardenName} onChange={setWardenName} />
          <TextBox
            label="Mobile"
            value={wardenMobile}
            onChange={setWardenMobile}
          />
          <TextBox
            label="Designation"
            value={wardenDesignation}
            onChange={setWardenDesignation}
          />
          <TextBox
            label="Email"
            type="email"
            value={wardenEmail}
            onChange={setWardenEmail}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Status & Remarks" icon="settings">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Status"
            data={[
              { id: 'ACTIVE', text: 'Active' },
              { id: 'INACTIVE', text: 'Inactive' },
              { id: 'UNDER_MAINTENANCE', text: 'Under Maintenance' },
            ]}
            value={status}
            onChange={(v: any) => setStatus(v)}
            textField="text"
            valueField="id"
          />
          <TextBox label="Remarks" value={remarks} onChange={setRemarks} />
        </FormGrid>
      </FormCard>

      <div className="flex gap-3 mt-4 mb-10">
        <Button label="Save Hostel" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
