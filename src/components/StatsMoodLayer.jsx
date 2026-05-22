import { useEffect } from 'react';
import { useStatsMood } from '../hooks/useStatsMood';
import { playSound } from '../utils/sounds';

export default function StatsMoodLayer({ stats, children }) {
  const mood = useStatsMood(stats);

  useEffect(() => {
    if (mood.stress >= 75) playSound('stress');
  }, [mood.stress >= 75]);

  return (
    <div
      className={`stats-mood-wrap ${mood.classes}`}
      style={{ '--mood-speed': mood.animationSpeed }}
    >
      <div
        className={`mood-overlay mood-overlay--blur ${mood.stress >= 55 ? 'mood-overlay--stress' : ''}`}
      />
      {children}
    </div>
  );
}
