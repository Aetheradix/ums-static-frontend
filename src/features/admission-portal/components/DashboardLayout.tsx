import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import SubjectSelection from '../pages/SubjectSelection';
import FeePayment from '../pages/FeePayment';

interface DashboardLayoutProps {
  onLogout: () => void;
  token: string;
}

export default function DashboardLayout({
  onLogout,
  token,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      path: '/admission-portal/subject-selection',
      label: 'Subject Selection',
      icon: 'pi-book',
    },
    {
      path: '/admission-portal/fee-payment',
      label: 'College Fee Payment',
      icon: 'pi-money-bill',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
                <i className="pi pi-building text-white text-sm" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  Admission Portal
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  Student Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <i className="pi pi-sign-out" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  isActive(tab.path)
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i
                  className={`${tab.icon} ${isActive(tab.path) ? 'text-black' : 'text-gray-400'}`}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Routes>
            <Route index element={<SubjectSelection token={token} />} />
            <Route
              path="subject-selection"
              element={<SubjectSelection token={token} />}
            />
            <Route path="fee-payment" element={<FeePayment token={token} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
