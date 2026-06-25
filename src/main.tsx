import { QueryClientProvider } from '@tanstack/react-query';
import { initConfig } from 'config/initConfig';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'auth';
import App from './App';

import './index.css';

const config = initConfig();
const appElement = document.getElementById('root')!;
ReactModal.setAppElement(appElement);

createRoot(appElement).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <BrowserRouter>
        <QueryClientProvider client={config.queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);
