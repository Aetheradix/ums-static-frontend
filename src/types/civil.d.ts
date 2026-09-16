/**
 * CivilManagement — Global TypeScript namespace for Civil Infrastructure module.
 * Mirrors the dynamic UMS_FrontEnd/src/features/civil type contracts.
 * All types are globally available without import (ambient declaration).
 */
declare namespace CivilManagement {
  // ─── Masters ─────────────────────────────────────────────────────────────────

  interface CivilProject {
    id: string;
    name: string;
    description: string;
    campus: string;
    location: string;
    isActive: boolean;
  }

  interface SORType {
    id: string;
    code: string;
    name: string;
    isActive: boolean;
  }

  interface SORChapter {
    id: string;
    sorTypeId: string;
    sorTypeName?: string;
    chapterNo: string;
    name: string;
    isActive: boolean;
  }

  interface SORSubject {
    id: string;
    sorChapterId: string;
    sorChapterName?: string;
    sorTypeId?: string;
    name: string;
    isActive: boolean;
  }

  interface WorkCategoryMaster {
    id: string;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
  }

  interface WorkDepartmentMaster {
    id: string;
    code: string;
    name: string;
    parentCategoryId?: string;
    isActive: boolean;
  }

  interface FundingSourceMaster {
    id: string;
    code: string;
    name: string;
    sourceType:
      | 'Central Govt'
      | 'State Govt'
      | 'UGC'
      | 'University'
      | 'External'
      | 'Other';
    isActive: boolean;
  }

  interface MandateDocument {
    id: string;
    name: string;
    description: string;
    applicableCategories: string[]; // workCategoryIds
    isMandatory: boolean;
    maxFileSizeMB: number;
    allowedFormats: string[]; // e.g. ['pdf', 'jpg']
    isActive: boolean;
  }

  interface MBStatusMaster {
    id: string;
    code: string;
    name: string;
    description?: string;
    sequence: number;
    isActive: boolean;
  }

  interface StatusMaster {
    id: string;
    module: string; // 'work' | 'tender' | 'mb' | 'ra-bill'
    code: string;
    label: string;
    colorHex?: string;
    sequence: number;
    isActive: boolean;
  }

  // ─── Work Registration ────────────────────────────────────────────────────────

  interface ExternalEngineer {
    engineerName: string;
    mobileNumber: string;
  }

  interface WorkDocumentEntry {
    mandateDocumentId: string;
    file: File;
    fileName?: string;
  }

  interface WorkRegistrationDocumentItem {
    documentId: string;
    mandateDocumentId: string;
    mandateDocumentName: string;
    fileName: string;
    uploadedAt: string;
  }

  interface WorkItem {
    workRegistrationId: string;
    code: string;
    name: string;
    projectId: string;
    projectDescription?: string;
    workCategoryId: string;
    workCategoryName?: string;
    subCategoryId: string;
    subCategoryName?: string;
    priorityLevel: 'High' | 'Medium' | 'Low';
    fundingSourceId: string;
    fundingSourceName?: string;
    siteEngineerSource: 'Internal' | 'External';
    employeeIds?: string[];
    externalEngineers?: ExternalEngineer[];
    workBasis: 'SOR Based' | 'BOQ Based';
    executionRoute: 'Internal' | 'External Agency';
    status: string;
    isActive: boolean;
    documents?: WorkRegistrationDocumentItem[];
    // Legacy fields preserved for backward compat
    department?: string;
    campus?: string;
    location?: string;
    estimatedCost?: number;
    aaAmount?: number;
    tsAmount?: number;
    contractAmount?: number;
    startDate?: string;
    expectedEndDate?: string;
    siteEngineer?: string;
    physicalProgress?: number;
    financialProgress?: number;
  }

  interface WorkForm {
    projectId: string;
    name: string;
    workCategoryId: string;
    subCategoryId: string;
    priorityLevel: string;
    fundingSourceId: string;
    siteEngineerSource: string;
    employeeIds?: string[];
    externalEngineers?: ExternalEngineer[];
    workBasis: string;
    executionRoute: string;
    status?: string;
  }

  // ─── Administrative Sanction ──────────────────────────────────────────────────

  interface AdministrativeSanctionItem {
    workRegistrationId: string;
    administrativeSanctionId?: string;
    code: string;
    name: string;
    projectDescription?: string;
    status: string;
    estimatedCost: number;
    administrativeApprovalAmount?: number;
    aaOrderNumber?: string;
    aaGrantedBy?: string;
    aaGrantedByDesignation?: string;
    aaDate?: string;
    aaRemarks?: string;
    isActive: boolean;
    canGrantAa?: boolean;
    workBasis?: string;
    fundingSourceName?: string;
  }

  interface AdministrativeSanctionForm {
    workRegistrationId: string;
    administrativeApprovalAmount: number;
    remark?: string;
    aaOrderNumber?: string;
    aaGrantedByDesignation?: string;
  }

  // ─── Technical Sanction ───────────────────────────────────────────────────────

  interface TechnicalSanctionItem {
    workRegistrationId: string;
    technicalSanctionId?: string;
    code: string;
    name: string;
    status: string;
    tsStatus?: string;
    administrativeApprovalAmount?: number;
    technicalSanctionAmount?: number;
    tsOrderNumber?: string;
    tsDrawingRef?: string;
    tsStructuralEngineer?: string;
    tsRemarks?: string;
    tsDate?: string;
    isActive: boolean;
    canGrantTs?: boolean;
    workBasis?: string;
  }

  interface TechnicalSanctionForm {
    workRegistrationId: string;
    technicalSanctionAmount: number;
    tsOrderNumber?: string;
    tsDrawingRef?: string;
    tsStructuralEngineer?: string;
    remark?: string;
  }

  // ─── Budget Allocation ────────────────────────────────────────────────────────

  interface BudgetAllocationItem {
    budgetAllocationId: string;
    workRegistrationId: string;
    workCode?: string;
    workName?: string;
    financialYearId: string;
    financialYear?: string;
    budgetHeadId: string;
    budgetHeadName?: string;
    budgetHeadCode?: string;
    allocatedAmount: number;
    utilizedAmount: number;
    balanceAmount?: number;
    status: string;
    isActive: boolean;
  }

  interface BudgetAllocationForm {
    workRegistrationId: string;
    financialYearId: string;
    budgetHeadId: string;
    allocatedAmount: number;
    remarks?: string;
  }

  interface FinancialYear {
    id: string;
    financialYear: string; // '2025-26'
    startDate: string;
    endDate: string;
    isActive: boolean;
  }

  interface BudgetHead {
    id: string;
    code: string;
    name: string;
    parentId?: string;
    isActive: boolean;
  }

  // ─── Annual Work Plan ─────────────────────────────────────────────────────────

  interface AWPItem {
    id: string;
    awpId: string;
    workName: string;
    workCategoryId: string;
    workCategoryName?: string;
    estimatedCost: number;
    fundingSourceId: string;
    fundingSourceName?: string;
    priority: 'High' | 'Medium' | 'Low';
    remarks?: string;
  }

  interface AnnualWorkPlan {
    id: string;
    financialYear: string;
    category: 'Capital' | 'Revenue Maintenance';
    totalBudget: number;
    ecApprovalDate?: string;
    ecResolutionNo?: string;
    preparedBy?: string;
    status: 'Draft' | 'EC Submitted' | 'EC Approved' | 'Finance Allocated';
    items: AWPItem[];
    remarks?: string;
  }

  // ─── Statutory Compliance ─────────────────────────────────────────────────────

  interface StatutoryClearance {
    id: string;
    workId: string;
    workName?: string;
    clearanceType: string;
    authority: string;
    applicationDate: string;
    expectedDate?: string;
    receivedDate?: string;
    validUpto?: string;
    referenceNo?: string;
    documentFileName?: string;
    isBlocking: boolean;
    status: 'Applied' | 'Received' | 'Not Required' | 'Expired' | 'Rejected';
    remarks?: string;
  }

  // ─── Labour Compliance ────────────────────────────────────────────────────────

  interface LabourCompliance {
    id: string;
    contractorId: string;
    contractorName?: string;
    workId: string;
    workName?: string;
    labourLicenseNo: string;
    labourLicenseValidity: string;
    workmenCount: number;
    epfRegistrationNo: string;
    esiRegistrationNo: string;
    bocwRegNo: string;
    bocwCessPaid: number;
    bocwCessDate?: string;
    verifiedBy?: string;
    verifiedOn?: string;
    status: 'Compliant' | 'Non-Compliant' | 'Pending';
    remarks?: string;
  }

  // ─── Site Handover ────────────────────────────────────────────────────────────

  interface SiteHandover {
    id: string;
    workId: string;
    workName?: string;
    possessionCertNo: string;
    handoverDate: string;
    handedOverBy: string;
    handedOverDesignation?: string;
    receivedBy: string;
    receivedDesignation?: string;
    engineerPresent: string;
    encumbrancesCleared: string[];
    preConstructionPhotoCount: number;
    geoLatitude?: string;
    geoLongitude?: string;
    hoarding: boolean;
    safetySetup: boolean;
    status: 'Pending' | 'Issued';
    remarks?: string;
  }

  // ─── Deviation Statement ──────────────────────────────────────────────────────

  type DeviationType =
    | 'Extra Item'
    | 'Excess Quantity'
    | 'Substituted Item'
    | 'Reduced Quantity';
  type DeviationApprovalLevel = 'AE' | 'EE' | 'SE/Admin';

  interface DeviationStatement {
    id: string;
    dsNo: string;
    workId: string;
    workName?: string;
    boqItemId?: string;
    boqItemDescription?: string;
    deviationType: DeviationType;
    originalQty?: number;
    deviationQty: number;
    unit: string;
    govtRate: number;
    deviationAmount: number;
    deviationPercent?: number;
    reason: string;
    justification: string;
    submittedBy: string;
    submittedDate: string;
    requiredApprovalLevel: DeviationApprovalLevel;
    approvedBy?: string;
    approvedDate?: string;
    approvalRemarks?: string;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  }

  // ─── TPI Inspection Reports ───────────────────────────────────────────────────

  type NCRSeverity = 'Observation' | 'Minor' | 'Major' | 'Critical';

  interface NonConformance {
    id: string;
    reportId: string;
    description: string;
    location: string;
    severity: NCRSeverity;
    photoCount: number;
    atrSubmittedDate?: string;
    atrDescription?: string;
    closedDate?: string;
    status: 'Open' | 'ATR Submitted' | 'Closed';
  }

  interface TPIInspectionReport {
    id: string;
    reportNo: string;
    workId: string;
    workName?: string;
    tpiAgencyId: string;
    tpiAgencyName?: string;
    tpiEngineerName: string;
    visitDate: string;
    milestoneId?: string;
    milestoneName?: string;
    physicalProgressObserved: number;
    qualityObservations: string;
    nonConformances: NonConformance[];
    overallRating: 'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory';
    nextVisitDate?: string;
    status: 'Draft' | 'Submitted' | 'Acknowledged';
  }

  // ─── Utilization Certificate ──────────────────────────────────────────────────

  interface UCExpenditure {
    billNo: string;
    billDate: string;
    grossAmount: number;
    netPaid: number;
  }

  interface UtilizationCertificate {
    id: string;
    ucNo: string;
    workId: string;
    workName?: string;
    fundingSourceId: string;
    fundingSourceName?: string;
    grantSanctionNo: string;
    grantSanctionAmount: number;
    periodFrom: string;
    periodTo: string;
    previousExpenditure: number;
    currentExpenditure: number;
    cumulativeExpenditure: number;
    balanceGrant: number;
    expenditures: UCExpenditure[];
    submittedToAgency: boolean;
    submissionDate?: string;
    acknowledgementNo?: string;
    status: 'Draft' | 'Certified' | 'Submitted' | 'Acknowledged';
    certifiedBy?: string;
    certifiedDate?: string;
  }

  // ─── Asset Register ───────────────────────────────────────────────────────────

  interface CivilAsset {
    id: string;
    assetCode: string;
    workId: string;
    workName?: string;
    assetName: string;
    assetCategory:
      | 'Building'
      | 'Road'
      | 'Electrical'
      | 'Civil Infrastructure'
      | 'Hostel'
      | 'Other';
    campus: string;
    location: string;
    areaSqm?: number;
    capitalizationDate: string;
    capitalizationValue: number;
    usefulLifeYears: number;
    depreciationMethod: 'SLM' | 'WDV';
    depreciationRate: number;
    accumulatedDepreciation?: number;
    bookValue?: number;
    custodian?: string;
    status: 'Active' | 'Under Maintenance' | 'Disposed';
    remarks?: string;
  }

  // ─── Price Variation Clause (PVC) ────────────────────────────────────────────

  interface PriceIndex {
    id: string;
    indexType: 'WPI' | 'CPI';
    month: string; // 'YYYY-MM'
    value: number;
    publishedBy: string;
  }

  interface PVCCalculation {
    id: string;
    pvcNo: string;
    workId: string;
    workName?: string;
    workOrderId: string;
    billingPeriodFrom: string;
    billingPeriodTo: string;
    baseWPI: number;
    currentWPI: number;
    baseCPI: number;
    currentCPI: number;
    materialComponent: number; // Vm — % of bill amount for materials
    labourComponent: number; // VL — % of bill amount for labour
    billAmount: number;
    pvcAmountMaterial: number;
    pvcAmountLabour: number;
    totalPVCAmount: number;
    approvedBy?: string;
    approvedDate?: string;
    linkedRABillId?: string;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Linked to Bill';
  }

  // ─── Agency Registration (Unified) ───────────────────────────────────────────

  interface QualityLabItem {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    mobile: string;
    nablAccreditation: string;
    nablValidity?: string;
    scopeOfTesting: string;
    address: string;
    isActive: boolean;
  }

  interface TPIAgencyItem {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    mobile: string;
    licenseNo: string;
    licenseValidity?: string;
    address: string;
    contractorClass?: string;
    isActive: boolean;
  }

  interface VendorAgencyItem {
    id: string;
    regNo: string;
    companyName: string;
    proprietorName: string;
    grade: string;
    contractorClass?: string;
    registeredWithPWD: boolean;
    gstNo: string;
    panNo: string;
    bankName: string;
    bankAccount: string;
    ifscCode: string;
    contactPhone: string;
    email: string;
    address: string;
    securityDepositPaid: number;
    performanceBond: number;
    isActive: boolean;
    status: 'Active' | 'Blacklisted' | 'Suspended' | 'Pending Verification';
    completedWorks?: number;
    totalWorksDone?: number;
  }

  // ─── Work Suspension & Foreclosure ───────────────────────────────────────────

  interface WorkSuspensionForeclosure {
    id: string;
    workId: string;
    workName?: string;
    workOrderId: string;
    workOrderNo?: string;
    contractorName?: string;
    actionType: 'Suspension' | 'Foreclosure' | 'Revocation';
    clauseReference: string; // e.g. 'Clause 15 (Suspension)' | 'Clause 13 (Foreclosure)'
    orderNo: string;
    orderDate: string;
    effectiveDate: string;
    reason:
      | 'Court Stay'
      | 'Fund Crunch'
      | 'Site Dispute'
      | 'Design Revision'
      | 'Contractor Default'
      | 'Department Decision'
      | 'Other';
    reasonDescription: string;
    sitePreservationExpenses?: number;
    finalMeasurementDate?: string;
    settlementAmount?: number;
    compensationPaid?: number;
    orderedBy: string;
    status: 'Active Suspension' | 'Revoked' | 'Foreclosed';
    remarks?: string;
  }

  // ─── Contract Agreement Details ──────────────────────────────────────────────

  interface ContractAgreementDetails {
    agreementNo: string;
    agreementDate: string;
    stampDutyAmount: number;
    stampDutyReceiptNo: string;
    registrationStatus: 'Registered' | 'Notary Stamped' | 'Pending';
    scannedAgreementDoc?: string;
    bgNo?: string;
    bgBank?: string;
    bgAmount?: number;
    bgExpiryDate?: string;
    mobAdvanceBgNo?: string;
    mobAdvanceBgBank?: string;
    mobAdvanceBgAmount?: number;
    mobAdvanceBgExpiry?: string;
  }
}
