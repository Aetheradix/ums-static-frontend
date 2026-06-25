import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useMarksEntriesQuery } from '../../../queries';
import { ToastService } from 'services';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-800',
  Verified: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
};

export default function MarksEntrySheet() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useMarksEntriesQuery(sid);
  const [editId, setEditId] = useState<number | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>({});

  const startEdit = (item: Examination.MarksEntryItem) => {
    setEditId(item.id);
    setMarks({
      theoryMarks: item.theoryMarks?.toString() ?? '',
      practicalMarks: item.practicalMarks?.toString() ?? '',
      iaMarks: item.iaMarks?.toString() ?? '',
    });
  };

  const saveEdit = () => {
    setEditId(null);
    setMarks({});
    ToastService.success('Marks saved successfully.');
  };
  const cancelEdit = () => {
    setEditId(null);
    setMarks({});
  };
  const handleSubmitMarks = () => {
    ToastService.success('Marks submitted for verification.');
  };

  const EditableCell = (
    field: string,
    value: string | number | null | undefined
  ) => {
    if (
      field === 'theoryMarks' ||
      field === 'practicalMarks' ||
      field === 'iaMarks'
    ) {
      const item = (data ?? []).find(m => m.id === editId);
      const isEditing = editId !== null && item !== undefined;
      if (isEditing) {
        return (
          <input
            className="w-16 px-1 py-0.5 border border-blue-400 rounded text-sm text-center outline-none"
            value={marks[field] ?? ''}
            onChange={e => setMarks({ ...marks, [field]: e.target.value })}
            autoFocus={field === 'theoryMarks'}
          />
        );
      }
    }
    return <span>{value ?? '-'}</span>;
  };

  return (
    <FormPage
      title="Marks Entry"
      description={`Enter marks for session #${sid}`}
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search students..."
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'rollNumber', header: 'Roll Number' },
            { field: 'subjectCode', header: 'Subject Code' },
            { field: 'subjectName', header: 'Subject Name' },
            {
              field: 'theoryMarks',
              header: 'Theory',
              cell: (item: Examination.MarksEntryItem) =>
                EditableCell('theoryMarks', item.theoryMarks),
            },
            {
              field: 'practicalMarks',
              header: 'Practical',
              cell: (item: Examination.MarksEntryItem) =>
                EditableCell('practicalMarks', item.practicalMarks),
            },
            {
              field: 'iaMarks',
              header: 'IA',
              cell: (item: Examination.MarksEntryItem) =>
                EditableCell('iaMarks', item.iaMarks),
            },
            { field: 'totalMarks', header: 'Total' },
            { field: 'maxMarks', header: 'Max' },
            {
              header: 'Status',
              cell: (item: Examination.MarksEntryItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.MarksEntryItem) => {
                if (editId === item.id) {
                  return (
                    <div className="flex gap-1">
                      <Button
                        icon="check"
                        variant="success"
                        tooltip="Save"
                        onClick={saveEdit}
                      />
                      <Button
                        icon="times"
                        variant="danger"
                        tooltip="Cancel"
                        onClick={cancelEdit}
                      />
                    </div>
                  );
                }
                if (item.status === 'Pending') {
                  return (
                    <div className="flex gap-1">
                      <Button
                        icon="pencil"
                        variant="text"
                        tooltip="Edit Marks"
                        onClick={() => startEdit(item)}
                      />
                      <Button
                        icon="send"
                        variant="text"
                        tooltip="Submit"
                        onClick={handleSubmitMarks}
                      />
                    </div>
                  );
                }
                return <span />;
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
