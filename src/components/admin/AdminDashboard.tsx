import React, { useState, useMemo } from 'react';
import { 
  Participant, MixedTeam, SocialProjectTracking, SystemConfig, PillarId, ConfirmationGroup, SkillCategory 
} from '../../types';
import { PILLARS, CONFIRMATION_GROUPS, SKILL_LABELS } from '../../config/pillars';
import { SURVEYS_BY_PILLAR, COMMON_QUESTIONS } from '../../config/surveyQuestions';
import { storageService } from '../../services/storageService';
import { exportService } from '../../services/exportService';
import { 
  Users, Layers, Award, Calendar, CheckCircle2, TrendingUp, Sparkles, 
  MapPin, Filter, Download, FileSpreadsheet, FileText, RefreshCw, 
  Clock, AlertCircle, Eye, ShieldCheck, Heart, UserCheck, X 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AdminDashboardProps {
  participants: Participant[];
  teams: MixedTeam[];
  project: SocialProjectTracking;
  config?: SystemConfig;
  onRefresh?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  participants,
  teams,
  project,
  config,
  onRefresh
}) => {
  // Estados de interfaz y filtrado
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Estados de exportación y carga
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'completed'>('idle');
  const [inspectingParticipant, setInspectingParticipant] = useState<Participant | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(() => new Date().toLocaleTimeString('es-BO'));

  // Códigos de acceso desde almacenamiento para métricas exactas
  const accessCodes = useMemo(() => storageService.getAccessCodes(), [participants]);
  const totalCodesEnabled = accessCodes.length;

  // Filtrado de participantes en tiempo real
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      // 1. Grupo
      if (filterGroup !== 'all' && p.confirmationGroup !== filterGroup) return false;
      // 2. Pilar
      if (filterPillar !== 'all') {
        const norm = (p.primaryPillar === 'ecologia' ? 'casa_comun' : (p.primaryPillar === 'ninez' || p.primaryPillar === 'adultos_mayores') ? 'corazones_en_accion' : p.primaryPillar);
        if (norm !== filterPillar) return false;
      }
      // 3. Habilidad
      if (filterSkill !== 'all' && !p.skills.includes(filterSkill as SkillCategory)) return false;
      // 4. Disponibilidad
      if (filterAvailability !== 'all' && !p.availability.includes(filterAvailability as any)) return false;
      // 5. Estado
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;

      return true;
    });
  }, [participants, filterGroup, filterPillar, filterSkill, filterAvailability, filterStatus]);

  // Total de respuestas válidas filtradas y globales
  const totalRegistered = participants.length;
  const filteredCount = filteredParticipants.length;
  const completedCount = participants.filter(p => p.status === 'completada').length;
  const pendingCount = Math.max(0, totalCodesEnabled - completedCount);
  const completionRate = totalCodesEnabled > 0 ? Math.round((completedCount / totalCodesEnabled) * 100) : 0;

  // Grupos activos participantes
  const activeGroupsCount = useMemo(() => {
    const groups = new Set(participants.map(p => p.confirmationGroup));
    return groups.size;
  }, [participants]);

  // Conteo por Pilar normalizado
  const normalizePillar = (p: PillarId): PillarId => {
    if (p === 'ecologia') return 'casa_comun';
    if (p === 'ninez' || p === 'adultos_mayores') return 'corazones_en_accion';
    return p;
  };

  const countCasaComun = filteredParticipants.filter(p => normalizePillar(p.primaryPillar) === 'casa_comun').length;
  const countCorazones = filteredParticipants.filter(p => normalizePillar(p.primaryPillar) === 'corazones_en_accion').length;
  const countTransformadores = filteredParticipants.filter(p => normalizePillar(p.primaryPillar) === 'transformadores_de_esperanza').length;

  // 1. Gráfico de Preferencias por Pilar (Cantidades y %)
  const pillarChartData = [
    { 
      name: '1. Casa Común', 
      cantidad: countCasaComun, 
      porcentaje: filteredCount > 0 ? Math.round((countCasaComun / filteredCount) * 100) : 0,
      color: '#D71920' 
    },
    { 
      name: '2. Corazones en Acción', 
      cantidad: countCorazones, 
      porcentaje: filteredCount > 0 ? Math.round((countCorazones / filteredCount) * 100) : 0,
      color: '#171717' 
    },
    { 
      name: '3. Transformadores de Esperanza', 
      cantidad: countTransformadores, 
      porcentaje: filteredCount > 0 ? Math.round((countTransformadores / filteredCount) * 100) : 0,
      color: '#9CA3AF' 
    }
  ];

  // 2. Gráfico de Comparación por Grupo de Confirmación
  const groupChartData = useMemo(() => {
    const dataByGroup: Record<string, { group: string; casa_comun: number; corazones: number; transformadores: number; total: number }> = {};
    
    CONFIRMATION_GROUPS.forEach(g => {
      const shortName = g.replace('San ', 'S. ').replace('Santa ', 'Sta. ').replace('Beata ', 'Bta. ');
      dataByGroup[g] = { group: shortName, casa_comun: 0, corazones: 0, transformadores: 0, total: 0 };
    });

    filteredParticipants.forEach(p => {
      const g = p.confirmationGroup;
      if (dataByGroup[g]) {
        const norm = normalizePillar(p.primaryPillar);
        if (norm === 'casa_comun') dataByGroup[g].casa_comun++;
        else if (norm === 'corazones_en_accion') dataByGroup[g].corazones++;
        else if (norm === 'transformadores_de_esperanza') dataByGroup[g].transformadores++;
        dataByGroup[g].total++;
      }
    });

    return Object.values(dataByGroup).filter(d => d.total > 0);
  }, [filteredParticipants]);

  // 3. Gráfico de Habilidades Disponibles
  const skillsChartData = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    Object.keys(SKILL_LABELS).forEach(k => { skillCounts[k] = 0; });

    filteredParticipants.forEach(p => {
      p.skills.forEach(s => {
        if (skillCounts[s] !== undefined) skillCounts[s]++;
      });
    });

    return Object.entries(skillCounts)
      .map(([key, count]) => ({
        habilidad: SKILL_LABELS[key as SkillCategory]?.label.split(' ')[0] || key,
        cantidad: count,
        porcentaje: filteredCount > 0 ? Math.round((count / filteredCount) * 100) : 0
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [filteredParticipants, filteredCount]);

  // 4. Distribución de Disponibilidad Horaria
  const availabilityData = useMemo(() => {
    const counts = {
      'Sábado Mañana': filteredParticipants.filter(p => p.availability.includes('sabado_manana')).length,
      'Sábado Tarde': filteredParticipants.filter(p => p.availability.includes('sabado_tarde')).length,
      'Sábado Completo': filteredParticipants.filter(p => p.availability.includes('jornada_completa_sabado')).length,
      'Domingo': filteredParticipants.filter(p => p.availability.includes('domingo_manana') || p.availability.includes('domingo_tarde')).length
    };

    return Object.entries(counts).map(([turno, count]) => ({
      turno,
      cantidad: count,
      porcentaje: filteredCount > 0 ? Math.round((count / filteredCount) * 100) : 0
    }));
  }, [filteredParticipants, filteredCount]);

  // 5. Interés en Continuar Participando (Pregunta 7)
  const continuityData = useMemo(() => {
    let alta = 0;
    let moderada = 0;
    let puntual = 0;
    let sinResponder = 0;

    filteredParticipants.forEach(p => {
      const val = p.detailedSurveyAnswers?.continuidadIniciativas;
      if (!val) sinResponder++;
      else if (val.includes('activo') || val.includes('involucrarme') || val.includes('frecuencia')) alta++;
      else if (val.includes('segun') || val.includes('actividades') || val.includes('horarios')) moderada++;
      else puntual++;
    });

    return [
      { name: 'Compromiso Continuo', value: alta, color: '#D71920' },
      { name: 'Según Actividades', value: moderada, color: '#171717' },
      { name: 'Jornada Puntual', value: puntual, color: '#9CA3AF' },
      ...(sinResponder > 0 ? [{ name: 'Sin Registrar', value: sinResponder, color: '#D1D5DB' }] : [])
    ];
  }, [filteredParticipants]);

  // 6. Relación entre Pilar y Habilidades Aportadas
  const crossSkillPillarData = useMemo(() => {
    const skillsList = ['logistica', 'animacion', 'trabajo_manual', 'salud', 'arte_musica', 'escucha'];
    return skillsList.map(s => {
      const label = SKILL_LABELS[s as SkillCategory]?.label.split(' ')[0] || s;
      const cc = filteredParticipants.filter(p => normalizePillar(p.primaryPillar) === 'casa_comun' && p.skills.includes(s as any)).length;
      const ca = filteredParticipants.filter(p => normalizePillar(p.primaryPillar) === 'corazones_en_accion' && p.skills.includes(s as any)).length;
      const te = filteredParticipants.filter(p => normalizePillar(p.primaryPillar) === 'transformadores_de_esperanza' && p.skills.includes(s as any)).length;

      return {
        habilidad: label,
        'Casa Común': cc,
        'Corazones en Acción': ca,
        'Transformadores': te
      };
    });
  }, [filteredParticipants]);

  // Manejadores de Exportación
  const handleExportXlsx = () => {
    setExportState('exporting');
    setTimeout(() => {
      exportService.exportToExcel(filteredParticipants, teams, project, `Jovenes_Mision_SMP_${Date.now()}.xlsx`);
      setExportState('completed');
      setTimeout(() => setExportState('idle'), 2500);
    }, 400);
  };

  const handleExportCsv = () => {
    setExportState('exporting');
    setTimeout(() => {
      exportService.exportToCsv(filteredParticipants, `participantes_smp_filtrados_${Date.now()}.csv`);
      setExportState('completed');
      setTimeout(() => setExportState('idle'), 2500);
    }, 300);
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
    setLastUpdated(new Date().toLocaleTimeString('es-BO'));
  };

  // ESTADO VACÍO: Si no hay participantes en absoluto
  if (totalRegistered === 0) {
    return (
      <div className="card text-center py-16 space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-xl text-stone-900">
          Sin Respuestas Registradas Aún
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          La base de datos parroquial está lista pero aún no contiene encuestas enviadas. No se muestran cifras ficticias para resguardar la transparencia del informe pastoral.
        </p>
        <div className="pt-2">
          <button
            onClick={handleRefresh}
            className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Consultar Nuevamente el Servidor</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Barra de Estado de Sincronización */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Panel Pastoral • Métricas Oficiales
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 font-semibold border border-red-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              {config?.appsScriptUrl ? 'Google Sheets Conectado' : 'Almacenamiento Local'}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-2">
            Diagnóstico de Preferencias y Talentos
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Parroquia San Martín de Porres — Tarija. Última actualización: <strong className="font-mono text-stone-700">{lastUpdated}</strong>.
          </p>
        </div>

        {/* Acciones de exportación y refresco */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Refrescar métricas"
            className="p-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={exportState === 'exporting'}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportXlsx}
            disabled={exportState === 'exporting'}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{exportState === 'exporting' ? 'Exportando...' : 'Exportar Excel (XLSX)'}</span>
          </button>
        </div>
      </div>

      {exportState === 'completed' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
          <CheckCircle2 className="w-4 h-4 text-red-600" />
          <span>¡Archivo generado y descargado exitosamente!</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. BARRA DE FILTROS INTEGRALES                              */}
      {/* ============================================================ */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Filter className="w-4 h-4 text-red-600" />
            <span>Filtros Dinámicos del Diagnóstico:</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Mostrando <strong>{filteredCount}</strong> de <strong>{totalRegistered}</strong> respuestas válidas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Filtro Grupo */}
          <div>
            <label className="font-semibold text-stone-600 block mb-1">Grupo Confirmación:</label>
            <select
              value={filterGroup}
              onChange={e => setFilterGroup(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="all">Todos los grupos ({activeGroupsCount})</option>
              {CONFIRMATION_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Filtro Pilar */}
          <div>
            <label className="font-semibold text-stone-600 block mb-1">Pilar de Misión:</label>
            <select
              value={filterPillar}
              onChange={e => setFilterPillar(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="all">Todos los pilares</option>
              <option value="casa_comun">Pilar 1: Casa Común</option>
              <option value="corazones_en_accion">Pilar 2: Corazones en Acción</option>
              <option value="transformadores_de_esperanza">Pilar 3: Transformadores</option>
            </select>
          </div>

          {/* Filtro Habilidad */}
          <div>
            <label className="font-semibold text-stone-600 block mb-1">Habilidad / Don:</label>
            <select
              value={filterSkill}
              onChange={e => setFilterSkill(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="all">Todas las habilidades</option>
              {Object.keys(SKILL_LABELS).map(k => (
                <option key={k} value={k}>{SKILL_LABELS[k as SkillCategory]?.label.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          {/* Filtro Disponibilidad */}
          <div>
            <label className="font-semibold text-stone-600 block mb-1">Disponibilidad:</label>
            <select
              value={filterAvailability}
              onChange={e => setFilterAvailability(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="all">Todos los horarios</option>
              <option value="sabado_manana">Sábado Mañana</option>
              <option value="sabado_tarde">Sábado Tarde</option>
              <option value="jornada_completa_sabado">Sábado Completo</option>
              <option value="domingo_manana">Domingo</option>
            </select>
          </div>

          {/* Filtro Estado */}
          <div>
            <label className="font-semibold text-stone-600 block mb-1">Estado Encuesta:</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="completada">Completada</option>
              <option value="revisada">Revisada</option>
              <option value="asignado">Asignado a equipo</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. TARJETAS DE INDICADORES (RESUMEN GENERAL)                 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjeta 1: Participantes Registrados */}
        <div className="card border-l-4 border-l-stone-800">
          <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">Participantes</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">{filteredCount}</h3>
          <p className="text-[10px] text-stone-500 mt-1">De {totalRegistered} registrados en total</p>
        </div>

        {/* Tarjeta 2: Códigos Habilitados & Completadas */}
        <div className="card border-l-4 border-l-red-600">
          <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">Completadas / Códigos</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">{completedCount}</h3>
          <p className="text-[10px] text-stone-500 mt-1">De {totalCodesEnabled} códigos emitidos ({pendingCount} pendientes)</p>
        </div>

        {/* Tarjeta 3: Tasa de Finalización */}
        <div className="card border-l-4 border-l-neutral-900">
          <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">Tasa de Finalización</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">{completionRate}%</h3>
          <p className="text-[10px] text-stone-500 mt-1">{activeGroupsCount} grupos de confirmación activos</p>
        </div>

        {/* Tarjeta 4: Equipos Formados */}
        <div className="card border-l-4 border-l-stone-700">
          <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">Equipos Mixtos</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">{teams.length}</h3>
          <p className="text-[10px] text-stone-500 mt-1">Cuadrillas intergrupales sugeridas</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. LOS 6 GRÁFICOS SOLICITADOS POR PROMPT 6                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* GRÁFICO 1: Preferencias por Pilar (Cantidades y %) */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                1. Distribución de Preferencias por Pilar
              </h3>
              <p className="text-xs text-stone-500">Respuestas válidas: {filteredCount} ({filteredCount > 0 ? '100%' : '0%'})</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">
              3 Pilares
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pillarChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="cantidad"
                  label={({ name, percent }: any) => `${name ? String(name).split('.')[1]?.trim()?.split(' ')[0] : ''}: ${(((percent || 0) as number) * 100).toFixed(0)}%`}
                >
                  {pillarChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} jóvenes (${props.payload.porcentaje}%)`, name]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: Comparación de Preferencias por Grupo */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                2. Preferencias por Grupo de Confirmación
              </h3>
              <p className="text-xs text-stone-500">Comparativa para integración intergrupal</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold">
              Capillas
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="group" angle={-25} textAnchor="end" interval={0} fontSize={10} />
                <YAxis allowDecimals={false} fontSize={10} />
                <Tooltip />
                <Bar dataKey="casa_comun" name="Casa Común" fill="#D71920" stackId="a" />
                <Bar dataKey="corazones" name="Corazones" fill="#171717" stackId="a" />
                <Bar dataKey="transformadores" name="Esperanza" fill="#9CA3AF" stackId="a" />
                <Legend verticalAlign="top" height={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 3: Habilidades Disponibles (Conteo y %) */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                3. Habilidades y Talentos Disponibles
              </h3>
              <p className="text-xs text-stone-500">Dones declarados para la misión social en Tarija</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">
              Dones
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsChartData} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                <XAxis type="number" allowDecimals={false} fontSize={10} />
                <YAxis dataKey="habilidad" type="category" fontSize={10} />
                <Tooltip formatter={(value, name, props) => [`${value} jóvenes (${props.payload.porcentaje}%)`, 'Cantidad']} />
                <Bar dataKey="cantidad" fill="#D71920" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 4: Distribución de Disponibilidad Horaria */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                4. Disponibilidad Horaria para la Obra
              </h3>
              <p className="text-xs text-stone-500">Distribución de turnos compatibles</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">
              Horarios
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={availabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 15 }}>
                <XAxis dataKey="turno" fontSize={10} />
                <YAxis allowDecimals={false} fontSize={10} />
                <Tooltip formatter={(value, name, props) => [`${value} jóvenes (${props.payload.porcentaje}%)`, 'Disponibles']} />
                <Bar dataKey="cantidad" fill="#171717" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 5: Interés en Continuar en la Parroquia (Pregunta 7) */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                5. Continuidad Pastoral e Involucramiento
              </h3>
              <p className="text-xs text-stone-500">Disposición a perseverar después del retiro</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-50 text-red-800 font-bold border border-red-200">
              Perseverancia
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={continuityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name ? String(name).split(' ')[0] : ''}: ${(((percent || 0) as number) * 100).toFixed(0)}%`}
                >
                  {continuityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} jóvenes`, name]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 6: Relación entre Pilar y Habilidades Aportadas */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                6. Correlación: Pilar vs. Habilidades Aportadas
              </h3>
              <p className="text-xs text-stone-500">Mapeo de talentos en cada campo de servicio</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold border border-neutral-200">
              Equilibrio
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crossSkillPillarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="habilidad" fontSize={10} />
                <YAxis allowDecimals={false} fontSize={10} />
                <Tooltip />
                <Bar dataKey="Casa Común" fill="#D71920" />
                <Bar dataKey="Corazones en Acción" fill="#171717" />
                <Bar dataKey="Transformadores" fill="#9CA3AF" />
                <Legend verticalAlign="top" height={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. LISTADO ADMINISTRATIVO TABULADO                          */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Listado Administrativo de Participación
            </h3>
            <p className="text-xs text-stone-500">
              Registros filtrados protegidos para uso exclusivo de la coordinación parroquial.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 self-start sm:self-auto">
            {filteredCount} registros visualizados
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nombre Completo</th>
                <th className="px-4 py-3">Grupo Confirmación</th>
                <th className="px-4 py-3">Pilar Elegido</th>
                <th className="px-4 py-3">Fecha Respuesta</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                    No hay participantes que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map(p => {
                  const pilarInfo = PILLARS[normalizePillar(p.primaryPillar)];
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-stone-600">
                        {p.code || 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-stone-900">
                        {p.fullName}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {p.confirmationGroup}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          {pilarInfo?.title.split(' ')[0] || p.primaryPillar}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-500 font-mono">
                        {new Date(p.completedAt || p.createdAt).toLocaleDateString('es-BO')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setInspectingParticipant(p)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 font-medium inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Inspección Autorizada de Ficha */}
      {inspectingParticipant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-neutral-300 animate-fadeIn text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500">Ficha Pastoral Autorizada</span>
                <h3 className="text-lg font-serif font-bold text-stone-900">{inspectingParticipant.fullName}</h3>
              </div>
              <button
                onClick={() => setInspectingParticipant(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div><strong>Código:</strong> {inspectingParticipant.code}</div>
              <div><strong>Grupo:</strong> {inspectingParticipant.confirmationGroup}</div>
              <div><strong>Pilar:</strong> {PILLARS[normalizePillar(inspectingParticipant.primaryPillar)]?.title}</div>
              <div><strong>Teléfono:</strong> {inspectingParticipant.phone}</div>
              <div><strong>Disponibilidad:</strong> {inspectingParticipant.availability.join(', ')}</div>
              <div><strong>Estado:</strong> {inspectingParticipant.status}</div>
            </div>

            <div className="space-y-1">
              <strong className="block text-stone-700 uppercase text-[10px]">Motivación Personal:</strong>
              <p className="p-3 bg-stone-50 rounded-xl border italic text-stone-700">
                "{inspectingParticipant.motivation}"
              </p>
            </div>

            {inspectingParticipant.detailedSurveyAnswers && (() => {
              const answers = inspectingParticipant.detailedSurveyAnswers;
              const normPillar = normalizePillar(inspectingParticipant.primaryPillar);
              const pillarConfig = SURVEYS_BY_PILLAR[normPillar];

              // Helper para traducir id de opción a su texto en español
              const resolveLabel = (qId: string, val: string | string[] | undefined) => {
                if (!val) return 'No especificado';
                const allQuestions = [...(pillarConfig?.questions || []), ...COMMON_QUESTIONS];
                const foundQ = allQuestions.find(q => q.id === qId);
                if (!foundQ) return Array.isArray(val) ? val.join(', ') : val;

                if (Array.isArray(val)) {
                  return val.map(v => foundQ.options.find(o => o.id === v)?.label || v).join(', ');
                }
                return foundQ.options.find(o => o.id === val)?.label || val;
              };

              return (
                <div className="space-y-3">
                  <strong className="block text-stone-700 uppercase text-[10px] tracking-wider">
                    Respuestas de la Encuesta:
                  </strong>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {/* Preguntas de la misión seleccionada */}
                    {pillarConfig && pillarConfig.questions.map((q, idx) => {
                      let val: any;
                      if (normPillar === 'casa_comun') {
                        if (idx === 0) val = answers.problemaAmbiental;
                        else if (idx === 1) val = answers.actividadInteresAmbiental;
                        else if (idx === 2) val = answers.aportesAmbiental;
                        else if (idx === 3) val = answers.cuidadoPosterior;
                        else if (idx === 4) val = answers.resultadoEsperadoAmbiental;
                      } else if (normPillar === 'corazones_en_accion') {
                        if (idx === 0) val = answers.realidadHumana;
                        else if (idx === 1) val = answers.tipoServicioHumano;
                        else if (idx === 2) val = answers.aportesHumano;
                        else if (idx === 3) val = answers.prioridadIntervencion;
                        else if (idx === 4) val = answers.resultadoEsperadoHumano;
                      } else if (normPillar === 'transformadores_de_esperanza') {
                        if (idx === 0) val = answers.espacioComunitario;
                        else if (idx === 1) val = answers.accionInteresComunitaria;
                        else if (idx === 2) val = answers.habilidadAporteComunitaria;
                        else if (idx === 3) val = answers.indispensablePrevio;
                        else if (idx === 4) val = answers.criterioEvaluacionComunitaria;
                      }

                      return (
                        <div key={q.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-700 block">
                            {idx + 1}. {q.question}
                          </span>
                          <span className="text-xs text-neutral-900 font-semibold block mt-1">
                            {resolveLabel(q.id, val)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Pregunta 6: Disponibilidad */}
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="text-[11px] font-bold text-stone-700 block">
                        6. Disponibilidad horaria para la jornada:
                      </span>
                      <span className="text-xs text-neutral-900 font-semibold block mt-1">
                        {resolveLabel('comun_horarios', answers.disponibilidadHorarios)}
                      </span>
                    </div>

                    {/* Pregunta 7: Continuidad */}
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="text-[11px] font-bold text-stone-700 block">
                        7. Deseo de continuar en iniciativas de servicio:
                      </span>
                      <span className="text-xs text-neutral-900 font-semibold block mt-1">
                        {resolveLabel('comun_continuidad', answers.continuidadIniciativas)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="text-right pt-3 border-t border-stone-200">
              <button
                onClick={() => setInspectingParticipant(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
