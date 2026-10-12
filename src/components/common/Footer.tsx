import React from 'react';
import { Church, MapPin, Heart, Sparkles } from 'lucide-react';
import { APP_INFO } from '../../config/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-neutral-900">
          
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-neutral-700 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Logo Catequistas San Martín de Porres"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif font-bold text-lg text-white">
                {APP_INFO.name}
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-3 leading-relaxed">
              Sistema pastoral para investigar, planificar, ejecutar y evaluar la obra social post-retiro de Confirmación.
            </p>
            <p className="text-xs text-red-400 font-serif italic flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              "{APP_INFO.motto}"
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif font-bold text-white mb-3 text-sm uppercase tracking-wider">
              Ubicación y Comunidad
            </h4>
            <ul className="text-sm space-y-2 text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{APP_INFO.parish}</span>
              </li>
              <li className="ml-6 text-xs text-neutral-400">
                Diócesis de Tarija — Tarija, Bolivia
              </li>
              <li className="ml-6 text-xs text-neutral-400">
                Pastoral de Confirmación y Acción Social 2026
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif font-bold text-white mb-3 text-sm uppercase tracking-wider">
              Pilares de la Misión
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <p>• 1. Niñez y Familias Vulnerables</p>
              <p>• 2. Adultos Mayores y Personas Solas</p>
              <p>• 3. Ecología Integral y Casa Común</p>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>© 2026 {APP_INFO.parish}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 text-neutral-300">
            Hecho con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para la comunidad juvenil de Tarija
          </p>
        </div>
      </div>
    </footer>
  );
};
