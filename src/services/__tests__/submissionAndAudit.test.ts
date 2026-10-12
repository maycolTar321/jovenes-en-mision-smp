import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { Participant } from '../../types';

// Mock simple de localStorage para el entorno de test en Node
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, value: string) => { storageMap.set(key, value); },
  removeItem: (key: string) => { storageMap.delete(key); },
  clear: () => { storageMap.clear(); },
  get length() { return storageMap.size; },
  key: (i: number) => Array.from(storageMap.keys())[i] || null
};

(globalThis as any).localStorage = localStorageMock;

describe('Prompt 4 — Submission, Idempotency, Code Locking & Admin Audit', () => {
  beforeEach(() => {
    localStorageMock.clear();
    storageService.resetAllData();
  });

  it('1. Validates available access code and locks it upon first submission', () => {
    // Código CONF-07 está disponible en las semillas
    const validationBefore = storageService.validateCode('CONF-07');
    expect(validationBefore.valid).toBe(true);

    const testSubmissionId = 'sub-test-101';
    const testParticipant: Participant = {
      id: testSubmissionId,
      submissionId: testSubmissionId,
      code: 'CONF-07',
      fullName: 'Gabriel Alejandro Ramos',
      age: 17,
      gender: 'masculino',
      phone: '+591 71829900',
      neighborhood: 'San Martín, Tarija',
      confirmationGroup: 'San Francisco de Asís',
      catechistName: 'Equipo de Confirmación',
      availability: ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['animacion'],
      primaryTalentDescription: 'Apoyo en dinámicas',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'corazones_en_accion',
      pillarSpecific: {},
      motivation: 'Servir a Dios y la comunidad',
      previousServiceExperience: false,
      status: 'completada',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    const saveResult = storageService.saveParticipant(testParticipant);
    expect(saveResult.success).toBe(true);

    // Tras guardar, el código debe estar bloqueado y no disponible para otro participante
    const validationAfter = storageService.validateCode('CONF-07');
    expect(validationAfter.valid).toBe(false);
    expect(validationAfter.reason).toContain('ya fue utilizado');
  });

  it('2. Allows idempotent re-submission with the same submissionId without duplicate errors', () => {
    const testSubmissionId = 'sub-idempotent-202';
    const participantData: Participant = {
      id: testSubmissionId,
      submissionId: testSubmissionId,
      code: 'CONF-08',
      fullName: 'Lucía Belén Ortega',
      age: 16,
      gender: 'femenino',
      phone: '+591 76192233',
      neighborhood: 'Barrio Senac, Tarija',
      confirmationGroup: 'Santa Teresa de Calcuta',
      catechistName: 'Equipo de Confirmación',
      availability: ['sabado_manana', 'sabado_tarde'],
      transport: 'micro_a_pie',
      skills: ['escucha'],
      primaryTalentDescription: 'Acompañamiento a abuelitos',
      primaryPillar: 'corazones_en_accion',
      secondaryPillar: 'transformadores_de_esperanza',
      pillarSpecific: {},
      motivation: 'Vivir la fe con acciones',
      previousServiceExperience: false,
      status: 'completada',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    // Primer intento de guardado
    const firstAttempt = storageService.saveParticipant(participantData);
    expect(firstAttempt.success).toBe(true);

    // Reintento idéntico simulando reintento por pérdida de conexión
    const secondAttempt = storageService.saveParticipant({
      ...participantData,
      phone: '+591 76192234' // pequeña actualización en reintento
    });
    expect(secondAttempt.success).toBe(true);

    // Debe existir un único registro en la lista, no duplicados
    const participants = storageService.getParticipants();
    const matches = participants.filter(p => p.submissionId === testSubmissionId || p.code === 'CONF-08');
    expect(matches.length).toBe(1);
    expect(matches[0].phone).toBe('+591 76192234');
  });

  it('3. Rejects attempted submission using an already-used code by another participant', () => {
    // Primer participante usa CONF-09
    const participantA: Participant = {
      id: 'sub-first-user',
      submissionId: 'sub-first-user',
      code: 'CONF-09',
      fullName: 'Santiago Morales',
      age: 17,
      gender: 'masculino',
      phone: '+591 78901234',
      neighborhood: 'Barrio Central',
      confirmationGroup: 'San Juan Pablo II',
      catechistName: 'Equipo',
      availability: ['sabado_manana'],
      transport: 'bicicleta',
      skills: ['logistica'],
      primaryTalentDescription: 'Organización',
      primaryPillar: 'transformadores_de_esperanza',
      secondaryPillar: 'casa_comun',
      pillarSpecific: {},
      motivation: 'Compromiso',
      previousServiceExperience: false,
      status: 'completada',
      createdAt: new Date().toISOString()
    };
    const resA = storageService.saveParticipant(participantA);
    expect(resA.success).toBe(true);

    // Segundo participante intenta usar CONF-09 con diferente submissionId
    const participantB: Participant = {
      id: 'sub-second-user',
      submissionId: 'sub-second-user',
      code: 'CONF-09',
      fullName: 'Ignacio Rueda',
      age: 18,
      gender: 'masculino',
      phone: '+591 71112233',
      neighborhood: 'Barrio Juan XXIII',
      confirmationGroup: 'San Francisco de Asís',
      catechistName: 'Equipo',
      availability: ['sabado_tarde'],
      transport: 'micro_a_pie',
      skills: ['trabajo_manual'],
      primaryTalentDescription: 'Mano de obra',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'corazones_en_accion',
      pillarSpecific: {},
      motivation: 'Ayuda',
      previousServiceExperience: false,
      status: 'completada',
      createdAt: new Date().toISOString()
    };

    const resB = storageService.saveParticipant(participantB);
    expect(resB.success).toBe(false);
    expect(resB.reason).toBe('code_already_used');
    expect(resB.message).toContain('ya fue utilizado');
  });

  it('4. Allows catechists to apply administrative corrections with full audit logging', () => {
    const participants = storageService.getParticipants();
    expect(participants.length).toBeGreaterThan(0);
    const target = participants[0];

    const initialLogsCount = storageService.getCorrectionLogs().length;

    const correctionResult = storageService.applyAdminCorrection(
      target.id,
      {
        primaryPillar: 'transformadores_de_esperanza',
        phone: '+591 77778888'
      },
      'El joven no disponía de movilidad para el otro punto y solicitó reasignación',
      'Catequista Mario Zenteno'
    );

    expect(correctionResult.success).toBe(true);

    // Verificar que el participante fue actualizado
    const updatedTarget = storageService.getParticipants().find(p => p.id === target.id);
    expect(updatedTarget?.primaryPillar).toBe('transformadores_de_esperanza');
    expect(updatedTarget?.phone).toBe('+591 77778888');

    // Verificar que se registraron los logs de auditoría
    const currentLogs = storageService.getCorrectionLogs();
    expect(currentLogs.length).toBeGreaterThan(initialLogsCount);
    
    const latestLog = currentLogs[0];
    expect(latestLog.participantId).toBe(target.id);
    expect(latestLog.responsible).toBe('Catequista Mario Zenteno');
    expect(latestLog.reason).toContain('El joven no disponía de movilidad');
  });

  it('5. Allows unlocking code exceptionally with catechist reason and responsible', () => {
    // Bloquear CONF-10
    storageService.markCodeUsed('CONF-10', 'Prueba Bloqueo');
    expect(storageService.validateCode('CONF-10').valid).toBe(false);

    // Desbloquear excepcionalmente
    const unlockRes = storageService.unlockCode(
      'CONF-10',
      'El joven se equivocó de grupo parroquial y requiere reiniciar',
      'Coordinadora Hermana Teresa'
    );

    expect(unlockRes.success).toBe(true);
    expect(storageService.validateCode('CONF-10').valid).toBe(true);

    // Verificar que la acción quedó en la auditoría
    const logs = storageService.getCorrectionLogs();
    const unlockLog = logs.find(l => l.field === 'code_status');
    expect(unlockLog).toBeDefined();
    expect(unlockLog?.responsible).toBe('Coordinadora Hermana Teresa');
  });
});
