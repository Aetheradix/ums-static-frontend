// ============================================================
//  Timetable Management Module — URL Constants
// ============================================================

export const timetableUrls = {
  portal: '/timetable-management',

  admin: {
    portal: '/timetable-management/admin',
    dashboard: '/timetable-management/admin/dashboard',
    setup: '/timetable-management/admin/setup',
    setupNew: '/timetable-management/admin/setup/new',
    setupEdit: (id: number | string) =>
      `/timetable-management/admin/setup/${id}/edit`,
    clashes: '/timetable-management/admin/clashes',
    timetables: '/timetable-management/admin/timetables',
    reports: '/timetable-management/admin/reports',
  },

  scheduler: {
    portal: '/timetable-management/scheduler',
    dashboard: '/timetable-management/scheduler/dashboard',
    assignments: '/timetable-management/scheduler/assignments',
    rooms: '/timetable-management/scheduler/rooms',
  },

  faculty: {
    portal: '/timetable-management/faculty',
    dashboard: '/timetable-management/faculty/dashboard',
    schedule: '/timetable-management/faculty/schedule',
    substitutions: '/timetable-management/faculty/substitutions',
  },

  student: {
    portal: '/timetable-management/student',
    timetable: '/timetable-management/student/timetable',
    exams: '/timetable-management/student/exams',
  },
};
