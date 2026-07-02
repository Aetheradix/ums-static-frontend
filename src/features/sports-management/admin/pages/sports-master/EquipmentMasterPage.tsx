import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function EquipmentMasterPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    totalQty: '',
    condition: '',
  });

  const sportsOptions = [
    { id: 'Cricket', name: 'Cricket' },
    { id: 'Badminton', name: 'Badminton' },
    { id: 'Football', name: 'Football' },
  ];

  const conditionOptions = [
    { id: 'New', name: 'New' },
    { id: 'Good', name: 'Good' },
    { id: 'Worn', name: 'Worn' },
    { id: 'Damaged', name: 'Damaged' },
  ];

  const mockData = [
    {
      id: 1,
      name: 'Cricket Bat (English Willow)',
      sport: 'Cricket',
      totalQty: 10,
      availableQty: 8,
      condition: 'Good',
    },
    {
      id: 2,
      name: 'Football (Size 5)',
      sport: 'Football',
      totalQty: 25,
      availableQty: 20,
      condition: 'New',
    },
    {
      id: 3,
      name: 'Badminton Racket (Pro)',
      sport: 'Badminton',
      totalQty: 15,
      availableQty: 2,
      condition: 'Worn',
    },
  ];

  const handleSave = () => {
    ToastService.success('Equipment saved successfully!');
    setFormData({
      name: '',
      sport: '',
      totalQty: '',
      condition: '',
    });
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Equipment Master"
      description="Manage sports equipment inventory and availability."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Master Configuration' },
        { label: 'Equipment' },
      ]}
    >
      <FormCard
        title="Equipment List"
        headerAction={
          <Button
            label="Add New Equipment"
            icon="plus"
            type="button"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        }
      >
        <GridPanel
          data={mockData}
          columns={[
            { field: 'name', header: 'Equipment Name' },
            { field: 'sport', header: 'Related Sport' },
            { field: 'totalQty', header: 'Total Qty' },
            {
              header: 'Available Qty',
              cell: (item: any) => (
                <span
                  className={
                    item.availableQty < 5
                      ? 'text-red-600 font-medium'
                      : 'text-green-600 font-medium'
                  }
                >
                  {item.availableQty}
                </span>
              ),
            },
            {
              header: 'Condition',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.condition === 'Damaged'
                      ? 'rejected'
                      : item.condition === 'Worn'
                        ? 'pending'
                        : 'approved'
                  }
                  label={item.condition}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title="Add New Equipment"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              type="button"
              variant="outlined"
              onClick={() => setShowPopup(false)}
            />
            <Button
              label="Save Equipment"
              type="button"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid>
          <TextBox
            label="Equipment Name"
            placeholder="e.g. Cricket Bat, Football"
            required
            value={formData.name}
            onChange={(val: any) => setFormData({ ...formData, name: val })}
          />
          <DropDownList
            label="Related Sport"
            data={sportsOptions}
            textField="name"
            valueField="id"
            placeholder="Select a Sport"
            required
            value={formData.sport}
            onChange={(val: any) => setFormData({ ...formData, sport: val })}
          />
          <TextBox
            label="Total Quantity"
            type="number"
            placeholder="Total owned by department"
            required
            value={formData.totalQty}
            onChange={(val: any) => setFormData({ ...formData, totalQty: val })}
          />
          <DropDownList
            label="Condition"
            data={conditionOptions}
            textField="name"
            valueField="id"
            placeholder="Select Condition"
            required
            value={formData.condition}
            onChange={(val: any) =>
              setFormData({ ...formData, condition: val })
            }
          />
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
