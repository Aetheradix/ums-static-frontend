import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_EMPLOYEES,
  INITIAL_APAR_APPLICATIONS,
  INITIAL_PBAS_APPLICATIONS,
  INITIAL_SESSIONS,
} from './data';

const CareerAdvancementContext = createContext<
  CareerAdvancement.ContextState | undefined
>(undefined);

export function CareerAdvancementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employees, setEmployees] =
    useState<CareerAdvancement.Employee[]>(INITIAL_EMPLOYEES);
  const [aparApplications, setAPARApplications] = useState<
    CareerAdvancement.CASAPARApplication[]
  >(INITIAL_APAR_APPLICATIONS);
  const [pbasApplications, setPBASApplications] = useState<
    CareerAdvancement.CASPBASApplication[]
  >(INITIAL_PBAS_APPLICATIONS);
  const [sessions, setSessions] =
    useState<CareerAdvancement.CASSession[]>(INITIAL_SESSIONS);
  const [simulatedRole, setSimulatedRole] = useState<string>('cas_admin');

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const triggerNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <CareerAdvancementContext.Provider
      value={{
        employees,
        setEmployees,
        aparApplications,
        setAPARApplications,
        pbasApplications,
        setPBASApplications,
        sessions,
        setSessions,
        simulatedRole,
        setSimulatedRole,
        triggerNotification,
      }}
    >
      {children}

      {/* Global Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-8 right-8 px-6 py-3.5 text-white rounded-lg shadow-xl z-50 flex items-center gap-2.5 font-bold text-sm transition-all duration-300 animate-fade-in-up ${
            notification.type === 'success'
              ? 'bg-emerald-600'
              : notification.type === 'error'
                ? 'bg-rose-600'
                : notification.type === 'warning'
                  ? 'bg-amber-600'
                  : 'bg-cyan-600'
          }`}
        >
          <i
            className={`pi ${
              notification.type === 'success'
                ? 'pi-check-circle'
                : notification.type === 'error'
                  ? 'pi-exclamation-circle'
                  : notification.type === 'warning'
                    ? 'pi-exclamation-triangle'
                    : 'pi-info-circle'
            }`}
          />
          <span>{notification.message}</span>
        </div>
      )}
    </CareerAdvancementContext.Provider>
  );
}

export function useCareerAdvancement() {
  const context = useContext(CareerAdvancementContext);
  if (!context) {
    throw new Error(
      'useCareerAdvancement must be used within a CareerAdvancementProvider'
    );
  }
  return context;
}
