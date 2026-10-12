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
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md text-white border-b border-neutral-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[3.75rem] py-2 sm:h-20 sm:py-0">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => onViewChange('public')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0 flex-1 mr-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border-2 border-red-600/40 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.png"
                alt="Logo Catequistas San Martín de Porres"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[11px] text-red-400 font-bold tracking-widest uppercase truncate block">
                {APP_INFO.parish} • Tarija
              </span>
              <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-tight text-white leading-tight truncate block">
                {APP_INFO.name}
              </span>
              <p className="text-[10px] sm:text-xs text-neutral-300 font-light truncate flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 shrink-0" />
                <span className="italic tracking-wide">{APP_INFO.motto}</span>
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Botón de encuesta visible en escritorio (en móvil ya está en la barra inferior) */}
            <button
              onClick={() => onViewChange('public')}
              className={`hidden md:inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'public'
                  ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-white" />
              <span>Encuesta & Misión</span>
            </button>

            {/* Icono discreto de acceso restringido (sin texto "Panel Pastoral" ni "Admin") */}
            <button
              type="button"
              onClick={onOpenAdminAuth}
              aria-label="Acceso reservado de coordinación"
              title="Acceso reservado"
              className="p-2 sm:p-2.5 rounded-xl text-neutral-300 hover:text-red-400 hover:bg-neutral-800 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-neutral-300 hover:text-red-400" />
              <span className="sr-only">Acceso reservado de coordinación</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
