import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockSubCategories, mockCategories } from '../../mockdata';
import type { SubCategory } from '../../types';
import StatusButton from 'shared/components/buttons/StatusButton';
import { ToastService } from 'services';

export default function SubPublishingCategoriesList() {
  const [subCategories, setSubCategories] =
    useState<SubCategory[]>(mockSubCategories);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: SubCategory;
  }>({ mode: 'closed' });
  const [formData, setFormData] = useState({
    parentId: mockCategories[0].id,
    title: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleOpenAdd = () => {
    setFormData({
      parentId: mockCategories[0].id,
      title: '',
      description: '',
      status: 'Active',
    });
    setPopup({ mode: 'add' });
  };

  const handleOpenEdit = (item: SubCategory) => {
    setFormData({
      parentId: item.parentId,
      title: item.title,
      description: item.description || '',
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      ToastService.error('Sub-category title is required.');
      return;
    }

    const parentCat = mockCategories.find(
      c => c.id === Number(formData.parentId)
    );
    const parentTitle = parentCat ? parentCat.title : '';

    if (popup.mode === 'add') {
      const newSub: SubCategory = {
        id: subCategories.length + 1,
        parentId: Number(formData.parentId),
        parentTitle,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        createdBy: 'CFS Admin',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setSubCategories([...subCategories, newSub]);
      ToastService.success('Sub-category added successfully.');
    } else if (popup.mode === 'edit' && popup.item) {
      setSubCategories(
        subCategories.map(s =>
          s.id === popup.item!.id
            ? {
                ...s,
                parentId: Number(formData.parentId),
                parentTitle,
                title: formData.title,
                description: formData.description,
                status: formData.status,
              }
            : s
        )
      );
      ToastService.success('Sub-category updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      setSubCategories(subCategories.filter(s => s.id !== id));
      ToastService.success('Sub-category deleted successfully.');
    }
  };

  return (
    <FormPage
      title="Sub Publishing Categories"
      description="Manage granular sub-categories nesting under top-level classifications."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Settings', to: cfsUrls.admin.settings.hub },
        { label: 'Sub Publishing Categories' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={subCategories}
          loading={false}
          onEdit={handleOpenEdit}
          onRemove={item => handleDelete(item.id)}
          searchBox
          pagination={{ rows: 10 }}
          toolbar={
            <Button
              label="Add Sub-Category"
              icon="plus"
              variant="primary"
              onClick={handleOpenAdd}
            />
          }
          columns={[
            { field: 'id', header: '#', width: '60px' },
            { field: 'title', header: 'Sub-Category Title', sortable: true },
            { field: 'parentTitle', header: 'Parent Category', sortable: true },
            { field: 'description', header: 'Description', sortable: true },
            {
              field: 'status',
              header: 'Status',
              sortable: true,
              cell: (item: SubCategory) => (
                <StatusButton
                  value={item.status === 'Active'}
                  onClick={() => {
                    setSubCategories(
                      subCategories.map(s =>
                        s.id === item.id
                          ? {
                              ...s,
                              status:
                                s.status === 'Active' ? 'Inactive' : 'Active',
                            }
                          : s
                      )
                    );
                    ToastService.success(`Status updated for ${item.title}`);
                  }}
                />
              ),
            },
            { field: 'createdBy', header: 'Created By', sortable: true },
            { field: 'createdDate', header: 'Created Date', sortable: true },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add'
            ? 'Add Sub Publishing Category'
            : 'Edit Sub Publishing Category'
        }
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Parent Category *
            </label>
            <select
              value={formData.parentId}
              onChange={e =>
                setFormData({ ...formData, parentId: Number(e.target.value) })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {mockCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Sub-Category Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter sub-category title"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description"
              rows={3}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={e =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'Active' | 'Inactive',
                })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Save Sub-Category"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
