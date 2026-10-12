import React from 'react';
import { Church, ShieldCheck, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';
import { APP_INFO } from '../../config/constants';

interface NavbarProps {
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
  onOpenAdminAuth: () => void;
  surveyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, onOpenAdminAuth, surveyCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-[#303632] border-b border-[#737B76]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[3.75rem] py-2 sm:h-20 sm:py-0">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => onViewChange('public')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0 flex-1 mr-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F1F3F1] border border-[#214C3B]/20 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.png"
                alt="Logo Catequistas San Martín de Porres"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[11px] text-[#214C3B] font-bold tracking-widest uppercase truncate block">
                {APP_INFO.parish} • Tarija
              </span>
              <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-tight text-[#303632] leading-tight truncate block group-hover:text-[#214C3B] transition-colors">
                {APP_INFO.name}
              </span>
              <p className="text-[10px] sm:text-xs text-[#737B76] font-light truncate flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#214C3B] shrink-0" />
                <span className="italic tracking-wide">{APP_INFO.motto}</span>
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Botón de encuesta visible en escritorio */}
            <button
              onClick={() => onViewChange('public')}
              className={`hidden md:inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'public'
                  ? 'bg-[#214C3B] text-white shadow-sm hover:bg-[#16382D]'
                  : 'text-[#737B76] hover:bg-[#F1F3F1] hover:text-[#303632]'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-inherit" />
              <span>Encuesta & Misión</span>
            </button>

            {/* Icono discreto de escudo para acceso administrativo */}
            <button
              type="button"
              onClick={onOpenAdminAuth}
              aria-label="Acceso reservado de coordinación"
              title="Acceso reservado"
              className="p-2 sm:p-2.5 rounded-xl text-[#737B76] hover:text-[#214C3B] hover:bg-[#E4EEE8] active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#214C3B]/40 shadow-xs"
            >
              <ShieldCheck className="w-5 h-5 text-inherit" />
              <span className="sr-only">Acceso reservado de coordinación</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
