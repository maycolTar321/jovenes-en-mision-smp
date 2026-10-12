import React, { useRef, useState } from 'react';
import { PillarId, PillarInfo } from '../../types';
import { PILLARS, PRIMARY_PILLAR_KEYS } from '../../config/pillars';
import { PillarImage } from '../common/PillarImage';
import { PillarDetailModal } from './PillarDetailModal';
import { 
  ArrowRight, Church, HeartHandshake, Smile, Sprout, Sparkles, MapPin, 
  BookOpen, ChevronDown, Flame, CheckCircle2, Award 
} from 'lucide-react';

interface HeroPresentationProps {
  onStartSurvey: (selectedPillar?: PillarId) => void;
  surveyCount: number;
}

export const HeroPresentation: React.FC<HeroPresentationProps> = ({ onStartSurvey, surveyCount }) => {
  const pillarsSectionRef = useRef<HTMLDivElement>(null);
  const [selectedPillarForModal, setSelectedPillarForModal] = useState<PillarInfo | null>(null);

  const handleDiscoverMissionClick = () => {
    pillarsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenPillarDetail = (pillar: PillarInfo) => {
    setSelectedPillarForModal(pillar);
  };

  const handleChooseMission = (pillar: PillarInfo) => {
    setSelectedPillarForModal(null);
    onStartSurvey(pillar.id);
  };

  return (
    <div className="space-y-8 sm:space-y-14 py-2 sm:py-4">
      
      {/* 1. PORTADA */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white shadow-elevated p-4 sm:p-10 lg:p-16 border border-neutral-800">
        
        {/* Luces sutiles de fondo en rojo institucional */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Bloque Destacado de Parroquia */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="space-y-1.5 max-w-2xl px-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-500 block">
                Comunidad Eclesial & Pastoral Juvenil
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide text-white leading-tight">
                PARROQUIA SAN MARTÍN DE PORRES
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                <span className="tracking-wider uppercase text-[11px] sm:text-xs">Tarija, Bolivia</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
              </div>
            </div>
          </div>

          {/* Título Principal */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              JÓVENES EN MISIÓN SMP
            </h1>

            {/* Lema */}
            <p className="text-base sm:text-xl lg:text-2xl font-serif font-extrabold italic text-red-500 tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
              <span>LA FE SE VIVE SIRVIENDO.</span>
            </p>
          </div>

          {/* Texto de la Portada */}
          <p className="text-xs sm:text-base lg:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto px-1">
            “Tu camino de fe continúa. Descubre cómo puedes poner tus talentos al servicio de los demás y ayudar a transformar nuestra comunidad”.
          </p>

          {/* Botón Principal: INICIAR ENCUESTA (Rojo Institucional) */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDiscoverMissionClick}
              className="w-full sm:w-auto text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-10 rounded-xl sm:rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-red-600/20"
            >
              <span>INICIAR ENCUESTA</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          {/* Frase Inspiradora Pastoral */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-neutral-400 font-serif italic">
            <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>«Aquí estoy, Señor, envíame a mí» (Is 6,8) • Pastoral de Confirmación 2026</span>
          </div>

        </div>
      </section>

      {/* 2. TRES TARJETAS PRINCIPALES */}
      <section ref={pillarsSectionRef} className="space-y-6 sm:space-y-8 scroll-mt-20">
        
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Campos de Acción Pastoral
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-black text-neutral-900 leading-tight">
            Conoce los Tres Pilares de Nuestra Misión
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Explora las fotografías y detalles de cada misión, reflexiona en la cita bíblica y elige dónde deseas servir en Tarija.
          </p>
        </div>

        {/* Grid de las 3 Tarjetas Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
          {PRIMARY_PILLAR_KEYS.map((key) => {
            const pillar = PILLARS[key];
            if (!pillar) return null;

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Fotografía Real y Pertinente */}
                <div className="relative">
                  <PillarImage
                    src={pillar.imageUrl}
                    alt={pillar.imageAlt}
                    pillarNumber={pillar.number}
                    pillarTitle={pillar.title}
                    color={pillar.color}
                    className="h-48 sm:h-60"
                  />
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="p-4 sm:p-7 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
                  
                  {/* Encabezado del Pilar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-widest uppercase text-red-700">
                        PILAR {pillar.number}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        SMP Tarija
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-black text-neutral-900 group-hover:text-red-700 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs font-medium text-red-700 italic">
                      "{pillar.subtitle}"
                    </p>

                    <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Qué necesidad busca atender */}
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <Church className="w-3.5 h-3.5 text-red-600" />
                      Necesidad que busca atender:
                    </span>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {pillar.needAddressed}
                    </p>
                  </div>

                  {/* Ejemplos de acciones */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                      Ejemplos de acciones:
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      {pillar.activities.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cita bíblica y reflexión */}
                  <div className="p-3.5 bg-white rounded-xl border border-neutral-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-neutral-900 font-bold font-serif">
                      <BookOpen className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{pillar.bibleQuote}</span>
                    </div>
                    {pillar.bibleVerseText && (
                      <p className="italic text-neutral-600 font-serif text-[11px] border-l-2 border-red-500 pl-2">
                        {pillar.bibleVerseText}
                      </p>
                    )}
                    <p className="text-[11px] text-neutral-700 leading-relaxed bg-neutral-50 p-2 rounded border border-neutral-200 font-medium">
                      “{pillar.reflection}”
                    </p>
                  </div>

                  {/* Botón: VER Y PARTICIPAR */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPillarDetail(pillar)}
                      className="w-full btn-primary py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <span>VER Y PARTICIPAR</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* Modal de Detalle (Requisito 3) */}
      {selectedPillarForModal && (
        <PillarDetailModal
          pillar={selectedPillarForModal}
          isOpen={true}
          onClose={() => setSelectedPillarForModal(null)}
          onSelectPillar={handleChooseMission}
        />
      )}

    </div>
  );
};
