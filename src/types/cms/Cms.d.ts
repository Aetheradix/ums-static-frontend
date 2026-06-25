declare namespace Cms {
  // ── Departments ─────────────────────────────────────────────────────────
  export interface DepartmentItem {
    id: number;
    name: string;
    shortName: string;
    icon: string;
    colorHex: string;
    totalCourses: number;
    totalFaculty: number;
    totalStudents: number;
    description: string;
    isActive: boolean;
    displayOrder: number;
  }

  export interface DepartmentForm {
    name: string;
    shortName: string;
    icon: string;
    colorHex: string;
    totalCourses: number;
    totalFaculty: number;
    totalStudents: number;
    description: string;
    isActive: boolean;
    displayOrder: number;
  }

  // ── Courses ─────────────────────────────────────────────────────────────
  export interface CourseItem {
    id: number;
    name: string;
    icon: string;
    level: string;
    departmentId: number;
    departmentName: string;
    duration: string;
    eligibilityCriteria: string;
    annualFees: number;
    totalSeats: number;
    badgeColor: string;
    description: string;
    isActive: boolean;
    displayOrder: number;
  }

  export interface CourseForm {
    name: string;
    icon: string;
    level: string;
    departmentId: number;
    duration: string;
    eligibilityCriteria: string;
    annualFees: number;
    totalSeats: number;
    badgeColor: string;
    description: string;
    isActive: boolean;
    displayOrder: number;
  }

  // ── Faculty ─────────────────────────────────────────────────────────────
  export interface FacultyItem {
    id: number;
    fullName: string;
    initials: string;
    departmentId: number;
    departmentName: string;
    designation: string;
    qualification: string;
    experienceYears: number;
    researchPapers: number;
    email: string | null;
    profileImageUrl: string | null;
    avatarColorHex: string;
    isActive: boolean;
    displayOrder: number;
  }

  export interface FacultyForm {
    fullName: string;
    initials: string;
    departmentId: number;
    designation: string;
    qualification: string;
    experienceYears: number;
    researchPapers: number;
    email: string | null;
    profileImageUrl: string | null;
    avatarColorHex: string;
    isActive: boolean;
    displayOrder: number;
  }

  // ── NewsEvents ──────────────────────────────────────────────────────────
  export interface NewsEventItem {
    id: number;
    title: string;
    description: string;
    category: string;
    publishedDate: string;
    externalLink: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    displayOrder: number;
  }

  export interface NewsEventForm {
    title: string;
    description: string;
    category: string;
    externalLink: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    displayOrder: number;
  }

  // ── Downloads ───────────────────────────────────────────────────────────
  export interface DownloadItem {
    id: number;
    name: string;
    icon: string;
    fileType: string;
    fileSizeDisplay: string;
    fileUrl: string | null;
    isActive: boolean;
    displayOrder: number;
  }

  export interface DownloadForm {
    name: string;
    icon: string;
    fileType: string;
    fileSizeDisplay: string;
    fileUrl: string | null;
    isActive: boolean;
    displayOrder: number;
  }

  // ── Gallery ─────────────────────────────────────────────────────────────
  export interface GalleryItem {
    id: number;
    label: string;
    emoji: string;
    backgroundColor: string;
    imageUrl: string | null;
    isActive: boolean;
    displayOrder: number;
  }

  export interface GalleryForm {
    label: string;
    emoji: string;
    backgroundColor: string;
    imageUrl: string | null;
    displayOrder: number;
  }

  // ── Facilities ──────────────────────────────────────────────────────────
  export interface FacilityItem {
    id: number;
    name: string;
    icon: string;
    description: string;
    isActive: boolean;
    displayOrder: number;
  }

  export interface FacilityForm {
    name: string;
    icon: string;
    description: string;
    isActive: boolean;
    displayOrder: number;
  }

  // ── UniversityStats ─────────────────────────────────────────────────────
  export interface UniversityStatItem {
    id: number;
    label: string;
    value: string;
    icon: string;
    displayOrder: number;
  }

  export interface UniversityStatForm {
    label: string;
    value: string;
    icon: string;
    displayOrder: number;
  }

  // ── Notices ─────────────────────────────────────────────────────────────
  export interface NoticeItem {
    id: number;
    text: string;
    isActive: boolean;
    expiresAt: string | null;
    displayOrder: number;
  }

  export interface NoticeForm {
    text: string;
    isActive: boolean;
    expiresAt: string | null;
    displayOrder: number;
  }
}
