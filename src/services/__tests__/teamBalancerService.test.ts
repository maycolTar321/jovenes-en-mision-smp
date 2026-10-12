import { describe, it, expect } from 'vitest';
import { teamBalancerService } from '../teamBalancerService';
import { Participant } from '../../types';

describe('teamBalancerService', () => {
  const sampleParticipants: Participant[] = [
    {
      id: 'p1',
      code: 'CONF-01',
      createdAt: '2026-10-10',
      fullName: 'Ana María',
      age: 17,
      gender: 'femenino',
      phone: '70000001',
      neighborhood: 'San Martín',
      confirmationGroup: 'San Francisco de Asís',
      catechistName: 'Juan Carlos',
      availability: ['sabado_manana'],
      transport: 'micro_a_pie',
      skills: ['animacion'],
      primaryTalentDescription: 'Canto',
      primaryPillar: 'ninez',
      secondaryPillar: 'ecologia',
      pillarSpecific: {},
      motivation: 'Quiero servir a Dios con los niños',
      previousServiceExperience: false,
      status: 'completada'
    },
    {
      id: 'p2',
      code: 'CONF-02',
      createdAt: '2026-10-10',
      fullName: 'Carlos Pérez',
      age: 18,
      gender: 'masculino',
      phone: '70000002',
      neighborhood: 'Senac',
      confirmationGroup: 'Santa Teresa de Calcuta',
      catechistName: 'Rolando Martínez',
      availability: ['sabado_manana'],
      transport: 'vehiculo_propio',
      skills: ['logistica'],
      primaryTalentDescription: 'Transporte',
      primaryPillar: 'ninez',
      secondaryPillar: 'adultos_mayores',
      pillarSpecific: {},
      motivation: 'Ayudar con movilidad',
      previousServiceExperience: true,
      status: 'completada'
    },
    {
      id: 'p3',
      code: 'CONF-03',
      createdAt: '2026-10-10',
      fullName: 'Lucía Benítez',
      age: 16,
      gender: 'femenino',
      phone: '70000003',
      neighborhood: 'Las Panosas',
      confirmationGroup: 'San Juan Pablo II',
      catechistName: 'Mariana',
      availability: ['sabado_manana'],
      transport: 'bicicleta',
      skills: ['arte_musica'],
      primaryTalentDescription: 'Pintura',
      primaryPillar: 'ninez',
      secondaryPillar: 'ecologia',
      pillarSpecific: {},
      motivation: 'Talleres de dibujo',
      previousServiceExperience: false,
      status: 'completada'
    }
  ];

  it('debe generar equipos para los participantes del pilar niñez', () => {
    const teams = teamBalancerService.generateTeams(sampleParticipants, {
      targetTeamSize: 3,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true
    });

    expect(teams.length).toBeGreaterThanOrEqual(1);
    expect(teams[0].pillarId).toBe('ninez');
    expect(teams[0].memberIds.length).toBe(3);
    expect(teams[0].leaderParticipantId).toBeDefined();
  });

  it('debe designar líder y respetar integrantes', () => {
    const teams = teamBalancerService.generateTeams(sampleParticipants, {
      targetTeamSize: 4,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true
    });

    expect(teams[0].leaderParticipantId).toBe('p2'); // Carlos tiene logística y experiencia previa
  });

  it('debe generar y balancear equipos para Casa Común y Corazones en Acción', () => {
    const participantsPrompt2: Participant[] = [
      {
        id: 'p-cc-1',
        code: 'CC-01',
        createdAt: '2026-10-11',
        fullName: 'Mateo Reforestador',
        age: 17,
        gender: 'masculino',
        phone: '71111111',
        neighborhood: 'San Martín',
        confirmationGroup: 'San Francisco de Asís',
        catechistName: 'Juan Carlos',
        availability: ['sabado_manana'],
        transport: 'micro_a_pie',
        skills: ['trabajo_manual', 'logistica'],
        primaryTalentDescription: 'Siembra y palas',
        primaryPillar: 'casa_comun',
        secondaryPillar: 'transformadores_de_esperanza',
        pillarSpecific: {},
        motivation: 'Cuidar la creación según Gen 2,15',
        previousServiceExperience: true,
        status: 'completada'
      },
      {
        id: 'p-cc-2',
        code: 'CC-02',
        createdAt: '2026-10-11',
        fullName: 'Valeria Ambientalista',
        age: 16,
        gender: 'femenino',
        phone: '72222222',
        neighborhood: 'Senac',
        confirmationGroup: 'Santa Teresa de Calcuta',
        catechistName: 'Rolando Martínez',
        availability: ['sabado_manana'],
        transport: 'bicicleta',
        skills: ['animacion', 'comunicacion'],
        primaryTalentDescription: 'Educación ambiental',
        primaryPillar: 'casa_comun',
        secondaryPillar: 'corazones_en_accion',
        pillarSpecific: {},
        motivation: 'Proteger nuestra casa común en Tarija',
        previousServiceExperience: false,
        status: 'completada'
      }
    ];

    const teams = teamBalancerService.generateTeams(participantsPrompt2, {
      targetTeamSize: 2,
      balanceGender: true,
      mixGroups: true,
      distributeKeySkills: true
    });

    expect(teams.length).toBe(1);
    expect(teams[0].pillarId).toBe('casa_comun');
    expect(teams[0].memberIds).toContain('p-cc-1');
    expect(teams[0].memberIds).toContain('p-cc-2');
  });
});
