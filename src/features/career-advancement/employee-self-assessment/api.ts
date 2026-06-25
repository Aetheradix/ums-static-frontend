import { ApiService } from 'services';

import { CAREER_ADVANCEMENT_URL } from './urls';

export async function createEmployeeSelfAssessment(
  form: CareerAdvancement.EmployeeSelfAssessmentForm
) {
  const formData = new FormData();

  formData.append('EmployeeId', form.employeeId.toString());
  formData.append('TasksProject', form.tasksProject);
  formData.append('WorkOutputScore', (form.workOutputScore ?? 0).toString());

  if (form.workOutputRemark) {
    formData.append('WorkOutputRemark', form.workOutputRemark);
  }

  formData.append('SessionId', (form.sessionId ?? 0).toString());
  formData.append('ReviewingHeadId', (form.reviewingHeadId ?? 0).toString());

  formData.append('LeadershipQuality', form.leadershipQuality);
  formData.append('CommunicationSkill', form.communicationSkill);
  formData.append('Integrity', form.integrity);
  formData.append('Adaptability', form.adaptability);
  formData.append('TeamWork', form.teamWork);

  formData.append('DomainKnowledge', form.domainKnowledge);
  formData.append('ProblemSolvingAbility', form.problemSolvingAbility);
  formData.append('DecisionMaking', form.decisionMaking);
  formData.append('AnalyticalSkill', form.analyticalSkill);

  if (form.functionalRemark) {
    formData.append('FunctionalRemark', form.functionalRemark);
  }

  if (form.additionalRemarks) {
    formData.append('AdditionalRemarks', form.additionalRemarks);
  }

  formData.append('Status', form.status);
  formData.append('IsActive', (form.isActive ?? true).toString());

  if (form.supportingDocument instanceof File) {
    formData.append('SupportingDocument', form.supportingDocument);
  }

  const { error, data } =
    await ApiService.postFormData<CareerAdvancement.EmployeeSelfAssessmentForm>(
      CAREER_ADVANCEMENT_URL,
      formData
    );

  return !error ? data : undefined;
}

export async function getEmployeeSelfAssessmentById(employeeId: number) {
  const { error, data } =
    await ApiService.get<CareerAdvancement.EmployeeSelfAssessmentForm>(
      `${CAREER_ADVANCEMENT_URL}/${employeeId}`
    );

  return !error && data ? data : null;
}

export async function updateEmployeeSelfAssessment(
  form: CareerAdvancement.EmployeeSelfAssessmentForm
) {
  const formData = new FormData();

  if (form.selfAssessmentId) {
    formData.append('SelfAssessmentId', form.selfAssessmentId.toString());
  }
  formData.append('EmployeeId', form.employeeId.toString());
  formData.append('TasksProject', form.tasksProject);
  formData.append('WorkOutputScore', (form.workOutputScore ?? 0).toString());

  if (form.workOutputRemark) {
    formData.append('WorkOutputRemark', form.workOutputRemark);
  }

  formData.append('SessionId', (form.sessionId ?? 0).toString());
  formData.append('ReviewingHeadId', (form.reviewingHeadId ?? 0).toString());

  formData.append('LeadershipQuality', form.leadershipQuality);
  formData.append('CommunicationSkill', form.communicationSkill);
  formData.append('Integrity', form.integrity);
  formData.append('Adaptability', form.adaptability);
  formData.append('TeamWork', form.teamWork);

  formData.append('DomainKnowledge', form.domainKnowledge);
  formData.append('ProblemSolvingAbility', form.problemSolvingAbility);
  formData.append('DecisionMaking', form.decisionMaking);
  formData.append('AnalyticalSkill', form.analyticalSkill);

  if (form.functionalRemark) {
    formData.append('FunctionalRemark', form.functionalRemark);
  }

  if (form.additionalRemarks) {
    formData.append('AdditionalRemarks', form.additionalRemarks);
  }

  formData.append('Status', form.status);
  formData.append('IsActive', (form.isActive ?? true).toString());

  if (form.supportingDocument instanceof File) {
    formData.append('SupportingDocument', form.supportingDocument);
  }

  const { error, data } =
    await ApiService.putFormData<CareerAdvancement.EmployeeSelfAssessmentForm>(
      CAREER_ADVANCEMENT_URL,
      formData
    );

  return !error ? data : undefined;
}
