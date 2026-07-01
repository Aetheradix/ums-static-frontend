import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { doctors, medicalStocks, prescriptionCodes } from '../../data';
import { hmsUrls } from '../../urls';

export default function AddPrescriptionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: '',
    prescribedBy: '',
    remarks: '',
    medicineId: '',
    dose: '1',
    frequency: '',
    duration: '',
  });

  const doctorOptions = doctors.map(d => ({
    label: d.universityDoctorName || d.name,
    value: d.universityDoctorName || d.name,
  }));
  const medicineOptions = medicalStocks.map(s => ({
    label: `${s.saltName} (${s.brandName})`,
    value: s.id,
  }));
  const freqOptions = prescriptionCodes.map(pc => ({
    label: `${pc.code} - ${pc.description}`,
    value: pc.code,
  }));

  const handleChange = (field: string) => (e: any) => {
    setForm(prev => ({
      ...prev,
      [field]: e?.value ?? e?.target?.value ?? e ?? '',
    }));
  };

  return (
    <FormPage
      title="New Prescription"
      description="Create a new medicine prescription for a patient."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Prescriptions', to: hmsUrls.prescriptions },
        { label: 'New Prescription' },
      ]}
    >
      <FormCard title="Prescription Details">
        <FormGrid>
          <TextBox
            label="Patient Name"
            placeholder="Full name"
            value={form.patientName}
            onChange={handleChange('patientName')}
          />
          <DropDownList
            label="Doctor"
            data={doctorOptions}
            textField="label"
            optionValue="value"
            value={form.prescribedBy}
            onChange={handleChange('prescribedBy')}
          />
          <DropDownList
            label="Medicine"
            data={medicineOptions}
            textField="label"
            optionValue="value"
            value={form.medicineId}
            onChange={handleChange('medicineId')}
          />
          <TextBox
            label="Dose"
            placeholder="e.g. 1, 2"
            value={form.dose}
            onChange={handleChange('dose')}
          />
          <DropDownList
            label="Frequency"
            data={freqOptions}
            textField="label"
            optionValue="value"
            value={form.frequency}
            onChange={handleChange('frequency')}
          />
          <TextBox
            label="Duration"
            placeholder="e.g. 5 days"
            value={form.duration}
            onChange={handleChange('duration')}
          />
          <TextArea
            label="Remarks"
            rows={2}
            value={form.remarks}
            onChange={handleChange('remarks')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(hmsUrls.prescriptions)}
          />
          <Button
            label="Save Prescription"
            icon="save"
            onClick={() => navigate(hmsUrls.prescriptions)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
