declare namespace CareerAdvancement {
  interface EmployeeSelfAssessmentForm {
    employeeId: number;
    reviewingHeadId: number | null;
    sessionId: number | null;
    tasksProject: string;
    workOutputScore: number | null;
    workOutputRemark?: string | null;
    leadershipQuality: string;
    communicationSkill: string;
    integrity: string;
    adaptability: string;
    teamWork: string;
    domainKnowledge: string;
    problemSolvingAbility: string;
    decisionMaking: string;
    analyticalSkill: string;
    functionalRemark?: string | null;
    additionalRemarks?: string | null;
    supportingDocument?: File | null | string;
    status: string;
    isActive?: boolean;
    selfAssessmentId?: number;
  }
}
