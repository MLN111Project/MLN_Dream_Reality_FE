import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PageTransition from '../../components/PageTransition';
import CareerCard from '../../components/CareerCard';
import { getCareers } from '../../i18n/localizedData';
import { ACTIVE_CAREER_IDS } from '../../data/careers';
import { useLanguage } from '../../context/LanguageContext';
import { emitAsync } from '../../services/socket';
import './Multiplayer.css';

export default function AdminCreate() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const careers = useMemo(
    () => getCareers().filter((c) => ACTIVE_CAREER_IDS.includes(c.id)),
    []
  );
  const [careerId, setCareerId] = useState('developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    const res = await emitAsync('admin:create', { careerId });
    setLoading(false);
    if (res?.ok) {
      if ((res.state.questionTotal || 0) < 12) {
        setError(t('admin.serverOldQuiz'));
        return;
      }
      sessionStorage.setItem('adminRoom', res.state.code);
      navigate(`/admin/room/${res.state.code}`);
    } else {
      setError(
        res?.error === 'SOCKET_TIMEOUT'
          ? t('play.serverOffline')
          : res?.error || t('play.joinError')
      );
    }
  };

  return (
    <PageTransition className="multi-page page-container multi-page--form multi-page--create">
      <div className="multi-panel glass-card multi-panel--create">
        <div className="multi-panel__topbar">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="multi-back-btn"
          >
            {t('common.back')}
          </Button>
        </div>
        <h1>{t('admin.createTitle')}</h1>
        <p className="multi-panel__sub">{t('admin.createSubtitle')}</p>

        <p className="multi-label">{t('admin.careerLabel')}</p>
        <Row gutter={[12, 12]} className="multi-create-careers">
          {careers.map((c, i) => (
            <Col xs={12} sm={12} md={8} lg={6} key={c.id}>
              <CareerCard
                career={c}
                selected={careerId === c.id}
                onSelect={(career) => setCareerId(career.id)}
                index={i}
              />
            </Col>
          ))}
        </Row>

        <Button
          type="primary"
          size="large"
          className="sim-btn-primary multi-create-submit"
          loading={loading}
          onClick={handleCreate}
        >
          {t('admin.createRoom')}
        </Button>
        {error && <p className="multi-error">{error}</p>}
      </div>
    </PageTransition>
  );
}
