import { Scene } from './components/Scene';
import { Controls } from './components/UI/Controls';
import { LogTerminal } from './components/UI/LogTerminal';

function App() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* 3D Scene Layer */}
      <Scene />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <LogTerminal />
          <Controls />
        </div>

        {/* Title / Header */}
        <div className="absolute top-8 left-8 pointer-events-none">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            MERGE SORT
          </h1>
          <p className="text-white/50 text-sm font-mono mt-1 tracking-widest">VISUALIZER v2.0</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 right-8 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 text-xs font-mono text-white/70 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff5a4e] rounded-full shadow-[0_0_8px_#ff5a4e]" />
            <span>DIVIDE PHASE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3eef8b] rounded-full shadow-[0_0_8px_#3eef8b]" />
            <span>MERGE PHASE</span>
          </div>
           <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00f3ff] rounded-full shadow-[0_0_8px_#00f3ff]" />
            <span>ACTIVE NODE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
