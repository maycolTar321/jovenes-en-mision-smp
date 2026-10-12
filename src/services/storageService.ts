import { Participant, AccessCode, MixedTeam, SocialProjectTracking, SystemConfig, AdminCorrectionLog, PastoralProjectVersion } from '../types';
import { DEFAULT_CONFIG, INITIAL_PROJECT_TRACKING } from '../config/constants';

const KEYS = {
  PARTICIPANTS: 'smp_participants_v1',
  ACCESS_CODES: 'smp_access_codes_v1',
  TEAMS: 'smp_teams_v1',
  PROJECT: 'smp_project_tracking_v1',
  PROJECT_VERSIONS: 'smp_project_versions_v1',
  CONFIG: 'smp_config_v1',
  CURRENT_DRAFT: 'smp_survey_draft_v1',
  CORRECTIONS: 'smp_corrections_log_v1'
};

// Semilla inicial representativa de Tarija para que el sistema sea inmediatamente analizable
const SEED_PARTICIPANTS: Participant[] = [
  {
    id: 'p-01',
    code: 'CONF-01',
    createdAt: '2026-10-10T14:20:00Z',
    fullName: 'Mateo Alejandro Flores Ríos',
    age: 17,
    gender: 'masculino',
    phone: '+591 71892341',
    email: 'mateo.flores@gmail.com',
    neighborhood: 'Barrio Senac, Tarija',
    confirmationGroup: 'San Francisco de Asís',
    catechistName: 'Hna. Marcela / Juan Carlos',
    availability: ['sabado_manana', 'sabado_tarde'],
    transport: 'micro_a_pie',
    skills: ['animacion', 'arte_musica'],
    primaryTalentDescription: 'Toco la guitarra, canto y me gusta organizar juegos dinámicos con niños.',
    primaryPillar: 'ninez',
    secondaryPillar: 'ecologia',
    pillarSpecific: {
      ninez: {
        dynamicPreference: 'Juegos cooperativos y canciones con guitarra',
        ageRangeComfort: '8-11 años',
        proposedIdea: 'Ronda de juegos tradicionales tarijeños y una dinámica sobre la parábola del Buen Samaritano.',
        canBringMaterial: true
      }
    },
    motivation: 'Quiero poner en práctica lo que aprendí en el retiro y ayudar a los niños que no tienen muchas actividades sanas los fines de semana.',
    previousServiceExperience: true,
    previousExperienceDetail: 'Apoyo en la chocolatada navideña de la parroquia el año pasado.',
    status: 'completada'
  },
  {
    id: 'p-02',
    code: 'CONF-02',
    createdAt: '2026-10-10T15:10:00Z',
    fullName: 'Valeria Sofía Cardozo Morales',
    age: 16,
    gender: 'femenino',
    phone: '+591 76198422',
    email: 'valeria.cardozo@outlook.com',
    neighborhood: 'Barrio San Martín, Tarija',
    confirmationGroup: 'Santa Teresa de Calcuta',
    catechistName: 'Prof. Rolando Martínez',
    availability: ['sabado_manana', 'domingo_manana'],
    transport: 'a_pie' as any,
    skills: ['escucha', 'comunicacion', 'arte_musica'],
    primaryTalentDescription: 'Buena empatía para conversar, escuchar con cariño y cantar canciones suaves.',
    primaryPillar: 'adultos_mayores',
    secondaryPillar: 'ninez',
    pillarSpecific: {
      adultosMayores: {
        interactionType: 'Charla tranquila, escucha de recuerdos y serenata',
        patienceLevel: 5,
        proposedActivity: 'Tarde de anécdotas con coplas y lectura compartida del Santo Rosario.',
        canProvideSupport: true
      }
    },
    motivation: 'Mi abuelita me enseñó que la soledad duele mucho; quiero que los abuelitos sientan el amor de Dios a través de nosotros.',
    previousServiceExperience: false,
    status: 'completada'
  },
  {
    id: 'p-03',
    code: 'CONF-03',
    createdAt: '2026-10-10T16:05:00Z',
    fullName: 'Rodrigo Sebastián Mendoza Paz',
    age: 18,
    gender: 'masculino',
    phone: '+591 75144390',
    email: 'rodrigo.mendoza@gmail.com',
    neighborhood: 'Barrio Morros Blancos, Tarija',
    confirmationGroup: 'San Juan Pablo II',
    catechistName: 'Paola Vaca',
    availability: ['sabado_manana', 'sabado_tarde', 'jornada_completa_sabado'],
    transport: 'bicicleta',
    skills: ['trabajo_manual', 'logistica'],
    primaryTalentDescription: 'Manejo de herramientas, pintura, trabajo físico y transporte de cosas pesadas.',
    primaryPillar: 'ecologia',
    secondaryPillar: 'ninez',
    pillarSpecific: {
      ecologia: {
        actionType: 'Pintura y restauración de espacios comunitarios y siembra',
        physicalComfort: 5,
        toolsAvailable: ['Brochas', 'Palas', 'Rodillos', 'Bolsas reforzadas'],
        proposedProject: 'Pintar las bancas y muros exteriores de la capilla y limpiar el área verde circundante.'
      }
    },
    motivation: 'El Papa Francisco dice en Laudato Si que cuidar la creación es cuidar a los pobres. Quiero dejar una huella visible.',
    previousServiceExperience: true,
    previousExperienceDetail: 'Reforestación en la serranía de Sama con mi colegio.',
    status: 'completada'
  },
  {
    id: 'p-04',
    code: 'CONF-04',
    createdAt: '2026-10-10T16:45:00Z',
    fullName: 'Camila Andrea Torrejón Leaño',
    age: 17,
    gender: 'femenino',
    phone: '+591 72981155',
    email: 'camila.torrejon@gmail.com',
    neighborhood: 'Barrio Juan XXIII, Tarija',
    confirmationGroup: 'Beata Chiara Badano',
    catechistName: 'Mariana Gallardo',
    availability: ['sabado_tarde', 'domingo_manana'],
    transport: 'micro_a_pie',
    skills: ['salud', 'logistica', 'cocina'],
    primaryTalentDescription: 'Estudio bachillerato técnico en salud, sé primeros auxilios y cómo tomar signos vitales.',
    primaryPillar: 'adultos_mayores',
    secondaryPillar: 'ecologia',
    pillarSpecific: {
      adultosMayores: {
        interactionType: 'Apoyo en movilidad, toma de presión afectuosa y compañía',
        patienceLevel: 5,
        proposedActivity: 'Revisión y cuidado de manos, dinámicas sencillas de memoria y masajes suaves.',
        canProvideSupport: true
      }
    },
    motivation: 'Servir a Cristo en los enfermos y ancianos es una vocación real de nuestra fe.',
    previousServiceExperience: false,
    status: 'completada'
  },
  {
    id: 'p-05',
    code: 'CONF-05',
    createdAt: '2026-10-10T17:30:00Z',
    fullName: 'Lucas Daniel Jurado Nieves',
    age: 16,
    gender: 'masculino',
    phone: '+591 73499012',
    neighborhood: 'Barrio Las Panosas, Tarija',
    confirmationGroup: 'Santo Toribio de Mogrovejo',
    catechistName: 'Javier Castillo',
    availability: ['sabado_manana', 'sabado_tarde'],
    transport: 'vehiculo_propio',
    skills: ['logistica', 'cocina', 'comunicacion'],
    primaryTalentDescription: 'Tengo camioneta familiar disponible para llevar bultos o materiales y me gusta cocinar.',
    primaryPillar: 'ninez',
    secondaryPillar: 'adultos_mayores',
    pillarSpecific: {
      ninez: {
        dynamicPreference: 'Preparación de merienda nutritiva y mini torneo deportivo',
        ageRangeComfort: '8-11 años',
        proposedIdea: 'Organizar un campeonato relámpago con valores de juego limpio y premiación con fruta y leche con avena.',
        canBringMaterial: true
      }
    },
    motivation: 'Tengo facilidad de transporte y quiero poner mi tiempo al servicio del grupo.',
    previousServiceExperience: true,
    previousExperienceDetail: 'Voluntariado en comedores sociales parroquiales.',
    status: 'completada'
  },
  {
    id: 'p-06',
    code: 'CONF-06',
    createdAt: '2026-10-10T18:10:00Z',
    fullName: 'Luciana Belén Romero Vega',
    age: 17,
    gender: 'femenino',
    phone: '+591 78201944',
    email: 'luciana.romero@gmail.com',
    neighborhood: 'Barrio El Molino, Tarija',
    confirmationGroup: 'San Ignacio de Loyola',
    catechistName: 'Diego Barrientos',
    availability: ['sabado_manana', 'domingo_tarde'],
    transport: 'micro_a_pie',
    skills: ['arte_musica', 'animacion', 'trabajo_manual'],
    primaryTalentDescription: 'Dibujo artístico, diseño de murales y cartulinas decorativas.',
    primaryPillar: 'ecologia',
    secondaryPillar: 'ninez',
    pillarSpecific: {
      ecologia: {
        actionType: 'Mural ecológico y reciclaje creativo de llantas y botellas',
        physicalComfort: 4,
        toolsAvailable: ['Pinceles finos', 'Pinturas acrílicas', 'Tijeras grandes'],
        proposedProject: 'Hacer un mural comunitario con un mensaje de esperanza y jardineras hechas de llantas recicladas pintadas.'
      }
    },
    motivation: 'El arte alegra el alma de los barrios. Dios se manifiesta en la belleza.',
    previousServiceExperience: false,
    status: 'completada'
  }
];

const SEED_CODES: AccessCode[] = [
  { code: 'CONF-01', assignedToName: 'Mateo Alejandro Flores Ríos', confirmationGroup: 'San Francisco de Asís', used: true, usedAt: '2026-10-10T14:20:00Z', createdAt: '2026-10-09' },
  { code: 'CONF-02', assignedToName: 'Valeria Sofía Cardozo Morales', confirmationGroup: 'Santa Teresa de Calcuta', used: true, usedAt: '2026-10-10T15:10:00Z', createdAt: '2026-10-09' },
  { code: 'CONF-03', assignedToName: 'Rodrigo Sebastián Mendoza Paz', confirmationGroup: 'San Juan Pablo II', used: true, usedAt: '2026-10-10T16:05:00Z', createdAt: '2026-10-09' },
  { code: 'CONF-04', assignedToName: 'Camila Andrea Torrejón Leaño', confirmationGroup: 'Beata Chiara Badano', used: true, usedAt: '2026-10-10T16:45:00Z', createdAt: '2026-10-09' },
  { code: 'CONF-05', assignedToName: 'Lucas Daniel Jurado Nieves', confirmationGroup: 'Santo Toribio de Mogrovejo', used: true, usedAt: '2026-10-10T17:30:00Z', createdAt: '2026-10-09' },
  { code: 'CONF-06', assignedToName: 'Luciana Belén Romero Vega', confirmationGroup: 'San Ignacio de Loyola', used: true, usedAt: '2026-10-10T18:10:00Z', createdAt: '2026-10-09' },
  { code: 'CONF-07', assignedToName: 'Gabriel Zenteno', confirmationGroup: 'Santa Rosa de Lima', used: false, createdAt: '2026-10-09' },
  { code: 'CONF-08', assignedToName: 'Fabiana Miranda', confirmationGroup: 'San Francisco de Asís', used: false, createdAt: '2026-10-09' },
  { code: 'CONF-09', assignedToName: 'Joaquín Farfán', confirmationGroup: 'Santa Teresa de Calcuta', used: false, createdAt: '2026-10-09' },
  { code: 'CONF-10', assignedToName: 'Noelia Estrada', confirmationGroup: 'San Juan Pablo II', used: false, createdAt: '2026-10-09' },
];

export const storageService = {
  // CONFIG
  getConfig(): SystemConfig {
    try {
      const data = localStorage.getItem(KEYS.CONFIG);
      if (!data) return DEFAULT_CONFIG;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        appsScriptUrl: parsed.appsScriptUrl?.trim() || DEFAULT_CONFIG.appsScriptUrl,
        spreadsheetId: parsed.spreadsheetId?.trim() || DEFAULT_CONFIG.spreadsheetId
      };
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  saveConfig(config: SystemConfig): void {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  },

  // PARTICIPANTS
  getParticipants(): Participant[] {
    try {
      const data = localStorage.getItem(KEYS.PARTICIPANTS);
      if (!data) {
        localStorage.setItem(KEYS.PARTICIPANTS, JSON.stringify(SEED_PARTICIPANTS));
        return SEED_PARTICIPANTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PARTICIPANTS;
    }
  },

  saveParticipant(participant: Participant): { success: boolean; message: string; reason?: string } {
    try {
      const list = this.getParticipants();
      const cleanCode = participant.code?.trim().toUpperCase();

      // Verificar si el código ya fue utilizado por OTRA encuesta distinta
      if (cleanCode) {
        const existingWithCode = list.find(p => p.code?.trim().toUpperCase() === cleanCode);
        if (existingWithCode) {
          // Si coincide el submissionId o el id, es una solicitud de reintento/idempotente válida
          const isSameSubmission = (participant.submissionId && existingWithCode.submissionId === participant.submissionId) ||
                                   (existingWithCode.id === participant.id);
          if (!isSameSubmission) {
            return {
              success: false,
              reason: 'code_already_used',
              message: `El código ${cleanCode} ya fue utilizado por ${existingWithCode.fullName} y se encuentra bloqueado definitivamente.`
            };
          }
        }
      }

      const existingIndex = list.findIndex(p => 
        p.id === participant.id || 
        (participant.submissionId && p.submissionId === participant.submissionId) ||
        (cleanCode && p.code?.trim().toUpperCase() === cleanCode)
      );

      const recordToSave: Participant = {
        ...participant,
        code: cleanCode || participant.code,
        completedAt: participant.completedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        list[existingIndex] = recordToSave;
      } else {
        list.push(recordToSave);
      }
      
      localStorage.setItem(KEYS.PARTICIPANTS, JSON.stringify(list));
      
      // Bloquear código en el padrón de acceso
      if (recordToSave.code) {
        this.markCodeUsed(recordToSave.code, recordToSave.fullName);
      }

      // Limpiar borrador local al completarse exitosamente
      localStorage.removeItem(KEYS.CURRENT_DRAFT);

      return { 
        success: true, 
        message: existingIndex >= 0 
          ? 'Respuesta confirmada exitosamente (operación idempotente).' 
          : 'Respuesta registrada y bloqueada exitosamente en el sistema.' 
      };
    } catch (e: any) {
      return { 
        success: false, 
        reason: 'storage_error',
        message: e.message || 'Error al persistir el participante en el almacenamiento' 
      };
    }
  },

  updateParticipantWithAudit(
    participantId: string, 
    updates: Partial<Participant>, 
    reason: string, 
    responsible: string
  ): { success: boolean; message: string } {
    return this.applyAdminCorrection(participantId, updates, reason, responsible);
  },

  deleteParticipant(id: string): void {
    const list = this.getParticipants().filter(p => p.id !== id);
    localStorage.setItem(KEYS.PARTICIPANTS, JSON.stringify(list));
  },

  // AUDITORÍA Y CORRECCIONES ADMINISTRATIVAS (Requisito 6)
  getCorrectionLogs(): AdminCorrectionLog[] {
    try {
      const data = localStorage.getItem(KEYS.CORRECTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  applyAdminCorrection(
    participantId: string, 
    updates: Partial<Participant>, 
    reason: string, 
    responsible: string
  ): { success: boolean; message: string } {
    try {
      const participants = this.getParticipants();
      const index = participants.findIndex(p => p.id === participantId);
      if (index < 0) {
        return { success: false, message: 'Participante no encontrado para corrección.' };
      }

      const target = participants[index];
      const logs = this.getCorrectionLogs();

      // Registrar cada campo modificado en el historial de auditoría
      Object.entries(updates).forEach(([key, newVal]) => {
        const oldVal = (target as any)[key];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          const logEntry: AdminCorrectionLog = {
            id: `corr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            participantId: target.id,
            participantName: target.fullName,
            field: key,
            oldValue: typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal || ''),
            newValue: typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal || ''),
            reason: reason.trim(),
            timestamp: new Date().toISOString(),
            responsible: responsible.trim()
          };
          logs.unshift(logEntry);
        }
      });

      // Aplicar actualización sobre el participante
      participants[index] = {
        ...target,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(KEYS.PARTICIPANTS, JSON.stringify(participants));
      localStorage.setItem(KEYS.CORRECTIONS, JSON.stringify(logs));

      return { success: true, message: 'Corrección administrativa registrada en auditoría exitosamente.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Error al aplicar corrección administrativa.' };
    }
  },

  unlockCode(codeStr: string, reason: string, responsible: string): { success: boolean; message: string } {
    const codes = this.getAccessCodes();
    const item = codes.find(c => c.code.toUpperCase() === codeStr.trim().toUpperCase());
    if (item) {
      item.used = false;
      delete item.usedAt;
      localStorage.setItem(KEYS.ACCESS_CODES, JSON.stringify(codes));

      const logs = this.getCorrectionLogs();
      logs.unshift({
        id: `unlock-${Date.now()}`,
        participantId: 'CODE-' + codeStr,
        participantName: item.assignedToName || 'Código ' + codeStr,
        field: 'code_status',
        oldValue: 'used: true',
        newValue: 'used: false',
        reason: reason.trim(),
        timestamp: new Date().toISOString(),
        responsible: responsible.trim()
      });
      localStorage.setItem(KEYS.CORRECTIONS, JSON.stringify(logs));
      return { success: true, message: `Código ${codeStr} desbloqueado excepcionalmente.` };
    }
    return { success: false, message: 'Código no encontrado.' };
  },

  // ACCESS CODES
  getAccessCodes(): AccessCode[] {
    try {
      const data = localStorage.getItem(KEYS.ACCESS_CODES);
      if (!data) {
        localStorage.setItem(KEYS.ACCESS_CODES, JSON.stringify(SEED_CODES));
        return SEED_CODES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_CODES;
    }
  },

  generateCodes(count: number, prefix: string = 'SMP-CONF'): AccessCode[] {
    const codes = this.getAccessCodes();
    const newCodes: AccessCode[] = [];
    for (let i = 1; i <= count; i++) {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const codeString = `${prefix}-${randomSuffix}`;
      const codeObj: AccessCode = {
        code: codeString,
        used: false,
        createdAt: new Date().toISOString()
      };
      newCodes.push(codeObj);
      codes.push(codeObj);
    }
    localStorage.setItem(KEYS.ACCESS_CODES, JSON.stringify(codes));
    return newCodes;
  },

  validateCode(codeStr: string): { valid: boolean; reason?: string; codeObj?: AccessCode } {
    const clean = codeStr.trim().toUpperCase();
    if (!clean) return { valid: false, reason: 'El código no puede estar vacío' };
    
    const codes = this.getAccessCodes();
    const found = codes.find(c => c.code.toUpperCase() === clean);
    if (!found) {
      return { valid: false, reason: 'Código no encontrado en el padrón de la parroquia' };
    }
    if (found.used) {
      return { valid: false, reason: `Este código ya fue utilizado por ${found.assignedToName || 'un participante'}` };
    }
    return { valid: true, codeObj: found };
  },

  markCodeUsed(codeStr: string, userName: string): void {
    const codes = this.getAccessCodes();
    const item = codes.find(c => c.code.toUpperCase() === codeStr.trim().toUpperCase());
    if (item) {
      item.used = true;
      item.usedAt = new Date().toISOString();
      item.assignedToName = userName;
      localStorage.setItem(KEYS.ACCESS_CODES, JSON.stringify(codes));
    }
  },

  // TEAMS
  getTeams(): MixedTeam[] {
    try {
      const data = localStorage.getItem(KEYS.TEAMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTeams(teams: MixedTeam[]): void {
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
  },

  // PROJECT TRACKING
  getProjectTracking(): SocialProjectTracking {
    try {
      const data = localStorage.getItem(KEYS.PROJECT);
      return data ? { ...INITIAL_PROJECT_TRACKING, ...JSON.parse(data) } : INITIAL_PROJECT_TRACKING;
    } catch {
      return INITIAL_PROJECT_TRACKING;
    }
  },

  saveProjectTracking(project: SocialProjectTracking): void {
    const updated = {
      ...project,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(KEYS.PROJECT, JSON.stringify(updated));
  },

  // PROJECT VERSIONS (Control de versiones no destructivo)
  getProjectVersions(): PastoralProjectVersion[] {
    try {
      const data = localStorage.getItem(KEYS.PROJECT_VERSIONS);
      if (!data) {
        // Inicializar con la versión semilla 1.0
        const initialVersion: PastoralProjectVersion = {
          versionId: 'ver-1.0-init',
          versionNumber: '1.0',
          createdAt: new Date().toISOString(),
          author: 'Equipo Pastoral de Confirmación',
          notes: 'Versión inicial aprobada del Proyecto Pastoral.',
          projectData: INITIAL_PROJECT_TRACKING
        };
        localStorage.setItem(KEYS.PROJECT_VERSIONS, JSON.stringify([initialVersion]));
        return [initialVersion];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveNewProjectVersion(
    versionNumber: string,
    author: string,
    notes: string,
    projectData: SocialProjectTracking
  ): PastoralProjectVersion {
    const versions = this.getProjectVersions();
    const newVersion: PastoralProjectVersion = {
      versionId: `ver-${versionNumber.replace(/\s+/g, '_')}-${Date.now()}`,
      versionNumber: versionNumber.trim(),
      createdAt: new Date().toISOString(),
      author: author.trim() || 'Coordinador Pastoral',
      notes: notes.trim() || 'Actualización de presupuesto y cronograma.',
      projectData: {
        ...projectData,
        version: versionNumber.trim(),
        lastUpdated: new Date().toISOString(),
        responsibleCatechist: author.trim()
      }
    };

    versions.unshift(newVersion);
    localStorage.setItem(KEYS.PROJECT_VERSIONS, JSON.stringify(versions));
    // Actualizar también el proyecto activo
    this.saveProjectTracking(newVersion.projectData);
    return newVersion;
  },

  restoreProjectVersion(versionId: string): SocialProjectTracking | null {
    const versions = this.getProjectVersions();
    const target = versions.find(v => v.versionId === versionId);
    if (target) {
      this.saveProjectTracking(target.projectData);
      return target.projectData;
    }
    return null;
  },

  // SURVEY DRAFT
  saveSurveyDraft(draft: Partial<Participant>): void {
    try {
      localStorage.setItem(KEYS.CURRENT_DRAFT, JSON.stringify(draft));
    } catch {}
  },

  getSurveyDraft(): Partial<Participant> | null {
    try {
      const d = localStorage.getItem(KEYS.CURRENT_DRAFT);
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  },

  clearSurveyDraft(): void {
    localStorage.removeItem(KEYS.CURRENT_DRAFT);
  },

  // RESET TO DEFAULTS
  resetAllData(): void {
    localStorage.setItem(KEYS.PARTICIPANTS, JSON.stringify(SEED_PARTICIPANTS));
    localStorage.setItem(KEYS.ACCESS_CODES, JSON.stringify(SEED_CODES));
    localStorage.setItem(KEYS.PROJECT, JSON.stringify(INITIAL_PROJECT_TRACKING));
    localStorage.removeItem(KEYS.TEAMS);
    localStorage.removeItem(KEYS.CURRENT_DRAFT);
  }
};
