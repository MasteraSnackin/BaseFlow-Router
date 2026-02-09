import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: {
    value: number;
    positive: boolean;
  };
  delay?: number;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  trend,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="glass-card p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="text-sm text-slate-400 mb-2">{title}</div>
      <motion.div
        className="text-4xl font-bold gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        <CountUp
          end={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          duration={2}
          separator=","
        />
      </motion.div>
      {trend && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.4 }}
          className={`mt-4 flex items-center gap-2 ${
            trend.positive ? 'text-aurora-emerald' : 'text-red-400'
          }`}
        >
          {trend.positive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {trend.positive ? '+' : ''}{trend.value}% from yesterday
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Savings Dashboard Component
export const SavingsDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricsCard
        title="Total Saved Today"
        value={523.45}
        prefix="$"
        decimals={2}
        trend={{ value: 12.3, positive: true }}
        delay={0}
      />
      <MetricsCard
        title="Trades Completed"
        value={47}
        trend={{ value: 8.5, positive: true }}
        delay={0.1}
      />
      <MetricsCard
        title="Avg. Improvement"
        value={3.2}
        suffix="%"
        decimals={1}
        trend={{ value: 0.8, positive: true }}
        delay={0.2}
      />
    </div>
  );
};
