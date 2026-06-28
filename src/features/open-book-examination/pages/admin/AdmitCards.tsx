import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockAdmitCards, mockExams } from '../../data';

export default function AdmitCards() {
  const [examId, setExamId] = useState<string>('');
  const [generated, setGenerated] = useState(false);

  const examOptions = mockExams
    .filter(
      e =>
        e.status === 'admit_generated' ||
        e.status === 'in_progress' ||
        e.status === 'submission'
    )
    .map(e => ({ value: String(e.id), label: e.title }));
  const cards = examId
    ? mockAdmitCards.filter(c => c.examId === Number(examId))
    : [];

  return (
    <FormPage title="Admit Cards" description="Generate and manage admit cards">
      <div className="flex gap-3 items-end mb-4">
        <DropDownList
          label="Select Exam"
          value={examId}
          onChange={v => {
            setExamId(v as string);
            setGenerated(false);
          }}
          data={examOptions}
          textField="label"
          valueField="value"
        />
        <Button
          label={generated ? 'Regenerate' : 'Generate All'}
          icon={generated ? 'refresh' : 'download'}
          onClick={() => setGenerated(true)}
          disabled={!examId}
        />
      </div>
      {generated && (
        <GridPanel
          title="Generated Admit Cards"
          data={cards}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
          toolbar={<Button label="Download All (PDF)" icon="file_download" />}
          columns={[
            { field: 'studentName', header: 'Student' },
            { field: 'rollNo', header: 'Roll No' },
            { field: 'programName', header: 'Program' },
            { field: 'date', header: 'Date' },
            { field: 'time', header: 'Time' },
            { field: 'venue', header: 'Venue' },
            {
              field: 'id',
              header: 'Actions',
              cell: () => <Button icon="file_download" variant="text" />,
            },
          ]}
        />
      )}
    </FormPage>
  );
}
