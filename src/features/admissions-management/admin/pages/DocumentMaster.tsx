import { useState } from 'react';
import {
  FormPage,
  FormCard,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
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

  const statusTemplate = (rowData: RequiredDocument) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const mandatoryTemplate = (rowData: RequiredDocument) => {
    return rowData.isMandatory ? (
      <StatusBadge label="Required" variant="warning" />
    ) : (
      <StatusBadge label="Optional" variant="info" />
    );
  };

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

  const toolbar = (
    <Button
      label="New Document"
      icon="pi pi-plus"
      onClick={() => {
        setSelectedDoc({ maxSizeMB: 2, isMandatory: true });
        setShowDialog(true);
      }}
    />
  );

  // Footer is inline

  return (
    <FormPage
      title="Document Master"
      description="Configure required documents for student admission and verifications"
    >
      <FormCard>
        <GridPanel
          data={documents}
          searchBox={true}
          searchFields={['name', 'documentType', 'status']}
          toolbar={toolbar}
          onEdit={(rowData: RequiredDocument) => {
            setSelectedDoc({ ...rowData });
            setShowDialog(true);
          }}
          onRemove={(rowData: RequiredDocument) => {
            setDocuments(documents.filter(d => d.id !== rowData.id));
            ToastService.success('Document removed successfully.');
          }}
          columns={[
            { field: 'name', header: 'Document Name', sortable: true },
            { field: 'documentType', header: 'Format Allowed', sortable: true },
            {
              field: 'isMandatory',
              header: 'Requirement',
              cell: mandatoryTemplate,
              sortable: true,
            },
            { field: 'maxSizeMB', header: 'Max Size (MB)', sortable: true },
            {
              field: 'status',
              header: 'Status',
              cell: statusTemplate,
              sortable: true,
            },
          ]}
        />
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
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save Document"
              icon="pi pi-check"
              onClick={handleSave}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
