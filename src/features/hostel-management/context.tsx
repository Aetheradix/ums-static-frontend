import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_APPLICATIONS,
  INITIAL_CHECKINS,
  INITIAL_HOSTELS,
  INITIAL_ROOMS,
} from './data';

// ─── Context shape ────────────────────────────────────────────────────────────

interface HostelContextValue {
  // Data
  hostels: HostelManagement.Hostel[];
  setHostels: React.Dispatch<React.SetStateAction<HostelManagement.Hostel[]>>;
  rooms: HostelManagement.Room[];
  setRooms: React.Dispatch<React.SetStateAction<HostelManagement.Room[]>>;
  applications: HostelManagement.Application[];
  setApplications: React.Dispatch<
    React.SetStateAction<HostelManagement.Application[]>
  >;
  checkedInList: HostelManagement.CheckInRecord[];
  setCheckedInList: React.Dispatch<
    React.SetStateAction<HostelManagement.CheckInRecord[]>
  >;
  // Notification utility
  notification: HostelManagement.Notification | null;
  triggerNotification: (message: string, type?: 'success' | 'error') => void;
}

// ─── Context creation ─────────────────────────────────────────────────────────

const HostelContext = createContext<HostelContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function HostelProvider({ children }: { children: React.ReactNode }) {
  const [hostels, setHostels] =
    useState<HostelManagement.Hostel[]>(INITIAL_HOSTELS);
  const [rooms, setRooms] = useState<HostelManagement.Room[]>(INITIAL_ROOMS);
  const [applications, setApplications] =
    useState<HostelManagement.Application[]>(INITIAL_APPLICATIONS);
  const [checkedInList, setCheckedInList] =
    useState<HostelManagement.CheckInRecord[]>(INITIAL_CHECKINS);
  const [notification, setNotification] =
    useState<HostelManagement.Notification | null>(null);

  const triggerNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <HostelContext.Provider
      value={{
        hostels,
        setHostels,
        rooms,
        setRooms,
        applications,
        setApplications,
        checkedInList,
        setCheckedInList,
        notification,
        triggerNotification,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHostel(): HostelContextValue {
  const ctx = useContext(HostelContext);
  if (!ctx) throw new Error('useHostel must be used inside <HostelProvider>');
  return ctx;
}
