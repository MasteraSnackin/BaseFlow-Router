import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Loader2 } from 'lucide-react';
import { type QuoteRequest } from '../lib/api';
import { TokenSelector, type Token } from './TokenSelector';

interface Props {
  onSubmit: (req: QuoteRequest) => void;
  loading: boolean;
}

const TOKENS: Token[] = [
  {
    label: 'Token IN',
    symbol: 'TIN',
    address: '0xTokenInAddressOnBaseSepolia',
    icon: '🔵'
  },
  {
    label: 'Token OUT',
    symbol: 'TOUT',
    address: '0xTokenOutAddressOnBaseSepolia',
    icon: '🟣'
  }
];

export const TradeForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [tokenIn, setTokenIn] = useState(TOKENS[0].address);
  const [tokenOut, setTokenOut] = useState(TOKENS[1].address);
  const [amount, setAmount] = useState('100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInWei = (Number(amount) * 1e18).toString();
    const req: QuoteRequest = {
      chainId: 84532,
      tokenIn,
      tokenOut,
      amountIn: amountInWei,
      slippageBps: 100
    };
    onSubmit(req);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Token In */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <label className="block text-sm font-medium text-slate-400 mb-2">
          You Pay
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="0.0001"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-bold outline-none text-white placeholder-slate-500"
            placeholder="0.0"
          />
          <TokenSelector
            tokens={TOKENS}
            selectedToken={tokenIn}
            onSelectToken={setTokenIn}
          />
        </div>
      </motion.div>

      {/* Swap Direction Icon */}
      <div className="flex justify-center -my-2 relative z-10">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-2 rounded-full"
        >
          <ArrowDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </div>

      {/* Token Out */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <label className="block text-sm font-medium text-slate-400 mb-2">
          You Receive
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-2xl font-bold text-slate-500">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : '–'}
          </div>
          <TokenSelector
            tokens={TOKENS}
            selectedToken={tokenOut}
            onSelectToken={setTokenOut}
          />
        </div>
      </motion.div>

      {/* Slippage Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>Slippage Tolerance</span>
        <span className="font-semibold">1.00%</span>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Fetching Quotes...
          </>
        ) : (
          'Get Best Quote'
        )}
      </motion.button>
    </form>
  );
};
