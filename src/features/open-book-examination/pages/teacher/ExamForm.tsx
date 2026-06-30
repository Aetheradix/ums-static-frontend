import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  NumberBox,
  Switch,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { InfoBanner } from '../../components';
import {
  mockCourses,
  mockExamTypes,
  mockExams,
  mockPolicies,
} from '../../data';

export default function ExamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? mockExams.find(e => e.id === Number(id)) : null;

  const [form, setForm] = useState({
    title: existing?.title || '',
    courseId: existing?.courseId || mockCourses[0]?.id || 1,
    examTypeId: existing?.examTypeId || 1,
    isOpenBook: existing?.isOpenBook || false,
    policyId: existing?.policyId || 1,
    durationMinutes: existing?.durationMinutes || 120,
    totalMarks: existing?.totalMarks || 50,
    passMarks: existing?.passMarks || 20,
    attemptLimit: existing?.attemptLimit || 1,
    scheduledDate: existing?.scheduledDate || '',
    startTime: existing?.startTime || '09:00',
    endTime: existing?.endTime || '12:00',
    description: existing?.description || '',
    instructions: existing?.instructions || '',
    status: existing?.status || 'draft',
  });

  const handleSave = () => {
    if (isEdit && existing) {
      Object.assign(existing, form, { updatedAt: new Date().toISOString() });
    } else {
      mockExams.push({
        id: Math.max(...mockExams.map(e => e.id)) + 1,
        ...form,
        courseName:
          mockCourses.find(c => c.id === form.courseId)?.subjectName || '',
        subjectName:
          mockCourses.find(c => c.id === form.courseId)?.subjectName || '',
        examTypeName:
          mockExamTypes.find(t => t.id === form.examTypeId)?.name || '',
        sessionId: 2,
        sessionName: '2025-26',
        policyName: form.isOpenBook
          ? mockPolicies.find(p => p.id === form.policyId)?.name
          : undefined,
        createdBy: 2,
        createdByName: 'Dr. Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gracePeriodMinutes: 5,
      });
    }
    navigate('/open-book-examination/teacher/exams');
  };

  return (
    <FormPage
      title={isEdit ? 'Edit Exam' : 'Create Exam'}
      description="Configure examination details"
    >
      <InfoBanner
        title="About Exam Creation"
        message="Create and configure new examinations. Set up the schedule, instructions, passing criteria, and select the appropriate open book policies."
      />
      <FormCard>
        <FormGrid>
          <TextBox
            label="Exam Title"
            value={form.title}
            onChange={v => setForm({ ...form, title: v })}
            required
          />
          <DropDownList
            label="Course"
            value={String(form.courseId)}
            onChange={v => setForm({ ...form, courseId: Number(v) })}
            data={mockCourses.map(c => ({
              value: String(c.id),
              label: `${c.subjectName} (${c.programName})`,
            }))}
            textField="label"
            valueField="value"
          />
          <DropDownList
            label="Exam Type"
            value={String(form.examTypeId)}
            onChange={v => setForm({ ...form, examTypeId: Number(v) })}
            data={mockExamTypes.map(t => ({
              value: String(t.id),
              label: t.name,
            }))}
            textField="label"
            valueField="value"
          />
          <Switch
            label="Open Book Exam"
            checked={form.isOpenBook}
            onChange={v => setForm({ ...form, isOpenBook: v })}
          />
          {form.isOpenBook && (
            <DropDownList
              label="Open Book Policy"
              value={String(form.policyId)}
              onChange={v => setForm({ ...form, policyId: Number(v) })}
              data={mockPolicies.map(p => ({
                value: String(p.id),
                label: p.name,
              }))}
              textField="label"
              valueField="value"
            />
          )}
          <NumberBox
            label="Duration (minutes)"
            value={form.durationMinutes}
            onChange={v => setForm({ ...form, durationMinutes: v ?? 0 })}
            min={15}
            max={240}
          />
          <NumberBox
            label="Total Marks"
            value={form.totalMarks}
            onChange={v => setForm({ ...form, totalMarks: v ?? 0 })}
            min={10}
            max={500}
          />
          <NumberBox
            label="Pass Marks"
            value={form.passMarks}
            onChange={v => setForm({ ...form, passMarks: v ?? 0 })}
            min={1}
          />
          <NumberBox
            label="Attempt Limit"
            value={form.attemptLimit}
            onChange={v => setForm({ ...form, attemptLimit: v ?? 0 })}
            min={1}
            max={5}
          />
          <TextBox
            label="Scheduled Date"
            value={form.scheduledDate}
            onChange={v => setForm({ ...form, scheduledDate: v })}
            placeholder="YYYY-MM-DD"
          />
          <TextBox
            label="Start Time"
            value={form.startTime}
            onChange={v => setForm({ ...form, startTime: v })}
            placeholder="HH:mm"
          />
          <TextBox
            label="End Time"
            value={form.endTime}
            onChange={v => setForm({ ...form, endTime: v })}
            placeholder="HH:mm"
          />
        </FormGrid>
        <TextArea
          label="Description"
          value={form.description}
          onChange={v => setForm({ ...form, description: v })}
          className="mt-3"
        />
        <TextArea
          label="Instructions for Students"
          value={form.instructions}
          onChange={v => setForm({ ...form, instructions: v })}
          className="mt-3"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate('/open-book-examination/teacher/exams')}
          />
          <Button
            label={isEdit ? 'Update Exam' : 'Create Exam'}
            icon="save"
            onClick={handleSave}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
