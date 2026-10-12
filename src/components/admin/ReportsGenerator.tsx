import React, { useState } from 'react';
import { Participant, MixedTeam, SocialProjectTracking, BudgetItem, PastoralProjectVersion } from '../../types';
import { exportService } from '../../services/exportService';
import { storageService } from '../../services/storageService';
import { reportAnalysisService } from '../../services/reportAnalysisService';
import { PILLARS } from '../../config/pillars';
import { 
  FileText, FileSpreadsheet, Download, BookOpen, AlertTriangle, CheckCircle2, 
  History, Plus, Save, RotateCcw, ShieldCheck, Heart, Calendar, DollarSign,
  Users, Layers, Award, Sparkles, HelpCircle, ChevronRight
} from 'lucide-react';

interface ReportsGeneratorProps {
  participants: Participant[];
  teams: MixedTeam[];
  project: SocialProjectTracking;
  onProjectUpdated?: (project: SocialProjectTracking) => void;
}

export const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({
  participants,
  teams,
  project,
  onProjectUpdated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'docA' | 'docB' | 'versions'>('docA');
  const [downloading, setDownloading] = useState<string | null>(null);

  // Estado del proyecto editable en Documento B
  const [projectState, setProjectState] = useState<SocialProjectTracking>(project);
  const [versions, setVersions] = useState<PastoralProjectVersion[]>(storageService.getProjectVersions());

  // Modal para guardar nueva versión
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [newVersionNum, setNewVersionNum] = useState<string>('1.1');
  const [newVersionAuthor, setNewVersionAuthor] = useState<string>('Coordinación de Confirmación');
  const [newVersionNotes, setNewVersionNotes] = useState<string>('Ajuste de presupuesto y cronograma con cotizaciones de Tarija.');

  // Modal para agregar nueva partida presupuestaria
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState<boolean>(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState<string>('Alimentación y Merienda');
  const [newBudgetDesc, setNewBudgetDesc] = useState<string>('');
  const [newBudgetQty, setNewBudgetQty] = useState<number>(1);
  const [newBudgetUnitCost, setNewBudgetUnitCost] = useState<string>('');
  const [newBudgetIsDonation, setNewBudgetIsDonation] = useState<boolean>(false);
  const [newBudgetResponsible, setNewBudgetResponsible] = useState<string>('Equipo Coordinador');

  const accessCodes = storageService.getAccessCodes();
  const stats = reportAnalysisService.generateStatistics(participants, accessCodes);

  // Cálculos dinámicos de presupuesto
  const budgetItems = projectState.budgetItems || [];
  let subtotalDonaciones = 0;
  let subtotalParroquia = 0;
  let pendientesCotizacion = 0;

  budgetItems.forEach(b => {
    const isPending = b.isPendingQuote || b.unitCostBob === undefined || b.estimatedCostBob === 0;
    if (isPending) {
      pendientesCotizacion++;
    } else {
      if (b.isCoveredByDonation) {
        subtotalDonaciones += b.estimatedCostBob;
      } else {
        subtotalParroquia += b.estimatedCostBob;
      }
    }
  });
  const totalGeneralBob = subtotalDonaciones + subtotalParroquia;

  // Acciones de Exportación
  const handleExportDocAPdf = () => {
    setDownloading('docA-pdf');
    setTimeout(() => {
      exportService.generateResultsReportPdf(participants, projectState, accessCodes);
      setDownloading(null);
    }, 400);
  };

  const handleExportDocAExcel = () => {
    setDownloading('docA-excel');
    setTimeout(() => {
      exportService.exportToExcel(participants, teams, projectState, accessCodes);
      setDownloading(null);
    }, 400);
  };

  const handleExportDocACsv = () => {
    setDownloading('docA-csv');
    setTimeout(() => {
      exportService.exportToCsv(participants);
      setDownloading(null);
    }, 300);
  };

  const handleExportDocBPdf = () => {
    setDownloading('docB-pdf');
    setTimeout(() => {
      exportService.generatePastoralProjectPdf(projectState, teams, participants);
      setDownloading(null);
    }, 400);
  };

  // Guardar cambios sobre el proyecto
  const handleUpdateProjectField = (field: keyof SocialProjectTracking, value: any) => {
    const updated = { ...projectState, [field]: value };
    setProjectState(updated);
    storageService.saveProjectTracking(updated);
    if (onProjectUpdated) onProjectUpdated(updated);
  };

  // Crear nueva partida presupuestaria
  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetDesc.trim()) return;

    const unitCost = newBudgetUnitCost.trim() !== '' ? Number(newBudgetUnitCost) : undefined;
    const isPending = unitCost === undefined || isNaN(unitCost) || unitCost <= 0;
    const totalCost = isPending ? 0 : Number(newBudgetQty) * (unitCost || 0);

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      category: newBudgetCategory,
      description: newBudgetDesc.trim(),
      quantity: Number(newBudgetQty) || 1,
      unitCostBob: unitCost,
      estimatedCostBob: totalCost,
      isPendingQuote: isPending,
      isCoveredByDonation: newBudgetIsDonation,
      responsible: newBudgetResponsible.trim()
    };

    const updatedItems = [...budgetItems, newItem];
    handleUpdateProjectField('budgetItems', updatedItems);

    setNewBudgetDesc('');
    setNewBudgetUnitCost('');
    setIsAddBudgetOpen(false);
  };

  // Eliminar partida presupuestaria
  const handleRemoveBudgetItem = (id: string) => {
    const updatedItems = budgetItems.filter(b => b.id !== id);
    handleUpdateProjectField('budgetItems', updatedItems);
  };

  // Guardar nueva versión del proyecto pastoral
  const handleSaveNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionNum.trim()) return;

    const created = storageService.saveNewProjectVersion(
      newVersionNum.trim(),
      newVersionAuthor.trim(),
      newVersionNotes.trim(),
      projectState
    );

    const updatedList = storageService.getProjectVersions();
    setVersions(updatedList);
    setProjectState(created.projectData);
    if (onProjectUpdated) onProjectUpdated(created.projectData);
    setIsVersionModalOpen(false);
  };

  // Restaurar versión previa
  const handleRestoreVersion = (versionId: string) => {
    const restored = storageService.restoreProjectVersion(versionId);
    if (restored) {
      setProjectState(restored);
      if (onProjectUpdated) onProjectUpdated(restored);
      setVersions(storageService.getProjectVersions());
      setActiveSubTab('docB');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Encabezado General */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4EEE8] text-[#16382D] border border-[#214C3B]/20/80 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#214C3B]" />
              <span>Módulo Documental Oficial • Parroquia San Martín de Porres</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              Informes Estadísticos y Proyecto Pastoral
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
              Generación de documentos formales independientes para el Párroco, el Consejo Pastoral y los Catequistas de Confirmación en Tarija.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportDocAExcel}
              disabled={downloading !== null}
              className="px-3.5 py-2 bg-[#214C3B] hover:bg-[#16382D] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{downloading === 'docA-excel' ? 'Exportando...' : 'Excel Estadístico (.xlsx)'}</span>
            </button>
            <button
              onClick={handleExportDocAPdf}
              disabled={downloading !== null}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'docA-pdf' ? 'Generando...' : 'PDF Documento A'}</span>
            </button>
            <button
              onClick={handleExportDocBPdf}
              disabled={downloading !== null}
              className="px-3.5 py-2 bg-[#214C3B] hover:bg-[#16382D] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'docB-pdf' ? 'Generando...' : 'PDF Documento B'}</span>
            </button>
          </div>
        </div>

        {/* Pestañas de navegación interna */}
        <div className="flex items-center gap-2 mt-6 border-b border-stone-200">
          <button
            onClick={() => setActiveSubTab('docA')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'docA'
                ? 'border-[#214C3B] text-[#214C3B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>DOCUMENTO A: Informe de Resultados (17 Secciones)</span>
            {stats.isDraft && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                Borrador
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('docB')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'docB'
                ? 'border-[#214C3B] text-[#214C3B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>DOCUMENTO B: Proyecto Pastoral Social (23 Secciones)</span>
            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono">
              v{projectState.version || '1.0'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('versions')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'versions'
                ? 'border-[#214C3B] text-[#214C3B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Control de Versiones ({versions.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB A: DOCUMENTO A - INFORME DE RESULTADOS (17 SECCIONES) */}
      {/* ========================================================================= */}
      {activeSubTab === 'docA' && (
        <div className="space-y-6">
          {/* Banner de Borrador si no hay suficientes respuestas */}
          {stats.isDraft && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Documento marcado como: BORRADOR SIN RESULTADOS REALES
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Actualmente hay <strong>{stats.totalParticipants} respuesta(s)</strong> registradas. Para evitar sesgos o decisiones precipitadas, el informe formal se emitirá como consolidado cuando los grupos de Confirmación completen el censo. Mientras tanto, se muestra la estructura metodológica con las respuestas observadas hasta el momento.
                </p>
              </div>
            </div>
          )}

          {/* Tarjetas de Métricas Directas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Censados</span>
              <p className="text-2xl font-serif font-bold text-neutral-900 mt-1">{stats.totalParticipants}</p>
              <span className="text-[11px] text-stone-500">Jóvenes confirmados</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Tasa de Respuesta</span>
              <p className="text-2xl font-serif font-bold text-neutral-900 mt-1">{stats.responseRatePercent}%</p>
              <span className="text-[11px] text-stone-500">Sobre códigos habilitados</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Grupos Presentes</span>
              <p className="text-2xl font-serif font-bold text-neutral-900 mt-1">{stats.groupsBreakdown.length}</p>
              <span className="text-[11px] text-stone-500">Grupos de catequesis</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Edad Promedio</span>
              <p className="text-2xl font-serif font-bold text-neutral-900 mt-1">{stats.averageAge} años</p>
              <span className="text-[11px] text-stone-500">Población juvenil</span>
            </div>
          </div>

          {/* Secciones 3 a 8: Metodología, Grupos y Pilares */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Representación por Grupos */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  6. Grupos de Confirmación Representados
                </h3>
                <span className="text-xs text-stone-500">Total: {stats.groupsBreakdown.length} grupos</span>
              </div>
              <div className="space-y-3">
                {stats.groupsBreakdown.map((g, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-800">{g.group}</span>
                      <span className="text-stone-500 font-mono">{g.count} jóvenes ({g.percent}%)</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#214C3B] rounded-full transition-all duration-500"
                        style={{ width: `${g.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferencias por Pilar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  8. Preferencias por Pilar de Acción
                </h3>
                <span className="text-xs text-stone-500">Elección de los jóvenes</span>
              </div>
              <div className="space-y-3">
                {stats.pillarBreakdown.map((p, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{p.title}</h4>
                      <p className="text-[11px] text-stone-500">Vocación manifestada en el censo</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-serif font-bold text-neutral-900">{p.count}</span>
                      <span className="text-xs text-stone-500 ml-1">({p.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secciones 10 a 12: Habilidades y Disponibilidad */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Habilidades Disponibles */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  10. Habilidades y Talentos Disponibles
                </h3>
                <span className="text-xs text-stone-500">Masa crítica de talentos</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {stats.skillsBreakdown.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-xs">
                    <span className="text-stone-700">{s.label}</span>
                    <span className="font-semibold text-[#16382D] bg-[#E4EEE8] px-2 py-0.5 rounded-full">
                      {s.count} ({s.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilidad Horaria */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  11. Disponibilidad Horaria Reportada
                </h3>
                <span className="text-xs text-stone-500">Factibilidad operativa</span>
              </div>
              <div className="space-y-2">
                {stats.availabilityBreakdown.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-xs">
                    <span className="text-stone-700">{a.label}</span>
                    <span className="font-semibold text-terracotta-800 bg-terracotta-50 px-2 py-0.5 rounded-full">
                      {a.count} ({a.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secciones 14 a 17: Análisis Riguroso */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-6">
            <h3 className="font-serif font-bold text-lg text-neutral-900 border-b border-stone-100 pb-3">
              14, 15, 16 y 17. Análisis Cualitativo, Limitaciones y Recomendaciones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hechos Observados vs Interpretación */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Hechos Observados Demostrados:
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                    {stats.hechosObservados.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Interpretación Pastoral:
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                    {stats.interpretacionPastoral.map((ip, i) => (
                      <li key={i}>{ip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Limitaciones y Recomendaciones */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                    Limitaciones del Estudio:
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                    {stats.limitacionesEstudio.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#16382D] mb-2">
                    Recomendaciones para Catequistas:
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                    {stats.recomendacionesCatequistas.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Barra de Descargas Documento A */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                ¿Deseas compartir este informe con el Párroco o el Consejo Pastoral?
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportDocACsv}
                  disabled={downloading !== null}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs text-stone-700 hover:bg-stone-50 font-medium transition-all"
                >
                  Exportar CSV Plano
                </button>
                <button
                  onClick={handleExportDocAExcel}
                  disabled={downloading !== null}
                  className="px-4 py-2 bg-[#214C3B] hover:bg-[#16382D] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exportar Excel Completo (.xlsx)</span>
                </button>
                <button
                  onClick={handleExportDocAPdf}
                  disabled={downloading !== null}
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Informe en PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB B: DOCUMENTO B - PROYECTO PASTORAL DE ACCIÓN SOCIAL (23 SECCIONES) */}
      {/* ========================================================================= */}
      {activeSubTab === 'docB' && (
        <div className="space-y-6">
          {/* Barra de Control de Versión Activa */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-serif font-bold text-lg">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    JÓVENES EN MISIÓN SMP — LA FE SE VIVE SIRVIENDO
                  </h3>
                  <span className="text-xs bg-terracotta-50 text-terracotta-800 font-mono font-semibold px-2 py-0.5 rounded-full border border-terracotta-200">
                    Versión {projectState.version || '1.0'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Responsable: {projectState.responsibleCatechist || 'Equipo Coordinador'} • Tarija, Bolivia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVersionModalOpen(true)}
                className="px-3.5 py-2 border border-terracotta-300 text-terracotta-800 hover:bg-terracotta-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar Nueva Versión</span>
              </button>
              <button
                onClick={handleExportDocBPdf}
                disabled={downloading !== null}
                className="px-4 py-2 bg-terracotta-700 hover:bg-terracotta-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{downloading === 'docB-pdf' ? 'Generando PDF...' : 'Descargar Proyecto (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Formulario / Editor Parroquial de Parámetros Operativos */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-6">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Parámetros Operativos y Criterio de Selección de la Obra
              </h3>
              <span className="text-xs text-stone-400">Edición en tiempo real</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Fecha de la Obra Social</label>
                <input
                  type="date"
                  value={projectState.executionDate || ''}
                  onChange={e => handleUpdateProjectField('executionDate', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Duración (Horas de campo)</label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={projectState.durationHours || 8}
                  onChange={e => handleUpdateProjectField('durationHours', Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Voluntarios Confirmados</label>
                <input
                  type="number"
                  min="1"
                  value={projectState.volunteerCount || participants.length || 40}
                  onChange={e => handleUpdateProjectField('volunteerCount', Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Beneficiarios Estimados (~)</label>
                <input
                  type="number"
                  min="1"
                  value={projectState.estimatedBeneficiariesCount || 100}
                  onChange={e => handleUpdateProjectField('estimatedBeneficiariesCount', Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
            </div>

            {/* Criterio de Selección de la Obra Definitiva */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#214C3B]" />
                <h4 className="text-xs font-bold text-stone-900">
                  Criterio de Elección de los Tres Pilares
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {projectState.pillarSelectionRationale}
              </p>
            </div>
          </div>

          {/* Sección 17: Presupuesto y Materiales (Editor en Bolivianos BOB) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#214C3B]" />
                  <span>17. Presupuesto y Materiales Estimados (en Bolivianos - BOB)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Las partidas sin cotización confirmada se señalan automáticamente como "Pendiente de cotización".
                </p>
              </div>

              <button
                onClick={() => setIsAddBudgetOpen(true)}
                className="px-3.5 py-2 bg-[#214C3B] hover:bg-[#16382D] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Partida / Insumo</span>
              </button>
            </div>

            {/* Tarjetas de Resumen Económico */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-500">Aportes y Donaciones</span>
                <p className="text-xl font-serif font-bold text-neutral-900 mt-1">{subtotalDonaciones} Bs.</p>
                <span className="text-[11px] text-stone-500">Cubierto por comunidad/donantes</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-500">Fondo Requerido Parroquia</span>
                <p className="text-xl font-serif font-bold text-neutral-900 mt-1">{subtotalParroquia} Bs.</p>
                <span className="text-[11px] text-stone-500">Recursos pastorales líquidos</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 text-white shadow-soft">
                <span className="text-[10px] font-bold uppercase text-neutral-300">Presupuesto Total Estimado</span>
                <p className="text-xl font-serif font-bold text-[#214C3B] mt-1">{totalGeneralBob} Bs.</p>
                <span className="text-[11px] text-neutral-300">
                  {pendientesCotizacion > 0 ? `(${pendientesCotizacion} ítem(s) pendiente cotizar)` : 'Todas las partidas cotizadas'}
                </span>
              </div>
            </div>

            {/* Tabla de Partidas */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 text-stone-700 font-bold">
                  <tr>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Descripción del Insumo</th>
                    <th className="p-3 text-center">Cant.</th>
                    <th className="p-3 text-right">P. Unit. (Bs.)</th>
                    <th className="p-3 text-right">Total (Bs.)</th>
                    <th className="p-3">Financiamiento</th>
                    <th className="p-3">Responsable</th>
                    <th className="p-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {budgetItems.map(item => {
                    const isPending = item.isPendingQuote || item.unitCostBob === undefined || item.estimatedCostBob === 0;
                    return (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-stone-800">{item.category}</td>
                        <td className="p-3 text-stone-600">{item.description}</td>
                        <td className="p-3 text-center font-mono">{item.quantity || '-'}</td>
                        <td className="p-3 text-right font-mono">
                          {item.unitCostBob !== undefined ? `${item.unitCostBob} Bs.` : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono font-bold">
                          {isPending ? (
                            <span className="text-amber-700 italic text-[11px]">Pendiente cotiz.</span>
                          ) : (
                            `${item.estimatedCostBob} Bs.`
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.isCoveredByDonation 
                              ? 'bg-[#E4EEE8] text-[#16382D]' 
                              : 'bg-stone-200 text-stone-800'
                          }`}>
                            {item.isCoveredByDonation ? 'Donación / Aporte' : 'Fondo Parroquial'}
                          </span>
                        </td>
                        <td className="p-3 text-stone-600">{item.responsible || 'Coordinación'}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRemoveBudgetItem(item.id)}
                            className="text-stone-400 hover:text-[#214C3B] transition-colors"
                            title="Eliminar partida"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secciones Doctrinales y de Protección */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
                3 y 4. Fundamentación Bíblica y Magisterial
              </h3>
              <div className="text-xs text-stone-700 space-y-3 leading-relaxed">
                <div>
                  <h4 className="font-bold text-neutral-900 uppercase tracking-wide text-[11px] mb-1">
                    Textos Bíblicos Verificados:
                  </h4>
                  <p className="italic text-stone-600 whitespace-pre-line">
                    {projectState.biblicalInspiration}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 uppercase tracking-wide text-[11px] mb-1">
                    Magisterio Pontificio y Social:
                  </h4>
                  <p className="text-stone-600 whitespace-pre-line">
                    {projectState.magisterialFoundations}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
                19. Protección de Menores y Personas Vulnerables
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {projectState.vulnerabilityProtocols}
              </p>

              <h4 className="font-serif font-bold text-sm text-stone-900 pt-2 border-t border-stone-100">
                18. Alianzas Institucionales en Tarija
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {projectState.institutionalAlliances}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB C: HISTORIAL DE VERSIONES (NO DESTRUCTIVO) */}
      {/* ========================================================================= */}
      {activeSubTab === 'versions' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                Historial de Versiones del Proyecto Pastoral
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Cada versión se preserva permanentemente. Nunca se sobrescribe automáticamente el trabajo anterior.
              </p>
            </div>

            <button
              onClick={() => setIsVersionModalOpen(true)}
              className="px-4 py-2 bg-[#214C3B] hover:bg-[#16382D] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Versión</span>
            </button>
          </div>

          <div className="space-y-4">
            {versions.map(v => (
              <div
                key={v.versionId}
                className="p-5 rounded-2xl border border-stone-200 hover:border-[#214C3B]/40 bg-stone-50/60 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#E4EEE8] text-[#16382D] px-2.5 py-0.5 rounded-full border border-[#214C3B]/20">
                      v{v.versionNumber}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900">
                      {v.projectData.title}
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      • {new Date(v.createdAt).toLocaleString('es-BO')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    <strong>Responsable:</strong> {v.author} • <strong>Notas:</strong> {v.notes || 'Sin observaciones'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Fecha de ejecución: {v.projectData.executionDate} | Presupuesto: {v.projectData.budgetItems?.length || 0} partidas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestoreVersion(v.versionId)}
                    className="px-3.5 py-1.5 border border-stone-300 text-stone-800 hover:bg-stone-100 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Esta Versión</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVA VERSIÓN */}
      {/* ========================================================================= */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-stone-200 animate-fadeIn space-y-4">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Guardar Nueva Versión del Proyecto Pastoral
            </h3>
            <p className="text-xs text-stone-500">
              El sistema creará un registro histórico inmutable para que puedas contrastar la evolución del proyecto.
            </p>

            <form onSubmit={handleSaveNewVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Número de Versión</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1.1 o 2.0"
                  value={newVersionNum}
                  onChange={e => setNewVersionNum(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Catequista o Autor Responsable</label>
                <input
                  type="text"
                  required
                  value={newVersionAuthor}
                  onChange={e => setNewVersionAuthor(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Notas de la Versión / Motivo del Cambio</label>
                <textarea
                  rows={3}
                  required
                  value={newVersionNotes}
                  onChange={e => setNewVersionNotes(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#214C3B] text-white rounded-xl text-xs font-semibold hover:bg-[#16382D]"
                >
                  Guardar Versión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AGREGAR PARTIDA PRESUPUESTARIA */}
      {/* ========================================================================= */}
      {isAddBudgetOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-stone-200 animate-fadeIn space-y-4">
            <h3 className="font-serif font-bold text-lg text-neutral-900">
              Agregar Partida al Presupuesto (BOB)
            </h3>
            <p className="text-xs text-stone-500">
              Si dejas el costo unitario vacío, la partida se marcará automáticamente como "Pendiente de cotización".
            </p>

            <form onSubmit={handleAddBudgetItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
                <select
                  value={newBudgetCategory}
                  onChange={e => setNewBudgetCategory(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Alimentación y Merienda">Alimentación y Merienda</option>
                  <option value="Materiales Lúdicos y Didácticos">Materiales Lúdicos y Didácticos</option>
                  <option value="Canastas Fraternas y Víveres">Canastas Fraternas y Víveres</option>
                  <option value="Insumos Ambientales y Plantines">Insumos Ambientales y Plantines</option>
                  <option value="Pintura y Reparación de Mobiliario">Pintura y Reparación de Mobiliario</option>
                  <option value="Seguridad y Primeros Auxilios">Seguridad y Primeros Auxilios</option>
                  <option value="Transporte y Logística">Transporte y Logística</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Descripción del Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 50 plantines de jacarandá nativo"
                  value={newBudgetDesc}
                  onChange={e => setNewBudgetDesc(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={newBudgetQty}
                    onChange={e => setNewBudgetQty(Number(e.target.value))}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Costo Unit. (Bs.) (Opcional)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Dejar vacío si pendiente"
                    value={newBudgetUnitCost}
                    onChange={e => setNewBudgetUnitCost(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Equipo o Persona Responsable</label>
                <input
                  type="text"
                  value={newBudgetResponsible}
                  onChange={e => setNewBudgetResponsible(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDonation"
                  checked={newBudgetIsDonation}
                  onChange={e => setNewBudgetIsDonation(e.target.checked)}
                  className="rounded text-[#214C3B] focus:ring-[#214C3B]"
                />
                <label htmlFor="isDonation" className="text-xs text-stone-700">
                  Es donación comunitaria o aporte de familias (no requiere fondo parroquial)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBudgetOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#214C3B] text-white rounded-xl text-xs font-semibold hover:bg-[#16382D]"
                >
                  Agregar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
