import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appsScriptService } from '../appsScriptService';
import { Participant, SystemConfig } from '../../types';

// Mock simple de sessionStorage para el entorno de test
const sessionMap = new Map<string, string>();
const sessionStorageMock = {
  getItem: (key: string) => sessionMap.get(key) || null,
  setItem: (key: string, value: string) => { sessionMap.set(key, value); },
  removeItem: (key: string) => { sessionMap.delete(key); },
  clear: () => { sessionMap.clear(); }
};

(globalThis as any).sessionStorage = sessionStorageMock;

describe('Prompt 5 — Google Apps Script & Google Sheets Backend Integration', () => {
  beforeEach(() => {
    sessionMap.clear();
    vi.restoreAllMocks();
  });

  const dummyConfig: SystemConfig = {
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbx_TEST_DEPLOYMENT_SMP/exec',
    spreadsheetId: '1BxiMVs0XRA5nFMdTEST',
    surveyActive: true,
    allowOpenRegistration: false,
    adminPin: 'smp2026',
    parishName: 'Parroquia San Martín de Porres',
    projectCity: 'Tarija, Bolivia',
    academicYear: '2026'
  };

  it('1. Valida URL y rechaza destinos mal formados en testConnection', async () => {
    const invalidRes = await appsScriptService.testConnection('https://sitio-invalido.com/api');
    expect(invalidRes.success).toBe(false);
    expect(invalidRes.message).toContain('https://script.google.com/macros/s/...');
  });

  it('2. Ejecuta ping de conectividad con Apps Script mediante GET', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success', success: true, message: 'Servicio Jóvenes en Misión SMP activo' })
    });
    globalThis.fetch = fetchMock;

    const res = await appsScriptService.testConnection(dummyConfig.appsScriptUrl);
    expect(res.success).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain('action=ping');
  });

  it('3. Envía encuesta con encabezado text/plain compatible con CORS y bandera isTest', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'success',
        success: true,
        message: 'Respuesta registrada',
        submissionId: 'sub-test-999'
      })
    });
    globalThis.fetch = fetchMock;

    const testParticipant: Participant = {
      id: 'sub-test-999',
      submissionId: 'sub-test-999',
      code: 'CONF-07',
      fullName: 'Joven de Prueba',
      age: 17,
      gender: 'masculino',
      phone: '+591 70000000',
      neighborhood: 'Tarija',
      confirmationGroup: 'San Francisco de Asís',
      catechistName: 'Equipo Pastoral',
      availability: ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['animacion'],
      primaryTalentDescription: 'Talento prueba',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'corazones_en_accion',
      pillarSpecific: {},
      motivation: 'Prueba backend',
      previousServiceExperience: false,
      status: 'completada',
      createdAt: new Date().toISOString()
    };

    const res = await appsScriptService.submitToGoogleSheets(testParticipant, dummyConfig, true);
    expect(res.success).toBe(true);
    expect(fetchMock).toHaveBeenCalled();

    const fetchOptions = fetchMock.mock.calls[0][1];
    expect(fetchOptions.method).toBe('POST');
    expect(fetchOptions.headers['Content-Type']).toBe('text/plain;charset=utf-8');

    const bodyParsed = JSON.parse(fetchOptions.body);
    expect(bodyParsed.action).toBe('submitSurvey');
    expect(bodyParsed.isTest).toBe(true);
    expect(bodyParsed.submissionId).toBe('sub-test-999');
  });

  it('4. Maneja autenticación pastoral con token de sesión en memoria sin contraseñas en texto plano', async () => {
    const fakeToken = 'SMP_ADMIN_1899999999.signaturehash12345';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'success',
        success: true,
        adminToken: fakeToken
      })
    });
    globalThis.fetch = fetchMock;

    const authRes = await appsScriptService.authAdmin('smp2026', dummyConfig);
    expect(authRes.success).toBe(true);
    expect(appsScriptService.getAdminToken()).toBe(fakeToken);

    // Consulta de Dashboard que utiliza el token
    const fetchMockDashboard = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'success',
        success: true,
        data: {
          totalResponses: 15,
          testResponses: 2,
          pillarCounts: { casa_comun: 5, corazones_en_accion: 6, transformadores_de_esperanza: 4 }
        }
      })
    });
    globalThis.fetch = fetchMockDashboard;

    const dashRes = await appsScriptService.getDashboardData(dummyConfig);
    expect(dashRes.success).toBe(true);
    expect(fetchMockDashboard).toHaveBeenCalled();
    const dashCallUrl = fetchMockDashboard.mock.calls[0][0];
    expect(dashCallUrl).toContain(`adminToken=${fakeToken}`);

    // Limpieza de token de sesión al cerrar
    appsScriptService.clearAdminToken();
    expect(appsScriptService.getAdminToken()).toBeNull();
  });

  it('5. Ejecuta prueba de integración E2E con reporte de diagnóstico de 4 etapas', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, opts?: any) => {
      if (url.includes('action=ping')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'success', success: true })
        });
      }
      if (opts && opts.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'success', success: true, submissionId: 'test-e2e' })
        });
      }
      if (url.includes('action=getDashboardData')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            status: 'success',
            success: true,
            data: { totalResponses: 10, testResponses: 1 }
          })
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    globalThis.fetch = fetchMock;

    const report = await appsScriptService.runIntegrationTest(dummyConfig);
    expect(report.success).toBe(true);
    expect(report.stepPing).toBe(true);
    expect(report.stepWriteTest).toBe(true);
    expect(report.stepReadMetrics).toBe(true);
    expect(report.diagnostics.length).toBeGreaterThanOrEqual(4);
  });
});
