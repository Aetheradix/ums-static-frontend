import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { UniversityLoader } from 'shared/components/progress';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authenticated, isLoading } = useAuth();

  if (isLoading) {
    return <UniversityLoader text="Checking Session..." />;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};
