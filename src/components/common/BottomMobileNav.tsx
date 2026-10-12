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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom,0px),0.25rem)] pt-1 px-1.5"
    >
      <div className="grid grid-cols-4 items-center justify-around w-full max-w-md mx-auto">
        
        {/* 1. Botón Inicio */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            currentView === 'public'
              ? 'text-red-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${currentView === 'public' ? 'bg-red-50 text-red-600' : ''}`}>
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Inicio</span>
        </button>

        {/* 2. Botón Encuesta */}
        <button
          type="button"
          onClick={onNavigateSurvey}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-700 transition-all active:scale-95"
        >
          <div className="p-1 rounded-lg bg-red-600 text-white shadow-xs">
            <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-bold text-neutral-900 tracking-tight mt-0.5 leading-tight">Encuesta</span>
        </button>

        {/* 3. Botón Pilares */}
        <button
          type="button"
          onClick={onNavigatePillars}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-500 hover:text-stone-800 transition-all"
        >
          <div className="p-1 rounded-lg">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Pilares</span>
        </button>

        {/* 4. Icono discreto de acceso restringido */}
        <button
          type="button"
          onClick={onNavigateAdmin}
          aria-label="Acceso reservado de coordinación"
          title="Acceso reservado"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-90 ${
            currentView === 'admin'
              ? 'text-red-600'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${currentView === 'admin' ? 'bg-red-50 text-red-600' : ''}`}>
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 hover:text-neutral-800" />
          </div>
          <span className="text-[10px] text-stone-400 tracking-tight mt-0.5 leading-tight">Acceso</span>
        </button>

      </div>
    </nav>
  );
};
