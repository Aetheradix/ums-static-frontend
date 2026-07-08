import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { Modal } from 'shared/components/popups';
import { studentManagementUrls } from '../../urls';

interface RegistrationRequest {
  id: string;
  semester: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
}

const mockRequests: RegistrationRequest[] = [
  {
    id: 'REG-002',
    semester: 'Semester 2',
    requestDate: '2026-12-15',
    status: 'Pending',
  },
  {
    id: 'REG-001',
    semester: 'Semester 1',
    requestDate: '2026-07-10',
    status: 'Approved',
    remarks: 'Cleared all dues.',
  },
];

export default function SemesterRegistration() {
  const [requests, setRequests] = useState<RegistrationRequest[]>(mockRequests);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusTemplate = (rowData: RegistrationRequest) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Approved'
            ? 'approved'
            : rowData.status === 'Rejected'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const handleApply = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest: RegistrationRequest = {
        id: `REG-00${Math.floor(Math.random() * 10) + 3}`,
        semester: 'Semester 3',
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      setRequests([newRequest, ...requests]);
      setIsSubmitting(false);
      setShowDialog(false);
    }, 1000);
  };

  const header = (
    <div className="flex justify-between items-center py-2">
      <h3 className="text-lg font-bold text-gray-800 m-0">
        My Registration History
      </h3>
      <Button
        label="Apply for Next Semester"
        icon="pi pi-send"
        onClick={() => setShowDialog(true)}
        disabled={requests.some(r => r.status === 'Pending')}
        className="shadow-sm font-bold bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
      />
    </div>
  );

  return (
    <FormPage
      title="Semester Registration"
      description="Apply for upcoming semesters and track approval status"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Portal', to: studentManagementUrls.student.root },
        { label: 'Semester Registration' },
      ]}
    >
      <FormCard className="p-0 overflow-hidden shadow-sm border-t-4 border-indigo-500">
        {requests.some(r => r.status === 'Pending') && (
          <div className="bg-orange-50 border-b border-orange-200 p-5 flex items-start gap-3">
            <i className="pi pi-exclamation-triangle text-orange-500 mt-0.5 text-xl"></i>
            <div>
              <p className="text-orange-900 m-0 font-bold">Pending Request</p>
              <p className="text-orange-700 m-0 text-sm mt-1">
                You have a pending semester registration request. Please wait
                for department approval before applying again.
              </p>
            </div>
          </div>
        )}
        <div className="p-6">
          <DataTable
            value={requests}
            paginator
            rows={10}
            header={header}
            emptyMessage="No registration history found."
            stripedRows
            rowHover
            className="p-datatable-sm mt-2"
          >
            <Column
              field="id"
              header="Request ID"
              sortable
              className="font-mono text-gray-700 font-medium"
            ></Column>
            <Column
              field="semester"
              header="Semester"
              sortable
              className="font-bold text-gray-800"
            ></Column>
            <Column
              field="requestDate"
              header="Applied On"
              sortable
              className="text-gray-600"
            ></Column>
            <Column
              field="remarks"
              header="Department Remarks"
              className="text-gray-600 italic"
            ></Column>
            <Column
              field="status"
              header="Status"
              body={statusTemplate}
              sortable
            ></Column>
          </DataTable>
        </div>
      </FormCard>

      <Modal
        visible={showDialog}
        size="small"
        header="Apply for Semester Registration"
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-gray-700 leading-relaxed text-sm">
              You are applying for registration into{' '}
              <span className="font-black text-indigo-700 text-base">
                Semester 3
              </span>
              .
            </p>
            <p className="text-gray-600 leading-relaxed text-sm mt-3">
              By submitting this request, you confirm that you have cleared all
              previous semester fee dues and meet the academic progression
              criteria.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 shadow-sm mt-2">
            <i className="pi pi-info-circle text-blue-500 text-xl"></i>
            <p className="text-blue-800 text-sm m-0 leading-relaxed font-medium">
              This request will be sent to your Head of Department for approval.
              You will be notified once it is processed.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button
              label="Cancel"
              icon="pi pi-times"
              outlined
              onClick={() => setShowDialog(false)}
              disabled={isSubmitting}
              className="text-gray-600 border-gray-300"
            />
            <Button
              label={isSubmitting ? 'Submitting...' : 'Confirm & Apply'}
              icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              onClick={handleApply}
              disabled={isSubmitting}
              className="shadow-sm font-bold bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
