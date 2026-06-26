import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import {
  useFeeStore,
  type Scholarship as ScholarshipType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function ScholarshipManagement() {
  const { scholarships, students, addScholarship, updateScholarshipStatus } =
    useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'register' | 'verify' | 'view';
    data?: ScholarshipType;
  }>({ mode: 'closed' });

  // Registration state
  const [studentId, setStudentId] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [applicationNo, setApplicationNo] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [docs, setDocs] = useState<string[]>([
    'income_cert.pdf',
    'academic_report.pdf',
  ]);

  // Verification Checklist State
  const [checkIncome, setCheckIncome] = useState(false);
  const [checkEnroll, setCheckEnroll] = useState(false);
  const [checkCaste, setCheckCaste] = useState(false);

  const handleRegisterOpen = () => {
    setStudentId(students[0]?.id || '');
    setSchemeName('');
    setApplicationNo(`SCH-${Date.now().toString().slice(-4)}`);
    setAmount(null);
    setDocs(['income_cert.pdf', 'academic_report.pdf']);
    setPopup({ mode: 'register' });
  };

  const handleVerifyOpen = (schol: ScholarshipType) => {
    setCheckIncome(false);
    setCheckEnroll(false);
    setCheckCaste(false);
    setPopup({ mode: 'verify', data: schol });
  };

  const handleRegister = () => {
    if (!studentId || !schemeName.trim() || !amount) {
      ToastService.error('All inputs are required.');
      return;
    }
    addScholarship({
      studentId,
      schemeName,
      applicationNo,
      amount: Number(amount),
      documents: docs,
    });
    ToastService.success('Scholarship application registered successfully.');
    setPopup({ mode: 'closed' });
  };

  const handleVerifySubmit = (id: string) => {
    if (!checkIncome || !checkEnroll) {
      ToastService.error(
        'Mandatory checks (Income, Enrollment) must be verified.'
      );
      return;
    }
    updateScholarshipStatus(id, 'Verified');
    ToastService.success('Documents verified. Application marked as Verified.');
    setPopup({ mode: 'closed' });
  };

  const handleApprove = (id: string) => {
    updateScholarshipStatus(id, 'Approved');
    ToastService.success('Scholarship approved successfully.');
  };

  const handleAdjust = (id: string) => {
    updateScholarshipStatus(id, 'Adjusted');
    ToastService.success(
      'Scholarship amount adjusted into student fee demand.'
    );
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || 'Unknown Student';
  };

  const getStudentEnroll = (id: string) => {
    return students.find(s => s.id === id)?.enrollmentNumber || 'N/A';
  };

  const getStatusVariant = (status: ScholarshipType['status']) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'Verified':
        return 'pending';
      case 'Approved':
        return 'approved';
      case 'Adjusted':
        return 'approved';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Scholarship Management"
      description="Track student scholarship claims, verify documents, and adjust allocations against student ledgers."
    >
      <FormCard>
        <GridPanel
          data={scholarships}
          onEdit={(item: ScholarshipType) =>
            setPopup({ mode: 'view', data: item })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Application No',
              field: 'applicationNo',
            },
            {
              header: 'Student Name',
              cell: (item: ScholarshipType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            {
              header: 'Scheme Name',
              field: 'schemeName',
            },
            {
              header: 'Amount',
              cell: (item: ScholarshipType) => (
                <span>₹{item.amount.toLocaleString()}</span>
              ),
            },
            {
              header: 'Status',
              cell: (item: ScholarshipType) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Workflow Actions',
              cell: (item: ScholarshipType) => (
                <div className="flex gap-2">
                  {item.status === 'Pending' && (
                    <Button
                      label="Verify Docs"
                      icon="shield"
                      variant="outlined"
                      onClick={() => handleVerifyOpen(item)}
                    />
                  )}
                  {item.status === 'Verified' && (
                    <Button
                      label="Approve"
                      icon="check"
                      variant="primary"
                      onClick={() => handleApprove(item.id)}
                    />
                  )}
                  {item.status === 'Approved' && (
                    <Button
                      label="Adjust Ledger"
                      icon="refresh"
                      variant="success"
                      onClick={() => handleAdjust(item.id)}
                    />
                  )}
                  {item.status === 'Adjusted' && (
                    <span className="text-xs text-gray-500 italic px-2">
                      Ledger Synced
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Register Scholarship"
              icon="plus"
              variant="outlined"
              onClick={handleRegisterOpen}
            />
          }
          searchBox
        />
      </FormCard>

      {/* Registration Popup */}
      <FormPopup
        visible={popup.mode === 'register'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Register Scholarship Application"
        subtitle="Submit a student scholarship application for review."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Student"
            data={students.map(s => ({
              text: `${s.name} (${s.enrollmentNumber})`,
              value: s.id,
            }))}
            textField="text"
            valueField="value"
            value={studentId}
            onChange={val => setStudentId(val as string)}
            required
          />

          <TextBox
            label="Scholarship Scheme Name"
            placeholder="e.g. Prime Minister's Special Scholarship Scheme"
            value={schemeName}
            onChange={setSchemeName}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <TextBox
              label="Application Number"
              value={applicationNo}
              disabled
            />
            <NumberBox
              label="Scholarship Amount (₹)"
              placeholder="e.g. 25000"
              value={amount ?? undefined}
              onChange={val => setAmount(val ?? null)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Mock Attachments
            </label>
            <div className="text-xs text-gray-500 flex gap-2">
              <span className="bg-gray-100 border p-1 rounded">
                📄 income_cert.pdf
              </span>
              <span className="bg-gray-100 border p-1 rounded">
                📄 academic_report.pdf
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Register Application"
              variant="primary"
              onClick={handleRegister}
            />
          </div>
        </div>
      </FormPopup>

      {/* Verification Checklist Popup */}
      <FormPopup
        visible={popup.mode === 'verify'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Document Verification Checklist"
        subtitle="Verify documents before scholarship approvals."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm flex flex-col gap-1">
              <div>
                <span className="font-semibold">Student:</span>{' '}
                {getStudentName(popup.data.studentId)} (
                {getStudentEnroll(popup.data.studentId)})
              </div>
              <div>
                <span className="font-semibold">Scheme:</span>{' '}
                {popup.data.schemeName}
              </div>
              <div>
                <span className="font-semibold">Amount Requested:</span> ₹
                {popup.data.amount.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Mandatory Verification Points
              </span>

              <label className="flex items-center gap-2 text-sm p-2 hover:bg-gray-50 border rounded cursor-pointer">
                <PrimeCheckbox
                  checked={checkIncome}
                  onChange={e => setCheckIncome(e.checked ?? false)}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    Income Certificate Check
                  </div>
                  <div className="text-xs text-gray-500">
                    Cross-reference income slab limits vs certificate values.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 text-sm p-2 hover:bg-gray-50 border rounded cursor-pointer">
                <PrimeCheckbox
                  checked={checkEnroll}
                  onChange={e => setCheckEnroll(e.checked ?? false)}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    Enrollment & Attendance Verification
                  </div>
                  <div className="text-xs text-gray-500">
                    Validate active status and attendance minimum threshold.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 text-sm p-2 hover:bg-gray-50 border rounded cursor-pointer">
                <PrimeCheckbox
                  checked={checkCaste}
                  onChange={e => setCheckCaste(e.checked ?? false)}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    Caste Certificate Check (If Applicable)
                  </div>
                  <div className="text-xs text-gray-500">
                    Validate caste category for post-matric benefits.
                  </div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Verify Documents"
                variant="primary"
                onClick={() => handleVerifySubmit(popup.data!.id)}
              />
            </div>
          </div>
        )}
      </FormPopup>

      {/* View Detail Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Scholarship Application Detail"
        subtitle="Review details and uploaded documents."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="border rounded-md p-3 bg-gray-50 text-sm flex flex-col gap-2">
              <div>
                <span className="font-semibold text-gray-600">
                  Application Number:
                </span>{' '}
                {popup.data.applicationNo}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Student:</span>{' '}
                {getStudentName(popup.data.studentId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Scheme Name:
                </span>{' '}
                {popup.data.schemeName}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Scholarship Amount:
                </span>{' '}
                ₹{popup.data.amount.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Status:</span>
                <StatusBadge
                  label={popup.data.status}
                  variant={getStatusVariant(popup.data.status)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">
                Uploaded Documents
              </span>
              <div className="flex flex-col gap-1 text-xs text-gray-700 bg-white border rounded p-2">
                {popup.data.documents.map(d => (
                  <div
                    key={d}
                    className="flex justify-between items-center p-1 hover:bg-gray-50 rounded"
                  >
                    <span>📄 {d}</span>
                    <button
                      className="text-green-600 hover:underline font-semibold"
                      onClick={() =>
                        ToastService.success(`Opening ${d} preview...`)
                      }
                    >
                      View Document
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Close"
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
