import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { Modal } from 'shared/components/popups';
import {
  TextBox,
  DropDownList,
  Checkbox as SharedCheckbox,
} from 'shared/components/forms';
import { ToastService } from 'services';

interface RequiredDocument {
  id: string;
  name: string;
  documentType: string;
  isMandatory: boolean;
  maxSizeMB: number;
  status: 'Active' | 'Inactive';
}

const mockDocs: RequiredDocument[] = [
  {
    id: 'DOC-01',
    name: '10th Marksheet',
    documentType: 'PDF/JPEG',
    isMandatory: true,
    maxSizeMB: 2,
    status: 'Active',
  },
  {
    id: 'DOC-02',
    name: '12th Marksheet',
    documentType: 'PDF/JPEG',
    isMandatory: true,
    maxSizeMB: 2,
    status: 'Active',
  },
  {
    id: 'DOC-03',
    name: 'Aadhar Card',
    documentType: 'PDF',
    isMandatory: true,
    maxSizeMB: 1,
    status: 'Active',
  },
  {
    id: 'DOC-04',
    name: 'Migration Certificate',
    documentType: 'PDF',
    isMandatory: false,
    maxSizeMB: 5,
    status: 'Active',
  },
];

export default function DocumentMaster() {
  const [documents, setDocuments] = useState<RequiredDocument[]>(mockDocs);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Partial<RequiredDocument>>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: RequiredDocument) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const mandatoryTemplate = (rowData: RequiredDocument) => {
    return rowData.isMandatory ? (
      <Tag value="Required" severity="warning" />
    ) : (
      <Tag value="Optional" severity="info" />
    );
  };

  const actionTemplate = (rowData: RequiredDocument) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Document"
        onClick={() => {
          setSelectedDoc({ ...rowData });
          setShowDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        aria-label="Delete"
        tooltip="Delete Document"
        onClick={() => {
          setDocuments(documents.filter(d => d.id !== rowData.id));
          ToastService.success('Document removed successfully.');
        }}
      />
    </div>
  );

  const handleSave = () => {
    if (selectedDoc.id) {
      setDocuments(
        documents.map(d =>
          d.id === selectedDoc.id
            ? ({ ...d, ...selectedDoc } as RequiredDocument)
            : d
        )
      );
      ToastService.success('Document updated successfully.');
    } else {
      const newDoc: RequiredDocument = {
        ...(selectedDoc as RequiredDocument),
        id: `DOC-0${Math.floor(Math.random() * 10) + 5}`,
        status: selectedDoc.status || 'Active',
        isMandatory: selectedDoc.isMandatory || false,
      };
      setDocuments([newDoc, ...documents]);
      ToastService.success('Document added successfully.');
    }
    setShowDialog(false);
    setSelectedDoc({});
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <TextBox
          placeholder="Search documents..."
          className="w-full md:w-80"
          onChange={v => setGlobalFilter(v as string)}
        />
      </span>
      <Button
        label="New Document"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedDoc({ maxSizeMB: 2, isMandatory: true });
          setShowDialog(true);
        }}
      />
    </div>
  );

  // Footer is inline

  return (
    <FormPage
      title="Document Master"
      description="Configure required documents for student admission and verifications"
    >
      <FormCard>
        <DataTable
          value={documents}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No documents found."
          stripedRows
          rowHover
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header="Document Name"
            sortable
            className="font-semibold text-gray-800"
          ></Column>
          <Column
            field="documentType"
            header="Format Allowed"
            sortable
          ></Column>
          <Column
            field="isMandatory"
            header="Requirement"
            body={mandatoryTemplate}
            sortable
          ></Column>
          <Column field="maxSizeMB" header="Max Size (MB)" sortable></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
          ></Column>
          <Column
            body={actionTemplate}
            header="Actions"
            exportable={false}
            style={{ minWidth: '8rem' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Modal
        visible={showDialog}
        size="medium"
        header={selectedDoc.id ? 'Edit Document Config' : 'New Document Config'}
        onHide={() => setShowDialog(false)}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <TextBox
                label="Document Name *"
                value={selectedDoc.name || ''}
                onChange={v =>
                  setSelectedDoc({ ...selectedDoc, name: v as string })
                }
                placeholder="e.g. 10th Marksheet"
              />
            </div>

            <div className="col-span-1">
              <DropDownList
                label="Allowed Format"
                value={selectedDoc.documentType}
                data={[
                  { label: 'PDF', value: 'PDF' },
                  { label: 'JPEG/PNG', value: 'JPEG/PNG' },
                  { label: 'PDF/JPEG', value: 'PDF/JPEG' },
                ]}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setSelectedDoc({ ...selectedDoc, documentType: v })
                }
                defaultOptionText="Select Format"
              />
            </div>

            <div className="col-span-1">
              <DropDownList
                label="Max Size"
                value={selectedDoc.maxSizeMB}
                data={[
                  { label: '1 MB', value: 1 },
                  { label: '2 MB', value: 2 },
                  { label: '5 MB', value: 5 },
                  { label: '10 MB', value: 10 },
                ]}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setSelectedDoc({ ...selectedDoc, maxSizeMB: v })
                }
                defaultOptionText="Select Size"
              />
            </div>

            <div className="col-span-1 md:col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <SharedCheckbox
                label="This document is mandatory for admission"
                checked={selectedDoc.isMandatory || false}
                onChange={v =>
                  setSelectedDoc({ ...selectedDoc, isMandatory: v })
                }
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <DropDownList
                label="Status"
                value={selectedDoc.status || 'Active'}
                data={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setSelectedDoc({
                    ...selectedDoc,
                    status: v as 'Active' | 'Inactive',
                  })
                }
                defaultOptionText="Select Status"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              text
              severity="secondary"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save Document"
              icon="pi pi-check"
              onClick={handleSave}
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
