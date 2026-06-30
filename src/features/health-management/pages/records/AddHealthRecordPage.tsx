import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { memberships, doctors, hospitals, referralTemplates } from '../../data';
import { hmsUrls } from '../../urls';

const bloodGroupOptions = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
];

const yesNoOptions = [
  { label: 'No', value: 'No' },
  { label: 'Yes', value: 'Yes' },
];

export default function AddHealthRecordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    memberName: '',
    healthCenter: '',
    isDependent: 'No',
    dateOfVisit: '',
    timeOfVisit: '',
    height: '',
    weight: '',
    bloodGroup: 'O+',
    pastMedicalHistory: '',
    regularMedicine: '',
    drugAllergy: '',
    chiefComplaint: '',
    examinationFindings: '',
    prescription: '',
    clinicalNoting: '',
    referredToHospital: 'No',
    approvedHospital: '',
    referralTemplate: '',
    createdBy: '',
  });

  const memberOptions = memberships.map(m => ({
    label: `${m.memberName} (${m.memberType})`,
    value: m.memberName,
  }));
  const doctorOptions = doctors.map(d => ({
    label: d.universityDoctorName || d.name,
    value: d.universityDoctorName || d.name,
  }));
  const hospitalOptions = hospitals.map(h => ({
    label: h.name,
    value: h.name,
  }));
  const referralOptions = referralTemplates.map(rt => ({
    label: rt.name,
    value: rt.name,
  }));

  const handleChange = (field: string) => (e: any) => {
    setForm(prev => ({
      ...prev,
      [field]: e?.value ?? e?.target?.value ?? e ?? '',
    }));
  };

  return (
    <FormPage
      title="Add Health Record"
      description="Create a new patient health record with examination details and prescription."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Health Records', to: hmsUrls.records },
        { label: 'Add Record' },
      ]}
    >
      <FormCard title="Patient Information">
        <FormGrid>
          <DropDownList
            label="Patient"
            data={memberOptions}
            textField="label"
            optionValue="value"
            value={form.memberName}
            onChange={handleChange('memberName')}
          />
          <DropDownList
            label="Dependent?"
            data={yesNoOptions}
            textField="label"
            optionValue="value"
            value={form.isDependent}
            onChange={handleChange('isDependent')}
          />
          <TextBox
            label="Health Center"
            placeholder="e.g. Campus Health Center"
            value={form.healthCenter}
            onChange={handleChange('healthCenter')}
          />
          <TextBox
            label="Visit Date"
            type="date"
            value={form.dateOfVisit}
            onChange={handleChange('dateOfVisit')}
          />
          <TextBox
            label="Visit Time"
            type="time"
            value={form.timeOfVisit}
            onChange={handleChange('timeOfVisit')}
          />
          <TextBox
            label="Height (cm)"
            placeholder="e.g. 172"
            value={form.height}
            onChange={handleChange('height')}
          />
          <TextBox
            label="Weight (kg)"
            placeholder="e.g. 75"
            value={form.weight}
            onChange={handleChange('weight')}
          />
          <DropDownList
            label="Blood Group"
            data={bloodGroupOptions}
            textField="label"
            optionValue="value"
            value={form.bloodGroup}
            onChange={handleChange('bloodGroup')}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Medical History">
        <FormGrid>
          <TextArea
            label="Past Medical History"
            rows={2}
            value={form.pastMedicalHistory}
            onChange={handleChange('pastMedicalHistory')}
          />
          <TextArea
            label="Regular Medicine"
            rows={2}
            value={form.regularMedicine}
            onChange={handleChange('regularMedicine')}
          />
          <TextArea
            label="Drug Allergy"
            rows={2}
            value={form.drugAllergy}
            onChange={handleChange('drugAllergy')}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Consultation Details">
        <FormGrid>
          <TextArea
            label="Chief Complaint"
            rows={2}
            value={form.chiefComplaint}
            onChange={handleChange('chiefComplaint')}
          />
          <TextArea
            label="Examination Findings"
            rows={2}
            value={form.examinationFindings}
            onChange={handleChange('examinationFindings')}
          />
          <TextArea
            label="Prescription"
            rows={2}
            value={form.prescription}
            onChange={handleChange('prescription')}
          />
          <TextArea
            label="Clinical Noting"
            rows={2}
            value={form.clinicalNoting}
            onChange={handleChange('clinicalNoting')}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Referral">
        <FormGrid>
          <DropDownList
            label="Refer to Hospital?"
            data={yesNoOptions}
            textField="label"
            optionValue="value"
            value={form.referredToHospital}
            onChange={handleChange('referredToHospital')}
          />
          {form.referredToHospital === 'Yes' && (
            <>
              <DropDownList
                label="Approved Hospital"
                data={hospitalOptions}
                textField="label"
                optionValue="value"
                value={form.approvedHospital}
                onChange={handleChange('approvedHospital')}
              />
              <DropDownList
                label="Referral Template"
                data={referralOptions}
                textField="label"
                optionValue="value"
                value={form.referralTemplate}
                onChange={handleChange('referralTemplate')}
              />
            </>
          )}
          <DropDownList
            label="Doctor"
            data={doctorOptions}
            textField="label"
            optionValue="value"
            value={form.createdBy}
            onChange={handleChange('createdBy')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(hmsUrls.records)}
          />
          <Button
            label="Save Record"
            icon="save"
            onClick={() => navigate(hmsUrls.records)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
