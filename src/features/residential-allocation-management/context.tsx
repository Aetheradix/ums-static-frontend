import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_CHECKED_IN_LIST,
  INITIAL_ESTATES,
  INITIAL_STAFF_APPLICATIONS,
} from './data';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

interface ResidentialAllocationContextType {
  estates: ResidentialAllocationManagement.Estate[];
  setEstates: React.Dispatch<
    React.SetStateAction<ResidentialAllocationManagement.Estate[]>
  >;
  applications: ResidentialAllocationManagement.StaffApplication[];
  setApplications: React.Dispatch<
    React.SetStateAction<ResidentialAllocationManagement.StaffApplication[]>
  >;
  checkedInList: ResidentialAllocationManagement.CheckedInRecord[];
  setCheckedInList: React.Dispatch<
    React.SetStateAction<ResidentialAllocationManagement.CheckedInRecord[]>
  >;
  notification: NotificationState | null;
  triggerNotification: (message: string, type?: 'success' | 'error') => void;
}

const ResidentialAllocationContext = createContext<
  ResidentialAllocationContextType | undefined
>(undefined);

export const ResidentialAllocationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [estates, setEstates] =
    useState<ResidentialAllocationManagement.Estate[]>(INITIAL_ESTATES);
  const [applications, setApplications] = useState<
    ResidentialAllocationManagement.StaffApplication[]
  >(INITIAL_STAFF_APPLICATIONS);
  const [checkedInList, setCheckedInList] = useState<
    ResidentialAllocationManagement.CheckedInRecord[]
  >(INITIAL_CHECKED_IN_LIST);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const triggerNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <ResidentialAllocationContext.Provider
      value={{
        estates,
        setEstates,
        applications,
        setApplications,
        checkedInList,
        setCheckedInList,
        notification,
        triggerNotification,
      }}
    >
      {children}
    </ResidentialAllocationContext.Provider>
  );
};

export const useResidentialAllocation = () => {
  const context = useContext(ResidentialAllocationContext);
  if (!context) {
    throw new Error(
      'useResidentialAllocation must be used within a ResidentialAllocationProvider'
    );
  }
  return context;
};
