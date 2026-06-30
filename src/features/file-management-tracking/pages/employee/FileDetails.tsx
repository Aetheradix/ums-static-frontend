import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { FormCard, FormPage, StatusBadge, Tabs } from 'shared/new-components';
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
      <FormPage
        breadcrumbs={[
          {
            label: 'File Management Tracking',
            to: '/home/sub-menu/file-management-tracking',
          },
          { label: 'Employee' },
          { label: 'File Details' },
        ]}
        title="File Details"
      >
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
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-80" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block flex items-center gap-1">
                  <Icon name="tag" className="text-[14px]" /> File Number
                </span>
                <span className="text-lg font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 inline-block">
                  {file.fileNumber}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block flex items-center gap-1">
                  <Icon name="qr_code" className="text-[14px]" /> Quick Access
                  Code
                </span>
                <QRAccessCodeDisplay
                  fileNumber={file.fileNumber}
                  qac={file.quickAccessCode}
                />
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Title
                </span>
                <span className="text-base font-medium text-gray-800">
                  {file.title}
                </span>
              </div>
              {file.description && (
                <div className="md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Description
                  </span>
                  <span className="text-sm text-gray-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100 block">
                    {file.description}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status & Attributes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-80 group-hover:bg-purple-600 transition-colors" />
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Icon name="info" className="text-[18px]" />
                </div>
                Attributes & Status
              </h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Status
                  </span>
                  <FileStatusBadge status={file.currentStatus} />
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Priority
                  </span>
                  <PriorityBadge priority={file.priorityName} />
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Confidentiality
                  </span>
                  <ConfidentialityBadge level={file.confidentialityName} />
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Category
                  </span>
                  <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {file.categoryName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm font-medium text-gray-500">
                    File Type
                  </span>
                  <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {file.fileTypeName}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking & Lifecycle */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 opacity-80 group-hover:bg-teal-600 transition-colors" />
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Icon name="history" className="text-[18px]" />
                </div>
                Lifecycle & Assignment
              </h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Department
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {file.departmentName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Current Holder
                  </span>
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {file.currentHolderUserName || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Workflow
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {file.workflowName || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Created At
                  </span>
                  <span className="text-sm font-bold text-gray-600">
                    {file.createdAt}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">
                    Updated At
                  </span>
                  <span className="text-sm font-bold text-gray-600">
                    {file.updatedAt}
                  </span>
                </div>
                {file.dueDate && (
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">
                      Due Date
                    </span>
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      {file.dueDate}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm font-medium text-gray-500">
                    Created By
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {file.createdByName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer states */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-wrap gap-6 items-center justify-center text-center">
            <div className="px-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Retention
              </span>
              <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {file.retentionPeriodYears === 0
                  ? 'Permanent'
                  : `${file.retentionPeriodYears} years`}
              </span>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="px-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Locked
              </span>
              <StatusBadge
                label={file.isLocked ? 'Yes' : 'No'}
                variant={file.isLocked ? 'rejected' : 'approved'}
              />
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="px-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                In Abeyance
              </span>
              <StatusBadge
                label={file.isAbeyance ? 'Yes' : 'No'}
                variant={file.isAbeyance ? 'pending' : 'neutral'}
              />
            </div>
            {file.parentFileNumber && (
              <>
                <div className="h-10 w-px bg-gray-200" />
                <div className="px-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                    Part Of
                  </span>
                  <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {file.parentFileNumber}
                  </span>
                </div>
              </>
            )}
            {file.mergedIntoFileNumber && (
              <>
                <div className="h-10 w-px bg-gray-200" />
                <div className="px-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                    Merged Into
                  </span>
                  <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {file.mergedIntoFileNumber}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
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
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-3xl">
          <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Icon name="edit_note" className="text-[18px]" />
            </div>
            Write a New Noting
          </h3>
          <TextArea
            value={remark}
            onChange={v => setRemark(v)}
            placeholder="Enter your remarks / noting here..."
          />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button
              label="Clear"
              variant="outlined"
              icon="times"
              onClick={() => setRemark('')}
            />
            <Button
              label="Submit Noting"
              icon="send"
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
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'File — ...' },
      ]}
      title={`File — ${file.fileNumber}`}
      description={file.title}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            label="Back"
            icon="arrow-left"
            variant="outlined"
            onClick={() => navigate(-1)}
          />
        </div>
        <FileActionButtons file={file} />
      </div>
      <Tabs tabs={tabs} />
    </FormPage>
  );
}
