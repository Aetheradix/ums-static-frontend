import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function DamageScrapEntry() {
  const {
    hostels,
    items,
    stockTransactions,
    setStockTransactions,
    triggerNotification,
  } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [remarks, setRemarks] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const itemOptions = items.map(i => ({ id: i.id, text: i.itemName }));

  // Show recent scrap transactions
  const scrapHistory = stockTransactions.filter(
    s => s.transactionType === 'DAMAGE_SCRAP'
  );

  const handleSubmit = () => {
    if (!hostelId || !itemId || !quantity) {
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
      transactionType: 'DAMAGE_SCRAP',
      quantity: Number(quantity),
      date: new Date().toISOString().split('T')[0],
      remarks,
      performedBy: 'ADMIN', // or logged in user ID
    };

    setStockTransactions([...stockTransactions, newTx]);
    triggerNotification('Damage/Scrap entry recorded successfully.', 'success');

    setItemId('');
    setQuantity('');
    setRemarks('');
  };

  return (
    <FormPage
      title="Damage & Scrap Entry"
      description="Write off damaged items and record them as scrap."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Damage & Scrap' },
      ]}
    >
      <FormCard title="New Scrap Entry" icon="delete_sweep">
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
            label="Select Item *"
            data={itemOptions}
            value={itemId}
            onChange={(v: any) => setItemId(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Quantity Damaged *"
            type="number"
            value={quantity as any}
            onChange={v => setQuantity(Number(v) || '')}
          />
          <TextBox
            label="Reason for Scrap / Damage"
            value={remarks}
            onChange={setRemarks}
            placeholder="e.g. Broken beyond repair"
          />
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Record as Scrap"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Recent Damage/Scrap Entries" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Transaction ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Item</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {scrapHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No damage or scrap records found.
                    </td>
                  </tr>
                )}
                {scrapHistory.map(tx => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{tx.id}</td>
                    <td className="p-2">{tx.date}</td>
                    <td className="p-2">{tx.itemName}</td>
                    <td className="p-2 text-red-600 font-semibold">
                      -{tx.quantity}
                    </td>
                    <td className="p-2">{tx.remarks}</td>
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
