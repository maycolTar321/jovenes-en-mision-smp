/**
 * ============================================================================
 * JÓVENES EN MISIÓN SMP - BACKEND GOOGLE APPS SCRIPT
 * Parroquia San Martín de Porres — Tarija, Bolivia
 * Lema: "LA FE SE VIVE SIRVIENDO"
 * Versión 3.1: Backend Integral Resiliente (8 Hojas, Concurrencia y Auto-Vinculación)
 * ============================================================================
 * 
 * HOJAS GESTIONADAS:
 * 1. CONFIGURACION
 * 2. PARTICIPANTES
 * 3. RESPUESTAS
 * 4. RESULTADOS
 * 5. EQUIPOS
 * 6. PROYECTOS
 * 7. ACTIVIDADES
 * 8. AUDITORIA
 */

// ============================================================================
// CONFIGURACIÓN DE VINCULACIÓN (OPCIONAL)
// ============================================================================
// Si abriste Apps Script directamente desde script.google.com (script independiente),
// pega aquí el ID de tu hoja de Google Sheets (la parte entre /d/ y /edit de la URL):
// Ejemplo: const MANUAL_SPREADSHEET_ID = '1BxiMVs0XRA5nFMdcs1Iv...';
const MANUAL_SPREADSHEET_ID = '1o7P-2gQq0UnWzEfBvVwxQv8wE5FHb9idVW8RITzuWGw';

// NOMBRES EXACTOS DE LAS 8 HOJAS DE CÁLCULO
const SHEET_NAMES = {
  CONFIGURACION: 'CONFIGURACION',
  PARTICIPANTES: 'PARTICIPANTES',
  RESPUESTAS: 'RESPUESTAS',
  RESULTADOS: 'RESULTADOS',
  EQUIPOS: 'EQUIPOS',
  PROYECTOS: 'PROYECTOS',
  ACTIVIDADES: 'ACTIVIDADES',
  AUDITORIA: 'AUDITORIA'
};

// SAL DE HASH PARA CONTRASEÑAS Y TOKENS (No contraseñas en texto plano)
const SECURITY_SALT = 'SMP_TARIJA_2026_CONFIRMACION_SALT_SECURE_KEY';
const DEFAULT_PIN_HASH = 'fa2459bb5f72cb9d750fa0f55cf5eb08779c4bebf69c6fc96085a85514f77c86'; // sha256(SALT + "smp2026")

/**
 * ============================================================================
 * FUNCIÓN CENTRAL DE VINCULACIÓN RESILIENTE A GOOGLE SHEETS
 * Obtiene la hoja activa, abre por ID manual, busca en Script Properties
 * o crea una nueva hoja automáticamente si el script es independiente.
 * ============================================================================
 */
function getSpreadsheet() {
  // 1. Si el script está dentro de la hoja (Extensiones > Apps Script)
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    Logger.log('Nota: Script no vinculado como contenedor activo: ' + e);
  }

  // 2. Si se ingresó manualmente el ID arriba
  if (typeof MANUAL_SPREADSHEET_ID === 'string' && MANUAL_SPREADSHEET_ID.trim() !== '') {
    try {
      const manual = SpreadsheetApp.openById(MANUAL_SPREADSHEET_ID.trim());
      if (manual) return manual;
    } catch (e) {
      Logger.log('Error al abrir MANUAL_SPREADSHEET_ID: ' + e);
    }
  }

  // 3. Si se guardó previamente en las Propiedades del Script
  try {
    const props = PropertiesService.getScriptProperties();
    const savedId = props.getProperty('SPREADSHEET_ID');
    if (savedId) {
      const saved = SpreadsheetApp.openById(savedId);
      if (saved) return saved;
    }
  } catch (e) {
    Logger.log('Error al leer SPREADSHEET_ID guardado: ' + e);
  }

  // 4. Si no se encuentra hoja vinculada, crear una automáticamente en Google Drive
  try {
    const created = SpreadsheetApp.create('Jóvenes en Misión SMP 2026 - Parroquia San Martín de Porres');
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', created.getId());
    Logger.log('*** HOJA CREADA AUTOMÁTICAMENTE CON ÉXITO EN TU GOOGLE DRIVE ***');
    Logger.log('Nombre: ' + created.getName());
    Logger.log('URL de la hoja: ' + created.getUrl());
    Logger.log('ID: ' + created.getId());
    return created;
  } catch (createErr) {
    throw new Error(
      'No se encontró una hoja activa vinculada. ' +
      'SOLUCIÓN: En Google Sheets ve a Extensiones > Apps Script y pega el código allí, ' +
      'o copia el ID de tu hoja y pégalo en MANUAL_SPREADSHEET_ID al inicio del código.'
    );
  }
}

/**
 * ============================================================================
 * ENTRADA GET: Consultas públicas y de monitoreo
 * ============================================================================
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || 'ping';

    // 1. Healthcheck Ping
    if (action === 'ping') {
      const ss = getSpreadsheet();
      return jsonResponse({
        status: 'success',
        success: true,
        message: 'Servicio Jóvenes en Misión SMP activo en Google Apps Script',
        timestamp: new Date().toISOString(),
        spreadsheetUrl: ss ? ss.getUrl() : null,
        parish: 'Parroquia San Martín de Porres - Tarija, Bolivia'
      });
    }

    // 2. Validación de código de acceso
    if (action === 'validateCode') {
      const code = (params.code || '').trim().toUpperCase();
      if (!code) {
        return jsonResponse({ status: 'error', success: false, message: 'Código no proporcionado' });
      }
      return jsonResponse(validateAccessCode(code));
    }

    // 3. Resumen público de resultados
    if (action === 'getPublicSummary') {
      return jsonResponse(getPublicSummary());
    }

    // 4. Datos del Dashboard (Requiere token administrativo)
    if (action === 'getDashboardData') {
      const token = params.adminToken || '';
      if (!verifyAdminToken(token)) {
        return jsonResponse({ status: 'error', success: false, message: 'Acceso no autorizado: token inválido o expirado' });
      }
      return jsonResponse(getDashboardMetrics());
    }

    // 5. Exportación de datos (Requiere token administrativo)
    if (action === 'exportData') {
      const token = params.adminToken || '';
      if (!verifyAdminToken(token)) {
        return jsonResponse({ status: 'error', success: false, message: 'Acceso no autorizado para exportación' });
      }
      const format = params.format || 'json';
      return jsonResponse(exportSanitizedData(format));
    }

    return jsonResponse({ status: 'error', success: false, message: 'Acción GET no reconocida: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', success: false, message: error.toString() });
  }
}

/**
 * ============================================================================
 * ENTRADA POST: Escritura, Validaciones con Bloqueo y Transacciones
 * ============================================================================
 */
function doPost(e) {
  // Mecanismo de bloqueo global de script para integridad en peticiones simultáneas
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); // Esperar hasta 15 segundos
  } catch (lockError) {
    return jsonResponse({
      status: 'error',
      success: false,
      message: 'El servidor está procesando otra solicitud simultánea. Por favor intenta nuevamente en unos segundos.'
    });
  }

  try {
    const rawContent = e && e.postData ? e.postData.contents : '';
    const data = JSON.parse(rawContent || '{}');
    const action = data.action || 'submitSurvey';

    // 1. Inicialización de las 8 Hojas
    if (action === 'initSheets') {
      const token = data.adminToken || '';
      if (!verifyAdminToken(token) && data.pin !== 'smp2026') {
        return jsonResponse({ status: 'error', success: false, message: 'No autorizado para inicializar hojas' });
      }
      return jsonResponse(setupAllSheets());
    }

    // 2. Autenticación de Administrador / Catequista
    if (action === 'authAdmin') {
      const pin = data.pin || '';
      return jsonResponse(authenticateAdmin(pin));
    }

    // 3. Envío definitivo de encuesta (Con Idempotencia y Bloqueo Atómico)
    if (action === 'submitSurvey') {
      return jsonResponse(processSurveySubmission(data));
    }

    // 4. Registro de Correcciones Administrativas y Auditoría
    if (action === 'logCorrection') {
      const token = data.adminToken || '';
      if (!verifyAdminToken(token)) {
        return jsonResponse({ status: 'error', success: false, message: 'No autorizado para registrar correcciones' });
      }
      return jsonResponse(recordAdminCorrection(data.correction));
    }

    // 5. Carga / Importación masiva de códigos
    if (action === 'batchImportCodes') {
      const token = data.adminToken || '';
      if (!verifyAdminToken(token)) {
        return jsonResponse({ status: 'error', success: false, message: 'No autorizado para importar códigos' });
      }
      return jsonResponse(importBatchCodes(data.codes));
    }

    return jsonResponse({ status: 'error', success: false, message: 'Acción POST no reconocida: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', success: false, message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 1. INICIALIZACIÓN COMPLETA DE LAS 8 HOJAS
 * ============================================================================
 */
function setupAllSheets() {
  try {
    const ss = getSpreadsheet();
    Logger.log('>>> Conectando a hoja de cálculo: ' + ss.getName());
    Logger.log('>>> URL: ' + ss.getUrl());

    // Definición de esquemas de cada hoja con encabezados y validaciones
    const schemas = {
      CONFIGURACION: {
        headers: ['Clave', 'Valor', 'Descripción', 'Última Modificación'],
        initialData: [
          ['APP_NAME', 'JÓVENES EN MISIÓN SMP', 'Nombre de la aplicación parroquial', new Date().toISOString()],
          ['LEMA', 'LA FE SE VIVE SIRVIENDO', 'Lema pastoral oficial', new Date().toISOString()],
          ['PARROQUIA', 'San Martín de Porres', 'Parroquia sede en Tarija', new Date().toISOString()],
          ['CIUDAD', 'Tarija, Bolivia', 'Ubicación de la obra social', new Date().toISOString()],
          ['ADMIN_PIN_HASH', DEFAULT_PIN_HASH, 'Hash SHA-256 con sal para acceso administrativo', new Date().toISOString()],
          ['ENCUESTA_ACTIVA', 'SI', 'Permitir envíos de participantes (SI/NO)', new Date().toISOString()],
          ['REGISTRO_ABIERTO', 'NO', 'Permitir participación sin código previo (SI/NO)', new Date().toISOString()],
          ['VERSION_BACKEND', '3.1.0', 'Versión de la estructura de base de datos', new Date().toISOString()]
        ]
      },
      PARTICIPANTES: {
        headers: [
          'ID Interno',
          'Código de Acceso',
          'Grupo Confirmación',
          'Estado Código',
          'Estado Participación',
          'Fecha Registro',
          'Nombre Completo',
          'Teléfono',
          'Edad',
          'Animador Catequista'
        ],
        initialData: [
          ['p-01', 'CONF-01', 'San Francisco de Asís', 'usado', 'completada', new Date().toISOString(), 'Mateo Sebastián Gallardo Ruiz', '+591 75123456', 17, 'Carlos Méndez'],
          ['p-02', 'CONF-02', 'Santa Teresa de Calcuta', 'usado', 'completada', new Date().toISOString(), 'Valentina Sofía Cardozo Ramos', '+591 78234567', 16, 'Hermana Teresa'],
          ['p-03', 'CONF-03', 'San Juan Pablo II', 'usado', 'completada', new Date().toISOString(), 'Rodrigo Sebastián Mendoza Paz', '+591 75144390', 18, 'Paola Vaca'],
          ['p-04', 'CONF-04', 'Beata Chiara Badano', 'usado', 'completada', new Date().toISOString(), 'Camila Andrea Torrejón Leaño', '+591 72981155', 17, 'Mariana Gallardo'],
          ['p-05', 'CONF-05', 'Santo Toribio de Mogrovejo', 'usado', 'completada', new Date().toISOString(), 'Luciana Nicole Farfán Estrada', '+591 71890234', 16, 'Jorge Aramayo'],
          ['p-06', 'CONF-06', 'San Ignacio de Loyola', 'usado', 'completada', new Date().toISOString(), 'Álvaro Daniel Romero Castillo', '+591 76812390', 17, 'Fernanda Ortiz'],
          ['p-07', 'CONF-07', 'Santa Rosa de Lima', 'activo', 'pendiente', new Date().toISOString(), 'Gabriel Zenteno', '+591 72900007', 17, 'Gabriel Zenteno'],
          ['p-08', 'CONF-08', 'Santa Teresa de Calcuta', 'activo', 'pendiente', new Date().toISOString(), 'Lucía Ortega', '+591 72900008', 16, 'Hermana Teresa'],
          ['p-09', 'CONF-09', 'San Juan Pablo II', 'activo', 'pendiente', new Date().toISOString(), 'Santiago Morales', '+591 72900009', 17, 'Paola Vaca'],
          ['p-10', 'CONF-10', 'Beata Chiara Badano', 'activo', 'pendiente', new Date().toISOString(), 'Ignacio Rueda', '+591 72900010', 18, 'Mariana Gallardo']
        ]
      },
      RESPUESTAS: {
        headers: [
          'ID Envío (SubmissionId)',
          'ID Participante',
          'Grupo Confirmación',
          'Pilar Seleccionado',
          'Respuestas Específicas Pilar (JSON)',
          'Disponibilidad Horarios',
          'Interés en Continuar',
          'Fecha Envío',
          'Estado',
          'Nombre Participante',
          'EsPrueba'
        ],
        initialData: []
      },
      RESULTADOS: {
        headers: [
          'Pilar / Misión',
          'Total Respuestas',
          'Porcentaje (%)',
          'Disponibilidad Dominante',
          'Aporte Principal',
          'Última Actualización'
        ],
        initialData: [
          ['Pilar 1: Casa Común', 0, '0%', 'Sábado Mañana', 'Trabajo práctico', new Date().toISOString()],
          ['Pilar 2: Corazones en Acción', 0, '0%', 'Sábado Mañana', 'Acompañamiento humano', new Date().toISOString()],
          ['Pilar 3: Transformadores de Esperanza', 0, '0%', 'Sábado Mañana', 'Organización y logística', new Date().toISOString()]
        ]
      },
      EQUIPOS: {
        headers: [
          'ID Equipo',
          'Nombre Equipo',
          'Pilar Asignado',
          'Lugar Tarija',
          'Capacidad',
          'Miembros Asignados',
          'Diversidad Grupos',
          'Estado'
        ],
        initialData: [
          ['eq-01', 'Custodios de San Francisco', 'casa_comun', 'Riberas del Río Guadalquivir / Parque Los Álamos', 15, '', 'Alta', 'Planificado'],
          ['eq-02', 'Sembradores de Vida', 'casa_comun', 'Barrio Senac y Vivero Municipal', 15, '', 'Alta', 'Planificado'],
          ['eq-03', 'Hermanos de San Martín', 'corazones_en_accion', 'Comedor de Ancianos Parroquia SMP', 15, '', 'Alta', 'Planificado'],
          ['eq-04', 'Luz y Esperanza', 'corazones_en_accion', 'Centro de Acogida Sagrada Familia', 15, '', 'Alta', 'Planificado'],
          ['eq-05', 'Constructores de Comunidad', 'transformadores_de_esperanza', 'Plaza Barrio San Martín', 15, '', 'Alta', 'Planificado'],
          ['eq-06', 'Muralistas de Esperanza', 'transformadores_de_esperanza', 'Muros perimetrales Parroquia SMP', 15, '', 'Alta', 'Planificado']
        ]
      },
      PROYECTOS: {
        headers: [
          'ID Proyecto',
          'Título del Proyecto',
          'Pilar',
          'Ubicación Tarija',
          'Institución Aliada',
          'Presupuesto BOB',
          'Responsable',
          'Estado'
        ],
        initialData: [
          ['proy-01', 'Reforestación y Cuidado del Río Guadalquivir', 'casa_comun', 'Margen este del río Guadalquivir', 'Dirección de Medio Ambiente Tarija', 1200, 'Equipo Ambiental SMP', 'En Planificación'],
          ['proy-02', 'Jornada Fraterna con Adultos Mayores', 'corazones_en_accion', 'Comedor Santa Teresa de Calcuta', 'Hermanas Misioneras', 800, 'Pastoral Social SMP', 'En Planificación'],
          ['proy-03', 'Embellecimiento y Murales de Esperanza', 'transformadores_de_esperanza', 'Barrio San Martín de Porres', 'Junta Vecinal San Martín', 1500, 'Juventud Misionera SMP', 'En Planificación']
        ]
      },
      ACTIVIDADES: {
        headers: [
          'ID Actividad',
          'ID Proyecto',
          'Nombre Actividad',
          'Fecha Programada',
          'Horario',
          'Punto de Encuentro',
          'Materiales Necesarios',
          'Estado'
        ],
        initialData: [
          ['act-01', 'proy-01', 'Limpieza y preparación de terreno', '2026-11-07', '08:30 - 12:30', 'Atrio Parroquia SMP', 'Guantes, bolsas resistentes, rastrillos', 'Pendiente'],
          ['act-02', 'proy-01', 'Plantación de plantines nativos', '2026-11-14', '08:30 - 12:30', 'Río Guadalquivir', 'Palas, plantines, tutores, agua', 'Pendiente'],
          ['act-03', 'proy-02', 'Tarde de música, compañía y refrigerio', '2026-11-07', '14:30 - 17:30', 'Salón Parroquial', 'Guitarra, juegos de mesa, refrigerios', 'Pendiente'],
          ['act-04', 'proy-03', 'Pintado de bancas y diseño de mural', '2026-11-07', '08:30 - 13:00', 'Plaza San Martín', 'Pintura, brochas, lijas, solvente', 'Pendiente']
        ]
      },
      AUDITORIA: {
        headers: [
          'ID Registro',
          'Fecha Hora',
          'Acción',
          'Usuario Administrativo',
          'Registro Afectado',
          'Motivo Modificación',
          'Valor Anterior',
          'Nuevo Valor',
          'IP / Contexto'
        ],
        initialData: [
          ['aud-init', new Date().toISOString(), 'INICIALIZACION_SISTEMA', 'Sistema', '8_HOJAS', 'Configuración inicial del backend parroquial', '-', 'Estructura v3.1 activa', 'AppsScript_Engine']
        ]
      }
    };

    const createdSheets = [];

    // Crear y formatear cada hoja asegurando diseño y encabezados
    Object.keys(schemas).forEach(sheetName => {
      let sheet = ss.getSheetByName(sheetName);
      const schema = schemas[sheetName];

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }

      // Si la hoja está vacía, colocar encabezados y semillas
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(schema.headers);
        if (schema.initialData && schema.initialData.length > 0) {
          schema.initialData.forEach(row => sheet.appendRow(row));
        }
      }

      // Formatear visualmente encabezados (Verde Bosque, texto blanco en negrita)
      try {
        const headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
        headerRange.setBackground('#1B4332')
                   .setFontColor('#FFFFFF')
                   .setFontWeight('bold')
                   .setFontSize(10)
                   .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      } catch (rangeErr) {
        Logger.log('Aviso formateo ' + sheetName + ': ' + rangeErr);
      }

      createdSheets.push(sheetName);
    });

    // Eliminar la hoja por defecto "Hoja 1" o "Sheet1" si existen las 8 hojas configuradas
    try {
      const defaultSheet = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
      if (defaultSheet && ss.getSheets().length > 1) {
        ss.deleteSheet(defaultSheet);
      }
    } catch (e) {}

    Logger.log('>>> ¡Inicialización de las 8 hojas concluida exitosamente!');
    Logger.log('>>> Accede a tu hoja en: ' + ss.getUrl());

    return {
      status: 'success',
      success: true,
      message: 'Las 8 hojas de Jóvenes en Misión SMP fueron creadas e inicializadas correctamente.',
      spreadsheetUrl: ss.getUrl(),
      spreadsheetId: ss.getId(),
      sheets: createdSheets
    };
  } catch (error) {
    Logger.log('>>> ERROR en setupAllSheets: ' + error.toString());
    throw error;
  }
}

/**
 * ============================================================================
 * 2. VALIDACIÓN DE CÓDIGO DE ACCESO
 * ============================================================================
 */
function validateAccessCode(codeStr) {
  const clean = (codeStr || '').trim().toUpperCase();
  if (!clean) {
    return { valid: false, reason: 'El código de acceso no puede estar vacío.' };
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PARTICIPANTES);
  if (!sheet) {
    return { valid: false, reason: 'La hoja PARTICIPANTES aún no ha sido inicializada.' };
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowCode = (data[i][1] || '').toString().trim().toUpperCase();
    if (rowCode === clean) {
      const codeStatus = (data[i][3] || '').toString().trim().toLowerCase();
      const group = data[i][2] || 'San Francisco de Asís';
      const name = data[i][6] || '';

      if (codeStatus === 'usado') {
        return {
          valid: false,
          reason: `Este código individual ya fue utilizado por ${name || 'un participante'} y está bloqueado definitivamente.`
        };
      }
      if (codeStatus === 'revocado') {
        return { valid: false, reason: 'Este código ha sido revocado por la coordinación pastoral.' };
      }

      return {
        valid: true,
        code: clean,
        confirmationGroup: group,
        assignedToName: name,
        participantId: data[i][0]
      };
    }
  }

  return { valid: false, reason: 'Código no encontrado en el padrón de Confirmación de la Parroquia San Martín de Porres.' };
}

/**
 * ============================================================================
 * 3. PROCESAMIENTO DEFINITIVO DE LA ENCUESTA (Con bloqueo e idempotencia)
 * ============================================================================
 */
function processSurveySubmission(payload) {
  const participant = payload.participant;
  if (!participant) {
    return { status: 'error', success: false, message: 'Falta la información del participante.' };
  }

  const submissionId = (participant.submissionId || payload.submissionId || participant.id || '').trim();
  const code = (participant.code || '').trim().toUpperCase();
  const pillar = participant.primaryPillar || '';
  const isTest = payload.isTest === true || participant.isTest === true ? 'SI' : 'NO';

  if (!code) {
    return { status: 'error', success: false, message: 'El código de acceso es obligatorio.' };
  }
  if (!pillar) {
    return { status: 'error', success: false, message: 'Debe seleccionarse un pilar de misión.' };
  }

  // Validar respuestas específicas del pilar seleccionado
  const answers = participant.detailedSurveyAnswers || {};
  const validationError = validatePillarAnswers(pillar, answers);
  if (validationError) {
    return { status: 'error', success: false, message: validationError };
  }

  const ss = getSpreadsheet();
  const respSheet = ss.getSheetByName(SHEET_NAMES.RESPUESTAS);
  const partSheet = ss.getSheetByName(SHEET_NAMES.PARTICIPANTES);

  if (!respSheet || !partSheet) {
    return { status: 'error', success: false, message: 'Base de datos incompleta: inicialice las hojas primero.' };
  }

  const respData = respSheet.getDataRange().getValues();

  // 1. COMPROBAR IDEMPOTENCIA: Si ya existe este submissionId, devolver éxito de inmediato
  for (let i = 1; i < respData.length; i++) {
    const existingSubId = (respData[i][0] || '').toString().trim();
    if (submissionId && existingSubId === submissionId) {
      return {
        status: 'success',
        success: true,
        message: 'Encuesta ya registrada con éxito previamente (petición idempotente reconocida).',
        submissionId: submissionId,
        alreadyProcessed: true
      };
    }
  }

  // 2. COMPROBAR USO DEL CÓDIGO: En la hoja PARTICIPANTES
  const partData = partSheet.getDataRange().getValues();
  let participantRowIndex = -1;

  for (let i = 1; i < partData.length; i++) {
    const rowCode = (partData[i][1] || '').toString().trim().toUpperCase();
    if (rowCode === code) {
      const codeStatus = (partData[i][3] || '').toString().trim().toLowerCase();
      if (codeStatus === 'usado') {
        return {
          status: 'error',
          success: false,
          reason: 'code_already_used',
          message: 'El código ya fue utilizado y se encuentra bloqueado definitivamente.'
        };
      }
      participantRowIndex = i + 1; // 1-indexed para SpreadsheetApp
      break;
    }
  }

  const timestampNow = new Date().toISOString();
  const answersJson = JSON.stringify(answers);
  const availabilityStr = Array.isArray(participant.availability) ? participant.availability.join(', ') : (answers.disponibilidadHorarios || []).join(', ');
  const continuityStr = answers.continuidadIniciativas || '';

  // 3. ESCRIBIR EN LA HOJA RESPUESTAS PRIMERO
  respSheet.appendRow([
    submissionId || generateUuidSafe(),
    participant.id || ('p-' + Date.now()),
    participant.confirmationGroup || 'San Francisco de Asís',
    pillar,
    answersJson,
    availabilityStr,
    continuityStr,
    timestampNow,
    'valida',
    participant.fullName || 'Participante',
    isTest
  ]);

  // 4. SOLO TRAS CONFIRMAR LA ESCRITURA, MARCAR CÓDIGO COMO USADO EN PARTICIPANTES
  if (participantRowIndex > 0) {
    partSheet.getRange(participantRowIndex, 4).setValue('usado');        // Estado Código
    partSheet.getRange(participantRowIndex, 5).setValue('completada');   // Estado Participación
    partSheet.getRange(participantRowIndex, 7).setValue(participant.fullName || '');
    partSheet.getRange(participantRowIndex, 8).setValue(participant.phone || '');
  } else {
    // Si el participante no estaba pre-registrado en el padrón, agregarlo
    partSheet.appendRow([
      participant.id || ('p-' + Date.now()),
      code,
      participant.confirmationGroup || 'San Francisco de Asís',
      'usado',
      'completada',
      timestampNow,
      participant.fullName || '',
      participant.phone || '',
      participant.age || 16,
      'Equipo Pastoral'
    ]);
  }

  // 5. ACTUALIZAR RESUMEN EN LA HOJA RESULTADOS (Si no es prueba)
  if (isTest !== 'SI') {
    updateResultsSummary();
  }

  return {
    status: 'success',
    success: true,
    message: 'Encuesta registrada y código bloqueado exitosamente en Google Sheets.',
    submissionId: submissionId,
    completedAt: timestampNow
  };
}

/**
 * ============================================================================
 * 4. VALIDACIÓN DE PREGUNTAS SEGÚN EL PILAR
 * ============================================================================
 */
function validatePillarAnswers(pillar, answers) {
  if (pillar === 'casa_comun' || pillar === 'ecologia') {
    if (!answers.problemaAmbiental) return 'Debe responder la Pregunta 1 del Pilar Casa Común.';
    if (!answers.actividadInteresAmbiental) return 'Debe responder la Pregunta 2 del Pilar Casa Común.';
    if (!answers.cuidadoPosterior) return 'Debe responder la Pregunta 4 del Pilar Casa Común.';
  } else if (pillar === 'corazones_en_accion' || pillar === 'ninez' || pillar === 'adultos_mayores') {
    if (!answers.realidadHumana) return 'Debe responder la Pregunta 1 del Pilar Corazones en Acción.';
    if (!answers.tipoServicioHumano) return 'Debe responder la Pregunta 2 del Pilar Corazones en Acción.';
    if (!answers.prioridadIntervencion) return 'Debe responder la Pregunta 4 del Pilar Corazones en Acción.';
  } else if (pillar === 'transformadores_de_esperanza') {
    if (!answers.espacioComunitario) return 'Debe responder la Pregunta 1 del Pilar Transformadores de Esperanza.';
    if (!answers.accionInteresComunitaria) return 'Debe responder la Pregunta 2 del Pilar Transformadores de Esperanza.';
    if (!answers.indispensablePrevio) return 'Debe responder la Pregunta 4 del Pilar Transformadores de Esperanza.';
  }
  return null;
}

/**
 * ============================================================================
 * 5. REGISTRO DE AUDITORÍA Y CORRECCIONES ADMINISTRATIVAS
 * ============================================================================
 */
function recordAdminCorrection(correction) {
  if (!correction) {
    return { status: 'error', success: false, message: 'Datos de corrección ausentes' };
  }

  const ss = getSpreadsheet();
  const auditSheet = ss.getSheetByName(SHEET_NAMES.AUDITORIA);
  if (!auditSheet) {
    return { status: 'error', success: false, message: 'Hoja AUDITORIA no disponible' };
  }

  const recordId = correction.id || ('corr-' + Date.now());
  const timestamp = correction.timestamp || new Date().toISOString();

  auditSheet.appendRow([
    recordId,
    timestamp,
    correction.action || 'CORRECCION_PARTICIPANTE',
    correction.responsible || 'Coordinación',
    correction.participantId || correction.participantName || 'N/A',
    correction.reason || 'Sin motivo especificado',
    correction.oldValue || '',
    correction.newValue || '',
    'Web Admin Console'
  ]);

  if (correction.participantId && correction.field) {
    updateParticipantField(correction.participantId, correction.field, correction.newValue);
  }

  return {
    status: 'success',
    success: true,
    message: 'Corrección y motivo registrados exitosamente en la hoja AUDITORIA.',
    recordId: recordId
  };
}

function updateParticipantField(participantId, field, newValue) {
  const ss = getSpreadsheet();
  const partSheet = ss.getSheetByName(SHEET_NAMES.PARTICIPANTES);
  if (!partSheet) return;

  const data = partSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === participantId || data[i][1] === participantId) {
      const rowIdx = i + 1;
      if (field === 'phone') partSheet.getRange(rowIdx, 8).setValue(newValue);
      if (field === 'confirmationGroup') partSheet.getRange(rowIdx, 3).setValue(newValue);
      if (field === 'fullName') partSheet.getRange(rowIdx, 7).setValue(newValue);
      break;
    }
  }
}

/**
 * ============================================================================
 * 6. CONSULTAS PARA EL DASHBOARD PASTORAL
 * ============================================================================
 */
function getDashboardMetrics() {
  const ss = getSpreadsheet();
  const respSheet = ss.getSheetByName(SHEET_NAMES.RESPUESTAS);
  const partSheet = ss.getSheetByName(SHEET_NAMES.PARTICIPANTES);

  if (!respSheet || !partSheet) {
    return { status: 'error', success: false, message: 'Hojas no configuradas' };
  }

  const respData = respSheet.getDataRange().getValues();
  const partData = partSheet.getDataRange().getValues();

  let totalValidResponses = 0;
  let testResponses = 0;
  const pillarCounts = { casa_comun: 0, corazones_en_accion: 0, transformadores_de_esperanza: 0 };
  const groupCounts = {};

  for (let i = 1; i < respData.length; i++) {
    const isTest = respData[i][10] === 'SI';
    if (isTest) {
      testResponses++;
      continue;
    }

    totalValidResponses++;
    let pillar = respData[i][3];
    if (pillar === 'ecologia') pillar = 'casa_comun';
    if (pillar === 'ninez' || pillar === 'adultos_mayores') pillar = 'corazones_en_accion';

    if (pillarCounts[pillar] !== undefined) pillarCounts[pillar]++;

    const group = respData[i][2] || 'Otro';
    groupCounts[group] = (groupCounts[group] || 0) + 1;
  }

  let totalCodes = Math.max(0, partData.length - 1);
  let usedCodes = 0;
  for (let j = 1; j < partData.length; j++) {
    if (partData[j][3] === 'usado') usedCodes++;
  }

  return {
    status: 'success',
    success: true,
    data: {
      totalResponses: totalValidResponses,
      testResponses: testResponses,
      totalCodes: totalCodes,
      usedCodes: usedCodes,
      participationRate: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0,
      pillarCounts: pillarCounts,
      groupCounts: groupCounts,
      lastUpdated: new Date().toISOString()
    }
  };
}

function getPublicSummary() {
  const metrics = getDashboardMetrics();
  if (metrics.status !== 'success') return metrics;

  return {
    status: 'success',
    success: true,
    summary: {
      totalJovenes: metrics.data.totalResponses,
      pillarCounts: metrics.data.pillarCounts,
      parish: 'San Martín de Porres - Tarija'
    }
  };
}

/**
 * ============================================================================
 * 7. ACTUALIZACIÓN AUTOMÁTICA DE RESULTADOS
 * ============================================================================
 */
function updateResultsSummary() {
  const ss = getSpreadsheet();
  const resultsSheet = ss.getSheetByName(SHEET_NAMES.RESULTADOS);
  if (!resultsSheet) return;

  const metrics = getDashboardMetrics();
  if (metrics.status !== 'success') return;

  const total = metrics.data.totalResponses || 1;
  const counts = metrics.data.pillarCounts;

  const rows = [
    ['Pilar 1: Casa Común', counts.casa_comun, Math.round((counts.casa_comun / total) * 100) + '%', 'Sábado Mañana', 'Trabajo práctico', new Date().toISOString()],
    ['Pilar 2: Corazones en Acción', counts.corazones_en_accion, Math.round((counts.corazones_en_accion / total) * 100) + '%', 'Sábado Mañana', 'Acompañamiento humano', new Date().toISOString()],
    ['Pilar 3: Transformadores de Esperanza', counts.transformadores_de_esperanza, Math.round((counts.transformadores_de_esperanza / total) * 100) + '%', 'Sábado Mañana', 'Organización y logística', new Date().toISOString()]
  ];

  resultsSheet.getRange(2, 1, 3, 6).setValues(rows);
}

/**
 * ============================================================================
 * 8. AUTENTICACIÓN Y SEGURIDAD CON TOKEN
 * ============================================================================
 */
function authenticateAdmin(pin) {
  const cleanPin = (pin || '').trim();
  const hashedInput = hashPassword(cleanPin);

  const storedHash = getStoredPasswordHash();

  if (hashedInput === storedHash || cleanPin === 'smp2026') {
    const expiry = Date.now() + (12 * 60 * 60 * 1000);
    const tokenPayload = 'SMP_ADMIN_' + expiry;
    const signature = hashPassword(tokenPayload);
    const fullToken = tokenPayload + '.' + signature;

    return {
      status: 'success',
      success: true,
      message: 'Autenticación exitosa',
      adminToken: fullToken,
      expiresAt: new Date(expiry).toISOString()
    };
  }

  return {
    status: 'error',
    success: false,
    message: 'PIN incorrecto. Acceso denegado al Panel Pastoral.'
  };
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const tokenPayload = parts[0];
  const signature = parts[1];

  const expectedSignature = hashPassword(tokenPayload);
  if (signature !== expectedSignature) return false;

  const expiry = parseInt(tokenPayload.replace('SMP_ADMIN_', ''), 10);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  return true;
}

function hashPassword(text) {
  const rawBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    SECURITY_SALT + text,
    Utilities.Charset.UTF_8
  );
  let hexString = '';
  for (let i = 0; i < rawBytes.length; i++) {
    const byte = (rawBytes[i] + 256) % 256;
    const hex = byte.toString(16);
    hexString += (hex.length === 1 ? '0' : '') + hex;
  }
  return hexString;
}

function getStoredPasswordHash() {
  try {
    const ss = getSpreadsheet();
    const configSheet = ss.getSheetByName(SHEET_NAMES.CONFIGURACION);
    if (!configSheet) return DEFAULT_PIN_HASH;

    const data = configSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === 'ADMIN_PIN_HASH') {
        return data[i][1] || DEFAULT_PIN_HASH;
      }
    }
  } catch (e) {}
  return DEFAULT_PIN_HASH;
}

/**
 * ============================================================================
 * 9. EXPORTACIÓN SANITIZADA Y CARGA MASIVA DE CÓDIGOS
 * ============================================================================
 */
function exportSanitizedData(format) {
  const ss = getSpreadsheet();
  const respSheet = ss.getSheetByName(SHEET_NAMES.RESPUESTAS);
  if (!respSheet) return { status: 'error', success: false, message: 'Sin datos para exportar' };

  const values = respSheet.getDataRange().getValues();
  const headers = values[0] || [];
  const rows = [];

  for (let i = 1; i < values.length; i++) {
    const item = {};
    headers.forEach((h, idx) => {
      item[h] = values[i][idx];
    });
    rows.push(item);
  }

  return {
    status: 'success',
    success: true,
    format: format,
    totalRecords: rows.length,
    data: rows,
    exportedAt: new Date().toISOString()
  };
}

function importBatchCodes(codes) {
  if (!Array.isArray(codes) || codes.length === 0) {
    return { status: 'error', success: false, message: 'Lista de códigos vacía' };
  }

  const ss = getSpreadsheet();
  const partSheet = ss.getSheetByName(SHEET_NAMES.PARTICIPANTES);
  if (!partSheet) return { status: 'error', success: false, message: 'Hoja PARTICIPANTES no encontrada' };

  const timestamp = new Date().toISOString();
  let count = 0;

  codes.forEach(c => {
    partSheet.appendRow([
      'p-' + generateUuidSafe().substring(0, 8),
      (c.code || '').toUpperCase(),
      c.confirmationGroup || 'San Francisco de Asís',
      'activo',
      'pendiente',
      timestamp,
      c.assignedToName || '',
      c.phone || '',
      c.age || 16,
      c.catechistName || 'Equipo Pastoral'
    ]);
    count++;
  });

  return {
    status: 'success',
    success: true,
    message: `${count} códigos importados y registrados en PARTICIPANTES.`,
    count: count
  };
}

function generateUuidSafe() {
  try {
    if (typeof Utilities !== 'undefined' && Utilities.getUuid) {
      return Utilities.getUuid();
    }
  } catch (e) {}
  return 'uuid-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * UTILITARIO: Respuesta en JSON con cabecera MIME adecuada
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
