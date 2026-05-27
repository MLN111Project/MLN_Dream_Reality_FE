import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import EnvironmentCard from '../../components/EnvironmentCard';
import { getEnvironments, getCareers } from '../../i18n/localizedData';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { playSound } from '../../utils/sounds';
import './WorkEnvironment.css';

export default function WorkEnvironment() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { careerId, environmentId, setEnvironment } = useSimulation();
  const careers = useMemo(() => getCareers(), []);
  const environments = useMemo(() => getEnvironments(), []);
  const career = careers.find((c) => c.id === careerId);
  const [selected, setSelected] = useState(
    () => environments.find((e) => e.id === environmentId) || null
  );

  useEffect(() => {
    if (environmentId) {
      setSelected(environments.find((e) => e.id === environmentId) || null);
    }
  }, [environmentId, environments]);

  useEffect(() => {
    if (!careerId) navigate('/dream', { replace: true });
  }, [careerId, navigate]);

  if (!careerId) return null;

  const handleSelect = (env) => {
    playSound('click');
    setSelected(env);
    setEnvironment(env);
  };

  const handleContinue = () => {
    if (!selected) return;
    playSound('dramatic');
    navigate('/timeline');
  };

  return (
    <PageTransition className="work-env work-env--dashboard">
      <div className="work-env__backdrop" aria-hidden>
        <div className="work-env__spotlight" />
      </div>

      <motion.div
        className="work-env__frame glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="work-env__shell">
          <header className="work-env__header">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/transition')}
              className="work-env__back"
            >
              {t('common.back')}
            </Button>
            <span className="step-indicator">{t('common.step', { n: 2 })}</span>
            <h1 className="work-env__title">
              {t('workEnv.title')}{' '}
              <span className="work-env__title-accent">{t('workEnv.titleHighlight')}</span>
            </h1>
            <p className="work-env__subtitle">
              {t('workEnv.subtitle', { career: career?.title || '' })}
            </p>
          </header>

          <section className="work-env__stage" aria-label={t('workEnv.title')}>
            {!selected && <p className="work-env__hint">{t('workEnv.selectHint')}</p>}
            <div className="work-env__grid">
              {environments.map((env, i) => (
                <EnvironmentCard
                  key={env.id}
                  env={env}
                  selected={selected?.id === env.id}
                  onSelect={handleSelect}
                  index={i}
                />
              ))}
            </div>
          </section>

          <footer className="work-env__footer">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.p
                  key={selected.id}
                  className="work-env__selection"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{ '--env-color': selected.color }}
                >
                  <span className="work-env__selection-dot" />
                  {t('workEnv.selected', { environment: selected.title })}
                </motion.p>
              ) : (
                <motion.p
                  key="empty"
                  className="work-env__selection work-env__selection--muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t('workEnv.selectHint')}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="primary"
              size="large"
              className="work-env__cta sim-btn-primary"
              disabled={!selected}
              onClick={handleContinue}
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
            >
              {t('workEnv.continue')}
            </Button>
          </footer>
        </div>
      </motion.div>
    </PageTransition>
  );
}
