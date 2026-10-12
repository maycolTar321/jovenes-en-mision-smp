import React from 'react';
import { Church, MapPin, Heart, Sparkles } from 'lucide-react';
import { APP_INFO } from '../../config/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-200 border-t border-forest-900 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-forest-900/60">
          
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-gold-500/30 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Logo Catequistas San Martín de Porres"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif font-bold text-lg text-cream-50">
                {APP_INFO.name}
              </span>
            </div>
            <p className="text-sm text-cream-300/80 mb-3 leading-relaxed">
              Sistema pastoral para investigar, planificar, ejecutar y evaluar la obra social post-retiro de Confirmación.
            </p>
            <p className="text-xs text-gold-400 font-serif italic flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              "{APP_INFO.motto}"
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif font-bold text-cream-100 mb-3 text-sm uppercase tracking-wider">
              Ubicación y Comunidad
            </h4>
            <ul className="text-sm space-y-2 text-cream-300/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span>{APP_INFO.parish}</span>
              </li>
              <li className="ml-6 text-xs text-cream-400">
                Diócesis de Tarija — Tarija, Bolivia
              </li>
              <li className="ml-6 text-xs text-cream-400">
                Pastoral de Confirmación y Acción Social 2026
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif font-bold text-cream-100 mb-3 text-sm uppercase tracking-wider">
              Pilares de la Misión
            </h4>
            <div className="space-y-1.5 text-xs text-cream-300/80">
              <p>🌱 1. Niñez y Familias Vulnerables</p>
              <p>🤝 2. Adultos Mayores y Personas Solas</p>
              <p>🌿 3. Ecología Integral y Casa Común</p>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-3">
          <p>© 2026 {APP_INFO.parish}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 text-cream-300">
            Hecho con <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" /> para la comunidad juvenil de Tarija
          </p>
        </div>
      </div>
    </footer>
  );
};
