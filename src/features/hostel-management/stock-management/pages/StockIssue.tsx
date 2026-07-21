import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function StockIssue() {
  const {
    hostels,
    items,
    hostelStaff,
    stockTransactions,
    setStockTransactions,
    triggerNotification,
  } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [remarks, setRemarks] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const staffOptions = hostelStaff
    .filter(s => s.status === 'ACTIVE')
    .map(s => ({ id: s.id, text: `${s.name} (${s.role})` }));
  const itemOptions = items.map(i => ({ id: i.id, text: i.itemName }));

  // Show recent issue transactions
  const issueHistory = stockTransactions.filter(
    s => s.transactionType === 'ISSUE'
  );

  const handleSubmit = () => {
    if (!hostelId || !staffId || !itemId || !quantity) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const selectedItem = items.find(i => i.id === itemId);
    if (!selectedItem) return;

    // Ideally we would check stock balance here before allowing issue, but skipping for mock
    const newTx: HostelManagement.StockTransaction = {
      id: `TXN-${Date.now()}`,
      hostelId,
      itemId,
      itemName: selectedItem.itemName,
      transactionType: 'ISSUE',
      quantity: Number(quantity),
      date: new Date().toISOString().split('T')[0],
      remarks,
      performedBy: staffId,
    };

    setStockTransactions([...stockTransactions, newTx]);
    triggerNotification('Stock issued successfully.', 'success');

    setItemId('');
    setQuantity('');
    setRemarks('');
  };

  return (
    <FormPage
      title="Stock Issue"
      description="Issue items from hostel inventory to staff or for specific uses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Issue Stock' },
      ]}
    >
      <FormCard title="New Issue Entry" icon="outbox">
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
            label="Issued To (Staff) *"
            data={staffOptions}
            value={staffId}
            onChange={(v: any) => setStaffId(v)}
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
            label="Quantity Issued *"
            type="number"
            value={quantity as any}
            onChange={v => setQuantity(Number(v) || '')}
          />

          <div className="col-span-2">
            <TextBox
              label="Purpose / Remarks"
              value={remarks}
              onChange={setRemarks}
              placeholder="e.g. Issued for Room 101 repair"
            />
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Issue Stock"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Recent Issues" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Transaction ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Item</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Issued To</th>
                  <th className="p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {issueHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500">
                      No stock issue records found.
                    </td>
                  </tr>
                )}
                {issueHistory.map(tx => (
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
                    <td className="p-2">
                      {hostelStaff.find(s => s.id === tx.performedBy)?.name ||
                        tx.performedBy}
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
