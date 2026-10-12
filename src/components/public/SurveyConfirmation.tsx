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
        colors: ['#1B4332', '#C85A32', '#D4AF37', '#4B886F']
      });
    } catch {}
  }, []);

  const pillarInfo = PILLARS[participant.primaryPillar];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Mensaje de Éxito, Icono de Verificación y Logo Animado */}
      <div className="text-center space-y-4">
        {/* Logo Parroquial Animado */}
        <div className="inline-block relative">
          <div className="p-2 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-gold-400 shadow-xl animate-bounce">
            <img
              src="/logo.png"
              alt="Logo Catequistas San Martín de Porres"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto"
            />
          </div>
        </div>

        {/* Icono de Verificación Elegante */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 uppercase tracking-tight">
            ¡ENCUESTA FINALIZADA CON ÉXITO!
          </h2>
          <p className="max-w-xl mx-auto text-stone-700 text-sm sm:text-base leading-relaxed font-sans">
            Gracias por ser parte de Jóvenes en Misión SMP. Tus respuestas se registraron correctamente y nos ayudarán a preparar proyectos de servicio para nuestra comunidad. Recuerda: la fe se vive sirviendo.
          </p>
        </div>
      </div>

      {/* Comprobante Digital Oficial */}
      <div className="bg-white rounded-3xl border-2 border-gold-300/80 shadow-elevated overflow-hidden print:border-none print:shadow-none">
        
        {/* Cabecera del comprobante */}
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 p-6 text-white text-center relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Church className="w-6 h-6 text-gold-400" />
            <span className="font-serif font-bold tracking-wider text-base text-cream-50 uppercase">
              {APP_INFO.parish} — Tarija
            </span>
          </div>
          <p className="text-xs text-gold-300 font-serif italic">
            "{APP_INFO.motto}"
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="bg-forest-950/90 border border-gold-400/50 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-gold-300 font-bold">
              CÓDIGO: {participant.code || participant.id.substring(0, 8).toUpperCase()}
            </span>
            <span className="bg-emerald-900/80 border border-emerald-400/40 px-3 py-1.5 rounded-full text-[11px] font-sans font-bold tracking-wider text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              REGISTRADO DEFINITIVAMENTE
            </span>
          </div>
        </div>

        {/* Cuerpo del comprobante */}
        <div className="p-6 sm:p-8 space-y-6 bg-cream-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase text-stone-500 font-semibold">Participante</span>
              <p className="text-lg font-bold text-stone-900">{participant.fullName}</p>
              <p className="text-xs text-stone-600">Edad: {participant.age} años • {participant.neighborhood}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-stone-500 font-semibold">Grupo de Confirmación</span>
              <p className="text-base font-semibold text-forest-800">{participant.confirmationGroup}</p>
              <p className="text-xs text-stone-600">Animador: {participant.catechistName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase text-stone-500 font-semibold">Pilar Asignado / Preferido</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
                  {pillarInfo?.title}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">2da opción: {PILLARS[participant.secondaryPillar]?.title}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-stone-500 font-semibold">Lugar Previsto</span>
              <p className="text-sm font-medium text-stone-800 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-terracotta-600" />
                <span>{pillarInfo?.targetLocation}</span>
              </p>
            </div>
          </div>

          {/* Dones y Motivación */}
          <div className="space-y-2 pb-4">
            <span className="text-xs uppercase text-stone-500 font-semibold">Motivación Pastoral</span>
            <p className="text-sm italic text-stone-700 bg-white p-3.5 rounded-xl border border-stone-200">
              "{participant.motivation}"
            </p>
          </div>

          {/* Recomendaciones para el día de la misión */}
          <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 text-xs text-forest-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-forest-800">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
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
