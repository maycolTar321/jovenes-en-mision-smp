import React from 'react';
import { Participant, SkillCategory } from '../../types';
import { SKILL_LABELS, PILLARS } from '../../config/pillars';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SkillsAnalysisProps {
  participants: Participant[];
}

export const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({ participants }) => {
  // Conteo total de cada habilidad
  const skillTotals: Record<string, number> = {};
  Object.keys(SKILL_LABELS).forEach(key => {
    skillTotals[key] = 0;
  });

  participants.forEach(p => {
    p.skills.forEach(s => {
      skillTotals[s] = (skillTotals[s] || 0) + 1;
    });
  });

  const chartData = Object.entries(skillTotals).map(([key, count]) => ({
    habilidad: SKILL_LABELS[key]?.label.split(' ')[0] || key,
    fullName: SKILL_LABELS[key]?.label || key,
    cantidad: count,
  })).sort((a, b) => b.cantidad - a.cantidad);

  // Cruce de habilidades por pilar
  const crossPillarData = (['ninez', 'adultos_mayores', 'ecologia'] as const).map(pillarId => {
    const list = participants.filter(p => p.primaryPillar === pillarId);
    return {
      pillarName: PILLARS[pillarId].title.split(' ')[0],
      total: list.length,
      animacion: list.filter(p => p.skills.includes('animacion')).length,
      logistica: list.filter(p => p.skills.includes('logistica')).length,
      salud: list.filter(p => p.skills.includes('salud')).length,
      arte_musica: list.filter(p => p.skills.includes('arte_musica')).length,
      trabajo_manual: list.filter(p => p.skills.includes('trabajo_manual')).length,
      escucha: list.filter(p => p.skills.includes('escucha')).length,
    };
  });

  // Detección de posibles brechas
  const hasLogistics = skillTotals['logistica'] >= 3;
  const hasHealth = skillTotals['salud'] >= 2;
  const hasAnimation = skillTotals['animacion'] >= 3;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-soft">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
          Módulo G • Diagnóstico de Capacidades
        </span>
        <h2 className="text-2xl font-serif font-bold text-forest-950 mt-2">
          Análisis de Habilidades y Carismas Pastorales
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Evaluación de destrezas disponibles para asegurar que cada equipo cuente con apoyo logístico, humano y técnico.
        </p>
      </div>

      {/* Gráfico de Barras de Habilidades */}
      <div className="card">
        <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
          Frecuencia de Habilidades Declaradas
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Cantidad de jóvenes que cuentan con talentos en cada una de las 8 categorías analizadas.
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} fontSize={11} />
              <YAxis dataKey="habilidad" type="category" fontSize={11} width={90} />
              <Tooltip formatter={(value: any, name: any, item: any) => [`${value} jóvenes`, item.payload.fullName]} />
              <Bar dataKey="cantidad" fill="#2D5746" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Matriz de Cobertura por Pilar */}
      <div className="card">
        <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
          Distribución de Habilidades Clave por Pilar
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Asegurando que cada pilar tenga los perfiles necesarios para su misión específica en Tarija.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
              <tr>
                <th className="p-3">Pilar</th>
                <th className="p-3 text-center">Jóvenes</th>
                <th className="p-3 text-center">Animación</th>
                <th className="p-3 text-center">Logística</th>
                <th className="p-3 text-center">Salud / Auxilios</th>
                <th className="p-3 text-center">Música / Arte</th>
                <th className="p-3 text-center">Trabajo Manual</th>
                <th className="p-3 text-center">Escucha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {crossPillarData.map(d => (
                <tr key={d.pillarName} className="hover:bg-cream-50">
                  <td className="p-3 font-bold text-stone-900">{d.pillarName}</td>
                  <td className="p-3 text-center font-bold text-forest-800">{d.total}</td>
                  <td className="p-3 text-center">{d.animacion}</td>
                  <td className="p-3 text-center">{d.logistica}</td>
                  <td className="p-3 text-center">{d.salud}</td>
                  <td className="p-3 text-center">{d.arte_musica}</td>
                  <td className="p-3 text-center">{d.trabajo_manual}</td>
                  <td className="p-3 text-center">{d.escucha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observaciones y Sugerencias Pastorales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${hasLogistics ? 'bg-forest-50 border-forest-200 text-forest-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {hasLogistics ? <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
          <div>
            <h4 className="font-bold text-xs">Capacidad Logística</h4>
            <p className="text-[11px] mt-0.5">
              {hasLogistics ? 'Contamos con suficiente perfil organizativo y vehículos para el traslado de víveres y herramientas.' : 'Se recomienda reforzar la coordinación de compras y tiempos.'}
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 ${hasHealth ? 'bg-forest-50 border-forest-200 text-forest-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {hasHealth ? <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
          <div>
            <h4 className="font-bold text-xs">Primeros Auxilios</h4>
            <p className="text-[11px] mt-0.5">
              {hasHealth ? 'Hay participantes con conocimientos básicos en salud y cuidado.' : 'Incluir un botiquín con un catequista responsable en cada cuadrilla.'}
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 ${hasAnimation ? 'bg-forest-50 border-forest-200 text-forest-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {hasAnimation ? <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
          <div>
            <h4 className="font-bold text-xs">Animación y Música</h4>
            <p className="text-[11px] mt-0.5">
              {hasAnimation ? 'Excelente disponibilidad para cantos, serenatas y juegos de integración.' : 'Coordinar con el coro parroquial para sumar instrumentos.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
