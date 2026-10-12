import React, { useState } from 'react';
import { Participant, MixedTeam, PillarId } from '../../types';
import { PILLARS, SKILL_LABELS } from '../../config/pillars';
import { teamBalancerService, BalancingOptions } from '../../services/teamBalancerService';
import { storageService } from '../../services/storageService';
import { 
  Users, Wand2, Shield, Star, MapPin, Clock, CheckCircle2, Shuffle, 
  Save, AlertCircle, ArrowRightLeft, Info, Check, UserCheck 
} from 'lucide-react';

interface TeamFormationProps {
  participants: Participant[];
  teams: MixedTeam[];
  onTeamsUpdated: (teams: MixedTeam[]) => void;
}

export const TeamFormation: React.FC<TeamFormationProps> = ({
  participants,
  teams,
  onTeamsUpdated
}) => {
  const [options, setOptions] = useState<BalancingOptions>({
    targetTeamSize: 6,
    balanceGender: true,
    mixGroups: true,
    distributeKeySkills: true,
    respectAvailability: true
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (participants.length === 0) {
      alert('No hay participantes registrados para formar equipos.');
      return;
    }

    const generated = teamBalancerService.generateTeams(participants, options);
    onTeamsUpdated(generated);
    setIsModified(true);
    setNotification({
      type: 'info',
      text: `Sugerencia generada: ${generated.length} equipos mixtos propuestos. Puedes revisar las razones de asignación y modificar miembros antes de confirmar.`
    });
  };

  const handleConfirmAndSave = () => {
    storageService.saveTeams(teams);
    setIsModified(false);
    setNotification({
      type: 'success',
      text: '¡Distribución de equipos confirmada y guardada exitosamente en el sistema!'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Mover manualmente un miembro a otro equipo
  const handleMoveMember = (memberId: string, currentTeamId: string, targetTeamId: string) => {
    if (currentTeamId === targetTeamId) return;

    const updated = teams.map(t => {
      if (t.id === currentTeamId) {
        return {
          ...t,
          memberIds: t.memberIds.filter(id => id !== memberId),
          leaderParticipantId: t.leaderParticipantId === memberId ? undefined : t.leaderParticipantId,
          coLeaderParticipantId: t.coLeaderParticipantId === memberId ? undefined : t.coLeaderParticipantId
        };
      }
      if (t.id === targetTeamId) {
        const targetMemberReasons = { ...(t.memberReasons || {}) };
        targetMemberReasons[memberId] = '[REASIGNACIÓN MANUAL POR CATEQUISTA] Ajuste de cuadrilla';
        return {
          ...t,
          memberIds: [...t.memberIds, memberId],
          memberReasons: targetMemberReasons
        };
      }
      return t;
    });

    onTeamsUpdated(updated);
    setIsModified(true);
  };

  const getParticipant = (id: string) => participants.find(p => p.id === id);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
            Módulo H • Propuesta de Equipos Mixtos
          </span>
          <h2 className="text-2xl font-serif font-bold text-forest-950 mt-2">
            Organización Sinodal y Formación de Cuadrillas
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
            Las propuestas integran a jóvenes de diferentes grupos de Confirmación evitando grupos cerrados, balanceando talentos y considerando horarios disponibles.
          </p>
        </div>

        {/* Algorithm options & action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border text-xs">
            <span className="text-stone-600 font-medium">Tamaño por equipo:</span>
            <select
              value={options.targetTeamSize}
              onChange={e => setOptions({ ...options, targetTeamSize: parseInt(e.target.value) })}
              className="bg-white border rounded px-2.5 py-1 font-bold text-stone-800"
            >
              <option value={4}>4 jóvenes</option>
              <option value={5}>5 jóvenes</option>
              <option value={6}>6 jóvenes</option>
              <option value={8}>8 jóvenes</option>
              <option value={10}>10 jóvenes</option>
              <option value={12}>12 jóvenes</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            className="btn-gold py-2.5 px-5 rounded-xl font-bold text-forest-950 flex items-center gap-2 shadow hover:scale-[1.02] text-xs"
          >
            <Wand2 className="w-4 h-4" />
            <span>{teams.length > 0 ? 'Generar Nueva Propuesta' : 'Sugerir Equipos Mixtos'}</span>
          </button>

          {teams.length > 0 && isModified && (
            <button
              onClick={handleConfirmAndSave}
              className="btn-primary py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 text-xs shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Confirmar y Guardar Distribución</span>
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 animate-fadeIn ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          )}
          <div>
            <strong>{notification.text}</strong>
            {isModified && (
              <p className="text-xs text-stone-600 mt-0.5">
                Recuerda pulsar "Confirmar y Guardar Distribución" cuando estés satisfecho con las cuadrillas.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Nota metodológica */}
      <div className="bg-forest-50/70 p-4 rounded-2xl border border-forest-200 text-xs text-forest-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
        <span>
          <strong>Criterio de sugerencia:</strong> Las cuadrillas equilibran procedencias (Parroquia, San Francisco, Santa Teresa, Juan Pablo II, etc.), edad, talentos prácticos y disponibilidad horaria. Los catequistas tienen la autoridad final de ajustar miembros mediante el selector de cada tarjeta.
        </span>
      </div>

      {/* List of Teams */}
      {teams.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 text-forest-800 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900">Aún no se ha sugerido una distribución de equipos</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-6">
            Haz clic en "Sugerir Equipos Mixtos" para procesar a los {participants.length} jóvenes inscritos y ver las justificaciones por cada cuadrilla.
          </p>
          <button onClick={handleGenerate} className="btn-primary">
            <Wand2 className="w-4 h-4 mr-2" />
            Sugerir Equipos Mixtos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => {
            const pillar = PILLARS[team.pillarId] || PILLARS.casa_comun;
            const leader = getParticipant(team.leaderParticipantId || '');
            const coLeader = getParticipant(team.coLeaderParticipantId || '');
            const members = team.memberIds.map(id => getParticipant(id)).filter(Boolean) as Participant[];

            // Diversidad de grupos presentes en el equipo
            const groupsInTeam = Array.from(new Set(members.map(m => m.confirmationGroup)));

            return (
              <div
                key={team.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden flex flex-col justify-between transition-all"
              >
                {/* Header del equipo */}
                <div className={`p-4 text-white ${
                  team.pillarId === 'corazones_en_accion' ? 'bg-terracotta-700' :
                  team.pillarId === 'transformadores_de_esperanza' ? 'bg-amber-700' :
                  'bg-forest-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-2.5 py-0.5 rounded-full">
                      {pillar?.title.split(' ')[0]}
                    </span>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                      {members.length} jóvenes ({groupsInTeam.length} grupos)
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mt-2">{team.name}</h3>
                  <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{team.targetLocation}</span>
                  </p>
                </div>

                {/* Líder y Colíder */}
                <div className="p-3 bg-cream-100/60 border-b border-cream-200 text-xs space-y-1">
                  {leader && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-forest-900">
                        <Star className="w-3.5 h-3.5 text-gold-600 fill-gold-500" /> Líder:
                      </span>
                      <span className="font-medium text-stone-800 truncate max-w-[180px]">{leader.fullName}</span>
                    </div>
                  )}
                  {coLeader && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <Shield className="w-3.5 h-3.5 text-stone-500" /> Colíder:
                      </span>
                      <span className="font-medium text-stone-800 truncate max-w-[180px]">{coLeader.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Lista de Miembros con Justificación Individual */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Integrantes y Justificación de Asignación:
                  </span>

                  {members.map(member => {
                    const reason = team.memberReasons?.[member.id] || 'Asignación por compatibilidad';
                    const isLead = member.id === team.leaderParticipantId;
                    const isCoLead = member.id === team.coLeaderParticipantId;

                    return (
                      <div key={member.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 truncate">
                            {member.fullName}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {member.code}
                          </span>
                        </div>

                        {/* Razón de la asignación */}
                        <p className="text-[11px] text-stone-600 italic leading-snug">
                          {reason}
                        </p>

                        {/* Reasignar a otro equipo */}
                        <div className="pt-1 flex items-center justify-between gap-1 text-[10px] text-stone-500 border-t border-stone-100">
                          <span className="flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" /> Reubicar:
                          </span>
                          <select
                            value={team.id}
                            onChange={e => handleMoveMember(member.id, team.id, e.target.value)}
                            className="bg-white border rounded px-1.5 py-0.5 text-[10px] font-medium text-stone-700"
                          >
                            <option value={team.id}>Este equipo ({team.name.split(' ')[1] || team.name})</option>
                            {teams.filter(t => t.id !== team.id).map(t => (
                              <option key={t.id} value={t.id}>
                                Mover a {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pie del equipo */}
                <div className="p-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-600 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" /> Sábado 08:30
                  </span>
                  <span className="text-forest-800 font-bold">
                    {groupsInTeam.length} grupos mixtos
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
