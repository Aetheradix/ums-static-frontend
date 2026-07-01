import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  Declaration,
  DropDownList,
  PickList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';

export default function SportsRegistrationPage() {
  const [formData, setFormData] = useState({
    skillLevel: '',
    experience: '',
    position: '',
    medicalFitness: false,
  });

  const [availableSports, setAvailableSports] = useState([
    { id: '1', name: 'Cricket' },
    { id: '2', name: 'Football' },
    { id: '3', name: 'Badminton' },
    { id: '4', name: 'Athletics' },
    { id: '5', name: 'Basketball' },
  ]);

  const [selectedSports, setSelectedSports] = useState<any[]>([]);

  const skillOptions = [
    { id: 'Beginner', name: 'Beginner' },
    { id: 'Intermediate', name: 'Intermediate' },
    { id: 'Advanced', name: 'Advanced' },
    { id: 'State/National', name: 'Represented State or National Level' },
  ];

  const handleSubmit = () => {
    ToastService.success('Sports registration submitted successfully!');
    setFormData({
      skillLevel: '',
      experience: '',
      position: '',
      medicalFitness: false,
    });
    setSelectedSports([]);
  };

  return (
    <FormPage
      title="Sports Registration"
      description="Register your interest in university sports to join teams and trials."
      breadcrumbs={[
        { label: 'Sports Management', to: '/sports-management' },
        { label: 'Student Profile' },
        { label: 'Registration' },
      ]}
    >
      <FormCard title="Select Sports">
        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Select all the sports you are interested in participating in.
        </div>
        <PickList
          source={availableSports}
          target={selectedSports}
          onChange={(e: any) => {
            setAvailableSports(e.source);
            setSelectedSports(e.target);
          }}
          itemTemplate={(item: any) => <div>{item.name}</div>}
          sourceHeader="Available Sports"
          targetHeader="Selected Sports"
        />
      </FormCard>

      <FormCard title="Skill & Experience Profile" className="mt-6">
        <FormGrid>
          <DropDownList
            label="Skill Level"
            data={skillOptions}
            textField="name"
            valueField="id"
            placeholder="Select your skill level"
            required
            value={formData.skillLevel}
            onChange={(val: any) =>
              setFormData({ ...formData, skillLevel: val })
            }
          />
          <TextBox
            label="Position / Specialization"
            placeholder="e.g. Opening Batsman, Goalkeeper"
            value={formData.position}
            onChange={(val: any) => setFormData({ ...formData, position: val })}
          />
        </FormGrid>

        <div className="mt-4">
          <TextArea
            label="Prior Experience"
            rows={3}
            placeholder="Describe any school team, district level, or club experience..."
            value={formData.experience}
            onChange={(val: any) =>
              setFormData({ ...formData, experience: val })
            }
          />
        </div>

        <div className="mt-6">
          <Declaration
            id="medicalFitness"
            checked={formData.medicalFitness}
            onChange={checked =>
              setFormData({ ...formData, medicalFitness: checked })
            }
            text="I hereby declare that I am physically and medically fit to participate in the selected sports activities. I understand that the university is not responsible for any pre-existing medical conditions."
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            label="Submit Registration"
            variant="primary"
            icon="how_to_reg"
            disabled={!formData.medicalFitness || selectedSports.length === 0}
            onClick={handleSubmit}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
