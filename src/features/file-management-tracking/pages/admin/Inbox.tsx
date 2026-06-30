import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { FileStatusBadge, PriorityBadge } from '../../components';
import {
  mockDigitalNotings,
  mockFileMovements,
  mockFiles,
  mockUsers,
  type FileMovement,
} from '../../data';

const adminActions = [
  'Forward',
  'Approve',
  'Reject',
  'Sent Back',
  'Put On Hold',
  'Reassigned',
  'Close',
  'Archive',
  'Revoke',
];

export default function Inbox() {
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [remark, setRemark] = useState('');
  const [actionType, setActionType] = useState('Forward');
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'danger';
    message: string;
  } | null>(null);
  const adminUser = mockUsers[0];
  const needsTarget = actionType === 'Forward' || actionType === 'Reassigned';

  const activeFiles = mockFiles.filter(
    f =>
      !['Closed', 'Archived', 'Approved', 'Rejected'].includes(f.currentStatus)
  );
  const selectedFile = activeFiles.find(f => f.id === selectedFileId);

  const showToast = (type: 'success' | 'danger', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const closePopup = () => {
    setSelectedFileId(null);
    setRemark('');
    setTargetUserId(null);
    setActionType('Forward');
  };

  const submitAction = () => {
    if (!selectedFile) return;
    const idx = mockFiles.findIndex(f => f.id === selectedFile.id);
    if (idx === -1) return;

    const toUser =
      needsTarget && targetUserId
        ? mockUsers.find(u => u.id === targetUserId)
        : undefined;
    let newStatus = selectedFile.currentStatus;

    switch (actionType) {
      case 'Forward':
        newStatus = 'Forwarded';
        break;
      case 'Approve':
        newStatus = 'Approved';
        break;
      case 'Reject':
        newStatus = 'Rejected';
        break;
      case 'Sent Back':
        newStatus = 'Returned for Clarification';
        break;
      case 'Put On Hold':
        newStatus = 'On Hold';
        break;
      case 'Close':
        newStatus = 'Closed';
        break;
      case 'Archive':
        newStatus = 'Archived';
        break;
      case 'Revoke':
        newStatus = 'Draft';
        break;
    }

    mockFiles[idx].currentStatus = newStatus;
    if (toUser) {
      mockFiles[idx].currentHolderUserId = toUser.id;
      mockFiles[idx].currentHolderUserName = toUser.name;
    }
    if (actionType === 'Revoke') {
      mockFiles[idx].currentHolderUserId = selectedFile.createdBy;
      mockFiles[idx].currentHolderUserName = selectedFile.createdByName;
    }

    const newMovementId = Math.max(...mockFileMovements.map(m => m.id), 0) + 1;
    mockFileMovements.push({
      id: newMovementId,
      fileId: selectedFile.id,
      fileNumber: selectedFile.fileNumber,
      fromUserId: adminUser.id,
      fromUserName: adminUser.name,
      toUserId: toUser?.id ?? selectedFile.createdBy,
      toUserName: toUser?.name ?? selectedFile.createdByName,
      action: actionType as FileMovement['action'],
      remarks: remark,
      actionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    const newNotingId = Math.max(...mockDigitalNotings.map(n => n.id), 0) + 1;
    mockDigitalNotings.push({
      id: newNotingId,
      fileId: selectedFile.id,
      notingContent: `[${actionType}] ${remark}`,
      notedBy: adminUser.id,
      notedByName: adminUser.name,
      notedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    showToast(
      'success',
      `File ${selectedFile.fileNumber} — ${actionType} successfully`
    );
    closePopup();
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'File Inbox' },
      ]}
      title="File Inbox"
      description="Review and process all system files"
    >
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-xs text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {toast.message}
        </div>
      )}

      <GridPanel
        title="Active Files"
        data={activeFiles}
        columns={
          [
            {
              field: 'fileNumber',
              header: 'File #',
              cell: (row: any) => (
                <span className="text-xs font-medium whitespace-nowrap">
                  {row.fileNumber}
                </span>
              ),
            },
            {
              field: 'title',
              header: 'Title',
              cell: (row: any) => (
                <span className="text-xs truncate block max-w-[220px]">
                  {row.title}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (row: any) => (
                <FileStatusBadge status={row.currentStatus} />
              ),
            },
            {
              header: 'Priority',
              cell: (row: any) => <PriorityBadge priority={row.priorityName} />,
            },
            {
              field: 'currentHolderUserName',
              header: 'Holder',
              cell: (row: any) => (
                <span className="text-xs">
                  {row.currentHolderUserName || '—'}
                </span>
              ),
            },
            {
              field: 'dueDate',
              header: 'Due',
              cell: (row: any) => (
                <span className="text-xs whitespace-nowrap">
                  {row.dueDate || '—'}
                </span>
              ),
            },
            {
              header: 'Action',
              cell: (row: any) => (
                <Button
                  icon="rate_review"
                  size="small"
                  onClick={() => {
                    setSelectedFileId(row.id);
                    setTargetUserId(null);
                    setActionType('Forward');
                    setRemark('');
                  }}
                  label="Take Action"
                />
              ),
            },
          ] as any
        }
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
      />

      {selectedFile && (
        <FormPopup
          visible
          onHide={closePopup}
          title={`Action — ${selectedFile.fileNumber}`}
          size="default"
        >
          <p className="text-sm text-gray-500 mb-4">{selectedFile.title}</p>
          <FormGrid>
            <DropDownList
              label="Action"
              value={actionType}
              onChange={v => {
                setActionType(v as string);
                setTargetUserId(null);
              }}
              data={adminActions.map(a => ({ value: a, label: a }))}
              textField="label"
              valueField="value"
            />
            {needsTarget && (
              <DropDownList
                label={actionType === 'Forward' ? 'Forward To' : 'Reassign To'}
                value={String(targetUserId || '')}
                onChange={v => setTargetUserId(Number(v))}
                data={[
                  { value: '', label: 'Select User...' },
                  ...mockUsers
                    .filter(u => u.isActive)
                    .map(u => ({
                      value: String(u.id),
                      label: `${u.name} (${u.departmentName || 'N/A'})`,
                    })),
                ]}
                textField="label"
                valueField="value"
              />
            )}
            <div className={needsTarget ? '' : 'col-span-2'}>
              <TextArea
                label="Remarks / Noting"
                value={remark}
                onChange={v => setRemark(v)}
                placeholder="Add remarks..."
              />
            </div>
          </FormGrid>
          <div className="flex justify-end gap-2 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button
              label="Submit"
              icon="send"
              onClick={submitAction}
              disabled={needsTarget && !targetUserId}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
