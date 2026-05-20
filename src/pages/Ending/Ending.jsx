import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';
import PageTransition from '../../components/PageTransition';
import QuoteBlock from '../../components/QuoteBlock';
import StatBar from '../../components/StatBar';
import { getEndings, getCareers, getEnvironments } from '../../i18n/localizedData';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { playSound } from '../../utils/sounds';
import './Ending.css';

const STAT_KEYS = ['passion', 'money', 'creativity', 'mentalHealth', 'socialRecognition'];

export default function Ending() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { careerId, environmentId, stats, endingId, resetSimulation } = useSimulation();

  const endings = useMemo(() => getEndings(lang), [lang]);
  const ending = endings[endingId] || endings.creativeSurvivor;
  const career = useMemo(
    () => getCareers(lang).find((c) => c.id === careerId),
    [lang, careerId]
  );
  const environment = useMemo(
    () => getEnvironments(lang).find((e) => e.id === environmentId),
    [lang, environmentId]
  );

  useEffect(() => {
    if (!careerId || !environmentId) {
      navigate('/dream', { replace: true });
    } else {
      playSound('dramatic');
    }
  }, [careerId, environmentId, navigate]);

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

  const handleRestart = () => {
    resetSimulation();
    navigate('/');
  };

  if (!career || !environment) return null;

  return (
    <PageTransition className="ending-page page-container">
      <motion.div
        className="ending-page__glow"
        style={{ background: ending.gradient }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.span
        className="step-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {t('common.stepEnding')}
      </motion.span>

      <motion.h1
        className="ending-page__title cinematic-heading"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ color: ending.color }}
      >
        {ending.title}
      </motion.h1>

      <motion.p
        className="ending-page__subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {ending.subtitle}
      </motion.p>

      <motion.div
        className="ending-page__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div className="ending-page__main glass-card">
          <QuoteBlock quote={ending.quote} />
          <p className="ending-page__description">{ending.description}</p>

          <motion.div
            className="ending-page__journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p>
              {t('ending.journeyAt', {
                career: career.title,
                environment: environment.title,
              })}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="ending-page__stats glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <h3>{t('ending.finalStats')}</h3>
          <motion.div className="ending-page__radial">
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
                  background={{ fill: 'rgba(255,255,255,0.05)' }}
                  dataKey="value"
                  cornerRadius={4}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
          {STAT_KEYS.map((key, i) => (
            <StatBar key={key} statKey={key} value={stats[key]} delay={i * 0.05} />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="ending-page__theory glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <h3>{t('ending.marxistTitle')}</h3>
        <p>
          <strong>{t('ending.forces')}</strong> {t('ending.marxistMid')}{' '}
          <strong>{t('ending.relations')}</strong>
          {t('ending.marxistEnd')}
        </p>
      </motion.div>

      <motion.div
        className="ending-page__actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <Button
          type="primary"
          size="large"
          className="sim-btn-primary"
          icon={<ReloadOutlined />}
          onClick={handleRestart}
        >
          {t('ending.restart')}
        </Button>
        <Button
          type="text"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          className="ending-page__home-btn"
        >
          {t('ending.home')}
        </Button>
      </motion.div>

      <motion.p
        className="ending-page__final-quote"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        &ldquo;{t('ending.finalQuote')}&rdquo;
      </motion.p>
    </PageTransition>
  );
}
