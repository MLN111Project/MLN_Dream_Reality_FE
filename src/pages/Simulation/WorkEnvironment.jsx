import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import EnvironmentCard from '../../components/EnvironmentCard';
import { getEnvironments, getCareers } from '../../i18n/localizedData';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { playSound } from '../../utils/sounds';
import './WorkEnvironment.css';

export default function WorkEnvironment() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { careerId, environmentId, setEnvironment } = useSimulation();
  const careers = useMemo(() => getCareers(lang), [lang]);
  const environments = useMemo(() => getEnvironments(lang), [lang]);
  const career = careers.find((c) => c.id === careerId);
  const [selected, setSelected] = useState(
    () => environments.find((e) => e.id === environmentId) || null
  );

  useEffect(() => {
    if (environmentId) {
      setSelected(environments.find((e) => e.id === environmentId) || null);
    }
  }, [lang, environmentId, environments]);

  if (!careerId) {
    navigate('/dream', { replace: true });
    return null;
  }

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
    <PageTransition className="work-env page-container">
      <motion.div
        className="work-env__header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dream')}
          className="back-btn"
        >
          {t('common.back')}
        </Button>
        <span className="step-indicator">{t('common.step', { n: 2 })}</span>
        <h1 className="cinematic-heading work-env__title">
          {t('workEnv.title')}{' '}
          <span className="landing__reality">{t('workEnv.titleHighlight')}</span>
        </h1>
        <p className="section-quote work-env__subtitle">
          {t('workEnv.subtitle', { career: career?.title || '' })}
        </p>
      </motion.div>

      <Row gutter={[20, 20]} className="work-env__grid">
        {environments.map((env, i) => (
          <Col xs={24} md={12} key={env.id}>
            <EnvironmentCard
              env={env}
              selected={selected?.id === env.id}
              onSelect={handleSelect}
              index={i}
            />
          </Col>
        ))}
      </Row>

      <motion.div
        className="work-env__footer"
        animate={{ opacity: selected ? 1 : 0.4 }}
      >
        <Button
          type="primary"
          size="large"
          className="sim-btn-primary"
          disabled={!selected}
          onClick={handleContinue}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
        >
          {t('workEnv.continue')}
        </Button>
      </motion.div>
    </PageTransition>
  );
}
