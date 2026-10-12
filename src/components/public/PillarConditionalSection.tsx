import React from 'react';
import { PillarId, PillarAnswers } from '../../types';
import { PILLARS } from '../../config/pillars';
import { Sprout, HeartHandshake, Sparkles, Check, Smile, Hammer } from 'lucide-react';

interface PillarConditionalSectionProps {
  primaryPillar: PillarId;
  answers: PillarAnswers;
  onChange: (updated: PillarAnswers) => void;
}

export const PillarConditionalSection: React.FC<PillarConditionalSectionProps> = ({
  primaryPillar,
  answers,
  onChange
}) => {
  const currentPillarInfo = PILLARS[primaryPillar] || PILLARS.casa_comun;

  // Actualizador para Casa Común
  const updateCasaComun = (field: string, value: any) => {
    onChange({
      ...answers,
      casaComun: {
        ...(answers.casaComun || {
          actionType: 'Reforestación técnicamente adecuada',
          physicalComfort: 4,
          toolsAvailable: [],
          proposedProject: ''
        }),
        [field]: value
      }
    });
  };

  // Actualizador para Corazones en Acción
  const updateCorazones = (field: string, value: any) => {
    onChange({
      ...answers,
      corazonesEnAccion: {
        ...(answers.corazonesEnAccion || {
          serviceTarget: 'Acompañamiento a adultos mayores',
          interactionType: 'Escucha atenta y conversación fraterna',
          patienceLevel: 5,
          proposedActivity: '',
          canProvideSupport: true
        }),
        [field]: value
      }
    });
  };

  // Actualizador para Transformadores de Esperanza
  const updateTransformadores = (field: string, value: any) => {
    onChange({
      ...answers,
      transformadoresEsperanza: {
        ...(answers.transformadoresEsperanza || {
          actionArea: 'Murales comunitarios autorizados',
          skillsAvailable: ['Pintura'],
          toolsAvailable: [],
          proposedCommunityProject: ''
        }),
        [field]: value
      }
    });
  };

  // Normalizar qué pilar se está visualizando
  const isCasaComun = primaryPillar === 'casa_comun' || primaryPillar === 'ecologia';
  const isCorazones = primaryPillar === 'corazones_en_accion' || primaryPillar === 'ninez' || primaryPillar === 'adultos_mayores';
  const isTransformadores = primaryPillar === 'transformadores_de_esperanza';

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn shadow-sm">
      
      {/* Cabecera del Cuestionario Condicional */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-200">
        <div className={`p-3 rounded-2xl text-white shadow-sm ${
          isCasaComun ? 'bg-[#214C3B]' :
          isCorazones ? 'bg-[#214C3B]' : 'bg-neutral-900 text-white'
        }`}>
          {isCasaComun && <Sprout className="w-6 h-6" />}
          {isCorazones && <HeartHandshake className="w-6 h-6" />}
          {isTransformadores && <Sparkles className="w-6 h-6" />}
        </div>
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#214C3B] block">
            Cuestionario Específico Condicional
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900">
            Misión: {currentPillarInfo.title}
          </h3>
          <p className="text-xs text-stone-600 italic">
            "{currentPillarInfo.subtitle}"
          </p>
        </div>
      </div>

      {/* CONDICIONAL 1: CASA COMÚN */}
      {isCasaComun && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2.5">
              ¿En cuál de estas acciones de Casa Común te sientes más llamado a participar? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Reforestación técnicamente adecuada',
                'Cuidado de plantines y riego comunitario',
                'Recuperación de espacios verdes y jardinería',
                'Limpieza y educación ambiental',
                'Campañas de prevención de incendios'
              ].map(opt => {
                const currentVal = answers.casaComun?.actionType || 'Reforestación técnicamente adecuada';
                const isSelected = currentVal === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateCasaComun('actionType', opt)}
                    className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-[#214C3B] bg-[#E4EEE8] text-[#303632] font-bold ring-2 ring-[#214C3B]/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#214C3B] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Disposición para trabajo físico al aire libre (1 al 5):
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateCasaComun('physicalComfort', lvl)}
                    className={`w-11 h-11 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      (answers.casaComun?.physicalComfort || 4) === lvl
                        ? 'bg-[#214C3B] text-white shadow-md scale-105'
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-neutral-100'
                    }`}
                  >
                    {lvl}★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Herramientas que podrías aportar o facilitar:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Palas/Picos', 'Guantes de lona', 'Regadera/Balde', 'Bolsas reforzadas'].map(tool => {
                  const currentTools = answers.casaComun?.toolsAvailable || [];
                  const isChecked = currentTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => {
                        const next = isChecked
                          ? currentTools.filter(t => t !== tool)
                          : [...currentTools, tool];
                        updateCasaComun('toolsAvailable', next);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isChecked
                          ? 'bg-[#214C3B] text-white font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {isChecked ? `✓ ${tool}` : `+ ${tool}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
              Propuesta o sugerencia ecológica para nuestra comunidad en Tarija:
            </label>
            <textarea
              rows={3}
              value={answers.casaComun?.proposedProject || ''}
              onChange={e => updateCasaComun('proposedProject', e.target.value)}
              placeholder="Ej: Plantar especies nativas como lapachos o tipas, colocar carteles sobre el cuidado del agua en la quebrada..."
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs sm:text-sm focus:ring-2 focus:ring-[#214C3B] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* CONDICIONAL 2: CORAZONES EN ACCIÓN */}
      {isCorazones && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2.5">
              ¿Cuál de estas áreas de servicio fraterno resuena más en tu corazón? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Acompañamiento y escucha a adultos mayores',
                'Actividades recreativas y juegos con niños',
                'Campañas y entrega de alimentos o abrigo',
                'Visitas coordinadas con hogares o instituciones',
                'Actividades de convivencia fraterna y música'
              ].map(opt => {
                const currentVal = answers.corazonesEnAccion?.serviceTarget || 'Acompañamiento y escucha a adultos mayores';
                const isSelected = currentVal === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateCorazones('serviceTarget', opt)}
                    className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-[#214C3B] bg-[#E4EEE8] text-[#303632] font-bold ring-2 ring-[#214C3B]/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#214C3B] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Nivel de paciencia y calidez en el trato humano (1 al 5):
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateCorazones('patienceLevel', lvl)}
                    className={`w-11 h-11 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      (answers.corazonesEnAccion?.patienceLevel || 5) === lvl
                        ? 'bg-[#214C3B] text-white shadow-md scale-105'
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-neutral-100'
                    }`}
                  >
                    {lvl}★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Forma principal de interacción:
              </label>
              <select
                value={answers.corazonesEnAccion?.interactionType || 'Escucha atenta y diálogo'}
                onChange={e => updateCorazones('interactionType', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs sm:text-sm focus:ring-2 focus:ring-[#214C3B] focus:outline-none"
              >
                <option value="Escucha atenta y diálogo">Escucha atenta y diálogo</option>
                <option value="Música, serenata o dinámicas con guitarra">Música, serenata o canto</option>
                <option value="Juegos de mesa o dinámicas recreativas">Juegos de mesa o dinámicas</option>
                <option value="Oración compartida y lectura bíblica">Oración compartida</option>
                <option value="Apoyo en distribución de refrigerio">Apoyo en merienda y víveres</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
              ¿Qué te gustaría preparar o compartir con las personas que visitemos?
            </label>
            <textarea
              rows={3}
              value={answers.corazonesEnAccion?.proposedActivity || ''}
              onChange={e => updateCorazones('proposedActivity', e.target.value)}
              placeholder="Ej: Escuchar sus historias con cariño, cantar canciones del folklore tarijeño, organizar una tarde de juegos tradicionales..."
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs sm:text-sm focus:ring-2 focus:ring-[#214C3B] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* CONDICIONAL 3: TRANSFORMADORES DE ESPERANZA */}
      {isTransformadores && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2.5">
              ¿En qué área de transformación comunitaria te gustaría aportar tu esfuerzo? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Recuperación autorizada de espacios comunitarios',
                'Limpieza profunda y mantenimiento barrial',
                'Mejoramiento de mobiliario (bancas, mesas)',
                'Murales comunitarios autorizados con mensajes de fe',
                'Campañas de cuidado de espacios públicos'
              ].map(opt => {
                const currentVal = answers.transformadoresEsperanza?.actionArea || 'Murales comunitarios autorizados con mensajes de fe';
                const isSelected = currentVal === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateTransformadores('actionArea', opt)}
                    className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-[#214C3B] bg-[#E4EEE8] text-[#303632] font-bold ring-2 ring-[#214C3B]/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#214C3B] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Herramientas o insumos que puedes aportar:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Brochas/Rodillos', 'Lijas/Espátulas', 'Pinturas al agua', 'Cintas de enmascarar'].map(tool => {
                  const currentTools = answers.transformadoresEsperanza?.toolsAvailable || [];
                  const isChecked = currentTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => {
                        const next = isChecked
                          ? currentTools.filter(t => t !== tool)
                          : [...currentTools, tool];
                        updateTransformadores('toolsAvailable', next);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isChecked
                          ? 'bg-neutral-900 text-white font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {isChecked ? `✓ ${tool}` : `+ ${tool}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Habilidades manuales destacadas:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Pintura mural', 'Diseño de letras', 'Reparación básica', 'Limpieza y orden'].map(skill => {
                  const currentSkills = answers.transformadoresEsperanza?.skillsAvailable || [];
                  const isChecked = currentSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        const next = isChecked
                          ? currentSkills.filter(s => s !== skill)
                          : [...currentSkills, skill];
                        updateTransformadores('skillsAvailable', next);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isChecked
                          ? 'bg-neutral-900 text-white font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {isChecked ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
              Idea o proyecto comunitario para embellecer un espacio de Tarija:
            </label>
            <textarea
              rows={3}
              value={answers.transformadoresEsperanza?.proposedCommunityProject || ''}
              onChange={e => updateTransformadores('proposedCommunityProject', e.target.value)}
              placeholder="Ej: Pintar un mural participativo con el lema 'La fe se vive sirviendo', restaurar las bancas del parque barrial..."
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs sm:text-sm focus:ring-2 focus:ring-[#214C3B] focus:outline-none"
            />
          </div>
        </div>
      )}

    </div>
  );
};
