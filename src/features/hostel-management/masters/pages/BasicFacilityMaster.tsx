import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function BasicFacilityMaster() {
  const { basicFacilities, setBasicFacilities, triggerNotification } =
    useHostel();
  const [showList, setShowList] = useState(false);

  const [facilityName, setFacilityName] = useState('');
  const [facilityIcon, setFacilityIcon] = useState('wifi');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const reset = () => {
    setFacilityName('');
    setFacilityIcon('wifi');
    setDescription('');
    setStatus('ACTIVE');
  };

  const handleSave = () => {
    if (!facilityName) {
      triggerNotification('Please enter facility name', 'error');
      return;
    }
    const newFacility: HostelManagement.BasicFacility = {
      id: `BF-${Date.now()}`,
      facilityName,
      facilityIcon,
      description,
      status: status as any,
    };
    setBasicFacilities([...basicFacilities, newFacility]);
    triggerNotification('Basic Facility saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Basic Facility Master"
        description="Manage common facilities available in hostels"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Basic Facilities' },
        ]}
      >
        <FormCard title="Basic Facilities" icon="fitness_center">
          <Button
            label="Add Facility"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Facility Name</th>
                  <th className="p-2">Icon</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {basicFacilities.map(f => (
                  <tr
                    key={f.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{f.facilityName}</td>
                    <td className="p-2">
                      <span className="material-icons text-lg">
                        {f.facilityIcon}
                      </span>
                    </td>
                    <td className="p-2">{f.description}</td>
                    <td className="p-2">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Basic Facility Master"
      description="Create a new basic facility"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Basic Facilities' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Facility Details" icon="fitness_center">
        <FormGrid columns={2}>
          <TextBox
            label="Facility Name *"
            value={facilityName}
            onChange={setFacilityName}
            placeholder="e.g. Wi-Fi, Gym"
          />
          <OptionDropDown
            label="Icon (Material Design)"
            data={[
              { id: 'wifi', text: 'Wi-Fi' },
              { id: 'fitness_center', text: 'Gym' },
              { id: 'local_laundry_service', text: 'Laundry' },
              { id: 'medical_services', text: 'Medical' },
              { id: 'restaurant', text: 'Mess' },
              { id: 'sports_esports', text: 'Recreation' },
            ]}
            value={facilityIcon}
            onChange={(v: any) => setFacilityIcon(v)}
            textField="text"
            valueField="id"
          />

          <OptionDropDown
            label="Status"
            data={[
              { id: 'ACTIVE', text: 'Active' },
              { id: 'INACTIVE', text: 'Inactive' },
            ]}
            value={status}
            onChange={(v: any) => setStatus(v)}
            textField="text"
            valueField="id"
          />

          <div className="col-span-2">
            <TextBox
              label="Description"
              value={description}
              onChange={setDescription}
            />
          </div>
        </FormGrid>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button label="Save Facility" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
