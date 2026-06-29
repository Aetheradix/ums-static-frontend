import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { FileStatusBadge, PriorityBadge } from '../../components';
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
      title="Approver Inbox"
      description="Review and take action on files"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
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
                        variant="text"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/file-management-tracking/approver/file-details/${row.id}`
                          )
                        }
                      />
                      <Button
                        icon="rate_review"
                        variant="text"
                        size="small"
                        onClick={() => {
                          setSelectedFileId(row.id);
                        }}
                        tooltip="Take Action"
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

        <div>
          {selectedFile ? (
            <FormCard
              title="Take Action"
              subtitle={`${selectedFile.fileNumber} — ${selectedFile.title}`}
            >
              <div className="flex flex-col gap-3">
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
                  placeholder="Add remarks..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button label="Submit" icon="send" onClick={submitAction} />
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => setSelectedFileId(null)}
                />
              </div>
            </FormCard>
          ) : (
            <FormCard title="Take Action">
              <div className="text-center text-sm text-gray-400 py-4">
                Select a file to take action
              </div>
            </FormCard>
          )}
        </div>
      </div>
    </FormPage>
  );
}
