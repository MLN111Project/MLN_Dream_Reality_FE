import { useMemo } from 'react';
import { getStressLevel, getSuppressionLevel } from '../utils/simulation';

export function useStatsMood(stats) {
  return useMemo(() => {
    const stress = getStressLevel(stats);
    const suppression = getSuppressionLevel(stats);
    const mentalHealth = stats?.mentalHealth ?? 75;
    const creativity = stats?.creativity ?? 80;

    const isHighStress = stress >= 55;
    const isCriticalStress = stress >= 75;
    const isLowCreativity = creativity < 40;
    const isCriticalCreativity = creativity < 25;

    return {
      stress,
      suppression,
      classes: [
        isHighStress && 'mood--stress',
        isCriticalStress && 'mood--stress-critical',
        isLowCreativity && 'mood--suppressed',
        isCriticalCreativity && 'mood--suppressed-critical',
        mentalHealth < 35 && 'mood--low-health',
      ]
        .filter(Boolean)
        .join(' '),
      bgVariant: isCriticalStress ? 'warning' : isLowCreativity ? 'default' : 'default',
      animationSpeed: isLowCreativity ? 1.8 : 1,
    };
  }, [stats]);
}
