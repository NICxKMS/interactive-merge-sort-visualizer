import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useSortingStore } from '../../store/sortingStore';
import { useEffect, useRef } from 'react';

export const LogTerminal = () => {
  const { history, currentStep } = useSortingStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get last 5 logs or so
  // Actually, we just want to show the log of the current step and maybe previous few?
  // Or a cumulative log? The generator yields the "log for that step".

  // Let's accumulate logs up to current step.
  // Optimally, we shouldn't re-render all strings.
  // But for simplicity, let's just show the logs of the last 10 steps.
  const logsToShow = history.slice(Math.max(0, currentStep - 8), currentStep + 1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentStep]);

  return (
    <motion.div
      className="absolute top-8 right-8 w-80 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl z-10 flex flex-col"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-white/5 p-3 flex items-center gap-2 border-b border-white/5">
        <Terminal size={14} className="text-cyber-primary" />
        <span className="text-xs font-mono text-white/60">SYSTEM_LOG</span>
      </div>

      <div ref={scrollRef} className="h-64 overflow-y-auto p-4 font-mono text-xs flex flex-col gap-2">
        <AnimatePresence mode='popLayout'>
          {logsToShow.map((frame, i) => (
            <motion.div
              key={`${frame.activeNodeId}-${i}`} // Use unique key
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-2 rounded border-l-2 ${
                frame.phase === 'divide' ? 'border-red-400 bg-red-400/10 text-red-200' :
                frame.phase === 'merge' ? 'border-green-400 bg-green-400/10 text-green-200' :
                frame.phase === 'completed' ? 'border-blue-400 bg-blue-400/10 text-blue-200' :
                'border-gray-500 text-gray-400'
              }`}
            >
              <span className="opacity-50 mr-2">[{currentStep - logsToShow.length + 1 + i}]</span>
              {frame.log}
            </motion.div>
          ))}
        </AnimatePresence>
        {logsToShow.length === 0 && <div className="text-gray-500 italic">Ready to start...</div>}
      </div>
    </motion.div>
  );
};
