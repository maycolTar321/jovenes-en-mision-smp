import { describe, it, expect } from 'vitest';
import { teamBalancerService } from '../teamBalancerService';
import { Participant } from '../../types';

describe('Prompt 6 — Dashboard Metrics & Team Formation Balancing', () => {
  const sampleParticipants: Participant[] = [
    {
      id: 'p-1',
      code: 'CONF-01',
      createdAt: '2026-10-10',
      fullName: 'Carlos Fernando Méndez',
      age: 18,
      gender: 'masculino',
      phone: '+591 71000001',
      neighborhood: 'Barrio San Martín',
      confirmationGroup: 'San Francisco de Asís',
      catechistName: 'Equipo 1',
      availability: ['sabado_manana'],
      transport: 'vehiculo_propio',
      skills: ['logistica', 'trabajo_manual'],
      primaryTalentDescription: 'Manejo de camioneta',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'corazones_en_accion',
      pillarSpecific: {},
      motivation: 'Cuidar la creación',
      previousServiceExperience: true,
      status: 'completada'
    },
    {
      id: 'p-2',
      code: 'CONF-02',
      createdAt: '2026-10-10',
      fullName: 'Lucía Morales',
      age: 16,
      gender: 'femenino',
      phone: '+591 71000002',
      neighborhood: 'Barrio Senac',
      confirmationGroup: 'Santa Teresa de Calcuta',
      catechistName: 'Equipo 2',
      availability: ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['animacion'],
      primaryTalentDescription: 'Canto y dinámicas',
      primaryPillar: 'casa_comun',
      pillarSpecific: {},
      secondaryPillar: 'casa_comun', // Mismo pilar (sin interés secundario distinto)
      motivation: 'Ayudar con alegría',
      previousServiceExperience: false,
      status: 'completada'
    },
    {
      id: 'p-3',
      code: 'CONF-03',
      createdAt: '2026-10-10',
      fullName: 'Juan Ignacio Rueda',
      age: 17,
      gender: 'masculino',
      phone: '+591 71000003',
      neighborhood: 'Barrio Juan XXIII',
      confirmationGroup: 'San Juan Pablo II',
      catechistName: 'Equipo 3',
      availability: ['sabado_manana'],
      transport: 'bicicleta',
      skills: ['salud'],
      primaryTalentDescription: 'Primeros auxilios',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'casa_comun',
      pillarSpecific: {},
      motivation: 'Botiquín y servicio',
      previousServiceExperience: false,
      status: 'completada'
    },
    {
      id: 'p-4',
      code: 'CONF-04',
      createdAt: '2026-10-10',
      fullName: 'Mariana Gallardo',
      age: 17,
      gender: 'femenino',
      phone: '+591 71000004',
      neighborhood: 'Barrio Central',
      confirmationGroup: 'Beata Chiara Badano',
      catechistName: 'Equipo 4',
      availability: ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['comunicacion', 'arte_musica'],
      primaryTalentDescription: 'Fotografía',
      primaryPillar: 'casa_comun',
      secondaryPillar: 'transformadores_de_esperanza',
      pillarSpecific: {},
      motivation: 'Registrar la misión',
      previousServiceExperience: true,
      status: 'completada'
    }
  ];

  it('1. Genera cuadrillas mixtas respetando el tamaño objetivo y asignando líderes', () => {
    const teams = teamBalancerService.generateTeams(sampleParticipants, {
      targetTeamSize: 4,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true
    });

    expect(teams.length).toBe(1);
    expect(teams[0].pillarId).toBe('casa_comun');
    expect(teams[0].memberIds.length).toBe(4);
    expect(teams[0].leaderParticipantId).toBe('p-1'); // Carlos tiene logística y experiencia
  });

  it('2. Incluye justificación visible y explicativa por cada miembro sugerido', () => {
    const teams = teamBalancerService.generateTeams(sampleParticipants, {
      targetTeamSize: 4,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true
    });

    const team = teams[0];
    expect(team.memberReasons).toBeDefined();

    const reasons = team.memberReasons!;
    expect(reasons['p-1']).toContain('LÍDER');
    expect(reasons['p-1']).toContain('Grupo: S. Francisco');
    
    // Carlos tiene interés secundario registrado (Corazones en Acción)
    expect(reasons['p-1']).toContain('Interés 2do');

    // Lucía no tiene interés secundario distinto (no se asume ni se inventa)
    expect(reasons['p-2']).not.toContain('Interés 2do');
    expect(reasons['p-2']).toContain('Dones: Animación');
  });

  it('3. Fomenta la integración entre diferentes grupos de confirmación', () => {
    const teams = teamBalancerService.generateTeams(sampleParticipants, {
      targetTeamSize: 4,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true
    });

    const membersInTeam = teams[0].memberIds;
    const groupsRepresented = new Set(
      sampleParticipants.filter(p => membersInTeam.includes(p.id)).map(p => p.confirmationGroup)
    );

    // Los 4 participantes provienen de 4 grupos distintos
    expect(groupsRepresented.size).toBe(4);
  });
});
