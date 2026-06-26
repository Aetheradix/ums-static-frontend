import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_COMMITTEES,
  INITIAL_CATEGORY_USER_MAPPINGS,
  INITIAL_GRIEVANCE_USER_MAPPINGS,
  INITIAL_GRIEVANCES,
  INITIAL_MEETINGS,
} from './data';
import type {
  GrievanceCategory,
  GrievanceCommittee,
  CategoryUserMapping,
  GrievanceUserMapping,
  Grievance,
  GrievanceMeeting,
  GrievanceNote,
} from './data';

interface GrievanceContextValue {
  // Mock Role Simulation
  activeRole: string;
  setActiveRole: (role: string) => void;

  // Datasets
  categories: GrievanceCategory[];
  setCategories: React.Dispatch<React.SetStateAction<GrievanceCategory[]>>;
  committees: GrievanceCommittee[];
  setCommittees: React.Dispatch<React.SetStateAction<GrievanceCommittee[]>>;
  categoryMappings: CategoryUserMapping[];
  setCategoryMappings: React.Dispatch<
    React.SetStateAction<CategoryUserMapping[]>
  >;
  grievanceMappings: GrievanceUserMapping[];
  setGrievanceMappings: React.Dispatch<
    React.SetStateAction<GrievanceUserMapping[]>
  >;
  grievances: Grievance[];
  setGrievances: React.Dispatch<React.SetStateAction<Grievance[]>>;
  meetings: GrievanceMeeting[];
  setMeetings: React.Dispatch<React.SetStateAction<GrievanceMeeting[]>>;

  // Notification utility
  notification: { message: string; type: 'success' | 'error' } | null;
  triggerNotification: (message: string, type?: 'success' | 'error') => void;

  // Custom Actions
  addCategory: (cat: Omit<GrievanceCategory, 'id'>) => void;
  updateCategory: (id: string, cat: Omit<GrievanceCategory, 'id'>) => void;
  addCommittee: (
    comm: Omit<
      GrievanceCommittee,
      | 'id'
      | 'status'
      | 'chairman'
      | 'instituteMembers'
      | 'exOfficio'
      | 'scStRep'
      | 'memberSecretary'
      | 'nonInstitute'
      | 'effectiveDate'
      | 'approvedOn'
      | 'approvedTill'
      | 'document'
    >
  ) => void;
  updateCommittee: (id: string, comm: Partial<GrievanceCommittee>) => void;
  dissolveCommittee: (id: string) => void;
  addCommitteeMembers: (
    id: string,
    data: {
      chairman: string[];
      instituteMembers: string[];
      exOfficio: string[];
      scStRep: string[];
      memberSecretary: string[];
      nonInstitute: GrievanceCommittee['nonInstitute'];
      effectiveDate: string;
      approvedOn: string;
      approvedTill: string;
      document?: string;
    }
  ) => void;
  dissolveMember: (
    committeeId: string,
    memberName: string,
    roleField: keyof GrievanceCommittee
  ) => void;
  addCategoryMapping: (mapping: Omit<CategoryUserMapping, 'id'>) => void;
  addGrievanceMapping: (mapping: Omit<GrievanceUserMapping, 'id'>) => void;
  addGrievance: (
    grv: Omit<Grievance, 'id' | 'status' | 'reportedDate' | 'notes'>
  ) => void;
  updateGrievance: (id: string, grv: Partial<Grievance>) => void;
  submitGrievance: (id: string) => void;
  addResolution: (
    id: string,
    resolution: string,
    resolutionDate: string,
    status: 'Resolved' | 'Pending'
  ) => void;
  addMeeting: (meeting: Omit<GrievanceMeeting, 'id' | 'status'>) => void;
  updateMeeting: (id: string, meetingTime: string, venue: string) => void;
  cancelMeeting: (id: string, reason: string) => void;
  addMeetingMinutes: (id: string, minutes: string, document?: string) => void;
  addNoteToGrievance: (
    grievanceId: string,
    note: Omit<GrievanceNote, 'id' | 'responseStatus'>
  ) => void;
  actionOnGrievanceNote: (
    grievanceId: string,
    noteId: string,
    response: string,
    status: GrievanceNote['responseStatus']
  ) => void;
}

const GrievanceContext = createContext<GrievanceContextValue | null>(null);

export function GrievanceProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<string>('grievance_admin_staff');
  const [categories, setCategories] =
    useState<GrievanceCategory[]>(INITIAL_CATEGORIES);
  const [committees, setCommittees] =
    useState<GrievanceCommittee[]>(INITIAL_COMMITTEES);
  const [categoryMappings, setCategoryMappings] = useState<
    CategoryUserMapping[]
  >(INITIAL_CATEGORY_USER_MAPPINGS);
  const [grievanceMappings, setGrievanceMappings] = useState<
    GrievanceUserMapping[]
  >(INITIAL_GRIEVANCE_USER_MAPPINGS);
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [meetings, setMeetings] =
    useState<GrievanceMeeting[]>(INITIAL_MEETINGS);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const triggerNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const addCategory = (cat: Omit<GrievanceCategory, 'id'>) => {
    const id = `CAT-${String(categories.length + 1).padStart(3, '0')}`;
    setCategories(prev => [...prev, { ...cat, id }]);
    triggerNotification(`Grievance Category "${cat.name}" added successfully.`);
  };

  const updateCategory = (id: string, cat: Omit<GrievanceCategory, 'id'>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...cat } : c)));
    triggerNotification(`Grievance Category updated successfully.`);
  };

  const addCommittee = (
    comm: Omit<
      GrievanceCommittee,
      | 'id'
      | 'status'
      | 'chairman'
      | 'instituteMembers'
      | 'exOfficio'
      | 'scStRep'
      | 'memberSecretary'
      | 'nonInstitute'
      | 'effectiveDate'
      | 'approvedOn'
      | 'approvedTill'
      | 'document'
    >
  ) => {
    const id = `COM-${String(committees.length + 1).padStart(3, '0')}`;
    setCommittees(prev => [
      ...prev,
      {
        ...comm,
        id,
        status: 'Active',
        chairman: [],
        instituteMembers: [],
        exOfficio: [],
        scStRep: [],
        memberSecretary: [],
        nonInstitute: [],
        effectiveDate: '',
        approvedOn: '',
        approvedTill: '',
      },
    ]);
    triggerNotification(`Committee "${comm.name}" registered.`);
  };

  const updateCommittee = (id: string, comm: Partial<GrievanceCommittee>) => {
    setCommittees(prev => prev.map(c => (c.id === id ? { ...c, ...comm } : c)));
    triggerNotification(`Committee updated successfully.`);
  };

  const dissolveCommittee = (id: string) => {
    setCommittees(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Dissolved' as const,
              chairman: [],
              instituteMembers: [],
              exOfficio: [],
              scStRep: [],
              memberSecretary: [],
              nonInstitute: [],
            }
          : c
      )
    );
    triggerNotification(
      `Committee has been dissolved. All associated members are also dissolved.`,
      'error'
    );
  };

  const addCommitteeMembers = (
    id: string,
    data: {
      chairman: string[];
      instituteMembers: string[];
      exOfficio: string[];
      scStRep: string[];
      memberSecretary: string[];
      nonInstitute: GrievanceCommittee['nonInstitute'];
      effectiveDate: string;
      approvedOn: string;
      approvedTill: string;
      document?: string;
    }
  ) => {
    setCommittees(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    triggerNotification(`Committee members updated successfully.`);
  };

  const dissolveMember = (
    committeeId: string,
    memberName: string,
    roleField: keyof GrievanceCommittee
  ) => {
    setCommittees(prev =>
      prev.map(c => {
        if (c.id !== committeeId) return c;
        if (roleField === 'nonInstitute') {
          return {
            ...c,
            nonInstitute: c.nonInstitute.filter(m => m.name !== memberName),
          };
        }
        const val = c[roleField];
        if (Array.isArray(val)) {
          return {
            ...c,
            [roleField]: val.filter(name => name !== memberName),
          };
        }
        return c;
      })
    );
    triggerNotification(
      `Member "${memberName}" has been inactivated.`,
      'error'
    );
  };

  const addCategoryMapping = (mapping: Omit<CategoryUserMapping, 'id'>) => {
    const id = `MAP-C-${String(categoryMappings.length + 1).padStart(3, '0')}`;
    setCategoryMappings(prev => [...prev, { ...mapping, id }]);
    triggerNotification(`User mapping for "${mapping.category}" registered.`);
  };

  const addGrievanceMapping = (mapping: Omit<GrievanceUserMapping, 'id'>) => {
    const id = `MAP-G-${String(grievanceMappings.length + 1).padStart(3, '0')}`;
    setGrievanceMappings(prev => [...prev, { ...mapping, id }]);
    triggerNotification(
      `User mapping for Grievance "${mapping.grievanceId}" registered.`
    );
  };

  const addGrievance = (
    grv: Omit<Grievance, 'id' | 'status' | 'reportedDate' | 'notes'>
  ) => {
    const id = `GRV-${String(grievances.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    setGrievances(prev => [
      ...prev,
      {
        ...grv,
        id,
        status: 'Reported',
        reportedDate: today,
        notes: [],
      },
    ]);
    triggerNotification(
      `Grievance submitted successfully! Reference ID: ${id}`
    );
  };

  const updateGrievance = (id: string, grv: Partial<Grievance>) => {
    setGrievances(prev => prev.map(g => (g.id === id ? { ...g, ...grv } : g)));
    triggerNotification(`Grievance updated.`);
  };

  const submitGrievance = (id: string) => {
    setGrievances(prev =>
      prev.map(g => (g.id === id ? { ...g, status: 'Reported' } : g))
    );
    triggerNotification(`Grievance submitted for resolution.`);
  };

  const addResolution = (
    id: string,
    resolution: string,
    resolutionDate: string,
    status: 'Resolved' | 'Pending'
  ) => {
    setGrievances(prev =>
      prev.map(g =>
        g.id === id ? { ...g, resolution, resolutionDate, status } : g
      )
    );
    triggerNotification(`Resolution details saved successfully.`);
  };

  const addMeeting = (meeting: Omit<GrievanceMeeting, 'id' | 'status'>) => {
    const id = `MEET-${String(meetings.length + 1).padStart(3, '0')}`;
    setMeetings(prev => [...prev, { ...meeting, id, status: 'Scheduled' }]);
    triggerNotification(
      `Meeting scheduled successfully. Invites sent to members.`
    );
  };

  const updateMeeting = (id: string, meetingTime: string, venue: string) => {
    setMeetings(prev =>
      prev.map(m => (m.id === id ? { ...m, meetingTime, venue } : m))
    );
    triggerNotification(`Meeting details updated.`);
  };

  const cancelMeeting = (id: string, reason: string) => {
    setMeetings(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, status: 'Cancelled', cancellationReason: reason }
          : m
      )
    );
    triggerNotification(
      `Meeting cancelled. Cancellation emails sent.`,
      'error'
    );
  };

  const addMeetingMinutes = (
    id: string,
    minutes: string,
    document?: string
  ) => {
    setMeetings(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, minutes, minutesDoc: document, status: 'Conducted' }
          : m
      )
    );
    triggerNotification(`Meeting minutes saved.`);
  };

  const addNoteToGrievance = (
    grievanceId: string,
    note: Omit<GrievanceNote, 'id' | 'responseStatus'>
  ) => {
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== grievanceId) return g;
        const noteId = `NOTE-${String(g.notes.length + 1).padStart(3, '0')}`;
        return {
          ...g,
          notes: [...g.notes, { ...note, id: noteId, responseStatus: 'New' }],
        };
      })
    );
    triggerNotification(`Committee note added.`);
  };

  const actionOnGrievanceNote = (
    grievanceId: string,
    noteId: string,
    response: string,
    status: GrievanceNote['responseStatus']
  ) => {
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== grievanceId) return g;
        return {
          ...g,
          notes: g.notes.map(n =>
            n.id === noteId ? { ...n, response, responseStatus: status } : n
          ),
        };
      })
    );
    triggerNotification(`Action on note registered: Status set to ${status}.`);
  };

  return (
    <GrievanceContext.Provider
      value={{
        activeRole,
        setActiveRole,
        categories,
        setCategories,
        committees,
        setCommittees,
        categoryMappings,
        setCategoryMappings,
        grievanceMappings,
        setGrievanceMappings,
        grievances,
        setGrievances,
        meetings,
        setMeetings,
        notification,
        triggerNotification,
        addCategory,
        updateCategory,
        addCommittee,
        updateCommittee,
        dissolveCommittee,
        addCommitteeMembers,
        dissolveMember,
        addCategoryMapping,
        addGrievanceMapping,
        addGrievance,
        updateGrievance,
        submitGrievance,
        addResolution,
        addMeeting,
        updateMeeting,
        cancelMeeting,
        addMeetingMinutes,
        addNoteToGrievance,
        actionOnGrievanceNote,
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
}

export function useGrievance() {
  const ctx = useContext(GrievanceContext);
  if (!ctx)
    throw new Error('useGrievance must be used within GrievanceProvider');
  return ctx;
}
