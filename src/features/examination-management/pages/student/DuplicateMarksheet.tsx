import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { useStudentDuplicateMarksheetsQuery } from '../../queries';

const REASONS = [
  'Damaged',
  'Lost',
  'Name Correction',
  'Marks Mismatch',
  'Other',
];

export default function StudentDuplicateMarksheet() {
  const { data: requests, isLoading } = useStudentDuplicateMarksheetsQuery();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);

  const handleApply = () => {
    ToastService.success(
      `Duplicate marksheet request submitted for reason: ${reason}`
    );
    setShowForm(false);
  };

  return (
    <FormPage
      title="Duplicate Marksheet"
      description="Apply for a duplicate copy of your marksheet"
    >
      <FormCard title="My Requests" icon="history">
        <GridPanel
          data={requests ?? []}
          loading={isLoading}
          columns={[
            { field: 'examName', header: 'Exam' },
            { field: 'reason', header: 'Reason' },
            { field: 'appliedDate', header: 'Applied Date' },
            { field: 'fee', header: 'Fee (INR)' },
            {
              header: 'Status',
              cell: (item: Examination.StudentDuplicateItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.StudentDuplicateItem) =>
                item.status === 'Generated' ? (
                  <Button
                    icon="download"
                    variant="text"
                    tooltip="Download"
                    onClick={() =>
                      ToastService.success('Downloading duplicate marksheet...')
                    }
                  />
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                ),
            },
          ]}
        />
      </FormCard>

      {showForm ? (
        <FormCard title="Apply for Duplicate Marksheet" icon="plus">
          <div className="space-y-4 p-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason for Duplicate
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              >
                {REASONS.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="text-gray-500">
                Fee: <span className="font-medium text-gray-800">₹200</span>
              </p>
              <p className="text-gray-500">
                Processing Time:{' '}
                <span className="font-medium text-gray-800">
                  5-7 working days
                </span>
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                label="Cancel"
                icon="times"
                variant="text"
                onClick={() => setShowForm(false)}
              />
              <Button
                label="Submit Request"
                icon="send"
                onClick={handleApply}
              />
            </div>
          </div>
        </FormCard>
      ) : (
        <div className="flex justify-end mt-4">
          <Button
            label="New Request"
            icon="plus"
            onClick={() => setShowForm(true)}
          />
        </div>
      )}
    </FormPage>
  );
}
