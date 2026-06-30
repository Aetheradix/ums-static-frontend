import React, { createContext, useContext, useState } from 'react';
import {
  BLANK_PROPOSAL,
  BLANK_PROJECT_FORM,
  INITIAL_DISBURSED_LOGS,
  INITIAL_PROJECTS,
  INITIAL_PROPOSALS,
} from './data';

// ─── Context shape ────────────────────────────────────────────────────────────

interface ResearchContextValue {
  // Data
  projects: ResearchManagement.Project[];
  setProjects: React.Dispatch<
    React.SetStateAction<ResearchManagement.Project[]>
  >;
  proposals: ResearchManagement.Proposal[];
  setProposals: React.Dispatch<
    React.SetStateAction<ResearchManagement.Proposal[]>
  >;
  disbursedLogs: ResearchManagement.DisbursedLog[];
  setDisbursedLogs: React.Dispatch<
    React.SetStateAction<ResearchManagement.DisbursedLog[]>
  >;
  // Form state (shared so wizard can navigate between pages)
  proposalForm: ResearchManagement.ProposalForm;
  setProposalForm: React.Dispatch<
    React.SetStateAction<ResearchManagement.ProposalForm>
  >;
  proposalStep: number;
  setProposalStep: React.Dispatch<React.SetStateAction<number>>;
  projectForm: ResearchManagement.ProjectForm;
  setProjectForm: React.Dispatch<
    React.SetStateAction<ResearchManagement.ProjectForm>
  >;
  // Notification utility
  notification: ResearchManagement.Notification | null;
  triggerNotification: (message: string, type?: 'success' | 'error') => void;
}

// ─── Context creation ─────────────────────────────────────────────────────────

const ResearchContext = createContext<ResearchContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] =
    useState<ResearchManagement.Project[]>(INITIAL_PROJECTS);
  const [proposals, setProposals] =
    useState<ResearchManagement.Proposal[]>(INITIAL_PROPOSALS);
  const [disbursedLogs, setDisbursedLogs] = useState<
    ResearchManagement.DisbursedLog[]
  >(INITIAL_DISBURSED_LOGS);
  const [proposalForm, setProposalForm] =
    useState<ResearchManagement.ProposalForm>({ ...BLANK_PROPOSAL });
  const [proposalStep, setProposalStep] = useState(1);
  const [projectForm, setProjectForm] =
    useState<ResearchManagement.ProjectForm>({ ...BLANK_PROJECT_FORM });
  const [notification, setNotification] =
    useState<ResearchManagement.Notification | null>(null);

  const triggerNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <ResearchContext.Provider
      value={{
        projects,
        setProjects,
        proposals,
        setProposals,
        disbursedLogs,
        setDisbursedLogs,
        proposalForm,
        setProposalForm,
        proposalStep,
        setProposalStep,
        projectForm,
        setProjectForm,
        notification,
        triggerNotification,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useResearch(): ResearchContextValue {
  const ctx = useContext(ResearchContext);
  if (!ctx)
    throw new Error('useResearch must be used inside <ResearchProvider>');
  return ctx;
}
