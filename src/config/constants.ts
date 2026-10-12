import { SocialProjectTracking, SystemConfig } from '../types';

export const APP_INFO = {
  name: 'JÓVENES EN MISIÓN SMP',
  motto: 'LA FE SE VIVE SIRVIENDO',
  parish: 'Parroquia San Martín de Porres',
  city: 'Tarija, Bolivia',
  version: '1.0.0',
  description: 'Sistema integral de investigación, planificación, ejecución y evaluación de la Obra Social Post-Confirmación.'
};

export const DEFAULT_CONFIG: SystemConfig = {
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycby4ZtzWBq1NN8VA3xVA0TeFpSSJ4GFhnuA6A98kVopf12ZjnG-59kD018Gi-p1fTPF6/exec',
  spreadsheetId: '1o7P-2gQq0UnWzEfBvVwxQv8wE5FHb9idVW8RITzuWGw',
  adminPin: 'smp2026', // PIN por defecto para acceso del equipo pastoral
  surveyActive: true,
  allowOpenRegistration: true, // Permite registro abierto o con código
  parishName: 'Parroquia San Martín de Porres',
  projectCity: 'Tarija, Bolivia',
  academicYear: '2026'
};

export const INITIAL_PROJECT_TRACKING: SocialProjectTracking = {
  id: 'smp-mision-2026',
  version: '1.0',
  lastUpdated: '2026-10-15',
  responsibleCatechist: 'Equipo Pastoral de Confirmación - Parroquia San Martín de Porres',
  title: 'JÓVENES EN MISIÓN SMP — LA FE SE VIVE SIRVIENDO',
  motto: 'La fe se vive sirviendo',
  parishName: 'Parroquia San Martín de Porres',
  location: 'Barrios Periurbanos y Centros de Acogida de Tarija, Bolivia',
  startDate: '2026-10-15',
  executionDate: '2026-11-07',
  evaluationDate: '2026-11-14',
  
  // Parámetros operativos
  durationHours: 8,
  durationDescription: 'Jornada intensiva comunitaria de 8 horas continuas (08:30 a 16:30)',
  volunteerCount: 40,
  selectedPrimaryPillar: 'todos',
  pillarSelectionRationale: 'La obra social definitiva se seleccionará formalmente una vez consolidadas las respuestas de los confirmados y contrastadas con las necesidades prioritarias del territorio parroquial en Tarija. Se contempla la opción de intervenir en un pilar central o articular acciones complementarias viables.',

  // Diagnóstico pastoral (VER)
  contextDiagnosis: 'Tras culminar el retiro espiritual de Confirmación, los jóvenes expresan la necesidad de que los dones del Espíritu Santo no queden como una vivencia abstracta, sino que se manifiesten en un compromiso comunitario directo. En Tarija, los barrios periurbanos enfrentan carencias de espacios comunitarios acondicionados, niños con limitadas ofertas lúdico-educativas en fines de semana y personas adultas mayores en soledad que anhelan compañía, escucha y fraternidad eclesial.',
  targetBeneficiaries: 'Aproximadamente 65 niños de sectores periurbanos, 35 abuelitos de centros de acogida y la feligresía comunitaria barrial.',
  estimatedBeneficiariesCount: 100,
  
  // Iluminación doctrinal (JUZGAR)
  biblicalInspiration: '• Santiago 2,14-18: "¿De qué le sirve a uno decir que tiene fe, si no tiene obras? ¿Acaso esa fe podrá salvarlo?... La fe, si no tiene obras, está completamente muerta".\n• Mateo 25,35-40: "Porque tuve hambre y me disteis de comer, tuve sed y me disteis de beber, fui forastero y me hospedasteis... Cada vez que lo hicieron con el más pequeño de mis hermanos, conmigo lo hicieron".\n• Juan 13,34-35: "Les doy un mandamiento nuevo: que se amen los unos a los otros. Así como yo los he amado, ámense también ustedes. En esto conocerán todos que son mis discípulos".\n• Génesis 2,15: "Tomó, pues, el Señor Dios al hombre, y lo puso en el jardín de Edén para que lo labrara y lo cuidase".',
  pastoralLine: 'Pastoral Juvenil Sinodal de Tarija: Una Iglesia en salida, fraterna, servidora y promotora de la dignidad humana y el cuidado de la Casa Común, guiada por el Magisterio de la Iglesia Latinoamericana y el Papa Francisco.',
  magisterialFoundations: '1. Papa Francisco, Exhortación Apostólica "Christus vivit" (2019), n. 170-178: "El compromiso social es un rasgo característico de los jóvenes de hoy... el servicio social y la cercanía a los pobres son una pedagogía inigualable para encontrarse con Cristo vivo".\n2. Papa Francisco, Carta Encíclica "Laudato si\'" (2015), n. 13 y n. 217: "El desafío urgente de proteger nuestra casa común incluye la preocupación de unir a toda la familia humana en la búsqueda de un desarrollo sostenible e integral... la conversión ecológica implica dejar brotar todas las consecuencias del encuentro con Jesucristo en las relaciones con el mundo que los rodea".\n3. Papa Francisco, Carta Encíclica "Fratelli tutti" (2020), n. 67-68: "La parábola del Buen Samaritano nos invita a redescubrir nuestra vocación de ciudadanos de nuestros respectivos países y del mundo entero, constructores de un nuevo vínculo social... es una llamada a no pasar de largo ante el dolor ajeno".\n4. Pontificio Consejo "Justicia y Paz", Compendio de la Doctrina Social de la Iglesia (2004), n. 160-196: Principios irrenunciables del Bien Común, Destino Universal de los Bienes, Subsidiariedad y Solidaridad cristiana.',

  // Metas y Plan de acción (ACTUAR)
  generalObjective: 'Canalizar el testimonio de fe y la vocación de servicio de los jóvenes confirmados de la Parroquia San Martín de Porres mediante una obra social transformadora en Tarija, que articule talentos individuales en equipos sinodales mixtos y responda con caridad cristiana a las necesidades comunitarias más urgentes.',
  specificObjectives: [
    'Investigar de forma sistemática los talentos, preferencias y disponibilidad de los confirmados a través de un instrumento diagnóstico riguroso.',
    'Conformar equipos de trabajo mixtos e interdisciplinarios que superen la división por grupos de catequesis y promuevan la comunión eclesial.',
    'Planificar, presupuestar y ejecutar una intervención solidaria pertinente en coordinación con líderes y familias beneficiarias.',
    'Evaluar el impacto pastoral en los jóvenes y beneficiarios, promoviendo su inserción activa y permanente en la pastoral juvenil parroquial.'
  ],
  humanResources: '• Asesor Espiritual: Párroco de San Martín de Porres.\n• Coordinación General: 4 Catequistas responsables de confirmación.\n• Líderes Juveniles: 6 Animadores de equipos mixtos.\n• Voluntariado: 40-50 Jóvenes confirmados de diferentes grupos.\n• Apoyo Logístico: Consejo Pastoral Parroquial y padres de familia.',
  institutionalAlliances: '• Centros Vecinales y Organizaciones Barriales de Tarija.\n• Hogar de Acogida de Adultos Mayores de Tarija.\n• Vivero Municipal de Tarija (donación de plantines y asesoría botánica).\n• Pastoral Social Cáritas Tarija (orientación técnica y banco de alimentos).',
  vulnerabilityProtocols: '• Autorización escrita y firmada por padres/tutores legales para todo menor de edad.\n• Protocolo eclesial de ambientes seguros: ningún animador o catequista estará a solas con un menor en espacios cerrados.\n• Coordinación de transporte y puntos seguros de encuentro oficial.\n• Botiquín completo de primeros auxilios y ficha médica básica de cada voluntario.\n• Prohibición estricta de publicación no consentida de fotografías que vulneren la dignidad de los beneficiarios infantiles o ancianos.',
  actionMilestones: [
    {
      id: 'm1',
      title: 'Aplicación del diagnóstico digital de talentos y disponibilidad',
      date: '2026-10-15',
      responsibleTeam: 'Equipo Coordinador Pastoral',
      completed: true
    },
    {
      id: 'm2',
      title: 'Análisis estadístico, tabulación y conformación de equipos mixtos',
      date: '2026-10-22',
      responsibleTeam: 'Catequistas de Confirmación',
      completed: false
    },
    {
      id: 'm3',
      title: 'Validación en terreno con beneficiarios y adquisición de materiales',
      date: '2026-10-31',
      responsibleTeam: 'Líderes de Equipo y Comisión Económica',
      completed: false
    },
    {
      id: 'm4',
      title: 'Jornada central de la Obra Social en campo (Misión Tarija)',
      date: '2026-11-07',
      responsibleTeam: 'Comunidad de Jóvenes en Misión SMP',
      completed: false
    },
    {
      id: 'm5',
      title: 'Misa de acción de gracias, asamblea de evaluación y entrega de certificados',
      date: '2026-11-14',
      responsibleTeam: 'Parroquia San Martín de Porres',
      completed: false
    }
  ],
  budgetItems: [
    {
      id: 'b1',
      category: 'Alimentación y Merienda Fraterna',
      description: 'Refrigerios nutritivos (sándwiches de queso criollo, fruta y jugo natural) para niños y jóvenes',
      quantity: 110,
      unitCostBob: 5.5,
      estimatedCostBob: 605,
      isPendingQuote: false,
      isCoveredByDonation: true,
      responsible: 'Comisión de Madres y Padres Catequesis'
    },
    {
      id: 'b2',
      category: 'Materiales Lúdicos y Didácticos',
      description: 'Cartulinas, marcadores, témperas, pinceles gruesos, pelotas inflables y globos',
      quantity: 1,
      unitCostBob: 320,
      estimatedCostBob: 320,
      isPendingQuote: false,
      isCoveredByDonation: false,
      responsible: 'Equipo Pastoral Niñez'
    },
    {
      id: 'b3',
      category: 'Canastas Fraternas Adultos Mayores',
      description: 'Paquetes con avena, té de manzanilla, leche en polvo, galletas suaves y artículos de aseo personal',
      quantity: 35,
      unitCostBob: 25,
      estimatedCostBob: 875,
      isPendingQuote: false,
      isCoveredByDonation: true,
      responsible: 'Comisión de Acopio Solidario'
    },
    {
      id: 'b4',
      category: 'Insumos Ambientales y Jardinería',
      description: 'Plantines nativos de lapacho/jacarandá, tierra abonada y tutores de madera',
      quantity: 40,
      unitCostBob: 8,
      estimatedCostBob: 320,
      isPendingQuote: false,
      isCoveredByDonation: false,
      responsible: 'Equipo Casa Común'
    },
    {
      id: 'b5',
      category: 'Pintura y Reparación de Mobiliario',
      description: 'Pintura esmalte sintético, lijas, brochas y aguarrás para embellecimiento comunal',
      quantity: 1,
      unitCostBob: undefined,
      estimatedCostBob: 0,
      isPendingQuote: true,
      isCoveredByDonation: false,
      responsible: 'Equipo Transformadores de Esperanza'
    },
    {
      id: 'b6',
      category: 'Seguridad y Primeros Auxilios',
      description: 'Botiquín para cuadrillas: alcohol, gasas, vendas elásticas, bloqueador solar y curitas',
      quantity: 3,
      unitCostBob: 50,
      estimatedCostBob: 150,
      isPendingQuote: false,
      isCoveredByDonation: false,
      responsible: 'Coordinación Logística'
    }
  ],
  
  // Evaluación y Celebración
  resultIndicators: '• Cuantitativos: Participación de al menos el 85% de los confirmados censados; 100 personas beneficiadas directamente; 100% de los hitos programados ejecutados dentro del cronograma.\n• Cualitativos: Grado de integración fraterna entre jóvenes de distintos grupos (medido mediante encuesta post-misión); nivel de alegría y acogida percibido en los beneficiarios; consolidación de al menos 2 iniciativas de continuidad pastoral.',
  evaluationCriteria: 'Se evaluará mediante una asamblea comunitaria el sábado 14 de noviembre, aplicando una breve rúbrica de satisfacción de los beneficiarios, autoevaluación de los líderes de equipo y plenario con el Párroco.',
  finalEvaluationMethodology: 'Metodología sinodal de la conversación en el Espíritu: escucha atenta, resonancia personal y discernimiento comunitario de los frutos pastorales alcanzados.',
  pastoralContinuityStrategy: 'Los confirmados serán formalmente invitados a integrarse a los grupos juveniles estables de la Parroquia San Martín de Porres (Jóvenes Sin Fronteras, Coro Parroquial, Legión de María y Pastoral Social Cáritas Parroquial).',
  thanksgivingMassDate: '2026-11-14 19:00 - Templo Parroquial San Martín de Porres',
  bibliography: [
    'Biblia de Jerusalén (Nueva Edición Revisada), Desclée de Brouwer, Bilbao, 2019.',
    'Papa Francisco, Exhortación Apostólica Postsinodal "Christus vivit" a los jóvenes y a todo el pueblo de Dios, Ciudad del Vaticano, 2019.',
    'Papa Francisco, Carta Encíclica "Laudato si\'" sobre el cuidado de la casa común, Ciudad del Vaticano, 2015.',
    'Papa Francisco, Carta Encíclica "Fratelli tutti" sobre la fraternidad y la amistad social, Ciudad del Vaticano, 2020.',
    'Pontificio Consejo "Justicia y Paz", Compendio de la Doctrina Social de la Iglesia, BAC, Madrid, 2005.',
    'V Conferencia General del Episcopado Latinoamericano y del Caribe, Documento Conclusivo de Aparecida, Bogotá, 2007.'
  ]
};
