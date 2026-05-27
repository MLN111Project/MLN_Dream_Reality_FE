import { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import vi from '../i18n/locales/vi';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const locale = vi;

  const t = useCallback(
    (key, vars) => {
      const keys = key.split('.');
      let value = locale;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
      }
      if (typeof value !== 'string') return key;
      if (!vars) return value;
      return Object.entries(vars).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
        value
      );
    },
    [locale]
  );

  useEffect(() => {
    document.documentElement.lang = 'vi';
    document.title = 'MLN 111 Nhóm 3 · Giấc mơ vs Thực tế';
  }, []);

  const value = useMemo(() => ({ lang: 'vi', t, locale }), [t, locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
