import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Check } from 'lucide-react';

export interface Token {
  label: string;
  symbol: string;
  address: string;
  icon: string;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: string;
  onSelectToken: (address: string) => void;
  disabled?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onSelectToken,
  disabled = false
}) => {
  const [open, setOpen] = React.useState(false);

  const selected = tokens.find(t => t.address === selectedToken);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className="glass-card px-4 py-2.5 font-semibold outline-none cursor-pointer
                   hover:bg-white/10 transition-all rounded-xl flex items-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2
                   focus-visible:ring-base-400"
        >
          <span className="text-xl">{selected?.icon}</span>
          <span className="text-sm font-bold">{selected?.symbol}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </motion.button>
      </Popover.Trigger>

      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <Popover.Content
              align="end"
              sideOffset={8}
              className="z-50"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="glass-card p-2 min-w-[200px] shadow-glow-md"
              >
                <div className="space-y-1">
                  {tokens.map((token) => {
                    const isSelected = token.address === selectedToken;
                    return (
                      <motion.button
                        key={token.address}
                        type="button"
                        onClick={() => {
                          onSelectToken(token.address);
                          setOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                 transition-colors text-left group
                                 ${isSelected
                                   ? 'bg-gradient-base text-white'
                                   : 'hover:bg-white/5 text-slate-300'
                                 }`}
                      >
                        <span className="text-2xl">{token.icon}</span>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{token.symbol}</div>
                          <div className="text-xs opacity-60">{token.label}</div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
