import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockExams } from '../../data';

export default function Exams() {
  const navigate = useNavigate();
  const [data, setData] = useState(
    mockExams.filter(e => [2, 3, 4].includes(e.createdBy))
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered =
    statusFilter === 'all' ? data : data.filter(e => e.status === statusFilter);

  const publish = (id: number) => {
    const idx = data.findIndex(e => e.id === id);
    if (idx !== -1 && data[idx].status === 'draft') {
      data[idx] = { ...data[idx], status: 'published' };
      setData([...data]);
    }
  };

  const remove = (id: number) => setData(data.filter(e => e.id !== id));

  const columns = [
    { field: 'title', header: 'Title' },
    { field: 'subjectName', header: 'Subject' },
    { field: 'scheduledDate', header: 'Date' },
    {
      field: 'durationMinutes',
      header: 'Duration',
      cell: (row: any) => <span>{row.durationMinutes}min</span>,
    },
    {
      field: 'isOpenBook',
      header: 'Open Book',
      cell: (row: any) => <span>{row.isOpenBook ? '✅' : '❌'}</span>,
    },
    {
      field: 'status',
      header: 'Status',
      cell: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'draft'
              ? 'bg-gray-100 text-gray-600'
              : row.status === 'published'
                ? 'bg-blue-100 text-blue-800'
                : row.status === 'evaluation'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
          }`}
        >
          {row.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex gap-1">
          {row.status === 'draft' && (
            <>
              <Button
                icon="pencil"
                variant="text"
                onClick={() =>
                  navigate(
                    `/open-book-examination/teacher/exams/${row.id}/edit`
                  )
                }
              />
              <Button
                label="Publish"
                icon="publish"
                size="small"
                onClick={() => publish(row.id)}
              />
            </>
          )}
          {row.status === 'published' && (
            <Button
              label="Build Paper"
              icon="description"
              size="small"
              onClick={() =>
                navigate(
                  `/open-book-examination/teacher/paper-builder/${row.id}`
                )
              }
            />
          )}
          {row.status === 'evaluation' && (
            <Button
              label="Evaluate"
              icon="grading"
              size="small"
              onClick={() =>
                navigate('/open-book-examination/teacher/evaluation')
              }
            />
          )}
          <Button icon="trash" variant="text" onClick={() => remove(row.id)} />
        </div>
      ),
    },
  ] as any;

  return (
    <FormPage title="My Exams" description="Manage your examinations">
      <GridPanel
        title="My Exams"
        data={filtered}
        columns={columns}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        searchPlaceholder="Search exams..."
        toolbar={
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="evaluation">Evaluation</option>
              <option value="result_published">Published Results</option>
            </select>
            <Button
              label="Create Exam"
              icon="plus"
              onClick={() =>
                navigate('/open-book-examination/teacher/exams/create')
              }
            />
          </div>
        }
      />
    </FormPage>
  );
}
