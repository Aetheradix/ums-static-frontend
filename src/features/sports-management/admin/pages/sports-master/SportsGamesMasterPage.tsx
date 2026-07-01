import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

export default function SportsGamesMasterPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    minTeamSize: '',
    maxTeamSize: '',
    coach: '',
    active: true,
  });

  const categoryOptions = [
    { id: 'Indoor', name: 'Indoor' },
    { id: 'Outdoor', name: 'Outdoor' },
    { id: 'Team Sport', name: 'Team Sport' },
    { id: 'Individual Sport', name: 'Individual Sport' },
  ];

  const mockData = [
    {
      id: 1,
      name: 'Cricket',
      category: 'Team Sport',
      minTeamSize: 11,
      maxTeamSize: 15,
      coach: 'Ravi Shastri',
      active: true,
    },
    {
      id: 2,
      name: 'Badminton',
      category: 'Indoor',
      minTeamSize: null,
      maxTeamSize: null,
      coach: 'Pullela Gopichand',
      active: true,
    },
    {
      id: 3,
      name: 'Athletics',
      category: 'Outdoor',
      minTeamSize: null,
      maxTeamSize: null,
      coach: 'PT Usha',
      active: false,
    },
  ];

  const handleSave = () => {
    ToastService.success('Sport saved successfully!');
    setFormData({
      name: '',
      category: '',
      minTeamSize: '',
      maxTeamSize: '',
      coach: '',
      active: true,
    });
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Sports / Games Master"
      description="Configure and manage the sports and games offered by the university."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Master Configuration' },
        { label: 'Sports / Games' },
      ]}
    >
      <FormCard
        title="Sports List"
        headerAction={
          <Button
            label="Add New Sport"
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
            { field: 'name', header: 'Sport Name' },
            { field: 'category', header: 'Category' },
            {
              header: 'Team Size',
              cell: (item: any) => (
                <span>
                  {item.minTeamSize
                    ? `${item.minTeamSize} - ${item.maxTeamSize}`
                    : 'N/A'}
                </span>
              ),
            },
            { field: 'coach', header: 'Coach' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={item.active ? 'approved' : 'rejected'}
                  label={item.active ? 'Active' : 'Inactive'}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title="Add New Sport"
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
              label="Save Sport"
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
            label="Sport Name"
            placeholder="e.g. Cricket, Badminton"
            required
            value={formData.name}
            onChange={(val: any) => setFormData({ ...formData, name: val })}
          />
          <DropDownList
            label="Category"
            data={categoryOptions}
            textField="name"
            valueField="id"
            placeholder="Select a Category"
            required
            value={formData.category}
            onChange={(val: any) => setFormData({ ...formData, category: val })}
          />
          {formData.category === 'Team Sport' && (
            <>
              <TextBox
                label="Min Team Size"
                type="number"
                placeholder="e.g. 11"
                required
                value={formData.minTeamSize}
                onChange={(val: any) =>
                  setFormData({ ...formData, minTeamSize: val })
                }
              />
              <TextBox
                label="Max Team Size"
                type="number"
                placeholder="e.g. 15"
                required
                value={formData.maxTeamSize}
                onChange={(val: any) =>
                  setFormData({ ...formData, maxTeamSize: val })
                }
              />
            </>
          )}
          <TextBox
            label="Coach Assigned"
            placeholder="Name of coach/instructor"
            value={formData.coach}
            onChange={(val: any) => setFormData({ ...formData, coach: val })}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Active Status
            </label>
            <Switch
              checked={formData.active}
              onChange={(val: any) => setFormData({ ...formData, active: val })}
            />
          </div>
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
