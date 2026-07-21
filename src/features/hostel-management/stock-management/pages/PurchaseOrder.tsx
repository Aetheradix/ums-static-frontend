import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function PurchaseOrder() {
  const {
    hostels,
    vendors,
    items,
    purchaseOrders,
    setPurchaseOrders,
    triggerNotification,
  } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  const [poItems, setPoItems] = useState<
    { itemId: string; quantity: number; unitPrice: number }[]
  >([]);

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const vendorOptions = vendors
    .filter(v => v.status === 'ACTIVE')
    .map(v => ({ id: v.id, text: v.vendorName }));
  const itemOptions = items.map(i => ({ id: i.id, text: i.itemName }));

  const handleAddItem = () => {
    setPoItems([...poItems, { itemId: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...poItems];
    (updated[index] as any)[field] = value;
    setPoItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...poItems];
    updated.splice(index, 1);
    setPoItems(updated);
  };

  const calculateTotal = () => {
    return poItems.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleSubmit = () => {
    if (!hostelId || !vendorId || !expectedDeliveryDate) {
      triggerNotification('Please fill all mandatory PO details', 'error');
      return;
    }

    if (poItems.length === 0) {
      triggerNotification('Please add at least one item to the PO', 'error');
      return;
    }

    const invalidItems = poItems.some(
      i => !i.itemId || i.quantity <= 0 || i.unitPrice < 0
    );
    if (invalidItems) {
      triggerNotification(
        'Please provide valid item details (Quantity > 0, Price >= 0)',
        'error'
      );
      return;
    }

    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const formattedItems = poItems.map(pi => {
      const itemDef = items.find(i => i.id === pi.itemId);
      return {
        itemId: pi.itemId,
        itemName: itemDef ? itemDef.itemName : 'Unknown',
        quantity: pi.quantity,
        unitPrice: pi.unitPrice,
      };
    });

    const newPO: HostelManagement.PurchaseOrder = {
      id: `PO-${Date.now()}`,
      vendorId,
      vendorName: vendor.vendorName,
      hostelId,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate,
      items: formattedItems,
      totalAmount: calculateTotal(),
      status: 'DRAFT',
    };

    setPurchaseOrders([...purchaseOrders, newPO]);
    triggerNotification(
      'Purchase Order created successfully (Draft).',
      'success'
    );

    setHostelId('');
    setVendorId('');
    setExpectedDeliveryDate('');
    setPoItems([]);
  };

  const handleSendPO = (id: string) => {
    setPurchaseOrders(prev =>
      prev.map(po => (po.id === id ? { ...po, status: 'SENT' } : po))
    );
    triggerNotification('Purchase Order marked as SENT to vendor.', 'success');
  };

  return (
    <FormPage
      title="Purchase Orders"
      description="Create and manage purchase orders for inventory items."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Purchase Orders' },
      ]}
    >
      <FormCard title="Generate New Purchase Order" icon="receipt_long">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Select Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Select Vendor *"
            data={vendorOptions}
            value={vendorId}
            onChange={(v: any) => setVendorId(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Expected Delivery Date *"
            type="date"
            value={expectedDeliveryDate}
            onChange={setExpectedDeliveryDate}
          />
        </FormGrid>

        <div className="mt-6 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              PO Items
            </h4>
            <Button
              label="Add Item"
              variant="outlined"
              onClick={handleAddItem}
            />
          </div>

          {poItems.length === 0 ? (
            <div className="text-center p-4 border border-dashed rounded text-slate-500">
              No items added to this PO yet.
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Item</th>
                  <th className="p-2 w-24">Quantity</th>
                  <th className="p-2 w-32">Unit Price</th>
                  <th className="p-2 w-32">Total</th>
                  <th className="p-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {poItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">
                      <select
                        value={item.itemId}
                        onChange={e =>
                          handleUpdateItem(idx, 'itemId', e.target.value)
                        }
                        className="w-full border p-1 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                      >
                        <option value="">-- Select Item --</option>
                        {itemOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>
                            {opt.text}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e =>
                          handleUpdateItem(
                            idx,
                            'quantity',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full border p-1 rounded text-center bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={e =>
                          handleUpdateItem(
                            idx,
                            'unitPrice',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full border p-1 rounded text-right bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                      />
                    </td>
                    <td className="p-2 text-right font-medium">
                      ₹ {(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td colSpan={3} className="p-2 text-right font-bold">
                    Grand Total:
                  </td>
                  <td className="p-2 text-right font-bold text-lg text-primary-600">
                    ₹ {calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            label="Save Draft PO"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Purchase Order History" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">PO #</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Vendor</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No purchase orders generated.
                    </td>
                  </tr>
                )}
                {purchaseOrders.map(po => (
                  <tr
                    key={po.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{po.id}</td>
                    <td className="p-2">{po.orderDate}</td>
                    <td className="p-2">{po.vendorName}</td>
                    <td className="p-2">{po.items.length} items</td>
                    <td className="p-2 font-semibold">
                      ₹ {po.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          po.status === 'DRAFT'
                            ? 'bg-slate-100 text-slate-700'
                            : po.status === 'SENT'
                              ? 'bg-blue-100 text-blue-700'
                              : po.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {po.status === 'DRAFT' && (
                        <Button
                          label="Mark Sent"
                          variant="outlined"
                          onClick={() => handleSendPO(po.id)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
