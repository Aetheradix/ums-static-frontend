export type FinalDecisionStatus =
  | 'Approved'
  | 'Rejected'
  | 'Deferred'
  | 'Returned for Compliance';

export interface StandingCommitteeDecisionItem {
  id: number;
  collegeId: number;
  collegeName: string;
  applicationNo: string;
  collegeCode?: string;
  collegeType?: string;
  district?: string;
  coursesApplied?: string;
  meetingId?: number;
  meetingDate: Date | string;
  committeeMembers: string;
  discussionObservation: string;
  finalDecision: FinalDecisionStatus;
  decisionRemarks: string;
  conditionsRecommendations?: string;
  complianceRequired?: boolean;
  complianceDueDate?: Date | string | null;
  supportingDocumentName?: string;
  supportingDocumentUrl?: string;
  decisionDate: Date | string;
  decisionReferenceNo?: string;
  recordedBy?: string;
}

export interface CollegeApplicationOption {
  id: number;
  name: string;
  applicationNo: string;
  collegeCode: string;
  collegeType: string;
  district: string;
  coursesApplied: string;
  lastMeetingDate?: Date;
  committeeMembers?: string;
  preliminaryObservation?: string;
}
