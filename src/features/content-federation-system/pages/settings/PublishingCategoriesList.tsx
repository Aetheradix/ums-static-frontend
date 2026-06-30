import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockCategories } from '../../mockdata';
import type { PublishingCategory } from '../../types';
import StatusButton from 'shared/components/buttons/StatusButton';
import { ToastService } from 'services';

export default function PublishingCategoriesList() {
  const [categories, setCategories] =
    useState<PublishingCategory[]>(mockCategories);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: PublishingCategory;
  }>({ mode: 'closed' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleOpenAdd = () => {
    setFormData({ title: '', description: '', status: 'Active' });
    setPopup({ mode: 'add' });
  };

  const handleOpenEdit = (item: PublishingCategory) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      ToastService.error('Category title is required.');
      return;
    }

    if (popup.mode === 'add') {
      const newCat: PublishingCategory = {
        id: categories.length + 1,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        createdBy: 'CFS Admin',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setCategories([...categories, newCat]);
      ToastService.success('Category added successfully.');
    } else if (popup.mode === 'edit' && popup.item) {
      setCategories(
        categories.map(c =>
          c.id === popup.item!.id
            ? {
                ...c,
                title: formData.title,
                description: formData.description,
                status: formData.status,
                modifiedBy: 'CFS Admin',
                modifiedDate: new Date().toISOString().split('T')[0],
              }
            : c
        )
      );
      ToastService.success('Category updated successfully.');
    }
    setPopup({ mode: 'closed' });
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this category? This action cannot be undone.'
      )
    ) {
      setCategories(categories.filter(c => c.id !== id));
      ToastService.success('Category deleted successfully.');
    }
  };

  return (
    <FormPage
      title="Publishing Categories"
      description="Manage top-level classifications for university documents and publications."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Settings', to: cfsUrls.admin.settings.hub },
        { label: 'Publishing Categories' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={categories}
          loading={false}
          onEdit={handleOpenEdit}
          onRemove={item => handleDelete(item.id)}
          searchBox
          pagination={{ rows: 10 }}
          toolbar={
            <Button
              label="Add Publishing Category"
              icon="plus"
              variant="primary"
              onClick={handleOpenAdd}
            />
          }
          columns={[
            { field: 'id', header: '#', width: '60px' },
            { field: 'title', header: 'Category Title', sortable: true },
            { field: 'description', header: 'Description', sortable: true },
            {
              field: 'status',
              header: 'Status',
              sortable: true,
              cell: (item: PublishingCategory) => (
                <StatusButton
                  value={item.status === 'Active'}
                  onClick={() => {
                    setCategories(
                      categories.map(c =>
                        c.id === item.id
                          ? {
                              ...c,
                              status:
                                c.status === 'Active' ? 'Inactive' : 'Active',
                            }
                          : c
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
            ? 'Add Publishing Category'
            : 'Edit Publishing Category'
        }
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Category Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter category title"
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
              label="Save Category"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
