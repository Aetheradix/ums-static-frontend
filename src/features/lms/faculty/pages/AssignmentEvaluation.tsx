import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { InputTextarea } from 'primereact/inputtextarea';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  score: number | null;
  feedback: string;
  status: 'Graded' | 'Pending' | 'Late';
}

const mockSubmissions: Submission[] = [
  {
    id: 'SUB-01',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    submittedAt: '2026-07-01 10:30 AM',
    fileUrl: 'assignment1_john.pdf',
    score: 85,
    feedback: 'Good work',
    status: 'Graded',
  },
  {
    id: 'SUB-02',
    studentId: 'STU2023002',
    studentName: 'Jane Smith',
    submittedAt: '2026-07-01 11:15 AM',
    fileUrl: 'assignment1_jane.pdf',
    score: null,
    feedback: '',
    status: 'Pending',
  },
  {
    id: 'SUB-03',
    studentId: 'STU2023003',
    studentName: 'Alice Johnson',
    submittedAt: '2026-07-02 09:00 AM',
    fileUrl: 'assignment1_alice.pdf',
    score: null,
    feedback: '',
    status: 'Late',
  },
];

export default function AssignmentEvaluation() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  // Grading State
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');

  const toast = useRef<Toast>(null);

  const statusTemplate = (rowData: Submission) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Graded'
            ? 'approved'
            : rowData.status === 'Late'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const actionTemplate = (rowData: Submission) => (
    <Button
      label={rowData.status === 'Graded' ? 'Edit Grade' : 'Evaluate'}
      icon="pi pi-check-square"
      size="small"
      severity={rowData.status === 'Graded' ? 'secondary' : 'info'}
      onClick={() => {
        setSelectedSubmission(rowData);
        setCurrentScore(rowData.score);
        setCurrentFeedback(rowData.feedback);
        setShowDialog(true);
      }}
    />
  );

  const handleSaveGrade = () => {
    if (selectedSubmission) {
      setSubmissions(
        submissions.map(s =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                score: currentScore,
                feedback: currentFeedback,
                status: currentScore !== null ? 'Graded' : s.status,
              }
            : s
        )
      );

      setShowDialog(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Grade Saved',
        detail: `Evaluated ${selectedSubmission.studentName}`,
        life: 3000,
      });
    }
  };

  const header = (
    <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
      <div className="flex flex-col">
        <h4 className="m-0 text-gray-800 font-bold">
          Assignment 1: Database Normalization
        </h4>
        <span className="text-sm text-gray-500">
          Subject: CS-302 | Max Marks: 100
        </span>
      </div>
      <Button
        label="Publish All Grades"
        icon="pi pi-send"
        severity="success"
        outlined
      />
    </div>
  );

  return (
    <FormPage
      title="Assignment Evaluation"
      description="Review student submissions, provide feedback, and assign grades"
    >
      <Toast ref={toast} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Submissions
          </span>
          <span className="text-3xl font-black text-gray-800">
            3 <span className="text-xl text-gray-400 font-medium">/ 60</span>
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Pending Evaluation
          </span>
          <span className="text-3xl font-black text-orange-500">
            {submissions.filter(s => s.status !== 'Graded').length}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Average Score
          </span>
          <span className="text-3xl font-black text-blue-600">
            {submissions.filter(s => s.score !== null).length > 0
              ? (
                  submissions.reduce(
                    (acc, curr) => acc + (curr.score || 0),
                    0
                  ) / submissions.filter(s => s.score !== null).length
                ).toFixed(1)
              : 'N/A'}
          </span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={submissions}
          header={header}
          emptyMessage="No submissions found."
          responsiveLayout="scroll"
        >
          <Column
            field="studentId"
            header="Student ID"
            style={{ width: '15%' }}
          ></Column>
          <Column
            field="studentName"
            header="Student Name"
            style={{ width: '20%' }}
          ></Column>
          <Column
            field="submittedAt"
            header="Submitted At"
            style={{ width: '20%' }}
          ></Column>
          <Column
            header="Attachment"
            body={r => (
              <a href="#" className="text-blue-600 hover:underline">
                <i className="pi pi-file-pdf mr-1"></i>
                {r.fileUrl}
              </a>
            )}
            style={{ width: '20%' }}
          ></Column>
          <Column
            field="score"
            header="Score"
            body={r =>
              r.score !== null ? (
                <span className="font-bold text-gray-800">{r.score}/100</span>
              ) : (
                '-'
              )
            }
            style={{ textAlign: 'center' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ textAlign: 'center' }}
          ></Column>
          <Column
            body={actionTemplate}
            header="Action"
            style={{ width: '10rem', textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '600px' }}
        header="Evaluate Submission"
        modal
        onHide={() => setShowDialog(false)}
      >
        {selectedSubmission && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="m-0 font-bold text-gray-800">
                    {selectedSubmission.studentName}
                  </h5>
                  <span className="text-sm text-gray-500">
                    {selectedSubmission.studentId}
                  </span>
                </div>
                <StatusBadge
                  label={
                    selectedSubmission.status === 'Late'
                      ? 'Late Submission'
                      : 'On Time'
                  }
                  variant={
                    selectedSubmission.status === 'Late'
                      ? 'rejected'
                      : 'approved'
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-4 p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                <i className="pi pi-file-pdf text-red-500 text-2xl"></i>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-sm text-gray-700">
                    {selectedSubmission.fileUrl}
                  </span>
                  <span className="text-xs text-gray-400">
                    Click to preview
                  </span>
                </div>
                <Button icon="pi pi-download" text rounded />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="font-semibold text-gray-700">
                Marks Awarded (Out of 100)
              </label>
              <InputNumber
                value={currentScore}
                onValueChange={e => setCurrentScore(e.value ?? null)}
                min={0}
                max={100}
                inputClassName="font-bold text-lg text-blue-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Feedback / Comments
              </label>
              <InputTextarea
                value={currentFeedback}
                onChange={e => setCurrentFeedback(e.target.value)}
                rows={4}
                placeholder="Provide constructive feedback..."
              />
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
              <Button
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                outlined
                onClick={() => setShowDialog(false)}
              />
              <Button
                label="Save Grade"
                icon="pi pi-check"
                severity="success"
                onClick={handleSaveGrade}
              />
            </div>
          </div>
        )}
      </Dialog>
    </FormPage>
  );
}
