import React from 'react';
import { WriteupInfo } from '../data/writeups';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Terminal, Layers, Search, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SpaceMindMapProps {
  writeups: WriteupInfo[];
  language: 'en' | 'ar';
  onDelete: (id: string) => void;
}

const SpaceBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem] z-0 bg-[#050510]">
    {/* Nebula glows */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
    <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px]"></div>
    
    {/* CSS Stars */}
    <div 
      className="absolute inset-0 opacity-60" 
      style={{ 
        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.8), rgba(0,0,0,0))', 
        backgroundSize: '150px 150px' 
      }}>
    </div>
    <div 
      className="absolute inset-0 opacity-40 mix-blend-screen" 
      style={{ 
        backgroundImage: 'radial-gradient(1.5px 1.5px at 100px 100px, #c084fc, rgba(0,0,0,0)), radial-gradient(2px 2px at 250px 250px, #38bdf8, rgba(0,0,0,0)), radial-gradient(1px 1px at 350px 50px, #ffffff, rgba(0,0,0,0))', 
        backgroundSize: '400px 400px'
      }}>
    </div>
  </div>
);

const CategoryNode = ({ title, icon, items, color, isAr }: any) => {
  const colorMap: any = {
    red: { border: 'border-red-500/30', bg: 'bg-red-500/10', titleColor: 'text-red-200', text: 'text-red-100/80', dot: 'text-red-500/50', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
    cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', titleColor: 'text-cyan-200', text: 'text-cyan-100/80', dot: 'text-cyan-500/50', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.1)]' },
    purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', titleColor: 'text-purple-200', text: 'text-purple-100/80', dot: 'text-purple-500/50', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', titleColor: 'text-emerald-200', text: 'text-emerald-100/80', dot: 'text-emerald-500/50', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
  };

  const scheme = colorMap[color];

  return (
    <div className={cn(
      "flex flex-col bg-[#080816]/80 backdrop-blur-md rounded-2xl overflow-hidden h-full transition-all group hover:-translate-y-1 relative z-20",
      scheme.border, "border", scheme.glow
    )}>
      <div className={cn(
        "p-4 flex items-center gap-3 border-b",
        scheme.bg, scheme.border,
        isAr ? "flex-row-reverse" : ""
      )}>
        <div className="bg-black/40 p-2 rounded-xl backdrop-blur-md border border-white/5">
          {icon}
        </div>
        <h4 className={cn("font-bold text-sm", scheme.titleColor, isAr ? "text-right" : "text-left")}>
          {title}
        </h4>
      </div>
      <div className={cn("p-5 flex-1 relative", isAr ? "text-right" : "text-left")}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        <ul className={cn("flex flex-col gap-3 relative z-10 list-none m-0 p-0", isAr ? "items-end" : "items-start")}>
          {(!items || items.length === 0) && (
             <li className="text-xs text-white/30 italic">
               {isAr ? 'لا يوجد تفاصيل' : 'No details available'}
             </li>
          )}
          {items && items.map((item: string, i: number) => (
            <li key={i} className={cn("text-xs md:text-sm flex gap-3 group/item w-full", isAr ? "flex-row-reverse" : "flex-row")}>
               <span className={cn("mt-1.5 flex-shrink-0 text-[10px]", scheme.dot)}>✦</span>
               <span className={cn("leading-relaxed transition-colors group-hover/item:text-white flex-1", scheme.text, isAr ? "text-right" : "text-left")}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const WriteupTree = ({ writeup, language, onDelete, index }: any) => {
  const isAr = language === 'ar';
  const title = isAr && writeup.titleAr ? writeup.titleAr : writeup.title;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex flex-col items-center w-full my-8 pb-12 border-b border-indigo-500/20 last:border-0 last:pb-0"
    >
      {/* Root Node (Planet/Sun) */}
      <div className="group relative z-30 bg-[#0a0a2a]/90 backdrop-blur-xl border-2 border-indigo-500/50 rounded-3xl p-6 md:px-10 shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:border-indigo-400 transition-all max-w-3xl w-[90%] md:w-auto text-center">
        <button 
          onClick={() => onDelete(writeup.id)} 
          className="absolute -top-4 -right-4 bg-[#1a0a1a] text-red-500 p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-red-500/30 shadow-lg scale-90 group-hover:scale-100 z-50"
          title={isAr ? "حذف" : "Delete"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-600/30">
          {isAr ? 'رايت اب' : 'Writeup'}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-purple-400 mt-2 leading-tight px-4">
          {title}
        </h3>
      </div>

      {/* SVG Connection Tree - Desktop Only */}
      <div className="hidden lg:block w-full h-16 relative z-10 -mt-px pointer-events-none">
        <svg preserveAspectRatio="none" className="w-full h-full" viewBox="0 0 1000 100">
          {/* Main trunk */}
          <path d="M 500 0 L 500 50" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          {/* Horizontal branches */}
          <path d="M 125 50 L 875 50" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          
          {/* Drops to nodes */}
          <path d="M 125 50 L 125 100" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
          <path d="M 375 50 L 375 100" fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth="2" />
          <path d="M 625 50 L 625 100" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="2" />
          <path d="M 875 50 L 875 100" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />

          {/* Glow points at intersections */}
          <circle cx="500" cy="50" r="4" fill="#818cf8" className="animate-pulse" />
          <circle cx="125" cy="50" r="3" fill="#fca5a5" />
          <circle cx="375" cy="50" r="3" fill="#67e8f9" />
          <circle cx="625" cy="50" r="3" fill="#d8b4fe" />
          <circle cx="875" cy="50" r="3" fill="#6ee7b7" />
        </svg>
      </div>

      {/* Mobile Connector */}
      <div className="lg:hidden w-px h-8 bg-gradient-to-b from-indigo-500/50 to-transparent my-2"></div>

      {/* Children Nodes (Planets/Moons) */}
      {/* We use flex-row-reverse for Arabic so the visual order flows right-to-left even though columns are the same */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-20 px-4 lg:px-0",
      )} dir={isAr ? 'rtl' : 'ltr'}>
         <div className="h-full">
            <CategoryNode 
              title={isAr ? 'الثغرات' : 'Vulnerabilities'}
              icon={<Shield className="w-5 h-5 text-red-400" />}
              items={isAr && writeup.vulnerabilitiesAr ? writeup.vulnerabilitiesAr : writeup.vulnerabilities}
              color="red"
              isAr={isAr}
            />
         </div>
         <div className="h-full">
            <CategoryNode 
              title={isAr ? 'الأدوات' : 'Tools'}
              icon={<Terminal className="w-5 h-5 text-cyan-400" />}
              items={writeup.tools}
              color="cyan"
              isAr={isAr}
            />
         </div>
         <div className="h-full">
            <CategoryNode 
              title={isAr ? 'خطوات الاستغلال' : 'Methodology'}
              icon={<Layers className="w-5 h-5 text-purple-400" />}
              items={isAr && writeup.methodologyAr ? writeup.methodologyAr : writeup.methodology}
              color="purple"
              isAr={isAr}
            />
         </div>
         <div className="h-full">
            <CategoryNode 
              title={isAr ? 'الدروس المستفادة' : 'Key Takeaways'}
              icon={<Search className="w-5 h-5 text-emerald-400" />}
              items={isAr && writeup.keyTakeawaysAr ? writeup.keyTakeawaysAr : writeup.keyTakeaways}
              color="emerald"
              isAr={isAr}
            />
         </div>
      </div>
    </motion.div>
  );
};

export const SpaceMindMap: React.FC<SpaceMindMapProps> = ({ writeups, language, onDelete }) => {
  return (
    <div className="relative w-full min-h-[600px] rounded-[2.5rem] overflow-hidden bg-[#050510] border border-indigo-500/30 md:p-8 lg:p-12 p-4 shadow-[0_0_50px_rgba(99,102,241,0.15)] isolate">
      <SpaceBackground />
      <div className="relative z-10 flex flex-col">
        <AnimatePresence>
          {writeups.map((writeup, index) => (
            <WriteupTree 
              key={writeup.id} 
              writeup={writeup} 
              language={language} 
              onDelete={onDelete} 
              index={index} 
            />
          ))}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      `}</style>
    </div>
  );
};
