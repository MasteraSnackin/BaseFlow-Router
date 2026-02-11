import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { TradeForm } from './components/TradeForm';
import { QuoteResult } from './components/QuoteResult';
import { MetricsCard } from './components/MetricsCard';
import { QuoteLoadingSkeleton } from './components/SkeletonLoader';
import { HolographicCard } from './components/HolographicCard';
import { StatsTicker } from './components/StatsTicker';
import { triggerCelebration } from './lib/celebration';
import { getQuote, type QuoteRequest, type QuoteResponse } from './lib/api';
import { connectWallet, sendRouterTx } from './lib/wallet';
import { usePlatformData } from './hooks/usePlatformData';

function App() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse['data'] | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Fetch live stats
  const { stats, loading: statsLoading } = usePlatformData();

  const playSuccessSound = () => {
    if (soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => { }); // Ignore interaction errors
    }
  };

  const handleManualConfetti = () => {
    triggerCelebration();
    playSuccessSound();
  };

  const handleGetQuote = async (req: QuoteRequest) => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const res = await getQuote(req);
      if (!res.success || !res.data) {
        setError(res.error?.message || 'Failed to get quote');
        setQuote(null);
      } else {
        setQuote(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Error');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    const addr = await connectWallet();
    if (!addr) {
      setError('Could not connect wallet');
      return;
    }
    setWalletAddress(addr);
  };

  const handleExecute = async () => {
    if (!walletAddress || !quote) {
      setError('Connect wallet and get a quote first');
      return;
    }
    try {
      setError(null);
      const tx = await sendRouterTx(walletAddress, quote.routerCalldata);
      setTxHash(tx);
      triggerCelebration(); // 🎉 Trigger confetti on success
      playSuccessSound();   // 🔊 Play sound on success
    } catch (e: any) {
      setError(e.message || 'Transaction failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Global Ticker */}
      <StatsTicker stats={stats} loading={statsLoading} />

      <div className="flex-1 p-4 md:p-8">
        {/* Mesh Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Gooey filter for organic blob effect */}
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>

              {/* Gradient definitions */}
              <radialGradient id="grad1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad2">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad3">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad4">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g filter="url(#goo)">
              {/* Animated mesh gradient circles */}
              <motion.circle
                cx="25%"
                cy="20%"
                r="200"
                fill="url(#grad1)"
                animate={{
                  cx: ["25%", "30%", "20%", "25%"],
                  cy: ["20%", "25%", "15%", "20%"],
                  r: [200, 250, 220, 200],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.circle
                cx="75%"
                cy="70%"
                r="220"
                fill="url(#grad2)"
                animate={{
                  cx: ["75%", "70%", "80%", "75%"],
                  cy: ["70%", "65%", "75%", "70%"],
                  r: [220, 180, 240, 220],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="180"
                fill="url(#grad3)"
                animate={{
                  cx: ["50%", "55%", "45%", "50%"],
                  cy: ["50%", "45%", "55%", "50%"],
                  r: [180, 220, 190, 180],
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }}
              />
              <motion.circle
                cx="20%"
                cy="80%"
                r="160"
                fill="url(#grad4)"
                animate={{
                  cx: ["20%", "25%", "15%", "20%"],
                  cy: ["80%", "75%", "85%", "80%"],
                  r: [160, 200, 170, 160],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 6
                }}
              />
            </g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
                  <Zap className="w-10 h-10 text-base-400 animate-glow" />
                  <span className="gradient-text">Base DeFi Router</span>
                </h1>
                <p className="text-slate-400 text-lg">
                  Smart DEX aggregation + 🚀 <span className="text-pink-400 font-semibold">RobinPump.fun</span> bonding curves • Save up to 8% on every swap
                </p>
              </div>

              {/* Visual Controls */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="glass-card p-3 rounded-full text-slate-400 hover:text-white transition-colors"
                  title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleManualConfetti}
                  className="glass-card p-3 rounded-full text-slate-400 hover:text-aurora-pink transition-colors"
                  title="Trigger Celebration!"
                >
                  🎉
                </motion.button>

                {/* Wallet Connection */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConnectWallet}
                  className={`${walletAddress ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
                >
                  {walletAddress ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Trading Card - Spans 8 columns */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-8"
            >
              {/* 💧 LIQUID BORDER WRAPPER */}
              <div className="liquid-border p-[1px]">
                <div className="glass-card p-6 md:p-8 h-full bg-slate-950/80 backdrop-blur-xl rounded-2xl relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-aurora-purple animate-pulse" />
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                      Trade
                    </h2>
                  </div>

                  <TradeForm onSubmit={handleGetQuote} loading={loading} />

                  {/* Error Display */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                      >
                        <p className="text-red-400 text-sm">
                          <strong>Error:</strong> {error}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Loading Skeleton */}
                  {loading && !quote && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <QuoteLoadingSkeleton />
                    </motion.div>
                  )}

                  {/* Quote Result */}
                  <QuoteResult quote={quote} txHash={txHash} />

                  {/* Execute Trade Button */}
                  {quote && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExecute}
                      className="btn-primary w-full mt-6 py-4 text-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <TrendingUp className="w-5 h-5" />
                      <span className="relative z-10">Execute Trade on Best Route</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats & Info Sidebar - Spans 4 columns */}
            <div className="md:col-span-4 space-y-6">
              {/* How It Works Card */}
              <HolographicCard className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-base-400" />
                  How It Works
                </h3>
                <ol className="space-y-3 text-sm text-slate-300">
                  {[
                    'Query multiple DEX venues',
                    'Compare quotes in real-time',
                    'Auto-select best route',
                    'Execute with one click'
                  ].map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-base rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </HolographicCard>

              {/* Stats Card with Animated Metrics */}
              <HolographicCard className="glass-card p-6" glowColor="rgba(139, 92, 246, 0.15)">
                <h3 className="text-lg font-bold mb-4">Platform Stats</h3>
                <div className="space-y-4">
                  <MetricsCard
                    title="Avg. Improvement"
                    value={3.8}
                    suffix="%"
                    decimals={1}
                    trend={{ value: 12, positive: true }}
                    delay={0.4}
                  />
                  <MetricsCard
                    title="Daily Volume"
                    value={1247893}
                    prefix="$"
                    decimals={0}
                    trend={{ value: 8, positive: true }}
                    delay={0.5}
                  />
                  <MetricsCard
                    title="DEX Venues"
                    value={2}
                    decimals={0}
                    delay={0.6}
                  />
                </div>
              </HolographicCard>

              {/* Network Info */}
              <HolographicCard className="glass-card p-6" glowColor="rgba(16, 185, 129, 0.15)">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Base Sepolia</span>
                </div>
                <p className="text-xs text-slate-400">
                  Testnet • Chain ID: 84532
                </p>
              </HolographicCard>
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-sm text-slate-500"
          >
            <p>Built with ❤️ on Base • Powered by Gemini</p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}

export default App;
