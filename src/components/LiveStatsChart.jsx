import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { buildChartHistory } from '../utils/simulation';
import { useLanguage } from '../context/LanguageContext';
import './LiveStatsChart.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      className="chart-tooltip glass-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {Math.round(entry.value)}
        </p>
      ))}
    </motion.div>
  );
}

export default function LiveStatsChart({ history }) {
  const { t } = useLanguage();
  const data = buildChartHistory(history);

  if (data.length < 1) return null;

  return (
    <motion.div
      className="live-stats-chart glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="live-stats-chart__title gradient-text">{t('chart.title')}</h3>
      <p className="live-stats-chart__subtitle">{t('chart.subtitle')}</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="passionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="creativityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="stage" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="passion"
            name={t('chart.passion')}
            stroke="#ec4899"
            fill="url(#passionGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="stress"
            name={t('chart.stress')}
            stroke="#ef4444"
            fill="url(#stressGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="creativity"
            name={t('chart.creativity')}
            stroke="#8b5cf6"
            fill="url(#creativityGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
