import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { DifficultyBadge, QuestionTypeIcon } from '../../components';
import type { Difficulty } from '../../data';
import { mockQuestions } from '../../data';

export default function QuestionBank() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockQuestions);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [bloomFilter, setBloomFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');

  const filtered = data.filter(q => {
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    if (bloomFilter !== 'all' && q.bloomLevel !== Number(bloomFilter))
      return false;
    if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false;
    return true;
  });

  const remove = (id: number) => setData(data.filter(q => q.id !== id));

  const columns = [
    {
      field: 'type',
      header: 'Type',
      cell: (row: any) => <QuestionTypeIcon type={row.type} />,
    },
    { field: 'questionText', header: 'Question', width: 300 },
    { field: 'subjectName', header: 'Subject' },
    { field: 'marks', header: 'Marks' },
    {
      field: 'bloomLevel',
      header: "Bloom's",
      cell: (row: any) => <span>L{row.bloomLevel}</span>,
    },
    {
      field: 'difficulty',
      header: 'Difficulty',
      cell: (row: any) => (
        <DifficultyBadge level={row.difficulty as Difficulty} />
      ),
    },
    { field: 'usageCount', header: 'Uses' },
    {
      header: 'Actions',
      cell: (row: any, { rowIndex: _rowIndex }: any) => (
        <div className="flex gap-1">
          <Button
            icon="pencil"
            variant="text"
            onClick={() =>
              navigate(
                `/open-book-examination/teacher/question-bank/${row.id}/edit`
              )
            }
          />
          <Button
            label="Clone"
            icon="content_copy"
            variant="text"
            onClick={() => {
              data.push({
                ...row,
                id: Math.max(...data.map((x: any) => x.id)) + 1,
                usageCount: 0,
              });
              setData([...data]);
            }}
          />
          <Button icon="trash" variant="text" onClick={() => remove(row.id)} />
        </div>
      ),
    },
  ] as any;

  return (
    <FormPage
      title="Question Bank"
      description="Manage your question repository"
    >
      <GridPanel
        title="Question Bank"
        data={filtered}
        columns={columns}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        searchPlaceholder="Search questions..."
        toolbar={
          <div className="flex gap-2 items-center">
            <DropDownList
              value={typeFilter}
              onChange={v => setTypeFilter(v as string)}
              data={[
                { value: 'all', label: 'All Types' },
                ...[
                  'mcq',
                  'true_false',
                  'short_answer',
                  'long_answer',
                  'case_study',
                  'coding',
                  'matching',
                  'assertion_reason',
                ].map(t => ({ value: t, label: t.replace(/_/g, ' ') })),
              ]}
              textField="label"
              valueField="value"
            />
            <DropDownList
              value={bloomFilter}
              onChange={v => setBloomFilter(v as string)}
              data={[
                { value: 'all', label: "All Bloom's" },
                ...[1, 2, 3, 4, 5, 6].map(l => ({
                  value: String(l),
                  label: `L${l}`,
                })),
              ]}
              textField="label"
              valueField="value"
            />
            <DropDownList
              value={diffFilter}
              onChange={v => setDiffFilter(v as string)}
              data={[
                { value: 'all', label: 'All Difficulty' },
                ...['easy', 'medium', 'hard', 'expert'].map(d => ({
                  value: d,
                  label: d,
                })),
              ]}
              textField="label"
              valueField="value"
            />
            <Button
              label="Create Question"
              icon="plus"
              onClick={() =>
                navigate('/open-book-examination/teacher/question-bank/create')
              }
            />
            <Button
              label="Import CSV"
              icon="upload"
              onClick={() =>
                navigate('/open-book-examination/teacher/question-bank/import')
              }
            />
          </div>
        }
      />
    </FormPage>
  );
}
