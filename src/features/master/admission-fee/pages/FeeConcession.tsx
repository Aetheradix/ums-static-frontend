import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  useFeeStore,
  type Concession as ConcessionType,
} from '../store/useFeeStore';
import { ToastService } from 'services';
import { DropDownList, NumberBox, TextArea } from 'shared/components/forms';

export default function FeeConcession() {
  const { concessions, students, addConcession, updateConcessionStatus } =
    useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'apply' | 'verify' | 'view';
    data?: ConcessionType;
  }>({ mode: 'closed' });

  // Apply state
  const [studentId, setStudentId] = useState('');
  const [concessionCategory, setConcessionCategory] = useState(
    'Merit-based Discount'
  );
  const [percentage, setPercentage] = useState('');
  const [reason, setReason] = useState('');
  const [docs, setDocs] = useState<string[]>(['grade_card.pdf']);

  const handleApplyOpen = () => {
    setStudentId(students[0]?.id || '');
    setConcessionCategory('Merit-based Discount');
    setPercentage('');
    setReason('');
    setDocs(['grade_card.pdf']);
    setPopup({ mode: 'apply' });
  };

  const handleApply = () => {
    if (!studentId || !concessionCategory || !percentage || !reason.trim()) {
      ToastService.error('All fields are required');
      return;
    }
    addConcession({
      studentId,
      category: concessionCategory,
      percentage: Number(percentage),
      reason,
      documents: docs,
    });
    ToastService.success('Concession application submitted successfully.');
    setPopup({ mode: 'closed' });
  };

  const handleVerify = (id: string) => {
    updateConcessionStatus(id, 'Verified');
    ToastService.success('Concession application verified.');
  };

  const handleApprove = (id: string) => {
    updateConcessionStatus(id, 'Approved');
    ToastService.success('Concession application approved and demand updated.');
  };

  const handleAdjust = (id: string) => {
    updateConcessionStatus(id, 'Adjusted');
    ToastService.success('Concession discount adjusted in the ledger.');
  };

  const getStudentName = (id: string) =>
    students.find(s => s.id === id)?.name || 'N/A';
  const getStudentEnroll = (id: string) =>
    students.find(s => s.id === id)?.enrollmentNumber || 'N/A';

  const getStatusVariant = (status: ConcessionType['status']) => {
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
      title="Fee Concession Process"
      description="Apply for fee concessions, verify student eligibility, and authorize ledger fee deductions."
    >
      <FormCard>
        <GridPanel
          data={concessions}
          onEdit={(item: ConcessionType) =>
            setPopup({ mode: 'view', data: item })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Student Name',
              cell: (item: ConcessionType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            { field: 'category', header: 'Concession Category' },
            {
              header: 'Percentage',
              cell: (item: ConcessionType) => (
                <span className="font-semibold">{item.percentage}%</span>
              ),
            },
            { field: 'reason', header: 'Justification Reason' },
            {
              header: 'Status',
              cell: (item: ConcessionType) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Approval Steps',
              cell: (item: ConcessionType) => (
                <div className="flex gap-1">
                  {item.status === 'Pending' && (
                    <Button
                      label="Verify"
                      variant="outlined"
                      className="p-1 text-xs"
                      onClick={() => handleVerify(item.id)}
                    />
                  )}
                  {item.status === 'Verified' && (
                    <Button
                      label="Approve"
                      variant="primary"
                      className="p-1 text-xs"
                      onClick={() => handleApprove(item.id)}
                    />
                  )}
                  {item.status === 'Approved' && (
                    <Button
                      label="Apply Adjusted"
                      variant="primary"
                      className="p-1 text-xs text-white bg-green-600 border-green-600 hover:bg-green-700"
                      onClick={() => handleAdjust(item.id)}
                    />
                  )}
                  {item.status === 'Adjusted' && (
                    <span className="text-xs text-gray-500 italic px-2">
                      Adjusted
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Apply Concession"
              icon="plus"
              variant="primary"
              onClick={handleApplyOpen}
            />
          }
          searchBox
        />
      </FormCard>

      {/* Application Popup */}
      <FormPopup
        visible={popup.mode === 'apply'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Apply for Fee Concession"
        subtitle="Submit concession details for administrative review."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Student"
            required
            value={studentId}
            onChange={val => setStudentId(val as string)}
            data={students.map(s => ({
              text: `${s.name} (${s.enrollmentNumber})`,
              value: s.id,
            }))}
            optionValue="value"
          />

          <div className="grid grid-cols-2 gap-3">
            <DropDownList
              label="Concession Category"
              required
              value={concessionCategory}
              onChange={val => setConcessionCategory(val as string)}
              data={[
                { text: 'Merit-based Discount', value: 'Merit-based Discount' },
                { text: 'Sibling discount', value: 'Sibling discount' },
                { text: 'Staff Quota Benefit', value: 'Staff Quota Benefit' },
                {
                  text: 'Economically Weaker Section (EWS)',
                  value: 'Economically Weaker Section (EWS)',
                },
                {
                  text: 'Sports Quota Concession',
                  value: 'Sports Quota Concession',
                },
              ]}
              optionValue="value"
            />
            <NumberBox
              label="Percentage discount (%)"
              required
              min={1}
              max={100}
              placeholder="10"
              value={percentage === '' ? undefined : Number(percentage)}
              onChange={val =>
                setPercentage(
                  val !== null && val !== undefined ? String(val) : ''
                )
              }
            />
          </div>

          <TextArea
            label="Justification / Reason"
            required
            rows={3}
            placeholder="Provide reason for discount request..."
            value={reason}
            onChange={setReason}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Supporting Attachment
            </label>
            <div className="text-xs text-gray-500 flex gap-2">
              <span className="bg-gray-100 border p-1 rounded">
                📄 concession_proof.pdf
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
              label="Submit Application"
              variant="primary"
              onClick={handleApply}
            />
          </div>
        </div>
      </FormPopup>

      {/* View Detail Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Concession Request Detail"
        subtitle="Review student application and attachments."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="border rounded-md p-3 bg-gray-50 text-sm flex flex-col gap-2">
              <div>
                <span className="font-semibold text-gray-600">
                  Student Name:
                </span>{' '}
                {getStudentName(popup.data.studentId)} (
                {getStudentEnroll(popup.data.studentId)})
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Concession Category:
                </span>{' '}
                {popup.data.category}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Percentage Discount:
                </span>{' '}
                {popup.data.percentage}%
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Justification:
                </span>{' '}
                {popup.data.reason}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Status:</span>
                <StatusBadge
                  label={popup.data.status}
                  variant={getStatusVariant(popup.data.status)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-700">
                Verification Files
              </span>
              <div className="text-xs text-gray-700 bg-white border rounded p-2 flex flex-col gap-1">
                {popup.data.documents.map(d => (
                  <div key={d} className="flex justify-between items-center">
                    <span>📄 {d}</span>
                    <button
                      className="text-green-600 hover:underline font-semibold"
                      onClick={() => ToastService.success(`Previewing ${d}...`)}
                    >
                      View File
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
