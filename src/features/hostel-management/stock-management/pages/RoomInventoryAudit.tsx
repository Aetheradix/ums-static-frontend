import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

interface AuditItem {
  itemId: string;
  itemName: string;
  expectedQty: number;
  foundQty: number;
  condition: 'GOOD' | 'DAMAGED' | 'MISSING';
  remarks: string;
}

export default function RoomInventoryAudit() {
  const { hostels, items, triggerNotification } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [roomId, setRoomId] = useState('');

  // We'll mock a default set of assets for a room if not found
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  // Create room options based on the selected hostel (mocking rooms 101 to 110)
  const roomOptions = Array.from({ length: 10 }).map((_, i) => ({
    id: `R-${101 + i}`,
    text: `Room ${101 + i}`,
  }));

  const handleStartAudit = () => {
    if (!hostelId || !roomId) {
      triggerNotification('Please select a hostel and room to audit.', 'error');
      return;
    }

    // Mock initializing audit items from standard room assets
    const defaultAssets = items.slice(0, 3).map(i => ({
      itemId: i.id,
      itemName: i.itemName,
      expectedQty: 2, // e.g. 2 beds, 2 tables
      foundQty: 2,
      condition: 'GOOD' as const,
      remarks: '',
    }));

    setAuditItems(defaultAssets);
    setIsAuditing(true);
  };

  const handleUpdateAuditItem = (
    index: number,
    field: keyof AuditItem,
    value: any
  ) => {
    const updated = [...auditItems];
    updated[index] = { ...updated[index], [field]: value };
    setAuditItems(updated);
  };

  const handleSubmitAudit = () => {
    // Check if any items are missing or damaged
    const issues = auditItems.filter(
      i => i.condition !== 'GOOD' || i.foundQty < i.expectedQty
    );

    if (issues.length > 0) {
      triggerNotification(
        `Audit completed with issues. ${issues.length} items flagged for review.`,
        'error'
      );
      // In a real app, we would automatically generate damage/scrap or fine records here
    } else {
      triggerNotification(
        'Audit completed successfully. All items accounted for.',
        'success'
      );
    }

    setIsAuditing(false);
    setRoomId('');
  };

  return (
    <FormPage
      title="Room Inventory Audit"
      description="Perform routine inspections and verify assets in student rooms."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Stock & Inventory',
          to: '/hostel-management/stock/procurement',
        },
        { label: 'Room Audit' },
      ]}
    >
      <FormCard title="Select Room for Audit" icon="fact_check">
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
            label="Select Room *"
            data={roomOptions}
            value={roomId}
            onChange={(v: any) => setRoomId(v)}
            textField="text"
            valueField="id"
          />
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Start Audit"
            variant="primary"
            onClick={handleStartAudit}
          />
        </div>
      </FormCard>

      {isAuditing && (
        <div className="mt-8">
          <FormCard title={`Audit Checklist: ${roomId}`} icon="checklist">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Item</th>
                    <th className="p-2">Expected Qty</th>
                    <th className="p-2">Found Qty</th>
                    <th className="p-2">Condition</th>
                    <th className="p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {auditItems.map((item, idx) => (
                    <tr
                      key={item.itemId}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 font-medium">{item.itemName}</td>
                      <td className="p-2 text-center text-slate-500">
                        {item.expectedQty}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border p-1 w-16 rounded text-center bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                          value={item.foundQty}
                          min={0}
                          max={item.expectedQty}
                          onChange={e =>
                            handleUpdateAuditItem(
                              idx,
                              'foundQty',
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </td>
                      <td className="p-2">
                        <select
                          className="border p-1 w-full rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                          value={item.condition}
                          onChange={e =>
                            handleUpdateAuditItem(
                              idx,
                              'condition',
                              e.target.value
                            )
                          }
                        >
                          <option value="GOOD">Good</option>
                          <option value="DAMAGED">Damaged</option>
                          <option value="MISSING">Missing</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="border p-1 w-full rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                          value={item.remarks}
                          placeholder="Note any issues..."
                          onChange={e =>
                            handleUpdateAuditItem(
                              idx,
                              'remarks',
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                label="Cancel Audit"
                variant="outlined"
                onClick={() => setIsAuditing(false)}
              />
              <Button
                label="Submit Audit Report"
                variant="primary"
                onClick={handleSubmitAudit}
              />
            </div>
          </FormCard>
        </div>
      )}
    </FormPage>
  );
}
