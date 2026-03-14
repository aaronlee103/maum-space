import { useState, useEffect } from 'react';

export default function useLanguage() {
  const [lang, setLangState] = useState('ko');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('maum_lang');
      if (saved === 'en' || saved === 'ko') setLangState(saved);
    } catch (e) {}
  }, []);

  const setLang = (l) => {
    try { localStorage.setItem('maum_lang', l); } catch (e) {}
    setLangState(l);
  };

  return { lang, setLang };
}
