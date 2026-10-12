import React, { useState } from 'react';
import { SocialProjectTracking } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  ClipboardList, CheckCircle2, Circle, Plus, Trash2, Save, Calendar, DollarSign, BookOpen, Heart, Eye 
} from 'lucide-react';

interface ProjectTrackerProps {
  project: SocialProjectTracking;
  onProjectUpdated: (project: SocialProjectTracking) => void;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({
  project,
  onProjectUpdated
}) => {
  const [data, setData] = useState<SocialProjectTracking>(project);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Nuevo hito
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>('');
  const [newMilestoneDate, setNewMilestoneDate] = useState<string>('');
  const [newMilestoneTeam, setNewMilestoneTeam] = useState<string>('Equipo Coordinador');

  // Nuevo item de presupuesto
  const [newBudgetCategory, setNewBudgetCategory] = useState<string>('Insumos');
  const [newBudgetDesc, setNewBudgetDesc] = useState<string>('');
  const [newBudgetCost, setNewBudgetCost] = useState<number>(100);

  const toggleMilestone = (id: string) => {
    const updated = {
      ...data,
      actionMilestones: data.actionMilestones.map(m => 
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    };
    setData(updated);
    storageService.saveProjectTracking(updated);
    onProjectUpdated(updated);
  };

  const addMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const updated = {
      ...data,
      actionMilestones: [
        ...data.actionMilestones,
        {
          id: `m-${Date.now()}`,
          title: newMilestoneTitle.trim(),
          date: newMilestoneDate || new Date().toISOString().split('T')[0],
          responsibleTeam: newMilestoneTeam.trim(),
          completed: false
        }
      ]
    };
    setData(updated);
    storageService.saveProjectTracking(updated);
    onProjectUpdated(updated);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const removeMilestone = (id: string) => {
    const updated = {
      ...data,
      actionMilestones: data.actionMilestones.filter(m => m.id !== id)
    };
    setData(updated);
    storageService.saveProjectTracking(updated);
    onProjectUpdated(updated);
  };

  const addBudgetItem = () => {
    if (!newBudgetDesc.trim()) return;
    const updated = {
      ...data,
      budgetItems: [
        ...data.budgetItems,
        {
          id: `b-${Date.now()}`,
          category: newBudgetCategory,
          description: newBudgetDesc.trim(),
          estimatedCostBob: Number(newBudgetCost),
          isCoveredByDonation: false
        }
      ]
    };
    setData(updated);
    storageService.saveProjectTracking(updated);
    onProjectUpdated(updated);
    setNewBudgetDesc('');
  };

  const toggleBudgetItemDonation = (id: string) => {
    const updated = {
      ...data,
      budgetItems: data.budgetItems.map(b => 
        b.id === id ? { ...b, isCoveredByDonation: !b.isCoveredByDonation } : b
      )
    };
    setData(updated);
    storageService.saveProjectTracking(updated);
    onProjectUpdated(updated);
  };

  const removeBudgetItem = (id: string) => {
    const updated = {
      ...data,
      budgetItems: data.budgetItems.filter(b => b.id !== id)
    };
    setData(updated);
    storageService.saveProjectTracking(updated);
    onProjectUpdated(updated);
  };

  const handleSaveTextChanges = () => {
    storageService.saveProjectTracking(data);
    onProjectUpdated(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const totalBudget = data.budgetItems.reduce((acc, curr) => acc + curr.estimatedCostBob, 0);
  const coveredBudget = data.budgetItems.filter(b => b.isCoveredByDonation).reduce((acc, curr) => acc + curr.estimatedCostBob, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
            Módulo I • Ficha Técnica y Pastoral
          </span>
          <h2 className="text-2xl font-serif font-bold text-forest-950 mt-2">
            Registro y Seguimiento del Proyecto Social
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Estructurado bajo la pedagogía eclesial latinoamericana: Ver, Juzgar, Actuar, Evaluar y Celebrar.
          </p>
        </div>

        <button
          onClick={handleSaveTextChanges}
          className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? '¡Guardado!' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {/* 1. VER & 2. JUZGAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. VER */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-forest-800">
            <Eye className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif font-bold text-base">1. VER — Diagnóstico y Realidad</h3>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Diagnóstico del Contexto en Tarija:
            </label>
            <textarea
              rows={4}
              value={data.contextDiagnosis}
              onChange={e => setData({ ...data, contextDiagnosis: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Población Beneficiaria:
              </label>
              <input
                type="text"
                value={data.targetBeneficiaries}
                onChange={e => setData({ ...data, targetBeneficiaries: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Estimado Beneficiarios:
              </label>
              <input
                type="number"
                value={data.estimatedBeneficiariesCount}
                onChange={e => setData({ ...data, estimatedBeneficiariesCount: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* 2. JUZGAR */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-terracotta-700">
            <BookOpen className="w-5 h-5 text-terracotta-600" />
            <h3 className="font-serif font-bold text-base">2. JUZGAR — Iluminación Doctrinal</h3>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Citas Bíblicas Inspiradoras:
            </label>
            <textarea
              rows={3}
              value={data.biblicalInspiration}
              onChange={e => setData({ ...data, biblicalInspiration: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Línea Pastoral y Magisterio:
            </label>
            <input
              type="text"
              value={data.pastoralLine}
              onChange={e => setData({ ...data, pastoralLine: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800"
            />
          </div>
        </div>
      </div>

      {/* 3. ACTUAR: Cronograma de Hitos */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-forest-800">
            <Calendar className="w-5 h-5 text-forest-700" />
            <h3 className="font-serif font-bold text-base">3. ACTUAR — Cronograma de Hitos y Tareas</h3>
          </div>
          <span className="text-xs text-stone-500">
            {data.actionMilestones.filter(m => m.completed).length} de {data.actionMilestones.length} completados
          </span>
        </div>

        {/* Lista de hitos */}
        <div className="space-y-2.5">
          {data.actionMilestones.map(m => (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                m.completed ? 'bg-forest-50/70 border-forest-200' : 'bg-white border-stone-200'
              }`}
            >
              <div 
                onClick={() => toggleMilestone(m.id)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                {m.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-400 shrink-0" />
                )}
                <div>
                  <p className={`text-xs font-semibold ${m.completed ? 'text-forest-900 line-through' : 'text-stone-900'}`}>
                    {m.title}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Fecha: {m.date} • Resp: {m.responsibleTeam}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeMilestone(m.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Agregar hito */}
        <div className="p-4 bg-cream-100/70 rounded-2xl border border-cream-300 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
          <input
            type="text"
            placeholder="Nuevo hito o tarea..."
            value={newMilestoneTitle}
            onChange={e => setNewMilestoneTitle(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
          <input
            type="date"
            value={newMilestoneDate}
            onChange={e => setNewMilestoneDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
          <button
            onClick={addMilestone}
            className="btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Hito</span>
          </button>
        </div>
      </div>

      {/* 4. PRESUPUESTO EN BOLIVIANOS */}
      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-900">
            <DollarSign className="w-5 h-5 text-gold-600" />
            <h3 className="font-serif font-bold text-base">Presupuesto Estimado de la Obra Social (Bs.)</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-stone-900">Total: {totalBudget} Bs.</span>
            <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-semibold">
              Cubierto: {coveredBudget} Bs.
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
              <tr>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descripción de Insumos</th>
                <th className="p-3 text-right">Costo (Bs.)</th>
                <th className="p-3 text-center">Financiamiento</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.budgetItems.map(item => (
                <tr key={item.id} className="hover:bg-cream-50">
                  <td className="p-3 font-semibold text-stone-800">{item.category}</td>
                  <td className="p-3 text-stone-600">{item.description}</td>
                  <td className="p-3 text-right font-bold text-stone-900">{item.estimatedCostBob} Bs.</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleBudgetItemDonation(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.isCoveredByDonation
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.isCoveredByDonation ? 'Cubierto / Donación' : 'Por Financiar'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeBudgetItem(item.id)}
                      className="p-1 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agregar item de presupuesto */}
        <div className="p-4 bg-cream-100/70 rounded-2xl border border-cream-300 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
          <input
            type="text"
            placeholder="Categoría..."
            value={newBudgetCategory}
            onChange={e => setNewBudgetCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
          <input
            type="text"
            placeholder="Descripción del gasto o insumo..."
            value={newBudgetDesc}
            onChange={e => setNewBudgetDesc(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
          <input
            type="number"
            placeholder="Costo en Bs."
            value={newBudgetCost}
            onChange={e => setNewBudgetCost(parseInt(e.target.value) || 0)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
          />
          <button
            onClick={addBudgetItem}
            className="btn-gold text-xs py-2 px-3 flex items-center justify-center gap-1 font-bold text-stone-900"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Rubro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
