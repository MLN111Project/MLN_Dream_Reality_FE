import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { ArrowRightOutlined } from '@ant-design/icons';
import PageTransition from '../../components/PageTransition';
import Typewriter from '../../components/Typewriter';
import QuoteBlock from '../../components/QuoteBlock';
import IntroVideo from '../../components/IntroVideo';
import IntroMarquee from '../../components/IntroMarquee';
import { useLanguage } from '../../context/LanguageContext';
import { playSound } from '../../utils/sounds';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const storyCards = useMemo(
    () => [
      { id: 'card1', title: t('landing.card1Title'), desc: t('landing.card1Desc') },
      { id: 'card2', title: t('landing.card2Title'), desc: t('landing.card2Desc') },
      { id: 'card3', title: t('landing.card3Title'), desc: t('landing.card3Desc') },
    ],
    [t]
  );

  const handleStart = () => {
    playSound('click');
    navigate('/dream');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <PageTransition className="landing page-container">
      <section className="landing__hero">
        <motion.div
          className="landing__badge glass-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t('landing.badge')}
        </motion.div>

        <motion.h1
          className="cinematic-heading landing__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="gradient-text">{t('loading.dream')}</span>
          <span className="landing__vs">{t('loading.vs')}</span>
          <span className="landing__reality">{t('loading.reality')}</span>
          <br />
          <span className="landing__subtitle-text">{t('landing.simulator')}</span>
        </motion.h1>

        <motion.p
          className="landing__hook"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Typewriter text={t('landing.hook')} speed={50} />
        </motion.p>

        <IntroVideo />
        <IntroMarquee />

        <motion.div
          className="landing__theory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p>
            {t('landing.theoryIntro')}{' '}
            <strong className="gradient-text">{t('landing.forces')}</strong>{' '}
            {t('landing.theoryForcesParen')} {t('landing.theoryAnd')}{' '}
            <strong className="landing__warn">{t('landing.relations')}</strong>{' '}
            {t('landing.theoryRelationsParen')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <Button
            type="primary"
            size="large"
            className="sim-btn-primary landing__cta"
            onClick={handleStart}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            {t('landing.cta')}
          </Button>
        </motion.div>

        <motion.div
          className="landing__scroll-hint"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {t('landing.scroll')}
        </motion.div>
      </section>

      <section className="landing__story">
        <QuoteBlock quote={t('landing.quote')} />
        <motion.div
          key="landing-cards"
          className="landing__cards"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {storyCards.map((card) => (
            <motion.div
              key={card.id}
              className="landing__card glass-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6 }}
            >
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </PageTransition>
  );
}
