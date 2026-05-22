import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import CareerCard from '../../components/CareerCard';
import { getCareers } from '../../i18n/localizedData';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { playSound } from '../../utils/sounds';
import './DreamSelection.css';

export default function DreamSelection() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { careerId, setCareer } = useSimulation();
  const careers = useMemo(() => getCareers(lang), [lang]);
  const [selected, setSelected] = useState(
    () => careers.find((c) => c.id === careerId) || null
  );

  useEffect(() => {
    if (careerId) {
      setSelected(careers.find((c) => c.id === careerId) || null);
    }
  }, [lang, careerId, careers]);

  const handleSelect = (c) => {
    playSound('click');
    setSelected(c);
    setCareer(c);
  };

  const handleContinue = () => {
    if (!selected) return;
    playSound('click');
    navigate('/transition');
  };

  return (
    <PageTransition className="dream-selection page-container">
      <motion.div
        className="dream-selection__header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="back-btn"
        >
          {t('common.back')}
        </Button>
        <span className="step-indicator">{t('common.step', { n: 1 })}</span>
        <h1 className="cinematic-heading dream-selection__title">
          {t('dream.title')}{' '}
          <span className="gradient-text">{t('dream.titleHighlight')}</span>
        </h1>
        <p className="section-quote dream-selection__subtitle">{t('dream.subtitle')}</p>
      </motion.div>

      <Row gutter={[16, 16]} className="dream-selection__grid">
        {careers.map((c, i) => (
          <Col xs={12} sm={12} md={8} lg={6} key={c.id}>
            <CareerCard
              career={c}
              selected={selected?.id === c.id}
              onSelect={handleSelect}
              index={i}
            />
          </Col>
        ))}
      </Row>

      <motion.div
        className="dream-selection__footer"
        initial={{ opacity: 0 }}
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
          {t('dream.continue')}
        </Button>
      </motion.div>
    </PageTransition>
  );
}
