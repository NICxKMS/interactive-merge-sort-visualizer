import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSortingStore } from '../../store/sortingStore';
import { useEffect } from 'react';

export const Controls = () => {
  const {
    isPlaying, setIsPlaying, nextStep, prevStep, reset,
    speed, setSpeed, arraySize, setArraySize
  } = useSortingStore();

  // Auto-play effect
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep();
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, nextStep]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-4 z-10 shadow-2xl w-[90%] max-w-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between gap-6">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
           <button
            onClick={prevStep}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-4 rounded-full transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] ${isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-cyber-primary/20 text-cyber-primary hover:bg-cyber-primary/30'}`}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={nextStep}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80"
          >
            <ChevronRight size={24} />
          </button>

          <button
            onClick={reset}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white ml-2"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Sliders */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60 w-16 font-mono">SPEED</span>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              // Reverse value so right is faster? Or standard left=slow?
              // Usually left=slow (high delay), right=fast (low delay).
              // But speed value is ms delay. So left=1000ms (slow), right=10ms (fast).
              value={1010 - speed}
              onChange={(e) => setSpeed(1010 - parseInt(e.target.value))}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60 w-16 font-mono">SIZE: {arraySize}</span>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber-secondary"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
