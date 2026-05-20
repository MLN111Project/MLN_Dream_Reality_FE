import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  INITIAL_STATS,
  applyCareerBase,
  applyEnvironment,
  applyChoiceEffects,
  determineEnding,
} from '../utils/simulation';
import { useLanguage } from './LanguageContext';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const { t } = useLanguage();
  const [careerId, setCareerId] = useState(null);
  const [environmentId, setEnvironmentId] = useState(null);
  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const [history, setHistory] = useState([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectCareer = useCallback((selected) => {
    setCareerId(selected.id);
    setStats((prev) => applyCareerBase(prev, selected));
  }, []);

  const selectEnvironment = useCallback(
    (selected) => {
      setEnvironmentId(selected.id);
      setStats((prev) => {
        const next = applyEnvironment(prev, selected);
        setHistory([{ label: t('common.start'), ...next }]);
        return next;
      });
    },
    [t]
  );

  const applyChoice = useCallback((effects, stageLabel) => {
    setStats((prev) => {
      const next = applyChoiceEffects(prev, effects);
      setHistory((h) => [...h, { label: stageLabel, ...next }]);
      return next;
    });
  }, []);

  const endingId = useMemo(() => determineEnding(stats), [stats]);

  const resetSimulation = useCallback(() => {
    setCareerId(null);
    setEnvironmentId(null);
    setStats({ ...INITIAL_STATS });
    setHistory([]);
    setStageIndex(0);
    setEventIndex(0);
  }, []);

  const value = {
    careerId,
    environmentId,
    stats,
    history,
    stageIndex,
    eventIndex,
    loading,
    endingId,
    setLoading,
    setCareer: selectCareer,
    setEnvironment: selectEnvironment,
    applyChoice,
    setStageIndex,
    setEventIndex,
    resetSimulation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
