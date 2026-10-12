# GUÍA DE CONFIGURACIÓN DEL BACKEND GOOGLE APPS SCRIPT
## Parroquia San Martín de Porres — Tarija, Bolivia
### Proyecto: JÓVENES EN MISIÓN SMP | "La fe se vive sirviendo"

Este sistema utiliza **Google Apps Script** conectado a una **Hoja de Cálculo de Google (Google Sheets)** como backend sin costo, seguro y sin necesidad de servicios como Firebase o Supabase.

---

### PASO 1: Crear la Hoja de Cálculo en Google Drive

1. Ingresa a [Google Sheets](https://sheets.new) con la cuenta de Google de la parroquia o de confirmación.
2. Nombra el documento: `Jóvenes en Misión SMP 2026 - Respuestas`.

---

### PASO 2: Pegar el código de Apps Script

1. En la hoja de cálculo, ve al menú superior: **Extensiones > Apps Script**.
2. Borra cualquier código existente en el editor.
3. Copia y pega todo el contenido del archivo [`Code.gs`](file:///d:/JOVENES%20EN%20SERVICIO/backend/google-apps-script/Code.gs).
4. Guarda el proyecto haciendo clic en el icono de disco o con `Ctrl + S`. Nómbralo: `Backend-Mision-SMP`.

---

### PASO 3: Implementar como Aplicación Web

1. Haz clic en el botón azul superior **Implementar (Deploy)** > **Nueva implementación**.
2. Haz clic en el icono de engranaje (Seleccionar tipo) y elige **Aplicación web**.
3. Configura exactamente los siguientes campos:
   - **Descripción**: `Versión 1.0 Misión Social SMP`
   - **Ejecutar como (Execute as)**: `Yo (tu correo de Google)`
   - **Quién tiene acceso (Who has access)**: `Cualquiera (Anyone)`
     *(Es indispensable seleccionar "Cualquiera" para que el formulario de los jóvenes pueda enviar sus respuestas sin pedirles iniciar sesión de Google forzosamente).*
4. Haz clic en **Implementar**.
5. Si Google solicita autorizar permisos, haz clic en *Revisar permisos* > Selecciona tu cuenta > *Avanzado* > *Ir a Backend-Mision-SMP (no seguro)* > *Permitir*.
6. Copia la **URL de la aplicación web** generada (tiene el formato `https://script.google.com/macros/s/.../exec`).

---

### PASO 4: Vincular la URL en la Aplicación Web

1. En la aplicación web de Jóvenes en Misión SMP, ingresa al **Panel Pastoral (Admin)** con el PIN `smp2026`.
2. Haz clic en el icono de **Configuración** (rueda dentada).
3. Pega la URL copiada en el campo **URL del Web App de Google Apps Script**.
4. Haz clic en el botón **Probar Conexión**. Debe mostrar un mensaje verde: *"Conexión exitosa con el servicio de Google Apps Script"*.
5. Haz clic en **Guardar Configuración**.

¡Listo! A partir de ese momento, cada participante que llene la encuesta guardará su registro simultáneamente en la hoja de Google Sheets y en el almacenamiento local.
