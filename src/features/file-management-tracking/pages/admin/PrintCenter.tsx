import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  FileMovementTimeline,
  FileStatusBadge,
  NotesheetViewer,
} from '../../components';
import { mockDigitalNotings, mockFileMovements, mockFiles } from '../../data';

export default function PrintCenter() {
  const [searchId, setSearchId] = useState('');
  const file = searchId.trim()
    ? mockFiles.find(
        f =>
          f.fileNumber.toLowerCase().includes(searchId.toLowerCase()) ||
          f.id === Number(searchId)
      )
    : undefined;

  const printSection = (html: string, title: string) => {
    const win = window.open('', '', 'width=800,height=600');
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#333}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}</style></head><body>${html}</body></html>`
    );
    win.document.close();
    win.print();
  };

  return (
    <FormPage
      title="Print Center"
      description="Print any file details, notesheet, or history"
    >
      <FormCard title="Search File">
        <div className="flex gap-2 items-end">
          <TextBox
            label="File Number or ID"
            value={searchId}
            onChange={v => setSearchId(v)}
            placeholder="e.g., UMS/CS/2026/001"
            className="flex-1"
          />
        </div>
      </FormCard>

      {file && (
        <>
          <FormCard
            title={`File Details — ${file.fileNumber}`}
            className="mt-4"
          >
            <FormGrid>
              <div>
                <span className="text-gray-500">Subject:</span>{' '}
                <span className="font-medium">{file.title}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{' '}
                <FileStatusBadge status={file.currentStatus} />
              </div>
              <div>
                <span className="text-gray-500">Department:</span>{' '}
                {file.departmentName}
              </div>
              <div>
                <span className="text-gray-500">Current Holder:</span>{' '}
                {file.currentHolderUserName || '—'}
              </div>
              <div>
                <span className="text-gray-500">Created By:</span>{' '}
                {file.createdByName}
              </div>
              <div>
                <span className="text-gray-500">Created:</span> {file.createdAt}
              </div>
            </FormGrid>
            <div className="flex gap-2 mt-4">
              <Button
                label="Print Details"
                icon="print"
                onClick={() =>
                  printSection(
                    `<h1>File Details — ${file.fileNumber}</h1><table><tr><td>Subject</td><td>${file.title}</td></tr><tr><td>Status</td><td>${file.currentStatus}</td></tr><tr><td>Department</td><td>${file.departmentName}</td></tr><tr><td>Current Holder</td><td>${file.currentHolderUserName || '—'}</td></tr><tr><td>Created By</td><td>${file.createdByName}</td></tr><tr><td>Created</td><td>${file.createdAt}</td></tr></table>`,
                    `File Details - ${file.fileNumber}`
                  )
                }
              />
              <Button
                label="Print Notesheet"
                icon="print"
                onClick={() =>
                  printSection(
                    `<h1>Digital Notesheet — ${file.fileNumber}</h1>${mockDigitalNotings
                      .filter(n => n.fileId === file.id)
                      .map(
                        n =>
                          `<div style="margin-bottom:12px;border-bottom:1px solid #ddd;padding-bottom:8px"><p><strong>${n.notedByName}</strong> <span style="color:#888;font-size:12px">${n.notedAt}</span></p><p>${n.notingContent}</p></div>`
                      )
                      .join('')}`,
                    `Notesheet - ${file.fileNumber}`
                  )
                }
              />
              <Button
                label="Print History"
                icon="print"
                onClick={() =>
                  printSection(
                    `<h1>Movement History — ${file.fileNumber}</h1>${mockFileMovements
                      .filter(m => m.fileId === file.id)
                      .map(
                        m =>
                          `<div style="margin-bottom:8px;border-bottom:1px solid #eee;padding-bottom:4px"><strong>${m.action}</strong> — ${m.fileNumber} <span style="color:#888;font-size:12px">${m.actionDate}</span><br/><span style="color:#555">${m.remarks || ''}</span></div>`
                      )
                      .join('')}`,
                    `History - ${file.fileNumber}`
                  )
                }
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
