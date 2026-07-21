import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function ItemMaster() {
  const { items, setItems, itemCategories, triggerNotification } = useHostel();
  const [showList, setShowList] = useState(false);

  const [categoryId, setCategoryId] = useState('');
  const [itemType, setItemType] = useState('CONSUMABLE');
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [unit, setUnit] = useState('KG');
  const [currentStock, setCurrentStock] = useState('0');
  const [reorderLevel, setReorderLevel] = useState('0');
  const [estimatedUnitCost, setEstimatedUnitCost] = useState('0');
  const [status, setStatus] = useState('ACTIVE');

  const categoryOptions = itemCategories.map(c => ({
    id: c.id,
    text: c.categoryName,
  }));

  const reset = () => {
    setCategoryId('');
    setItemType('CONSUMABLE');
    setItemName('');
    setItemCode('');
    setUnit('KG');
    setCurrentStock('0');
    setReorderLevel('0');
    setEstimatedUnitCost('0');
    setStatus('ACTIVE');
  };

  const handleSave = () => {
    if (!categoryId || !itemName || !itemCode) {
      triggerNotification('Please fill mandatory fields', 'error');
      return;
    }
    const cat = itemCategories.find(c => c.id === categoryId);
    if (!cat) return;

    const newItem: HostelManagement.InventoryItem = {
      id: `IT-${Date.now()}`,
      categoryId,
      categoryName: cat.categoryName,
      itemType: itemType as any,
      itemName,
      itemCode,
      unit: unit as any,
      currentStock: parseFloat(currentStock) || 0,
      reorderLevel: parseFloat(reorderLevel) || 0,
      estimatedUnitCost: parseFloat(estimatedUnitCost) || 0,
      status: status as any,
    };
    setItems([...items, newItem]);
    triggerNotification('Item saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Item Master"
        description="Manage inventory items"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Items' },
        ]}
      >
        <FormCard title="Inventory Items" icon="inventory">
          <Button
            label="Add Item"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Item Name</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr
                    key={it.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{it.itemName}</td>
                    <td className="p-2">{it.itemCode}</td>
                    <td className="p-2">{it.categoryName}</td>
                    <td className="p-2">{it.itemType}</td>
                    <td className="p-2">
                      {it.currentStock} {it.unit}
                    </td>
                    <td className="p-2">{it.status}</td>
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
      title="Item Master"
      description="Create a new inventory item"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Items' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Item Details" icon="inventory">
        <FormGrid columns={3}>
          <OptionDropDown
            label="Category *"
            data={categoryOptions}
            value={categoryId}
            onChange={(v: any) => setCategoryId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Item Type"
            data={[
              { id: 'CONSUMABLE', text: 'Consumable' },
              { id: 'NON_CONSUMABLE', text: 'Non-Consumable' },
            ]}
            value={itemType}
            onChange={(v: any) => setItemType(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Item Name *"
            value={itemName}
            onChange={setItemName}
            placeholder="e.g. Rice, Broom"
          />

          <TextBox
            label="Item Code *"
            value={itemCode}
            onChange={setItemCode}
          />
          <OptionDropDown
            label="Unit"
            data={[
              { id: 'PIECE', text: 'Piece' },
              { id: 'KG', text: 'Kg' },
              { id: 'LITRE', text: 'Litre' },
              { id: 'BOX', text: 'Box' },
              { id: 'ROLL', text: 'Roll' },
              { id: 'SET', text: 'Set' },
            ]}
            value={unit}
            onChange={(v: any) => setUnit(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Current Stock"
            type="number"
            value={currentStock}
            onChange={setCurrentStock}
          />
          <TextBox
            label="Reorder Level"
            type="number"
            value={reorderLevel}
            onChange={setReorderLevel}
          />
          <TextBox
            label="Estimated Unit Cost (₹)"
            type="number"
            value={estimatedUnitCost}
            onChange={setEstimatedUnitCost}
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
        <Button label="Save Item" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
