// ─── Timetable Management — mock API layer ──────────────────────────────────
import {
  clashes as CLASHES,
  courses,
  faculty,
  rooms,
  sections,
  sessions as SESSIONS,
  substitutions as SUBSTITUTIONS,
  timetableEntries as ENTRIES,
  timetables as TIMETABLES,
  type Clash,
  type Session,
  type Substitution,
  type Timetable,
  type TimetableEntry,
  type WeekDay,
} from './mocks';

export interface SessionFormValues {
  name: string;
  code: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  periodsPerDay: number;
  examWindowStart?: string;
  examWindowEnd?: string;
  status: Session['status'];
  remarks?: string;
}

export interface AssignmentFormValues {
  day: WeekDay;
  period: number;
  courseId: number;
  sectionId: number;
  facultyId: number;
  roomId: number;
}

export interface SubstitutionFormValues {
  requestedBy: string;
  courseId: number;
  sectionId: number;
  day: WeekDay;
  timeLabel: string;
  facultyId: number;
  reason: string;
  requestedOn: string;
  status: Substitution['status'];
}

export interface ClashResolveValues {
  status: Clash['status'];
  resolution: string;
}

const nameOf = <T extends { id: number; name: string }>(
  list: T[],
  id: number
) => list.find(x => x.id === id)?.name ?? '';

// ─── Sessions ───────────────────────────────────────────────────────────────

export async function getSessions(): Promise<Session[]> {
  return Promise.resolve([...SESSIONS]);
}

export async function createSession(form: SessionFormValues): Promise<Session> {
  return Promise.resolve({ ...form, id: Date.now() });
}

export async function updateSession(
  id: number,
  form: SessionFormValues
): Promise<Session> {
  return Promise.resolve({ ...form, id });
}

// ─── Timetable Entries ──────────────────────────────────────────────────────

export async function getEntries(): Promise<TimetableEntry[]> {
  return Promise.resolve([...ENTRIES]);
}

export async function createAssignment(
  form: AssignmentFormValues
): Promise<TimetableEntry> {
  const slotFor = (period: number) => {
    const map: Record<number, string> = {
      1: '09:00 - 09:55',
      2: '09:55 - 10:50',
      3: '11:05 - 12:00',
      4: '12:00 - 12:55',
      5: '13:45 - 14:40',
      6: '14:40 - 15:35',
      7: '15:50 - 16:45',
      8: '16:45 - 17:40',
    };
    return map[period] ?? '';
  };
  const courseName = courses.find(c => c.id === form.courseId)?.name ?? '';
  const sectionName = sections.find(s => s.id === form.sectionId)?.name ?? '';
  const roomName = rooms.find(r => r.id === form.roomId)?.name ?? '';
  return Promise.resolve({
    id: Date.now(),
    day: form.day,
    period: form.period,
    timeLabel: slotFor(form.period),
    courseId: form.courseId,
    courseName,
    sectionId: form.sectionId,
    sectionName,
    facultyId: form.facultyId,
    facultyName: nameOf(faculty, form.facultyId),
    roomId: form.roomId,
    roomName,
  });
}

// ─── Timetables ─────────────────────────────────────────────────────────────

export async function getTimetables(): Promise<Timetable[]> {
  return Promise.resolve([...TIMETABLES]);
}

export async function publishTimetable(id: number): Promise<Timetable> {
  const existing = TIMETABLES.find(t => t.id === id);
  return Promise.resolve({
    ...(existing as Timetable),
    id,
    status: 'Published',
  });
}

// ─── Clashes ────────────────────────────────────────────────────────────────

export async function getClashes(): Promise<Clash[]> {
  return Promise.resolve([...CLASHES]);
}

export async function resolveClash(
  id: number,
  form: ClashResolveValues
): Promise<Clash> {
  const existing = CLASHES.find(c => c.id === id);
  return Promise.resolve({
    ...(existing as Clash),
    id,
    status: form.status,
    resolution: form.resolution,
  });
}

// ─── Substitutions ──────────────────────────────────────────────────────────

export async function getSubstitutions(): Promise<Substitution[]> {
  return Promise.resolve([...SUBSTITUTIONS]);
}

export async function createSubstitution(
  form: SubstitutionFormValues
): Promise<Substitution> {
  const courseName = courses.find(c => c.id === form.courseId)?.name ?? '';
  const sectionName = sections.find(s => s.id === form.sectionId)?.name ?? '';
  return Promise.resolve({
    id: Date.now(),
    requestedBy: form.requestedBy,
    courseName,
    sectionName,
    day: form.day,
    timeLabel: form.timeLabel,
    substituteName: nameOf(faculty, form.facultyId),
    reason: form.reason,
    requestedOn: form.requestedOn,
    status: form.status,
  });
}
