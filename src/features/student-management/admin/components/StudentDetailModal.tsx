import { useState, useEffect } from 'react';
import { Modal } from 'shared/components/popups';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import type { SeedStudent } from '../../seed/students';
import { StudentSeedService } from '../../seed/students';
import { ToastService } from 'services';

interface Props {
  studentId?: string; // If undefined, modal is in Add mode
  onHide: () => void;
  onSave: () => void;
}

export default function StudentDetailModal({
  studentId,
  onHide,
  onSave,
}: Props) {
  const isEdit = !!studentId;
  const [student, setStudent] = useState<Partial<SeedStudent>>({
    firstName: '',
    lastName: '',
    enrolmentNo: '',
    rollNo: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    programmeName: '',
    academicSession: '2024-25',
    status: 'Active',
    abcLinked: false,
    programmeId: 1, // default
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const loadStudent = async () => {
        setLoading(true);
        const data = await StudentSeedService.getById(studentId!);
        if (data) {
          setStudent(data);
        }
        setLoading(false);
      };
      loadStudent();
    }
  }, [studentId, isEdit]);

  const handleChange = (field: keyof SeedStudent, value: any) => {
    setStudent({ ...student, [field]: value });
  };

  const handleSave = async () => {
    // Basic validation
    if (!student.firstName || !student.enrolmentNo || !student.email) {
      ToastService.error(
        'First Name, Enrolment Number, and Email are required.'
      );
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await StudentSeedService.update(studentId!, student);
        ToastService.success('Student updated successfully');
      } else {
        await StudentSeedService.add(student as Omit<SeedStudent, 'id'>);
        ToastService.success('Student added successfully');
      }
      onSave();
    } catch (err) {
      ToastService.error(
        isEdit ? 'Failed to update student' : 'Failed to add student'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Modal header="Edit Student" visible onHide={onHide}>
        <div className="p-4 text-center">Loading...</div>
      </Modal>
    );
  }

  return (
    <Modal
      header={isEdit ? 'Edit Student' : 'Add Student'}
      visible
      onHide={onHide}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="First Name *"
            value={student.firstName || ''}
            onChange={(v: any) => handleChange('firstName', v)}
          />
          <TextBox
            label="Last Name"
            value={student.lastName || ''}
            onChange={(v: any) => handleChange('lastName', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="Enrolment Number *"
            value={student.enrolmentNo || ''}
            onChange={(v: any) => handleChange('enrolmentNo', v)}
          />
          <TextBox
            label="Roll Number"
            value={student.rollNo || ''}
            onChange={(v: any) => handleChange('rollNo', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextBox
            label="Email *"
            value={student.email || ''}
            onChange={(v: any) => handleChange('email', v)}
          />
          <TextBox
            label="Phone"
            value={student.phone || ''}
            onChange={(v: any) => handleChange('phone', v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DropDownList
            label="Gender"
            value={student.gender || 'Male'}
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
            value={student.status || 'Active'}
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
            value={student.programmeName || ''}
            onChange={(v: any) => handleChange('programmeName', v)}
          />
          <TextBox
            label="Academic Session"
            value={student.academicSession || ''}
            onChange={(v: any) => handleChange('academicSession', v)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={onHide} />
          <Button
            label={isEdit ? 'Save Changes' : 'Add Student'}
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
          />
        </div>
      </div>
    </Modal>
  );
}
