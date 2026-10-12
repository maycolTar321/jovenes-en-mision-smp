import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Participant } from '../../types';
import { PILLARS } from '../../config/pillars';
import { APP_INFO } from '../../config/constants';
import { CheckCircle2, Download, Printer, ArrowLeft, Church, Calendar, MapPin, Heart, ShieldCheck } from 'lucide-react';

interface SurveyConfirmationProps {
  participant: Participant;
  onReset: () => void;
}

export const SurveyConfirmation: React.FC<SurveyConfirmationProps> = ({ participant, onReset }) => {
  useEffect(() => {
    // Lanzar confeti celebratorio moderado y elegante
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#214C3B', '#16382D', '#E4EEE8', '#737B76', '#FFFFFF']
      });
    } catch {}
  }, []);

  const pillarInfo = PILLARS[participant.primaryPillar];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 sm:space-y-8 animate-fadeIn">
      {/* Mensaje de Éxito, Icono de Verificación y Logo Animado */}
      <div className="text-center space-y-3 sm:space-y-4">
        {/* Logo Parroquial Animado */}
        <div className="inline-block relative">
          <div className="p-1.5 sm:p-2 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-[#214C3B] shadow-xl animate-bounce">
            <img
              src="/logo.png"
              alt="Logo Catequistas San Martín de Porres"
              className="w-16 h-16 sm:w-24 sm:h-24 object-contain mx-auto"
            />
          </div>
        </div>

        {/* Icono de Verificación Elegante */}
        <div className="flex justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E4EEE8] border-2 border-[#214C3B] flex items-center justify-center text-[#214C3B] shadow-md">
            <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9 text-[#214C3B]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl font-serif font-black text-[#303632] uppercase tracking-tight">
            ¡ENCUESTA FINALIZADA CON ÉXITO!
          </h2>
          <p className="max-w-xl mx-auto text-[#737B76] text-xs sm:text-base leading-relaxed font-sans px-2">
            Gracias por ser parte de Jóvenes en Misión SMP. Tus respuestas se registraron correctamente y nos ayudarán a preparar proyectos de servicio para nuestra comunidad. Recuerda: la fe se vive sirviendo.
          </p>
        </div>
      </div>

      {/* Comprobante Digital Oficial */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#737B76]/20 sm:border-2 shadow-soft sm:shadow-elevated overflow-hidden print:border-none print:shadow-none">
        
        {/* Cabecera del comprobante */}
        <div className="bg-gradient-to-r from-[#16382D] to-[#214C3B] p-4 sm:p-6 text-white text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Church className="w-5 h-5 sm:w-6 sm:h-6 text-[#E4EEE8]" />
            <span className="font-serif font-bold tracking-wider text-sm sm:text-base text-white uppercase">
              {APP_INFO.parish} — Tarija
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#E4EEE8] font-serif italic">
            "{APP_INFO.motto}"
          </p>
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="bg-[#102A22]/90 border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wider text-white font-bold">
              CÓDIGO: {participant.code || participant.id.substring(0, 8).toUpperCase()}
            </span>
            <span className="bg-[#E4EEE8] border border-[#214C3B]/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans font-bold tracking-wider text-[#214C3B] flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#214C3B]" />
              REGISTRADO DEFINITIVAMENTE
            </span>
          </div>
        </div>

        {/* Cuerpo del comprobante */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#737B76]/15">
            <div>
              <span className="text-xs uppercase text-[#737B76] font-semibold">Participante</span>
              <p className="text-lg font-bold text-[#303632]">{participant.fullName}</p>
              <p className="text-xs text-[#737B76]">Edad: {participant.age} años • {participant.neighborhood}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-[#737B76] font-semibold">Grupo de Confirmación</span>
              <p className="text-base font-semibold text-[#303632]">{participant.confirmationGroup}</p>
              <p className="text-xs text-[#737B76]">Animador: {participant.catechistName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#737B76]/15">
            <div>
              <span className="text-xs uppercase text-[#737B76] font-semibold">Pilar Asignado / Preferido</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E4EEE8] text-[#214C3B] border border-[#214C3B]/20">
                  {pillarInfo?.title}
                </span>
              </div>
              <p className="text-xs text-[#737B76] mt-1">2da opción: {PILLARS[participant.secondaryPillar]?.title}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-[#737B76] font-semibold">Lugar Previsto</span>
              <p className="text-sm font-medium text-[#303632] flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-[#214C3B]" />
                <span>{pillarInfo?.targetLocation}</span>
              </p>
            </div>
          </div>

          {/* Dones y Motivación */}
          <div className="space-y-2 pb-4">
            <span className="text-xs uppercase text-[#737B76] font-semibold">Motivación Pastoral</span>
            <p className="text-sm italic text-[#303632] bg-[#F1F3F1] p-3.5 rounded-xl border border-[#737B76]/15">
              "{participant.motivation}"
            </p>
          </div>

          {/* Recomendaciones para el día de la misión */}
          <div className="bg-[#F1F3F1] border border-[#737B76]/15 rounded-2xl p-4 text-xs text-[#303632] space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-[#214C3B]">
              <ShieldCheck className="w-4 h-4 text-[#214C3B]" />
              Recomendaciones para el día de la Obra Social:
            </p>
            <p>• Asistir con ropa cómoda y la polera de Confirmación o de color blanco.</p>
            <p>• Traer tomatodo con agua, gorra y protección solar.</p>
            <p>• Mantener una actitud abierta y fraterna para integrarte con jóvenes de otros grupos.</p>
          </div>
        </div>

        {/* Pie del comprobante */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <span className="font-mono">Fecha: {new Date(participant.createdAt).toLocaleDateString('es-BO')}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 flex items-center gap-1.5 font-medium text-stone-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Botón VOLVER AL INICIO */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="btn-primary py-3.5 px-8 rounded-2xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>VOLVER AL INICIO</span>
        </button>
      </div>
    </div>
  );
};
