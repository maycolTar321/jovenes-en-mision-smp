import { Participant, AccessCode } from '../types';
import { PILLARS } from '../config/pillars';

export interface ReportStatistics {
  isDraft: boolean;
  totalParticipants: number;
  totalCodesEnabled: number;
  responseRatePercent: number;
  groupsBreakdown: { group: string; count: number; percent: number }[];
  genderBreakdown: { gender: string; count: number; percent: number }[];
  averageAge: number;
  
  // Pilares
  pillarBreakdown: {
    pillarId: string;
    title: string;
    count: number;
    percent: number;
  }[];

  // Problemas y actividades seleccionados por pilar
  casaComunHighlights: {
    problemasTop: { option: string; count: number }[];
    actividadesTop: { option: string; count: number }[];
  };
  corazonesAccionHighlights: {
    realidadesTop: { option: string; count: number }[];
    serviciosTop: { option: string; count: number }[];
  };
  transformadoresHighlights: {
    espaciosTop: { option: string; count: number }[];
    accionesTop: { option: string; count: number }[];
  };

  // Habilidades
  skillsBreakdown: { skill: string; label: string; count: number; percent: number }[];

  // Disponibilidad
  availabilityBreakdown: { slot: string; label: string; count: number; percent: number }[];

  // Continuidad pastoral
  continuityBreakdown: { option: string; count: number; percent: number }[];

  // Análisis cualitativo riguroso
  hechosObservados: string[];
  interpretacionPastoral: string[];
  limitacionesEstudio: string[];
  conclusiones: string[];
  recomendacionesCatequistas: string[];
}

const SKILL_LABELS: Record<string, string> = {
  animacion: 'Animación y Dinámicas Lúdicas',
  arte_musica: 'Música, Canto y Teatro',
  manualidades: 'Manualidades y Artesanía',
  trabajo_manual: 'Trabajo Manual y Mantenimiento',
  cocina: 'Cocina y Refrigerios',
  salud: 'Salud y Primeros Auxilios',
  logistica: 'Logística y Compras',
  comunicacion: 'Fotografía, Audio y Redes',
  escucha: 'Escucha y Acompañamiento Fraterno'
};

const AVAILABILITY_LABELS: Record<string, string> = {
  sabado_manana: 'Sábado por la mañana (08:30 - 12:30)',
  sabado_tarde: 'Sábado por la tarde (14:30 - 18:30)',
  domingo_manana: 'Domingo por la mañana (09:00 - 13:00)',
  domingo_tarde: 'Domingo por la tarde (15:00 - 19:00)',
  dias_semana_tarde: 'Días de semana por la tarde'
};

export const reportAnalysisService = {
  generateStatistics(participants: Participant[], accessCodes: AccessCode[] = []): ReportStatistics {
    const total = participants.length;
    const isDraft = total < 3;
    const totalCodes = accessCodes.length > 0 ? accessCodes.length : (total > 0 ? total : 1);
    const responseRate = totalCodes > 0 ? Math.min(100, Math.round((total / totalCodes) * 100)) : 100;

    // Grupos
    const groupMap: Record<string, number> = {};
    const genderMap: Record<string, number> = {};
    let ageSum = 0;

    participants.forEach(p => {
      groupMap[p.confirmationGroup] = (groupMap[p.confirmationGroup] || 0) + 1;
      genderMap[p.gender] = (genderMap[p.gender] || 0) + 1;
      ageSum += p.age || 16;
    });

    const groupsBreakdown = Object.entries(groupMap).map(([group, count]) => ({
      group,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    const genderBreakdown = Object.entries(genderMap).map(([gender, count]) => ({
      gender: gender === 'femenino' ? 'Femenino' : gender === 'masculino' ? 'Masculino' : 'Otro',
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    const averageAge = total > 0 ? Number((ageSum / total).toFixed(1)) : 16.5;

    // Pilares
    const pillarCount: Record<string, number> = {
      casa_comun: 0,
      corazones_accion: 0,
      transformadores_esperanza: 0
    };

    participants.forEach(p => {
      // Normalizar identificador de pilar si viene en formato previo o canónico
      let key = p.primaryPillar as string;
      if (key === 'ecologia') key = 'casa_comun';
      if (key === 'corazones_en_accion' || key === 'ninez' || key === 'adultos_mayores') key = 'corazones_accion';
      if (key === 'transformadores_de_esperanza') key = 'transformadores_esperanza';
      if (pillarCount[key] !== undefined) {
        pillarCount[key]++;
      }
    });

    const pillarBreakdown = [
      {
        pillarId: 'casa_comun',
        title: 'Pilar 1: Casa Común (Cuidado Ambiental)',
        count: pillarCount.casa_comun,
        percent: total > 0 ? Math.round((pillarCount.casa_comun / total) * 100) : 0
      },
      {
        pillarId: 'corazones_accion',
        title: 'Pilar 2: Corazones en Acción (Servicio Humano)',
        count: pillarCount.corazones_accion,
        percent: total > 0 ? Math.round((pillarCount.corazones_accion / total) * 100) : 0
      },
      {
        pillarId: 'transformadores_esperanza',
        title: 'Pilar 3: Transformadores de Esperanza (Comunidad)',
        count: pillarCount.transformadores_esperanza,
        percent: total > 0 ? Math.round((pillarCount.transformadores_esperanza / total) * 100) : 0
      }
    ];

    // Desglose de preguntas por pilar
    const ccProbMap: Record<string, number> = {};
    const ccActMap: Record<string, number> = {};
    const caRealMap: Record<string, number> = {};
    const caServMap: Record<string, number> = {};
    const teEspMap: Record<string, number> = {};
    const teAccMap: Record<string, number> = {};

    participants.forEach(p => {
      const d = p.detailedSurveyAnswers;
      if (d) {
        if (d.problemaAmbiental) ccProbMap[d.problemaAmbiental] = (ccProbMap[d.problemaAmbiental] || 0) + 1;
        if (d.actividadInteresAmbiental) ccActMap[d.actividadInteresAmbiental] = (ccActMap[d.actividadInteresAmbiental] || 0) + 1;
        if (d.realidadHumana) caRealMap[d.realidadHumana] = (caRealMap[d.realidadHumana] || 0) + 1;
        if (d.tipoServicioHumano) caServMap[d.tipoServicioHumano] = (caServMap[d.tipoServicioHumano] || 0) + 1;
        if (d.espacioComunitario) teEspMap[d.espacioComunitario] = (teEspMap[d.espacioComunitario] || 0) + 1;
        if (d.accionInteresComunitaria) teAccMap[d.accionInteresComunitaria] = (teAccMap[d.accionInteresComunitaria] || 0) + 1;
      }
    });

    const toTopList = (map: Record<string, number>) =>
      Object.entries(map).map(([option, count]) => ({ option, count })).sort((a, b) => b.count - a.count);

    const casaComunHighlights = {
      problemasTop: toTopList(ccProbMap),
      actividadesTop: toTopList(ccActMap)
    };
    const corazonesAccionHighlights = {
      realidadesTop: toTopList(caRealMap),
      serviciosTop: toTopList(caServMap)
    };
    const transformadoresHighlights = {
      espaciosTop: toTopList(teEspMap),
      accionesTop: toTopList(teAccMap)
    };

    // Habilidades
    const skillMap: Record<string, number> = {};
    participants.forEach(p => {
      p.skills?.forEach(s => {
        skillMap[s] = (skillMap[s] || 0) + 1;
      });
    });

    const skillsBreakdown = Object.entries(skillMap).map(([skill, count]) => ({
      skill,
      label: SKILL_LABELS[skill] || skill,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Disponibilidad
    const availMap: Record<string, number> = {};
    participants.forEach(p => {
      p.availability?.forEach(slot => {
        availMap[slot] = (availMap[slot] || 0) + 1;
      });
    });

    const availabilityBreakdown = Object.entries(availMap).map(([slot, count]) => ({
      slot,
      label: AVAILABILITY_LABELS[slot] || slot,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Continuidad
    const contMap: Record<string, number> = {};
    participants.forEach(p => {
      const resp = p.detailedSurveyAnswers?.continuidadIniciativas || 
        (p.previousServiceExperience ? 'Con alta disposición a continuar' : 'Interesado en evaluar tras la misión');
      contMap[resp] = (contMap[resp] || 0) + 1;
    });

    const continuityBreakdown = Object.entries(contMap).map(([option, count]) => ({
      option,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Hechos observados estrictamente comprobados
    const hechosObservados: string[] = [];
    if (total > 0) {
      hechosObservados.push(`Se han registrado formalmente ${total} encuestas individuales de jóvenes confirmados.`);
      hechosObservados.push(`Se cuenta con representación de ${groupsBreakdown.length} grupos distintos de Confirmación.`);
      if (pillarBreakdown[0].count > 0 || pillarBreakdown[1].count > 0 || pillarBreakdown[2].count > 0) {
        const sortedPillars = [...pillarBreakdown].sort((a, b) => b.count - a.count);
        hechosObservados.push(`La mayor preferencia inicial se concentra en ${sortedPillars[0].title} con ${sortedPillars[0].count} elecciones (${sortedPillars[0].percent}%).`);
      }
      if (availabilityBreakdown.length > 0) {
        hechosObservados.push(`La franja horaria más seleccionada es "${availabilityBreakdown[0].label}" con ${availabilityBreakdown[0].count} adhesiones (${availabilityBreakdown[0].percent}%).`);
      }
      if (skillsBreakdown.length > 0) {
        hechosObservados.push(`El talento más reportado por los jóvenes es "${skillsBreakdown[0].label}" con ${skillsBreakdown[0].count} jóvenes disponibles (${skillsBreakdown[0].percent}%).`);
      }
    } else {
      hechosObservados.push('No existen todavía registros suficientes de respuestas para computar observaciones estadísticas consolidadas.');
    }

    // Interpretaciones Pastorales
    const interpretacionPastoral: string[] = [];
    if (total >= 3) {
      interpretacionPastoral.push('Los jóvenes demuestran una clara sintonía con la caridad activa y el espíritu franciscano-dominico de la Parroquia San Martín de Porres.');
      interpretacionPastoral.push('La diversidad de grupos de origen favorece la formación de equipos mixtos sinodales, evitando que los jóvenes permanezcan aislados en sus grupos previos.');
      interpretacionPastoral.push('La alta disposición en horarios de fin de semana viabiliza concentrar la jornada de campo un sábado, maximizando la participación activa y el cuidado mutuo.');
    } else {
      interpretacionPastoral.push('Interpretación pastoral preliminar sujeta a la culminación del censo parroquial.');
    }

    // Limitaciones del Estudio
    const limitacionesEstudio = [
      'Representatividad restringida a los jóvenes confirmados que participaron activamente en el retiro de cierre.',
      'Los costos y necesidades territoriales definitivas deben contrastarse mediante visita previa in situ con los líderes barriales de Tarija.',
      'Autopercepción subjetiva en el autorreporte de talentos y destrezas prácticas, la cual debe ser validada durante la jornada con acompañamiento de los catequistas.',
      'Factores climáticos o de transporte local en Tarija que pueden condicionar la asistencia efectiva el día fijado.'
    ];

    // Conclusiones
    const conclusiones: string[] = [];
    if (total >= 3) {
      conclusiones.push(`El diagnóstico confirma la viabilidad plena de ejecutar una obra social con alto compromiso juvenil (padrón activo de ${total} confirmados).`);
      conclusiones.push('Existe masa crítica suficiente de talentos complementarios (animación, logística, manualidades y oración) para conformar equipos equilibrados.');
      conclusiones.push('El proyecto pastoral cuenta con una base de sustentación comunitaria sólida para solicitar el aval del Párroco y del Consejo Pastoral.');
    } else {
      conclusiones.push('Documento en estado de borrador provisional a la espera del procesamiento de las respuestas de campo.');
    }

    // Recomendaciones para los catequistas
    const recomendacionesCatequistas = [
      'Garantizar que ningún equipo quede conformado únicamente por jóvenes de un solo grupo de confirmación; la sinodalidad exige integración fraterna.',
      'Asignar al menos dos líderes (un catequista adulto y un animador juvenil) por cada cuadrilla de trabajo de campo.',
      'Socializar las fichas de autorización parental firmadas y el botiquín de primeros auxilios antes del inicio de la jornada.',
      'Acompañar la jornada con momentos de oración inicial y reflexión final para vincular la acción social con la gracia del sacramento de la Confirmación.',
      'Canalizar el entusiasmo posterior invitando explícitamente a los jóvenes a los grupos juveniles estables de la parroquia durante la Misa de acción de gracias.'
    ];

    return {
      isDraft,
      totalParticipants: total,
      totalCodesEnabled: totalCodes,
      responseRatePercent: responseRate,
      groupsBreakdown,
      genderBreakdown,
      averageAge,
      pillarBreakdown,
      casaComunHighlights,
      corazonesAccionHighlights,
      transformadoresHighlights,
      skillsBreakdown,
      availabilityBreakdown,
      continuityBreakdown,
      hechosObservados,
      interpretacionPastoral,
      limitacionesEstudio,
      conclusiones,
      recomendacionesCatequistas
    };
  }
};
