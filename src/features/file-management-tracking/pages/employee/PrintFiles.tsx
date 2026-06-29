import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { FileMovementTimeline, NotesheetViewer } from '../../components';
import { mockDigitalNotings, mockFileMovements, mockFiles } from '../../data';

export default function PrintFiles() {
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const file = mockFiles.find(f => f.id === Number(selectedFileId));

  return (
    <FormPage
      title="Print Files"
      description="Print file details, notesheets, or movement history"
    >
      <FormCard title="Select File">
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
      </FormCard>

      {file && (
        <>
          <FormCard title={`File — ${file.fileNumber}`} className="mt-4">
            <FormGrid>
              <div>
                <span className="text-gray-500">Title:</span> {file.title}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{' '}
                {file.currentStatus}
              </div>
              <div>
                <span className="text-gray-500">Department:</span>{' '}
                {file.departmentName}
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>{' '}
                {file.priorityName}
              </div>
              <div>
                <span className="text-gray-500">Created:</span> {file.createdAt}
              </div>
              <div>
                <span className="text-gray-500">Holder:</span>{' '}
                {file.currentHolderUserName || '—'}
              </div>
            </FormGrid>
            <div className="flex gap-2 mt-4">
              <Button
                label="Print Details"
                icon="print"
                onClick={() => window.print()}
              />
              <Button
                label="Print Notesheet"
                icon="description"
                onClick={() => window.print()}
              />
              <Button
                label="Print History"
                icon="timeline"
                onClick={() => window.print()}
              />
            </div>
          </FormCard>

          <FormCard title="Movement History" className="mt-4">
            <FileMovementTimeline
              movements={mockFileMovements.filter(m => m.fileId === file.id)}
            />
          </FormCard>

          <FormCard title="Digital Notesheet" className="mt-4">
            <NotesheetViewer
              notings={mockDigitalNotings.filter(n => n.fileId === file.id)}
            />
          </FormCard>
        </>
      )}
    </FormPage>
  );
}
