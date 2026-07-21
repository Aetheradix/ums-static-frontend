import { useMemo, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function AssetInventoryReport() {
  const { hostels, itemCategories, items, stockTransactions } = useHostel();

  const [selectedHostel, setSelectedHostel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const reportData = useMemo(() => {
    // Determine the active item list based on category filter
    let targetItems = items;
    if (selectedCategory) {
      targetItems = items.filter(i => i.categoryId === selectedCategory);
    }

    // Process transactions to build current stock balance per hostel and item
    // Because the mocked items don't have hostel-specific balances natively in this demo setup,
    // we derive a "calculated balance" by aggregating transactions.

    let targetHostels = hostels;
    if (selectedHostel) {
      targetHostels = hostels.filter(h => h.id === selectedHostel);
    }

    const inventoryView = targetHostels
      .map(hostel => {
        // Find all transactions for this hostel
        const hTxns = stockTransactions.filter(t => t.hostelId === hostel.id);

        const itemBalances = targetItems
          .map(item => {
            const itemTxns = hTxns.filter(t => t.itemId === item.id);

            let inQty = 0,
              outQty = 0,
              damageQty = 0;
            itemTxns.forEach(t => {
              if (
                t.transactionType === 'PROCUREMENT' ||
                t.transactionType === 'RETURN'
              )
                inQty += t.quantity;
              else if (t.transactionType === 'ISSUE') outQty += t.quantity;
              else if (t.transactionType === 'DAMAGE_SCRAP')
                damageQty += t.quantity;
            });

            // The current balance is derived
            // Note: For mock data realism, if the derived balance is 0 because of no transactions,
            // we might mock a base balance, but for a true report, we only show calculated.
            const currentBalance = inQty - outQty - damageQty;

            return {
              ...item,
              inQty,
              outQty,
              damageQty,
              currentBalance,
              categoryName:
                itemCategories.find(c => c.id === item.categoryId)
                  ?.categoryName || 'Unknown',
            };
          })
          .filter(ib => ib.inQty > 0 || ib.currentBalance > 0 || ib.outQty > 0); // Only show items with activity

        const totalItems = itemBalances.reduce(
          (sum, ib) => sum + ib.currentBalance,
          0
        );
        const lowStockCount = itemBalances.filter(
          ib => ib.currentBalance <= ib.reorderLevel
        ).length;

        return {
          ...hostel,
          itemBalances,
          totalItems,
          lowStockCount,
        };
      })
      .filter(h => h.itemBalances.length > 0);

    return inventoryView;
  }, [
    hostels,
    items,
    itemCategories,
    stockTransactions,
    selectedHostel,
    selectedCategory,
  ]);

  const exportToCSV = () => {
    alert('Exporting Asset/Inventory Report to CSV...');
  };

  return (
    <FormPage
      title="Asset & Inventory Report"
      description="View stock levels, consumption, and damages across hostels."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Asset & Inventory' },
      ]}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hostel
            </label>
            <select
              value={selectedHostel}
              onChange={e => setSelectedHostel(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="">All Hostels</option>
              {hostels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.hostelName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="">All Categories</option>
              {itemCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button label="Export CSV" variant="outlined" onClick={exportToCSV} />
      </div>

      <div className="space-y-6">
        {reportData.length === 0 && (
          <div className="bg-white dark:bg-slate-800 p-8 text-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
            No inventory data found for the selected filters.
          </div>
        )}

        {reportData.map(hostel => (
          <FormCard
            key={hostel.id}
            title={`${hostel.hostelName} Inventory`}
            icon="inventory_2"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                      Item Name
                    </th>
                    <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                      Category
                    </th>
                    <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-right">
                      In
                    </th>
                    <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-right">
                      Out
                    </th>
                    <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-right text-red-600">
                      Damage
                    </th>
                    <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 text-right border-l border-slate-200 dark:border-slate-700">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hostel.itemBalances.map(item => {
                    const isLowStock = item.currentBalance <= item.reorderLevel;
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isLowStock ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}
                      >
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                          {item.itemName}
                          {isLowStock && (
                            <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase">
                              Low
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {item.categoryName}
                        </td>
                        <td className="p-3 text-right font-medium text-green-600">
                          {item.inQty}
                        </td>
                        <td className="p-3 text-right font-medium text-blue-600">
                          {item.outQty}
                        </td>
                        <td className="p-3 text-right font-medium text-red-600">
                          {item.damageQty}
                        </td>
                        <td
                          className={`p-3 text-right font-bold border-l border-slate-200 dark:border-slate-700 ${isLowStock ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}
                        >
                          {item.currentBalance} {item.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FormCard>
        ))}
      </div>
    </FormPage>
  );
}
