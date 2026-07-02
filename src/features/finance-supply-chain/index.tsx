import { Navigate, Route, Routes } from 'react-router-dom';

// Dashboard
import Dashboard from './dashboard';

// Masters
import FinancialYear from './masters/financial-year';
import ChartOfAccounts from './masters/chart-of-accounts';
import CostCentres from './masters/cost-centres';
import BudgetCategories from './masters/budget-categories';
import BudgetHeads from './masters/budget-heads';
import BankAccounts from './masters/bank-accounts';
import TaxGstConfig from './masters/tax-gst-config';

// Budget Management
import BudgetCreation from './budget-management/budget-creation';
import BudgetAllocation from './budget-management/budget-allocation';
import BudgetRevision from './budget-management/budget-revision';
import BudgetTransfer from './budget-management/budget-transfer';
import BudgetUtilization from './budget-management/budget-utilization';

// Accounting
import ReceiptVoucher from './accounting/receipt-voucher';
import PaymentVoucher from './accounting/payment-voucher';
import JournalVoucher from './accounting/journal-voucher';
import ContraVoucher from './accounting/contra-voucher';
import LedgerPosting from './accounting/ledger-posting';
import BankReconciliation from './accounting/bank-reconciliation';

// Procurement
import VendorMaster from './procurement/vendor-master';
import PurchaseRequisition from './procurement/purchase-requisition';
import Rfq from './procurement/rfq';
import QuotationComparison from './procurement/quotation-comparison';
import PurchaseOrder from './procurement/purchase-order';
import GoodsReceipt from './procurement/goods-receipt';
import VendorBill from './procurement/vendor-bill';

// Inventory
import ItemMaster from './inventory/item-master';
import StockManagement from './inventory/stock-management';
import StockIssue from './inventory/stock-issue';
import StockTransfer from './inventory/stock-transfer';
import StockRegister from './inventory/stock-register';
import StockVerification from './inventory/stock-verification';
import DisposalWriteoff from './inventory/disposal-writeoff';

// Asset Management
import AssetRegister from './asset-management/asset-register';
import AssetAllocation from './asset-management/asset-allocation';
import Depreciation from './asset-management/depreciation';

// GST & Compliance
import GSTTaxReport from './gst-compliance/gst-tax-report';

// Financial Reports
import TrialBalance from './financial-reports/trial-balance';
import BalanceSheet from './financial-reports/balance-sheet';
import IncomeExpenditure from './financial-reports/income-expenditure';
import CashFlow from './financial-reports/cash-flow';
import BudgetReports from './financial-reports/budget-reports';

// Student Fees & Admissions
import FeeDetails from './student-fees/pages/FeeDetails';
import FeePayment from './student-fees/pages/FeePayment';
import StudentFeeLedger from './student-fees/pages/StudentFeeLedger';
import FeeCollection from './student-fees/pages/FeeCollection';
import Refunds from './student-fees/pages/Refunds';
import OnlinePayments from './student-fees/pages/OnlinePayments';
import StudentFeeReports from './student-fees/pages/Reports';
import ScholarshipAdjustment from './student-fees/pages/ScholarshipAdjustment';

// Admissions Finance
import PaymentVerification from './admissions-finance/pages/PaymentVerification';
import FeeStructure from './admissions-finance/pages/FeeStructure';
import PaymentReconciliation from './admissions-finance/pages/PaymentReconciliation';
import RefundManagement from './admissions-finance/pages/RefundManagement';
import Receipts from './admissions-finance/pages/Receipts';
import AdmissionsFinanceReports from './admissions-finance/pages/Reports';

export default function FinanceSupplyChain() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard/*" element={<Dashboard />} />

      {/* Masters */}
      <Route path="masters/financial-year/*" element={<FinancialYear />} />
      <Route path="masters/chart-of-accounts/*" element={<ChartOfAccounts />} />
      <Route path="masters/cost-centres/*" element={<CostCentres />} />
      <Route
        path="masters/budget-categories/*"
        element={<BudgetCategories />}
      />
      <Route path="masters/budget-heads/*" element={<BudgetHeads />} />
      <Route path="masters/bank-accounts/*" element={<BankAccounts />} />
      <Route path="masters/tax-gst-config/*" element={<TaxGstConfig />} />

      {/* Budget Management */}
      <Route
        path="budget-management/budget-creation/*"
        element={<BudgetCreation />}
      />
      <Route
        path="budget-management/budget-allocation/*"
        element={<BudgetAllocation />}
      />
      <Route
        path="budget-management/budget-revision/*"
        element={<BudgetRevision />}
      />
      <Route
        path="budget-management/budget-transfer/*"
        element={<BudgetTransfer />}
      />
      <Route
        path="budget-management/budget-utilization/*"
        element={<BudgetUtilization />}
      />

      {/* Accounting */}
      <Route path="accounting/receipt-voucher/*" element={<ReceiptVoucher />} />
      <Route path="accounting/payment-voucher/*" element={<PaymentVoucher />} />
      <Route path="accounting/journal-voucher/*" element={<JournalVoucher />} />
      <Route path="accounting/contra-voucher/*" element={<ContraVoucher />} />
      <Route path="accounting/ledger-posting/*" element={<LedgerPosting />} />
      <Route
        path="accounting/bank-reconciliation/*"
        element={<BankReconciliation />}
      />

      {/* Procurement */}
      <Route path="procurement/vendor-master/*" element={<VendorMaster />} />
      <Route
        path="procurement/purchase-requisition/*"
        element={<PurchaseRequisition />}
      />
      <Route path="procurement/rfq/*" element={<Rfq />} />
      <Route
        path="procurement/quotation-comparison/*"
        element={<QuotationComparison />}
      />
      <Route path="procurement/purchase-order/*" element={<PurchaseOrder />} />
      <Route path="procurement/goods-receipt/*" element={<GoodsReceipt />} />
      <Route path="procurement/vendor-bill/*" element={<VendorBill />} />

      {/* Inventory */}
      <Route path="inventory/item-master/*" element={<ItemMaster />} />
      <Route
        path="inventory/stock-management/*"
        element={<StockManagement />}
      />
      <Route path="inventory/stock-issue/*" element={<StockIssue />} />
      <Route path="inventory/stock-transfer/*" element={<StockTransfer />} />
      <Route path="inventory/stock-register/*" element={<StockRegister />} />
      <Route
        path="inventory/stock-verification/*"
        element={<StockVerification />}
      />
      <Route
        path="inventory/disposal-writeoff/*"
        element={<DisposalWriteoff />}
      />

      {/* Asset Management */}
      <Route
        path="asset-management/asset-register/*"
        element={<AssetRegister />}
      />
      <Route
        path="asset-management/asset-allocation/*"
        element={<AssetAllocation />}
      />
      <Route
        path="asset-management/depreciation/*"
        element={<Depreciation />}
      />

      {/* GST & Compliance */}
      <Route
        path="gst-compliance/gst-tax-report/*"
        element={<GSTTaxReport />}
      />

      {/* Financial Reports */}
      <Route
        path="financial-reports/trial-balance/*"
        element={<TrialBalance />}
      />
      <Route
        path="financial-reports/balance-sheet/*"
        element={<BalanceSheet />}
      />
      <Route
        path="financial-reports/income-expenditure/*"
        element={<IncomeExpenditure />}
      />
      <Route path="financial-reports/cash-flow/*" element={<CashFlow />} />
      <Route
        path="financial-reports/budget-reports/*"
        element={<BudgetReports />}
      />

      {/* Student Fees */}
      <Route path="student-fees/fee-details/*" element={<FeeDetails />} />
      <Route path="student-fees/fee-payment/*" element={<FeePayment />} />
      <Route
        path="student-fees/student-fee-ledger/*"
        element={<StudentFeeLedger />}
      />
      <Route path="student-fees/fee-collection/*" element={<FeeCollection />} />
      <Route path="student-fees/refunds/*" element={<Refunds />} />
      <Route
        path="student-fees/online-payments/*"
        element={<OnlinePayments />}
      />
      <Route path="student-fees/reports/*" element={<StudentFeeReports />} />
      <Route
        path="student-fees/scholarship-adjustment/*"
        element={<ScholarshipAdjustment />}
      />

      {/* Admissions Finance */}
      <Route
        path="admissions-finance/payment-verification/*"
        element={<PaymentVerification />}
      />
      <Route
        path="admissions-finance/fee-structure/*"
        element={<FeeStructure />}
      />
      <Route
        path="admissions-finance/reconciliation/*"
        element={<PaymentReconciliation />}
      />
      <Route
        path="admissions-finance/refunds/*"
        element={<RefundManagement />}
      />
      <Route path="admissions-finance/receipts/*" element={<Receipts />} />
      <Route
        path="admissions-finance/reports/*"
        element={<AdmissionsFinanceReports />}
      />
    </Routes>
  );
}
