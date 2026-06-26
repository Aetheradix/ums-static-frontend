import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useStudentRevaluationsQuery } from '../../queries';

const ELIGIBLE_SUBJECTS = [
  { code: 'MA201', name: 'Engineering Mathematics III', marks: 42, fee: 500 },
  { code: 'CS302', name: 'DBMS', marks: 55, fee: 500 },
];

export default function StudentRevaluation() {
  const { data: applications, isLoading } = useStudentRevaluationsQuery();
  const [selectedSubjects, setSelectedSubjects] = useState<Set<number>>(
    new Set()
  );
  const [showForm, setShowForm] = useState(false);

  const toggleSubject = (id: number) => {
    setSelectedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = () => {
    if (selectedSubjects.size === 0) {
      ToastService.error('Select at least one subject.');
      return;
    }
    ToastService.success(
      `Applied for revaluation of ${selectedSubjects.size} subject(s).`
    );
    setSelectedSubjects(new Set());
    setShowForm(false);
  };

  return (
    <FormPage
      title="Revaluation / Re-totaling"
      description="Apply for revaluation or re-totaling of your answer sheets"
    >
      <FormCard title="My Applications" icon="history">
        <GridPanel
          data={applications ?? []}
          loading={isLoading}
          columns={[
            { field: 'subjectName', header: 'Subject' },
            {
              field: 'revalType',
              header: 'Type',
              cell: (item: Examination.StudentRevaluationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.revalType === 'Revaluation' ? 'bg-orange-100 text-orange-800' : 'bg-cyan-100 text-cyan-800'}`}
                >
                  {item.revalType}
                </span>
              ),
            },
            { field: 'appliedDate', header: 'Applied Date' },
            { field: 'fee', header: 'Fee (INR)' },
            {
              header: 'Status',
              cell: (item: Examination.StudentRevaluationItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>

      {showForm ? (
        <FormCard title="Apply for Revaluation" icon="plus">
          <p className="text-sm text-gray-600 mb-3">
            Select subjects to apply for revaluation/re-totaling:
          </p>
          <div className="space-y-2 mb-4">
            {ELIGIBLE_SUBJECTS.map(s => (
              <label
                key={s.code}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.has(s.code.charCodeAt(0))}
                  onChange={() => toggleSubject(s.code.charCodeAt(0))}
                  className="rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {s.name} ({s.code})
                  </p>
                  <p className="text-xs text-gray-500">
                    Obtained: {s.marks} | Fee: ₹{s.fee}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              label="Cancel"
              icon="times"
              variant="text"
              onClick={() => setShowForm(false)}
            />
            <Button
              label={`Pay & Apply (₹${selectedSubjects.size * 500})`}
              icon="pi-credit-card"
              onClick={handleApply}
            />
          </div>
        </FormCard>
      ) : (
        <div className="flex justify-end mt-4">
          <Button
            label="New Application"
            icon="plus"
            onClick={() => setShowForm(true)}
          />
        </div>
      )}
    </FormPage>
  );
}
