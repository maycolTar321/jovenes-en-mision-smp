import React from 'react';
import { PillarInfo } from '../../types';
import { PillarImage } from '../common/PillarImage';
import { 
  X, ArrowLeft, Check, Sparkles, BookOpen, Heart, ShieldCheck, MapPin, Target, Calendar, Award 
} from 'lucide-react';

interface PillarDetailModalProps {
  pillar: PillarInfo;
  isOpen: boolean;
  onClose: () => void;
  onSelectPillar: (pillar: PillarInfo) => void;
}

export const PillarDetailModal: React.FC<PillarDetailModalProps> = ({
  pillar,
  isOpen,
  onClose,
  onSelectPillar
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200/90 flex flex-col justify-between">
        
        {/* Cabecera con Fotografía Principal */}
        <div className="relative">
          <PillarImage
            src={pillar.imageUrl}
            alt={pillar.imageAlt}
            pillarNumber={pillar.number}
            pillarTitle={pillar.title}
            color={pillar.color}
            className="h-60 sm:h-72 rounded-t-3xl rounded-b-none"
          />

          <button
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 flex items-center justify-center shadow-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-300 drop-shadow">
              PILAR {pillar.number} • PARROQUIA SAN MARTÍN DE PORRES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold drop-shadow-md text-white mt-1">
              {pillar.title}
            </h2>
            <p className="text-xs sm:text-sm text-cream-100 italic drop-shadow font-light">
              "{pillar.subtitle}"
            </p>
          </div>
        </div>

        {/* Contenido Completo del Detalle */}
        <div className="p-6 sm:p-8 space-y-8 bg-cream-50/40">
          
          {/* Cita Bíblica y Reflexión */}
          <div className="bg-white rounded-2xl p-6 border-l-4 border-l-gold-500 border border-stone-200/80 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-stone-900">
              <BookOpen className="w-5 h-5 text-gold-600 shrink-0" />
              <span className="font-serif font-bold text-sm text-forest-900">
                Iluminación Bíblica: {pillar.bibleQuote}
              </span>
            </div>
            {pillar.bibleVerseText && (
              <blockquote className="text-sm font-serif italic text-stone-700 bg-cream-100/60 p-3.5 rounded-xl border border-cream-200 leading-relaxed">
                {pillar.bibleVerseText}
              </blockquote>
            )}
            <div className="pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700 block mb-1">
                Reflexión para el Joven Confirmado:
              </span>
              <p className="text-sm text-stone-700 leading-relaxed font-medium">
                "{pillar.reflection}"
              </p>
            </div>
          </div>

          {/* 1. Qué busca la misión */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
              <Target className="w-5 h-5 text-forest-700" />
              ¿Qué busca esta misión?
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200">
              {pillar.description}
            </p>
            <p className="text-xs text-stone-500 italic px-1">
              <strong>Impacto en Tarija:</strong> {pillar.needAddressed}
            </p>
          </div>

          {/* 2. Qué actividades se podrían realizar */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-terracotta-600" />
              ¿Qué actividades realizaremos en campo?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pillar.activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-800">
                  <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="font-medium">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Qué compromiso puede implicar */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest-700" />
              ¿Qué compromiso implica para ti?
            </h3>
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {pillar.commitment}
            </div>
          </div>

          {/* 4. Qué habilidades pueden ser útiles */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-600" />
              ¿Qué habilidades y carismas son de gran ayuda?
            </h3>
            <div className="flex flex-wrap gap-2">
              {pillar.usefulSkills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-forest-200 text-forest-900 shadow-xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-700" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Lugar de misión previsto */}
          <div className="flex items-center gap-2 text-xs text-stone-600 p-3 bg-stone-100/70 rounded-xl">
            <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
            <span><strong>Lugar previsto en Tarija:</strong> {pillar.targetLocation}</span>
          </div>

        </div>

        {/* Botones de Acción (Requisito 3) */}
        <div className="p-4 sm:p-6 bg-white border-t border-stone-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto btn-secondary text-xs sm:text-sm py-3 px-6 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER A LAS MISIONES</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPillar(pillar)}
            className="w-full sm:w-auto btn-gold text-xs sm:text-sm py-3 px-8 font-bold text-forest-950 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform"
          >
            <Check className="w-4 h-4" />
            <span>INICIAR ENCUESTA AQUÍ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
