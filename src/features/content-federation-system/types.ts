export interface PublishingCategory {
  id: number;
  title: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface SubCategory {
  id: number;
  parentId: number;
  parentTitle: string;
  title: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  createdDate: string;
}

export type ContentStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'On Hold'
  | 'Returned'
  | 'Published'
  | 'Expired'
  | 'Archived';

export type ContentPriority = 'High' | 'Normal' | 'Low';
export type ContentVisibility = 'Public' | 'Internal' | 'Restricted';
export type ContentType =
  | 'Notice'
  | 'Circular'
  | 'News'
  | 'Event'
  | 'Announcement'
  | 'Policy'
  | 'Other';

export interface ContentItem {
  id: number;
  title: string;
  publishingCategoryId: number;
  publishingCategoryTitle: string;
  subCategoryId?: number;
  subCategoryTitle?: string;
  organizationalUnitId: number;
  organizationalUnitName: string;
  contentType: ContentType;
  description: string; // rich text HTML
  visibility: ContentVisibility;
  effectiveDate?: string;
  startDate: string;
  endDate?: string;
  expiryDate?: string;
  priority: ContentPriority;
  status: ContentStatus;
  remarks?: string;
  tags: string[];
  attachments: { name: string; size: string; type: string }[];
  createdBy: string;
  createdDate: string;
  submittedBy?: string;
  submittedDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface ReviewAction {
  id: number;
  contentId: number;
  action: 'Approve' | 'Reject' | 'Hold' | 'Return';
  remarks: string;
  performedBy: string;
  performedRole: string;
  timestamp: string;
}

export interface ActivityLogItem {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  ou: string;
  action: string;
  section: string;
  affectedItem: string;
  statusChange?: string;
  remarks?: string;
}
