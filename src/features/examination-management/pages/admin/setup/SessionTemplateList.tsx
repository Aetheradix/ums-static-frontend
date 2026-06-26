import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useSessionTemplatesQuery } from '../../../queries';
import SessionTemplateForm from '../../../components/SessionTemplateForm';

export default function SessionTemplateList() {
  const { data, isLoading } = useSessionTemplatesQuery();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleOpenPopup = (template: any = null) => {
    setSelectedTemplate(template);
    setShowPopup(true);
  };

  return (
    <FormPage
      title="Session Templates"
      description="Manage examination session templates mapped to academic years"
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
              icon="plus"
              onClick={() => handleOpenPopup()}
            />
          }
          columns={[
            { field: 'code', header: 'Code' },
            { field: 'templateName', header: 'Template Name' },
            { field: 'applicableYear', header: 'Applicable Year' },
            { field: 'applicableCycleName', header: 'Cycle' },
            {
              header: 'Default',
              cell: (item: Examination.SessionTemplateItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.isDefault ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {item.isDefault ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: Examination.SessionTemplateItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.SessionTemplateItem) => (
                <Button
                  icon="pencil"
                  variant="text"
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
            selectedTemplate ? 'Edit Session Template' : 'Add Session Template'
          }
        >
          <SessionTemplateForm
            initialData={selectedTemplate}
            onClose={() => setShowPopup(false)}
          />
        </FormPopup>
      )}
    </FormPage>
  );
}
