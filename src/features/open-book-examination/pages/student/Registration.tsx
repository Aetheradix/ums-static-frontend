import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockExams, mockRegistrations } from '../../data';

export default function Registration() {
  const studentId = 8;
  const myRegs = mockRegistrations.filter(r => r.studentId === studentId);
  const registeredExamIds = myRegs.map(r => r.examId);

  const availableExams = mockExams.filter(
    e => e.status === 'registration_open' && !registeredExamIds.includes(e.id)
  );
  const [data, setData] = useState(myRegs);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const register = (examId: number) => {
    const exam = mockExams.find(e => e.id === examId);
    if (!exam) return;
    const reg = {
      id: Math.max(...mockRegistrations.map(r => r.id)) + 1,
      examId,
      examTitle: exam.title,
      subjectName: exam.subjectName,
      studentId,
      studentName: 'Rohan Mehta',
      rollNo: '2024001',
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'registered' as const,
    };
    mockRegistrations.push(reg);
    setData([...mockRegistrations.filter(r => r.studentId === studentId)]);
    setConfirmId(null);
  };

  const withdraw = (regId: number) => {
    const idx = data.findIndex(r => r.id === regId);
    if (idx !== -1) {
      data[idx].status = 'withdrawn';
      setData([...data]);
    }
  };

  return (
    <FormPage
      title="Exam Registration"
      description="Register for open book examinations"
    >
      <InfoBanner
        title="About Registration"
        message="Browse and register for upcoming open book examinations. Review your eligibility and submit your registration requests here."
      />
      {availableExams.length > 0 && (
        <GridPanel
          title="Available Exams for Registration"
          data={availableExams}
          columns={[
            { field: 'title', header: 'Exam' },
            { field: 'subjectName', header: 'Subject' },
            { field: 'scheduledDate', header: 'Date' },
            {
              field: 'isOpenBook',
              header: 'Open Book',
              cell: row => <span>{row.isOpenBook ? 'Yes' : 'No'}</span>,
            },
            {
              header: 'Actions',
              cell: row => (
                <Button
                  label="Register"
                  icon="how_to_reg"
                  onClick={() => setConfirmId(row.id)}
                />
              ),
            },
          ]}
          dataKey="id"
          pagination={{ rows: 10 }}
        />
      )}
      <GridPanel
        title="My Registrations"
        data={data}
        columns={[
          { field: 'examTitle', header: 'Exam' },
          { field: 'registeredAt', header: 'Registered On' },
          {
            field: 'status',
            header: 'Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.status === 'registered'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {row.status}
              </span>
            ),
          },
          {
            header: 'Actions',
            cell: row =>
              row.status === 'registered' ? (
                <Button
                  label="Withdraw"
                  variant="outlined"
                  onClick={() => withdraw(row.id)}
                />
              ) : (
                <span className="text-gray-400">-</span>
              ),
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
      />
      {confirmId && (
        <FormPopup
          visible
          onHide={() => setConfirmId(null)}
          title="Confirm Registration"
          size="default"
        >
          <p className="mb-4">
            Are you sure you want to register for this exam?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setConfirmId(null)}
            />
            <Button
              label="Confirm Register"
              icon="check"
              onClick={() => register(confirmId)}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
