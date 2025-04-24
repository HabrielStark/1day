'use client';

import { createContext, ReactNode, useEffect } from 'react';
import { useTranslation, TranslationContextType } from '../hooks/useTranslation';

// Create a context to hold the translation functions and state
export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Provider component that wraps the application
export default function TranslationProvider({ children }: { children: ReactNode }) {
  const translation = useTranslation();
  
  // Update html lang attribute when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = translation.language;
    }
  }, [translation.language]);
  
  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
} 