import type { CourseResult, SemesterRecord, Student } from '../../types';
import { MIN_CREDITS_PER_SEM, REQUIRED_CREDITS } from './constants';

export function creditsEarned(courses: CourseResult[]): number {
  return courses
    .filter(c => c.status === 'Pass')
    .reduce((s, c) => s + c.credits, 0);
}

export function creditsRegistered(courses: CourseResult[]): number {
  return courses.reduce((s, c) => s + c.credits, 0);
}

export function totalCreditsEarned(semesters: SemesterRecord[]): number {
  return semesters.reduce((sum, sem) => sum + creditsEarned(sem.courses), 0);
}

export function backlogCourses(semesters: SemesterRecord[]): CourseResult[] {
  return semesters.flatMap(s =>
    s.courses.filter(c => c.status === 'Fail' || c.status === 'Backlog')
  );
}

function isCompleted(sem: SemesterRecord): boolean {
  return (
    sem.courses.length > 0 && sem.courses.every(c => c.status !== 'Pending')
  );
}

export type StandingTone = 'success' | 'warning' | 'danger';
export interface AcademicStanding {
  label: string;
  tone: StandingTone;
  reason: string;
}

export function academicStanding(student: Student): AcademicStanding {
  const completed = student.semesters.filter(isCompleted);

  const zeroSem = completed.find(
    s => creditsEarned(s.courses) < MIN_CREDITS_PER_SEM
  );
  if (zeroSem) {
    return {
      label: 'Zero Semester',
      tone: 'danger',
      reason: `Semester earned fewer than ${MIN_CREDITS_PER_SEM} credits — repeat required.`,
    };
  }

  const backlogs = backlogCourses(student.semesters);
  if (backlogs.length > 0) {
    return {
      label: 'At Risk',
      tone: 'warning',
      reason: `${backlogs.length} backlog${backlogs.length > 1 ? 's' : ''} pending — clear via Supplementary (ATKT) exam.`,
    };
  }

  return {
    label: 'Good Standing',
    tone: 'success',
    reason: 'On track — all attempted credits cleared.',
  };
}

export interface DegreeProgress {
  earned: number;
  required: number;
  percent: number;
}

export function degreeProgress(semesters: SemesterRecord[]): DegreeProgress {
  const earned = totalCreditsEarned(semesters);
  return {
    earned,
    required: REQUIRED_CREDITS,
    percent: Math.min(100, Math.round((earned / REQUIRED_CREDITS) * 100)),
  };
}
