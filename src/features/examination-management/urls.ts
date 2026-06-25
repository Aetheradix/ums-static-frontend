const baseUrl = '/examination-management';

export const examinationUrls = {
  dashboard: `${baseUrl}/dashboard`,
  examType: {
    root: `${baseUrl}/exam-type`,
    edit: (id: number) => `${baseUrl}/exam-type/edit/${id}`,
    create: `${baseUrl}/exam-type/create`,
  },
  examCycle: {
    root: `${baseUrl}/exam-cycle`,
    edit: (id: number) => `${baseUrl}/exam-cycle/edit/${id}`,
    create: `${baseUrl}/exam-cycle/create`,
  },
  timeSlot: {
    root: `${baseUrl}/time-slot`,
    edit: (id: number) => `${baseUrl}/time-slot/edit/${id}`,
    create: `${baseUrl}/time-slot/create`,
  },
  sessionTemplate: {
    root: `${baseUrl}/session-template`,
    edit: (id: number) => `${baseUrl}/session-template/edit/${id}`,
    create: `${baseUrl}/session-template/create`,
  },
  center: {
    root: `${baseUrl}/center`,
    edit: (id: number) => `${baseUrl}/center/edit/${id}`,
    create: `${baseUrl}/center/create`,
  },
  hall: {
    root: (centerId: number) => `${baseUrl}/halls?centerId=${centerId}`,
    edit: (id: number) => `${baseUrl}/halls/edit/${id}`,
    create: `${baseUrl}/halls/create`,
  },
  dutyType: {
    root: `${baseUrl}/duty-type`,
    edit: (id: number) => `${baseUrl}/duty-type/edit/${id}`,
    create: `${baseUrl}/duty-type/create`,
  },
  admitCardTemplate: {
    root: `${baseUrl}/admit-card-template`,
    edit: (id: number) => `${baseUrl}/admit-card-template/edit/${id}`,
    create: `${baseUrl}/admit-card-template/create`,
  },
  fee: {
    root: `${baseUrl}/fee`,
    edit: (id: number) => `${baseUrl}/fee/edit/${id}`,
    create: `${baseUrl}/fee/create`,
  },
  lateFee: {
    root: `${baseUrl}/late-fee`,
    edit: (id: number) => `${baseUrl}/late-fee/edit/${id}`,
    create: `${baseUrl}/late-fee/create`,
  },
  session: {
    root: `${baseUrl}/session`,
    edit: (id: number) => `${baseUrl}/session/edit/${id}`,
    create: `${baseUrl}/session/create`,
    programs: (id: number) => `${baseUrl}/session/${id}/program`,
    applications: (id: number) => `${baseUrl}/session/${id}/application`,
  },
  timetable: {
    root: (sessionId: number) => `${baseUrl}/session/${sessionId}/timetable`,
  },
  marks: {
    root: (sessionId: number) => `${baseUrl}/session/${sessionId}/marks-entry`,
    verify: (sessionId: number) =>
      `${baseUrl}/session/${sessionId}/marks-entry/verify`,
    approve: (sessionId: number) =>
      `${baseUrl}/session/${sessionId}/marks-entry/approve`,
  },
  result: {
    root: (sessionId: number) => `${baseUrl}/session/${sessionId}/result`,
  },
  revaluation: {
    root: `${baseUrl}/revaluation`,
  },
  programOptions: `${baseUrl}/program-options`,
  cycleOptions: `${baseUrl}/cycle-options`,
};
