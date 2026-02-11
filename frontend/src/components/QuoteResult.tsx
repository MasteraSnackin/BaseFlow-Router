import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type QuoteResponse } from '../lib/api';

interface Props {
  quote: QuoteResponse['data'] | null;
  txHash: string | null;
}

export const QuoteResult: React.FC<Props> = ({ quote, txHash }) => {
  // 🎉 PHASE 2: Confetti celebration on transaction success
  useEffect(() => {
    if (txHash) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981']
      });
    }
  }, [txHash]);

  if (!quote) return null;

  const baseline = BigInt(quote.baselineAmountOut);
  const smart = BigInt(quote.smartAmountOut);
  const diff = smart - baseline;
  const improvementPercent = (quote.improvementBps / 100).toFixed(2);

  // Calculate bar widths for visual comparison
  const baselinePercent = 85; // Baseline is always 85%
  const smartPercent = 100; // Smart route is always 100% (best)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-6 space-y-4"
      >
        {/* Main Quote Display */}
        <div className="glass-card p-6 border-2 border-aurora-purple/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-aurora-purple" />
              Best Route Found
            </h3>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-gradient-base rounded-full text-sm font-bold"
            >
              +{improvementPercent}%
            </motion.div>
          </div>

          {/* 📊 PHASE 2: Visual Quote Comparison Bars */}
          <div className="space-y-3 mb-6">
            {/* Baseline Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-400">Baseline ({quote.baselineVenue})</span>
                <span className="text-sm font-semibold">{(Number(baseline) / 1e18).toFixed(4)} TOUT</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-600 to-slate-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${baselinePercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Smart Route Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-400">Smart Route ({quote.smartVenue})</span>
                <span className="text-sm font-bold gradient-text">{(Number(smart) / 1e18).toFixed(4)} TOUT</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-base"
                  initial={{ width: 0 }}
                  animate={{ width: `${smartPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>

            {/* Improvement Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-aurora-emerald/20 border border-aurora-emerald/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-aurora-emerald" />
              <span className="text-sm font-semibold text-aurora-emerald">
                +{improvementPercent}% Better!
              </span>
            </motion.div>
          </div>

          {/* Baseline vs Smart Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Baseline */}
            <div className="glass-card p-4 opacity-60">
              <div className="text-xs text-slate-400 mb-1">Baseline ({quote.baselineVenue})</div>
              <div className="text-lg font-bold text-slate-300">
                {(Number(baseline) / 1e18).toFixed(4)}
              </div>
              <div className="text-xs text-slate-500">TOUT</div>
            </div>

            {/* Smart Route */}
            <div className="glass-card p-4 border-2 border-aurora-purple/30 bg-aurora-purple/5">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                Smart Route ({quote.smartVenue})
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <div className="text-lg font-bold gradient-text">
                {(Number(smart) / 1e18).toFixed(4)}
              </div>
              <div className="text-xs text-slate-500">TOUT</div>
            </div>
          </div>

          {/* Improvement Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 pt-4 border-t border-white/10 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Improvement</span>
              <span className="font-semibold text-green-400">
                +{diff.toString()} wei ({quote.improvementBps} bps)
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Route Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold text-green-400">Optimized</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RobinPump.fun Bonding Curve Info */}
        {quote.pumpFunInfo && quote.smartVenue === 'ROBINPUMP_FUN' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-purple-500/5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">🚀 RobinPump.fun</h3>
                <p className="text-xs text-slate-400">Bonding Curve Trading</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Bonding Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Bonding Progress</span>
                  <span className="font-semibold text-pink-400">{quote.pumpFunInfo.bondingProgress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${quote.pumpFunInfo.bondingProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {quote.pumpFunInfo.hasGraduated
                    ? '✅ Graduated to DEX'
                    : `${100 - quote.pumpFunInfo.bondingProgress}% until DEX graduation`
                  }
                </p>
              </div>

              {/* Price & Market Cap */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3">
                  <div className="text-xs text-slate-400 mb-1">Current Price</div>
                  <div className="text-sm font-bold text-pink-400">
                    {quote.pumpFunInfo.currentPrice} ETH
                  </div>
                </div>
                <div className="glass-card p-3">
                  <div className="text-xs text-slate-400 mb-1">Market Cap</div>
                  <div className="text-sm font-bold text-purple-400">
                    ${Number(quote.pumpFunInfo.estimatedMarketCap).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Why RobinPump.fun is Better */}
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-slate-300">
                    <strong className="text-pink-400">Why RobinPump.fun?</strong>
                    <p className="mt-1">
                      Bonding curve provides better pricing than traditional DEXes at this stage.
                      Lower fees and direct liquidity means more tokens for your trade!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CoinGecko Price Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <div className="text-xs font-semibold text-slate-400 mb-3">Reference Prices (CoinGecko)</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Token In:</span>
              <span className="ml-2 font-semibold text-slate-300">
                ${quote.coingeckoReferencePriceTokenInUSD}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Token Out:</span>
              <span className="ml-2 font-semibold text-slate-300">
                ${quote.coingeckoReferencePriceTokenOutUSD}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              quote.priceCheckStatus === 'OK' ? 'bg-green-400' : 'bg-yellow-400'
            }`} />
            <span className={`text-xs font-semibold ${
              quote.priceCheckStatus === 'OK' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {quote.priceCheckStatus === 'OK' ? 'Price Validated' : 'Price Warning'}
            </span>
          </div>
        </motion.div>

        {/* Transaction Success */}
        {txHash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-2 border-green-400/30 bg-green-400/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-400">Transaction Submitted!</h3>
                <p className="text-xs text-slate-400">Your swap is being processed on Base Sepolia</p>
              </div>
            </div>

            <div className="glass-card p-3 mb-3">
              <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
              <div className="font-mono text-xs text-slate-300 break-all">{txHash}</div>
            </div>

            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View on BaseScan
            </a>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
