export type ConfirmationGroup = 
  | 'Grupo 1 - San Francisco de Asís'
  | 'Grupo 2 - Santa Teresa de Calcuta'
  | 'Grupo 3 - San Juan Pablo II'
  | 'Grupo 4 - Beata Chiara Badano'
  | 'Grupo 5 - Santo Toribio de Mogrovejo'
  | 'Grupo 6 - San Ignacio de Loyola'
  | 'Grupo 7 - Santa Rosa de Lima'
  | string;

export type PillarId = 
  | 'casa_comun' 
  | 'corazones_en_accion' 
  | 'transformadores_de_esperanza'
  | 'ninez'
  | 'adultos_mayores'
  | 'ecologia';

export interface PillarInfo {
  id: PillarId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  needAddressed: string;
  activities: string[];
  bibleQuote: string;
  bibleVerseText?: string;
  reflection: string;
  imageUrl: string;
  imageAlt: string;
  iconName: string;
  color: string;
  targetLocation: string;
  missionGoal: string;
  commitment: string;
  usefulSkills: string[];
  suggestedRoles: string[];
}

export type SkillCategory = 
  | 'logistica'        // Logística y compras
  | 'animacion'        // Animación de niños y dinámicas
  | 'escucha'          // Acompañamiento y escucha fraterna
  | 'trabajo_manual'   // Limpieza, pintura, jardinería
  | 'arte_musica'      // Música, canto, instrumentos, teatro
  | 'salud'            // Primeros auxilios y enfermería básica
  | 'comunicacion'     // Redes sociales, fotografía, diseño
  | 'cocina';          // Preparación de refrigerios

export type TransportType = 
  | 'micro_a_pie'
  | 'bicicleta'
  | 'vehiculo_propio'
  | 'necesita_apoyo';

export type AvailabilityTime = 
  | 'sabado_manana'
  | 'sabado_tarde'
  | 'domingo_manana'
  | 'domingo_tarde'
  | 'jornada_completa_sabado';

export interface PillarAnswers {
  // PILAR 1: CASA COMÚN
  casaComun?: {
    actionType: string;
    physicalComfort: number;
    toolsAvailable: string[];
    proposedProject: string;
  };
  // PILAR 2: CORAZONES EN ACCIÓN
  corazonesEnAccion?: {
    serviceTarget: string; // Adultos mayores, niños, campañas
    interactionType: string;
    patienceLevel: number;
    proposedActivity: string;
    canProvideSupport: boolean;
  };
  // PILAR 3: TRANSFORMADORES DE ESPERANZA
  transformadoresEsperanza?: {
    actionArea: string; // Espacios comunitarios, murales, mobiliario
    skillsAvailable: string[];
    toolsAvailable: string[];
    proposedCommunityProject: string;
  };
  // Compatibilidad con registros previos
  ninez?: {
    dynamicPreference: string;
    ageRangeComfort: string;
    proposedIdea: string;
    canBringMaterial: boolean;
  };
  adultosMayores?: {
    interactionType: string;
    patienceLevel: number;
    proposedActivity: string;
    canProvideSupport: boolean;
  };
  ecologia?: {
    actionType: string;
    physicalComfort: number;
    toolsAvailable: string[];
    proposedProject: string;
  };
}

export interface DetailedSurveyAnswers {
  // Pilar 1: Casa Común
  problemaAmbiental?: string;
  actividadInteresAmbiental?: string;
  aportesAmbiental?: string[];
  cuidadoPosterior?: string;
  resultadoEsperadoAmbiental?: string;

  // Pilar 2: Corazones en Acción
  realidadHumana?: string;
  tipoServicioHumano?: string;
  aportesHumano?: string[];
  prioridadIntervencion?: string;
  resultadoEsperadoHumano?: string;

  // Pilar 3: Transformadores de Esperanza
  espacioComunitario?: string;
  accionInteresComunitaria?: string;
  habilidadAporteComunitaria?: string[];
  indispensablePrevio?: string;
  criterioEvaluacionComunitaria?: string;

  // Preguntas Comunes 6 y 7
  disponibilidadHorarios: string[];
  continuidadIniciativas: string;
}

export interface Participant {
  id: string;                  // UUID or Timestamp-hash
  code: string;                // Código de participante
  createdAt: string;           // ISO date
  updatedAt?: string;
  
  // Datos personales
  fullName: string;
  age: number;
  gender: 'femenino' | 'masculino' | 'otro';
  phone: string;
  email?: string;
  neighborhood: string;        // Barrio de Tarija (ej: San Martín, Senac, Morros Blancos, Juan XXIII, etc.)
  confirmationGroup: ConfirmationGroup;
  catechistName: string;
  
  // Disponibilidad y logística
  availability: AvailabilityTime[];
  transport: TransportType;
  healthObservations?: string; // Alergias o condiciones
  
  // Habilidades y talentos
  skills: SkillCategory[];
  primaryTalentDescription: string;
  
  // Preferencias de pilares
  primaryPillar: PillarId;
  secondaryPillar: PillarId;
  pillarSpecific: PillarAnswers;
  detailedSurveyAnswers?: DetailedSurveyAnswers;
  
  // Motivación pastoral
  motivation: string;
  previousServiceExperience: boolean;
  previousExperienceDetail?: string;
  
  // Estado de gestión
  status: 'completada' | 'revisada' | 'asignado';
  assignedTeamId?: string;
  notes?: string;
  submissionId?: string;       // Identificador único de operación / idempotencia
  completedAt?: string;        // Fecha y hora exacta de finalización y bloqueo
}

export interface AdminCorrectionLog {
  id: string;
  participantId: string;
  participantName: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
  timestamp: string;
  responsible: string; // Catequista o coordinador responsable
}

export interface AccessCode {
  code: string;
  assignedToName?: string;
  confirmationGroup?: ConfirmationGroup;
  used: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface MixedTeam {
  id: string;
  name: string;
  pillarId: PillarId;
  leaderParticipantId?: string;
  coLeaderParticipantId?: string;
  memberIds: string[];
  targetLocation: string;
  specificMission: string;
  meetingTime: string;
  memberReasons?: Record<string, string>; // Justificación de asignación por participante
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  quantity?: number;
  unitCostBob?: number;
  estimatedCostBob: number; // Bolivianos (total)
  isPendingQuote?: boolean; // Partida pendiente de cotización
  isCoveredByDonation: boolean; // Si es donación o financiamiento parroquial
  responsible?: string;
}

export interface SocialProjectTracking {
  id: string;
  version?: string; // Ej: "1.0", "1.1"
  lastUpdated?: string;
  responsibleCatechist?: string;
  title: string;
  motto: string;
  parishName: string;
  location: string;
  startDate: string;
  executionDate: string;
  evaluationDate: string;
  
  // Parámetros operativos
  durationHours?: number;
  durationDescription?: string;
  volunteerCount?: number;
  selectedPrimaryPillar?: PillarId | 'todos';
  pillarSelectionRationale?: string;
  
  // Diagnóstico pastoral (VER)
  contextDiagnosis: string;
  targetBeneficiaries: string;
  estimatedBeneficiariesCount: number;
  
  // Iluminación doctrinal (JUZGAR)
  biblicalInspiration: string;
  pastoralLine: string;
  magisterialFoundations?: string; // Citas verificadas de Christus vivit, Laudato si', Fratelli tutti, DSI
  
  // Metas y Plan de acción (ACTUAR)
  generalObjective: string;
  specificObjectives: string[];
  humanResources?: string;
  institutionalAlliances?: string;
  vulnerabilityProtocols?: string; // Protección de menores y vulnerables
  actionMilestones: {
    id: string;
    title: string;
    date: string;
    responsibleTeam: string;
    completed: boolean;
  }[];
  budgetItems: BudgetItem[];
  
  // Evaluación y Celebración (EVALUAR Y CELEBRAR)
  resultIndicators?: string;
  evaluationCriteria: string;
  finalEvaluationMethodology?: string;
  pastoralContinuityStrategy?: string;
  thanksgivingMassDate: string;
  bibliography?: string[];
}

export interface PastoralProjectVersion {
  versionId: string;
  versionNumber: string;
  createdAt: string;
  author: string;
  notes?: string;
  projectData: SocialProjectTracking;
}

export interface SystemConfig {
  appsScriptUrl: string;
  spreadsheetId: string;
  adminPin: string;
  surveyActive: boolean;
  allowOpenRegistration: boolean; // Si permite inscribirse sin código previo
  parishName: string;
  projectCity: string;
  academicYear: string;
}
