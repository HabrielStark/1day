'use client';

import { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { translations } from '../translations';
import { TranslationContext } from '../components/TranslationProvider';

type Language = 'en' | 'zh';

export type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

export function useTranslation(): TranslationContextType {
  // Check if we're inside the provider context
  const context = useContext(TranslationContext);
  
  // Always define hooks regardless of context, to avoid conditional hook calls
  const [localLanguage, setLocalLanguage] = useState<Language>('en');
  
  // Load preferred language from localStorage if available
  useEffect(() => {
    if (context) return; // Skip effect if context exists
    
    try {
      const storedLanguage = localStorage.getItem('language') as Language;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'zh')) {
        setLocalLanguage(storedLanguage);
      }
    } catch (error) {
      // Handle cases where localStorage is not available
      console.warn('localStorage is not available', error);
    }
  }, [context]);

  // Save language preference when it changes
  useEffect(() => {
    if (context) return; // Skip effect if context exists
    
    try {
      localStorage.setItem('language', localLanguage);
    } catch (error) {
      console.warn('localStorage is not available', error);
    }
  }, [localLanguage, context]);

  // Toggle between languages
  const toggleLocalLanguage = useCallback(() => {
    setLocalLanguage(prevLang => prevLang === 'en' ? 'zh' : 'en');
  }, []);

  // Translate a key with optional parameter substitution
  const translateLocal = useCallback((key: string, params?: Record<string, string | number>): string => {
    // Get the translation or fallback to the key itself
    const translation = translations[localLanguage][key] || key;
    
    // If no parameters, return the translation as is
    if (!params) return translation;
    
    // Replace parameters in the format {paramName}
    return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
      return result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    }, translation);
  }, [localLanguage]);

  // Return either the context from provider or local implementation
  return useMemo(() => {
    if (context) {
      return context;
    }
    
    return {
      language: localLanguage,
      setLanguage: setLocalLanguage,
      toggleLanguage: toggleLocalLanguage,
      t: translateLocal
    };
  }, [context, localLanguage, toggleLocalLanguage, translateLocal]);
} 