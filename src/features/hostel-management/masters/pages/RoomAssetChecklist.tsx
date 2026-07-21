import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function RoomAssetChecklist() {
  const { roomAssets, setRoomAssets, roomTypes, triggerNotification } =
    useHostel();
  const [showList, setShowList] = useState(false);

  const [roomTypeId, setRoomTypeId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('FURNITURE');
  const [quantityPerRoom, setQuantityPerRoom] = useState('');
  const [isConsumable, setIsConsumable] = useState(false);
  const [reorderLevel, setReorderLevel] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [conditionOnIssue, setConditionOnIssue] = useState('NEW');
  const [status, setStatus] = useState('ACTIVE');

  const roomTypeOptions = roomTypes.map(rt => ({
    id: rt.id,
    text: rt.roomTypeName,
  }));

  const reset = () => {
    setRoomTypeId('');
    setAssetName('');
    setAssetCategory('FURNITURE');
    setQuantityPerRoom('');
    setIsConsumable(false);
    setReorderLevel('');
    setEstimatedCost('');
    setConditionOnIssue('NEW');
    setStatus('ACTIVE');
  };

  const handleSave = () => {
    if (!roomTypeId || !assetName || !quantityPerRoom) {
      triggerNotification('Please fill mandatory fields', 'error');
      return;
    }
    const rt = roomTypes.find(r => r.id === roomTypeId);
    if (!rt) return;

    const newAsset: HostelManagement.RoomAsset = {
      id: `RA-${Date.now()}`,
      roomTypeId,
      roomTypeName: rt.roomTypeName,
      assetName,
      assetCategory: assetCategory as any,
      quantityPerRoom: parseInt(quantityPerRoom),
      isConsumable,
      reorderLevel: reorderLevel ? parseInt(reorderLevel) : undefined,
      estimatedCost: parseFloat(estimatedCost) || 0,
      conditionOnIssue: conditionOnIssue as any,
      status: status as any,
    };
    setRoomAssets([...roomAssets, newAsset]);
    triggerNotification('Room Asset saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Room Asset Checklist"
        description="Manage assets provided in rooms"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Room Assets' },
        ]}
      >
        <FormCard title="Room Assets" icon="inventory_2">
          <Button
            label="Add Asset"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Asset Name</th>
                  <th className="p-2">Room Type</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Qty/Room</th>
                  <th className="p-2">Condition</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {roomAssets.map(a => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{a.assetName}</td>
                    <td className="p-2">{a.roomTypeName}</td>
                    <td className="p-2">{a.assetCategory}</td>
                    <td className="p-2">{a.quantityPerRoom}</td>
                    <td className="p-2">{a.conditionOnIssue}</td>
                    <td className="p-2">{a.status}</td>
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
      title="Room Asset Checklist"
      description="Add a new asset to the room checklist"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Room Assets' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Asset Details" icon="inventory_2">
        <FormGrid columns={3}>
          <OptionDropDown
            label="Room Type *"
            data={roomTypeOptions}
            value={roomTypeId}
            onChange={(v: any) => setRoomTypeId(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Asset Name *"
            value={assetName}
            onChange={setAssetName}
            placeholder="e.g. Study Table"
          />
          <OptionDropDown
            label="Asset Category"
            data={[
              { id: 'FURNITURE', text: 'Furniture' },
              { id: 'ELECTRICAL', text: 'Electrical' },
              { id: 'FIXTURE', text: 'Fixture' },
              { id: 'SANITARY', text: 'Sanitary' },
            ]}
            value={assetCategory}
            onChange={(v: any) => setAssetCategory(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Quantity per Room *"
            type="number"
            value={quantityPerRoom}
            onChange={setQuantityPerRoom}
          />

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={isConsumable}
              onChange={e => setIsConsumable(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">Is Consumable?</span>
          </div>

          <TextBox
            label="Reorder Level"
            type="number"
            value={reorderLevel}
            onChange={setReorderLevel}
            placeholder="Optional"
          />

          <TextBox
            label="Estimated Cost (₹)"
            type="number"
            value={estimatedCost}
            onChange={setEstimatedCost}
          />
          <OptionDropDown
            label="Condition on Issue"
            data={[
              { id: 'NEW', text: 'New' },
              { id: 'USED_GOOD', text: 'Used (Good)' },
              { id: 'USED_FAIR', text: 'Used (Fair)' },
            ]}
            value={conditionOnIssue}
            onChange={(v: any) => setConditionOnIssue(v)}
            textField="text"
            valueField="id"
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
        <Button label="Save Asset" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
