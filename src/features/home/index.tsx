import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import WorkspaceLayout from '../../shared/components/workspace-layout/WorkspaceLayout';
import MasterSubMenu from './master-sub-menu';
import Menu from './menu';
import SubMenu from './sub-menu';

const HomeRoutes: React.FC = () => {
  return (
    <WorkspaceLayout>
      <Routes>
        <Route index element={<Navigate to="menu" replace />} />
        <Route path="menu/*" element={<Menu />} />
        <Route path="sub-menu/*" element={<SubMenu />} />
        <Route path="master/*" element={<MasterSubMenu />} />
      </Routes>
    </WorkspaceLayout>
  );
};

export default HomeRoutes;
