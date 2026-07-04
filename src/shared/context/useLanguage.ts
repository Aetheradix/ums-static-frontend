import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import type { LanguageContextProps } from './LanguageContext';

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
