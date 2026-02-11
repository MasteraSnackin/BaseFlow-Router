
import { motion } from 'framer-motion';
import { Activity, BarChart3, Globe } from 'lucide-react';
import type { PlatformStats } from '../lib/api';

interface StatsTickerProps {
    stats: PlatformStats | null;
    loading: boolean;
}

export function StatsTicker({ stats, loading }: StatsTickerProps) {
    if (loading || !stats) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-2 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs md:text-sm text-slate-400">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-blue-400" />
                        <span className="font-medium text-white">Base Sepolia</span>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    </span>

                    <div className="h-4 w-[1px] bg-white/10" />

                    <span className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-purple-400" />
                        Requests: <span className="text-white font-mono">{stats.totalRequests}</span>
                    </span>

                    <span className="flex items-center gap-2">
                        <BarChart3 className="w-3 h-3 text-emerald-400" />
                        Vol: <span className="text-white font-mono">
                            ${stats.totalVolumeUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-2 text-xs">
                    <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Mock Mode Active
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
