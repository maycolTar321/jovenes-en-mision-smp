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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => onViewChange('public')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-red-600/40 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Logo Catequistas San Martín de Porres"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wide text-white">
                  {APP_INFO.name}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-600/20 text-red-300 rounded border border-red-500/40">
                  Tarija
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-red-500" />
                <span className="italic tracking-wider">{APP_INFO.motto}</span>
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onViewChange('public')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
              className="p-2 sm:p-2.5 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-neutral-800 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm"
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
