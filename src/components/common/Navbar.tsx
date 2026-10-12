import React from 'react';
import { Church, ShieldCheck, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';
import { APP_INFO } from '../../config/constants';

interface NavbarProps {
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
  surveyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, surveyCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-forest-900/95 backdrop-blur-md text-white border-b border-forest-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => onViewChange('public')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/95 border border-gold-500/40 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Logo Catequistas San Martín de Porres"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wide text-cream-50">
                  {APP_INFO.name}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-gold-500/20 text-gold-300 rounded border border-gold-500/30">
                  Tarija
                </span>
              </div>
              <p className="text-xs text-cream-300 font-light flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span className="italic tracking-wider">{APP_INFO.motto}</span>
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewChange('public')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'public'
                  ? 'bg-forest-800 text-gold-300 border border-forest-700 shadow-sm'
                  : 'text-cream-200 hover:bg-forest-800/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Encuesta & Misión</span>
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'admin'
                  ? 'bg-terracotta-600 text-white shadow-md'
                  : 'bg-forest-800/80 hover:bg-forest-700 text-cream-100 border border-forest-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-gold-300" />
              <span className="hidden sm:inline">Panel Pastoral</span>
              <span className="sm:hidden">Admin</span>
              {surveyCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-gold-500 text-forest-950 font-bold rounded-full">
                  {surveyCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
