import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { NumberBox, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  Tabs,
} from 'shared/new-components';
import type { Course, Semester, Subject } from '../../data';
import { mockCourses, mockSemesters, mockSubjects } from '../../data';
import { InfoBanner } from '../../components';

export default function Courses() {
  const [courses, setCourses] = useState(mockCourses);
  const [cPopup, setCPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [cForm, setCForm] = useState<Partial<Course>>({});

  const [semesters, setSemesters] = useState(mockSemesters);
  const [sPopup, setSPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [sForm, setSForm] = useState<Partial<Semester>>({});

  const [subjects, setSubjects] = useState(mockSubjects);
  const [subPopup, setSubPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    id?: number;
  }>({ mode: 'closed' });
  const [subForm, setSubForm] = useState<Partial<Subject>>({});

  const tabs = [
    {
      title: 'Courses',
      content: (
        <GridPanel
          title="Courses"
          data={courses}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
          toolbar={
            <Button
              label="Create Course"
              icon="plus"
              onClick={() => {
                setCForm({
                  subjectName: '',
                  subjectCode: '',
                  semesterNumber: 1,
                  programName: '',
                  teacherName: '',
                  credits: 4,
                  courseType: 'Core',
                } as any);
                setCPopup({ mode: 'create' });
              }}
            />
          }
          columns={[
            { field: 'subjectName', header: 'Subject' },
            { field: 'semesterNumber', header: 'Sem' },
            { field: 'programName', header: 'Program' },
            { field: 'teacherName', header: 'Teacher' },
            { field: 'credits', header: 'Credits' },
            {
              field: 'id',
              header: 'Actions',
              cell: (row: Course) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    onClick={() => {
                      setCForm({ ...row });
                      setCPopup({ mode: 'edit', id: row.id });
                    }}
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    onClick={() =>
                      setCourses(courses.filter(x => x.id !== row.id))
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      ),
    },
    {
      title: 'Semesters',
      content: (
        <GridPanel
          title="Semesters"
          data={semesters}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
          toolbar={
            <Button
              label="Create Semester"
              icon="plus"
              onClick={() => {
                setSForm({
                  programName: 'B.Tech Computer Science',
                  semesterNumber: 1,
                  totalCredits: 24,
                  isActive: true,
                } as any);
                setSPopup({ mode: 'create' });
              }}
            />
          }
          columns={[
            { field: 'programName', header: 'Program' },
            { field: 'semesterNumber', header: 'Sem' },
            { field: 'totalCredits', header: 'Credits' },
            {
              field: 'isActive',
              header: 'Active',
              cell: (row: Semester) => (
                <span>{row.isActive ? '✅' : '❌'}</span>
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              cell: (row: Semester) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    onClick={() => {
                      setSForm({ ...row });
                      setSPopup({ mode: 'edit', id: row.id });
                    }}
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    onClick={() =>
                      setSemesters(semesters.filter(x => x.id !== row.id))
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      ),
    },
    {
      title: 'Subjects',
      content: (
        <GridPanel
          title="Subjects"
          data={subjects}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
          toolbar={
            <Button
              label="Create Subject"
              icon="plus"
              onClick={() => {
                setSubForm({
                  name: '',
                  code: '',
                  departmentId: 1,
                  departmentName: 'Computer Science',
                  isActive: true,
                } as any);
                setSubPopup({ mode: 'create' });
              }}
            />
          }
          columns={[
            {
              field: 'code',
              header: 'Code',
              cell: (row: Subject) => (
                <span className="font-mono">{row.code}</span>
              ),
            },
            { field: 'name', header: 'Name' },
            { field: 'departmentName', header: 'Department' },
            {
              field: 'isActive',
              header: 'Active',
              cell: (row: Subject) => <span>{row.isActive ? '✅' : '❌'}</span>,
            },
            {
              field: 'id',
              header: 'Actions',
              cell: (row: Subject) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    variant="text"
                    onClick={() => {
                      setSubForm({ ...row });
                      setSubPopup({ mode: 'edit', id: row.id });
                    }}
                  />
                  <Button
                    icon="trash"
                    variant="text"
                    onClick={() =>
                      setSubjects(subjects.filter(x => x.id !== row.id))
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Courses & Subjects"
      description="Manage courses, semesters, and subjects"
    >
      <InfoBanner
        title="About Courses & Subjects"
        message="Configure and manage the university curriculum. You can define complete courses, organize them into semesters, and manage individual subjects and their respective departments."
      />
      <Tabs tabs={tabs} />
      {cPopup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={() => setCPopup({ mode: 'closed' })}
          title={cPopup.mode === 'create' ? 'Create Course' : 'Edit Course'}
        >
          <FormGrid>
            <TextBox
              label="Subject Name"
              value={cForm.subjectName || ''}
              onChange={v => setCForm({ ...cForm, subjectName: v })}
              required
            />
            <TextBox
              label="Subject Code"
              value={cForm.subjectCode || ''}
              onChange={v => setCForm({ ...cForm, subjectCode: v })}
              required
            />
            <NumberBox
              label="Semester"
              value={cForm.semesterNumber || 1}
              onChange={v =>
                setCForm({ ...cForm, semesterNumber: v ?? undefined })
              }
              min={1}
              max={8}
            />
            <TextBox
              label="Program"
              value={cForm.programName || ''}
              onChange={v => setCForm({ ...cForm, programName: v })}
            />
            <TextBox
              label="Teacher"
              value={cForm.teacherName || ''}
              onChange={v => setCForm({ ...cForm, teacherName: v })}
            />
            <NumberBox
              label="Credits"
              value={cForm.credits || 4}
              onChange={v => setCForm({ ...cForm, credits: v ?? undefined })}
              min={1}
              max={8}
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setCPopup({ mode: 'closed' })}
            />
            <Button
              label="Save"
              onClick={() => {
                if (cPopup.mode === 'create') {
                  courses.push({
                    ...(cForm as Course),
                    id: Math.max(...courses.map(c => c.id)) + 1,
                  });
                } else if (cPopup.mode === 'edit' && cPopup.id) {
                  const idx = courses.findIndex(c => c.id === cPopup.id);
                  if (idx !== -1)
                    courses[idx] = { ...courses[idx], ...cForm } as Course;
                }
                setCourses([...courses]);
                setCPopup({ mode: 'closed' });
              }}
            />
          </div>
        </FormPopup>
      )}
      {sPopup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={() => setSPopup({ mode: 'closed' })}
          title={sPopup.mode === 'create' ? 'Create Semester' : 'Edit Semester'}
        >
          <FormGrid>
            <TextBox
              label="Program"
              value={sForm.programName || ''}
              onChange={v => setSForm({ ...sForm, programName: v })}
            />
            <NumberBox
              label="Semester Number"
              value={sForm.semesterNumber || 1}
              onChange={v =>
                setSForm({ ...sForm, semesterNumber: v ?? undefined })
              }
              min={1}
              max={8}
            />
            <NumberBox
              label="Total Credits"
              value={sForm.totalCredits || 24}
              onChange={v =>
                setSForm({ ...sForm, totalCredits: v ?? undefined })
              }
              min={1}
              max={50}
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setSPopup({ mode: 'closed' })}
            />
            <Button
              label="Save"
              onClick={() => {
                if (sPopup.mode === 'create')
                  semesters.push({
                    ...(sForm as Semester),
                    id: Math.max(...semesters.map(s => s.id)) + 1,
                    isActive: true,
                  });
                else if (sPopup.mode === 'edit' && sPopup.id) {
                  const idx = semesters.findIndex(s => s.id === sPopup.id);
                  if (idx !== -1)
                    semesters[idx] = {
                      ...semesters[idx],
                      ...sForm,
                    } as Semester;
                }
                setSemesters([...semesters]);
                setSPopup({ mode: 'closed' });
              }}
            />
          </div>
        </FormPopup>
      )}
      {subPopup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={() => setSubPopup({ mode: 'closed' })}
          title={subPopup.mode === 'create' ? 'Create Subject' : 'Edit Subject'}
        >
          <FormGrid>
            <TextBox
              label="Subject Name"
              value={subForm.name || ''}
              onChange={v => setSubForm({ ...subForm, name: v })}
              required
            />
            <TextBox
              label="Code"
              value={subForm.code || ''}
              onChange={v => setSubForm({ ...subForm, code: v })}
              required
            />
            <TextBox
              label="Department"
              value={subForm.departmentName || ''}
              onChange={v => setSubForm({ ...subForm, departmentName: v })}
            />
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setSubPopup({ mode: 'closed' })}
            />
            <Button
              label="Save"
              onClick={() => {
                if (subPopup.mode === 'create')
                  subjects.push({
                    ...(subForm as Subject),
                    id: Math.max(...subjects.map(s => s.id)) + 1,
                    isActive: true,
                  });
                else if (subPopup.mode === 'edit' && subPopup.id) {
                  const idx = subjects.findIndex(s => s.id === subPopup.id);
                  if (idx !== -1)
                    subjects[idx] = { ...subjects[idx], ...subForm } as Subject;
                }
                setSubjects([...subjects]);
                setSubPopup({ mode: 'closed' });
              }}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
