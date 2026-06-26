import React from 'react';
import { ProtectedRoute, LoginPage } from 'auth';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'shared/components/layout/MainLayout';
import { UniversityLoader } from 'shared/components/progress';
import AdmissionPortal from './admission-portal';
import AffiliationManagementSystem from './affiliation-management-system';
import CareerAdvancement from './career-advancement';
import EmployeeManagement from './employee-management';
import Home from './home';
import Master from './master';
import Settings from './settings';
import Sis from './sis';
import FinanceSupplyChain from './finance-supply-chain';
import PublicPortalLayout, {
  PublicRouteWrapper,
} from './public-portal/layout/PublicPortalLayout';

const PublicHome = React.lazy(() => import('./public-portal/pages/Home'));
const PublicSolutions = React.lazy(
  () => import('./public-portal/pages/Solutions')
);
const PublicAbout = React.lazy(() => import('./public-portal/pages/About'));
const PublicContact = React.lazy(() => import('./public-portal/pages/Contact'));

export default function Features() {
  return (
    <Routes>
      {/* Public Marketing Landing Pages */}
      <Route path="cms">
        <Route
          index
          element={
            <PublicPortalLayout>
              <PublicRouteWrapper>
                <PublicHome />
              </PublicRouteWrapper>
            </PublicPortalLayout>
          }
        />
        <Route
          path="solutions"
          element={
            <PublicPortalLayout>
              <PublicRouteWrapper>
                <PublicSolutions />
              </PublicRouteWrapper>
            </PublicPortalLayout>
          }
        />
        <Route
          path="about"
          element={
            <PublicPortalLayout>
              <PublicRouteWrapper>
                <PublicAbout />
              </PublicRouteWrapper>
            </PublicPortalLayout>
          }
        />
        <Route
          path="contact"
          element={
            <PublicPortalLayout>
              <PublicRouteWrapper>
                <PublicContact />
              </PublicRouteWrapper>
            </PublicPortalLayout>
          }
        />
      </Route>

      <Route path="public/*" element={<div>Public Page Placeholder</div>} />
      <Route path="login" element={<LoginPage />} />
      <Route
        path="callback"
        element={<UniversityLoader text="Completing sign-in..." />}
      />
      <Route path="admission-portal/*" element={<AdmissionPortal />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route path="home/*" element={<Home />} />
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route index element={<Navigate to={'/home'} />} />
                      <Route path="master/*" element={<Master />} />
                      <Route path="settings/*" element={<Settings />} />
                      <Route path="sis/*" element={<Sis />} />
                      <Route
                        path="affiliation-management-system/*"
                        element={<AffiliationManagementSystem />}
                      />
                      <Route
                        path="career-advancement/*"
                        element={<CareerAdvancement />}
                      />
                      <Route
                        path="employee-management/*"
                        element={<EmployeeManagement />}
                      />
                      <Route
                        path="finance-supply-chain/*"
                        element={<FinanceSupplyChain />}
                      />
                    </Routes>
                  </MainLayout>
                }
              />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
