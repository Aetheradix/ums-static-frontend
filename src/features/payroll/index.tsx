import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from 'shared/components/progress';

const EarningAndDeduction = React.lazy(
  () => import('./pages/EarningAndDeduction')
);
const SalaryHead = React.lazy(() => import('./pages/SalaryHead'));
const SalaryOptionalHead = React.lazy(
  () => import('./pages/SalaryOptionalHead')
);
const SalaryMonthlyHead = React.lazy(() => import('./pages/SalaryMonthlyHead'));
const InsurancePolicy = React.lazy(() => import('./pages/InsurancePolicy'));
const LoanInformation = React.lazy(() => import('./pages/LoanInformation'));
const SetAttendance = React.lazy(() => import('./pages/SetAttendance'));
const GenerateSalary = React.lazy(() => import('./pages/GenerateSalary'));
const SalaryProcess = React.lazy(() => import('./pages/SalaryProcess'));
const Gratuity = React.lazy(() => import('./pages/Gratuity'));
const LeaveEncashment = React.lazy(() => import('./pages/LeaveEncashment'));
const Bonus = React.lazy(() => import('./pages/Bonus'));
const PayrollDashboard = React.lazy(() => import('./pages/PayrollDashboard'));

const ArrearProcess = React.lazy(() => import('./pages/ArrearProcess'));
const SalaryIncrement = React.lazy(() => import('./pages/SalaryIncrement'));
const IncomeTaxDeclaration = React.lazy(
  () => import('./pages/IncomeTaxDeclaration')
);

// Simple placeholder page for routes that don't have designs yet
function StubPage({ title }: { title: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <i className="pi pi-info-circle text-2xl" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-md">
        This page will be designed once the screen design is provided.
      </p>
    </div>
  );
}

export default function PayrollRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          index
          element={<Navigate to="/home/sub-menu/payroll-management" replace />}
        />

        <Route path="dashboard" element={<PayrollDashboard />} />
        <Route path="earning-deduction" element={<EarningAndDeduction />} />
        <Route
          path="about-payroll"
          element={<StubPage title="About Payroll" />}
        />

        <Route
          path="set-head-value"
          element={<Navigate to="set-head-value/salary-head" replace />}
        />
        <Route path="set-head-value/salary-head" element={<SalaryHead />} />
        <Route
          path="set-head-value/salary-optional-head"
          element={<SalaryOptionalHead />}
        />
        <Route
          path="set-head-value/salary-monthly-head"
          element={<SalaryMonthlyHead />}
        />
        <Route
          path="set-head-value/insurance-policy"
          element={<InsurancePolicy />}
        />
        <Route
          path="set-head-value/loan-information"
          element={<LoanInformation />}
        />

        <Route
          path="salary-process"
          element={<Navigate to="salary-process/set-attendance" replace />}
        />
        <Route
          path="salary-process/set-attendance"
          element={<SetAttendance />}
        />
        <Route
          path="salary-process/generate-salary"
          element={<GenerateSalary />}
        />
        <Route
          path="salary-process/salary-process"
          element={<SalaryProcess />}
        />
        <Route
          path="payroll-reports"
          element={<StubPage title="Payroll Reports" />}
        />
        <Route path="gratuity" element={<Gratuity />} />
        <Route path="leave-encashment" element={<LeaveEncashment />} />
        <Route path="bonus" element={<Bonus />} />
        <Route path="arrear-process" element={<ArrearProcess />} />
        <Route path="salary-increment" element={<SalaryIncrement />} />
        <Route
          path="income-tax-declaration"
          element={<IncomeTaxDeclaration />}
        />
      </Routes>
    </Suspense>
  );
}
