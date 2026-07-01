import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FileUpload,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';

export default function AchievementsCertificatesPage() {
  const [formData, setFormData] = useState({
    awardType: '',
    recipientType: '',
    recipientId: '',
    event: '',
    rank: '',
    date: undefined,
  });

  const awardOptions = [
    { id: 'Gold Medal', name: 'Gold Medal (+50 pts)' },
    { id: 'Silver Medal', name: 'Silver Medal (+30 pts)' },
    { id: 'Bronze Medal', name: 'Bronze Medal (+20 pts)' },
    {
      id: 'Certificate of Participation',
      name: 'Certificate of Participation (+10 pts)',
    },
  ];

  const recipientTypeOptions = [
    { id: 'Student', name: 'Individual Student' },
    { id: 'Team', name: 'Team' },
  ];

  const rankOptions = [
    { id: '1st Place', name: '1st Place' },
    { id: '2nd Place', name: '2nd Place' },
    { id: '3rd Place', name: '3rd Place' },
    { id: 'Participant', name: 'Participant' },
  ];

  const mockData = [
    {
      id: 1,
      recipient: 'John Doe',
      event: 'Annual Sports Meet 2025',
      awardType: 'Gold Medal',
      rank: '1st Place',
      date: '2025-11-20',
      points: 50,
    },
    {
      id: 2,
      recipient: 'University Cricket Team',
      event: 'Inter-University Cup 2026',
      awardType: 'Silver Medal',
      rank: '2nd Place',
      date: '2026-10-20',
      points: 30,
    },
  ];

  const handleRecord = () => {
    ToastService.success('Achievement recorded successfully!');
    setFormData({
      awardType: '',
      recipientType: '',
      recipientId: '',
      event: '',
      rank: '',
      date: undefined,
    });
  };

  return (
    <FormPage
      title="Achievements & Certificates"
      description="Record official sports achievements, generate certificates, and allocate sports quota points."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Achievements' },
        { label: 'Record Achievement' },
      ]}
    >
      <FormCard title="Record New Achievement">
        <FormGrid>
          <DropDownList
            label="Achievement / Award Type"
            data={awardOptions}
            textField="name"
            valueField="id"
            placeholder="Select Award Type"
            required
            value={formData.awardType}
            onChange={(val: any) =>
              setFormData({ ...formData, awardType: val })
            }
          />
          <DropDownList
            label="Recipient Type"
            data={recipientTypeOptions}
            textField="name"
            valueField="id"
            placeholder="Select Recipient Type"
            required
            value={formData.recipientType}
            onChange={(val: any) =>
              setFormData({ ...formData, recipientType: val })
            }
          />
          <TextBox
            label={
              formData.recipientType === 'Team'
                ? 'Team Name'
                : 'Student Roll No'
            }
            placeholder="Search recipient..."
            required
            value={formData.recipientId}
            onChange={(val: any) =>
              setFormData({ ...formData, recipientId: val })
            }
          />
          <TextBox
            label="Event / Tournament"
            placeholder="e.g. Annual Sports Meet 2026"
            required
            value={formData.event}
            onChange={(val: any) => setFormData({ ...formData, event: val })}
          />
          <DropDownList
            label="Rank / Position"
            data={rankOptions}
            textField="name"
            valueField="id"
            placeholder="Select Rank"
            value={formData.rank}
            onChange={(val: any) => setFormData({ ...formData, rank: val })}
          />
          <DatePicker
            label="Date Awarded"
            required
            value={formData.date}
            onChange={(val: any) => setFormData({ ...formData, date: val })}
          />
          <FileUpload
            label="Upload Certificate / Proof"
            mode="file"
            accept="image/*,.pdf,.doc,.docx"
            uploadNote="Upload award certificate or supporting document (PDF, image)"
          />
        </FormGrid>
        <div className="flex justify-end mt-6">
          <Button
            label="Record Achievement"
            variant="primary"
            icon="workspace_premium"
            onClick={handleRecord}
          />
        </div>
      </FormCard>

      <FormCard title="Achievement Registry" className="mt-6">
        <GridPanel
          data={mockData}
          columns={[
            { field: 'recipient', header: 'Recipient' },
            { field: 'event', header: 'Event' },
            { field: 'awardType', header: 'Award' },
            { field: 'rank', header: 'Rank/Pos' },
            { field: 'date', header: 'Date' },
            {
              header: 'Quota Points',
              cell: (item: any) => (
                <span className="font-semibold text-green-600">
                  +{item.points} Pts
                </span>
              ),
            },
            {
              header: 'Certificate',
              cell: () => (
                <Button
                  label="Generate/Download"
                  variant="outlined"
                  size="small"
                  icon="workspace_premium"
                  onClick={() =>
                    ToastService.success('Certificate downloaded successfully!')
                  }
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
