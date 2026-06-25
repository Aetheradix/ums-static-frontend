import { QueryClient } from '@tanstack/react-query';
import ApiService from 'services/api';

export function initConfig() {
  ApiService.setApiRoot(import.meta.env.VITE_API_HOST);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return {
    queryClient,
  };
}
