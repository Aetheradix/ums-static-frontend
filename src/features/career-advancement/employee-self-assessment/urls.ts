export const CAREER_ADVANCEMENT_URL = 'career/employee-self-assessment';

export const employeeSelfAssessmentUrls = (base: string) => {
  const prefix = `${base}/employee-self-assessment`;
  return {
    root: prefix,
    create: `${prefix}/create`,
  };
};
