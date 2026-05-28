import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Switch, Progress, Tag, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PageTransition from '../../components/PageTransition';
import TeamEndingPanel from '../../components/TeamEndingPanel';
import { getCareers, getEnvironments, getEndings } from '../../i18n/localizedData';
import { getSocket, emitAsync } from '../../services/socket';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import './Multiplayer.css';

export default function AdminDashboard() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [state, setState] = useState(null);
  const [roomError, setRoomError] = useState('');
  const endings = useMemo(() => getEndings(), []);
  const career = useMemo(
    () => (state ? getCareers().find((c) => c.id === state.careerId) : null),
    [state]
  );
  const envById = useMemo(() => {
    const map = {};
    getEnvironments().forEach((e) => {
      map[e.id] = e.title;
    });
    return map;
  }, []);

  const syncAdminRoom = useCallback(() => {
    setRoomError('');
    return emitAsync('admin:join', { code: code?.toUpperCase() }).then((res) => {
      if (res?.ok) {
        setState(res.state);
        return true;
      }
      if (res?.error === 'ROOM_NOT_FOUND') {
        setRoomError(t('play.roomNotFound'));
        setState(null);
      } else if (res?.error === 'SOCKET_TIMEOUT' || res?.error === 'SOCKET_CONNECT_FAILED') {
        setRoomError(t('play.serverOffline'));
      }
      return false;
    });
  }, [code, t]);

  useEffect(() => {
    const socket = getSocket();
    syncAdminRoom();
    const onUpdate = (payload) => {
      if (payload?.admin) setState(payload.admin);
    };
    const onReconnect = () => syncAdminRoom();
    socket.on('room:update', onUpdate);
    socket.io.on('reconnect', onReconnect);
    return () => {
      socket.off('room:update', onUpdate);
      socket.io.off('reconnect', onReconnect);
    };
  }, [syncAdminRoom]);

  useBackgroundMusic(Boolean(state?.musicOn));

  if (roomError) {
    return (
      <PageTransition className="multi-page page-container">
        <Alert type="error" showIcon message={roomError} />
        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/create')}>
          {t('admin.createRoom')}
        </Button>
      </PageTransition>
    );
  }

  if (!state) return null;

  const needsServerRestart = (state.questionTotal || 0) < 12;

  const handleMusicToggle = (on) => {
    setState((prev) => (prev ? { ...prev, musicOn: on } : prev));
    emitAsync('admin:music', { on });
  };

  const handleBackToCareerSelect = () => {
    sessionStorage.removeItem('adminRoom');
    navigate('/admin/create');
  };

  const q = state.question;
  const maxTeams = state.maxTeams || 8;
  const timeLeft = state.questionEndsAt
    ? Math.max(0, Math.ceil((state.questionEndsAt - Date.now()) / 1000))
    : 0;

  const columns = [
    { title: t('admin.team'), dataIndex: 'name', key: 'name' },
    {
      title: t('admin.environmentCol'),
      dataIndex: 'environmentId',
      key: 'environment',
      render: (id) => envById[id] || '—',
    },
    { title: t('admin.score'), dataIndex: 'score', key: 'score', sorter: (a, b) => a.score - b.score },
    {
      title: t('admin.eventCol'),
      key: 'event',
      render: (_, r) => {
        if (!r.activeEvent || r.activeEvent === 'neutral') return '—';
        return (
          <Tag color="purple">
            {t(`play.eventTypes.${r.activeEvent}`)}
            {r.eventAmount ? ` · ${r.eventAmount}` : ''}
          </Tag>
        );
      },
    },
    {
      title: t('admin.answered'),
      key: 'answered',
      render: (_, r) =>
        r.answered ? <Tag color="green">{t('admin.yes')}</Tag> : <Tag>{t('admin.no')}</Tag>,
    },
    { title: t('stats.passion'), dataIndex: ['stats', 'passion'], key: 'passion' },
    { title: t('stats.money'), dataIndex: ['stats', 'money'], key: 'money' },
    { title: t('stats.creativity'), dataIndex: ['stats', 'creativity'], key: 'creativity' },
    {
      title: t('stats.mentalHealth'),
      dataIndex: ['stats', 'mentalHealth'],
      key: 'mentalHealth',
    },
    {
      title: t('stats.socialRecognition'),
      dataIndex: ['stats', 'socialRecognition'],
      key: 'socialRecognition',
    },
    {
      title: t('admin.endingCol'),
      key: 'ending',
      render: (_, r) => {
        if (!r.endingId) return '—';
        const end = endings[r.endingId];
        return end ? <Tag color="blue">{end.title}</Tag> : r.endingId;
      },
    },
  ];

  return (
    <PageTransition className="multi-page multi-page--wide page-container multi-page--admin">
      <div className="multi-admin-frame glass-card">
        {needsServerRestart && (
          <Alert
            type="error"
            showIcon
            className="multi-server-alert"
            message={t('admin.serverOldQuizTitle')}
            description={t('admin.serverOldQuiz')}
          />
        )}

        {state.phase === 'lobby' && (
          <div className="multi-panel__topbar">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToCareerSelect}
              className="multi-back-btn"
            >
              {t('admin.backToCareerSelect')}
            </Button>
          </div>
        )}

        <div className="multi-admin-header">
          <div>
            <h1>{t('admin.dashboard')}</h1>
            <p>
              {t('admin.roomCode')}: <strong>{state.code}</strong>
              {career && ` · ${career.title}`}
              {state.questionTotal ? ` · ${state.questionTotal} câu` : ''}
            </p>
          </div>
          <div className="multi-admin-header__actions">
            <span>{t('admin.music')}</span>
            <Switch checked={state.musicOn} onChange={handleMusicToggle} />
            {state.phase === 'lobby' && (
              <Button
                type="primary"
                className="sim-btn-primary"
                onClick={() => emitAsync('admin:start')}
              >
                {t('admin.startGame')}
              </Button>
            )}
            {state.phase === 'question' && (
              <Button onClick={() => emitAsync('admin:next')}>{t('admin.nextQuestion')}</Button>
            )}
          </div>
        </div>

        <div className="multi-admin-body">
          {state.phase === 'question' && q && (
            <div className="multi-panel multi-admin-question">
              <p className="multi-panel__sub">{t('admin.perTeamEventsHint')}</p>
              <div className="multi-admin-question__head">
                <h2>
                  {q.stageTitle} · {t('admin.question')} {state.questionIndex + 1}/{state.questionTotal}
                </h2>
                <span className="multi-timer">{timeLeft}s</span>
              </div>
              <Progress
                percent={((state.questionIndex + 1) / state.questionTotal) * 100}
                showInfo={false}
                size="small"
              />
              <h3>{q.title}</h3>
              <p className="multi-narrative">{q.narrative}</p>
              <ul className="multi-choice-list">
                {q.choices.map((c) => (
                  <li key={c.index}>
                    <strong>{c.index + 1}.</strong> {c.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="multi-panel">
            <h3>
              {t('admin.teams')} ({state.teams.length}/{maxTeams})
            </h3>
            <Table
              dataSource={state.teams}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: true }}
            />
          </div>

          {state.phase === 'ended' && (
            <>
              <div className="multi-panel">
                <h3>{t('admin.teamEndingsOverview')}</h3>
                <p className="multi-panel__sub">{t('admin.teamEndingsHint')}</p>
                <div className="multi-endings-grid">
                  {state.teams.map((team) => (
                    <TeamEndingPanel
                      key={team.id}
                      teamName={team.name}
                      careerId={state.careerId}
                      environmentId={team.environmentId}
                      stats={team.stats}
                      history={team.history}
                      endingId={team.endingId}
                      compact
                      showHomeButton={false}
                    />
                  ))}
                </div>
              </div>
              <div className="multi-panel">
                <p className="multi-philosophy">{t('admin.philosophy')}</p>
                <Button type="primary" onClick={() => navigate('/')}>
                  {t('admin.backHome')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
