import React, { useState } from 'react';
import { Participant, AccessCode, ConfirmationGroup, PillarId, AdminCorrectionLog } from '../../types';
import { CONFIRMATION_GROUPS, PILLARS, SKILL_LABELS } from '../../config/pillars';
import { storageService } from '../../services/storageService';
import { 
  Search, Key, Plus, Trash2, Eye, ShieldCheck, Phone, X, Edit3, 
  History, AlertCircle, CheckCircle2, Unlock 
} from 'lucide-react';

interface ParticipantsListProps {
  participants: Participant[];
  onParticipantDeleted: (id: string) => void;
  onRefresh: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onParticipantDeleted,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'participants' | 'codes' | 'audit'>('participants');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [inspectingParticipant, setInspectingParticipant] = useState<Participant | null>(null);

  // Modal de corrección administrativa
  const [correctingParticipant, setCorrectingParticipant] = useState<Participant | null>(null);
  const [editPillar, setEditPillar] = useState<PillarId>('casa_comun');
  const [editGroup, setEditGroup] = useState<ConfirmationGroup>('San Francisco de Asís');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [editResponsible, setEditResponsible] = useState<string>('');
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [correctionSuccess, setCorrectionSuccess] = useState<string | null>(null);

  // Códigos state
  const [codes, setCodes] = useState<AccessCode[]>(storageService.getAccessCodes());
  const [codesCountToGen, setCodesCountToGen] = useState<number>(10);

  // Logs de auditoría
  const [auditLogs, setAuditLogs] = useState<AdminCorrectionLog[]>(storageService.getCorrectionLogs());

  // Filtrado de participantes
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = selectedGroup === 'all' || p.confirmationGroup === selectedGroup;
    const matchesPillar = selectedPillar === 'all' || p.primaryPillar === selectedPillar;

    return matchesSearch && matchesGroup && matchesPillar;
  });

  const handleGenerateCodes = () => {
    storageService.generateCodes(codesCountToGen, 'SMP-CONF');
    setCodes(storageService.getAccessCodes());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro de ${name}?`)) {
      storageService.deleteParticipant(id);
      onParticipantDeleted(id);
      setAuditLogs(storageService.getCorrectionLogs());
    }
  };

  const handleOpenCorrection = (p: Participant) => {
    setCorrectingParticipant(p);
    setEditPillar(p.primaryPillar);
    setEditGroup(p.confirmationGroup);
    setEditPhone(p.phone);
    setEditReason('');
    setEditResponsible('');
    setCorrectionError(null);
    setCorrectionSuccess(null);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionError(null);
    setCorrectionSuccess(null);

    if (!correctingParticipant) return;

    if (!editReason.trim()) {
      setCorrectionError('Debes ingresar el motivo justificado de la corrección.');
      return;
    }

    if (!editResponsible.trim()) {
      setCorrectionError('Debes indicar el nombre del catequista o responsable que autoriza.');
      return;
    }

    const updates: Partial<Participant> = {};
    if (editPillar !== correctingParticipant.primaryPillar) updates.primaryPillar = editPillar;
    if (editGroup !== correctingParticipant.confirmationGroup) updates.confirmationGroup = editGroup;
    if (editPhone.trim() !== correctingParticipant.phone) updates.phone = editPhone.trim();

    if (Object.keys(updates).length === 0) {
      setCorrectionError('No has modificado ningún campo.');
      return;
    }

    const res = storageService.applyAdminCorrection(
      correctingParticipant.id,
      updates,
      editReason.trim(),
      editResponsible.trim()
    );

    if (res.success) {
      setCorrectionSuccess(res.message);
      setAuditLogs(storageService.getCorrectionLogs());
      onRefresh();
      setTimeout(() => {
        setCorrectingParticipant(null);
      }, 1200);
    } else {
      setCorrectionError(res.message);
    }
  };

  const handleUnlockCode = (codeStr: string) => {
    const reason = window.prompt(`Motivo para desbloquear el código ${codeStr}:`);
    if (!reason || !reason.trim()) return;
    const resp = window.prompt(`Catequista responsable que autoriza el desbloqueo:`);
    if (!resp || !resp.trim()) return;

    const res = storageService.unlockCode(codeStr, reason.trim(), resp.trim());
    if (res.success) {
      alert(res.message);
      setCodes(storageService.getAccessCodes());
      setAuditLogs(storageService.getCorrectionLogs());
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub-tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'participants'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Padrón de Participantes ({participants.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('codes');
              setCodes(storageService.getAccessCodes());
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'codes'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Códigos de Acceso ({codes.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              setAuditLogs(storageService.getCorrectionLogs());
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-terracotta-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Auditoría de Correcciones ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PARTICIPANTES */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, WhatsApp, código..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
              >
                <option value="all">Todos los grupos de Confirmación</option>
                {CONFIRMATION_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedPillar}
                onChange={e => setSelectedPillar(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-forest-600 focus:outline-none"
              >
                <option value="all">Todos los Pilares</option>
                {(Object.keys(PILLARS) as PillarId[]).map(pId => (
                  <option key={pId} value={pId}>{PILLARS[pId].title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de Participantes */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nombre Completo</th>
                    <th className="px-4 py-3">Grupo Confirmación</th>
                    <th className="px-4 py-3">Pilar Elegido</th>
                    <th className="px-4 py-3">Habilidades</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-stone-500">
                        No se encontraron participantes que coincidan con los filtros.
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map(p => (
                      <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-stone-600">
                          <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                            {p.code || 'CONF-N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-stone-900">{p.fullName}</p>
                          <p className="text-xs text-stone-500">{p.age} años • {p.neighborhood}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-700">
                          <span className="font-medium">{p.confirmationGroup}</span>
                          <span className="block text-[11px] text-stone-500">Animador: {p.catechistName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 border border-forest-200">
                            {PILLARS[p.primaryPillar]?.title.split(' ')[0] || p.primaryPillar}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-600">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {p.skills.slice(0, 2).map(s => (
                              <span key={s} className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px]">
                                {SKILL_LABELS[s]?.label.split(' ')[0] || s}
                              </span>
                            ))}
                            {p.skills.length > 2 && (
                              <span className="text-[10px] text-stone-400">+{p.skills.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-stone-700">
                          {p.phone}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectingParticipant(p)}
                              title="Ver ficha completa"
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-forest-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenCorrection(p)}
                              title="Corrección Administrativa (Catequista)"
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700 hover:text-amber-900 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.fullName)}
                              title="Eliminar participante"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CÓDIGOS DE ACCESO */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          <div className="card bg-cream-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Generador de Códigos de Acceso</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Crea códigos únicos para imprimir o entregar a los catequistas de cada grupo.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={codesCountToGen}
                onChange={e => setCodesCountToGen(parseInt(e.target.value))}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              >
                <option value={5}>5 códigos</option>
                <option value={10}>10 códigos</option>
                <option value={20}>20 códigos</option>
                <option value={50}>50 códigos</option>
              </select>
              <button
                onClick={handleGenerateCodes}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generar Nuevos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {codes.map(c => (
              <div
                key={c.code}
                className={`p-3 rounded-xl border text-center transition-all ${
                  c.used
                    ? 'bg-stone-50 border-stone-200 text-stone-500'
                    : 'bg-white border-forest-300 text-forest-900 shadow-xs'
                }`}
              >
                <div className="font-mono font-bold text-sm">{c.code}</div>
                <div className="mt-1 text-[11px]">
                  {c.used ? (
                    <div className="space-y-1">
                      <span className="text-stone-500 font-medium block truncate">
                        ✓ {c.assignedToName?.split(' ')[0] || 'Usado'}
                      </span>
                      <button
                        onClick={() => handleUnlockCode(c.code)}
                        className="text-[10px] text-terracotta-700 hover:underline flex items-center justify-center gap-1 mx-auto"
                        title="Desbloquear código excepcionalmente"
                      >
                        <Unlock className="w-3 h-3" />
                        <span>Desbloquear</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-emerald-700 font-bold">Disponible</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDITORÍA Y HISTORIAL DE CORRECCIONES */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <History className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-serif text-sm">Registro de Auditoría de Correcciones Administrativas</strong>
              <p className="text-stone-700 mt-0.5 leading-relaxed">
                Todas las modificaciones excepcionales realizadas por los catequistas quedan registradas con la fecha, el participante, el motivo justificado y el responsable.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Fecha y Hora</th>
                    <th className="px-4 py-3">Participante</th>
                    <th className="px-4 py-3">Campo Editado</th>
                    <th className="px-4 py-3">Valor Anterior</th>
                    <th className="px-4 py-3">Nuevo Valor</th>
                    <th className="px-4 py-3">Motivo Registrado</th>
                    <th className="px-4 py-3">Responsable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-stone-500">
                        No hay registros de corrección administrativa en el sistema.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-cream-50/60">
                        <td className="px-4 py-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('es-BO')}
                        </td>
                        <td className="px-4 py-3 font-semibold text-stone-900 whitespace-nowrap">
                          {log.participantName}
                        </td>
                        <td className="px-4 py-3 font-mono text-stone-700">
                          <span className="px-2 py-0.5 rounded bg-stone-100 font-bold">
                            {log.field}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-600 max-w-[150px] truncate" title={log.oldValue}>
                          {log.oldValue}
                        </td>
                        <td className="px-4 py-3 text-forest-800 font-semibold max-w-[150px] truncate" title={log.newValue}>
                          {log.newValue}
                        </td>
                        <td className="px-4 py-3 text-stone-700 italic max-w-[200px]" title={log.reason}>
                          "{log.reason}"
                        </td>
                        <td className="px-4 py-3 font-medium text-stone-800 whitespace-nowrap">
                          {log.responsible}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE PARTICIPANTE */}
      {inspectingParticipant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs uppercase font-bold text-stone-500">Ficha de Respuestas</span>
                <h3 className="text-xl font-serif font-bold text-stone-900">{inspectingParticipant.fullName}</h3>
              </div>
              <button
                onClick={() => setInspectingParticipant(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><strong>Código:</strong> {inspectingParticipant.code || 'N/A'}</div>
              <div><strong>Edad / Género:</strong> {inspectingParticipant.age} años • {inspectingParticipant.gender}</div>
              <div><strong>Teléfono:</strong> {inspectingParticipant.phone}</div>
              <div><strong>Grupo:</strong> {inspectingParticipant.confirmationGroup}</div>
              <div><strong>Catequista:</strong> {inspectingParticipant.catechistName}</div>
              <div><strong>Barrio:</strong> {inspectingParticipant.neighborhood}</div>
              <div><strong>Pilar:</strong> {PILLARS[inspectingParticipant.primaryPillar]?.title}</div>
              <div><strong>Identificador Envío:</strong> <span className="font-mono text-[10px]">{inspectingParticipant.submissionId || inspectingParticipant.id}</span></div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Motivación Declarada</h4>
              <p className="text-xs italic text-stone-700 bg-cream-50 p-3 rounded-xl border border-cream-200">
                "{inspectingParticipant.motivation}"
              </p>
            </div>

            <div className="text-right pt-4 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  const target = inspectingParticipant;
                  setInspectingParticipant(null);
                  handleOpenCorrection(target);
                }}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar (Catequista)</span>
              </button>
              <button
                onClick={() => setInspectingParticipant(null)}
                className="btn-secondary text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CORRECCIÓN ADMINISTRATIVA PARA CATEQUISTAS */}
      {correctingParticipant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-forest-300 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Corrección Administrativa
                  </h3>
                  <p className="text-xs text-stone-500">
                    {correctingParticipant.fullName} (Código: {correctingParticipant.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCorrectingParticipant(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
              {correctionError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{correctionError}</span>
                </div>
              )}

              {correctionSuccess && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{correctionSuccess}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 block mb-1">Pilar Principal Asignado:</label>
                <select
                  value={editPillar}
                  onChange={e => setEditPillar(e.target.value as PillarId)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  <option value="casa_comun">Pilar 1: Casa Común</option>
                  <option value="corazones_en_accion">Pilar 2: Corazones en Acción</option>
                  <option value="transformadores_de_esperanza">Pilar 3: Transformadores de Esperanza</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Grupo de Confirmación:</label>
                <select
                  value={editGroup}
                  onChange={e => setEditGroup(e.target.value as ConfirmationGroup)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  {CONFIRMATION_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Teléfono / WhatsApp:</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Motivo de la Corrección *
                  </label>
                  <textarea
                    rows={2}
                    value={editReason}
                    onChange={e => setEditReason(e.target.value)}
                    placeholder="Ej: El joven solicitó cambio de pilar por incompatibilidad de horario con su catequista..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Catequista o Responsable que autoriza *
                  </label>
                  <input
                    type="text"
                    value={editResponsible}
                    onChange={e => setEditResponsible(e.target.value)}
                    placeholder="Ej: Hno. Carlos Méndez / Coordinación"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setCorrectingParticipant(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-bold"
                >
                  Guardar y Auditar Corrección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
