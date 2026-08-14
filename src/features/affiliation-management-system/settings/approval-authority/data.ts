export interface ApprovalAuthorityItem {
  approvalAuthorityId: number;
  educationType: string;
  authorityName: string;
  documentLabel: string;
  isActive: boolean;
}

// Master mapping of Education Type → Approval/Regulatory Authority and the
// document-upload label shown on the college registration form.
export const APPROVAL_AUTHORITY_DATA: ApprovalAuthorityItem[] = [
  {
    approvalAuthorityId: 1,
    educationType: 'General Higher Education',
    authorityName: 'UGC',
    documentLabel: 'Upload UGC Approval / Recognition Document',
    isActive: true,
  },
  {
    approvalAuthorityId: 2,
    educationType: 'Technical & Management Education',
    authorityName: 'AICTE',
    documentLabel: 'Upload AICTE Approval / NOC Document',
    isActive: true,
  },
  {
    approvalAuthorityId: 3,
    educationType: 'Medical & Dental Education',
    authorityName: 'NMC / DCI',
    documentLabel: 'Upload NMC / DCI Approval / Recognition Document',
    isActive: true,
  },
  {
    approvalAuthorityId: 4,
    educationType: 'Teacher Education',
    authorityName: 'NCTE',
    documentLabel: 'Upload NCTE Approval / Recognition Document',
    isActive: true,
  },
  {
    approvalAuthorityId: 5,
    educationType: 'Pharmacy Education',
    authorityName: 'PCI',
    documentLabel: 'Upload PCI Approval / Recognition Document',
    isActive: true,
  },
  {
    approvalAuthorityId: 6,
    educationType: 'Agriculture & Veterinary Education',
    authorityName: 'ICAR / VCI',
    documentLabel: 'Upload ICAR / VCI Approval / Recognition Document',
    isActive: true,
  },
  {
    approvalAuthorityId: 7,
    educationType: 'Law Education',
    authorityName: 'BCI',
    documentLabel: 'Upload BCI Approval / Recognition Document',
    isActive: true,
  },
];
