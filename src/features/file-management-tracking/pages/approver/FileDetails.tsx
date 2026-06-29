import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, Tabs } from 'shared/new-components';
import {
  AttachmentVersionViewer,
  ConfidentialityBadge,
  FileMovementTimeline,
  FileStatusBadge,
  NotesheetViewer,
  PriorityBadge,
  QRAccessCodeDisplay,
} from '../../components';
import {
  mockDigitalNotings,
  mockFileAttachments,
  mockFileMovements,
  mockFiles,
  mockUsers,
  type FileMovement,
} from '../../data';

export default function ApproverFileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const file = mockFiles.find(f => f.id === Number(id));
  const approver = mockUsers[4];
  const [remark, setRemark] = useState('');
  const [actionType, setActionType] = useState<string>('Approved');

  if (!file)
    return (
      <FormPage title="File Details">
        <FormCard title="Not Found">
          <div className="text-center text-gray-500 py-8">File not found</div>
        </FormCard>
      </FormPage>
    );

  const movements = mockFileMovements
    .filter(m => m.fileId === file.id)
    .sort(
      (a, b) =>
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    );
  const attachments = mockFileAttachments.filter(
    a => a.fileId === file.id && a.isActive
  );
  const notings = mockDigitalNotings.filter(n => n.fileId === file.id);

  const submitAction = () => {
    const idx = mockFiles.findIndex(f => f.id === file.id);
    if (idx === -1) return;
    if (actionType === 'Approved') mockFiles[idx].currentStatus = 'Approved';
    else if (actionType === 'Rejected')
      mockFiles[idx].currentStatus = 'Rejected';
    else if (actionType === 'Sent Back')
      mockFiles[idx].currentStatus = 'Returned for Clarification';
    else if (actionType === 'Forwarded') {
      mockFiles[idx].currentStatus = 'Forwarded';
      mockFiles[idx].currentHolderUserId = 7;
      mockFiles[idx].currentHolderUserName = 'Registrar Office';
    }

    mockFileMovements.push({
      id: Math.max(...mockFileMovements.map(m => m.id)) + 1,
      fileId: file.id,
      fileNumber: file.fileNumber,
      fromUserId: approver.id,
      fromUserName: approver.name,
      toUserId: file.createdBy,
      toUserName: file.createdByName,
      action: actionType as FileMovement['action'],
      remarks: remark,
      actionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    mockDigitalNotings.push({
      id: Math.max(...mockDigitalNotings.map(n => n.id)) + 1,
      fileId: file.id,
      notingContent: `[${actionType}] ${remark}`,
      notedBy: approver.id,
      notedByName: approver.name,
      notedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    setRemark('');
    navigate('/file-management-tracking/approver/inbox');
  };

  const tabs = [
    {
      title: 'Details',
      content: (
        <FormGrid>
          <div>
            <span className="text-gray-500">File Number:</span>
            <br />
            <span className="font-medium">{file.fileNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Access Code:</span>
            <br />
            <QRAccessCodeDisplay
              fileNumber={file.fileNumber}
              qac={file.quickAccessCode}
            />
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Title:</span>
            <br />
            <span className="font-medium">{file.title}</span>
          </div>
          {file.description && (
            <div className="col-span-2">
              <span className="text-gray-500">Description:</span>
              <br />
              {file.description}
            </div>
          )}
          <div>
            <span className="text-gray-500">Status:</span>
            <br />
            <FileStatusBadge status={file.currentStatus} />
          </div>
          <div>
            <span className="text-gray-500">Priority:</span>
            <br />
            <PriorityBadge priority={file.priorityName} />
          </div>
          <div>
            <span className="text-gray-500">Confidentiality:</span>
            <br />
            <ConfidentialityBadge level={file.confidentialityName} />
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <br />
            {file.departmentName}
          </div>
          <div>
            <span className="text-gray-500">Submitted By:</span>
            <br />
            {file.createdByName}
          </div>
          <div>
            <span className="text-gray-500">Submitted:</span>
            <br />
            {file.createdAt}
          </div>
        </FormGrid>
      ),
    },
    {
      title: 'Movement History',
      content: <FileMovementTimeline movements={movements} />,
    },
    {
      title: 'Attachments',
      content: <AttachmentVersionViewer attachments={attachments} />,
    },
    { title: 'Notesheet', content: <NotesheetViewer notings={notings} /> },
    {
      title: 'Take Action',
      content: (
        <div>
          <DropDownList
            label="Action"
            value={actionType}
            onChange={v => setActionType(v as string)}
            data={['Approved', 'Rejected', 'Sent Back', 'Forwarded'].map(a => ({
              value: a,
              label: a,
            }))}
            textField="label"
            valueField="value"
          />
          <div className="mt-3">
            <TextArea
              label="Remarks / Noting"
              value={remark}
              onChange={v => setRemark(v)}
              placeholder="Add your remarks..."
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button label="Submit" icon="send" onClick={submitAction} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormPage title={`Review — ${file.fileNumber}`} description={file.title}>
      <div className="flex justify-end mb-4">
        <Button
          label="Back to Inbox"
          icon="arrow_back"
          variant="outlined"
          onClick={() => navigate('/file-management-tracking/approver/inbox')}
        />
      </div>
      <Tabs tabs={tabs} />
    </FormPage>
  );
}
