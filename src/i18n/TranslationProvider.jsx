import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from './en';
import la from './la';

const translations = { en, la };

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('clinic-lang') || 'en';
  });

  useEffect(() => {
    if (lang === 'la') {
      document.body.classList.add('lang-la');
    } else {
      document.body.classList.remove('lang-la');
    }
  }, [lang]);

  const t = useCallback((path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path;
  }, [lang]);

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('clinic-lang', newLang);
  }, []);

  return (
    <TranslationContext.Provider value={{ lang, t, switchLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
}
