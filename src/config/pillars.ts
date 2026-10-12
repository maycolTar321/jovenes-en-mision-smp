import { PillarInfo, PillarId } from '../types';

export const PILLARS: Record<PillarId, PillarInfo> = {
  casa_comun: {
    id: 'casa_comun',
    number: 1,
    title: 'CASA COMÚN',
    subtitle: 'Cuidado ambiental y responsabilidad con nuestra tierra',
    description: 'Cuidar la creación es asumir nuestra responsabilidad con el lugar donde vivimos. Esta misión busca contribuir al cuidado ambiental mediante acciones concretas en Tarija.',
    needAddressed: 'Preservar los espacios naturales, cuencas y áreas verdes de Tarija, respondiendo activamente a la degradación ambiental y al llamado urgente del cuidado de la creación.',
    activities: [
      'Reforestación técnicamente adecuada',
      'Cuidado de plantines',
      'Recuperación de espacios verdes',
      'Limpieza y educación ambiental',
      'Campañas de prevención de incendios'
    ],
    bibleQuote: 'Génesis 2,15',
    bibleVerseText: '«Tomó, pues, el Señor Dios al hombre, y lo puso en el jardín de Edén, para que lo labrara y lo cuidara».',
    reflection: 'Dios nos confía la creación para que la cuidemos responsablemente. ¿Qué podemos hacer juntos para proteger nuestra Casa Común?',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Jóvenes plantando árboles y cuidando la tierra en Tarija',
    iconName: 'Sprout',
    color: 'terracotta',
    targetLocation: 'Riberas y Áreas Protegidas de Tarija / Espacios Parroquiales',
    missionGoal: 'Contribuir de forma activa y responsable a la conservación ecológica de Tarija mediante reforestación y concientización vecinal.',
    commitment: 'Participar activamente en jornadas al aire libre, labor de siembra, cuidado de plantines e hidratación del equipo.',
    usefulSkills: [
      'Trabajo manual y jardinería',
      'Logística de herramientas y agua',
      'Primeros auxilios',
      'Educación ambiental y fotografía'
    ],
    suggestedRoles: [
      'Coordinador de cuadrilla y herramientas',
      'Especialista en siembra y sustratos',
      'Responsable de hidratación y botiquín',
      'Promotor de concientización vecinal'
    ]
  },
  corazones_en_accion: {
    id: 'corazones_en_accion',
    number: 2,
    title: 'CORAZONES EN ACCIÓN',
    subtitle: 'Servicio cercano, digno y fraterno',
    description: 'Servir significa acercarnos a otras personas con respeto, escuchar sus necesidades y ofrecer una ayuda concreta que cuide su dignidad.',
    needAddressed: 'Acompañar a adultos mayores que sufren soledad, brindar espacios de afecto y recreación a niños de zonas periurbanas, y dignificar a familias con ayuda concreta.',
    activities: [
      'Acompañamiento a adultos mayores',
      'Actividades recreativas con niños',
      'Campañas de alimentos o abrigo',
      'Visitas coordinadas con instituciones',
      'Actividades de escucha y convivencia'
    ],
    bibleQuote: 'Mateo 25,35-40',
    bibleVerseText: '«Porque tuve hambre, y me disteis de comer; tuve sed, y me disteis de beber... Cada vez que lo hicisteis con uno de estos mis hermanos más pequeños, conmigo lo hicisteis».',
    reflection: 'El Evangelio nos invita a reconocer la dignidad de cada persona y a expresar el amor mediante el servicio.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Voluntariado fraterno compartiendo con niños y adultos mayores',
    iconName: 'HeartHandshake',
    color: 'terracotta',
    targetLocation: 'Hogar de Ancianos Santa Teresa de Jornet / Barrios Periurbanos de Tarija',
    missionGoal: 'Ser presencia viva del amor misericordioso de Jesús a través de la escucha atenta, la ternura y el apoyo material solidario.',
    commitment: 'Disposición a escuchar con respeto, paciencia con los ancianitos, energía para jugar con los niños y entrega desinteresada.',
    usefulSkills: [
      'Escucha fraterna y empatía',
      'Animación de dinámicas infantiles',
      'Música, canto y guitarra',
      'Preparación higiénica de alimentos'
    ],
    suggestedRoles: [
      'Facilitador de dinámicas y juegos',
      'Animador musical y coplas tradicionales',
      'Encargado de meriendas y canastas',
      'Acompañante de escucha fraterna'
    ]
  },
  transformadores_de_esperanza: {
    id: 'transformadores_de_esperanza',
    number: 3,
    title: 'TRANSFORMADORES DE ESPERANZA',
    subtitle: 'Recuperación comunitaria y convivencia ciudadana',
    description: 'Podemos contribuir al bien común recuperando espacios comunitarios y promoviendo la responsabilidad, la convivencia y la participación juvenil.',
    needAddressed: 'Recuperar espacios comunitarios deteriorados, plazas vecinales y muros degradados, transformándolos en lugares dignos de encuentro y esperanza para las familias.',
    activities: [
      'Recuperación autorizada de espacios comunitarios',
      'Limpieza y mantenimiento',
      'Mejoramiento de mobiliario',
      'Murales comunitarios autorizados',
      'Campañas de cuidado de espacios públicos'
    ],
    bibleQuote: 'Jeremías 29,7',
    bibleVerseText: '«Buscad el bienestar de la ciudad donde os he hecho habitar, y rogad por ella al Señor, porque en su bienestar tendréis vosotros bienestar».',
    reflection: 'También podemos servir trabajando por el bienestar de la comunidad donde vivimos.',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Jóvenes revitalizando y pintando espacios comunitarios en equipo',
    iconName: 'Sparkles',
    color: 'gold',
    targetLocation: 'Espacios Comunitarios Vecinales / Capillas Barriales de San Martín',
    missionGoal: 'Transformar el entorno físico de la comunidad con arte, limpieza y pintura, promoviendo el civismo y el compromiso juvenil.',
    commitment: 'Trabajo colaborativo en equipo, cuidado y limpieza de materiales de pintura, perseverancia y respeto al vecindario.',
    usefulSkills: [
      'Pintura artística y muralismo',
      'Trabajo manual y reparaciones',
      'Organización de cuadrillas',
      'Diseño y rotulación de carteles'
    ],
    suggestedRoles: [
      'Líder de cuadrilla de restauración',
      'Artista muralista y rotulador',
      'Encargado de inventario de brochas y pinturas',
      'Responsable de orden y limpieza final'
    ]
  },
  // Alias de compatibilidad previa
  ecologia: {
    id: 'ecologia',
    number: 1,
    title: 'CASA COMÚN',
    subtitle: 'Cuidado ambiental y responsabilidad con nuestra tierra',
    description: 'Cuidar la creación es asumir nuestra responsabilidad con el lugar donde vivimos. Esta misión busca contribuir al cuidado ambiental mediante acciones concretas en Tarija.',
    needAddressed: 'Preservar los espacios naturales, cuencas y áreas verdes de Tarija.',
    activities: [
      'Reforestación técnicamente adecuada',
      'Cuidado de plantines',
      'Recuperación de espacios verdes',
      'Limpieza y educación ambiental',
      'Campañas de prevención de incendios'
    ],
    bibleQuote: 'Génesis 2,15',
    bibleVerseText: '«Tomó, pues, el Señor Dios al hombre, y lo puso en el jardín de Edén, para que lo labrara y lo cuidara».',
    reflection: 'Dios nos confía la creación para que la cuidemos responsablemente. ¿Qué podemos hacer juntos para proteger nuestra Casa Común?',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Jóvenes plantando árboles y cuidando la tierra en Tarija',
    iconName: 'Sprout',
    color: 'terracotta',
    targetLocation: 'Riberas y Áreas Protegidas de Tarija / Espacios Parroquiales',
    missionGoal: 'Contribuir de forma activa y responsable a la conservación ecológica de Tarija.',
    commitment: 'Labor de siembra y cuidado ambiental en equipo.',
    usefulSkills: ['Trabajo manual', 'Logística', 'Jardinería'],
    suggestedRoles: ['Coordinador de cuadrilla', 'Sembrador']
  },
  ninez: {
    id: 'ninez',
    number: 2,
    title: 'CORAZONES EN ACCIÓN',
    subtitle: 'Servicio cercano, digno y fraterno',
    description: 'Servir significa acercarnos a otras personas con respeto, escuchar sus necesidades y ofrecer una ayuda concreta que cuide su dignidad.',
    needAddressed: 'Acompañar a niños y adultos mayores con afecto, dinámicas y apoyo concreto.',
    activities: [
      'Acompañamiento a adultos mayores',
      'Actividades recreativas con niños',
      'Campañas de alimentos o abrigo',
      'Visitas coordinadas con instituciones',
      'Actividades de escucha y convivencia'
    ],
    bibleQuote: 'Mateo 25,35-40',
    bibleVerseText: '«Cada vez que lo hicisteis con uno de estos mis hermanos más pequeños, conmigo lo hicisteis».',
    reflection: 'El Evangelio nos invita a reconocer la dignidad de cada persona y a expresar el amor mediante el servicio.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Voluntariado fraterno con niños y adultos mayores',
    iconName: 'HeartHandshake',
    color: 'terracotta',
    targetLocation: 'Barrios Periurbanos y Hogares de Tarija',
    missionGoal: 'Ser presencia viva del amor misericordioso de Jesús a través de la escucha y ayuda concreta.',
    commitment: 'Entrega generosa y empatía fraterna.',
    usefulSkills: ['Animación', 'Escucha', 'Canto'],
    suggestedRoles: ['Animador infantil', 'Acompañante']
  },
  adultos_mayores: {
    id: 'adultos_mayores',
    number: 2,
    title: 'CORAZONES EN ACCIÓN',
    subtitle: 'Servicio cercano, digno y fraterno',
    description: 'Servir significa acercarnos a otras personas con respeto, escuchar sus necesidades y ofrecer una ayuda concreta que cuide su dignidad.',
    needAddressed: 'Acompañar a adultos mayores que sufren soledad y necesidad de escucha fraterna.',
    activities: [
      'Acompañamiento a adultos mayores',
      'Actividades recreativas con niños',
      'Campañas de alimentos o abrigo',
      'Visitas coordinadas con instituciones',
      'Actividades de escucha y convivencia'
    ],
    bibleQuote: 'Mateo 25,35-40',
    bibleVerseText: '«Cada vez que lo hicisteis con uno de estos mis hermanos más pequeños, conmigo lo hicisteis».',
    reflection: 'El Evangelio nos invita a reconocer la dignidad de cada persona y a expresar el amor mediante el servicio.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Voluntariado fraterno con adultos mayores',
    iconName: 'HeartHandshake',
    color: 'terracotta',
    targetLocation: 'Hogar Santa Teresa de Jornet / Barrio San Martín',
    missionGoal: 'Brindar calor fraterno y escucha atenta a las personas mayores.',
    commitment: 'Paciencia y calidez en el trato.',
    usefulSkills: ['Escucha', 'Música', 'Cuidado'],
    suggestedRoles: ['Facilitador de escucha', 'Músico']
  }
};

export const PRIMARY_PILLAR_KEYS: PillarId[] = [
  'casa_comun',
  'corazones_en_accion',
  'transformadores_de_esperanza'
];

export const SKILL_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  logistica: {
    label: 'Logística y Organización',
    icon: 'Package',
    description: 'Gestión de materiales, transporte, compras y tiempos.'
  },
  animacion: {
    label: 'Animación y Dinámicas',
    icon: 'Sparkles',
    description: 'Facilidad para hablar en público, conducir juegos y alegrar.'
  },
  escucha: {
    label: 'Escucha y Acompañamiento',
    icon: 'Heart',
    description: 'Paciencia, empatía y apertura para conversar con personas mayores o vulnerables.'
  },
  trabajo_manual: {
    label: 'Trabajo Manual y Limpieza',
    icon: 'Hammer',
    description: 'Pintura, jardinería, albañilería básica y esfuerzo físico.'
  },
  arte_musica: {
    label: 'Música, Canto y Arte',
    icon: 'Music',
    description: 'Tocar guitarra/instrumentos, cantar, dramatización o pintura mural.'
  },
  salud: {
    label: 'Primeros Auxilios y Salud',
    icon: 'ShieldCheck',
    description: 'Conocimientos de auxilio básico, cuidado personal y bioseguridad.'
  },
  comunicacion: {
    label: 'Fotografía y Medios',
    icon: 'Camera',
    description: 'Registro visual, videos, diseño gráfico y redes sociales pastorales.'
  },
  cocina: {
    label: 'Cocina y Alimentos',
    icon: 'Coffee',
    description: 'Preparación higiénica de refrigerios, mates y distribución de alimentos.'
  }
};

export const CONFIRMATION_GROUPS = [
  'Grupo 1',
  'Grupo 2',
  'Grupo 3',
  'Grupo 4',
  'Grupo 5',
  'Grupo 6',
  'Grupo 7'
] as const;
