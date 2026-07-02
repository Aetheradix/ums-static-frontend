import React from 'react';
declare global {
  namespace CareerAdvancement {
    // ─── EMPLOYEE ───────────────────────────────────────────────────────
    interface Employee {
      id: string;
      name: string;
      designation: string;
      department: string;
      dateOfBirth?: string;
      category?: string;
      group?: string;
      employmentType?: string;
      dateOfJoining?: string;
      email?: string;
      phone?: string;
    }

    // ─── APAR (Annual Performance Appraisal Report) ────────────────────
    interface CASAPARApplication {
      id: string;
      employeeId: string;
      employeeName: string;
      designation: string;
      department: string;
      session: string;
      stage: string;
      status:
        | 'Draft'
        | 'Pending'
        | 'Forwarded'
        | 'Under Review'
        | 'Completed'
        | 'Rejected';
      currentHandler?: string;
      submittedOn?: string;
      lastUpdated?: string;

      // Admin initialization data
      dateOfBirth?: string;
      category?: string;
      group?: string;
      belongsToSCST?: 'Yes' | 'No';
      employmentType?: 'Permanent' | 'Temporary' | 'Officiating';
      sectionsServed?: string;
      serviceLengthUnderReviewer?: string;
      dateOfContinuousAppointment?: string;
      employeeValidityDate?: string;
      reportingOfficerValidityDate?: string;
      reviewingOfficerValidityDate?: string;

      // Employee self-assessment
      workOutputDescription?: string;
      workOutputScore?: number;
      workOutputRemarks?: string;
      personalAttributes?: PersonalAttributes;
      functionalCompetency?: FunctionalCompetency;
      functionalCompetencyRemarks?: string;
      supportingDocuments?: string[];
      additionalRemarks?: string;

      // Reporting Officer assessment
      reportingOfficerWorkScore?: number;
      reportingOfficerPersonalScore?: number;
      reportingOfficerFunctionalScore?: number;
      reportingOfficerGrade?: string;
      reportingOfficerPenPicture?: string;

      // Reviewing Officer assessment
      reviewingOfficerAgree?: 'Yes' | 'No';
      reviewingOfficerWorkScore?: number;
      reviewingOfficerPersonalScore?: number;
      reviewingOfficerFunctionalScore?: number;
      reviewingOfficerFinalGrade?: string;
      reviewingOfficerRemarks?: string;
    }

    interface PersonalAttributes {
      leadershipQuality?: string;
      communicationSkills?: string;
      integrity?: string;
      adaptability?: string;
      teamWork?: string;
    }

    interface FunctionalCompetency {
      domainKnowledge?: string;
      problemSolvingAbility?: string;
      decisionMaking?: string;
      analyticalSkills?: string;
    }

    // ─── PBAS/CAS (Performance Based Appraisal System / Career Advancement Scheme) ─────
    interface CASPBASApplication {
      id: string;
      employeeId: string;
      employeeName: string;
      designation: string;
      department: string;
      session: string;
      type: 'PBAS' | 'CAS';
      stage: string;
      status:
        | 'Draft'
        | 'Pending'
        | 'Forwarded'
        | 'Under Review'
        | 'Approved'
        | 'Rejected'
        | 'Resubmission Required';
      currentHandler?: string;
      submittedOn?: string;
      lastUpdated?: string;

      // Basic details
      dateOfBirth?: string;
      category?: string;
      dateOfJoining?: string;
      stageApplyingFor?: string;

      // Academic details
      highestQualification?: string;
      university?: string;
      yearOfPassing?: number;
      netSetQualified?: 'Yes' | 'No';
      netSetYear?: number;

      // Teaching API
      lecturesDelivered?: number;
      tutorialPracticalHours?: number;
      newCoursesIntroduced?: number;
      courseMaterialPrepared?: string;
      eContentDeveloped?: 'Yes' | 'No';
      eLearningContributions?: string;
      teachingAPIScore?: number;

      // Research API
      intJournalPapers?: number;
      natJournalPapers?: number;
      booksChaptersPublished?: number;
      foreignTranslations?: number;
      projectsUndertaken?: number;
      seedMoneyReceived?: number;
      phdStudentsGuided?: number;
      collaborations?: string;
      researchAPIScore?: number;

      // Extension API
      mentorshipActivities?: string;
      professionalDevelopmentPrograms?: number;
      professionalBodyAssociations?: string;
      mousUndertaken?: number;
      consultancyDetails?: string;
      additionalELearning?: string;
      othersAPIScore?: number;

      // Final score
      totalAPIScore?: number;

      // Verification details
      hodRemarks?: string;
      hodVerifiedScore?: number;
      hodDecision?: string;

      deanRemarks?: string;
      deanVerifiedScore?: number;
      deanDecision?: string;

      iqacRemarks?: string;
      iqacVerifiedScore?: number;
      iqacDecision?: string;

      vcRemarks?: string;
      vcNominee?: string;
      subjectMatterExpert?: string;
      screeningComplete?: boolean;
      finalTeachingScore?: number;
      finalResearchScore?: number;
      finalOthersScore?: number;
      finalTotalScore?: number;
      screeningCommitteeRemarks?: string;
    }

    // ─── SESSION ────────────────────────────────────────────────────────
    interface CASSession {
      id: string | number;
      name: string;
      type: 'APAR' | 'PBAS' | 'CAS';
      startDate: string;
      endDate: string;
      applicationStatus: 'OPEN' | 'CLOSE';
      sessionFrom: string;
      sessionTo: string;
      status: 'Active' | 'In-active';
    }

    // ─── TRACKING ───────────────────────────────────────────────────────
    interface TrackingStep {
      label: string;
      done: boolean;
      date?: string;
      handler?: string;
    }

    // ─── NOTIFICATION ───────────────────────────────────────────────────
    interface Notification {
      id: string;
      message: string;
      type: 'success' | 'error' | 'warning' | 'info';
      timestamp: Date;
    }

    // ─── CONTEXT STATE ──────────────────────────────────────────────────
    interface ContextState {
      employees: Employee[];
      setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
      aparApplications: CASAPARApplication[];
      setAPARApplications: React.Dispatch<
        React.SetStateAction<CASAPARApplication[]>
      >;
      pbasApplications: CASPBASApplication[];
      setPBASApplications: React.Dispatch<
        React.SetStateAction<CASPBASApplication[]>
      >;
      sessions: CASSession[];
      setSessions: React.Dispatch<React.SetStateAction<CASSession[]>>;
      simulatedRole: string;
      setSimulatedRole: React.Dispatch<React.SetStateAction<string>>;
      triggerNotification: (
        message: string,
        type?: 'success' | 'error' | 'warning' | 'info'
      ) => void;
    }
  }
}
