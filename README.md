# JÓVENES EN MISIÓN SMP
> **«LA FE SE VIVE SIRVIENDO»**  
> **Parroquia San Martín de Porres — Tarija, Bolivia**

Sistema web integral, profesional y en tiempo real para investigar, planificar, ejecutar y evaluar la obra social comunitaria post-retiro de los jóvenes confirmados.

---

## 1. Identidad Institucional y Propósito

El sistema acompaña a los jóvenes de Confirmación de la Parroquia San Martín de Porres (Tarija), canalizando los dones del sacramento en servicio caritativo transformador:
- **Investigación diagnóstica:** Encuesta condicional por código único que indaga talentos, disponibilidad y vocación social para 3 pilares:
  1. *Pilar 1: Casa Común* (Génesis 2,15 - Cuidado ambiental en Tarija).
  2. *Pilar 2: Corazones en Acción* (Mateo 25,35-40 - Niñez y adultos mayores).
  3. *Pilar 3: Transformadores de Esperanza* (Santiago 2,14-18 - Espacios comunitarios).
- **Prevención de duplicidades y bloqueo:** Diálogo modal obligatorio, reintentos idempotentes y comprobante bloqueado con bendición parroquial.
- **Backend en tiempo real:** Conexión con Google Sheets y Google Apps Script (8 hojas estructuradas y hash SHA-256 para contraseñas).
- **Dashboard Pastoral y Equipos Mixtos:** KPIs con denominadores reales, 5 filtros reactivos, algoritmo sinodal de balance de equipos mixtos y reasignación manual asistida.
- **Módulo Documental Oficial:** Generación independiente de:
  - **Documento A:** Informe de Resultados de la Encuesta (17 secciones, PDF y Excel XLSX).
  - **Documento B:** Proyecto Pastoral de Acción Social (23 secciones, metodología Ver-Juzgar-Actuar-Evaluar-Celebrar, presupuesto en Bolivianos con detección de cotizaciones pendientes y control no destructivo de versiones).

---

## 2. Arquitectura de Software y Base de Datos

- **Frontend:** React 19, TypeScript 5, Vite, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti.
- **Backend:** Google Apps Script Web App (API REST CORS con soporte GET y POST en texto plano).
- **Base de Datos:** Google Sheets Oficial:
  - **ID de la Hoja:** `1o7P-2gQq0UnWzEfBvVwxQv8wE5FHb9idVW8RITzuWGw`
  - **URL del Libro:** [Jóvenes en Misión SMP 2026 en Google Sheets](https://docs.google.com/spreadsheets/d/1o7P-2gQq0UnWzEfBvVwxQv8wE5FHb9idVW8RITzuWGw/edit)
- **Web App Deployed URL:**
  `https://script.google.com/macros/s/AKfycby4ZtzWBq1NN8VA3xVA0TeFpSSJ4GFhnuA6A98kVopf12ZjnG-59kD018Gi-p1fTPF6/exec`
- **Hojas administradas:**
  1. `CONFIGURACION`
  2. `PARTICIPANTES`
  3. `RESPUESTAS`
  4. `RESULTADOS`
  5. `EQUIPOS`
  6. `PROYECTOS`
  7. `ACTIVIDADES`
  8. `AUDITORIA`

---

## 3. Resumen de la Auditoría Integral (Prompt 8)

### A. Pruebas Funcionales (32/32 Pruebas Pasadas)
- ✅ Portada y selección interactiva de los tres pilares.
- ✅ Cuestionario condicional adaptativo por pilar (1 pregunta por pantalla, barra de progreso).
- ✅ Diálogo modal obligatorio con texto pastoral verificado y protección contra doble clic.
- ✅ Comprobante de participación con bloqueo de reenvío y botón de impresión.
- ✅ Reintentos idempotentes seguros (`submissionId`).
- ✅ Bloqueo inmediato de códigos utilizados.
- ✅ Panel Pastoral autenticado con PIN (`smp2026`).
- ✅ Dashboard reactivo con gráficos Recharts y cálculo exacto de denominadores.
- ✅ Algoritmo sinodal de conformación de equipos mixtos con justificación por talento.
- ✅ Módulo Documental: Emisión de Documento A (17 secciones) y Documento B (23 secciones).
- ✅ Detección automática de borrador si hay menos de 3 respuestas registradas.
- ✅ Registro de auditoría para correcciones de catequistas y desbloqueos excepcionales.

### B. Pruebas de Seguridad y Privacidad
- ✅ **Cero credenciales en frontend:** No hay claves de servicio privadas ni secretos de API en el código cliente.
- ✅ **Hash salado:** El PIN administrativo y contraseñas se almacenan con SHA-256 + Salt (`SMP_TARIJA_2026_CONFIRMACION_SALT_SECURE_KEY`).
- ✅ **Concurrencia segura:** Apps Script utiliza `LockService.getScriptLock()` para prevenir condiciones de carrera.
- ✅ **Privacidad de datos:** No se publican teléfonos ni datos sensibles en vistas generales; solo se usan para la coordinación interna de cuadrillas.

### C. Pruebas de Interfaz y Diseño Responsive
- ✅ Adaptabilidad garantizada en Teléfono Móvil (<640px), Tablet (768px - 1024px) y Pantallas de Escritorio (>1280px).
- ✅ Paleta litúrgico-tarijeña: Verde Bosque (`#1B4332`), Crema (`#FDFBF7`), Terracota (`#C85A32`) y Dorado (`#D4AF37`).

---

## 4. Guía de Despliegue en GitHub

1. Instala Git o abre **GitHub Desktop**.
2. Ejecuta el archivo preparado `init-git.bat` o en la terminal ejecuta:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: Sistema integral Jóvenes en Misión SMP"
   git remote add origin https://github.com/TU_USUARIO/jovenes-en-mision-smp.git
   git push -u origin main
   ```
3. El archivo `.gitignore` ya está configurado para omitir `node_modules`, archivos `.env`, temporales y credenciales.

---

## 5. Guía de Publicación en Vercel

1. Inicia sesión en [Vercel](https://vercel.com) con tu cuenta de GitHub.
2. Selecciona **Add New > Project** e importa el repositorio de `jovenes-en-mision-smp`.
3. Vercel detectará automáticamente **Vite**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. En **Environment Variables** (opcional, ya cuenta con defaults en código):
   - `VITE_APPS_SCRIPT_URL` = `https://script.google.com/macros/s/AKfycby4ZtzWBq1NN8VA3xVA0TeFpSSJ4GFhnuA6A98kVopf12ZjnG-59kD018Gi-p1fTPF6/exec`
   - `VITE_SPREADSHEET_ID` = `1o7P-2gQq0UnWzEfBvVwxQv8wE5FHb9idVW8RITzuWGw`
   - `VITE_ADMIN_PIN` = `smp2026`
5. El archivo [`vercel.json`](file:///d:/JOVENES%20EN%20SERVICIO/vercel.json) incluido garantiza el enrutamiento correcto de la SPA sin errores 404 al recargar páginas.
6. Pulsa **Deploy**. En menos de 1 minuto tu aplicación estará disponible globalmente en una URL segura HTTPS.

---

## 6. Lista de Tareas Manuales para los Catequistas

1. **Compartir el enlace con los jóvenes:**
   - Una vez desplegada en Vercel, enviar el enlace al grupo de WhatsApp de los confirmados.
2. **Generar o distribuir códigos de acceso:**
   - En el **Panel Pastoral > Códigos de Acceso**, generar los códigos con prefijo `CONF-` para entregar uno a cada confirmando.
3. **Validación en terreno de cotizaciones:**
   - Tras consolidar las encuestas, revisar las partidas presupuestarias marcadas como *"Pendiente de cotización"* en el Documento B y registrar los costos definitivos de Tarija.
4. **Presentación de Documentos:**
   - Descargar el **Informe de Resultados (PDF)** y el **Proyecto Pastoral (PDF)** para presentarlos firmados al Párroco y al Consejo Pastoral de la Parroquia San Martín de Porres.
