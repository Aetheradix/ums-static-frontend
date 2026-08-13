import { Route, Routes } from 'react-router-dom';
import ProcurementStoreInventory from './pages/ProcurementStoreInventory';

/**
 * Procurement, Store & Inventory Management Module
 *
 * Mounted at path="procurement-store-inventory/*" in the main features router.
 * Covers the complete 14-step procurement lifecycle:
 * Request → Verification → Approval → Procurement → PO/WO →
 * GRN → Store Inventory → Department Demand → Store Issue →
 * Department Receiving → Stock Register → Invoice → Payment → Closure
 */
export default function ProcurementStoreInventoryFeature() {
  return (
    <Routes>
      <Route index element={<ProcurementStoreInventory />} />
      <Route path="*" element={<ProcurementStoreInventory />} />
    </Routes>
  );
}
