import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type ProjectDocument,
  projectDocuments as initialData,
  projects,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ProjectDocument }
  | { mode: 'view'; item: ProjectDocument };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const DOC_TYPES = [
  'DPR',
  'Tender',
  'Work Order',
  'Drawing',
  'Bill',
  'Completion Certificate',
  'Inspection Report',
  'Photo',
  'Other',
].map(v => ({ name: v, value: v }));

const EMPTY: Partial<ProjectDocument> = {
  documentName: '',
  projectId: '',
  projectName: '',
  documentType: 'DPR',
  uploadDate: '',
  version: '1.0',
  remarks: '',
};

const DocTypeIcon: Record<string, string> = {
  DPR: 'pi-file-pdf',
  Tender: 'pi-file',
  'Work Order': 'pi-file-edit',
  Drawing: 'pi-image',
  Bill: 'pi-receipt',
  'Completion Certificate': 'pi-verified',
  'Inspection Report': 'pi-search',
  Photo: 'pi-camera',
  Other: 'pi-paperclip',
};

export default function Documents() {
  const [data, setData] = useState<ProjectDocument[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<ProjectDocument>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.documentName) {
      ToastService.error('Document name is required.');
      return;
    }
    if (popup.mode === 'create') {
      const proj = projects.find(p => p.id === form.projectId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          projectName: proj?.name ?? '',
        } as ProjectDocument,
      ]);
      ToastService.success('Document uploaded.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as ProjectDocument)
            : d
        )
      );
      ToastService.success('Document updated.');
    }
    close();
  };

  const handleDelete = (item: ProjectDocument) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Document deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Documents"
      description="Store and manage all project-related documents and files."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Documents' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'documentName',
              header: 'Document',
              cell: (item: ProjectDocument) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <i
                    className={`pi ${DocTypeIcon[item.documentType] ?? 'pi-file'}`}
                    style={{ color: '#3b82f6', fontSize: '1rem' }}
                  />
                  <span>{item.documentName}</span>
                </div>
              ),
            },
            { field: 'projectName', header: 'Project' },
            { field: 'documentType', header: 'Type' },
            { field: 'uploadDate', header: 'Upload Date' },
            { field: 'version', header: 'Version' },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: ProjectDocument) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="download"
                    variant="outlined"
                    onClick={() => ToastService.success('Download started.')}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="trash"
                    variant="danger"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Upload Document"
              icon="upload"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search documents..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Upload Document'
            : popup.mode === 'edit'
              ? 'Edit Document'
              : 'View Document'
        }
        subtitle="Project document details and file information."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.projectId}
            onChange={v => setForm(f => ({ ...f, projectId: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Document Type"
            data={DOC_TYPES}
            textField="name"
            optionValue="value"
            value={form.documentType}
            onChange={v => setForm(f => ({ ...f, documentType: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextBox
          label="Document Name / File Name"
          placeholder="e.g. DPR_LibraryExtension_v1.pdf"
          value={form.documentName ?? ''}
          onChange={v => setForm(f => ({ ...f, documentName: v }))}
          required
          disabled={isReadOnly}
        />
        <FormGrid columns={2}>
          <DatePicker
            label="Upload Date"
            value={form.uploadDate ? new Date(form.uploadDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                uploadDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <TextBox
            label="Version"
            placeholder="e.g. 1.0"
            value={form.version ?? ''}
            onChange={v => setForm(f => ({ ...f, version: v }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Remarks"
          placeholder="Document description or notes"
          value={form.remarks ?? ''}
          onChange={v => setForm(f => ({ ...f, remarks: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Upload' : 'Update'}
              variant="primary"
              icon="upload"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
