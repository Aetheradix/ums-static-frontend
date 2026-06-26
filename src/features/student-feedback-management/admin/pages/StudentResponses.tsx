import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import {
  studentResponses as initialData,
  departmentOptions,
  programmeOptions,
  facultyOptions,
} from '../../data';
import { feedbackUrls } from '../../urls';

const completionStyles: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  Partial: 'bg-yellow-50 text-yellow-700',
  Pending: 'bg-gray-100 text-gray-500',
};

export default function StudentResponses() {
  const [filters, setFilters] = useState({
    department: '',
    faculty: '',
    semester: '',
    programme: '',
  });

  const filtered = useMemo(() => {
    return initialData.filter(r => {
      if (filters.department && r.department !== filters.department)
        return false;
      if (filters.faculty && r.faculty !== filters.faculty) return false;
      if (filters.programme && r.programme !== filters.programme) return false;
      return true;
    });
  }, [filters]);

  const deptOpts = [
    { name: 'All Departments', value: '' },
    ...departmentOptions.map(d => ({ name: d, value: d })),
  ];
  const progOpts = [
    { name: 'All Programmes', value: '' },
    ...programmeOptions.map(p => ({ name: p, value: p })),
  ];
  const facOpts = [
    { name: 'All Faculty', value: '' },
    ...facultyOptions.map(f => ({ name: f, value: f })),
  ];

  return (
    <FormPage
      title="Student Responses"
      description="View and filter student feedback submissions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Responses' },
      ]}
    >
      <FormCard>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-48">
            <DropDownList
              label="Department"
              data={deptOpts}
              textField="name"
              optionValue="value"
              value={filters.department}
              onChange={v =>
                setFilters(f => ({ ...f, department: String(v ?? '') }))
              }
            />
          </div>
          <div className="w-48">
            <DropDownList
              label="Faculty"
              data={facOpts}
              textField="name"
              optionValue="value"
              value={filters.faculty}
              onChange={v =>
                setFilters(f => ({ ...f, faculty: String(v ?? '') }))
              }
            />
          </div>
          <div className="w-48">
            <DropDownList
              label="Programme"
              data={progOpts}
              textField="name"
              optionValue="value"
              value={filters.programme}
              onChange={v =>
                setFilters(f => ({ ...f, programme: String(v ?? '') }))
              }
            />
          </div>
          <div className="flex items-start pt-5">
            <Button
              label="Clear Filters"
              variant="outlined"
              onClick={() =>
                setFilters({
                  department: '',
                  faculty: '',
                  semester: '',
                  programme: '',
                })
              }
            />
          </div>
        </div>
        <GridPanel
          data={filtered}
          searchBox
          searchPlaceholder="Search by student ID..."
          columns={[
            { field: 'studentId', header: 'Student ID' },
            { field: 'department', header: 'Department' },
            { field: 'programme', header: 'Programme' },
            { field: 'faculty', header: 'Faculty' },
            { field: 'course', header: 'Course' },
            {
              field: 'submittedOn',
              header: 'Submitted On',
              cell: (item: (typeof initialData)[0]) => (
                <span>{item.submittedOn || '—'}</span>
              ),
            },
            {
              field: 'completionStatus',
              header: 'Status',
              cell: (item: (typeof initialData)[0]) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${completionStyles[item.completionStatus]}`}
                >
                  {item.completionStatus}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
