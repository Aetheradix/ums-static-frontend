import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  useFeeStore,
  type StudentDemand as DemandType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function FeeDemand() {
  const {
    demands,
    students,
    sessions,
    semesters,
    courses,
    generateDemand,
    bulkGenerateDemands,
  } = useFeeStore();

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'single' | 'bulk' | 'view';
    data?: DemandType;
  }>({ mode: 'closed' });

  // Single generation state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [semesterId, setSemesterId] = useState('');

  // Bulk generation state
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const handleSingleOpen = () => {
    setSelectedStudentId(students[0]?.id || '');
    setSessionId(sessions[0]?.id || '');
    setSemesterId(semesters[0]?.id || '');
    setPopup({ mode: 'single' });
  };

  const handleBulkOpen = () => {
    setSelectedCourseId(courses[0]?.id || '');
    setSessionId(sessions[0]?.id || '');
    setSemesterId(semesters[0]?.id || '');
    setPopup({ mode: 'bulk' });
  };

  const handleSingleGenerate = () => {
    if (!selectedStudentId || !sessionId || !semesterId) {
      ToastService.error('All inputs are required.');
      return;
    }
    generateDemand(selectedStudentId, sessionId, semesterId);
    ToastService.success('Demand generated successfully for student.');
    setPopup({ mode: 'closed' });
  };

  const handleBulkGenerate = () => {
    if (!selectedCourseId || !sessionId || !semesterId) {
      ToastService.error('All inputs are required.');
      return;
    }
    bulkGenerateDemands(selectedCourseId, semesterId, sessionId);
    ToastService.success('Bulk demands created for matches.');
    setPopup({ mode: 'closed' });
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || 'Unknown Student';
  };

  const getEnrollment = (id: string) => {
    return students.find(s => s.id === id)?.enrollmentNumber || 'N/A';
  };

  const getSessionName = (id: string) => {
    return sessions.find(s => s.id === id)?.name || 'N/A';
  };

  const getSemesterName = (id: string) => {
    return semesters.find(s => s.id === id)?.name || 'N/A';
  };

  return (
    <FormPage
      title="Fee Demand Generation"
      description="Manage the student fee invoices run. Perform single student demand generation or batch runs."
    >
      <FormCard>
        <GridPanel
          data={demands}
          onEdit={(item: DemandType) => setPopup({ mode: 'view', data: item })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Student Name',
              cell: (item: DemandType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            {
              header: 'Enrollment No',
              cell: (item: DemandType) => (
                <span>{getEnrollment(item.studentId)}</span>
              ),
            },
            {
              header: 'Academic Session',
              cell: (item: DemandType) => (
                <span>{getSessionName(item.academicSessionId)}</span>
              ),
            },
            {
              header: 'Total Fee',
              cell: (item: DemandType) => (
                <span>₹{item.totalFee.toLocaleString()}</span>
              ),
            },
            {
              header: 'Waiver/Off',
              cell: (item: DemandType) => (
                <span className="text-purple-700 font-medium">
                  ₹
                  {(
                    item.scholarshipAmount + item.concessionAmount
                  ).toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Payable Amount',
              cell: (item: DemandType) => (
                <span className="font-extrabold text-gray-800">
                  ₹{item.payableAmount.toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Due Date',
              field: 'dueDate',
            },
            {
              header: 'Status',
              cell: (item: DemandType) => {
                const color =
                  item.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800';
                return (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}
                  >
                    {item.status}
                  </span>
                );
              },
            },
          ]}
          toolbar={
            <div className="flex gap-2">
              <Button
                label="Single Demand Run"
                icon="user"
                variant="outlined"
                onClick={handleSingleOpen}
              />
              <Button
                label="Bulk Demand Run"
                icon="users"
                variant="primary"
                onClick={handleBulkOpen}
              />
            </div>
          }
          searchBox
        />
      </FormCard>

      {/* Single Run Popup */}
      <FormPopup
        visible={popup.mode === 'single'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Single Student Demand Run"
        subtitle="Select student, session and semester to run demand generation."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Select Student"
            data={students.map(s => ({
              text: `${s.name} (${s.enrollmentNumber})`,
              value: s.id,
            }))}
            textField="text"
            valueField="value"
            value={selectedStudentId}
            onChange={val => setSelectedStudentId(val as string)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <DropDownList
              label="Academic Session"
              data={sessions.map(s => ({ text: s.name, value: s.id }))}
              textField="text"
              valueField="value"
              value={sessionId}
              onChange={val => setSessionId(val as string)}
              required
            />
            <DropDownList
              label="Semester"
              data={semesters.map(s => ({ text: s.name, value: s.id }))}
              textField="text"
              valueField="value"
              value={semesterId}
              onChange={val => setSemesterId(val as string)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Run Demand"
              variant="primary"
              onClick={handleSingleGenerate}
            />
          </div>
        </div>
      </FormPopup>

      {/* Bulk Run Popup */}
      <FormPopup
        visible={popup.mode === 'bulk'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Bulk Student Demand Run"
        subtitle="Trigger bulk demand calculation for all students in a specific course."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Select Course"
            data={courses.map(c => ({ text: c.name, value: c.id }))}
            textField="text"
            valueField="value"
            value={selectedCourseId}
            onChange={val => setSelectedCourseId(val as string)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <DropDownList
              label="Academic Session"
              data={sessions.map(s => ({ text: s.name, value: s.id }))}
              textField="text"
              valueField="value"
              value={sessionId}
              onChange={val => setSessionId(val as string)}
              required
            />
            <DropDownList
              label="Semester"
              data={semesters.map(s => ({ text: s.name, value: s.id }))}
              textField="text"
              valueField="value"
              value={semesterId}
              onChange={val => setSemesterId(val as string)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Run Bulk Demands"
              variant="primary"
              onClick={handleBulkGenerate}
            />
          </div>
        </div>
      </FormPopup>

      {/* View Ledger Detail Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Fee Ledger Statement"
        subtitle="Detailed student ledger balances and adjustment records."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-gray-50 border rounded-md p-3 text-sm grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold text-gray-600">Student:</span>{' '}
                {getStudentName(popup.data.studentId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Enrollment:</span>{' '}
                {getEnrollment(popup.data.studentId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Semester:</span>{' '}
                {getSemesterName(popup.data.semesterId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Due Date:</span>{' '}
                {popup.data.dueDate}
              </div>
            </div>

            <div className="border rounded-md overflow-hidden bg-white">
              <table className="w-full text-sm text-left border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2.5 font-semibold text-gray-600 bg-gray-50">
                      Total Gross Fee
                    </td>
                    <td className="p-2.5 text-right font-medium">
                      ₹{popup.data.totalFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2.5 font-semibold text-gray-600 bg-gray-50">
                      Scholarship Benefit
                    </td>
                    <td className="p-2.5 text-right font-semibold text-green-600">
                      -₹{popup.data.scholarshipAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2.5 font-semibold text-gray-600 bg-gray-50">
                      Fee Concession Adjustment
                    </td>
                    <td className="p-2.5 text-right font-semibold text-indigo-600">
                      -₹{popup.data.concessionAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-2.5 text-gray-800">Net Payable Amount</td>
                    <td className="p-2.5 text-right text-green-800">
                      ₹{popup.data.payableAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Close Ledger"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
