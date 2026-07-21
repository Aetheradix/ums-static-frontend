import { Navigate, Route, Routes } from 'react-router-dom';
import HostelMaster from './pages/HostelMaster';
import BuildingLayoutManager from './pages/BuildingLayoutManager';
import RoomTypeMaster from './pages/RoomTypeMaster';
import RoomAssetChecklist from './pages/RoomAssetChecklist';
import BasicFacilityMaster from './pages/BasicFacilityMaster';
import ItemCategory from './pages/ItemCategory';
import ItemMaster from './pages/ItemMaster';
import ShiftMaster from './pages/ShiftMaster';
import MessMenuMaster from './pages/MessMenuMaster';

export default function HostelMasters() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="new-hostel-registration" replace />}
      />
      <Route path="new-hostel-registration" element={<HostelMaster />} />
      <Route path="building-layout" element={<BuildingLayoutManager />} />
      <Route path="room-type-master" element={<RoomTypeMaster />} />
      <Route path="room-asset-checklist" element={<RoomAssetChecklist />} />
      <Route path="basic-facility" element={<BasicFacilityMaster />} />
      <Route path="item-category" element={<ItemCategory />} />
      <Route path="item-master" element={<ItemMaster />} />
      <Route path="shift-master" element={<ShiftMaster />} />
      <Route path="mess-menu" element={<MessMenuMaster />} />
    </Routes>
  );
}
