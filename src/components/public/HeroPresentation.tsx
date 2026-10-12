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
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#F1F3F1] via-white to-[#F1F3F1] text-[#303632] shadow-soft p-5 sm:p-10 lg:p-14 border border-[#737B76]/15">
        
        {/* Luces sutiles de fondo en verde bosque suave */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E4EEE8]/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#E4EEE8]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Bloque Destacado de Parroquia */}
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#214C3B] bg-[#E4EEE8] px-3.5 py-1 rounded-full border border-[#214C3B]/15">
              Comunidad Eclesial & Pastoral Juvenil
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide text-[#303632] leading-tight mt-1">
              PARROQUIA SAN MARTÍN DE PORRES
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#737B76] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#214C3B] inline-block" />
              <span className="tracking-wider uppercase text-[11px] sm:text-xs">Tarija, Bolivia</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#214C3B] inline-block" />
            </div>
          </div>

          {/* Título Principal */}
          <div className="space-y-1.5 pt-2 border-t border-[#737B76]/15">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#303632] leading-tight">
              JÓVENES EN MISIÓN SMP
            </h1>

            {/* Lema */}
            <p className="text-base sm:text-xl lg:text-2xl font-serif font-extrabold italic text-[#214C3B] tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#214C3B] shrink-0" />
              <span>LA FE SE VIVE SIRVIENDO.</span>
            </p>
          </div>

          {/* Texto de la Portada */}
          <p className="text-xs sm:text-base lg:text-lg text-[#737B76] font-normal leading-relaxed max-w-2xl mx-auto px-1">
            “Tu camino de fe continúa. Descubre cómo puedes poner tus talentos al servicio de los demás y ayudar a transformar nuestra comunidad”.
          </p>

          {/* Botón Principal: INICIAR ENCUESTA (Verde Bosque) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDiscoverMissionClick}
              className="w-full sm:w-auto text-sm sm:text-base py-3 sm:py-3.5 px-7 sm:px-10 rounded-xl sm:rounded-2xl font-black bg-[#214C3B] hover:bg-[#16382D] text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 ring-4 ring-[#214C3B]/10"
            >
              <span>INICIAR ENCUESTA</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          {/* Frase Inspiradora Pastoral */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-[#737B76] font-serif italic">
            <Sparkles className="w-3.5 h-3.5 text-[#214C3B] shrink-0" />
            <span>«Aquí estoy, Señor, envíame a mí» (Is 6,8) • Pastoral de Confirmación 2026</span>
          </div>

        </div>
      </section>

      {/* 2. TRES TARJETAS PRINCIPALES */}
      <section ref={pillarsSectionRef} className="space-y-6 sm:space-y-8 scroll-mt-20">
        
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#214C3B] bg-[#E4EEE8] px-3.5 py-1 rounded-full border border-[#214C3B]/20">
            Campos de Acción Pastoral
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-black text-[#303632] leading-tight">
            Conoce los Tres Pilares de Nuestra Misión
          </h2>
          <p className="text-xs sm:text-sm text-[#737B76]">
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
                      <span className="text-xs font-bold tracking-widest uppercase text-[#214C3B]">
                        PILAR {pillar.number}
                      </span>
                      <span className="text-[11px] text-[#737B76] font-mono">
                        SMP Tarija
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#303632] group-hover:text-[#214C3B] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs font-medium text-[#214C3B] italic">
                      "{pillar.subtitle}"
                    </p>

                    <p className="text-sm text-[#737B76] leading-relaxed pt-1">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Qué necesidad busca atender */}
                  <div className="p-3.5 bg-[#F1F3F1] rounded-xl border border-[#737B76]/15 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#303632] flex items-center gap-1.5">
                      <Church className="w-3.5 h-3.5 text-[#214C3B]" />
                      Necesidad que busca atender:
                    </span>
                    <p className="text-xs text-[#737B76] leading-relaxed">
                      {pillar.needAddressed}
                    </p>
                  </div>

                  {/* Ejemplos de acciones */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#737B76]">
                      Ejemplos de acciones:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#303632]">
                      {pillar.activities.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#214C3B] mt-1.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cita bíblica y reflexión */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#737B76]/20 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-[#303632] font-bold font-serif">
                      <BookOpen className="w-3.5 h-3.5 text-[#214C3B] shrink-0" />
                      <span>{pillar.bibleQuote}</span>
                    </div>
                    {pillar.bibleVerseText && (
                      <p className="italic text-[#737B76] font-serif text-[11px] border-l-2 border-[#214C3B] pl-2">
                        {pillar.bibleVerseText}
                      </p>
                    )}
                    <p className="text-[11px] text-[#303632] leading-relaxed bg-[#F1F3F1] p-2 rounded border border-[#737B76]/15 font-medium">
                      “{pillar.reflection}”
                    </p>
                  </div>

                  {/* Botón: VER Y PARTICIPAR */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPillarDetail(pillar)}
                      className="w-full btn-primary py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
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
