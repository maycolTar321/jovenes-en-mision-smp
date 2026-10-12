import { Participant, MixedTeam, PillarId } from '../types';
import { PILLARS, SKILL_LABELS } from '../config/pillars';

export interface BalancingOptions {
  targetTeamSize: number; // Configurable: 4 a 12 jóvenes
  balanceGender: boolean;
  mixGroups: boolean;
  distributeKeySkills: boolean;
  respectAvailability?: boolean;
}

export const teamBalancerService = {
  /**
   * Genera propuestas de equipos mixtos equilibrados basados en:
   * 1. Pilar principal y afinidad secundaria (únicamente si existe y fue registrada)
   * 2. Habilidades y talentos complementarios
   * 3. Disponibilidad horaria compatible
   * 4. Equilibrio intergrupal (integración de diferentes grupos de confirmación)
   * 5. Justificación detallada de cada asignación
   */
  generateTeams(
    participants: Participant[],
    options: BalancingOptions = {
      targetTeamSize: 6,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true,
      respectAvailability: true
    }
  ): MixedTeam[] {
    const teams: MixedTeam[] = [];
    if (!participants || participants.length === 0) return teams;

    // Obtener los pilares únicos presentes en los participantes registrados
    const uniquePillars = Array.from(new Set(participants.map(p => p.primaryPillar))) as PillarId[];

    uniquePillars.forEach(pillarId => {
      const pool = participants.filter(p => p.primaryPillar === pillarId);
      if (pool.length === 0) return;

      const numTeamsForPillar = Math.max(1, Math.round(pool.length / options.targetTeamSize));
      const pillarInfo = PILLARS[pillarId] || PILLARS.casa_comun;

      const pillarTeams: {
        team: MixedTeam;
        members: Participant[];
        reasons: Record<string, string>;
      }[] = [];

      for (let i = 1; i <= numTeamsForPillar; i++) {
        const teamName = `Cuadrilla ${pillarInfo.title.split(' ')[0]} ${i}`;
        pillarTeams.push({
          team: {
            id: `team-${pillarId}-${i}-${Date.now().toString(36)}`,
            name: teamName,
            pillarId,
            memberIds: [],
            targetLocation: pillarInfo.targetLocation || 'Parroquia San Martín de Porres - Tarija',
            specificMission: `Misión en ${pillarInfo.targetLocation || 'Tarija'} — ${pillarInfo.subtitle || pillarInfo.title}`,
            meetingTime: 'Sábado 08:30 AM — Parroquia San Martín de Porres',
            memberReasons: {}
          },
          members: [],
          reasons: {}
        });
      }

      // Ordenar candidatos por liderazgo y habilidades operativas
      const sortedPool = [...pool].sort((a, b) => {
        const score = (p: Participant) => {
          let s = 0;
          if (p.skills.includes('logistica')) s += 4;
          if (p.skills.includes('animacion')) s += 3;
          if (p.skills.includes('salud')) s += 3;
          if (p.skills.includes('trabajo_manual')) s += 2;
          if (p.skills.includes('arte_musica')) s += 2;
          if (p.previousServiceExperience) s += 2;
          return s;
        };
        return score(b) - score(a);
      });

      // Distribuir considerando tamaño, grupo de confirmación, género y habilidades
      sortedPool.forEach(person => {
        let bestTeamIndex = 0;
        let minPenalty = Infinity;

        pillarTeams.forEach((pt, index) => {
          let penalty = pt.members.length * 15; // Mantener tamaños equilibrados

          if (options.mixGroups) {
            const sameGroupCount = pt.members.filter(m => m.confirmationGroup === person.confirmationGroup).length;
            penalty += sameGroupCount * 20; // Fomentar mezcla de capillas
          }

          if (options.balanceGender) {
            const sameGenderCount = pt.members.filter(m => m.gender === person.gender).length;
            penalty += sameGenderCount * 8;
          }

          if (options.distributeKeySkills) {
            person.skills.forEach(skill => {
              const alreadyHasSkill = pt.members.some(m => m.skills.includes(skill));
              if (alreadyHasSkill) {
                penalty += 3;
              } else {
                penalty -= 8; // Bonificación por aportar talento no presente en el equipo
              }
            });
          }

          if (options.respectAvailability && person.availability && person.availability.length > 0) {
            const hasCommonAvailability = pt.members.length === 0 || pt.members.some(m => 
              m.availability.some(av => person.availability.includes(av))
            );
            if (!hasCommonAvailability) {
              penalty += 12;
            }
          }

          if (penalty < minPenalty) {
            minPenalty = penalty;
            bestTeamIndex = index;
          }
        });

        const assignedTeam = pillarTeams[bestTeamIndex];
        assignedTeam.members.push(person);

        // Generar justificación visible de la sugerencia (Prompt 6 Requisito 5)
        const skillNames = person.skills.map(s => SKILL_LABELS[s]?.label.split(' ')[0] || s).join(', ') || 'Colaboración general';
        const hasSecondary = person.secondaryPillar && person.secondaryPillar !== person.primaryPillar;
        const secondaryNote = hasSecondary ? ` • Interés 2do: ${PILLARS[person.secondaryPillar]?.title.split(' ')[0] || person.secondaryPillar}` : '';
        const groupNote = `Grupo: ${person.confirmationGroup.replace('San ', 'S. ').replace('Santa ', 'Sta. ')}`;

        assignedTeam.reasons[person.id] = `Preferencia 1ra: ${pillarInfo.title.split(' ')[0]} • ${groupNote} • Dones: ${skillNames}${secondaryNote}`;
      });

      // Identificar y asignar líderes y colíderes
      pillarTeams.forEach(pt => {
        pt.team.memberIds = pt.members.map(m => m.id);
        pt.team.memberReasons = pt.reasons;

        if (pt.members.length > 0) {
          const leaderCandidate = [...pt.members].sort((a, b) => {
            const aScore = (a.skills.includes('logistica') ? 3 : 0) + (a.previousServiceExperience ? 2 : 0) + (a.age >= 17 ? 1 : 0);
            const bScore = (b.skills.includes('logistica') ? 3 : 0) + (b.previousServiceExperience ? 2 : 0) + (b.age >= 17 ? 1 : 0);
            return bScore - aScore;
          })[0];

          pt.team.leaderParticipantId = leaderCandidate.id;

          const coLeaderCandidate = pt.members.find(
            m => m.id !== leaderCandidate.id && m.confirmationGroup !== leaderCandidate.confirmationGroup
          ) || pt.members.find(m => m.id !== leaderCandidate.id);

          if (coLeaderCandidate) {
            pt.team.coLeaderParticipantId = coLeaderCandidate.id;
          }

          // Anotar rol en la justificación
          if (leaderCandidate) {
            pt.team.memberReasons[leaderCandidate.id] = `[LÍDER SUGERIDO] ${pt.team.memberReasons[leaderCandidate.id]}`;
          }
          if (coLeaderCandidate) {
            pt.team.memberReasons[coLeaderCandidate.id] = `[COLÍDER SUGERIDO] ${pt.team.memberReasons[coLeaderCandidate.id]}`;
          }

          teams.push(pt.team);
        }
      });
    });

    return teams;
  }
};
