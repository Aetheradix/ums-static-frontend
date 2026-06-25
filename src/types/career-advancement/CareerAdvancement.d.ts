declare namespace CareerAdvancement {
  export interface EmployeeSelfAssessmentForm {
    selfAssessmentId?: number;
    employeeId: number;
    tasksProject: string;
    workOutputScore: number | null;
    workOutputRemark?: string;
    sessionId: number | null;
    reviewingHeadId: number | null;
    leadershipQuality: string;
    communicationSkill: string;
    integrity: string;
    adaptability: string;
    teamWork: string;
    domainKnowledge: string;
    problemSolvingAbility: string;
    decisionMaking: string;
    analyticalSkill: string;
    functionalRemark?: string;
    additionalRemarks?: string;
    supportingDocument: File | null;
    status: string;
    isActive: boolean;
  }

  export interface PerformanceAppraisalApplicationForm {
    employeeName: string;
    employeeId: string;
    designationId: number | null;
    casteId: number | null;
    departmentId: number | null;
    dateOfBirth: Date | null;
    dateOfJoining: Date | null;
    stageApplyingFor: string;
    applicationSubmissionDate: Date | null;
    lastPromotionDate: Date | null;
  }

  export interface CreatePerformanceAppraisalApplicationPayload {
    employeeId: number;
    employeeName: string;
    designationId: number;
    casteId: number;
    departmentId: number;
    dateOfBirth: Date;
    dateOfJoining: Date;
    stageApplyingFor: string;
    applicationSubmissionDate: Date;
    lastPromotionDate: Date;
    status: string;
    isActive: boolean;
  }
}
