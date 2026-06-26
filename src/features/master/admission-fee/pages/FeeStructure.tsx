import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { InputNumber } from 'primereact/inputnumber';
import {
  useFeeStore,
  type FeeStructure as StructureType,
  type FeeHeadAmount,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function FeeStructure() {
  const {
    feeStructures,
    sessions,
    courses,
    semesters,
    feeHeads,
    addFeeStructure,
    updateFeeStructure,
    approveFeeStructure,
  } = useFeeStore();

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit' | 'view';
    data?: StructureType;
  }>({ mode: 'closed' });

  const [sessionId, setSessionId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [category, setCategory] = useState('General');
  const [headAmounts, setHeadAmounts] = useState<Record<string, number>>({});

  const handleCreateOpen = () => {
    setSessionId(sessions[0]?.id || '');
    setCourseId(courses[0]?.id || '');
    setSemesterId(semesters[0]?.id || '');
    setCategory('General');

    // Initialize head amounts to 0
    const initialAmounts: Record<string, number> = {};
    feeHeads.forEach(h => {
      initialAmounts[h.id] = 0;
    });
    setHeadAmounts(initialAmounts);
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (structure: StructureType) => {
    setSessionId(structure.academicSessionId);
    setCourseId(structure.courseId);
    setSemesterId(structure.semesterId);
    setCategory(structure.category);

    const initialAmounts: Record<string, number> = {};
    feeHeads.forEach(h => {
      const match = structure.heads.find(ha => ha.feeHeadId === h.id);
      initialAmounts[h.id] = match ? match.amount : 0;
    });
    setHeadAmounts(initialAmounts);
    setPopup({ mode: 'edit', data: structure });
  };

  const handleViewOpen = (structure: StructureType) => {
    setPopup({ mode: 'view', data: structure });
  };

  const handleAmountChange = (
    headId: string,
    val: number | null | undefined
  ) => {
    setHeadAmounts(prev => ({
      ...prev,
      [headId]: val ?? 0,
    }));
  };

  const handleSave = () => {
    if (!sessionId || !courseId || !semesterId || !category.trim()) {
      ToastService.error('All fields are required');
      return;
    }

    const headsArray: FeeHeadAmount[] = Object.entries(headAmounts).map(
      ([feeHeadId, amount]) => ({
        feeHeadId,
        amount,
      })
    );

    const structData = {
      academicSessionId: sessionId,
      courseId,
      semesterId,
      category,
      heads: headsArray,
      status: 'Draft' as const,
    };

    if (popup.mode === 'create') {
      addFeeStructure(structData);
      ToastService.success('Fee Structure created in Draft mode.');
    } else if (popup.mode === 'edit' && popup.data) {
      updateFeeStructure(popup.data.id, structData);
      ToastService.success('Fee Structure updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleStatusChange = (
    id: string,
    nextStatus: 'Submitted' | 'Approved' | 'Published'
  ) => {
    approveFeeStructure(id, nextStatus);
    ToastService.success(`Fee structure status updated to ${nextStatus}.`);
  };

  const getSessionName = (id: string) =>
    sessions.find(s => s.id === id)?.name || 'Unknown';
  const getCourseName = (id: string) =>
    courses.find(c => c.id === id)?.name || 'Unknown';
  const getSemesterName = (id: string) =>
    semesters.find(s => s.id === id)?.name || 'Unknown';

  const getStatusVariant = (status: StructureType['status']) => {
    switch (status) {
      case 'Draft':
        return 'neutral';
      case 'Submitted':
        return 'pending';
      case 'Approved':
        return 'approved';
      case 'Published':
        return 'approved';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Fee Structure Transaction"
      description="Configure, review and publish complex fee structures for course streams."
    >
      <FormCard>
        <GridPanel
          data={feeStructures}
          onEdit={handleEditOpen}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Academic Session',
              cell: (item: StructureType) => (
                <span>{getSessionName(item.academicSessionId)}</span>
              ),
            },
            {
              header: 'Course',
              cell: (item: StructureType) => (
                <span>{getCourseName(item.courseId)}</span>
              ),
            },
            {
              header: 'Semester',
              cell: (item: StructureType) => (
                <span>{getSemesterName(item.semesterId)}</span>
              ),
            },
            { field: 'category', header: 'Category' },
            {
              header: 'Total Fee',
              cell: (item: StructureType) => (
                <span className="font-bold text-gray-800">
                  ₹{item.totalAmount.toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: StructureType) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Actions Workflow',
              cell: (item: StructureType) => (
                <div className="flex gap-1.5">
                  <Button
                    label="View"
                    icon="eye"
                    variant="text"
                    onClick={() => handleViewOpen(item)}
                  />
                  {item.status === 'Draft' && (
                    <Button
                      label="Submit"
                      icon="arrow-right"
                      variant="outlined"
                      onClick={() => handleStatusChange(item.id, 'Submitted')}
                    />
                  )}
                  {item.status === 'Submitted' && (
                    <Button
                      label="Approve"
                      icon="check"
                      variant="outlined"
                      onClick={() => handleStatusChange(item.id, 'Approved')}
                    />
                  )}
                  {item.status === 'Approved' && (
                    <Button
                      label="Publish"
                      icon="cloud-upload"
                      variant="primary"
                      onClick={() => handleStatusChange(item.id, 'Published')}
                    />
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Structure"
              icon="plus"
              variant="outlined"
              onClick={handleCreateOpen}
            />
          }
          searchBox
        />
      </FormCard>

      {/* Create / Edit Popup */}
      <FormPopup
        visible={popup.mode === 'create' || popup.mode === 'edit'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Create Fee Structure'
            : 'Edit Fee Structure'
        }
        subtitle="Complete structure parameters and head distribution."
      >
        <div className="flex flex-col gap-4 py-2">
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
              label="Course"
              data={courses.map(c => ({ text: c.name, value: c.id }))}
              textField="text"
              valueField="value"
              value={courseId}
              onChange={val => setCourseId(val as string)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DropDownList
              label="Semester"
              data={semesters.map(s => ({ text: s.name, value: s.id }))}
              textField="text"
              valueField="value"
              value={semesterId}
              onChange={val => setSemesterId(val as string)}
              required
            />
            <TextBox
              label="Category"
              placeholder="e.g. General"
              value={category}
              onChange={setCategory}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Fee Distribution Amounts (₹)
            </label>
            <div className="border rounded-md p-3 flex flex-col gap-2 max-h-56 overflow-y-auto bg-gray-50">
              {feeHeads.map(head => (
                <div
                  key={head.id}
                  className="flex justify-between items-center gap-4 bg-white p-2 border rounded shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {head.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {head.category} ({head.frequency})
                    </span>
                  </div>
                  <InputNumber
                    min={0}
                    placeholder="0"
                    className="w-32 text-right"
                    inputClassName="p-1 border rounded w-full text-right"
                    value={headAmounts[head.id] || null}
                    onValueChange={e => handleAmountChange(head.id, e.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 border-t pt-3">
            <span className="text-base font-bold text-gray-800">
              Total Amount: ₹
              {Object.values(headAmounts)
                .reduce((a, b) => a + b, 0)
                .toLocaleString()}
            </span>
            <div className="flex gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Save as Draft"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      </FormPopup>

      {/* View Detail Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Fee Structure Details"
        subtitle="Detailed breakdown of the selected fee structure configuration."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 border rounded-md">
              <div>
                <span className="font-semibold text-gray-600">Session:</span>{' '}
                {getSessionName(popup.data.academicSessionId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Course:</span>{' '}
                {getCourseName(popup.data.courseId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Semester:</span>{' '}
                {getSemesterName(popup.data.semesterId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Category:</span>{' '}
                {popup.data.category}
              </div>
              <div className="col-span-2 mt-1 flex items-center gap-2">
                <span className="font-semibold text-gray-600">Status:</span>
                <StatusBadge
                  label={popup.data.status}
                  variant={getStatusVariant(popup.data.status)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700 text-sm">
                Fee Breakdown
              </span>
              <div className="border rounded-md overflow-hidden bg-white">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2 font-semibold">Fee Head</th>
                      <th className="p-2 font-semibold">Category</th>
                      <th className="p-2 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popup.data.heads.map(h => {
                      const headInfo = feeHeads.find(
                        fh => fh.id === h.feeHeadId
                      );
                      return (
                        <tr
                          key={h.feeHeadId}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2">
                            {headInfo?.name || 'Unknown Head'}
                          </td>
                          <td className="p-2 text-xs text-gray-500">
                            {headInfo?.category}
                          </td>
                          <td className="p-2 text-right font-medium">
                            ₹{h.amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50 font-bold border-t">
                      <td className="p-2" colSpan={2}>
                        Total Fee
                      </td>
                      <td className="p-2 text-right text-green-700">
                        ₹{popup.data.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
