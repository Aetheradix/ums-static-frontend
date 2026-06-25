import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, FormCard, FormPopup, GridPanel } from 'shared/new-components';
import { DropDownList, TextBox, TextArea, FileUpload } from 'shared/components/forms';
import { ToastService } from 'services';

const MOCK_CONTENT = [
  { id: 1, module: 'Programming Basics', topic: 'Variables', title: 'Variables Lecture 1', type: 'Video', duration: '45 mins' },
  { id: 2, module: 'Programming Basics', topic: 'Data Types', title: 'Data Types Cheatsheet', type: 'PDF', duration: '-' },
  { id: 3, module: 'DBMS', topic: 'SQL Basics', title: 'Intro to SQL', type: 'PPT', duration: '-' },
];

export default function ContentUpload() {
  const [data] = useState(MOCK_CONTENT);
  const [popup, setPopup] = useState<{ mode: 'closed' | 'create' }>({ mode: 'closed' });

  const closePopup = () => setPopup({ mode: 'closed' });

  const handleSave = () => {
    ToastService.success(`Content uploaded successfully`);
    closePopup();
  };

  return (
    <FormPage title="Content Upload" description="Upload and manage learning materials for modules.">
      <div className="flex justify-end mb-4">
        <Button label="Upload Content" icon="upload" variant="primary" onClick={() => setPopup({ mode: 'create' })} />
      </div>

      <FormCard title="Module Content">
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'title', header: 'Content Title' },
            { field: 'module', header: 'Module' },
            { field: 'topic', header: 'Topic' },
            { field: 'type', header: 'Content Type' },
            { field: 'duration', header: 'Duration' },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title="Upload Content"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropDownList label="Module" textField="label" data={[{ label: 'Programming Basics', value: 'Programming Basics' }, { label: 'DBMS', value: 'DBMS' }]} required />
          <DropDownList label="Topic" textField="label" data={[{ label: 'Introduction', value: 'Introduction' }, { label: 'Variables', value: 'Variables' }, { label: 'Data Types', value: 'Data Types' }, { label: 'SQL Basics', value: 'SQL Basics' }]} required />
          <DropDownList label="Content Type" textField="label" data={[{ label: 'Video', value: 'Video' }, { label: 'PDF', value: 'PDF' }, { label: 'PPT', value: 'PPT' }, { label: 'Notes', value: 'Notes' }, { label: 'Assignment', value: 'Assignment' }]} required />
          
          <TextBox label="Content Title" required />
          <TextBox label="Duration (if Video/Audio)" />
          
          <div className="md:col-span-2">
            <TextArea label="Description" rows={3} />
          </div>

          <div className="md:col-span-2">
            <FileUpload label="Upload File" onChange={() => {}} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
