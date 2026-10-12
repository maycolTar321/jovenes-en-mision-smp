import { describe, it, expect } from 'vitest';
import { storageService } from '../storageService';
import { SURVEYS_BY_PILLAR, COMMON_QUESTIONS } from '../../config/surveyQuestions';
import { PILLARS } from '../../config/pillars';

describe('Flujo de Encuestas Condicionales y Validación de Códigos (Prompt 3)', () => {
  it('debe validar códigos correctamente y rechazar códigos inválidos o usados', () => {
    // Código disponible
    const validCheck = storageService.validateCode('CONF-07');
    expect(validCheck.valid).toBe(true);
    expect(validCheck.codeObj?.confirmationGroup).toBe('Santa Rosa de Lima');
    expect(validCheck.codeObj?.assignedToName).toBe('Gabriel Zenteno');

    // Código ya usado
    const usedCheck = storageService.validateCode('CONF-01');
    expect(usedCheck.valid).toBe(false);
    expect(usedCheck.reason).toContain('ya fue utilizado');

    // Código no existente
    const nonExistentCheck = storageService.validateCode('SMP-INVENTADO-999');
    expect(nonExistentCheck.valid).toBe(false);
    expect(nonExistentCheck.reason).toContain('no encontrado');
  });

  it('debe tener exactamente 5 preguntas específicas para el Pilar 1: Casa Común', () => {
    const survey = SURVEYS_BY_PILLAR.casa_comun;
    expect(survey).toBeDefined();
    expect(survey.questions.length).toBe(5);
    expect(survey.scriptureCitation).toBe('Génesis 2,15');
    
    // Pregunta 1
    expect(survey.questions[0].question).toContain('¿Qué problema ambiental');
    expect(survey.questions[0].options.length).toBe(5);

    // Pregunta 3 selección múltiple con máx 4
    expect(survey.questions[2].isMultiple).toBe(true);
    expect(survey.questions[2].maxSelections).toBe(4);
  });

  it('debe tener exactamente 5 preguntas específicas para el Pilar 2: Corazones en Acción', () => {
    const survey = SURVEYS_BY_PILLAR.corazones_en_accion;
    expect(survey).toBeDefined();
    expect(survey.questions.length).toBe(5);
    expect(survey.scriptureCitation).toBe('Mateo 25,35-40');
    
    // Pregunta 1
    expect(survey.questions[0].question).toContain('¿Con qué realidad humana');
    expect(survey.questions[0].options.length).toBe(4);

    // Pregunta 3 múltiple
    expect(survey.questions[2].isMultiple).toBe(true);
  });

  it('debe tener exactamente 5 preguntas específicas para el Pilar 3: Transformadores de Esperanza', () => {
    const survey = SURVEYS_BY_PILLAR.transformadores_de_esperanza;
    expect(survey).toBeDefined();
    expect(survey.questions.length).toBe(5);
    expect(survey.scriptureCitation).toBe('Jeremías 29,7');
    
    // Pregunta 1
    expect(survey.questions[0].question).toContain('¿Qué espacio o realidad comunitaria');
    expect(survey.questions[0].options.length).toBe(5);

    // Pregunta 3 múltiple
    expect(survey.questions[2].isMultiple).toBe(true);
  });

  it('debe contar con las dos preguntas comunes (Preguntas 6 y 7)', () => {
    expect(COMMON_QUESTIONS.length).toBe(2);
    
    const q6 = COMMON_QUESTIONS[0];
    expect(q6.question).toBe('¿Cuándo podrías participar?');
    expect(q6.isMultiple).toBe(true);
    expect(q6.options.length).toBe(5);

    const q7 = COMMON_QUESTIONS[1];
    expect(q7.question.toLowerCase()).toContain('después de la obra social');
    expect(q7.isMultiple).toBe(false);
    expect(q7.options.length).toBe(4);
  });

  it('cada ruta debe componer 7 preguntas secuenciales (5 de pilar + 2 comunes)', () => {
    (['casa_comun', 'corazones_en_accion', 'transformadores_de_esperanza'] as const).forEach(pillarId => {
      const pConfig = SURVEYS_BY_PILLAR[pillarId];
      const combined = [...pConfig.questions, ...COMMON_QUESTIONS];
      expect(combined.length).toBe(7);
      expect(combined[0].number).toBe(1);
      expect(combined[4].number).toBe(5);
      expect(combined[5].number).toBe(6);
      expect(combined[6].number).toBe(7);
    });
  });
});
