import { describe, it, expect, beforeEach, vi } from 'vitest';
import { reportAnalysisService } from '../reportAnalysisService';
import { storageService } from '../storageService';
import { exportService } from '../exportService';
import { Participant, SocialProjectTracking } from '../../types';
import { INITIAL_PROJECT_TRACKING } from '../../config/constants';

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

describe('Prompt 7: Módulo Documental Oficial - Informes y Proyecto Pastoral', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const mockParticipants: Participant[] = [
    {
      id: 'p1',
      code: 'CONF-01',
      createdAt: '2026-10-10T10:00:00Z',
      fullName: 'Carlos Ramos',
      age: 17,
      gender: 'masculino',
      phone: '+591 71234567',
      neighborhood: 'Senac, Tarija',
      confirmationGroup: 'San Francisco de Asís',
      catechistName: 'Hna. Marcela',
      availability: ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['animacion', 'arte_musica'],
      primaryTalentDescription: 'Toco la guitarra',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'corazones_en_accion',
      pillarSpecific: {},
      detailedSurveyAnswers: {
        problemaAmbiental: 'Recuperación de zonas afectadas por incendios',
        actividadInteresAmbiental: 'Reforestación con especies nativas',
        disponibilidadHorarios: ['sabado_manana'],
        continuidadIniciativas: 'Muy interesado en continuar'
      },
      motivation: 'Servir a Dios en la naturaleza',
      previousServiceExperience: true,
      status: 'completada'
    },
    {
      id: 'p2',
      code: 'CONF-02',
      createdAt: '2026-10-10T11:00:00Z',
      fullName: 'Lucía Mendoza',
      age: 16,
      gender: 'femenino',
      phone: '+591 76543210',
      neighborhood: 'San Martín, Tarija',
      confirmationGroup: 'Santa Teresa de Calcuta',
      catechistName: 'Prof. Rolando',
      availability: ['sabado_manana', 'sabado_tarde'],
      transport: 'micro_a_pie',
      skills: ['cocina', 'salud'],
      primaryTalentDescription: 'Primeros auxilios',
      primaryPillar: 'corazones_en_accion',
      secondaryPillar: 'transformadores_de_esperanza',
      pillarSpecific: {},
      detailedSurveyAnswers: {
        realidadHumana: 'Niños en situación de vulnerabilidad o apoyo escolar',
        tipoServicioHumano: 'Talleres lúdicos, apoyo y recreación',
        disponibilidadHorarios: ['sabado_manana'],
        continuidadIniciativas: 'Muy interesado en continuar'
      },
      motivation: 'Ayudar a los niños de Tarija',
      previousServiceExperience: false,
      status: 'completada'
    },
    {
      id: 'p3',
      code: 'CONF-03',
      createdAt: '2026-10-10T12:00:00Z',
      fullName: 'Andrés Choque',
      age: 17,
      gender: 'masculino',
      phone: '+591 78901234',
      neighborhood: 'Morros Blancos, Tarija',
      confirmationGroup: 'San Juan Pablo II',
      catechistName: 'Lic. Patricia',
      availability: ['sabado_manana'],
      transport: 'vehiculo_propio',
      skills: ['animacion'],
      primaryTalentDescription: 'Animación de juegos',
      primaryPillar: 'transformadores_de_esperanza',
      secondaryPillar: 'casa_comun',
      pillarSpecific: {},
      detailedSurveyAnswers: {
        espacioComunitario: 'Parques, plazas o áreas verdes barriales',
        accionInteresComunitaria: 'Pintura, murales y embellecimiento',
        disponibilidadHorarios: ['sabado_manana'],
        continuidadIniciativas: 'Evaluará después de la experiencia'
      },
      motivation: 'Mejorar mi barrio con mis amigos',
      previousServiceExperience: true,
      status: 'completada'
    }
  ];

  it('determina estado de borrador correctamente según umbral de respuestas', () => {
    // Menos de 3 respuestas => isDraft: true
    const draftStats = reportAnalysisService.generateStatistics([mockParticipants[0]]);
    expect(draftStats.isDraft).toBe(true);
    expect(draftStats.totalParticipants).toBe(1);

    // 3 o más respuestas => isDraft: false
    const realStats = reportAnalysisService.generateStatistics(mockParticipants);
    expect(realStats.isDraft).toBe(false);
    expect(realStats.totalParticipants).toBe(3);
  });

  it('calcula métricas de grupos y pilares con denominadores reales exactos', () => {
    const stats = reportAnalysisService.generateStatistics(mockParticipants);
    
    // Grupos representados
    expect(stats.groupsBreakdown.length).toBe(3);
    const sanFrancisco = stats.groupsBreakdown.find(g => g.group === 'San Francisco de Asís');
    expect(sanFrancisco?.count).toBe(1);
    expect(sanFrancisco?.percent).toBe(33); // 1/3 = 33%

    // 3 Pilares representados con 1 voto cada uno
    expect(stats.pillarBreakdown.find(p => p.pillarId === 'casa_comun')?.count).toBe(1);
    expect(stats.pillarBreakdown.find(p => p.pillarId === 'corazones_accion')?.count).toBe(1);
    expect(stats.pillarBreakdown.find(p => p.pillarId === 'transformadores_esperanza')?.count).toBe(1);

    // Habilidad de animación: 2 personas de 3 => 67%
    const anim = stats.skillsBreakdown.find(s => s.skill === 'animacion');
    expect(anim?.count).toBe(2);
    expect(anim?.percent).toBe(67);
  });

  it('distingue hechos observados cuantitativos de interpretaciones pastorales', () => {
    const stats = reportAnalysisService.generateStatistics(mockParticipants);
    
    expect(stats.hechosObservados.length).toBeGreaterThan(0);
    expect(stats.hechosObservados[0]).toContain('3 encuestas individuales');
    
    expect(stats.interpretacionPastoral.length).toBeGreaterThan(0);
    expect(stats.limitacionesEstudio.length).toBe(4);
    expect(stats.recomendacionesCatequistas.length).toBe(5);
  });

  it('gestiona versiones del Proyecto Pastoral sin sobrescribir destructivamente', () => {
    const initialVersions = storageService.getProjectVersions();
    expect(initialVersions.length).toBeGreaterThanOrEqual(1);
    expect(initialVersions[0].versionNumber).toBe('1.0');

    // Guardar versión 1.1
    const modifiedProject: SocialProjectTracking = {
      ...INITIAL_PROJECT_TRACKING,
      volunteerCount: 50,
      executionDate: '2026-11-21'
    };

    const newVer = storageService.saveNewProjectVersion(
      '1.1',
      'Catequista María',
      'Ajuste de fecha por lluvia',
      modifiedProject
    );

    expect(newVer.versionNumber).toBe('1.1');
    const updatedVersions = storageService.getProjectVersions();
    expect(updatedVersions.length).toBe(initialVersions.length + 1);
    expect(updatedVersions[0].author).toBe('Catequista María');

    // Restaurar versión 1.0 original
    const restored = storageService.restoreProjectVersion('ver-1.0-init');
    expect(restored).not.toBeNull();
    const activeProject = storageService.getProjectTracking();
    expect(activeProject.version).toBe('1.0');
  });

  it('genera archivos PDF y Excel sin lanzar excepciones en tiempo de ejecución', () => {
    // Mock save methods of jsPDF and XLSX in testing environment
    const excelSpy = vi.spyOn(exportService, 'exportToExcel');
    exportService.exportToExcel(mockParticipants, [], INITIAL_PROJECT_TRACKING);
    expect(excelSpy).toHaveBeenCalled();

    const pdfResultsSpy = vi.spyOn(exportService, 'generateResultsReportPdf');
    exportService.generateResultsReportPdf(mockParticipants, INITIAL_PROJECT_TRACKING);
    expect(pdfResultsSpy).toHaveBeenCalled();

    const pdfProjectSpy = vi.spyOn(exportService, 'generatePastoralProjectPdf');
    exportService.generatePastoralProjectPdf(INITIAL_PROJECT_TRACKING, [], mockParticipants);
    expect(pdfProjectSpy).toHaveBeenCalled();
  });
});
