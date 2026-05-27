import { useMemo } from 'react';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';
import QuoteBlock from './QuoteBlock';
import StatBar from './StatBar';
import LiveStatsChart from './LiveStatsChart';
import AiEndingInsight from './AiEndingInsight';
import { getEndings, getCareers, getEnvironments } from '../i18n/localizedData';
import { useLanguage } from '../context/LanguageContext';
import '../pages/Ending/Ending.css';

const STAT_KEYS = ['passion', 'money', 'creativity', 'mentalHealth', 'socialRecognition'];

export default function TeamEndingPanel({
  teamName,
  careerId,
  environmentId,
  stats,
  history = [],
  endingId,
  aiAnalysis = null,
  aiAnalysisStatus = null,
  compact = false,
  showHomeButton = true,
  onHome,
}) {
  const { t } = useLanguage();
  const endings = useMemo(() => getEndings(), []);
  const ending = endings[endingId] || endings.creativeSurvivor;
  const career = useMemo(
    () => getCareers().find((c) => c.id === careerId),
    [careerId]
  );
  const environment = useMemo(
    () => getEnvironments().find((e) => e.id === environmentId),
    [environmentId]
  );

  const personalized =
    endingId && t(`ending.personalized.${endingId}`) !== `ending.personalized.${endingId}`
      ? t(`ending.personalized.${endingId}`)
      : null;

  const radialData = STAT_KEYS.map((key) => ({
    name: t(`stats.${key}`),
    value: stats[key],
    fill:
      key === 'passion'
        ? '#ec4899'
        : key === 'mentalHealth'
          ? '#06b6d4'
          : '#8b5cf6',
  }));

  if (compact) {
    return (
      <div className="team-ending-compact glass-card">
        <h4>{teamName}</h4>
        <p className="team-ending-compact__title" style={{ color: ending.color }}>
          {ending.title}
        </p>
        <p className="team-ending-compact__sub">{ending.subtitle}</p>
        <ul className="team-ending-compact__stats">
          {STAT_KEYS.map((key) => (
            <li key={key}>
              {t(`stats.${key}`)}: <strong>{stats[key]}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="team-ending-panel">
      {teamName && <h2 className="team-ending-panel__team">{teamName}</h2>}

      {endingId === 'collectiveChange' && (
        <span className="ending-page__secret-badge">{t('ending.secretBadge')}</span>
      )}

      <motion.h1
        className="ending-page__title cinematic-heading"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ color: ending.color }}
      >
        {ending.title}
      </motion.h1>

      <motion.p
        className="ending-page__subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {ending.subtitle}
      </motion.p>

      <AiEndingInsight
        status={aiAnalysisStatus || (aiAnalysis ? 'ready' : 'loading')}
        analysis={aiAnalysis}
      />

      <div className="ending-page__content">
        <div className="ending-page__main glass-card">
          {personalized && (
            <div className="ending-page__personalized">
              <h3>{t('ending.personalizedTitle')}</h3>
              <p>{personalized}</p>
            </div>
          )}
          <QuoteBlock quote={ending.quote} />
          <p className="ending-page__description">{ending.description}</p>
          {career && environment && (
            <p className="ending-page__journey">
              {t('ending.journeyAt', {
                career: career.title,
                environment: environment.title,
              })}
            </p>
          )}
        </div>

        <div className="ending-page__stats glass-card">
          <h3>{t('ending.finalStats')}</h3>
          <div className="ending-page__radial">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: 'rgba(0,0,0,0.04)' }}
                  dataKey="value"
                  cornerRadius={4}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          {STAT_KEYS.map((key, i) => (
            <StatBar key={key} statKey={key} value={stats[key]} delay={i * 0.05} />
          ))}
        </div>
      </div>

      {history.length > 1 && (
        <div className="ending-page__chart-section">
          <LiveStatsChart history={history} />
        </div>
      )}

      {showHomeButton && onHome && (
        <Button
          type="primary"
          size="large"
          className="sim-btn-primary multi-back-home"
          icon={<HomeOutlined />}
          onClick={onHome}
        >
          {t('play.backHome')}
        </Button>
      )}
    </div>
  );
}
