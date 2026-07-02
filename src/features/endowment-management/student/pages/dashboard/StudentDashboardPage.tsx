import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormPage, FormPopup, StatCard } from 'shared/new-components';
import '../../../Endowment.css';
import {
  useApplications,
  useDisbursements,
  useSchemes,
} from '../../../queries';
import { endowmentUrls } from '../../../urls';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { data: applications } = useApplications();
  const { data: disbursements } = useDisbursements();
  const { data: schemes } = useSchemes();

  const [isBankPopupOpen, setIsBankPopupOpen] = useState(false);
  const [isIncomePopupOpen, setIsIncomePopupOpen] = useState(false);

  // Bank form state
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Income form state
  const [income, setIncome] = useState('');
  const [fy, setFy] = useState('FY 2025-26');
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const openSchemes = schemes?.filter(s => s.status === 'Open').length || 0;

  // For the mock, we pretend all applications belong to the current student
  const myApplications = applications || [];
  const totalApplied = myApplications.length;
  const selectedCount = myApplications.filter(
    app => app.status === 'Selected'
  ).length;

  // Assuming all disbursements are to this student
  const totalAmountReceived =
    disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;

  const appStatusCounts = myApplications.reduce((acc: any, app: any) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(appStatusCounts || {}),
    datasets: [
      {
        data: Object.values(appStatusCounts || {}),
        backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444'],
      },
    ],
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Application Status Breakdown' },
    },
  };

  const handleBankSubmit = () => {
    if (!bankName || !accountNo || !ifsc) {
      ToastService.error('Please fill in all bank details');
      return;
    }
    ToastService.success('Bank details updated successfully!');
    setIsBankPopupOpen(false);
  };

  const handleIncomeSubmit = () => {
    if (!income) {
      ToastService.error('Please enter annual income');
      return;
    }
    if (!isFileUploaded) {
      ToastService.error('Please upload your income certificate copy');
      return;
    }
    ToastService.success(
      'Income details and certificate uploaded successfully!'
    );
    setIsIncomePopupOpen(false);
  };

  return (
    <FormPage
      title="My Endowment Dashboard"
      description="Welcome back! Here's what's happening with your endowment applications and awards."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Student Portal', to: '/endowment-management/student' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Eligible Open Schemes"
            value={openSchemes}
            icon="search"
            colorScheme="blue"
          />
          <StatCard
            title="My Applications"
            value={totalApplied}
            icon="folder_open"
            colorScheme="orange"
          />
          <StatCard
            title="Selected Awards"
            value={selectedCount}
            icon="workspace_premium"
            colorScheme="green"
          />
          <StatCard
            title="Total Amount Received"
            value={`₹${totalAmountReceived.toLocaleString()}`}
            icon="currency_rupee"
            colorScheme="purple"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard title="Application Status Breakdown" icon="pie_chart">
            <div className="w-full h-72">
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard title="Quick Actions" icon="bolt">
            <div className="flex flex-col gap-4">
              <div
                className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => navigate(endowmentUrls.student.browseSchemes())}
              >
                <div className="bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">
                    search
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Browse Open Schemes
                  </h4>
                  <p className="text-sm text-gray-500">
                    View and apply to eligible schemes
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 cursor-pointer transition-colors"
                onClick={() => setIsBankPopupOpen(true)}
              >
                <div className="bg-orange-500 text-white p-3 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">
                    account_balance
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Update Bank Account
                  </h4>
                  <p className="text-sm text-gray-500">
                    Add or edit disbursement bank details
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 p-4 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 cursor-pointer transition-colors"
                onClick={() => setIsIncomePopupOpen(true)}
              >
                <div className="bg-green-500 text-white p-3 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">
                    upload_file
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Upload Income Certificate
                  </h4>
                  <p className="text-sm text-gray-500">
                    Provide proof for scholarship eligibility
                  </p>
                </div>
              </div>
            </div>
          </FormCard>
        </div>

        {isBankPopupOpen && (
          <FormPopup
            visible={isBankPopupOpen}
            title="Update Bank Account Details"
            onHide={() => setIsBankPopupOpen(false)}
            size="default"
            footer={
              <div className="flex gap-2 justify-end w-full">
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => setIsBankPopupOpen(false)}
                />
                <Button
                  label="Save Changes"
                  variant="primary"
                  onClick={handleBankSubmit}
                />
              </div>
            }
          >
            <div className="space-y-4 p-4">
              <TextBox
                label="Bank Name"
                placeholder="e.g. State Bank of India"
                value={bankName}
                onChange={val => setBankName(String(val))}
                required
              />
              <TextBox
                label="Account Number"
                placeholder="Enter account number"
                value={accountNo}
                onChange={val => setAccountNo(String(val))}
                required
              />
              <TextBox
                label="IFSC Code"
                placeholder="e.g. SBIN0001234"
                value={ifsc}
                onChange={val => setIfsc(String(val))}
                required
              />
            </div>
          </FormPopup>
        )}

        {isIncomePopupOpen && (
          <FormPopup
            visible={isIncomePopupOpen}
            title="Upload Latest Income Certificate"
            onHide={() => setIsIncomePopupOpen(false)}
            size="default"
            footer={
              <div className="flex gap-2 justify-end w-full">
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => setIsIncomePopupOpen(false)}
                />
                <Button
                  label="Submit Details"
                  variant="primary"
                  onClick={handleIncomeSubmit}
                />
              </div>
            }
          >
            <div className="space-y-4 p-4">
              <DropDownList
                label="Financial Year"
                data={['FY 2025-26', 'FY 2024-25'].map(v => ({
                  text: v,
                  value: v,
                }))}
                textField="text"
                valueField="value"
                value={fy}
                onChange={val => setFy((val as string) || 'FY 2025-26')}
                required
              />
              <TextBox
                label="Annual Family Income (₹)"
                type="number"
                placeholder="e.g. 450000"
                value={income}
                onChange={val => setIncome(String(val))}
                required
              />
              <div className="border border-gray-200 rounded p-4 space-y-3">
                <h5 className="font-medium text-gray-700 text-sm">
                  Supporting Certificate copy
                </h5>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    Certificate PDF{' '}
                    {isFileUploaded && (
                      <span className="text-emerald-600 ml-2 font-bold">
                        (Selected)
                      </span>
                    )}
                  </span>
                  <Button
                    label={isFileUploaded ? 'Change File' : 'Upload File'}
                    size="small"
                    variant="outlined"
                    icon="upload_file"
                    onClick={() => {
                      setIsFileUploaded(true);
                      ToastService.success('Income Certificate attached!');
                    }}
                  />
                </div>
              </div>
            </div>
          </FormPopup>
        )}
      </div>
    </FormPage>
  );
}
