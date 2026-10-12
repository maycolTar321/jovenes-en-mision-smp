import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Participant, MixedTeam, SocialProjectTracking, AccessCode } from '../types';
import { PILLARS } from '../config/pillars';
import { reportAnalysisService } from './reportAnalysisService';

export const exportService = {
  /**
   * DOCUMENTO A: Exportación del Informe Estadístico a Excel (.xlsx) estructurado
   */
  exportToExcel(
    participants: Participant[],
    teams: MixedTeam[],
    project: SocialProjectTracking,
    accessCodesOrFilename?: AccessCode[] | string,
    optionalFilename?: string
  ): void {
    const accessCodes: AccessCode[] = Array.isArray(accessCodesOrFilename) ? accessCodesOrFilename : [];
    const filename: string = typeof accessCodesOrFilename === 'string'
      ? accessCodesOrFilename
      : (optionalFilename || 'Jovenes_En_Mision_SMP_Informe_Resultados.xlsx');

    const wb = XLSX.utils.book_new();
    const stats = reportAnalysisService.generateStatistics(participants, accessCodes);

    // 1. Hoja de Resumen Ejecutivo y Métricas
    const summaryData = [
      { Parámetro: 'Institución', Valor: 'Parroquia San Martín de Porres' },
      { Parámetro: 'Proyecto', Valor: 'JÓVENES EN MISIÓN SMP' },
      { Parámetro: 'Lema', Valor: 'LA FE SE VIVE SIRVIENDO' },
      { Parámetro: 'Ubicación', Valor: 'Tarija, Bolivia' },
      { Parámetro: 'Fecha de Emisión', Valor: new Date().toLocaleDateString('es-BO') },
      { Parámetro: 'Estado del Informe', Valor: stats.isDraft ? 'BORRADOR SIN RESULTADOS REALES' : 'CONSOLIDADO REAL' },
      { Parámetro: 'Total Encuestas Válidas', Valor: stats.totalParticipants },
      { Parámetro: 'Tasa de Respuesta Global', Valor: `${stats.responseRatePercent}%` },
      { Parámetro: 'Edad Promedio de los Jóvenes', Valor: `${stats.averageAge} años` },
      { Parámetro: '', Valor: '' },
      { Parámetro: 'DISTRIBUCIÓN POR PILAR DE ACCIÓN', Valor: '' },
      ...stats.pillarBreakdown.map(p => ({
        Parámetro: p.title,
        Valor: `${p.count} jóvenes (${p.percent}%)`
      }))
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen Ejecutivo');

    // 2. Hoja de Grupos de Confirmación
    const groupsData = stats.groupsBreakdown.map(g => ({
      'Grupo de Confirmación': g.group,
      'Participantes Censados': g.count,
      'Porcentaje sobre el Total': `${g.percent}%`
    }));
    const wsGroups = XLSX.utils.json_to_sheet(groupsData);
    XLSX.utils.book_append_sheet(wb, wsGroups, 'Grupos de Confirmacion');

    // 3. Hoja de Habilidades y Disponibilidad
    const skillsData = stats.skillsBreakdown.map(s => ({
      'Habilidad / Destreza': s.label,
      'Jóvenes Disponibles': s.count,
      'Porcentaje': `${s.percent}%`
    }));
    const wsSkills = XLSX.utils.json_to_sheet(skillsData);
    XLSX.utils.book_append_sheet(wb, wsSkills, 'Habilidades Disponibles');

    const availData = stats.availabilityBreakdown.map(a => ({
      'Franja Horaria': a.label,
      'Disponibilidad (Jóvenes)': a.count,
      'Porcentaje': `${a.percent}%`
    }));
    const wsAvail = XLSX.utils.json_to_sheet(availData);
    XLSX.utils.book_append_sheet(wb, wsAvail, 'Disponibilidad Horaria');

    // 4. Hoja de Padrón Tabulado de Participantes
    const participantsData = participants.map((p, idx) => ({
      'N°': idx + 1,
      'Código de Acceso': p.code || 'N/A',
      'Nombre Completo': p.fullName,
      'Edad': p.age,
      'Género': p.gender,
      'Teléfono / WhatsApp': p.phone,
      'Barrio en Tarija': p.neighborhood,
      'Grupo de Confirmación': p.confirmationGroup,
      'Catequista': p.catechistName,
      'Pilar Seleccionado': PILLARS[p.primaryPillar]?.title || p.primaryPillar,
      'Habilidades': (p.skills || []).join(', '),
      'Talento Destacado': p.primaryTalentDescription || '',
      'Disponibilidad': (p.availability || []).join(', '),
      'Transporte': p.transport || '',
      'Disposición a Continuar': p.detailedSurveyAnswers?.continuidadIniciativas || (p.previousServiceExperience ? 'Sí' : 'Por evaluar'),
      'Fecha de Registro': p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-BO') : ''
    }));
    const wsParticipants = XLSX.utils.json_to_sheet(participantsData);
    XLSX.utils.book_append_sheet(wb, wsParticipants, 'Padron de Respuestas');

    // 5. Hoja de Presupuesto del Proyecto (si existe)
    if (project?.budgetItems && project.budgetItems.length > 0) {
      const budgetData = project.budgetItems.map((b, i) => ({
        'N°': i + 1,
        'Categoría': b.category,
        'Descripción del Insumo': b.description,
        'Cantidad': b.quantity ?? 'N/D',
        'Costo Unitario (Bs.)': b.unitCostBob ?? 'Pendiente',
        'Costo Total Estimado (Bs.)': b.isPendingQuote ? 'Pendiente cotización' : b.estimatedCostBob,
        'Financiamiento': b.isCoveredByDonation ? 'Donación / Aporte' : 'Fondo Parroquial',
        'Responsable': b.responsible || 'Coordinación'
      }));
      const wsBudget = XLSX.utils.json_to_sheet(budgetData);
      XLSX.utils.book_append_sheet(wb, wsBudget, 'Presupuesto Proyecto');
    }

    XLSX.writeFile(wb, filename);
  },

  /**
   * Exporta a archivo CSV estándar con UTF-8 BOM.
   */
  exportToCsv(participants: Participant[], filename: string = 'participantes_smp.csv'): void {
    const headers = [
      'Código',
      'Nombre',
      'Edad',
      'Género',
      'Teléfono',
      'Grupo',
      'Catequista',
      'Pilar 1',
      'Habilidades',
      'Transporte',
      'Motivación'
    ];

    const rows = participants.map(p => [
      `"${p.code || ''}"`,
      `"${(p.fullName || '').replace(/"/g, '""')}"`,
      p.age,
      `"${p.gender}"`,
      `"${p.phone}"`,
      `"${p.confirmationGroup}"`,
      `"${(p.catechistName || '').replace(/"/g, '""')}"`,
      `"${p.primaryPillar}"`,
      `"${(p.skills || []).join(';')}"`,
      `"${p.transport}"`,
      `"${(p.motivation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * DOCUMENTO A: Genera el Informe Formal de Resultados en PDF (17 Secciones)
   */
  generateResultsReportPdf(
    participants: Participant[],
    project: SocialProjectTracking,
    accessCodes: AccessCode[] = [],
    filename: string = 'Informe_Resultados_Encuesta_SMP_2026.pdf'
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const stats = reportAnalysisService.generateStatistics(participants, accessCodes);
    const primaryColor: [number, number, number] = [27, 67, 50]; // Forest 800
    const goldColor: [number, number, number] = [180, 140, 40];
    const warningColor: [number, number, number] = [185, 28, 28]; // Rojo advertencia

    // Helper: Encabezado institucional en páginas subsiguientes
    const drawPageHeader = (pageNumber: number) => {
      if (pageNumber === 1) return; // Portada tiene su propio diseño
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 16, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('PARROQUIA SAN MARTÍN DE PORRES — TARIJA, BOLIVIA', 105, 8, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('INFORME ESTADÍSTICO DE RESULTADOS | "LA FE SE VIVE SIRVIENDO"', 105, 13, { align: 'center' });
    };

    // ==========================================
    // PÁGINA 1: PORTADA INSTITUCIONAL
    // ==========================================
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 75, 'F');

    // Decoración dorada
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 75, 210, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('PARROQUIA SAN MARTÍN DE PORRES', 105, 26, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('PASTORAL JUVENIL DE CONFIRMACIÓN • DIÓCESIS DE TARIJA', 105, 34, { align: 'center' });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('JÓVENES EN MISIÓN SMP', 105, 52, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(230, 220, 180);
    doc.text('«LA FE SE VIVE SIRVIENDO»', 105, 62, { align: 'center' });

    // Si es borrador, banner grande
    let currentY = 95;
    if (stats.isDraft) {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(warningColor[0], warningColor[1], warningColor[2]);
      doc.setLineWidth(0.8);
      doc.roundedRect(15, currentY, 180, 20, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
      doc.text('BORRADOR SIN RESULTADOS REALES SUFICIENTES', 105, currentY + 8, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      doc.text('Este informe es una plantilla previa. Se deben registrar más encuestas antes de la toma de decisiones.', 105, currentY + 15, { align: 'center' });
      currentY += 28;
    } else {
      currentY += 5;
    }

    // Título formal del documento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('DOCUMENTO A: INFORME DE RESULTADOS DE LA ENCUESTA', 105, currentY, { align: 'center' });
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Diagnóstico de preferencias, habilidades, disponibilidad y vocación social post-retiro', 105, currentY, { align: 'center' });
    currentY += 12;

    // Ficha técnica institucional
    doc.setFillColor(248, 246, 242);
    doc.roundedRect(20, currentY, 170, 48, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('DATOS DE IDENTIFICACIÓN INSTITUCIONAL:', 26, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(`• Comunidad Eclesial: Parroquia San Martín de Porres, Tarija, Bolivia`, 26, currentY + 16);
    doc.text(`• Población Destinataria: Jóvenes recién confirmados (promoción 2026)`, 26, currentY + 22);
    doc.text(`• Fecha de Emisión: ${new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}`, 26, currentY + 28);
    doc.text(`• Total Respuestas Consolidadas: ${stats.totalParticipants} confirmados`, 26, currentY + 34);
    doc.text(`• Tasa de Respuesta sobre Padrón: ${stats.responseRatePercent}%`, 26, currentY + 40);

    currentY += 58;

    // Resumen en portada
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('ÍNDICE DE SECCIONES:', 20, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    const indexCols = [
      '1. Portada y Metadatos Institucionales',
      '2. Título y Lema Pastoral',
      '3. Objetivo de la Encuesta',
      '4. Metodología Aplicada',
      '5. Número de Participantes',
      '6. Grupos Representados',
      '7. Tasa de Respuesta',
      '8. Preferencias por Pilar',
      '9. Problemas y Acciones Elegidos',
      '10. Habilidades Disponibles',
      '11. Disponibilidad Horaria',
      '12. Continuidad Pastoral',
      '13. Tablas Consolidadas',
      '14. Interpretación de Resultados',
      '15. Limitaciones del Estudio',
      '16. Conclusiones Generales',
      '17. Recomendaciones para Catequistas'
    ];
    
    // Render 2 columnas de índice
    indexCols.slice(0, 9).forEach((item, idx) => {
      doc.text(item, 25, currentY + (idx * 5));
    });
    indexCols.slice(9).forEach((item, idx) => {
      doc.text(item, 110, currentY + (idx * 5));
    });

    // ==========================================
    // PÁGINA 2: OBJETIVO, METODOLOGÍA Y RESULTADOS GLOBALES
    // ==========================================
    doc.addPage();
    let y = 24;

    // 2. TÍTULO Y LEMA & 3. OBJETIVO DE LA ENCUESTA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. OBJETIVO GENERAL DE LA ENCUESTA', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const objText = doc.splitTextToSize(
      'Investigar de manera objetiva y fraterna las vocaciones, talentos particulares, disponibilidad horaria y preferencias de acción social de los jóvenes que culminaron su retiro de Confirmación en la Parroquia San Martín de Porres (Tarija), con el fin de fundamentar con datos reales la elección de la obra solidaria y la conformación de equipos sinodales mixtos.',
      180
    );
    doc.text(objText, 15, y);
    y += objText.length * 4.2 + 4;

    // 4. METODOLOGÍA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. METODOLOGÍA', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const metText = doc.splitTextToSize(
      'La encuesta fue administrada digitalmente mediante cuestionarios condicionales y acceso autenticado por código individual para evitar duplicidades y proteger la identidad del participante frente a terceros. El diseño metodológico se centró en no evaluar niveles de fe subjetivos ni obligar a redacciones extensas, sino en indagar la predisposición concreta para tres pilares: Casa Común (cuidado ambiental), Corazones en Acción (servicio a la persona vulnerable) y Transformadores de Esperanza (espacios comunitarios).',
      180
    );
    doc.text(metText, 15, y);
    y += metText.length * 4.2 + 6;

    // 5, 6 y 7. NÚMERO DE PARTICIPANTES, GRUPOS Y TASA DE RESPUESTA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('5, 6 y 7. PARTICIPACIÓN Y REPRESENTACIÓN POR GRUPOS', 15, y);
    y += 4;

    const groupRows = stats.groupsBreakdown.map((g, i) => [
      (i + 1).toString(),
      g.group,
      g.count.toString(),
      `${g.percent}%`
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Grupo de Confirmación Parroquial', 'Respuestas Válidas', '% de Representación']],
      body: groupRows.length > 0 ? groupRows : [['-', 'Sin registros', '0', '0%']],
      foot: [['', 'TOTAL CENSO', stats.totalParticipants.toString(), '100%']],
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      footStyles: { fillColor: [240, 238, 230], textColor: primaryColor, fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2.2 },
      margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // 8. PREFERENCIAS POR PILAR
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('8. PREFERENCIAS POR PILAR DE ACCIÓN SOCIAL', 15, y);
    y += 4;

    const pillarRows = stats.pillarBreakdown.map((p, i) => [
      `Pilar ${i + 1}`,
      p.title,
      p.count.toString(),
      `${p.percent}%`
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Identificador', 'Pilar de Intervención', 'Jóvenes Interesados', '% de Preferencia']],
      body: pillarRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2.2 },
      margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // 9. PROBLEMAS Y ACTIVIDADES SELECCIONADOS
    if (y > 230) {
      doc.addPage();
      y = 24;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('9. PROBLEMAS Y ACTIVIDADES ESPECÍFICAS PRIORIZADAS', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text('A continuación se sintetizan las prioridades manifestadas por los jóvenes según cada pilar:', 15, y);
    y += 5;

    const issuesData = [
      ['Pilar 1: Casa Común', 'Problemas en Tarija', stats.casaComunHighlights.problemasTop.slice(0, 2).map(p => `• ${p.option} (${p.count})`).join('\n') || 'Pendiente de respuestas'],
      ['Pilar 1: Casa Común', 'Actividades de interés', stats.casaComunHighlights.actividadesTop.slice(0, 2).map(p => `• ${p.option} (${p.count})`).join('\n') || 'Pendiente de respuestas'],
      ['Pilar 2: Corazones en Acción', 'Realidades humanas', stats.corazonesAccionHighlights.realidadesTop.slice(0, 2).map(p => `• ${p.option} (${p.count})`).join('\n') || 'Pendiente de respuestas'],
      ['Pilar 2: Corazones en Acción', 'Servicios preferidos', stats.corazonesAccionHighlights.serviciosTop.slice(0, 2).map(p => `• ${p.option} (${p.count})`).join('\n') || 'Pendiente de respuestas'],
      ['Pilar 3: Transformadores', 'Espacios comunales', stats.transformadoresHighlights.espaciosTop.slice(0, 2).map(p => `• ${p.option} (${p.count})`).join('\n') || 'Pendiente de respuestas']
    ];

    autoTable(doc, {
      startY: y,
      head: [['Pilar', 'Dimensión Consultada', 'Opciones Más Seleccionadas (Frecuencia)']],
      body: issuesData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 15, right: 15 }
    });

    // ==========================================
    // PÁGINA 3: HABILIDADES, DISPONIBILIDAD Y MOTIVACIÓN
    // ==========================================
    doc.addPage();
    y = 24;

    // 10. HABILIDADES DISPONIBLES
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('10. HABILIDADES Y TALENTOS DISPONIBLES', 15, y);
    y += 4;

    const skillsRows = stats.skillsBreakdown.map((s, i) => [
      (i + 1).toString(),
      s.label,
      s.count.toString(),
      `${s.percent}%`
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Área de Talento / Destreza', 'Jóvenes que lo Aportan', '% sobre el Censo']],
      body: skillsRows.length > 0 ? skillsRows : [['-', 'Sin registros', '0', '0%']],
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // 11. DISPONIBILIDAD HORARIA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('11. DISPONIBILIDAD HORARIA PARA LA JORNADA', 15, y);
    y += 4;

    const availRows = stats.availabilityBreakdown.map((a, i) => [
      (i + 1).toString(),
      a.label,
      a.count.toString(),
      `${a.percent}%`
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Horario de Preferencia', 'Cantidad de Confirmados', '% de Factibilidad']],
      body: availRows.length > 0 ? availRows : [['-', 'Sin registros', '0', '0%']],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // 12. CONTINUIDAD PASTORAL
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('12. DISPOSICIÓN A CONTINUAR EN LA PARROQUIA TRAS LA CONFIRMACIÓN', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const contLines = stats.continuityBreakdown.map(c => `• ${c.option}: ${c.count} jóvenes (${c.percent}%)`);
    if (contLines.length > 0) {
      contLines.forEach(l => {
        doc.text(l, 18, y);
        y += 4.5;
      });
    } else {
      doc.text('• Respuestas pendientes de consolidación.', 18, y);
      y += 5;
    }

    // ==========================================
    // PÁGINA 4: ANÁLISIS CUALITATIVO, LIMITACIONES Y RECOMENDACIONES
    // ==========================================
    doc.addPage();
    y = 24;

    // 14. INTERPRETACIÓN DE RESULTADOS
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('14. INTERPRETACIÓN RIGUROSA DE RESULTADOS', 15, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('A. Hechos Observados Demostrados:', 15, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    stats.hechosObservados.forEach(h => {
      const hLines = doc.splitTextToSize(`• ${h}`, 175);
      doc.text(hLines, 18, y);
      y += hLines.length * 4;
    });

    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('B. Interpretación Pastoral:', 15, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    stats.interpretacionPastoral.forEach(ip => {
      const ipLines = doc.splitTextToSize(`• ${ip}`, 175);
      doc.text(ipLines, 18, y);
      y += ipLines.length * 4;
    });

    y += 5;

    // 15. LIMITACIONES DEL ESTUDIO
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('15. LIMITACIONES DEL ESTUDIO', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    stats.limitacionesEstudio.forEach(lim => {
      const limLines = doc.splitTextToSize(`• ${lim}`, 175);
      doc.text(limLines, 18, y);
      y += limLines.length * 4;
    });

    y += 5;

    // 16. CONCLUSIONES
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('16. CONCLUSIONES', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    stats.conclusiones.forEach(c => {
      const cLines = doc.splitTextToSize(`• ${c}`, 175);
      doc.text(cLines, 18, y);
      y += cLines.length * 4;
    });

    y += 5;

    // 17. RECOMENDACIONES PARA LOS CATEQUISTAS
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('17. RECOMENDACIONES PARA EL EQUIPO DE CATEQUISTAS', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    stats.recomendacionesCatequistas.forEach(rec => {
      const recLines = doc.splitTextToSize(`• ${rec}`, 175);
      doc.text(recLines, 18, y);
      y += recLines.length * 4;
    });

    // Paginación y encabezados para todas las páginas
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawPageHeader(i);

      // Marca de agua si es borrador
      if (stats.isDraft) {
        doc.saveGraphicsState?.();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(240, 200, 200);
        doc.text('BORRADOR SIN RESULTADOS', 105, 150, { align: 'center', angle: 45 });
        doc.restoreGraphicsState?.();
      }

      // Pie de página
      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 130);
      doc.text(
        `Página ${i} de ${totalPages} — Parroquia San Martín de Porres (Tarija) — Sistema Jóvenes en Misión SMP`,
        105,
        290,
        { align: 'center' }
      );
    }

    doc.save(filename);
  },

  /**
   * DOCUMENTO B: Genera el Proyecto Pastoral de Acción Social en PDF (23 Secciones)
   */
  generatePastoralProjectPdf(
    project: SocialProjectTracking,
    teams: MixedTeam[],
    participants: Participant[],
    filename: string = 'Proyecto_Pastoral_Accion_Social_SMP_2026.pdf'
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor: [number, number, number] = [27, 67, 50]; // Forest 800
    const goldColor: [number, number, number] = [180, 140, 40];
    const terracottaColor: [number, number, number] = [190, 75, 40];

    // Helper: Encabezado institucional de página
    const drawPageHeader = (pageNumber: number) => {
      if (pageNumber === 1) return; // Portada tiene su propio encabezado
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 16, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('PARROQUIA SAN MARTÍN DE PORRES — DIÓCESIS DE TARIJA', 105, 8, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('PROYECTO PASTORAL DE ACCIÓN SOCIAL POST-CONFIRMACIÓN 2026', 105, 13, { align: 'center' });
    };

    // ==========================================
    // PÁGINA 1: PORTADA OFICIAL
    // ==========================================
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 85, 'F');

    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 85, 210, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('PARROQUIA SAN MARTÍN DE PORRES', 105, 26, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('DIÓCESIS DE TARIJA • PASTORAL DE CONFIRMACIÓN', 105, 34, { align: 'center' });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DOCUMENTO B: PROYECTO PASTORAL', 105, 52, { align: 'center' });
    doc.setFontSize(16);
    doc.text('DE ACCIÓN SOCIAL', 105, 61, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(230, 220, 180);
    doc.text('«JÓVENES EN MISIÓN SMP — LA FE SE VIVE SIRVIENDO»', 105, 73, { align: 'center' });

    // Ficha de metadatos de versión y control
    let currentY = 105;
    doc.setFillColor(248, 246, 242);
    doc.roundedRect(20, currentY, 170, 52, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('FICHA TÉCNICA DEL PROYECTO:', 26, currentY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(`• Versión del Documento: v${project.version || '1.0'} (No destructiva)`, 26, currentY + 17);
    doc.text(`• Fecha de Elaboración / Actualización: ${project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString('es-BO') : 'Octubre 2026'}`, 26, currentY + 23);
    doc.text(`• Responsable / Catequista Coordinador: ${project.responsibleCatechist || 'Equipo Pastoral Parroquial'}`, 26, currentY + 29);
    doc.text(`• Lugar de Intervención: ${project.location}`, 26, currentY + 35);
    doc.text(`• Fecha Prevista de Ejecución: ${project.executionDate || '07/11/2026'} (Duración: ${project.durationHours || 8} horas)`, 26, currentY + 41);
    doc.text(`• Población Estimada Beneficiaria: ~${project.estimatedBeneficiariesCount || 100} personas en Tarija`, 26, currentY + 47);

    currentY += 66;

    // Sumario / Índice
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('ESTRUCTURA DEL PROYECTO (23 SECCIONES):', 20, currentY);
    currentY += 6;

    const sectionsList = [
      '1. Presentación Parroquial',
      '2. Resumen Ejecutivo',
      '3. Fundamentación Bíblica',
      '4. Fundamentación en el Magisterio',
      '5. Justificación Pastoral',
      '6. Diagnóstico de la Realidad (VER)',
      '7. Objetivo General',
      '8. Objetivos Específicos',
      '9. Población Participante y Beneficiaria',
      '10. Tres Pilares de Intervención',
      '11. Criterios de Selección de la Obra',
      '12. Metodología (VER-JUZGAR-ACTUAR)',
      '13. Organización de Equipos Mixtos',
      '14. Actividades Programadas',
      '15. Cronograma de Hitos',
      '16. Recursos Humanos',
      '17. Materiales y Presupuesto (Bs.)',
      '18. Alianzas Institucionales en Tarija',
      '19. Protección de Menores y Vulnerables',
      '20. Indicadores de Resultados',
      '21. Evaluación Final',
      '22. Continuidad Pastoral',
      '23. Bibliografía Oficial Verificada'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);

    sectionsList.slice(0, 12).forEach((sec, idx) => {
      doc.text(sec, 25, currentY + (idx * 4.6));
    });
    sectionsList.slice(12).forEach((sec, idx) => {
      doc.text(sec, 110, currentY + (idx * 4.6));
    });

    // ==========================================
    // PÁGINA 2: SECCIONES 1 A 5
    // ==========================================
    doc.addPage();
    let y = 24;

    // 1. Presentación & 2. Resumen Ejecutivo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. PRESENTACIÓN Y 2. RESUMEN EJECUTIVO', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const presText = doc.splitTextToSize(
      'El presente Proyecto Pastoral de Acción Social constituye el fruto maduro del itinerario de formación sacramental de los jóvenes de Confirmación de la Parroquia San Martín de Porres (Tarija). La experiencia no se concibe como una actividad recreativa aislada, sino como un ejercicio testimonial donde la efusión del Espíritu Santo recibida en el sacramento se plasma en caridad operativa, fraterna y transformadora. La obra movilizará cuadrillas mixtas organizadas sinodalmente para brindar un servicio concreto, investigado previamente y coordinado con los agentes territoriales de la ciudad.',
      180
    );
    doc.text(presText, 15, y);
    y += presText.length * 4.2 + 5;

    // 3. Fundamentación Bíblica
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. FUNDAMENTACIÓN BÍBLICA (FUENTES VERIFICADAS)', 15, y);
    y += 5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    const bibText = doc.splitTextToSize(project.biblicalInspiration, 180);
    doc.text(bibText, 15, y);
    y += bibText.length * 3.8 + 5;

    // 4. Fundamentación en el Magisterio de la Iglesia
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. FUNDAMENTACIÓN EN EL MAGISTERIO DE LA IGLESIA', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const magText = doc.splitTextToSize(
      project.magisterialFoundations || 
      '• Papa Francisco, Christus vivit (n. 170-178): El compromiso social como pedagogía de la fe viva.\n• Papa Francisco, Laudato si\' (n. 13, 217): Cuidado de la casa común y conversión ecológica comunitaria.\n• Papa Francisco, Fratelli tutti (n. 67-68): La parábola del Buen Samaritano como imperativo eclesial.\n• Compendio de la Doctrina Social de la Iglesia (n. 160-196): Principios de bien común, solidaridad y subsidiaridad.',
      180
    );
    doc.text(magText, 15, y);
    y += magText.length * 3.8 + 5;

    // 5. Justificación Pastoral
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('5. JUSTIFICACIÓN PASTORAL', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const justLines = doc.splitTextToSize(
      `En el contexto de la Parroquia San Martín de Porres de Tarija, se evidencia con frecuencia el riesgo de que la Confirmación signifique una "despedida" de la Iglesia. Este proyecto invierte esa inercia transformándola en punto de partida misionero: "La fe se vive sirviendo". Permite además que jóvenes procedentes de diferentes grupos de catequesis se conozcan, trabajen codo a codo y descubran la belleza de una Iglesia sinodal en salida.`,
      180
    );
    doc.text(justLines, 15, y);

    // ==========================================
    // PÁGINA 3: SECCIONES 6 A 11 (VER, OBJETIVOS, PILARES)
    // ==========================================
    doc.addPage();
    y = 24;

    // 6. Diagnóstico de la Realidad (VER)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('6. DIAGNÓSTICO DE LA REALIDAD (VER)', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const diagLines = doc.splitTextToSize(project.contextDiagnosis, 180);
    doc.text(diagLines, 15, y);
    y += diagLines.length * 4.2 + 5;

    // 7. Objetivo General y 8. Específicos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('7. OBJETIVO GENERAL Y 8. OBJETIVOS ESPECÍFICOS', 15, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Objetivo General:', 15, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const ogLines = doc.splitTextToSize(project.generalObjective, 180);
    doc.text(ogLines, 15, y);
    y += ogLines.length * 4.2 + 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Objetivos Específicos:', 15, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    project.specificObjectives.forEach(obj => {
      const spLines = doc.splitTextToSize(`• ${obj}`, 175);
      doc.text(spLines, 18, y);
      y += spLines.length * 3.8;
    });

    y += 5;

    // 9. Población Participante y Beneficiaria
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('9. POBLACIÓN PARTICIPANTE Y BENEFICIARIA', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const benText = doc.splitTextToSize(
      `• Voluntariado Juvenil Participante: ${project.volunteerCount || participants.length || 40} jóvenes confirmados.\n• Beneficiarios Directos: ${project.targetBeneficiaries} (Estimación: ~${project.estimatedBeneficiariesCount || 100} personas beneficiadas en Tarija).`,
      180
    );
    doc.text(benText, 15, y);
    y += benText.length * 4.2 + 5;

    // 10. Los Tres Pilares y 11. Criterios de Selección
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('10. LOS TRES PILARES DE INTERVENCIÓN Y 11. CRITERIOS DE SELECCIÓN', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const pilText = doc.splitTextToSize(
      `El sistema contempla tres pilares pastorales: Pilar 1 (Casa Común: cuidado ecológico), Pilar 2 (Corazones en Acción: cercanía humana a niños y ancianos) y Pilar 3 (Transformadores de Esperanza: recuperación de espacios comunitarios).\n\nCRITERIO FUNDAMENTAL DE ELECCIÓN: No se asume que deban ejecutarse obligatoriamente los tres pilares de forma simultánea. Se seleccionará formalmente una intervención principal coherente con los datos de la encuesta y las necesidades locales comprobadas en Tarija, pudiendo integrar acciones complementarias si la disponibilidad y los recursos lo garantizan.`,
      180
    );
    doc.text(pilText, 15, y);

    // ==========================================
    // PÁGINA 4: SECCIONES 12 A 16 (METODOLOGÍA, EQUIPOS, CRONOGRAMA)
    // ==========================================
    doc.addPage();
    y = 24;

    // 12. Metodología
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('12. METODOLOGÍA PASTORAL (VER - JUZGAR - ACTUAR - EVALUAR - CELEBRAR)', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const metFlow = [
      '• VER: Diagnóstico participativo mediante encuesta digital a los confirmados y visita previa al territorio.',
      '• JUZGAR: Iluminación doctrinal a la luz de Santiago 2, Mateo 25, Laudato si\', Fratelli tutti y Christus vivit.',
      '• ACTUAR: Jornada central de misión con cuadrillas mixtas organizadas por roles y talentos específicos.',
      '• EVALUAR: Conversación en el Espíritu y asamblea comunitaria de impacto con beneficiarios y catequistas.',
      '• CELEBRAR: Eucaristía de acción de gracias comunitaria con entrega de diplomas y llamado a la perseverancia.'
    ];
    metFlow.forEach(m => {
      doc.text(m, 18, y);
      y += 4.5;
    });

    y += 4;

    // 13. Organización de Equipos Mixtos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('13. ORGANIZACIÓN SINODAL DE EQUIPOS MIXTOS', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const teamRuleLines = doc.splitTextToSize(
      'Para fomentar la comunión eclesial, ningún equipo estará conformado exclusivamente por jóvenes del mismo grupo de catequesis. Cada equipo contará con: 1 Líder juvenil, 1 Co-líder, 1 Catequista adulto acompañante, animadores dinámicos, soporte logístico y miembros de servicio.',
      180
    );
    doc.text(teamRuleLines, 15, y);
    y += teamRuleLines.length * 4.2 + 4;

    // 15. Cronograma de Hitos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('15. CRONOGRAMA DE HITOS DESDE EL RETIRO HASTA LA EVALUACIÓN', 15, y);
    y += 4;

    const milestoneRows = project.actionMilestones.map(m => [
      m.title,
      m.date,
      m.responsibleTeam,
      m.completed ? 'Completado' : 'Programado'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Hito / Fase del Proyecto', 'Fecha Límite', 'Equipo Responsable', 'Estado']],
      body: milestoneRows,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // 16. Recursos Humanos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('16. RECURSOS HUMANOS ASIGNADOS', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const hrLines = doc.splitTextToSize(project.humanResources || 'Equipo sacerdotal, catequistas de confirmación, líderes juveniles y comisiones de apoyo parroquial.', 180);
    doc.text(hrLines, 15, y);

    // ==========================================
    // PÁGINA 5: SECCIÓN 17 (MATERIALES Y PRESUPUESTO)
    // ==========================================
    doc.addPage();
    y = 24;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('17. MATERIALES Y PRESUPUESTO ESTIMADO (EN BOLIVIANOS - BOB)', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text('Cálculo consolidado de partidas presupuestarias, aportes comunitarios y cotizaciones:', 15, y);
    y += 5;

    let subtotalDonaciones = 0;
    let subtotalParroquia = 0;
    let partidasPendientes = 0;

    const budgetTableBody = (project.budgetItems || []).map((b, i) => {
      const isPending = b.isPendingQuote || b.unitCostBob === undefined || b.estimatedCostBob === 0;
      if (isPending) {
        partidasPendientes++;
      } else {
        if (b.isCoveredByDonation) {
          subtotalDonaciones += b.estimatedCostBob;
        } else {
          subtotalParroquia += b.estimatedCostBob;
        }
      }

      return [
        (i + 1).toString(),
        b.category,
        b.description,
        b.quantity ? b.quantity.toString() : '-',
        b.unitCostBob !== undefined ? `${b.unitCostBob} Bs.` : 'Pendiente',
        isPending ? 'Pendiente cotiz.' : `${b.estimatedCostBob} Bs.`,
        b.isCoveredByDonation ? 'Donación / Aporte' : 'Fondo Parroquial',
        b.responsible || 'Coordinación'
      ];
    });

    const totalGeneral = subtotalDonaciones + subtotalParroquia;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Categoría', 'Descripción del Insumo', 'Cant.', 'P. Unit.', 'Total', 'Financiamiento', 'Responsable']],
      body: budgetTableBody,
      foot: [
        ['', 'TOTAL ESTIMADO', '', '', '', `${totalGeneral} Bs.`, `Donación: ${subtotalDonaciones} Bs. | Parroquia: ${subtotalParroquia} Bs.`, '']
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryColor, fontSize: 7.5 },
      footStyles: { fillColor: [240, 238, 230], textColor: primaryColor, fontStyle: 'bold', fontSize: 7.5 },
      styles: { fontSize: 7, cellPadding: 1.8 },
      margin: { left: 15, right: 15 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    if (partidasPendientes > 0) {
      doc.setFillColor(254, 249, 195);
      doc.roundedRect(15, y, 180, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 80, 20);
      doc.text(`Nota: Se registran ${partidasPendientes} partida(s) marcada(s) como "Pendiente de cotización". El presupuesto final se ajustará al recibir las cotizaciones definitivas de proveedores en Tarija.`, 18, y + 6);
      y += 16;
    }

    // ==========================================
    // PÁGINA 6: SECCIONES 18 A 23 (PROTECCIÓN, EVALUACIÓN, BIBLIOGRAFÍA Y FIRMAS)
    // ==========================================
    doc.addPage();
    y = 24;

    // 18. Alianzas Institucionales
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('18. ALIANZAS INSTITUCIONALES EN TARIJA', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const alText = doc.splitTextToSize(project.institutionalAlliances || 'Centros vecinales de Tarija, Hogar de ancianos y Vivero Municipal.', 180);
    doc.text(alText, 15, y);
    y += alText.length * 3.8 + 4;

    // 19. Protección de Menores y Personas Vulnerables
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('19. PROTOCOLO DE PROTECCIÓN DE MENORES Y PERSONAS VULNERABLES', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const protText = doc.splitTextToSize(project.vulnerabilityProtocols || 'Autorizaciones parentales por escrito, acompañamiento de catequistas adultos, botiquín y salvaguarda de la dignidad de los beneficiarios.', 180);
    doc.text(protText, 15, y);
    y += protText.length * 3.8 + 4;

    // 20. Indicadores de Resultados & 21. Evaluación Final
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('20. INDICADORES DE RESULTADOS Y 21. EVALUACIÓN FINAL', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const indText = doc.splitTextToSize(
      `${project.resultIndicators}\n• Criterio de Evaluación: ${project.evaluationCriteria}\n• Misa de Acción de Gracias: ${project.thanksgivingMassDate}`,
      180
    );
    doc.text(indText, 15, y);
    y += indText.length * 3.8 + 4;

    // 22. Continuidad Pastoral
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('22. ESTRATEGIA DE CONTINUIDAD PASTORAL', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const contText = doc.splitTextToSize(project.pastoralContinuityStrategy || 'Inserción activa en los grupos juveniles parroquiales.', 180);
    doc.text(contText, 15, y);
    y += contText.length * 3.8 + 4;

    // 23. Bibliografía Oficial
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('23. BIBLIOGRAFÍA CANÓNICA Y MAGISTERIAL VERIFICADA', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    (project.bibliography || []).forEach(b => {
      const bLines = doc.splitTextToSize(`• ${b}`, 175);
      doc.text(bLines, 18, y);
      y += bLines.length * 3.5;
    });

    y += 8;

    // Firmas Institucionales
    doc.setDrawColor(120, 120, 120);
    doc.line(25, y + 16, 85, y + 16);
    doc.line(125, y + 16, 185, y + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text('Párroco / Asesor Espiritual', 55, y + 21, { align: 'center' });
    doc.text('Coordinador General de Confirmación', 155, y + 21, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Parroquia San Martín de Porres', 55, y + 25, { align: 'center' });
    doc.text('Pastoral Juvenil Diócesis de Tarija', 155, y + 25, { align: 'center' });

    // Numeración y encabezados
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawPageHeader(i);

      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 130);
      doc.text(
        `Página ${i} de ${totalPages} — Proyecto Pastoral Jóvenes en Misión SMP (v${project.version || '1.0'}) — Tarija, Bolivia`,
        105,
        290,
        { align: 'center' }
      );
    }

    doc.save(filename);
  }
};
