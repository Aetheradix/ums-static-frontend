import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import FormPopup from 'shared/new-components/FormPopup';
import { FileStatusBadge, InfoBanner, PriorityBadge } from '../../components';
import {
  mockFileMovements,
  mockFiles,
  mockUsers,
  type FileMovement,
} from '../../data';

export default function Inbox() {
  const navigate = useNavigate();
  const approver = mockUsers[4];
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [remark, setRemark] = useState('');
  const [actionType, setActionType] = useState<string>('Approved');

  const pendingFiles = mockFiles.filter(
    f =>
      f.currentHolderUserId === approver.id &&
      (f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded')
  );
  const selectedFile = pendingFiles.find(f => f.id === selectedFileId);

  const submitAction = () => {
    ToastService.success(`File action submitted successfully.`);
    if (!selectedFile) return;
    const idx = mockFiles.findIndex(f => f.id === selectedFile.id);
    if (idx === -1) return;
    if (actionType === 'Approved') mockFiles[idx].currentStatus = 'Approved';
    else if (actionType === 'Rejected')
      mockFiles[idx].currentStatus = 'Rejected';
    else if (actionType === 'Sent Back')
      mockFiles[idx].currentStatus = 'Returned for Clarification';

    mockFileMovements.push({
      id: Math.max(...mockFileMovements.map(m => m.id)) + 1,
      fileId: selectedFile.id,
      fileNumber: selectedFile.fileNumber,
      fromUserId: approver.id,
      fromUserName: approver.name,
      toUserId: selectedFile.createdBy,
      toUserName: selectedFile.createdByName,
      action: actionType as FileMovement['action'],
      remarks: remark,
      actionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    setSelectedFileId(null);
    setRemark('');
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Approver' },
        { label: 'Approver Inbox' },
      ]}
      title="Approver Inbox"
      description="Review and take action on files"
    >
      <InfoBanner
        title="About Approver Inbox"
        message="Review newly forwarded files that have arrived at your desk and require your immediate attention."
      />
      <div className="mb-6">
        <GridPanel
          title="Pending Files"
          data={pendingFiles}
          columns={
            [
              { field: 'fileNumber', header: 'File #' },
              { field: 'title', header: 'Title' },
              {
                header: 'Priority',
                cell: (row: any) => (
                  <PriorityBadge priority={row.priorityName} />
                ),
              },
              {
                header: 'Status',
                cell: (row: any) => (
                  <FileStatusBadge status={row.currentStatus} />
                ),
              },
              {
                field: 'dueDate',
                header: 'Due',
                cell: (row: any) => (
                  <span className="text-xs">{row.dueDate || '—'}</span>
                ),
              },
              {
                header: 'Actions',
                cell: (row: any) => (
                  <div className="flex gap-1">
                    <Button
                      icon="visibility"
                      label="View"
                      onClick={() =>
                        navigate(
                          `/file-management-tracking/approver/file-details/${row.id}`
                        )
                      }
                    />
                    <Button
                      icon="rate_review"
                      label="Take Action"
                      onClick={() => {
                        setSelectedFileId(row.id);
                      }}
                    />
                  </div>
                ),
              },
            ] as any
          }
          dataKey="id"
          searchBox
          pagination={{ rows: 10 }}
        />
      </div>

      <FormPopup
        visible={!!selectedFile}
        onHide={() => setSelectedFileId(null)}
        title="Take Action"
        subtitle={
          selectedFile
            ? `${selectedFile.fileNumber} — ${selectedFile.title}`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setSelectedFileId(null)}
            />
            <Button label="Submit Action" icon="send" onClick={submitAction} />
          </div>
        }
      >
        <div className="flex flex-col gap-6 py-2">
          <DropDownList
            label="Action"
            value={actionType}
            onChange={v => setActionType(v as string)}
            data={['Approved', 'Rejected', 'Sent Back'].map(a => ({
              value: a,
              label: a,
            }))}
            textField="label"
            valueField="value"
          />
          <TextArea
            label="Remarks"
            value={remark}
            onChange={v => setRemark(v)}
            placeholder="Add detailed remarks or justification..."
            rows={4}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
