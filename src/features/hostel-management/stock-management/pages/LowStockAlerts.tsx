import { useMemo } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useNavigate } from 'react-router-dom';

export default function LowStockAlerts() {
  const { items, itemCategories, stockTransactions } = useHostel();
  const navigate = useNavigate();

  // Calculate current stock balance for each item across all hostels (simplified)
  const currentStocks = useMemo(() => {
    const balances: Record<string, number> = {};

    // Start with 0
    items.forEach(i => {
      balances[i.id] = 0; // Mock: we assume initial stock is 0 for simplicity if not in items directly
    });

    // Process transactions
    stockTransactions.forEach(tx => {
      if (!balances[tx.itemId]) balances[tx.itemId] = 0;

      if (
        tx.transactionType === 'PROCUREMENT' ||
        tx.transactionType === 'RETURN'
      ) {
        balances[tx.itemId] += tx.quantity;
      } else if (
        tx.transactionType === 'ISSUE' ||
        tx.transactionType === 'DAMAGE_SCRAP'
      ) {
        balances[tx.itemId] -= tx.quantity;
      }
    });

    return balances;
  }, [items, stockTransactions]);

  // Find items below reorder level. Mock some initial quantities so it's not all negative/zero.
  // In a real app, `items` from context would have a `currentStock` field or we compute from transactions precisely.
  // Here we'll artificially mock a few low stock alerts if none exist.
  const lowStockItems = items
    .map(i => {
      // Artificial mock stock if no transactions exist for better UI demonstration
      const hasTransactions = stockTransactions.some(tx => tx.itemId === i.id);
      const balance = hasTransactions
        ? currentStocks[i.id]
        : Math.floor(Math.random() * 5);

      return {
        ...i,
        currentBalance: balance,
      };
    })
    .filter(i => i.currentBalance <= i.reorderLevel);

  return (
    <FormPage
      title="Low Stock Alerts"
      description="Monitor inventory levels and identify items that need to be reordered."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Low Stock Alerts' },
      ]}
    >
      <FormCard title="Items Below Reorder Level" icon="warning">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2">Item Code</th>
                <th className="p-2">Item Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Reorder Level</th>
                <th className="p-2">Current Balance</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    All inventory items are sufficiently stocked.
                  </td>
                </tr>
              )}
              {lowStockItems.map(item => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/10"
                >
                  <td className="p-2 font-medium">{item.id}</td>
                  <td className="p-2 font-bold text-red-700 dark:text-red-400">
                    {item.itemName}
                  </td>
                  <td className="p-2">
                    {itemCategories.find(c => c.id === item.categoryId)
                      ?.categoryName || 'Unknown'}
                  </td>
                  <td className="p-2">{item.reorderLevel}</td>
                  <td className="p-2 text-red-600 font-bold">
                    {item.currentBalance}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      label="Raise PO"
                      variant="primary"
                      onClick={() =>
                        navigate('/hostel-management/stock/purchase-order')
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
