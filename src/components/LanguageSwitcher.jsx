import { motion } from 'framer-motion';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';
import { playSound } from '../utils/sounds';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  const switchTo = (next) => {
    if (next === lang) return;
    playSound('click');
    setLang(next);
  };

  return (
    <motion.div
      className="lang-switcher glass-card"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <GlobalOutlined className="lang-switcher__icon" />
      <button
        type="button"
        className={`lang-switcher__btn ${lang === 'vi' ? 'lang-switcher__btn--active' : ''}`}
        onClick={() => switchTo('vi')}
        aria-label={t('common.langVi')}
      >
        VI
      </button>
      <span className="lang-switcher__sep" />
      <button
        type="button"
        className={`lang-switcher__btn ${lang === 'en' ? 'lang-switcher__btn--active' : ''}`}
        onClick={() => switchTo('en')}
        aria-label={t('common.langEn')}
      >
        EN
      </button>
    </motion.div>
  );
}
