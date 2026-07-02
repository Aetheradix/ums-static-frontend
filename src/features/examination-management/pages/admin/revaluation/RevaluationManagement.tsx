import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface RevaluationRequest {
  id: string;
  studentId: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  originalMarks: number;
  newMarks: number | null;
  requestDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const mockRequests: RevaluationRequest[] = [
  {
    id: 'REV-001',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    subjectCode: 'CS-301',
    subjectName: 'Advanced Algorithms',
    originalMarks: 45,
    newMarks: null,
    requestDate: '2026-07-10',
    status: 'Pending',
  },
  {
    id: 'REV-002',
    studentId: 'STU2023045',
    studentName: 'Jane Smith',
    subjectCode: 'CS-302',
    subjectName: 'Database Systems',
    originalMarks: 62,
    newMarks: null,
    requestDate: '2026-07-11',
    status: 'In Progress',
  },
  {
    id: 'REV-003',
    studentId: 'STU2023099',
    studentName: 'Alice Johnson',
    subjectCode: 'CS-301',
    subjectName: 'Advanced Algorithms',
    originalMarks: 39,
    newMarks: 45,
    requestDate: '2026-07-05',
    status: 'Completed',
  },
];

export default function Revaluation() {
  const [requests, setRequests] = useState<RevaluationRequest[]>(mockRequests);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<RevaluationRequest | null>(null);
  const [updatedMarks, setUpdatedMarks] = useState<number | null>(null);

  const toast = useRef<Toast>(null);

  const statusTemplate = (rowData: RevaluationRequest) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Completed'
            ? 'approved'
            : rowData.status === 'In Progress'
              ? 'pending'
              : 'rejected'
        }
      />
    );
  };

  const actionTemplate = (rowData: RevaluationRequest) => {
    return (
      <Button
        label={rowData.status === 'Completed' ? 'View' : 'Update Marks'}
        icon={rowData.status === 'Completed' ? 'pi pi-eye' : 'pi pi-pencil'}
        size="small"
        severity={rowData.status === 'Completed' ? 'secondary' : 'info'}
        onClick={() => {
          setSelectedRequest(rowData);
          setUpdatedMarks(rowData.newMarks);
          setShowDialog(true);
        }}
      />
    );
  };

  const handleUpdate = () => {
    if (selectedRequest && updatedMarks !== null) {
      setRequests(
        requests.map(r =>
          r.id === selectedRequest.id
            ? { ...r, newMarks: updatedMarks, status: 'Completed' }
            : r
        )
      );
      setShowDialog(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Marks Updated',
        detail: `Revaluation completed for ${selectedRequest.studentName}.`,
        life: 3000,
      });
    }
  };

  return (
    <FormPage
      title="Revaluation Management"
      description="Process student requests for exam paper revaluation and marks recalculation"
    >
      <Toast ref={toast} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Requests
          </span>
          <span className="text-3xl font-black text-gray-800">
            {requests.length}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Pending & In Progress
          </span>
          <span className="text-3xl font-black text-orange-500">
            {requests.filter(r => r.status !== 'Completed').length}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Completed
          </span>
          <span className="text-3xl font-black text-green-600">
            {requests.filter(r => r.status === 'Completed').length}
          </span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={requests}
          emptyMessage="No revaluation requests found."
          responsiveLayout="scroll"
        >
          <Column
            field="id"
            header="Request ID"
            style={{ width: '10%' }}
          ></Column>
          <Column
            field="studentName"
            header="Student Name"
            style={{ width: '15%' }}
          ></Column>
          <Column
            field="subjectCode"
            header="Subject"
            body={r => `${r.subjectCode}: ${r.subjectName}`}
            style={{ width: '25%' }}
          ></Column>
          <Column
            field="originalMarks"
            header="Old Marks"
            style={{ textAlign: 'center', width: '10%' }}
          ></Column>
          <Column
            field="newMarks"
            header="New Marks"
            body={r => (
              <span
                className={
                  r.newMarks !== null && r.newMarks > r.originalMarks
                    ? 'text-green-600 font-bold'
                    : 'font-bold text-gray-800'
                }
              >
                {r.newMarks ?? '-'}
              </span>
            )}
            style={{ textAlign: 'center', width: '10%' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ textAlign: 'center', width: '15%' }}
          ></Column>
          <Column
            body={actionTemplate}
            header="Action"
            style={{ textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '450px' }}
        header="Update Revaluation Marks"
        modal
        onHide={() => setShowDialog(false)}
      >
        {selectedRequest && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="bg-gray-50 p-4 border border-gray-200 rounded">
              <h5 className="m-0 font-bold text-gray-800">
                {selectedRequest.studentName}{' '}
                <span className="text-sm font-normal text-gray-500">
                  ({selectedRequest.studentId})
                </span>
              </h5>
              <div className="text-sm text-gray-600 mt-1">
                {selectedRequest.subjectCode} - {selectedRequest.subjectName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Original Marks
                </label>
                <div className="p-3 bg-gray-100 border border-gray-200 rounded text-xl font-bold text-gray-500 text-center">
                  {selectedRequest.originalMarks}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Updated Marks
                </label>
                <InputNumber
                  value={updatedMarks}
                  onValueChange={e => setUpdatedMarks(e.value ?? null)}
                  disabled={selectedRequest.status === 'Completed'}
                  inputClassName="text-xl font-bold text-blue-700 text-center w-full"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
              <Button
                label={
                  selectedRequest.status === 'Completed' ? 'Close' : 'Cancel'
                }
                severity="secondary"
                outlined
                onClick={() => setShowDialog(false)}
              />
              {selectedRequest.status !== 'Completed' && (
                <Button
                  label="Save Updated Marks"
                  icon="pi pi-check"
                  severity="success"
                  onClick={handleUpdate}
                  disabled={updatedMarks === null}
                />
              )}
            </div>
          </div>
        )}
      </Dialog>
    </FormPage>
  );
}
