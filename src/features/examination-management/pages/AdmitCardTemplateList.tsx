import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useAdmitCardTemplatesQuery } from '../queries';
import AdmitCardTemplateForm from '../components/AdmitCardTemplateForm';

export default function AdmitCardTemplateList() {
  const { data, isLoading } = useAdmitCardTemplatesQuery();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleOpenPopup = (template: any = null) => {
    setSelectedTemplate(template);
    setShowPopup(true);
  };

  return (
    <FormPage
      title="Admit Card Templates"
      description="Manage admit card / hall ticket templates"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search templates..."
          toolbar={
            <Button
              label="Add Template"
              icon="pi-plus"
              onClick={() => handleOpenPopup()}
            />
          }
          columns={[
            { field: 'templateCode', header: 'Code' },
            { field: 'templateName', header: 'Template Name' },
            { field: 'applicableCycleName', header: 'Applicable Cycle' },
            { field: 'applicableFromYear', header: 'Applicable From Year' },
            { field: 'orientation', header: 'Orientation' },
            {
              header: 'Default',
              cell: (item: Examination.AdmitCardTemplateItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isDefault
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.isDefault ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: Examination.AdmitCardTemplateItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.AdmitCardTemplateItem) => (
                <Button
                  icon="pi-pencil"
                  className="p-button-sm p-button-text"
                  tooltip="Edit Template"
                  onClick={() => handleOpenPopup(item)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      {showPopup && (
        <FormPopup
          visible
          onHide={() => setShowPopup(false)}
          title={
            selectedTemplate
              ? 'Edit Admit Card Template'
              : 'Add Admit Card Template'
          }
        >
          <AdmitCardTemplateForm
            initialData={selectedTemplate}
            onClose={() => setShowPopup(false)}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
