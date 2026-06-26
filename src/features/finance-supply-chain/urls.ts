// =============================================================================
// Finance & Supply Chain — URL Constants
// =============================================================================

const BASE = '/finance-supply-chain';

// ─── Masters ─────────────────────────────────────────────────────────────────
const masters = `${BASE}/masters`;

export const financeMasterUrls = {
  financialYear: {
    root: `${masters}/financial-year`,
    create: `${masters}/financial-year/create`,
  },
  chartOfAccounts: {
    root: `${masters}/chart-of-accounts`,
    create: `${masters}/chart-of-accounts/create`,
  },
  costCentres: {
    root: `${masters}/cost-centres`,
    create: `${masters}/cost-centres/create`,
  },
  budgetCategories: {
    root: `${masters}/budget-categories`,
    create: `${masters}/budget-categories/create`,
  },
  budgetHeads: {
    root: `${masters}/budget-heads`,
    create: `${masters}/budget-heads/create`,
  },
  bankAccounts: {
    root: `${masters}/bank-accounts`,
    create: `${masters}/bank-accounts/create`,
  },
  taxGstConfig: {
    root: `${masters}/tax-gst-config`,
    create: `${masters}/tax-gst-config/create`,
  },
};

// ─── Budget Management ────────────────────────────────────────────────────────
const budget = `${BASE}/budget-management`;

export const budgetManagementUrls = {
  budgetCreation: {
    root: `${budget}/budget-creation`,
    create: `${budget}/budget-creation/create`,
  },
  budgetAllocation: {
    root: `${budget}/budget-allocation`,
    create: `${budget}/budget-allocation/create`,
  },
  budgetRevision: {
    root: `${budget}/budget-revision`,
    create: `${budget}/budget-revision/create`,
  },
  budgetTransfer: {
    root: `${budget}/budget-transfer`,
    create: `${budget}/budget-transfer/create`,
  },
  budgetUtilization: { root: `${budget}/budget-utilization` },
};

// ─── Accounting ───────────────────────────────────────────────────────────────
const accounting = `${BASE}/accounting`;

export const accountingUrls = {
  receiptVoucher: {
    root: `${accounting}/receipt-voucher`,
    create: `${accounting}/receipt-voucher/create`,
  },
  paymentVoucher: {
    root: `${accounting}/payment-voucher`,
    create: `${accounting}/payment-voucher/create`,
  },
  journalVoucher: {
    root: `${accounting}/journal-voucher`,
    create: `${accounting}/journal-voucher/create`,
  },
  contraVoucher: {
    root: `${accounting}/contra-voucher`,
    create: `${accounting}/contra-voucher/create`,
  },
  ledgerPosting: { root: `${accounting}/ledger-posting` },
  bankReconciliation: { root: `${accounting}/bank-reconciliation` },
};

// ─── Procurement ──────────────────────────────────────────────────────────────
const procurement = `${BASE}/procurement`;

export const procurementUrls = {
  vendorMaster: {
    root: `${procurement}/vendor-master`,
    create: `${procurement}/vendor-master/create`,
  },
  purchaseRequisition: {
    root: `${procurement}/purchase-requisition`,
    create: `${procurement}/purchase-requisition/create`,
  },
  rfq: { root: `${procurement}/rfq`, create: `${procurement}/rfq/create` },
  quotationComparison: { root: `${procurement}/quotation-comparison` },
  purchaseOrder: {
    root: `${procurement}/purchase-order`,
    create: `${procurement}/purchase-order/create`,
  },
  goodsReceipt: {
    root: `${procurement}/goods-receipt`,
    create: `${procurement}/goods-receipt/create`,
  },
  vendorBill: {
    root: `${procurement}/vendor-bill`,
    create: `${procurement}/vendor-bill/create`,
  },
};

// ─── Inventory ────────────────────────────────────────────────────────────────
const inventory = `${BASE}/inventory`;

export const inventoryUrls = {
  itemMaster: {
    root: `${inventory}/item-master`,
    create: `${inventory}/item-master/create`,
  },
  stockManagement: { root: `${inventory}/stock-management` },
  stockIssue: {
    root: `${inventory}/stock-issue`,
    create: `${inventory}/stock-issue/create`,
  },
  stockTransfer: {
    root: `${inventory}/stock-transfer`,
    create: `${inventory}/stock-transfer/create`,
  },
  stockRegister: {
    root: `${inventory}/stock-register`,
  },
  stockVerification: {
    root: `${inventory}/stock-verification`,
  },
  disposalWriteoff: {
    root: `${inventory}/disposal-writeoff`,
  },
};

// ─── Asset Management ─────────────────────────────────────────────────────────
const assets = `${BASE}/asset-management`;

export const assetManagementUrls = {
  assetRegister: {
    root: `${assets}/asset-register`,
    create: `${assets}/asset-register/create`,
  },
  assetAllocation: {
    root: `${assets}/asset-allocation`,
    create: `${assets}/asset-allocation/create`,
  },
  depreciation: { root: `${assets}/depreciation` },
};

// ─── GST & Compliance ─────────────────────────────────────────────────────────
const gst = `${BASE}/gst-compliance`;

export const gstComplianceUrls = {
  gstTransactions: { root: `${gst}/gst-transactions` },
  gstrReports: { root: `${gst}/gstr-reports` },
  taxReports: { root: `${gst}/tax-reports` },
};

// ─── Financial Reports ────────────────────────────────────────────────────────
const reports = `${BASE}/financial-reports`;

export const financialReportsUrls = {
  trialBalance: { root: `${reports}/trial-balance` },
  balanceSheet: { root: `${reports}/balance-sheet` },
  incomeExpenditure: { root: `${reports}/income-expenditure` },
  cashFlow: { root: `${reports}/cash-flow` },
  fundFlow: { root: `${reports}/fund-flow` },
  budgetReports: { root: `${reports}/budget-reports` },
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const financeSupplyChainUrls = {
  root: BASE,
  dashboard: `${BASE}/dashboard`,
  masters: financeMasterUrls,
  budgetManagement: budgetManagementUrls,
  accounting: accountingUrls,
  procurement: procurementUrls,
  inventory: inventoryUrls,
  assetManagement: assetManagementUrls,
  gstCompliance: gstComplianceUrls,
  financialReports: financialReportsUrls,
};
