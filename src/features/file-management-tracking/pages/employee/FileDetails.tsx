import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  AttachmentVersionViewer,
  ConfidentialityBadge,
  FileActionButtons,
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
} from '../../data';

export default function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const file = mockFiles.find(f => f.id === Number(id));
  const [remark, setRemark] = useState('');

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
            <span className="text-gray-500">Quick Access Code:</span>
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
            <span className="text-gray-500">Category:</span>
            <br />
            {file.categoryName}
          </div>
          <div>
            <span className="text-gray-500">File Type:</span>
            <br />
            {file.fileTypeName}
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <br />
            {file.departmentName}
          </div>
          <div>
            <span className="text-gray-500">Current Holder:</span>
            <br />
            {file.currentHolderUserName || 'Unassigned'}
          </div>
          <div>
            <span className="text-gray-500">Workflow:</span>
            <br />
            {file.workflowName || 'N/A'}
          </div>
          <div>
            <span className="text-gray-500">Created By:</span>
            <br />
            {file.createdByName}
          </div>
          <div>
            <span className="text-gray-500">Created At:</span>
            <br />
            {file.createdAt}
          </div>
          <div>
            <span className="text-gray-500">Updated At:</span>
            <br />
            {file.updatedAt}
          </div>
          {file.dueDate && (
            <div>
              <span className="text-gray-500">Due Date:</span>
              <br />
              {file.dueDate}
            </div>
          )}
          {file.retentionPeriodYears !== undefined && (
            <div>
              <span className="text-gray-500">Retention:</span>
              <br />
              {file.retentionPeriodYears === 0
                ? 'Permanent'
                : `${file.retentionPeriodYears} years`}
            </div>
          )}
          <div>
            <span className="text-gray-500">Locked:</span>
            <br />
            <StatusBadge
              label={file.isLocked ? 'Yes' : 'No'}
              variant={file.isLocked ? 'rejected' : 'approved'}
            />
          </div>
          <div>
            <span className="text-gray-500">In Abeyance:</span>
            <br />
            <StatusBadge
              label={file.isAbeyance ? 'Yes' : 'No'}
              variant={file.isAbeyance ? 'pending' : 'neutral'}
            />
          </div>
          {file.parentFileNumber && (
            <div>
              <span className="text-gray-500">Part Of:</span>
              <br />
              {file.parentFileNumber}
            </div>
          )}
          {file.mergedIntoFileNumber && (
            <div>
              <span className="text-gray-500">Merged Into:</span>
              <br />
              {file.mergedIntoFileNumber}
            </div>
          )}
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
      title: 'Add Noting',
      content: (
        <div>
          <TextArea
            label="Your noting"
            value={remark}
            onChange={v => setRemark(v)}
            placeholder="Enter your remarks / noting..."
          />
          <div className="flex gap-2 mt-3">
            <Button
              label="Submit Noting"
              icon="note_add"
              onClick={() => {
                setRemark('');
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormPage title={`File — ${file.fileNumber}`} description={file.title}>
      <div className="flex justify-between items-center mb-4">
        <FileActionButtons file={file} />
        <Button
          label="Back"
          icon="arrow_back"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
      </div>
      <Tabs tabs={tabs} />
    </FormPage>
  );
}
