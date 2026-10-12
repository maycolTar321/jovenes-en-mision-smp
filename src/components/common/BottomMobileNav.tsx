import React from 'react';
import { Home, ClipboardCheck, Layers, ShieldCheck, Heart } from 'lucide-react';

interface BottomMobileNavProps {
  currentView: 'public' | 'admin';
  onNavigateHome: () => void;
  onNavigateSurvey: () => void;
  onNavigatePillars: () => void;
  onNavigateAdmin: () => void;
  surveyCount: number;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({
  currentView,
  onNavigateHome,
  onNavigateSurvey,
  onNavigatePillars,
  onNavigateAdmin,
  surveyCount
}) => {
  return (
    <nav 
      aria-label="Navegación Móvil" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 px-2"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        
        {/* 1. Botón Inicio */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentView === 'public'
              ? 'text-forest-800 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentView === 'public' ? 'bg-forest-100' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Inicio</span>
        </button>

        {/* 2. Botón Encuesta */}
        <button
          type="button"
          onClick={onNavigateSurvey}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-forest-800 transition-all active:scale-95"
        >
          <div className="p-1 rounded-xl bg-gold-400 text-forest-950 shadow-sm">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-forest-900 tracking-tight mt-0.5">Encuesta</span>
        </button>

        {/* 3. Botón Pilares */}
        <button
          type="button"
          onClick={onNavigatePillars}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-500 hover:text-stone-800 transition-all"
        >
          <div className="p-1 rounded-xl">
            <Layers className="w-5 h-5 text-terracotta-600" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Pilares</span>
        </button>

        {/* 4. Botón Catequistas / Admin */}
        <button
          type="button"
          onClick={onNavigateAdmin}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentView === 'admin'
              ? 'text-terracotta-700 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentView === 'admin' ? 'bg-terracotta-100' : ''}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Catequistas</span>
          {surveyCount > 0 && (
            <span className="absolute top-1 right-3 px-1.5 py-0.2 text-[9px] font-bold bg-gold-500 text-forest-950 rounded-full border border-white">
              {surveyCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
};
