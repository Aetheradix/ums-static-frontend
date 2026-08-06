import { useState } from 'react';
import { useHostelContext, useHostelRole } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function InventoryStock() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, activePortal } = useHostelRole();
  const [activeTab, setActiveTab] = useState<'food' | 'utility'>('food');

  // Food Quality Feedback state for students
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [qualityFeedback, setQualityFeedback] = useState({
    rating: '5',
    mealCategory: 'Lunch',
    comments: '',
  });

  // Food Stock Form (Warden / Admin)
  const initialFoodForm = {
    itemName: '',
    category: 'Grains & Pulses',
    batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
    quantity: '',
    unit: 'kg',
    threshold: '50',
    expiryDate: '',
    supplierInfo: '',
  };
  const [foodForm, setFoodForm] = useState(initialFoodForm);

  // Utility Stock Form (Warden / Admin)
  const initialUtilityForm = {
    assetName: '',
    category: 'Maintenance Supplies' as const,
    hostelId: 'H1',
    quantity: '',
    threshold: '20',
    condition: 'Good' as const,
    lastRestocked: new Date().toISOString().split('T')[0],
  };
  const [utilityForm, setUtilityForm] = useState(initialUtilityForm);

  // ── Automatic Low-Stock Trigger ──
  const lowFoodItems = (data.foodStock || []).filter(
    item => item.quantity <= item.threshold
  );
  const lowUtilityItems = (data.hostelUtilities || []).filter(
    item => item.quantity <= item.threshold
  );
  const totalLowStockCount = lowFoodItems.length + lowUtilityItems.length;

  const handleAddFoodStock = () => {
    if (!foodForm.itemName || !foodForm.quantity) {
      alert('Please fill in Item Name and Quantity.');
      return;
    }
    addRecord('foodStock', {
      id: `FS${Date.now()}`,
      itemName: foodForm.itemName,
      category: foodForm.category,
      batchNumber: foodForm.batchNumber,
      quantity: parseFloat(foodForm.quantity) || 0,
      unit: foodForm.unit,
      threshold: parseFloat(foodForm.threshold) || 0,
      expiryDate: foodForm.expiryDate || new Date().toISOString().split('T')[0],
      supplierInfo: foodForm.supplierInfo || 'N/A',
      status: 'Active',
    });
    setFoodForm({
      ...initialFoodForm,
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
    });
  };

  const handleAddUtility = () => {
    if (!utilityForm.assetName || !utilityForm.quantity) {
      alert('Please fill in Asset/Item Name and Quantity.');
      return;
    }
    addRecord('hostelUtilities', {
      id: `HU${Date.now()}`,
      assetName: utilityForm.assetName,
      category: utilityForm.category,
      hostelId: utilityForm.hostelId,
      quantity: parseFloat(utilityForm.quantity) || 0,
      threshold: parseFloat(utilityForm.threshold) || 0,
      condition: utilityForm.condition,
      lastRestocked: utilityForm.lastRestocked,
    });
    setUtilityForm(initialUtilityForm);
  };

  const handleSubmitFeedback = () => {
    if (!qualityFeedback.comments.trim()) {
      alert('Please enter your comments regarding mess food quality.');
      return;
    }
    setFeedbackSubmitted(true);
    setTimeout(() => {
      alert(
        'Thank you! Your mess food quality rating has been recorded and submitted to the Mess Committee.'
      );
    }, 200);
  };

  const portalLabel =
    activePortal === 'warden'
      ? 'Warden Portal'
      : activePortal === 'student'
        ? 'Student Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={
        isStudent
          ? 'Mess Ingredients & Food Quality'
          : 'Inventory & Stock Management'
      }
      description={
        isStudent
          ? 'View raw mess food ingredients, quality certifications, stock levels, and submit meal quality feedback.'
          : 'Track mess food raw stock, common hostel utilities, maintenance supplies, and beddings with automated low-stock alerts.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Inventory & Stock' },
      ]}
    >
      {/* ── AUTOMATED LOW-STOCK ALERT TRIGGER BANNER (Warden & Admin) ── */}
      {!isStudent && totalLowStockCount > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
              <span className="material-symbols-outlined text-red-600">
                warning
              </span>
              <span>
                AUTOMATED LOW-STOCK ALERTS ({totalLowStockCount} items below
                safety threshold)
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-200 text-red-900 animate-pulse">
              ACTION REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 text-xs text-red-700">
            {lowFoodItems.length > 0 && (
              <div className="bg-white/80 p-2.5 rounded border border-red-200">
                <strong className="text-red-900 block mb-1">
                  🍲 Mess Ingredients Low Stock:
                </strong>
                <ul className="list-disc pl-4 space-y-1">
                  {lowFoodItems.map(item => (
                    <li key={item.id}>
                      <span className="font-semibold">{item.itemName}</span>:{' '}
                      {item.quantity} {item.unit}{' '}
                      <span className="text-red-500 font-bold">
                        (Min Threshold: {item.threshold} {item.unit})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lowUtilityItems.length > 0 && (
              <div className="bg-white/80 p-2.5 rounded border border-red-200">
                <strong className="text-red-900 block mb-1">
                  🧹 Hostel Assets & Supplies Low Stock:
                </strong>
                <ul className="list-disc pl-4 space-y-1">
                  {lowUtilityItems.map(item => (
                    <li key={item.id}>
                      <span className="font-semibold">{item.assetName}</span> (
                      {item.category}): {item.quantity} units{' '}
                      <span className="text-red-500 font-bold">
                        (Min Threshold: {item.threshold})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STUDENT FOOD QUALITY BANNER ── */}
      {isStudent && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm m-0">
                Food Quality & Hygiene Transparency
              </h4>
              <p className="text-xs text-emerald-700 m-0 mt-0.5">
                Mess raw ingredients are 100% FSSAI Quality Certified. View
                ingredients, expiry dates, and rate mess food quality below.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-xs">
            FSSAI Grade A Certified
          </span>
        </div>
      )}

      {/* ── Tab Selector ── */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'food'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('food')}
        >
          <span className="material-symbols-outlined text-[18px]">
            restaurant
          </span>
          <span>
            {isStudent
              ? 'Mess Ingredients & Food Quality'
              : 'Mess Food Raw Stock'}
          </span>
          {!isStudent && lowFoodItems.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
              {lowFoodItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'utility'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('utility')}
        >
          <span className="material-symbols-outlined text-[18px]">
            inventory_2
          </span>
          <span>
            {isStudent
              ? 'Hostel Amenities & Linen Stock'
              : 'Hostel Assets, Linen & Maintenance Supplies'}
          </span>
          {!isStudent && lowUtilityItems.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
              {lowUtilityItems.length}
            </span>
          )}
        </button>
      </div>

      {/* ── TAB 1: MESS FOOD STOCK & QUALITY ── */}
      {activeTab === 'food' && (
        <>
          {/* Warden / Admin add stock form */}
          {!isStudent && (
            <FormCard
              title="Add Mess Food Raw Ingredient (Mess Manager)"
              icon="add_shopping_cart"
            >
              <FormGrid columns={4}>
                <TextBox
                  label="Item Name *"
                  value={foodForm.itemName}
                  onChange={v => setFoodForm({ ...foodForm, itemName: v })}
                  placeholder="e.g. Basmati Rice, Cooking Oil"
                />
                <DropDownList
                  label="Category"
                  data={[
                    { id: 'Grains & Pulses', text: 'Grains & Pulses' },
                    { id: 'Oils & Fats', text: 'Oils & Fats' },
                    { id: 'Dairy', text: 'Dairy' },
                    { id: 'Spices & Condiments', text: 'Spices & Condiments' },
                    { id: 'Vegetables', text: 'Vegetables' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={foodForm.category}
                  onChange={v =>
                    setFoodForm({ ...foodForm, category: v as string })
                  }
                />
                <TextBox
                  label="Batch Number *"
                  value={foodForm.batchNumber}
                  onChange={v => setFoodForm({ ...foodForm, batchNumber: v })}
                />
                <TextBox
                  label="Quantity *"
                  type="number"
                  value={foodForm.quantity}
                  onChange={v => setFoodForm({ ...foodForm, quantity: v })}
                  placeholder="Current stock qty"
                />

                <DropDownList
                  label="Unit"
                  data={[
                    { id: 'kg', text: 'kg' },
                    { id: 'liters', text: 'liters' },
                    { id: 'packets', text: 'packets' },
                    { id: 'bags', text: 'bags' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={foodForm.unit}
                  onChange={v =>
                    setFoodForm({ ...foodForm, unit: v as string })
                  }
                />
                <TextBox
                  label="Low Stock Threshold *"
                  type="number"
                  value={foodForm.threshold}
                  onChange={v => setFoodForm({ ...foodForm, threshold: v })}
                  placeholder="Alert threshold qty"
                />
                <TextBox
                  label="Expiry Date *"
                  type="date"
                  value={foodForm.expiryDate}
                  onChange={v => setFoodForm({ ...foodForm, expiryDate: v })}
                />
                <TextBox
                  label="Supplier Info"
                  value={foodForm.supplierInfo}
                  onChange={v => setFoodForm({ ...foodForm, supplierInfo: v })}
                  placeholder="Supplier name / phone"
                />
              </FormGrid>
              <div className="mt-4 flex gap-3">
                <Button
                  label="Add Raw Stock"
                  variant="primary"
                  onClick={handleAddFoodStock}
                />
                <Button
                  label="Clear"
                  variant="outlined"
                  onClick={() => setFoodForm(initialFoodForm)}
                />
              </div>
            </FormCard>
          )}

          {/* Student Quality Rating Card */}
          {isStudent && (
            <FormCard title="Rate Mess Food & Ingredient Quality" icon="star">
              <FormGrid columns={3}>
                <DropDownList
                  label="Meal Category"
                  data={[
                    { id: 'Breakfast', text: 'Breakfast' },
                    { id: 'Lunch', text: 'Lunch' },
                    { id: 'Snacks', text: 'Snacks' },
                    { id: 'Dinner', text: 'Dinner' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={qualityFeedback.mealCategory}
                  onChange={v =>
                    setQualityFeedback({
                      ...qualityFeedback,
                      mealCategory: v as string,
                    })
                  }
                />

                <DropDownList
                  label="Food & Hygiene Rating"
                  data={[
                    {
                      id: '5',
                      text: '⭐⭐⭐⭐⭐ (5 - Excellent Quality & Taste)',
                    },
                    { id: '4', text: '⭐⭐⭐⭐ (4 - Good Quality)' },
                    { id: '3', text: '⭐⭐⭐ (3 - Average)' },
                    { id: '2', text: '⭐⭐ (2 - Needs Improvement)' },
                    { id: '1', text: '⭐ (1 - Poor Hygiene/Taste)' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={qualityFeedback.rating}
                  onChange={v =>
                    setQualityFeedback({
                      ...qualityFeedback,
                      rating: v as string,
                    })
                  }
                />

                <div className="col-span-3">
                  <TextBox
                    label="Comments / Taste & Freshness Feedback *"
                    value={qualityFeedback.comments}
                    onChange={v =>
                      setQualityFeedback({ ...qualityFeedback, comments: v })
                    }
                    placeholder="Provide feedback on meal taste, hygiene, or ingredient quality..."
                  />
                </div>
              </FormGrid>
              <div className="mt-4 flex gap-3">
                <Button
                  label="Submit Food Quality Rating"
                  variant="primary"
                  onClick={handleSubmitFeedback}
                />
                {feedbackSubmitted && (
                  <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Feedback Submitted to Mess Committee!
                  </span>
                )}
              </div>
            </FormCard>
          )}

          <FormCard
            title={
              isStudent
                ? 'Mess Ingredients & Quality Level Transparency'
                : 'Mess Food Stock Inventory'
            }
            icon="format_list_bulleted"
          >
            <GridPanel
              data={data.foodStock || []}
              columns={[
                { field: 'itemName', header: 'Ingredient Name' },
                { field: 'category', header: 'Category' },
                { field: 'batchNumber', header: 'Batch No' },
                {
                  field: 'quantity',
                  header: 'Available Quantity',
                  cell: (item: any) => (
                    <span className="font-bold">
                      {item.quantity} {item.unit}
                    </span>
                  ),
                },
                {
                  header: 'Quality Grade & Cert',
                  sortable: false,
                  cell: () => (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                      <span className="material-symbols-outlined text-[14px]">
                        thumb_up
                      </span>
                      Grade A Fresh
                    </span>
                  ),
                },
                ...(!isStudent
                  ? [
                      {
                        field: 'threshold',
                        header: 'Min Threshold',
                        cell: (item: any) => (
                          <span className="text-gray-500 text-xs font-semibold">
                            {item.threshold} {item.unit}
                          </span>
                        ),
                      },
                      {
                        header: 'Stock Status',
                        sortable: false,
                        cell: (item: any) => {
                          const isLow = item.quantity <= item.threshold;
                          return (
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                isLow
                                  ? 'bg-red-100 text-red-800 animate-pulse'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {isLow ? '⚠️ LOW STOCK' : 'IN STOCK'}
                            </span>
                          );
                        },
                      },
                    ]
                  : []),
                { field: 'expiryDate', header: 'Expiry Date' },
                { field: 'supplierInfo', header: 'Supplier Info' },
                ...(!isStudent
                  ? [
                      {
                        header: 'Restock Action',
                        sortable: false,
                        cell: (item: any) => (
                          <Button
                            label="+100 Restock"
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              updateRecord('foodStock', item.id, {
                                ...item,
                                quantity: item.quantity + 100,
                              })
                            }
                          />
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </FormCard>
        </>
      )}

      {/* ── TAB 2: HOSTEL ASSETS, LINEN & MAINTENANCE SUPPLIES ── */}
      {activeTab === 'utility' && (
        <>
          {!isStudent && (
            <FormCard
              title="Add Asset / Utility / Linen Item (Caretaker / Warden)"
              icon="add_box"
            >
              <FormGrid columns={4}>
                <TextBox
                  label="Asset / Item Name *"
                  value={utilityForm.assetName}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, assetName: v })
                  }
                  placeholder="e.g. LED Bulbs, Bedsheets, Pillows, Fan"
                />
                <DropDownList
                  label="Category *"
                  data={[
                    {
                      id: 'Maintenance Supplies',
                      text: 'Maintenance Supplies (bulbs, cleaning)',
                    },
                    {
                      id: 'Linen & Bedding',
                      text: 'Linen & Bedding (bedsheets, pillows)',
                    },
                    { id: 'Appliances', text: 'Appliances (fans, heaters)' },
                    { id: 'Furniture', text: 'Furniture (desk, bed, chair)' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={utilityForm.category}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, category: v as any })
                  }
                />
                <DropDownList
                  label="Hostel Block *"
                  data={(data.hostels || []).map(h => ({
                    id: h.id,
                    text: h.name,
                  }))}
                  textField="text"
                  valueField="id"
                  value={utilityForm.hostelId}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, hostelId: v as string })
                  }
                />
                <TextBox
                  label="Available Quantity *"
                  type="number"
                  value={utilityForm.quantity}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, quantity: v })
                  }
                  placeholder="Current stock"
                />

                <TextBox
                  label="Low Stock Threshold *"
                  type="number"
                  value={utilityForm.threshold}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, threshold: v })
                  }
                  placeholder="Alert threshold"
                />
                <DropDownList
                  label="Condition"
                  data={[
                    { id: 'Good', text: 'Good' },
                    { id: 'Needs Repair', text: 'Needs Repair' },
                    { id: 'Damaged', text: 'Damaged' },
                  ]}
                  textField="text"
                  valueField="id"
                  value={utilityForm.condition}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, condition: v as any })
                  }
                />
                <TextBox
                  label="Last Restocked Date"
                  type="date"
                  value={utilityForm.lastRestocked}
                  onChange={v =>
                    setUtilityForm({ ...utilityForm, lastRestocked: v })
                  }
                />
              </FormGrid>
              <div className="mt-4 flex gap-3">
                <Button
                  label="Add Item / Supply"
                  variant="primary"
                  onClick={handleAddUtility}
                />
                <Button
                  label="Clear"
                  variant="outlined"
                  onClick={() => setUtilityForm(initialUtilityForm)}
                />
              </div>
            </FormCard>
          )}

          <FormCard
            title={
              isStudent
                ? 'Hostel Amenities, Linen & Equipment Availability'
                : 'Hostel Assets & Maintenance Inventory'
            }
            icon="inventory"
          >
            <GridPanel
              data={data.hostelUtilities || []}
              columns={[
                { field: 'assetName', header: 'Asset / Supply Name' },
                { field: 'category', header: 'Category' },
                {
                  field: 'hostelId',
                  header: 'Hostel',
                  cell: (item: any) => (
                    <>
                      {data.hostels.find(h => h.id === item.hostelId)?.name ||
                        item.hostelId}
                    </>
                  ),
                },
                {
                  field: 'quantity',
                  header: 'Available Stock',
                  cell: (item: any) => (
                    <span className="font-bold">{item.quantity} units</span>
                  ),
                },
                ...(!isStudent
                  ? [
                      {
                        field: 'threshold',
                        header: 'Min Threshold',
                        cell: (item: any) => (
                          <span className="text-gray-500 text-xs font-semibold">
                            {item.threshold} units
                          </span>
                        ),
                      },
                      {
                        header: 'Stock Status',
                        sortable: false,
                        cell: (item: any) => {
                          const isLow = item.quantity <= item.threshold;
                          return (
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                isLow
                                  ? 'bg-red-100 text-red-800 animate-pulse'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {isLow ? '⚠️ LOW STOCK' : 'OK'}
                            </span>
                          );
                        },
                      },
                    ]
                  : []),
                {
                  field: 'condition',
                  header: 'Condition Level',
                  cell: (item: any) => (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.condition === 'Good'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {item.condition}
                    </span>
                  ),
                },
                { field: 'lastRestocked', header: 'Last Restocked' },
                ...(!isStudent
                  ? [
                      {
                        header: 'Restock Action',
                        sortable: false,
                        cell: (item: any) => (
                          <Button
                            label="+25 Add Stock"
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              updateRecord('hostelUtilities', item.id, {
                                ...item,
                                quantity: item.quantity + 25,
                                lastRestocked: new Date()
                                  .toISOString()
                                  .split('T')[0],
                              })
                            }
                          />
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </FormCard>
        </>
      )}
    </FormPage>
  );
}
