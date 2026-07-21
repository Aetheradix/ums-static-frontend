import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function StockProcurement() {
  const {
    hostels,
    items,
    vendors,
    stockTransactions,
    setStockTransactions,
    triggerNotification,
  } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [remarks, setRemarks] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const vendorOptions = vendors
    .filter(v => v.status === 'ACTIVE')
    .map(v => ({ id: v.id, text: v.vendorName }));
  const itemOptions = items.map(i => ({ id: i.id, text: i.itemName }));

  // Show recent procurement transactions
  const procurementHistory = stockTransactions.filter(
    s => s.transactionType === 'PROCUREMENT'
  );

  const handleSubmit = () => {
    if (!hostelId || !vendorId || !itemId || !quantity) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const selectedItem = items.find(i => i.id === itemId);
    if (!selectedItem) return;

    const newTx: HostelManagement.StockTransaction = {
      id: `TXN-${Date.now()}`,
      hostelId,
      itemId,
      itemName: selectedItem.itemName,
      transactionType: 'PROCUREMENT',
      quantity: Number(quantity),
      date: new Date().toISOString().split('T')[0],
      remarks,
      performedBy: vendorId, // Using vendor ID to track who supplied it
      referenceId,
    };

    setStockTransactions([...stockTransactions, newTx]);
    triggerNotification('Stock procurement recorded successfully.', 'success');

    setItemId('');
    setQuantity('');
    setRemarks('');
    setReferenceId('');
  };

  return (
    <FormPage
      title="Stock Procurement"
      description="Record new stock received from vendors."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Procurement Entry' },
      ]}
    >
      <FormCard title="New Procurement Entry" icon="add_shopping_cart">
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

          <OptionDropDown
            label="Select Item *"
            data={itemOptions}
            value={itemId}
            onChange={(v: any) => setItemId(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Quantity Received *"
            type="number"
            value={quantity as any}
            onChange={v => setQuantity(Number(v) || '')}
          />

          <TextBox
            label="Purchase Order / Invoice Ref"
            value={referenceId}
            onChange={setReferenceId}
          />
          <TextBox label="Remarks" value={remarks} onChange={setRemarks} />
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Record Stock"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Recent Procurements" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Transaction ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Item</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Vendor / Reference</th>
                </tr>
              </thead>
              <tbody>
                {procurementHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No procurement records found.
                    </td>
                  </tr>
                )}
                {procurementHistory.map(tx => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{tx.id}</td>
                    <td className="p-2">{tx.date}</td>
                    <td className="p-2">{tx.itemName}</td>
                    <td className="p-2 text-green-600 font-semibold">
                      +{tx.quantity}
                    </td>
                    <td className="p-2">
                      <span className="text-slate-700 dark:text-slate-300">
                        Vendor ID: {tx.performedBy}
                      </span>
                      {tx.referenceId && (
                        <span className="text-xs text-slate-500 block">
                          Ref: {tx.referenceId}
                        </span>
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
