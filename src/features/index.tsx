import { LoginPage, ProtectedRoute } from 'auth';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'shared/components/layout/MainLayout';
import { UniversityLoader } from 'shared/components/progress';
import Academics from './academics';
import AdmissionPortal from './admission-portal';
import AdmissionsManagement from './admissions-management';
import AffiliationManagementSystem from './affiliation-management-system';
import AlumniManagement from './alumni-management';
import CareerAdvancement from './career-advancement';
import CertificateManagementSystem from './certificate-management-system';
import EmployeeManagement from './employee-management';
import EmployeeReports from './employee-reports';
import EssentialServices from './essential-services';
import EstateManagement from './estate-management';
import ExaminationManagement from './examination-management';
import FileManagementTracking from './file-management-tracking';
import FinanceSupplyChain from './finance-supply-chain';
import GrievanceManagement from './grievance-management';
import PolicyComplianceManagement from './policy-compliance-management';
import Home from './home';
import HostelManagement from './hostel-management';
import InfrastructureProjectManagement from './infrastructure-project-management';
import CivilInfrastructure from './civil-infrastructure';
import ItServiceDesk from './it-service-desk';
import LeaveManagement from './leave-management';
import Lms from './lms';
import Master from './master';
import OpenBookExamination from './open-book-examination';
import PayrollRoutes from './payroll';
import ProgrammeManagement from './programme-management';
import PublicPortalLayout, {
  PublicRouteWrapper,
} from './public-portal/layout/PublicPortalLayout';
import RecruitmentManagement from './recruitment-management';
import ResearchManagement from './research-management';
import ResidentialAllocationManagement from './residential-allocation-management';
import RTIManagement from './rti-management';
import ScholarshipDbt from './scholarship-dbt';
import Settings from './settings';
import Sis from './sis';
import StudentActivitiesClubs from './student-activities-clubs';
import SportsManagement from './sports-management';
import StudentFeedbackManagement from './student-feedback-management';
import StudentManagement from './student-management';
import StudentLifecycle from './student-lifecycle';
import TrainingPlacement from './training-placement';
import EndowmentManagementRoutes from './endowment-management';
import ConvocationManagementRoutes from './convocation-management';

import BillTracking from './bill-tracking';
import CommunicationManagementRoutes from './communication-management';
import ContentFederationSystem from './content-federation-system';
import EventTicketingRoutes from './event-ticketing-management';
import LegalCaseManagementRoutes from './legal-case-management';
import TimetableManagementRoutes from './timetable-management';
import SecurityManagement from './security-management';
import ThesisManagementRoutes from './thesis-management';
import TrainerDevelopment from './trainer-development';
import TransportManagement from './transport-management';
import HealthManagement from './health-management';
import EvaluationGrading from './evaluation-grading';
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
                        path="student-lifecycle/*"
                        element={<StudentLifecycle />}
                      />
                      <Route
                        path="recruitment-management/*"
                        element={<RecruitmentManagement />}
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
                        path="essential-services/*"
                        element={<EssentialServices />}
                      />
                      <Route
                        path="estate-management/*"
                        element={<EstateManagement />}
                      />
                      <Route
                        path="programme-management/*"
                        element={<ProgrammeManagement />}
                      />
                      <Route
                        path="hostel-management/*"
                        element={<HostelManagement />}
                      />
                      <Route
                        path="it-service-desk/*"
                        element={<ItServiceDesk />}
                      />
                      <Route
                        path="research-management/*"
                        element={<ResearchManagement />}
                      />
                      <Route
                        path="residential-allocation-management/*"
                        element={<ResidentialAllocationManagement />}
                      />
                      <Route
                        path="grievance-management/*"
                        element={<GrievanceManagement />}
                      />
                      <Route
                        path="policy-compliance-management/*"
                        element={<PolicyComplianceManagement />}
                      />
                      <Route
                        path="health-management/*"
                        element={<HealthManagement />}
                      />
                      <Route path="lms/*" element={<Lms />} />
                      <Route
                        path="student-feedback-management/*"
                        element={<StudentFeedbackManagement />}
                      />
                      <Route
                        path="student-activities-clubs/*"
                        element={<StudentActivitiesClubs />}
                      />
                      <Route
                        path="sports-management/*"
                        element={<SportsManagement />}
                      />
                      <Route
                        path="endowment-management/*"
                        element={<EndowmentManagementRoutes />}
                      />
                      <Route
                        path="convocation-management/*"
                        element={<ConvocationManagementRoutes />}
                      />
                      <Route
                        path="rti-management/*"
                        element={<RTIManagement />}
                      />
                      <Route
                        path="leave-management/*"
                        element={<LeaveManagement />}
                      />
                      <Route
                        path="scholarship-dbt/*"
                        element={<ScholarshipDbt />}
                      />
                      <Route
                        path="thesis-management/*"
                        element={<ThesisManagementRoutes />}
                      />
                      <Route
                        path="legal-case-management/*"
                        element={<LegalCaseManagementRoutes />}
                      />
                      <Route
                        path="communication-management/*"
                        element={<CommunicationManagementRoutes />}
                      />
                      <Route
                        path="event-ticketing-management/*"
                        element={<EventTicketingRoutes />}
                      />
                      <Route
                        path="timetable-management/*"
                        element={<TimetableManagementRoutes />}
                      />
                      <Route
                        path="trainer-development/*"
                        element={<TrainerDevelopment />}
                      />
                      <Route
                        path="alumni-management/*"
                        element={<AlumniManagement />}
                      />
                      <Route
                        path="training-placement/*"
                        element={<TrainingPlacement />}
                      />
                      <Route
                        path="open-book-examination/*"
                        element={<OpenBookExamination />}
                      />
                      <Route
                        path="payroll-management/*"
                        element={<PayrollRoutes />}
                      />
                      <Route
                        path="content-federation/*"
                        element={<ContentFederationSystem />}
                      />
                      <Route
                        path="infrastructure-project-management/*"
                        element={<InfrastructureProjectManagement />}
                      />
                      <Route
                        path="file-management-tracking/*"
                        element={<FileManagementTracking />}
                      />
                      <Route
                        path="transport-management/*"
                        element={<TransportManagement />}
                      />
                      <Route
                        path="affiliation-management-system/*"
                        element={<AffiliationManagementSystem />}
                      />
                      <Route
                        path="security-management/*"
                        element={<SecurityManagement />}
                      />
                      <Route
                        path="bill-tracking/*"
                        element={<BillTracking />}
                      />
                      <Route
                        path="civil-infrastructure/*"
                        element={<CivilInfrastructure />}
                      />
                      <Route
                        path="evaluation-grading/*"
                        element={<EvaluationGrading />}
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
