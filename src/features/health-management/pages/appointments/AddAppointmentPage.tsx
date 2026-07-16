import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';
import { doctors, memberships, guestUsers } from '../../data';
import { ToastService } from 'services';

export default function AddAppointmentPage() {
  const navigate = useNavigate();

  // Combine members and guest users for the patient dropdown list
  const patientOptions = useMemo(() => {
    const members = memberships.map(m => ({
      label: `${m.memberName} (${m.memberType})`,
      value: m.memberName,
    }));
    const guests = guestUsers.map(g => ({
      label: `${g.name} (Guest)`,
      value: g.name,
    }));
    return [...members, ...guests];
  }, []);

  const doctorOptions = useMemo(() => {
    return doctors.map(d => ({
      label: d.name,
      value: d.name,
      speciality: d.speciality,
    }));
  }, []);

  const centerOptions = [
    { label: 'Campus Health Center', value: 'Campus Health Center' },
    { label: 'Wellness Clinic', value: 'Wellness Clinic' },
    { label: 'University Hospital', value: 'University Hospital' },
  ];

  const timeSlotOptions = [
    { label: '09:00 AM - 10:00 AM', value: '09:00 AM - 10:00 AM' },
    { label: '10:00 AM - 11:00 AM', value: '10:00 AM - 11:00 AM' },
    { label: '11:00 AM - 12:00 PM', value: '11:00 AM - 12:00 PM' },
    { label: '02:00 PM - 03:00 PM', value: '02:00 PM - 03:00 PM' },
    { label: '03:00 PM - 04:00 PM', value: '03:00 PM - 04:00 PM' },
    { label: '04:00 PM - 05:00 PM', value: '04:00 PM - 05:00 PM' },
  ];

  const [form, setForm] = useState({
    memberName: patientOptions[0]?.value ?? '',
    doctorName: doctors[0]?.name ?? '',
    speciality: doctors[0]?.speciality ?? '',
    date: '',
    timeSlot: timeSlotOptions[0].value,
    healthCenter: centerOptions[0].value,
    reason: '',
  });

  const handleChange = (field: string) => (e: any) => {
    const val = e?.value ?? e?.target?.value ?? e ?? '';
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      // Auto-update speciality when doctor changes
      if (field === 'doctorName') {
        const doc = doctors.find(d => d.name === val);
        if (doc) {
          updated.speciality = doc.speciality;
        }
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!form.memberName || !form.doctorName || !form.date || !form.timeSlot) {
      ToastService.error('Please fill in all required fields.');
      return;
    }
    ToastService.success('Appointment booked successfully.');
    navigate(hmsUrls.appointments);
  };

  return (
    <FormPage
      title="Book Appointment"
      description="Schedule a new appointment with a university doctor."
      breadcrumbs={getHmsBreadcrumbs('Appointments', 'Book Appointment')}
    >
      <FormCard title="Appointment Details">
        <FormGrid>
          <DropDownList
            label="Patient *"
            data={patientOptions}
            textField="label"
            optionValue="value"
            value={form.memberName}
            onChange={handleChange('memberName')}
          />
          <DropDownList
            label="Doctor *"
            data={doctorOptions}
            textField="label"
            optionValue="value"
            value={form.doctorName}
            onChange={handleChange('doctorName')}
          />
          <TextBox
            label="Speciality"
            value={form.speciality}
            readOnly
            disabled
          />
          <TextBox
            label="Date *"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
          />
          <DropDownList
            label="Time Slot *"
            data={timeSlotOptions}
            textField="label"
            optionValue="value"
            value={form.timeSlot}
            onChange={handleChange('timeSlot')}
          />
          <DropDownList
            label="Health Center"
            data={centerOptions}
            textField="label"
            optionValue="value"
            value={form.healthCenter}
            onChange={handleChange('healthCenter')}
          />
          <TextArea
            label="Reason for Visit"
            placeholder="Describe any symptoms or reason for consulting the doctor."
            rows={2}
            value={form.reason}
            onChange={handleChange('reason')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(hmsUrls.appointments)}
          />
          <Button label="Book Appointment" icon="plus" onClick={handleSave} />
        </div>
      </FormCard>
    </FormPage>
  );
}
