import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { DEFAULT_CONFIG } from '../../config/constants';
import { Participant } from '../../types';

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

describe('Prompt 8: Auditoría Integral y Pruebas de Seguridad', () => {
  beforeEach(() => {
    localStorageMock.clear();
    storageService.resetAllData();
  });

  describe('1. Pruebas de Seguridad y Confidencialidad', () => {
    it('no expone secretos de API ni credenciales maestras en la configuración de frontend', () => {
      // DEFAULT_CONFIG no debe tener secretos de Google Cloud Console ni service accounts privados
      expect((DEFAULT_CONFIG as any).clientSecret).toBeUndefined();
      expect((DEFAULT_CONFIG as any).privateKey).toBeUndefined();
      expect((DEFAULT_CONFIG as any).serviceAccountKey).toBeUndefined();
      
      // La comunicación se realiza exclusivamente a través del Web App URL público de Google Apps Script
      expect(DEFAULT_CONFIG.appsScriptUrl).toContain('script.google.com/macros/s/');
    });

    it('bloquea la reutilización no autorizada de códigos de participación', () => {
      const code = 'CONF-08';
      const initialVal = storageService.validateCode(code);
      expect(initialVal.valid).toBe(true);

      const p1: Participant = {
        id: 'sub-p1',
        submissionId: 'sub-p1',
        code: code,
        createdAt: '2026-10-10T10:00:00Z',
        fullName: 'Mateo Quispe',
        age: 17,
        gender: 'masculino',
        phone: '+591 71882233',
        neighborhood: 'San Martín',
        confirmationGroup: 'San Francisco de Asís',
        catechistName: 'Hna. Marcela',
        availability: ['sabado_manana'],
        transport: 'micro_a_pie',
        skills: ['animacion'],
        primaryTalentDescription: 'Dinámicas',
        primaryPillar: 'casa_comun',
        secondaryPillar: 'corazones_en_accion',
        pillarSpecific: {},
        motivation: 'Servir',
        previousServiceExperience: false,
        status: 'completada'
      };

      const result1 = storageService.saveParticipant(p1);
      expect(result1.success).toBe(true);

      // El código ahora queda bloqueado como utilizado
      const validationAfter = storageService.validateCode(code);
      expect(validationAfter.valid).toBe(false);
      expect(validationAfter.reason).toContain('utilizado');

      // Un segundo participante intentando usar el mismo código debe ser rechazado
      const p2: Participant = {
        ...p1,
        id: 'sub-p2',
        submissionId: 'sub-p2',
        fullName: 'Intruso o Duplicado'
      };
      const result2 = storageService.saveParticipant(p2);
      expect(result2.success).toBe(false);
      expect(result2.reason).toBe('code_already_used');
    });

    it('respeta la idempotencia: reintentar con el mismo submissionId no crea registros duplicados', () => {
      const code = 'CONF-09';
      const submissionId = 'sub-idempotent-202';

      const p: Participant = {
        id: submissionId,
        submissionId: submissionId,
        code: code,
        createdAt: '2026-10-10T10:00:00Z',
        fullName: 'Camila Farfán',
        age: 16,
        gender: 'femenino',
        phone: '+591 72983111',
        neighborhood: 'Senac',
        confirmationGroup: 'Santa Teresa de Calcuta',
        catechistName: 'Prof. Rolando',
        availability: ['sabado_tarde'],
        transport: 'micro_a_pie',
        skills: ['arte_musica'],
        primaryTalentDescription: 'Canto y coro',
        primaryPillar: 'corazones_en_accion',
        secondaryPillar: 'transformadores_de_esperanza',
        pillarSpecific: {},
        motivation: 'Cantar para los abuelitos',
        previousServiceExperience: true,
        status: 'completada'
      };

      const res1 = storageService.saveParticipant(p);
      expect(res1.success).toBe(true);

      const countBefore = storageService.getParticipants().length;

      // Reintento idéntico por corte momentáneo de red
      const res2 = storageService.saveParticipant(p);
      expect(res2.success).toBe(true);
      expect(res2.message).toContain('idempotente');

      const countAfter = storageService.getParticipants().length;
      expect(countAfter).toBe(countBefore); // No se duplicó
    });
  });

  describe('2. Pruebas de Auditoría y Correcciones Catequísticas', () => {
    it('registra en auditoría cualquier corrección administrativa con motivo y catequista responsable', () => {
      const participants = storageService.getParticipants();
      const target = participants[0];

      const correction = storageService.updateParticipantWithAudit(
        target.id,
        { neighborhood: 'Barrio El Molino, Tarija' },
        'Corrección de dirección por cambio de domicilio reportado por la madre',
        'Catequista Marcela'
      );

      expect(correction.success).toBe(true);

      const logs = storageService.getCorrectionLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].participantId).toBe(target.id);
      expect(logs[0].field).toBe('neighborhood');
      expect(logs[0].responsible).toBe('Catequista Marcela');
      expect(logs[0].reason).toContain('domicilio');
    });

    it('registra desbloqueo excepcional de código con trazabilidad completa', () => {
      // Bloquear código primero
      const p: Participant = {
        id: 'p-lock-test',
        submissionId: 'p-lock-test',
        code: 'CONF-06',
        createdAt: '2026-10-10T10:00:00Z',
        fullName: 'Pedro Martínez',
        age: 17,
        gender: 'masculino',
        phone: '+591 71112233',
        neighborhood: 'San Martín',
        confirmationGroup: 'San Francisco de Asís',
        catechistName: 'Hna. Marcela',
        availability: ['sabado_manana'],
        transport: 'micro_a_pie',
        skills: ['animacion'],
        primaryTalentDescription: 'Juegos',
        primaryPillar: 'casa_comun',
        secondaryPillar: 'corazones_en_accion',
        pillarSpecific: {},
        motivation: 'Servir',
        previousServiceExperience: false,
        status: 'completada'
      };
      storageService.saveParticipant(p);

      expect(storageService.validateCode('CONF-06').valid).toBe(false);

      // Desbloquear excepcionalmente
      const unlockRes = storageService.unlockCode('CONF-06', 'El joven cerró el navegador por error antes de revisar', 'Coordinador Juan Carlos');
      expect(unlockRes.success).toBe(true);

      const logs = storageService.getCorrectionLogs();
      const unlockLog = logs.find(l => l.field === 'code_status');
      expect(unlockLog).toBeDefined();
      expect(unlockLog?.responsible).toBe('Coordinador Juan Carlos');
    });
  });
});
