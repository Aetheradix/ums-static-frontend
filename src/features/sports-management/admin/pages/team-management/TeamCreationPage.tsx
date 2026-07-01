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

export default function TeamCreationPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    sport: '',
    academicYear: '',
    coach: '',
    captain: '',
  });

  const sportsOptions = [
    { id: 'Cricket', name: 'Cricket' },
    { id: 'Football', name: 'Football' },
    { id: 'Basketball', name: 'Basketball' },
  ];

  const yearOptions = [
    { id: '2025-26', name: '2025-26' },
    { id: '2026-27', name: '2026-27' },
  ];

  const mockData = [
    {
      id: 1,
      teamName: "University Cricket Team - Men's 2026",
      sport: 'Cricket',
      academicYear: '2025-26',
      coach: 'Ravi Shastri',
      captain: 'John Doe',
      status: 'Finalized',
    },
    {
      id: 2,
      teamName: "University Football Team - Men's 2026",
      sport: 'Football',
      academicYear: '2025-26',
      coach: 'Igor Stimac',
      captain: '-',
      status: 'Trials Open',
    },
  ];

  const handleSave = () => {
    ToastService.success('Team created successfully!');
    setFormData({
      teamName: '',
      sport: '',
      academicYear: '',
      coach: '',
      captain: '',
    });
    setShowPopup(false);
  };

  return (
    <FormPage
      title="Team Creation"
      description="Form official university teams from registered students."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Team Management' },
        { label: 'Team Creation' },
      ]}
    >
      <FormCard
        title="Team List"
        headerAction={
          <Button
            label="Create New Team"
            icon="group_add"
            type="button"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        }
      >
        <GridPanel
          data={mockData}
          columns={[
            { field: 'teamName', header: 'Team Name' },
            { field: 'sport', header: 'Sport' },
            { field: 'academicYear', header: 'Year/Season' },
            { field: 'coach', header: 'Coach' },
            { field: 'captain', header: 'Captain' },
            {
              header: 'Status',
              cell: (item: any) => (
                <StatusBadge
                  variant={
                    item.status === 'Finalized'
                      ? 'approved'
                      : item.status === 'Trials Open'
                        ? 'pending'
                        : 'neutral'
                  }
                  label={item.status}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        title="Create New Team"
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
              label="Create Team"
              type="button"
              icon="group_add"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        }
      >
        <FormGrid>
          <TextBox
            label="Team Name"
            placeholder="e.g. University Cricket Team - Men's 2026"
            required
            value={formData.teamName}
            onChange={(val: any) => setFormData({ ...formData, teamName: val })}
          />
          <DropDownList
            label="Sport"
            data={sportsOptions}
            textField="name"
            valueField="id"
            placeholder="Select a Sport"
            required
            value={formData.sport}
            onChange={(val: any) => setFormData({ ...formData, sport: val })}
          />
          <DropDownList
            label="Academic Year / Season"
            data={yearOptions}
            textField="name"
            valueField="id"
            placeholder="Select Academic Year"
            required
            value={formData.academicYear}
            onChange={(val: any) =>
              setFormData({ ...formData, academicYear: val })
            }
          />
          <TextBox
            label="Coach / Manager"
            placeholder="Name of coach"
            value={formData.coach}
            onChange={(val: any) => setFormData({ ...formData, coach: val })}
          />
          <TextBox
            label="Captain"
            placeholder="Selected after squad is finalized"
            value={formData.captain}
            onChange={(val: any) => setFormData({ ...formData, captain: val })}
            disabled
          />
        </FormGrid>
      </FormPopup>
    </FormPage>
  );
}
