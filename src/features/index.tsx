import { LoginPage, ProtectedRoute } from 'auth';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'shared/components/layout/MainLayout';
import { UniversityLoader } from 'shared/components/progress';
import Academics from './academics';
import AdmissionPortal from './admission-portal';
import AffiliationManagementSystem from './affiliation-management-system';
import AlumniManagement from './alumni-management';
import CareerAdvancement from './career-advancement';
import CertificateManagementSystem from './certificate-management-system';
import EmployeeManagement from './employee-management';
import EmployeeReports from './employee-reports';
import ExaminationManagement from './examination-management';
import FinanceSupplyChain from './finance-supply-chain';
import GrievanceManagement from './grievance-management';
import Home from './home';
import HostelManagement from './hostel-management';
import LeaveManagement from './leave-management';
import Lms from './lms';
import Master from './master';
import ProgrammeManagement from './programme-management';
import PublicPortalLayout, {
  PublicRouteWrapper,
} from './public-portal/layout/PublicPortalLayout';
import Settings from './settings';
import Sis from './sis';
import StudentManagement from './student-management';
import AdmissionsManagement from './admissions-management';
import StudentFeedbackManagement from './student-feedback-management';
import TrainingPlacement from './training-placement';

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
                        path="student-management/*"
                        element={<StudentManagement />}
                      />
                      <Route
                        path="admissions-management/*"
                        element={<AdmissionsManagement />}
                      />
                      <Route
                        path="affiliation-management-system/*"
                        element={<AffiliationManagementSystem />}
                      />
                      <Route
                        path="certificate-management-system/*"
                        element={<CertificateManagementSystem />}
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
                      <Route
                        path="employee-reports/*"
                        element={<EmployeeReports />}
                      />
                      <Route
                        path="examination-management/*"
                        element={<ExaminationManagement />}
                      />
                      <Route path="academics/*" element={<Academics />} />
                      <Route
                        path="programme-management/*"
                        element={<ProgrammeManagement />}
                      />
                      <Route
                        path="hostel-management/*"
                        element={<HostelManagement />}
                      />
                      <Route
                        path="grievance-management/*"
                        element={<GrievanceManagement />}
                      />
                      <Route path="lms/*" element={<Lms />} />
                      <Route
                        path="student-feedback-management/*"
                        element={<StudentFeedbackManagement />}
                      />
                      <Route
                        path="leave-management/*"
                        element={<LeaveManagement />}
                      />
                      <Route
                        path="alumni-management/*"
                        element={<AlumniManagement />}
                      />
                      <Route
                        path="training-placement/*"
                        element={<TrainingPlacement />}
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
