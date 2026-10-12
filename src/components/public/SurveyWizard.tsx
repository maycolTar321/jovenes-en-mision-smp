import React, { useState, useEffect, useRef } from 'react';
import { 
  Participant, ConfirmationGroup, PillarId, SystemConfig, DetailedSurveyAnswers 
} from '../../types';
import { PILLARS, CONFIRMATION_GROUPS } from '../../config/pillars';
import { SURVEYS_BY_PILLAR, COMMON_QUESTIONS, SurveyQuestion } from '../../config/surveyQuestions';
import { storageService } from '../../services/storageService';
import { appsScriptService } from '../../services/appsScriptService';
import { 
  ArrowLeft, ArrowRight, AlertCircle, User, 
  Sparkles, Clock, Users 
} from 'lucide-react';

interface SurveyWizardProps {
  config: SystemConfig;
  initialPillar?: PillarId;
  onCompleted: (participant: Participant) => void;
  onCancel: () => void;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({
  config,
  initialPillar = 'casa_comun',
  onCompleted,
  onCancel
}) => {
  // Estado de navegación:
  // Step 0: Identificación y grupo (1 al 7)
  // Steps 1 a 5: Preguntas del pilar
  // Steps 6 y 7: Preguntas comunes
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Identificador único de operación / idempotencia para la sesión de envío
  const [submissionId] = useState<string>(() => `smp-sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Pilar seleccionado (con ramificación limpia)
  const [currentPillarId] = useState<PillarId>(() => {
    if (initialPillar === 'ninez' || initialPillar === 'adultos_mayores') return 'corazones_en_accion';
    if (initialPillar === 'ecologia') return 'casa_comun';
    return initialPillar;
  });

  // Datos del participante recuperados o generados
  const [accessCodeInput, setAccessCodeInput] = useState<string>('');
  const [participantName, setParticipantName] = useState<string>('');
  const [participantGroup, setParticipantGroup] = useState<ConfirmationGroup | null>(null);
  const [participantPhone, setParticipantPhone] = useState<string>('');
  const [participantAge, setParticipantAge] = useState<number>(16);

  // Temporizador regresivo de 2 minutos (120 segundos)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(120);
  const [isTimeExpired, setIsTimeExpired] = useState<boolean>(false);

  // Respuestas del cuestionario
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});

  // Obtener configuración del pilar actual
  const currentPillarSurvey = SURVEYS_BY_PILLAR[currentPillarId] || SURVEYS_BY_PILLAR.casa_comun;
  const currentPillarInfo = PILLARS[currentPillarId] || PILLARS.casa_comun;

  // Lista de las 7 preguntas activas (5 del pilar + 2 comunes)
  const allActiveQuestions: SurveyQuestion[] = [
    ...currentPillarSurvey.questions,
    ...COMMON_QUESTIONS
  ];

  // Control del temporizador regresivo de 2 minutos (inicia al comenzar las preguntas)
  useEffect(() => {
    if (currentStepIndex >= 1 && timeLeftSeconds > 0 && !isTimeExpired) {
      const interval = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimeExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStepIndex, timeLeftSeconds, isTimeExpired]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Función para generar un código único e intransferible: Ej: G5-MGR-2026
  const generateExclusiveCode = (groupName: string, fullName: string): string => {
    const groupMatch = groupName.match(/\d+/);
    const groupTag = groupMatch ? `G${groupMatch[0]}` : 'SMP';

    const words = fullName.trim().split(/\s+/).filter(Boolean);
    let initials = words.map(w => w[0].toUpperCase()).slice(0, 3).join('');
    if (initials.length < 2) {
      initials = (fullName.trim().substring(0, 3).toUpperCase() || 'CONF');
    }

    const salt = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${groupTag}-${initials}-${salt}-2026`;
  };

  // Navegación y Paso A: Validación
  const handleNext = () => {
    setValidationError(null);

    // Pantalla 0: Identificación
    if (currentStepIndex === 0) {
      if (!participantGroup) {
        setValidationError('Por favor selecciona tu Grupo de Confirmación (del 1 al 7).');
        return;
      }
      if (!participantName.trim()) {
        setValidationError('Por favor escribe tu Nombre y Apellido para identificarte en tu grupo.');
        return;
      }

      // Autogenerar código si no tiene uno
      if (!accessCodeInput.trim()) {
        const autoCode = generateExclusiveCode(participantGroup, participantName);
        setAccessCodeInput(autoCode);
      }

      setCurrentStepIndex(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Pantallas 1 a 6: Pregunta individual
    if (currentStepIndex >= 1 && currentStepIndex <= 6) {
      const currentQuestion = allActiveQuestions[currentStepIndex - 1];
      if (currentQuestion && currentQuestion.required) {
        const answer = selectedAnswers[currentQuestion.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          setValidationError('Por favor selecciona una opción para continuar.');
          return;
        }
      }

      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Pantalla 7: Última pregunta -> Botón «FINALIZAR»
    if (currentStepIndex === 7) {
      // Paso A. Validación: Comprueba exhaustivamente que todas las respuestas obligatorias (1 a 7) estén completas
      for (let i = 0; i < allActiveQuestions.length; i++) {
        const q = allActiveQuestions[i];
        if (q.required) {
          const answer = selectedAnswers[q.id];
          if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            setValidationError(`Por favor responde la Pregunta ${i + 1} ("${q.question}") antes de finalizar.`);
            setCurrentStepIndex(i + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      }

      // Paso B. Confirmación: Abre el modal
      setSubmissionError(null);
      setShowConfirmModal(true);
    }
  };

  // Navegación: Retroceder
  const handleBack = () => {
    setValidationError(null);
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar selección de opción (simple o múltiple)
  const handleOptionSelect = (questionId: string, optionId: string, isMultiple?: boolean, maxSelections: number = 4) => {
    setValidationError(null);

    if (isMultiple) {
      const currentSelected = (selectedAnswers[questionId] as string[]) || [];
      if (currentSelected.includes(optionId)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: currentSelected.filter(id => id !== optionId)
        });
      } else {
        if (currentSelected.length >= maxSelections) {
          setValidationError(`Puedes seleccionar un máximo de ${maxSelections} opciones.`);
          return;
        }
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: [...currentSelected, optionId]
        });
      }
    } else {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: optionId
      });
    }
  };

  // Paso C. Guardado real e idempotente
  const handleConfirmAndSave = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);
    setValidationError(null);

    const finalCode = accessCodeInput.trim().toUpperCase();
    const timestampNow = new Date().toISOString();

    const detailedAnswers: DetailedSurveyAnswers = {
      disponibilidadHorarios: (selectedAnswers['comun_horarios'] as string[]) || ['sabado_manana'],
      continuidadIniciativas: (selectedAnswers['comun_continuidad'] as string) || 'interesa_segun_actividades'
    };

    if (currentPillarId === 'casa_comun') {
      detailedAnswers.problemaAmbiental = selectedAnswers['cc_q1'] as string;
      detailedAnswers.actividadInteresAmbiental = selectedAnswers['cc_q2'] as string;
      detailedAnswers.aportesAmbiental = selectedAnswers['cc_q3'] as string[];
      detailedAnswers.cuidadoPosterior = selectedAnswers['cc_q4'] as string;
      detailedAnswers.resultadoEsperadoAmbiental = selectedAnswers['cc_q5'] as string;
    } else if (currentPillarId === 'corazones_en_accion') {
      detailedAnswers.realidadHumana = selectedAnswers['ca_q1'] as string;
      detailedAnswers.tipoServicioHumano = selectedAnswers['ca_q2'] as string;
      detailedAnswers.aportesHumano = selectedAnswers['ca_q3'] as string[];
      detailedAnswers.prioridadIntervencion = selectedAnswers['ca_q4'] as string;
      detailedAnswers.resultadoEsperadoHumano = selectedAnswers['ca_q5'] as string;
    } else if (currentPillarId === 'transformadores_de_esperanza') {
      detailedAnswers.espacioComunitario = selectedAnswers['te_q1'] as string;
      detailedAnswers.accionInteresComunitaria = selectedAnswers['te_q2'] as string;
      detailedAnswers.habilidadAporteComunitaria = selectedAnswers['te_q3'] as string[];
      detailedAnswers.indispensablePrevio = selectedAnswers['te_q4'] as string;
      detailedAnswers.criterioEvaluacionComunitaria = selectedAnswers['te_q5'] as string;
    }

    const newParticipant: Participant = {
      id: submissionId,
      submissionId: submissionId,
      code: finalCode,
      createdAt: timestampNow,
      completedAt: timestampNow,
      fullName: participantName.trim(),
      age: participantAge,
      gender: 'otro',
      phone: participantPhone.trim() || 'No especificado',
      neighborhood: 'Tarija',
      confirmationGroup: participantGroup || 'San Francisco de Asís',
      catechistName: 'Equipo de Confirmación',
      availability: (detailedAnswers.disponibilidadHorarios as any) || ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['animacion'],
      primaryTalentDescription: 'Compromiso comunitario',
      primaryPillar: currentPillarId,
      secondaryPillar: currentPillarId === 'casa_comun' ? 'corazones_en_accion' : 'casa_comun',
      pillarSpecific: {
        casaComun: currentPillarId === 'casa_comun' ? {
          actionType: detailedAnswers.actividadInteresAmbiental || '',
          physicalComfort: 4,
          toolsAvailable: detailedAnswers.aportesAmbiental || [],
          proposedProject: detailedAnswers.problemaAmbiental || ''
        } : undefined,
        corazonesEnAccion: currentPillarId === 'corazones_en_accion' ? {
          serviceTarget: detailedAnswers.realidadHumana || '',
          interactionType: detailedAnswers.tipoServicioHumano || '',
          patienceLevel: 5,
          proposedActivity: detailedAnswers.resultadoEsperadoHumano || '',
          canProvideSupport: true
        } : undefined,
        transformadoresEsperanza: currentPillarId === 'transformadores_de_esperanza' ? {
          actionArea: detailedAnswers.espacioComunitario || '',
          skillsAvailable: detailedAnswers.habilidadAporteComunitaria || [],
          toolsAvailable: [],
          proposedCommunityProject: detailedAnswers.accionInteresComunitaria || ''
        } : undefined
      },
      detailedSurveyAnswers: detailedAnswers,
      motivation: `Participación voluntaria en ${currentPillarInfo.title}`,
      previousServiceExperience: false,
      status: 'completada'
    };

    try {
      // 1. Guardar de forma inmediata en el almacenamiento local persistente
      const saveRes = storageService.saveParticipant(newParticipant);
      if (!saveRes.success) {
        throw new Error(saveRes.message || 'Error al guardar la encuesta localmente');
      }

      // 2. Si Google Apps Script está configurado, sincronizar con persistencia
      if (config.appsScriptUrl && config.appsScriptUrl.trim() !== '') {
        try {
          const remoteRes = await appsScriptService.submitToGoogleSheets(newParticipant, config);
          if (!remoteRes.success) {
            console.warn('Advertencia en Apps Script (guardado en caché local):', remoteRes.message);
          }
        } catch (backendErr) {
          console.warn('Error de red al conectar con Google Apps Script (persistido localmente):', backendErr);
        }
      }

      // Paso D. Finalización visible: cerrar modal y avanzar a comprobante de éxito
      setShowConfirmModal(false);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      onCompleted(newParticipant);
    } catch (err: any) {
      console.error('Error durante la persistencia de la encuesta:', err);
      setSubmissionError('No pudimos confirmar el guardado de tu encuesta. Tus respuestas siguen disponibles. Intenta nuevamente.');
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // Cálculo de progreso para la barra (7 preguntas)
  const progressPercent = Math.min(100, Math.round((currentStepIndex / 7) * 100));

  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-soft sm:shadow-elevated p-3.5 sm:p-8 transition-all">
      
      {/* Cabecera de Misión Fija y Temporizador Regresivo de 2 Minutos */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-4 pb-2.5 border-b border-[#737B76]/15">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold bg-[#E4EEE8] text-[#214C3B] shadow-xs border border-[#214C3B]/20 flex items-center gap-1.5 truncate">
            <Sparkles className="w-3 h-3 text-[#214C3B] shrink-0" />
            <span className="truncate">Misión: {currentPillarInfo.title}</span>
          </span>
        </div>

        {/* Temporizador Regresivo de 2 Minutos */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold transition-colors ${
            timeLeftSeconds <= 30
              ? 'bg-[#E4EEE8] text-[#16382D] border border-[#214C3B] animate-pulse font-black'
              : 'bg-[#F1F3F1] text-[#303632] border border-[#737B76]/25'
          }`}>
            <Clock className={`w-3 h-3 ${timeLeftSeconds <= 30 ? 'text-[#214C3B]' : 'text-[#737B76]'}`} />
            <span>Tiempo: {formatTimer(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso fluida (1 pregunta por pantalla) */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#737B76] uppercase tracking-wider mb-1.5">
          <span className="truncate pr-2">
            {currentStepIndex === 0 && 'Identificación y Grupo'}
            {currentStepIndex >= 1 && currentStepIndex <= 5 && `P ${currentStepIndex}/7 • ${currentPillarInfo.title}`}
            {currentStepIndex === 6 && 'P 6/7 • Disponibilidad'}
            {currentStepIndex === 7 && 'P 7/7 • Continuidad'}
          </span>
          <span className="text-[#214C3B] font-extrabold shrink-0">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 sm:h-2.5 bg-[#F1F3F1] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#16382D] to-[#214C3B] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Alerta de error si existe */}
      {validationError && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-[#F1F3F1] border border-[#214C3B]/30 text-[#303632] text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#214C3B] shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* PANTALLA 0: IDENTIFICACIÓN RÁPIDA Y CÓDIGO EXCLUSIVO          */}
      {/* ============================================================ */}
      {currentStepIndex === 0 && (
        <div className="space-y-4 sm:space-y-6 animate-fadeIn">
          <div className="bg-[#E4EEE8] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-[#303632] border border-[#214C3B]/20 shadow-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#214C3B] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-[#214C3B] text-sm sm:text-base">
                ¡Bienvenido a tu Encuesta de Confirmación!
              </h3>
              <p className="text-[11px] sm:text-xs text-[#737B76] mt-0.5 leading-relaxed">
                Selecciona tu Grupo de Confirmación (1 al 7) y escribe tu nombre completo para comenzar tu misión pastoral.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#737B76]/20 shadow-soft space-y-4">
            {/* 1. SELECCIÓN DE GRUPO (1 AL 7) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#303632] mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#214C3B]" />
                <span>1. Selecciona tu Grupo de Confirmación (2° Año) *</span>
              </label>
              <select
                value={participantGroup || ''}
                onChange={e => {
                  setParticipantGroup(e.target.value as ConfirmationGroup);
                  setValidationError(null);
                }}
                className="w-full px-3.5 py-3 rounded-xl border border-[#737B76]/30 text-xs sm:text-sm font-semibold text-[#303632] focus:ring-2 focus:ring-[#214C3B] focus:outline-none bg-[#F1F3F1]/50"
              >
                <option value="">-- Toca aquí y elige tu grupo (1 al 7) --</option>
                {CONFIRMATION_GROUPS.map(grp => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>
            </div>

            {/* 2. NOMBRE DEL CONFIRMANDO */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#303632] mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#214C3B]" />
                <span>2. Tu Nombre y Apellido *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Mateo Gutiérrez Romero"
                value={participantName}
                onChange={e => {
                  setParticipantName(e.target.value);
                  setValidationError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#737B76]/30 text-sm font-semibold text-[#303632] focus:ring-2 focus:ring-[#214C3B] focus:outline-none bg-[#F1F3F1]/50 placeholder:text-[#737B76]"
              />
            </div>

            {/* 3. TELÉFONO OPCIONAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737B76] mb-1">
                  Celular o WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 71829304"
                  value={participantPhone}
                  onChange={e => setParticipantPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#737B76]/30 text-xs sm:text-sm text-[#303632] focus:ring-2 focus:ring-[#214C3B] focus:outline-none bg-[#F1F3F1]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#737B76] mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  min={12}
                  max={25}
                  value={participantAge}
                  onChange={e => setParticipantAge(parseInt(e.target.value) || 16)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#737B76]/30 text-xs sm:text-sm text-[#303632] focus:ring-2 focus:ring-[#214C3B] focus:outline-none bg-[#F1F3F1]/50"
                />
              </div>
            </div>

            {/* Previsualización del Código Exclusivo */}
            {participantGroup && participantName.trim().length >= 3 && (
              <div className="p-4 rounded-xl bg-[#E4EEE8] border border-[#214C3B]/20 flex items-center justify-between animate-fadeIn">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#737B76] uppercase tracking-wider block">
                    Tu Código Exclusivo de Misión (Automático):
                  </span>
                  <span className="font-mono font-bold text-[#214C3B] text-sm sm:text-base">
                    {accessCodeInput || generateExclusiveCode(participantGroup, participantName)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#214C3B] text-white text-[10px] font-bold tracking-wider uppercase">
                  Exclusivo
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PANTALLAS 1 A 7: PREGUNTAS INDIVIDUALES                       */}
      {/* ============================================================ */}
      {currentStepIndex >= 1 && currentStepIndex <= 7 && (() => {
        const questionIndex = currentStepIndex - 1;
        const q = allActiveQuestions[questionIndex];
        if (!q) return null;

        const currentAnswer = selectedAnswers[q.id];
        const isSelectedMultiple = !!q.isMultiple;

        return (
          <div key={q.id} className="space-y-6 animate-fadeIn">
            {/* Cabecera de la pregunta */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E4EEE8] text-[#214C3B] border border-[#214C3B]/20 uppercase tracking-wider">
                  Pregunta {currentStepIndex} de 7
                </span>
                {q.required && (
                  <span className="text-xs font-semibold text-[#214C3B]">
                    * Obligatoria
                  </span>
                )}
                {isSelectedMultiple && (
                  <span className="text-xs font-medium text-[#737B76] italic">
                    (Puedes elegir hasta {q.maxSelections || 4} opciones)
                  </span>
                )}
              </div>

              <h3 className="font-serif font-black text-lg sm:text-xl text-[#303632] leading-snug">
                {q.question}
              </h3>

              {q.description && (
                <p className="text-xs sm:text-sm text-[#737B76] italic">
                  {q.description}
                </p>
              )}
            </div>

            {/* Opciones de respuesta interactivas */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              {q.options.map(opt => {
                const isSelected = isSelectedMultiple
                  ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.id)
                  : currentAnswer === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleOptionSelect(q.id, opt.id, isSelectedMultiple, q.maxSelections || 4)}
                    className={`w-full text-left p-3 sm:p-4.5 rounded-xl sm:rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#214C3B] bg-[#E4EEE8]/40 shadow-xs ring-1 sm:ring-2 ring-[#214C3B]/20'
                        : 'border-[#737B76]/20 hover:border-[#214C3B]/40 hover:bg-[#F1F3F1] bg-white'
                    }`}
                  >
                    {/* Indicador de selección */}
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-${isSelectedMultiple ? 'md' : 'full'} border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'border-[#214C3B] bg-[#214C3B] text-white'
                        : 'border-[#737B76]/30 bg-white'
                    }`}>
                      {isSelected && (
                        isSelectedMultiple ? (
                          <span className="text-[11px] sm:text-xs font-bold leading-none">✓</span>
                        ) : (
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />
                        )
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <span className={`text-xs sm:text-sm md:text-base font-bold block ${
                        isSelected ? 'text-[#214C3B]' : 'text-[#303632]'
                      }`}>
                        {opt.label}
                      </span>
                      {opt.helper && (
                        <p className="text-[11px] sm:text-xs text-[#737B76] leading-normal">
                          {opt.helper}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <span className="text-[11px] sm:text-xs font-bold text-[#214C3B] shrink-0 hidden sm:inline-block">
                        Seleccionado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ============================================================ */}
      {/* BOTONES INFERIORES DE NAVEGACIÓN ANTERIOR / SIGUIENTE        */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between gap-2.5 pt-5 border-t border-stone-200 mt-6">
        {currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-3.5 sm:px-5 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className={`text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-8 flex items-center justify-center gap-1.5 font-bold transition-all shadow-md active:scale-95 ${
            currentStepIndex === 0
              ? (participantGroup && participantName.trim()
                  ? 'btn-primary animate-pulse shadow-lg scale-[1.02] sm:scale-105 font-black text-white'
                  : 'btn-primary')
              : (currentStepIndex === 7
                  ? 'btn-primary font-black text-white shadow-lg hover:scale-105 active:scale-95 animate-pulse'
                  : 'btn-primary')
          }`}
        >
          <span>
            {currentStepIndex === 0 && 'INICIAR ENCUESTA'}
            {currentStepIndex >= 1 && currentStepIndex <= 6 && 'Siguiente'}
            {currentStepIndex === 7 && 'FINALIZAR'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* DIÁLOGO MODAL OBLIGATORIO DE CONFIRMACIÓN (Paso B)          */}
      {/* ============================================================ */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-2xl border border-[#737B76]/20 space-y-4 sm:space-y-6 animate-fadeIn"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-[#E4EEE8] text-[#214C3B] rounded-xl sm:rounded-2xl shrink-0">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#214C3B]" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h3 id="confirm-modal-title" className="font-serif font-extrabold text-base sm:text-xl text-[#303632] leading-snug">
                  ¿ESTÁS SEGURO DE FINALIZAR TU ENCUESTA?
                </h3>
                <p className="text-xs sm:text-sm text-[#737B76] leading-relaxed font-sans">
                  Revisa tus respuestas antes de confirmar. Al guardar la encuesta, tu participación quedará registrada y no podrás modificarla desde esta pantalla. Si necesitas corregir algún dato después, solicita ayuda a la coordinación.
                </p>
              </div>
            </div>

            {/* Notificación de error si falló el guardado */}
            {submissionError && (
              <div className="p-3 sm:p-4 rounded-xl bg-[#F1F3F1] border border-[#214C3B]/30 text-[#303632] text-xs sm:text-sm space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-[#214C3B]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>No se pudo confirmar el guardado</span>
                </div>
                <p className="text-xs text-[#737B76] leading-relaxed">{submissionError}</p>
                <p className="text-[11px] text-[#737B76]">
                  Tus respuestas siguen disponibles. Intenta nuevamente.
                </p>
              </div>
            )}

            {/* Indicador de progreso de guardado */}
            {isSubmitting && (
              <div className="p-3 sm:p-4 rounded-xl bg-[#E4EEE8] border border-[#214C3B]/20 text-[#214C3B] text-xs flex items-center gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#214C3B] border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-medium">
                  Guardando tu encuesta…
                </span>
              </div>
            )}

            {/* Botones del diálogo */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#737B76]/20">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  if (!isSubmitting) {
                    setShowConfirmModal(false);
                    setSubmissionError(null);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#737B76]/30 text-[#303632] hover:bg-[#F1F3F1] text-xs sm:text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                VOLVER A REVISAR
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmAndSave}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#214C3B] hover:bg-[#16382D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando tu encuesta…</span>
                  </>
                ) : (
                  <span>SÍ, FINALIZAR ENCUESTA</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DIÁLOGO MODAL CUANDO EL TIEMPO DE 2 MINUTOS EXPIRO           */}
      {/* ============================================================ */}
      {isTimeExpired && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#214C3B]/30 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#E4EEE8] text-[#214C3B] flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-[#214C3B] animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-black text-xl text-[#303632]">
                ¡El tiempo de 2 minutos ha finalizado!
              </h3>
              <p className="text-xs sm:text-sm text-[#737B76] leading-relaxed">
                El tiempo asignado para completar la encuesta terminó. Para asegurar la igualdad entre todos los grupos, la sesión se ha cerrado.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="w-full btn-primary py-3 rounded-xl text-xs font-bold"
              >
                Cerrar Encuesta
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
