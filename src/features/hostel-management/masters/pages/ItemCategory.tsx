import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function ItemCategory() {
  const { itemCategories, setItemCategories, triggerNotification } =
    useHostel();
  const [showList, setShowList] = useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const reset = () => {
    setCategoryName('');
    setStatus('ACTIVE');
  };

  const handleSave = () => {
    if (!categoryName) {
      triggerNotification('Please enter category name', 'error');
      return;
    }
    const newCat: HostelManagement.ItemCategory = {
      id: `IC-${Date.now()}`,
      categoryName,
      status: status as any,
    };
    setItemCategories([...itemCategories, newCat]);
    triggerNotification('Item Category saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Item Category Master"
        description="Manage categories for inventory items"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Item Categories' },
        ]}
      >
        <FormCard title="Item Categories" icon="category">
          <Button
            label="Add Category"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Category Name</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {itemCategories.map(c => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{c.categoryName}</td>
                    <td className="p-2">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Item Category Master"
      description="Create a new item category"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Item Categories' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Category Details" icon="category">
        <FormGrid columns={2}>
          <TextBox
            label="Category Name *"
            value={categoryName}
            onChange={setCategoryName}
            placeholder="e.g. Grocery"
          />
          <OptionDropDown
            label="Status"
            data={[
              { id: 'ACTIVE', text: 'Active' },
              { id: 'INACTIVE', text: 'Inactive' },
            ]}
            value={status}
            onChange={(v: any) => setStatus(v)}
            textField="text"
            valueField="id"
          />
        </FormGrid>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button label="Save Category" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
