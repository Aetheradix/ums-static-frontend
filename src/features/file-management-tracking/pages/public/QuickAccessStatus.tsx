import { useParams } from 'react-router-dom';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { FileMovementTimeline, FileStatusBadge } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function QuickAccessStatus() {
  const { code } = useParams();
  const file = mockFiles.find(
    f => f.quickAccessCode.toLowerCase() === (code || '').toLowerCase()
  );

  if (!file) {
    return (
      <FormPage
        title="Quick Access"
        description="Track file status using quick access code"
      >
        <FormCard title="File Not Found">
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">🔍</span>
            <p>
              No file found with access code: <strong>{code}</strong>
            </p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const movements = mockFileMovements
    .filter(m => m.fileId === file.id)
    .sort(
      (a, b) =>
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    );

  return (
    <FormPage
      title="Quick Access — File Status"
      description="Public file tracking"
    >
      <FormCard title={`${file.fileNumber} — ${file.title}`}>
        <FormGrid>
          <div>
            <span className="text-gray-500">Status:</span>
            <br />
            <FileStatusBadge status={file.currentStatus} />
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <br />
            {file.departmentName}
          </div>
          <div>
            <span className="text-gray-500">Category:</span>
            <br />
            {file.categoryName}
          </div>
          <div>
            <span className="text-gray-500">Last Updated:</span>
            <br />
            {file.updatedAt}
          </div>
          <div>
            <span className="text-gray-500">Current Holder:</span>
            <br />
            {file.currentHolderUserName || 'Unassigned'}
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <br />
            {file.createdAt}
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Movement History" className="mt-4">
        <FileMovementTimeline movements={movements} />
      </FormCard>
    </FormPage>
  );
}
