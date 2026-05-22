import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getStatLevel } from '../utils/simulation';
import './EnvironmentComparison.css';

export default function EnvironmentComparison({ rows, careerTitle, highlightId }) {
  const { t } = useLanguage();

  const levelLabel = (val, key) => {
    if (key === 'money' && val < 45) return t('ending.statLevel.unstable');
    return t(`ending.statLevel.${getStatLevel(val)}`);
  };

  return (
    <motion.section
      className="env-compare glass-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3>{t('ending.comparisonTitle')}</h3>
      <p className="env-compare__subtitle">{t('ending.comparisonSubtitle')}</p>
      <p className="env-compare__career">
        {t('ending.comparisonCareer', { career: careerTitle })}
      </p>

      <div className="env-compare__table-wrap">
        <table className="env-compare__table">
          <thead>
            <tr>
              <th>{t('ending.comparisonEnvColumn')}</th>
              <th>{t('stats.creativity')}</th>
              <th>{t('stats.money')}</th>
              <th>{t('stats.mentalHealth')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={row.id === highlightId ? 'env-compare__row--active' : ''}
              >
                <td>
                  <span className="env-compare__dot" style={{ background: row.color }} />
                  {row.title}
                </td>
                <td data-level={getStatLevel(row.creativity)}>
                  {levelLabel(row.creativity, 'creativity')}
                </td>
                <td data-level={getStatLevel(row.money)}>
                  {levelLabel(row.money, 'money')}
                </td>
                <td data-level={getStatLevel(row.mentalHealth)}>
                  {levelLabel(row.mentalHealth, 'mentalHealth')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
