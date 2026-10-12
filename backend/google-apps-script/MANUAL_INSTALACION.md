# MANUAL DE INSTALACIÓN, DESPLIEGUE Y MANTENIMIENTO DEL BACKEND
## JÓVENES EN MISIÓN SMP — GOOGLE APPS SCRIPT & GOOGLE SHEETS
### Parroquia San Martín de Porres — Tarija, Bolivia
#### Lema: "LA FE SE VIVE SIRVIENDO"

Este documento contiene las especificaciones técnicas completas para configurar, desplegar, auditar y actualizar el backend de **JÓVENES EN MISIÓN SMP** en la infraestructura gratuita y segura de **Google Sheets** y **Google Apps Script**.

---

## 1. ESQUEMA DE LAS 8 HOJAS DE CÁLCULO

El backend gestiona automáticamente 8 hojas de cálculo interconectadas:

| # | Nombre de Hoja | Propósito | Campos Principales |
|---|---|---|---|
| 1 | **CONFIGURACION** | Parámetros del sistema y seguridad | `Clave`, `Valor`, `Descripción`, `Última Modificación` |
| 2 | **PARTICIPANTES** | Padrón parroquial de confirmandos y códigos | `ID Interno`, `Código de Acceso`, `Grupo Confirmación`, `Estado Código`, `Estado Participación`, `Fecha Registro`, `Nombre Completo`, `Teléfono`, `Edad`, `Animador Catequista` |
| 3 | **RESPUESTAS** | Respuestas registradas y bloqueadas | `ID Envío (SubmissionId)`, `ID Participante`, `Grupo Confirmación`, `Pilar Seleccionado`, `Respuestas Específicas Pilar (JSON)`, `Disponibilidad Horarios`, `Interés en Continuar`, `Fecha Envío`, `Estado`, `Nombre Participante`, `EsPrueba` |
| 4 | **RESULTADOS** | Consolidado dinámico de participación | `Pilar / Misión`, `Total Respuestas`, `Porcentaje (%)`, `Disponibilidad Dominante`, `Aporte Principal`, `Última Actualización` |
| 5 | **EQUIPOS** | Cuadrillas y equipos mixtos formados | `ID Equipo`, `Nombre Equipo`, `Pilar Asignado`, `Lugar Tarija`, `Capacidad`, `Miembros Asignados`, `Diversidad Grupos`, `Estado` |
| 6 | **PROYECTOS** | Proyectos sociales por cada pilar | `ID Proyecto`, `Título del Proyecto`, `Pilar`, `Ubicación Tarija`, `Institución Aliada`, `Presupuesto BOB`, `Responsable`, `Estado` |
| 7 | **ACTIVIDADES** | Cronograma de jornadas de servicio | `ID Actividad`, `ID Proyecto`, `Nombre Actividad`, `Fecha Programada`, `Horario`, `Punto de Encuentro`, `Materiales Necesarios`, `Estado` |
| 8 | **AUDITORIA** | Historial inmutable de cambios administrativos | `ID Registro`, `Fecha Hora`, `Acción`, `Usuario Administrativo`, `Registro Afectado`, `Motivo Modificación`, `Valor Anterior`, `Nuevo Valor`, `IP / Contexto` |

---

## 2. PROCEDIMIENTO DE INSTALACIÓN PASO A PASO

### Paso 1: Crear la Hoja de Google Sheets
1. Ingresa a tu cuenta de Google (de preferencia la cuenta oficial de la Parroquia San Martín de Porres).
2. Entra a [https://sheets.new](https://sheets.new) para crear una nueva hoja de cálculo.
3. Titula el archivo: `Jóvenes en Misión SMP 2026 - Parroquia San Martín de Porres`.

### Paso 2: Abrir el Editor de Apps Script
1. En el menú superior de Google Sheets, ve a **Extensiones** > **Apps Script**.
2. En la ventana del editor, cambia el nombre del proyecto (esquina superior izquierda) a `Backend-Mision-SMP`.
3. Borra el código por defecto `function myFunction() {}`.
4. Copia todo el contenido del archivo [`Code.gs`](file:///d:/JOVENES%20EN%20SERVICIO/backend/google-apps-script/Code.gs) y pégalo en el editor.
5. Guarda los cambios con `Ctrl + S`.

### Paso 3: Inicializar las 8 Hojas
1. En la barra de herramientas del editor de Apps Script, en el selector de funciones, selecciona `setupAllSheets`.
2. Haz clic en **Ejecutar**.
3. Google solicitará autorización de permisos de lectura y escritura en la hoja:
   - Haz clic en **Revisar permisos**.
   - Elige tu cuenta de Google.
   - Haz clic en **Opciones avanzadas** > **Ir a Backend-Mision-SMP (no seguro)**.
   - Haz clic en **Permitir**.
4. Al terminar la ejecución, regresa a tu hoja de Google Sheets. Verás creadas y formateadas las 8 pestañas con sus encabezados en verde bosque y los datos semilla iniciales.

### Paso 4: Despliegue como Aplicación Web (Web App)
1. En el editor de Apps Script, haz clic en el botón azul superior **Implementar** (Deploy) > **Nueva implementación**.
2. Haz clic en el icono de engranaje a la izquierda y selecciona **Aplicación web**.
3. Configura los campos de la siguiente manera:
   - **Descripción**: `Producción v3.0 Jóvenes en Misión SMP`
   - **Ejecutar como (Execute as)**: `Yo (tu correo de Google)`
   - **Quién tiene acceso (Who has access)**: `Cualquiera (Anyone)` *(Obligatorio para que los jóvenes puedan enviar la encuesta desde sus celulares sin requerir inicio de sesión de Google)*.
4. Haz clic en **Implementar**.
5. Copia la **URL de la aplicación web** generada (ejemplo: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## 3. CONEXIÓN CON EL FRONTEND

1. Abre la aplicación web de **JÓVENES EN MISIÓN SMP**.
2. Ingresa al **Panel Pastoral** con el PIN `smp2026`.
3. Abre el modal de **Configuración** (icono de engranaje).
4. Pega la URL en el campo **URL del Web App de Google Apps Script**.
5. Haz clic en **1. Probar Conexión**. Deberá responder en verde: *"Conexión exitosa con el servicio de Google Apps Script y Google Sheets"*.
6. Haz clic en **3. Ejecutar Test E2E**. La consola ejecutará en vivo:
   - Ping de estado.
   - Escritura de fila con marca `EsPrueba = "SI"`.
   - Lectura de métricas desde la hoja.
7. Haz clic en **Guardar Configuración**.

---

## 4. INTEGRIDAD, SEGURIDAD Y PREVENCIÓN DE DUPLICADOS

1. **Mecanismo de Bloqueo Concurrente**:  
   Cada solicitud entrante a `doPost` ejecuta `LockService.getScriptLock().waitLock(15000)`. Si múltiples jóvenes envían respuestas en el mismo segundo, las solicitudes se encolan ordenadamente sin sobreescrituras ni condiciones de carrera.

2. **Idempotencia (`submissionId`)**:  
   Cada intento de guardado genera un identificador `submissionId`. Si ocurre una intermitencia de conexión en Tarija y el joven pulsa "Reintentar", el servidor reconoce el mismo identificador en la hoja `RESPUESTAS` y devuelve éxito sin duplicar el registro.

3. **Bloqueo Definitivo del Código**:  
   El código solo se marca como `usado` en `PARTICIPANTES` una vez que la fila se escribió exitosamente en `RESPUESTAS`. Si ocurre cualquier error previo, la transacción no bloquea el código falsamente.

4. **Seguridad y Criptografía**:  
   - Las contraseñas y el PIN pastoral se validan mediante **SHA-256 con Salt criptográfica**.
   - No se almacenan contraseñas en texto plano ni en Sheets ni en el navegador.
   - Las operaciones de corrección y dashboard requieren un token administrativo firmado temporal.

---

## 5. PROCEDIMIENTO PARA ACTUALIZAR EL BACKEND SIN PERDER DATOS

Cuando se requiera actualizar el código de Apps Script (por ejemplo, para agregar nuevas métricas o validar nuevos campos):

1. **Respaldar la Hoja Actual**:  
   En Google Sheets, ve a **Archivo** > **Crear una copia** (ej: `Backup_Pre_Actualizacion_Fecha`).
2. **Abrir el Editor**:  
   Ve a **Extensiones** > **Apps Script**.
3. **Actualizar el Código**:  
   Reemplaza únicamente la lógica en `Code.gs`. La función `setupAllSheets` respeta las hojas existentes y sus filas; no elimina hojas con datos existentes.
4. **Crear Nueva Versión de Despliegue**:  
   - Haz clic en **Implementar** > **Administrar implementaciones**.
   - Selecciona la implementación activa.
   - Haz clic en el icono de lápiz (Editar).
   - En el menú desplegable **Versión**, selecciona **Nueva versión**.
   - Haz clic en **Implementar**.  
   *(Esto mantiene exactamente la misma URL de Web App, por lo que no es necesario cambiarla en el frontend).*
