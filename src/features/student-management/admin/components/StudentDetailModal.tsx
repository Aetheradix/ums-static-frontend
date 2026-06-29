import { useState, useEffect } from 'react';
import { Modal } from 'shared/components/popups';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import type { SeedStudent } from '../../seed/students';
import { StudentSeedService } from '../../seed/students';
import { ToastService } from 'services';

interface Props {
  studentId: string;
  onHide: () => void;
  onSave: () => void;
}

export default function StudentDetailModal({
  studentId,
  onHide,
  onSave,
}: Props) {
  const [student, setStudent] = useState<SeedStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      setLoading(true);
      const data = await StudentSeedService.getById(studentId);
      setStudent(data);
      setLoading(false);
    };
    loadStudent();
  }, [studentId]);

  const handleChange = (field: keyof SeedStudent, value: any) => {
    if (student) {
      setStudent({ ...student, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!student) return;
    setSaving(true);
    try {
      await StudentSeedService.update(studentId, student);
      ToastService.success('Student updated successfully');
      onSave();
    } catch (err) {
      ToastService.error('Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !student) {
    return (
      <Modal header="Edit Student" visible onHide={onHide}>
        <div className="p-4 text-center">Loading...</div>
      </Modal>
    );
  }

  return (
    <Modal header="Edit Student" visible onHide={onHide}>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="First Name"
            value={student.firstName}
            onChange={(v: any) => handleChange('firstName', v)}
          />
          <TextBox
            label="Last Name"
            value={student.lastName}
            onChange={(v: any) => handleChange('lastName', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="Enrolment Number"
            value={student.enrolmentNo}
            onChange={(v: any) => handleChange('enrolmentNo', v)}
          />
          <TextBox
            label="Roll Number"
            value={student.rollNo}
            onChange={(v: any) => handleChange('rollNo', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="Email"
            value={student.email}
            onChange={(v: any) => handleChange('email', v)}
          />
          <TextBox
            label="Phone"
            value={student.phone}
            onChange={(v: any) => handleChange('phone', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DropDownList
            label="Gender"
            value={student.gender}
            data={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
            textField="label"
            valueField="value"
            onChange={(v: any) => handleChange('gender', v)}
          />
          <DropDownList
            label="Status"
            value={student.status}
            data={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
              { label: 'Pending', value: 'Pending' },
            ]}
            textField="label"
            valueField="value"
            onChange={(v: any) => handleChange('status', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="Programme"
            value={student.programmeName}
            onChange={(v: any) => handleChange('programmeName', v)}
          />
          <TextBox
            label="Academic Session"
            value={student.academicSession}
            onChange={(v: any) => handleChange('academicSession', v)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={onHide} />
          <Button
            label="Save Changes"
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
          />
        </div>
      </div>
    </Modal>
  );
}
