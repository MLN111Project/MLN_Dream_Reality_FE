import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Radio } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PageTransition from '../../components/PageTransition';
import { getEnvironments } from '../../i18n/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { emitAsync } from '../../services/socket';
import './Multiplayer.css';

export default function PlayerJoin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const environments = useMemo(() => getEnvironments(), []);
  const [code, setCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [environmentId, setEnvironmentId] = useState('corporate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    const res = await emitAsync('player:join', {
      code: code.trim().toUpperCase(),
      teamName: teamName.trim(),
      environmentId,
    });
    setLoading(false);
    if (res?.ok) {
      sessionStorage.setItem('teamId', res.teamId);
      sessionStorage.setItem('roomCode', res.state.code);
      navigate(`/play/room/${res.state.code}`);
    } else {
      if (res?.error === 'SOCKET_TIMEOUT' || res?.error === 'SOCKET_CONNECT_FAILED') {
        setError(t('play.serverOffline'));
      } else if (res?.error === 'ROOM_NOT_FOUND') {
        setError(t('play.roomNotFound'));
      } else if (res?.error === 'ROOM_FULL') {
        setError(t('play.roomFull'));
      } else if (res?.error === 'GAME_STARTED') {
        setError(t('play.gameStarted'));
      } else if (res?.error === 'INVALID_ENVIRONMENT') {
        setError(t('play.invalidEnvironment'));
      } else if (import.meta.env.DEV && res?.error) {
        setError(`${t('play.joinError')} (${res.error})`);
      } else {
        setError(t('play.joinError'));
      }
    }
  };

  return (
    <PageTransition className="multi-page page-container multi-page--form">
      <div className="multi-panel glass-card">
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
        <h1>{t('play.joinTitle')}</h1>
        <p className="multi-panel__sub">{t('play.joinSubtitle')}</p>

        <label className="multi-label">{t('play.roomCode')}</label>
        <Input
          size="large"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          maxLength={8}
        />

        <label className="multi-label">{t('play.teamName')}</label>
        <Input
          size="large"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder={t('play.teamPlaceholder')}
        />

        <p className="multi-label">{t('play.environmentLabel')}</p>
        <Radio.Group
          value={environmentId}
          onChange={(e) => setEnvironmentId(e.target.value)}
          className="multi-career-radio"
        >
          {environments.map((env) => (
            <Radio key={env.id} value={env.id} className="multi-career-radio__item">
              <strong>{env.title}</strong>
              <span className="multi-env-desc"> — {env.description}</span>
            </Radio>
          ))}
        </Radio.Group>

        {error && <p className="multi-error">{error}</p>}
        <Button
          type="primary"
          size="large"
          className="sim-btn-primary"
          loading={loading}
          disabled={!code || !teamName}
          onClick={handleJoin}
        >
          {t('play.join')}
        </Button>
      </div>
    </PageTransition>
  );
}
