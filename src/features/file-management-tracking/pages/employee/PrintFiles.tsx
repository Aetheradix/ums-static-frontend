import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import {
  FileMovementTimeline,
  InfoBanner,
  NotesheetViewer,
} from '../../components';
import { mockDigitalNotings, mockFileMovements, mockFiles } from '../../data';

export default function PrintFiles() {
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const file = mockFiles.find(f => f.id === Number(selectedFileId));

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'Print Files' },
      ]}
      title="Print Files"
      description="Print file details, notesheets, or movement history"
      className="print:p-0 print:bg-white"
    >
      <InfoBanner
        title="About Print Files"
        message="Queue up electronic documents to be officially printed and dispatched as physical hard copies."
      />
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 relative overflow-hidden print:hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="search" className="text-[18px]" />
          </div>
          Select a File to Print
        </h3>
        <div className="max-w-2xl">
          <DropDownList
            label="File"
            value={selectedFileId}
            onChange={v => setSelectedFileId(v as string)}
            data={[
              { value: '', label: 'Select a file...' },
              ...mockFiles.map(f => ({
                value: String(f.id),
                label: `${f.fileNumber} — ${f.title}`,
              })),
            ]}
            textField="label"
            valueField="value"
          />
        </div>
      </div>

      {file && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-80" />
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    File Number
                  </span>
                  <span className="text-lg font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 inline-block">
                    {file.fileNumber}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Status
                  </span>
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                    {file.currentStatus}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Title
                  </span>
                  <span className="text-base font-medium text-gray-800">
                    {file.title}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Department
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {file.departmentName}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Created
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {file.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px] shrink-0 md:border-l md:border-gray-100 md:pl-6 md:mt-0 mt-4 print:hidden">
                <Button
                  label="Print Details"
                  icon="print"
                  onClick={() => window.print()}
                />
                <Button
                  label="Print Notesheet"
                  icon="file"
                  variant="outlined"
                  onClick={() => window.print()}
                />
                <Button
                  label="Print History"
                  icon="history"
                  variant="outlined"
                  onClick={() => window.print()}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 opacity-80 group-hover:bg-teal-600 transition-colors" />
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Icon name="history" className="text-[18px]" />
              </div>
              Movement History
            </h3>
            <FileMovementTimeline
              movements={mockFileMovements.filter(m => m.fileId === file.id)}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-80 group-hover:bg-purple-600 transition-colors" />
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Icon name="file" className="text-[18px]" />
              </div>
              Digital Notesheet
            </h3>
            <NotesheetViewer
              notings={mockDigitalNotings.filter(n => n.fileId === file.id)}
            />
          </div>
        </div>
      )}
    </FormPage>
  );
}
