import { PillarId } from '../types';

export interface SurveyQuestion {
  id: string;
  number: number;
  question: string;
  description?: string;
  isMultiple?: boolean;
  maxSelections?: number;
  options: {
    id: string;
    label: string;
    icon?: string;
    helper?: string;
  }[];
  required: boolean;
}

export interface PillarSurveyConfig {
  pillarId: PillarId;
  pillarTitle: string;
  scriptureCitation: string;
  scriptureText: string;
  scriptureReflection: string;
  questions: SurveyQuestion[];
}

export const COMMON_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'comun_horarios',
    number: 6,
    question: '¿Cuándo podrías participar?',
    description: 'Puedes seleccionar una o más opciones según tu disponibilidad real para la jornada.',
    isMultiple: true,
    maxSelections: 4,
    required: true,
    options: [
      { id: 'sabado_manana', label: 'Sábado por la mañana', helper: '08:30 a 12:30 aprox.' },
      { id: 'sabado_tarde', label: 'Sábado por la tarde', helper: '14:30 a 18:30 aprox.' },
      { id: 'domingo', label: 'Domingo', helper: 'Jornada dominical' },
      { id: 'otro_horario', label: 'Otro horario previamente coordinado', helper: 'A coordinar con el equipo' },
      { id: 'disponibilidad_variable', label: 'Mi disponibilidad es variable', helper: 'Sujeto a confirmación' }
    ]
  },
  {
    id: 'comun_continuidad',
    number: 7,
    question: 'Después de la obra social, ¿te gustaría seguir participando en iniciativas de servicio de la parroquia?',
    description: 'Tu respuesta nos ayuda a planificar proyectos juveniles futuros sin ningún compromiso forzado.',
    isMultiple: false,
    required: true,
    options: [
      { id: 'si_continuar', label: 'Sí, me gustaría seguir participando' },
      { id: 'interesa_segun_actividades', label: 'Me interesa, dependiendo de las actividades' },
      { id: 'primero_vivir_experiencia', label: 'Primero quisiera vivir esta experiencia' },
      { id: 'todavia_no_seguro', label: 'Todavía no estoy seguro' }
    ]
  }
];

export const SURVEYS_BY_PILLAR: Record<string, PillarSurveyConfig> = {
  casa_comun: {
    pillarId: 'casa_comun',
    pillarTitle: 'CASA COMÚN',
    scriptureCitation: 'Génesis 2,15',
    scriptureText: '«Tomó, pues, el Señor Dios al hombre, y lo puso en el jardín de Edén, para que lo labrara y lo cuidara».',
    scriptureReflection: 'Dios nos confía la creación para que la cuidemos responsablemente. ¿Qué podemos hacer juntos para proteger nuestra Casa Común en Tarija?',
    questions: [
      {
        id: 'cc_q1',
        number: 1,
        question: '¿Qué problema ambiental te gustaría ayudar a atender en Tarija?',
        required: true,
        options: [
          { id: 'zonas_incendios', label: 'Recuperación de zonas afectadas por incendios' },
          { id: 'cuidado_espacios_verdes', label: 'Cuidado de espacios verdes' },
          { id: 'proteccion_agua', label: 'Protección del agua' },
          { id: 'prevencion_educacion', label: 'Prevención de incendios y educación ambiental' },
          { id: 'otras_necesidades_ambientales', label: 'Identificación de otras necesidades ambientales' }
        ]
      },
      {
        id: 'cc_q2',
        number: 2,
        question: '¿Qué actividad te interesaría realizar?',
        required: true,
        options: [
          { id: 'plantar_cuidar_nativas', label: 'Plantar y cuidar especies nativas' },
          { id: 'jornadas_limpieza', label: 'Participar en jornadas de limpieza' },
          { id: 'recuperar_espacios', label: 'Recuperar espacios verdes' },
          { id: 'crear_campanas', label: 'Crear campañas ambientales' },
          { id: 'combinar_practica_concientizacion', label: 'Combinar actividades prácticas y de concientización' }
        ]
      },
      {
        id: 'cc_q3',
        number: 3,
        question: '¿Qué podrías aportar a esta misión?',
        description: 'Selecciona una o más opciones donde sientas que puedes sumar al equipo (hasta 4).',
        isMultiple: true,
        maxSelections: 4,
        required: true,
        options: [
          { id: 'trabajo_practico', label: 'Trabajo práctico' },
          { id: 'organizacion_logistica', label: 'Organización y logística' },
          { id: 'diseno_creatividad', label: 'Diseño y creatividad' },
          { id: 'fotografia_video', label: 'Fotografía y video' },
          { id: 'comunicacion', label: 'Comunicación' },
          { id: 'coordinacion_equipos', label: 'Coordinación de equipos' }
        ]
      },
      {
        id: 'cc_q4',
        number: 4,
        question: '¿Estarías dispuesto a colaborar también en el cuidado posterior de lo que se plantee o recupere?',
        required: true,
        options: [
          { id: 'si_seguimiento', label: 'Sí, también en el seguimiento' },
          { id: 'si_segun_horarios', label: 'Sí, dependiendo de los horarios' },
          { id: 'prefiero_jornada_inicial', label: 'Prefiero colaborar en la jornada inicial' },
          { id: 'necesito_conocer_compromiso', label: 'Necesito conocer mejor el compromiso' }
        ]
      },
      {
        id: 'cc_q5',
        number: 5,
        question: '¿Qué resultado te gustaría conseguir?',
        required: true,
        options: [
          { id: 'espacio_recuperado', label: 'Un espacio natural recuperado' },
          { id: 'plantines_cuidados', label: 'Plantines establecidos y cuidados' },
          { id: 'comunidad_consciente', label: 'Una comunidad más consciente' },
          { id: 'campana_continua', label: 'Una campaña ambiental que pueda continuar' },
          { id: 'combinacion_resultados', label: 'Una combinación de estos resultados' }
        ]
      }
    ]
  },
  corazones_en_accion: {
    pillarId: 'corazones_en_accion',
    pillarTitle: 'CORAZONES EN ACCIÓN',
    scriptureCitation: 'Mateo 25,35-40',
    scriptureText: '«Porque tuve hambre, y me disteis de comer; tuve sed, y me disteis de beber... Cada vez que lo hicisteis con uno de estos mis hermanos más pequeños, conmigo lo hicisteis».',
    scriptureReflection: 'El Evangelio nos invita a reconocer la dignidad de cada persona y a expresar el amor mediante el servicio concreto.',
    questions: [
      {
        id: 'ca_q1',
        number: 1,
        question: '¿Con qué realidad humana te gustaría colaborar?',
        required: true,
        options: [
          { id: 'adultos_mayores', label: 'Adultos mayores que necesitan acompañamiento' },
          { id: 'ninos_vulnerables', label: 'Niños en situación de vulnerabilidad' },
          { id: 'familias_apoyo_material', label: 'Personas o familias que necesitan apoyo material' },
          { id: 'otra_necesidad_investigar', label: 'Otra necesidad que debamos investigar' }
        ]
      },
      {
        id: 'ca_q2',
        number: 2,
        question: '¿Qué tipo de servicio te interesaría realizar?',
        required: true,
        options: [
          { id: 'visita_escuchar', label: 'Compartir una visita y escuchar' },
          { id: 'actividades_recreativas', label: 'Organizar actividades recreativas' },
          { id: 'merienda_campana', label: 'Preparar una merienda o campaña solidaria' },
          { id: 'recolectar_organizar_materiales', label: 'Recolectar y organizar materiales' },
          { id: 'combinar_varias', label: 'Combinar varias actividades' }
        ]
      },
      {
        id: 'ca_q3',
        number: 3,
        question: '¿Qué podrías aportar?',
        description: 'Selecciona tus talentos y facilidades para esta misión (hasta 4).',
        isMultiple: true,
        maxSelections: 4,
        required: true,
        options: [
          { id: 'escucha_acompanamiento', label: 'Escucha y acompañamiento' },
          { id: 'creatividad_animacion', label: 'Creatividad y animación' },
          { id: 'organizacion', label: 'Organización' },
          { id: 'preparacion_actividades', label: 'Preparación de actividades' },
          { id: 'comunicacion_difusion', label: 'Comunicación y difusión' },
          { id: 'logistica_materiales', label: 'Logística y materiales' }
        ]
      },
      {
        id: 'ca_q4',
        number: 4,
        question: '¿Qué deberíamos priorizar al preparar la intervención?',
        required: true,
        options: [
          { id: 'necesidades_institucion', label: 'Conocer las necesidades de la institución' },
          { id: 'escuchar_beneficiarios', label: 'Escuchar a las personas beneficiarias' },
          { id: 'coordinar_previo', label: 'Coordinar previamente las actividades' },
          { id: 'preparar_recursos', label: 'Preparar los recursos necesarios' },
          { id: 'todas_anteriores', label: 'Todas las anteriores' }
        ]
      },
      {
        id: 'ca_q5',
        number: 5,
        question: '¿Qué resultado te gustaría conseguir?',
        required: true,
        options: [
          { id: 'acompanamiento_continuo', label: 'Acompañamiento que pueda continuar' },
          { id: 'necesidad_atendida', label: 'Una necesidad concreta atendida' },
          { id: 'actividad_significativa', label: 'Una actividad significativa para los beneficiarios' },
          { id: 'campana_motive_jovenes', label: 'Una campaña solidaria que motive a otros jóvenes' },
          { id: 'combinacion_resultados_ca', label: 'Una combinación de estos resultados' }
        ]
      }
    ]
  },
  transformadores_de_esperanza: {
    pillarId: 'transformadores_de_esperanza',
    pillarTitle: 'TRANSFORMADORES DE ESPERANZA',
    scriptureCitation: 'Jeremías 29,7',
    scriptureText: '«Buscad el bienestar de la ciudad donde os he hecho habitar, y rogad por ella al Señor, porque en su bienestar tendréis vosotros bienestar».',
    scriptureReflection: 'También podemos servir trabajando por el bienestar de la comunidad donde vivimos.',
    questions: [
      {
        id: 'te_q1',
        number: 1,
        question: '¿Qué espacio o realidad comunitaria te gustaría ayudar a mejorar?',
        required: true,
        options: [
          { id: 'plazas_espacios_verdes', label: 'Plazas y espacios verdes' },
          { id: 'canchas_encuentro_juvenil', label: 'Canchas y lugares de encuentro juvenil' },
          { id: 'espacios_deteriorados', label: 'Espacios comunitarios deteriorados' },
          { id: 'entornos_limpieza_mantenimiento', label: 'Entornos que necesitan limpieza y mantenimiento' },
          { id: 'identificar_lugar_prioritario', label: 'Necesitamos identificar primero un lugar prioritario' }
        ]
      },
      {
        id: 'te_q2',
        number: 2,
        question: '¿Qué acción te gustaría realizar?',
        required: true,
        options: [
          { id: 'recuperar_pintar_autorizado', label: 'Recuperar y pintar un espacio autorizado' },
          { id: 'jornada_limpieza_te', label: 'Organizar una jornada de limpieza' },
          { id: 'mejorar_mobiliario', label: 'Mejorar mobiliario comunitario' },
          { id: 'crear_mural_positivo', label: 'Crear un mural con un mensaje positivo' },
          { id: 'campana_cuidado_espacios', label: 'Diseñar una campaña para promover el cuidado de los espacios' }
        ]
      },
      {
        id: 'te_q3',
        number: 3,
        question: '¿Qué habilidad podrías aportar?',
        description: 'Selecciona las destrezas con las que te gustaría colaborar (hasta 4).',
        isMultiple: true,
        maxSelections: 4,
        required: true,
        options: [
          { id: 'pintura_trabajo_manual', label: 'Pintura y trabajo manual' },
          { id: 'diseno_expresion_artistica', label: 'Diseño y expresión artística' },
          { id: 'organizacion_equipos_te', label: 'Organización de equipos' },
          { id: 'comunicacion_te', label: 'Comunicación' },
          { id: 'fotografia_video_te', label: 'Fotografía y video' },
          { id: 'coordinacion_materiales', label: 'Coordinación de materiales' }
        ]
      },
      {
        id: 'te_q4',
        number: 4,
        question: '¿Qué consideras indispensable antes de intervenir un espacio?',
        required: true,
        options: [
          { id: 'obtener_autorizacion', label: 'Obtener autorización' },
          { id: 'identificar_necesidades_responsables', label: 'Identificar necesidades con los responsables' },
          { id: 'calcular_materiales_presupuesto', label: 'Calcular materiales y presupuesto' },
          { id: 'organizar_tareas_seguridad', label: 'Organizar tareas y medidas de seguridad' },
          { id: 'todas_anteriores_te', label: 'Todas las anteriores' }
        ]
      },
      {
        id: 'te_q5',
        number: 5,
        question: '¿Cómo te gustaría evaluar el resultado?',
        required: true,
        options: [
          { id: 'espacio_quedo_mejorado', label: 'El espacio quedó mejorado' },
          { id: 'comunidad_utiliza_cuida', label: 'La comunidad puede utilizarlo y cuidarlo' },
          { id: 'otros_jovenes_sumaron', label: 'Otros jóvenes se sumaron' },
          { id: 'compromiso_mantenimiento', label: 'Existe un compromiso de mantenimiento' },
          { id: 'varios_estos_resultados', label: 'Se consiguieron varios de estos resultados' }
        ]
      }
    ]
  }
};
