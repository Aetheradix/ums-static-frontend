import { FormCard, GridPanel } from 'shared/new-components';
import type { Faculty } from '../types';
import { formatDate } from '../utils';
import { useFaculty } from './hooks';
import { UniqueIdChip } from './ui';

/**
 * Joined visiting faculty — one row per Unique ID with every UTD they teach
 * in. `department` limits the list to faculty joined in that UTD.
 */
export default function FacultyRegister({
  department,
}: {
  department?: string;
}) {
  const faculty = useFaculty().filter(
    f => !department || f.departments.includes(department)
  );

  return (
    <FormCard
      title="Joined Visiting Faculty"
      subtitle="One Unique ID per faculty for the whole university — every department is linked under it."
      icon="id-card"
    >
      <GridPanel
        data={faculty}
        searchBox
        searchPlaceholder="Search by name, Unique ID or PAN..."
        columns={[
          {
            header: 'Unique ID',
            cell: (f: Faculty) => <UniqueIdChip value={f.uniqueId} />,
          },
          { field: 'fullName', header: 'Name', sortable: true },
          { field: 'pan', header: 'PAN' },
          { field: 'mobile', header: 'Mobile' },
          {
            header: 'Departments',
            cell: (f: Faculty) => (
              <div className="flex flex-wrap gap-1">
                {f.departments.map(d => (
                  <span
                    key={d}
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                      d === department
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            ),
          },
          {
            header: 'Subjects / Labs',
            cell: (f: Faculty) => (
              <span>{[...f.subjects, ...f.labs].join(', ')}</span>
            ),
          },
          {
            header: 'Joined On',
            cell: (f: Faculty) => <span>{formatDate(f.joinedOn)}</span>,
          },
        ]}
      />
    </FormCard>
  );
}
