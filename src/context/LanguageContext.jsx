import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import en from '../i18n/locales/en';
import vi from '../i18n/locales/vi';

const locales = { en, vi };
const STORAGE_KEY = 'dream-reality-lang';

const LanguageContext = createContext(null);

function detectDefaultLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'vi') return saved;
  return navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectDefaultLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const locale = useMemo(() => locales[lang] || locales.en, [lang]);

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
    document.documentElement.lang = lang;
    document.title =
      lang === 'vi'
        ? 'Mô phỏng Giấc mơ vs Thực tế'
        : 'Dream vs Reality Simulator';
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, locale }),
    [lang, setLang, t, locale]
  );

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
