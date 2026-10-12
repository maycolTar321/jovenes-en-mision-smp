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
    <div className="space-y-16 py-4">
      
      {/* 1. PORTADA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white shadow-elevated p-8 sm:p-14 lg:p-18 border border-forest-700/80">
        
        {/* Luces sutiles de fondo */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-terracotta-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Logo Oficial de Catequistas y Badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-gold-400/40 shadow-xl hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="Logo Catequistas San Martín de Porres"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-white p-1.5 shadow-inner"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/90 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm">
              <Flame className="w-4 h-4 text-terracotta-400" />
              <span>Parroquia San Martín de Porres • Tarija, Bolivia</span>
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-cream-50 leading-tight">
            JÓVENES EN MISIÓN SMP
          </h1>

          {/* Lema */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold italic text-gold-300 tracking-wider flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-gold-400 shrink-0" />
            <span>LA FE SE VIVE SIRVIENDO.</span>
          </p>

          {/* Texto de la Portada */}
          <p className="text-base sm:text-lg lg:text-xl text-cream-200/95 font-light leading-relaxed max-w-2xl mx-auto">
            “Tu camino de fe continúa. Descubre cómo puedes poner tus talentos al servicio de los demás y ayudar a transformar nuestra comunidad”.
          </p>

          {/* Botón Principal: INICIAR ENCUESTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDiscoverMissionClick}
              className="btn-gold text-base sm:text-lg py-4 px-10 rounded-2xl font-black text-forest-950 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>INICIAR ENCUESTA</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>

          {/* Frase Inspiradora Pastoral */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-gold-200/90 font-serif italic">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <span>«Aquí estoy, Señor, envíame a mí» (Is 6,8) • Pastoral de Confirmación 2026</span>
          </div>

        </div>
      </section>

      {/* 2. TRES TARJETAS PRINCIPALES */}
      <section ref={pillarsSectionRef} className="space-y-8 scroll-mt-24">
        
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 bg-terracotta-50 px-4 py-1.5 rounded-full border border-terracotta-200">
            Campos de Acción Pastoral
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-forest-950">
            Conoce los Tres Pilares de Nuestra Misión
          </h2>
          <p className="text-sm text-stone-600">
            Explora las fotografías y detalles de cada misión, reflexiona en la cita bíblica y elige dónde deseas servir en Tarija.
          </p>
        </div>

        {/* Grid de las 3 Tarjetas Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRIMARY_PILLAR_KEYS.map((key) => {
            const pillar = PILLARS[key];
            if (!pillar) return null;

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Fotografía Real y Pertinente con Recorte Coherente */}
                <div className="relative">
                  <PillarImage
                    src={pillar.imageUrl}
                    alt={pillar.imageAlt}
                    pillarNumber={pillar.number}
                    pillarTitle={pillar.title}
                    color={pillar.color}
                    className="h-56 sm:h-60"
                  />
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                  
                  {/* Encabezado del Pilar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-widest uppercase text-terracotta-700">
                        PILAR {pillar.number}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        SMP Tarija
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 group-hover:text-forest-800 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs font-medium text-forest-700 italic">
                      "{pillar.subtitle}"
                    </p>

                    <p className="text-sm text-stone-600 leading-relaxed pt-1">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Qué necesidad busca atender */}
                  <div className="p-3.5 bg-cream-100/70 rounded-xl border border-cream-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                      <Church className="w-3.5 h-3.5 text-forest-700" />
                      Necesidad que busca atender:
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {pillar.needAddressed}
                    </p>
                  </div>

                  {/* Ejemplos de acciones */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                      Ejemplos de acciones:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {pillar.activities.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-forest-700 mt-1.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cita bíblica y reflexión */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-stone-900 font-bold font-serif">
                      <BookOpen className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span>{pillar.bibleQuote}</span>
                    </div>
                    {pillar.bibleVerseText && (
                      <p className="italic text-stone-600 font-serif text-[11px] border-l-2 border-gold-400 pl-2">
                        {pillar.bibleVerseText}
                      </p>
                    )}
                    <p className="text-[11px] text-stone-700 leading-relaxed bg-cream-50 p-2 rounded border border-cream-200 font-medium">
                      “{pillar.reflection}”
                    </p>
                  </div>

                  {/* Botón: VER Y PARTICIPAR */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPillarDetail(pillar)}
                      className="w-full btn-primary py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-forest-900 transition-colors shadow-sm"
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
