import { Navigate, Route, Routes } from 'react-router-dom';
import StockProcurement from './pages/StockProcurement';
import StockIssue from './pages/StockIssue';
import DamageScrapEntry from './pages/DamageScrapEntry';
import RoomInventoryAudit from './pages/RoomInventoryAudit';
import LowStockAlerts from './pages/LowStockAlerts';
import VendorManagement from './pages/VendorManagement';
import PurchaseOrder from './pages/PurchaseOrder';

export default function StockManagement() {
  return (
    <Routes>
      <Route index element={<Navigate to="procurement" replace />} />
      <Route path="procurement" element={<StockProcurement />} />
      <Route path="issue" element={<StockIssue />} />
      <Route path="damage-scrap" element={<DamageScrapEntry />} />
      <Route path="room-audit" element={<RoomInventoryAudit />} />
      <Route path="low-stock" element={<LowStockAlerts />} />
      <Route path="vendors" element={<VendorManagement />} />
      <Route path="purchase-order" element={<PurchaseOrder />} />
    </Routes>
  );
}
