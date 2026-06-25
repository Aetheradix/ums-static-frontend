declare namespace CareerAdvancement {
  namespace AparApplication {
    // Search filter form
    interface AparSearchFilter {
      employeeSearch: string;
      departmentId: string | null;
      sessionId: string | null;
      statusId: string | null;
    }

    // Item returned from the list API
    interface AparApplicationItem {
      id: number;
      employeeId: string;
      employeeName: string;
      designation: string;
      department: string;
      session: string;
      status: 'Pending' | 'Forwarded' | 'Completed';
    }

    // Initiate APAR Application Form
    interface InitiateAparForm {
      // Employee Information
      employeeName: string;
      designation: string;
      dateOfBirth: Date | null;
      categoryId: number | null;
      groupId: string | null;
      belongToScSt: 'Yes' | 'No' | null;
      employmentTypeId: string | null;
      sectionsServed: string;

      // Validity Dates
      lengthOfServiceUnderReviewingOfficer: string;
      dateOfContinuousAppointment: Date | null;
      employeeValidityDate: Date | null;
      reportingOfficerValidityDate: Date | null;
      reviewingOfficerValidityDate: Date | null;
    }

    interface InitiateAparCommand {
      employeeId: number;
      status: string;
      employeeName: string;
      designation: string;
      dateOfBirth: string;
      categoryId: number | null;
      groupId: string | null;
      belongToScSt: string | null;
      employmentTypeId: string | null;
      sectionsServed: string;
      lengthOfServiceUnderReviewingOfficer: string;
      dateOfContinuousAppointment: string;
      employeeValidityDate: string;
      reportingOfficerValidityDate: string;
      reviewingOfficerValidityDate: string;
    }
  }
}
