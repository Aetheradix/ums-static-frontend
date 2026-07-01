import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { learningUrls } from '../../urls';

const INITIAL_MATERIALS = [
  { id: 1, title: 'C++ Pointers Lecture', type: 'Video', module: 'Programming Basics', topic: 'Introduction to C++', date: '2026-06-25', status: 'Published' },
  { id: 2, title: 'C++ OOP Concepts Slide Deck', type: 'PPT', module: 'Programming Basics', topic: 'Variables & Data Types', date: '2026-06-28', status: 'Published' },
  { id: 3, title: 'Pointer Arithmetic Reference Sheet', type: 'PDF', module: 'Programming Basics', topic: 'Introduction to C++', date: '2026-06-29', status: 'Published' },
  { id: 4, title: 'Structure vs Class Differences', type: 'Notes', module: 'Programming Basics', topic: 'Variables & Data Types', date: '2026-06-30', status: 'Published' },
  { id: 5, title: 'Assignment 2: Pointer Reversals', type: 'Assignment', module: 'Programming Basics', topic: 'Introduction to C++', date: '2026-07-01', status: 'Draft' },
];

export default function ManageMaterials() {
  const [data, setData] = useState(INITIAL_MATERIALS);
  const [filterType, setFilterType] = useState<string>('All');
  const [popup, setPopup] = useState<{ mode: 'closed' | 'edit'; item?: any }>({ mode: 'closed' });

  const filteredData = filterType === 'All' ? data : data.filter(item => item.type === filterType);

  const handleToggleStatus = (item: any) => {
    setData(prev => prev.map(m => m.id === item.id ? { ...m, status: m.status === 'Published' ? 'Draft' : 'Published' } : m));
    ToastService.success('Material status updated.');
  };

  const handleEdit = (item: any) => {
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    ToastService.success('Material details updated successfully.');
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Manage Learning Materials"
      description="View, organize, and edit uploaded Videos, PDFs, Notes, PPTs, and Assignments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Content Management', to: learningUrls.teacher.content },
        { label: 'Manage Materials' },
      ]}
    >
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['All', 'Video', 'PDF', 'Notes', 'PPT', 'Assignment'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      <FormCard>
        <GridPanel
          data={filteredData}
          loading={false}
          onEdit={handleEdit}
          columns={[
            { field: 'title', header: 'Title' },
            { field: 'type', header: 'Type' },
            { field: 'module', header: 'Module' },
            { field: 'topic', header: 'Topic' },
            { field: 'date', header: 'Upload Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`px-2 py-0.5 rounded text-xxs font-semibold cursor-pointer ${
                    item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.status}
                </button>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Edit Learning Material"
      >
        <div className="grid grid-cols-1 gap-4">
          <TextBox label="Title" defaultValue={popup.item?.title} required />
          <DropDownList
            label="Type"
            defaultValue={popup.item?.type}
            data={[
              { label: 'Video', value: 'Video' },
              { label: 'PDF', value: 'PDF' },
              { label: 'Notes', value: 'Notes' },
              { label: 'PPT', value: 'PPT' },
              { label: 'Assignment', value: 'Assignment' },
            ]}
            textField="label"
            required
          />
          <TextBox label="Module" defaultValue={popup.item?.module} required />
          <TextBox label="Topic" defaultValue={popup.item?.topic} required />
          <Button
            label="Save Changes"
            variant="primary"
            className="w-full mt-2"
            onClick={handleSave}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
