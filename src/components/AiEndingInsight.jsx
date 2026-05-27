import { Spin, Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './AiEndingInsight.css';

const BURNOUT_COLORS = {
  low: 'green',
  moderate: 'gold',
  high: 'orange',
  critical: 'red',
};

export default function AiEndingInsight({ status, analysis, errorCode }) {
  const { t } = useLanguage();

  if (!status && !analysis) return null;

  if (status === 'loading' || status === 'pending') {
    return (
      <div className="ai-ending glass-card">
        <div className="ai-ending__loading">
          <Spin />
          <p>{t('ending.aiLoading')}</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || !analysis) {
    const isKeyMissing = errorCode === 'GEMINI_API_KEY_MISSING';
    return (
      <div className="ai-ending glass-card ai-ending--muted">
        <p className="ai-ending__hint">
          {isKeyMissing ? t('ending.aiKeyMissing') : t('ending.aiError')}
        </p>
      </div>
    );
  }

  const burnoutKey = `ending.aiBurnout.${analysis.burnoutLevel}`;
  const burnoutLabel =
    t(burnoutKey) !== burnoutKey ? t(burnoutKey) : analysis.burnoutLevel;

  return (
    <motion.div
      className="ai-ending glass-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="ai-ending__head">
        <div className="ai-ending__icon-wrap">
          <RobotOutlined className="ai-ending__icon" />
        </div>
        <div className="ai-ending__head-text">
          <h3>{t('ending.aiTitle')}</h3>
          <p className="ai-ending__sub">{t('ending.aiSubtitle')}</p>
        </div>
        <Tag
          className="ai-ending__burnout-tag"
          color={BURNOUT_COLORS[analysis.burnoutLevel] || 'default'}
        >
          {t('ending.aiBurnoutTag')}: {burnoutLabel}
        </Tag>
      </div>

      <p className="ai-ending__burnout-line">{analysis.burnoutSummary}</p>

      <div className="ai-ending__grid">
        <section>
          <h4>{t('ending.aiConclusion')}</h4>
          <p>{analysis.conclusion}</p>
        </section>
        <section>
          <h4>{t('ending.aiCareerTrend')}</h4>
          <p>{analysis.careerTrend}</p>
        </section>
        <section>
          <h4>{t('ending.aiPassionConflict')}</h4>
          <p>{analysis.passionRealityConflict}</p>
        </section>
        <section className="ai-ending__theory-block">
          <h4>{t('ending.aiForces')}</h4>
          <p>{analysis.forcesAndRelations}</p>
        </section>
      </div>
    </motion.div>
  );
}
