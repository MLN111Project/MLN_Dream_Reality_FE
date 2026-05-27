import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import {
  CrownOutlined,
  TeamOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import './Multiplayer.css';

export default function HomeMulti() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <PageTransition className="multi-page multi-page--home page-container">
      <motion.div
        className="multi-hero multi-hero--centered glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="multi-hero__badge">{t('home.badge')}</span>
        <h1 className="multi-hero__title">{t('home.title')}</h1>
        <p className="multi-hero__desc">{t('home.description')}</p>

        <div className="multi-hero__actions">
          <Card className="multi-action-card" onClick={() => navigate('/admin/create')}>
            <CrownOutlined className="multi-action-card__icon" />
            <h3>{t('home.admin')}</h3>
            <p>{t('home.adminDesc')}</p>
          </Card>
          <Card className="multi-action-card" onClick={() => navigate('/play/join')}>
            <TeamOutlined className="multi-action-card__icon" />
            <h3>{t('home.join')}</h3>
            <p>{t('home.joinDesc')}</p>
          </Card>
          <Card className="multi-action-card" onClick={() => navigate('/dream')}>
            <ExperimentOutlined className="multi-action-card__icon" />
            <h3>{t('home.solo')}</h3>
            <p>{t('home.soloDesc')}</p>
          </Card>
        </div>
      </motion.div>
    </PageTransition>
  );
}
