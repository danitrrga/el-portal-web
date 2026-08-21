# El Portal — Spanish Product Glossary

> **This is a copied snapshot, not a live source.** Every row below is
> mechanically derived from the El Portal app's own shipped message
> catalogues — never hand-authored. The app repo
> (`/home/danitrrga/dev/Projects/el-portal`) is authoritative; if this file
> disagrees with the app's current `es.json`, the app wins and this file is
> stale. Refresh it by re-running the extraction script (below), which
> reproduces the "Derived from the app" section without hand-editing.
>
> **Why this exists (D-01/D-02, `.planning/phases/07-spanish-localization/07-CONTEXT.md`):**
> the marketing site must use the exact Spanish terms the shipped app already
> shows users. The split between translated and kept-English terms is **not
> guessable** — `Versions` becomes `Versiones` but `Trends` and
> `Dashboard` stay English. A translator who invents a term risks selling a
> reader "Tendencias" and then handing them an app that says "Trends".

## Provenance

| | |
|---|---|
| Source (English) | `/home/danitrrga/dev/Projects/el-portal/src/messages/en.json` |
| Source (Spanish) | `/home/danitrrga/dev/Projects/el-portal/src/messages/es.json` |
| App next-intl version | `^4.8.3` (`el-portal/package.json`) |
| Locale code | `es` — **not** `es-ES` (verified against `el-portal/src/lib/i18n.ts`: `locales = ['en', 'es', 'zh', 'pt', 'fr']`, no `es-ES` string anywhere in that file) |
| Extraction date | 2026-08-19 |
| Observed key counts (flattened, this extraction) | en: 1737 · es: 1694 |
| Observed key counts (07-CONTEXT.md, earlier snapshot) | en: 1,711 · es: 1,670 — the difference is the app repo evolving between the two reads, not a flattening-method artifact; both are plausible readings per `07-02-PLAN.md`'s `<interfaces>` note. Nothing in this phase gates on a specific figure. |
| Extracted rows | 747 distinct English terms (32 kept English, 715 translated) |
| Regenerate | `node scripts/extract-glossary.mjs` |

## Derived from the app

Mechanically extracted from every key present in **both** `en.json` and
`es.json` whose English value is a short noun-phrase candidate (one to three
words, no ICU placeholders, no sentence-ending punctuation, capitalized).
Deduplicated by English value — one row per term, not per key.

**Resolving a term that reads differently in different parts of the app:**
the app is not perfectly internally consistent (e.g. `Goals` reads
`Objetivos` in the sidebar nav but `Metas` in several other screens;
`Trends` stays `Trends` in the sidebar nav but reads `Tendencias` as a
page title). The extraction script resolves these by preferring the
`nav.*` namespace — the app's primary, first-encountered, most user-visible
label for a room or concept — falling back to the most frequent value when no
`nav.*` occurrence exists. Rows resolved this way are marked `translated
(resolved: nav-priority)` in the Status column below; treat the alternate
value as real but secondary, not as an error in this table.

Sorted translated-first, then kept-English — the split IS the finding.

| English | Spanish | Source key | Status |
|---|---|---|---|
| Account | Cuenta | `nav.account` | translated |
| Account Already Exists | La Cuenta Ya Existe | `auth.conflict.title` | translated |
| Account Details | Detalles de la Cuenta | `settings.account.accountDetails` | translated |
| Account Information | Información de la Cuenta | `settings.account.accountInfo` | translated |
| Achievements | Logros | `notifications.sectionAchievements` | translated |
| Action Plan (Subtasks) | Plan de Acción (Subtareas) | `goals.actionPlan` | translated |
| Action Required | Acción Requerida | `notifications.sectionActionRequired` | translated |
| Actions | Acciones | `database.actions` | translated |
| Activate | Activar | `lab.activate` | translated |
| Active | Activo | `common.active` | translated |
| Active Goals | Metas Activas | `cycles.activeGoals` | translated |
| Active Status | Estado Activo | `lab.activeStatus` | translated |
| Activities | Actividades | `trends.activities.title` | translated |
| Add | Agregar | `common.add` | translated |
| Add a step | Añadir un paso | `archives.addNewItem` | translated |
| Add Characteristic | Agregar Característica | `cycles.addCharacteristic` | translated |
| ADD CYCLE | AGREGAR CICLO | `lab.addCycle` | translated |
| ADD FRICTION | AÑADIR FRICCIÓN | `goalsPage.addFriction` | translated |
| Add Goal | Agregar Meta | `lab.addGoal` | translated (resolved: nav-priority) |
| Add Habit | Agregar Hábito | `lab.addHabit` | translated |
| ADD ITEM | AGREGAR | `lab.addItem` | translated |
| Add Mantra | Agregar Mantra | `cycles.addMantra` | translated |
| Add New Goal | Agregar Nueva Meta | `goals.addGoal` | translated |
| Add priority | Agregar prioridad | `cycles.addPriority` | translated |
| Add problem | Agregar problema | `cycles.addProblem` | translated |
| Add Skill | Agregar Habilidad | `cycles.addSkill` | translated |
| Add Slide | Agregar Diapositiva | `cinema.addSlide` | translated |
| Alignment | Alineación | `goalsPage.alignmentForecast` | translated |
| All | Todos | `common.all` | translated |
| All Changes Saved | Todos los Cambios Guardados | `archives.allChangesSaved` | translated |
| All time | Todo el tiempo | `settings.pulseInsights.dataWindowAll` | translated |
| All Types | Todos los Tipos | `goalsPage.typeAll` | translated |
| Already added | Ya agregado | `pulse.checkin.alreadyAdded` | translated |
| Amazing | Increíble | `pulse.checkin.sleepLabel5` | translated |
| Analysis window | Ventana de análisis | `settings.pulseInsights.dataWindow` | translated |
| Anchor a thought | Anclar un pensamiento | `identity.newMantra` | translated |
| Anonymous usage stats | Estadísticas de uso anónimas | `welcomeConsent.telemetry.label` | translated |
| Anxious | Ansioso | `pulse.checkin.feeling_anxious` | translated |
| Appearance | Apariencia | `nav.appearance` | translated |
| Archive | Archivar | `lab.archive` | translated |
| Archived | Archivado | `common.archived` | translated |
| Archives | Archivos | `nav.archives` | translated |
| At Risk | En Riesgo | `goalsPage.atRisk` | translated |
| Auth Providers | Proveedores de Autenticación | `settings.account.authProviders` | translated |
| AUTO-SUGGESTED | AUTO-SUGERIDO | `cycles.autoSuggested` | translated |
| Avatars | Avatares | `settings.storage.avatars` | translated |
| Avg Daily Progress | Progreso Diario Prom | `database.avgDailyProgress` | translated |
| Avg day | Media diaria | `cycleReport.header.avgDay` | translated |
| Avg progress | Progreso medio | `goalsPage.kpiAvgProgress` | translated |
| Avg score | Puntuación media | `trends.performanceKpi.avgScore` | translated |
| Avg Score | Puntaje Prom | `history.avgScore` | translated |
| Back | Atrás | `common.back` | translated (resolved: nav-priority) |
| Back to Form | Volver al Formulario | `habits.backToForm` | translated |
| Basic features | Funciones básicas | `settings.account.basicFeatures` | translated |
| Bedtime | Hora de dormir | `trends.bedtime.title` | translated |
| Behind | Atrasado | `goalsPage.behind` | translated |
| Best | Mejor | `trends.reports.preview.best` | translated |
| Best day | Mejor día | `trends.performanceKpi.bestDay` | translated |
| Best streak | Mejor racha | `trends.performanceKpi.bestStreak` | translated |
| Best Streak | Mejor Racha | `dashboard.bestStreak` | translated |
| Between cycles | Entre ciclos | `dashboard.cycleStatus.noCycleLabel` | translated |
| Block type | Tipo de bloque | `archives.toolbarBlockType` | translated |
| Bold | Negrita | `archives.toolbarBold` | translated |
| Boost | Sube | `trends.correlation.positiveLabel` | translated |
| Breakdown | Desglose | `settings.storage.breakdown` | translated |
| Bullet list | Lista con viñetas | `archives.toolbarBulletList` | translated |
| By weekday | Por día de la semana | `trends.weekday.title` | translated |
| Calm | Calmado | `pulse.checkin.feeling_calm` | translated |
| Cancel | Cancelar | `common.cancel` | translated |
| Caption | Leyenda | `database.caption` | translated |
| Carry Forward | Continuar | `goalsPage.carryForward` | translated |
| Category | Categoría | `habits.category` | translated |
| Change Password | Cambiar Contraseña | `settings.account.changePassword` | translated |
| Characteristic | Característica | `database.characteristic` | translated |
| Characteristics | Características | `lab.characteristics` | translated |
| Characteristics Focus | Enfoque de Características | `cycles.characteristicsFocus` | translated |
| Check-in Complete | Check-in Completo | `pulse.checkin.completeTitle` | translated |
| Check-in Reminders | Recordatorios de Check-in | `settings.pulse.reminders` | translated |
| Checklist | Lista de verificación | `archives.toolbarChecklist` | translated |
| Clean division | División exacta | `settings.general.cleanDivision` | translated |
| Clear | Despejado | `pulse.checkin.feeling_clear` | translated (resolved: nav-priority) |
| Clear all | Limpiar todo | `notifications.dismissAll` | translated |
| Close | Cerrar | `common.close` | translated |
| Close cycle | Cerrar ciclo | `cycleReport.reflection.closeCycle` | translated |
| Code | Código | `archives.toolbarCode` | translated |
| Collapse | Contraer | `common.collapse` | translated |
| Collapse Sidebar | Contraer Barra Lateral | `archives.collapseSidebar` | translated |
| Collapsed | Contraída | `settings.appearance.collapsed` | translated |
| Coming soon | Próximamente | `common.comingSoon` | translated |
| Complete | Completa | `trends.cycles.goalJourney.complete` | translated |
| Completed | Completado | `lab.completed` | translated |
| Completed cycle | Ciclo completado | `trends.cycles.completedCycle` | translated |
| Completion | Completado | `database.completion` | translated |
| Completion Forecast | Pronóstico de Completado | `goalsPage.completionForecast` | translated |
| Confident | Seguro | `pulse.checkin.feeling_confident` | translated |
| Configure | Configurar | `lab.configure` | translated |
| Confirm | Confirmar | `common.confirm` | translated |
| Confirm close | Confirmar cierre | `cycleReport.reflection.confirmClose` | translated |
| Confirm password | Confirmar contraseña | `settings.account.confirmPasswordPlaceholder` | translated |
| Confirm Password | Confirmar Contraseña | `auth.signup.confirmPassword` | translated |
| Connected | Conectado | `settings.account.connected` | translated |
| Connectedness | Conexión | `trends.vitals.connectedness` | translated |
| Connection Error | Error de Conexión | `archives.connectionError` | translated |
| Consistency | Consistencia | `goals.consistency` | translated (resolved: nav-priority) |
| Continue | Continuar | `onboarding.cta.continue` | translated |
| Continue with Google | Continuar con Google | `auth.login.googleSignIn` | translated |
| Correlation | Correlación | `onboarding.card.corr` | translated |
| Correlations | Correlaciones | `trends.insightsTab.thresholds.correlations` | translated |
| Create | Crear | `common.create` | translated |
| Create & Link | Crear y Enlazar | `goalsPage.createAndLink` | translated |
| Create account | Crear cuenta | `auth.signup.submit` | translated |
| Create Cycle | Crear Ciclo | `cycles.createCycle` | translated |
| Create Goal | Crear Meta | `goals.createGoal` | translated |
| Create New | Crear Nuevo | `habits.createNew` | translated |
| Create password | Crear contraseña | `settings.account.createPasswordPlaceholder` | translated |
| Create version | Crear versión | `dashboard.cycleStatus.noVersionCta` | translated |
| Create Version | Crear Versión | `version.createVersion` | translated |
| Created | Creado | `database.created` | translated |
| Creative | Creativo | `pulse.checkin.feeling_creative` | translated |
| Current | Actual | `trends.wellbeingScore.legendCurrent` | translated |
| Current cycle | Ciclo actual | `trends.cycles.currentCycle` | translated |
| Current Cycle | Ciclo Actual | `goals.currentCycle` | translated |
| Current Friction/Problems | Fricción/Problemas Actuales | `cycles.currentFrictionProblems` | translated |
| Current Mantras | Mantras Actuales | `dashboard.currentMantras` | translated |
| Current Password | Contraseña Actual | `settings.account.currentPassword` | translated |
| Current Streak | Racha Actual | `dashboard.currentStreak` | translated |
| Current Version | Versión Actual | `lab.currentVersion` | translated |
| Cycle | Ciclo | `history.cycle` | translated |
| CYCLE | CICLO | `dashboard.cycle` | translated |
| Cycle · Version | Ciclo · Versión | `database.cycleVersion` | translated |
| Cycle Complete | Ciclo Completado | `notifications.cycleEnded` | translated |
| Cycle deadlines | Fechas límite de ciclo | `settings.pulseInsights.notifCycleDeadlines` | translated |
| Cycle digest | Resumen del ciclo | `settings.pulseInsights.digestLabel_per_cycle` | translated |
| Cycle Duration | Duración del Ciclo | `cycles.cycleDuration` | translated |
| Cycle Editor | Editor de Ciclo | `cycles.cycleEditor` | translated |
| Cycle Ends Tomorrow | El Ciclo Termina Mañana | `notifications.cycleEndingTomorrow` | translated |
| CYCLE GOALS | METAS DEL CICLO | `dashboard.cycleGoals` | translated |
| Cycle Habits | Hábitos del Ciclo | `cycles.cycleHabits` | translated |
| Cycle Mission Status | Estado de Misión | `goalsPage.cycleMissionStatus` | translated |
| CYCLE PROGRESS | PROGRESO DEL CICLO | `dashboard.cycleProgress` | translated |
| Cycle Settings | Configuración del Ciclo | `lab.cycleSettings` | translated |
| Cycles | Ciclos | `database.cycles` | translated |
| Cycles Log | Registro de Ciclos | `lab.cyclesLog` | translated |
| Cycles per Version | Ciclos por Versión | `settings.general.cyclesPerVersion` | translated |
| Daily Progress | Progreso Diario | `database.dailyProgress` | translated |
| Daily Pulse | Pulse Diario | `notifications.sectionDailyPulse` | translated |
| Daily Score | Puntaje Diario | `dashboard.dailyScore` | translated |
| Daily Score Trend | Tendencia de Puntuación Diaria | `trends.performance.dailyScoreTitle` | translated |
| Dark | Oscuro | `settings.appearance.dark` | translated |
| Dark Mode | Modo Oscuro | `settings.appearance.darkMode` | translated |
| Data | Datos | `settings.storage.data` | translated |
| Data Points | Puntos de Datos | `history.dataPoints` | translated |
| Database Search | Buscar en Base de Datos | `goals.databaseSearch` | translated |
| Dates | Fechas | `database.dates` | translated |
| Day | Día | `trends.cycles.dayOf` | translated |
| Day Inspector | Inspector de Día | `history.dayInspector` | translated |
| DAY INSPECTOR | INSPECTOR DE DÍA | `dashboard.dayInspector` | translated |
| Days Left | Días Restantes | `dashboard.daysLeft` | translated |
| Days logged | Días registrados | `cycleReport.header.daysLogged` | translated |
| Days per cycle | Días por ciclo | `settings.general.daysPerCycle` | translated |
| Days Progress | Progreso de Días | `goalsPage.daysProgress` | translated |
| Debrief available | Debrief disponible | `settings.pulseInsights.notifDebriefReady` | translated |
| Debrief cycle | Cerrar ciclo | `lab.debriefCycle` | translated (resolved: nav-priority) |
| Decent | Decente | `pulse.checkin.productivityLabel3` | translated |
| Declining | Decayendo | `goalsPage.trendDeclining` | translated (resolved: nav-priority) |
| Deep Work | Trabajo Profundo | `dashboard.deepWork` | translated |
| Deeply Connected | Muy conectado | `pulse.checkin.connectednessLabel5` | translated |
| Default Collapsed | Contraída por Defecto | `settings.appearance.defaultCollapsed` | translated |
| Define the archetype… | Define el arquetipo… | `version.descriptionPlaceholder` | translated |
| Delete | Eliminar | `common.delete` | translated |
| Delete Account | Eliminar Cuenta | `settings.account.deleteAccount` | translated |
| Delete Cycle | Eliminar Ciclo | `lab.deleteCycle` | translated |
| Delete document | Eliminar documento | `archives.deleteDocument` | translated |
| Delete Forever | Eliminar Permanentemente | `settings.account.deleteForever` | translated |
| Delete Goal | Eliminar Meta | `lab.deleteGoal` | translated |
| Delete mantra | Eliminar mantra | `identity.deleteMantra` | translated |
| Delete slide | Eliminar diapositiva | `cinema.deleteTitle` | translated |
| Deleting… | Eliminando… | `settings.account.deleting` | translated |
| Description | Descripción | `goals.description` | translated |
| Directions | Direcciones | `trends.vitals.directionsTitle` | translated |
| Disabled | Desactivado | `common.disabled` | translated |
| Dismiss | Descartar | `notifications.dismiss` | translated |
| Display Language | Idioma de Interfaz | `settings.general.displayLanguage` | translated |
| Distant | Distante | `pulse.checkin.connectednessLabel2` | translated |
| Done | Listo | `common.done` | translated |
| Drag to resize | Arrastra para redimensionar | `archives.dragToResize` | translated |
| Drained | Agotado | `pulse.checkin.energyLabel1` | translated |
| Drive | Motor | `trends.cycles.identity.drive` | translated |
| Driven | Motivado | `pulse.checkin.motivationLabel4` | translated |
| Drop | Baja | `trends.correlation.negativeLabel` | translated |
| Duplicate | Duplicar | `common.duplicate` | translated |
| Duration | Duración | `trends.sleep.durationTitle` | translated |
| Edit | Editar | `common.edit` | translated |
| Edit Check-in | Editar Check-in | `pulse.page.edit` | translated |
| Edit Content | Editar Contenido | `lab.editContent` | translated |
| Edit cycle | Editar ciclo | `database.editCycle` | translated |
| Edit Cycle | Editar Ciclo | `lab.editCycle` | translated |
| Edit goal | Editar meta | `database.editGoal` | translated |
| Edit Goal | Editar Meta | `lab.editGoal` | translated |
| Edit habit | Editar hábito | `database.editHabit` | translated |
| Edit Habit | Editar Hábito | `lab.editHabit` | translated |
| Edit version | Editar versión | `database.editVersion` | translated |
| Edit Version | Editar Versión | `version.editVersionTitle` | translated |
| Efficiency | Eficiencia | `dashboard.efficiency` | translated |
| Elevated | Elevado | `cycleReport.livedExperience.axisMoodHigh` | translated |
| Elite Performance | Rendimiento Élite | `history.elitePerformance` | translated |
| Email | Correo | `settings.account.email` | translated |
| Email & Password | Correo y Contraseña | `settings.account.emailAndPassword` | translated |
| Email address | Correo electrónico | `auth.login.email` | translated |
| Email Address | Correo Electrónico | `settings.account.emailAddress` | translated |
| Email linked successfully | Correo vinculado exitosamente | `settings.account.emailLinked` | translated |
| Emotion Trends | Tendencias Emocionales | `trends.emotions.trends` | translated |
| Emotions & Feelings | Emociones y Sentimientos | `trends.emotions.title` | translated |
| Enabled | Activado | `common.enabled` | translated |
| End Date | Fecha de Fin | `lab.endDate` | translated |
| Energized | Energizado | `pulse.checkin.energyLabel4` | translated |
| Energy | Energía | `trends.vitals.energy` | translated |
| Energy Curve | Curva de Energía | `trends.cycles.energyCurve.title` | translated |
| Energy dropped sharply | La energía cayó bruscamente | `trends.insights.patternHeadline` | translated |
| Evening check-in | Check-in vespertino | `dashboard.eveningCheckin` | translated |
| Evening Check-in | Check-in Nocturno | `settings.pulse.eveningReminder` | translated |
| Expand | Expandir | `common.expand` | translated |
| Expand Sidebar | Expandir Barra Lateral | `archives.expandSidebar` | translated |
| Expanded | Expandida | `settings.appearance.expanded` | translated |
| External | Externo | `database.external` | translated |
| F | V | `trends.dayFri` | translated |
| Failed to save | Error al guardar | `settings.pulse.saveFailed` | translated |
| Family | Familia | `pulse.checkin.focus_family` | translated |
| Features | Funciones | `settings.general.features` | translated |
| File Storage | Almacenamiento de Archivos | `settings.storage.fileStorage` | translated |
| Final score | Puntuación final | `trends.cycles.finalScore` | translated |
| Finish the tour | Terminar el tour | `onboarding.tour.done` | translated |
| Finished | Finalizado | `lab.finished` | translated |
| Focus | Enfoque | `trends.reports.preview.focus` | translated (resolved: nav-priority) |
| Focus and Friction | Enfoque y Fricción | `dashboard.focusAndFriction` | translated |
| Focus priorities | Prioridades de enfoque | `cycleReport.ledger.focusPriorities` | translated |
| Focus Priorities | Prioridades | `goalsPage.focusPriorities` | translated (resolved: nav-priority) |
| Focused | Enfocado | `pulse.checkin.feeling_focused` | translated |
| Fri | Vie | `trends.weekday.fri` | translated |
| Friction | Fricción | `dashboard.friction` | translated |
| Friday | viernes | `trends.insights.weekdayFriday` | translated (resolved: nav-priority) |
| From History | Desde Historial | `habits.fromHistory` | translated |
| Frustrated | Frustrado | `pulse.checkin.feeling_frustrated` | translated |
| Full Name | Nombre Completo | `auth.signup.fullName` | translated |
| Goal Completed | Objetivo Completado | `notifications.goalCompleted` | translated |
| Goal completion progression | Progresión de objetivos | `cycleReport.performance.goalProgress` | translated |
| Goal completions | Metas completadas | `settings.pulseInsights.notifGoalCompletions` | translated |
| Goal Evolution | Evolución de Objetivos | `goalsPage.evolutionSection` | translated |
| Goal Title | Título de la Meta | `goals.goalTitle` | translated |
| Goal Type | Tipo de Meta | `goals.goalType` | translated |
| Goals | Objetivos | `nav.goals` | translated (resolved: nav-priority) |
| GOALS | METAS | `dashboard.goals` | translated |
| Goals done | Objetivos hechos | `goalsPage.kpiGoalsDone` | translated |
| Goals hit | Metas logradas | `trends.cycles.goalsHit` | translated |
| Goals moved | Metas movidas | `cycleReport.header.goalsMoved` | translated |
| Goals on track | Metas al día | `trends.cycles.goalsOnTrack` | translated |
| Good | Bueno | `cycleReport.livedExperience.moodBand4` | translated |
| Google account linked | Cuenta de Google vinculada | `settings.account.googleLinked` | translated |
| Grateful | Agradecido | `pulse.checkin.feeling_grateful` | translated |
| Great | Bien | `pulse.checkin.sleepLabel4` | translated (resolved: nav-priority) |
| Habit | Hábito | `lab.habitType` | translated |
| Habit Library | Biblioteca de Hábitos | `habits.habitLibrary` | translated |
| Habit Link Needed | Enlace de Hábito Necesario | `goalsPage.habitLinkNeeded` | translated |
| Habit Metric | Métrica de Hábito | `goals.habitMetric` | translated |
| Habit Name | Nombre del Hábito | `habits.habitName` | translated |
| HABIT TRACKER | RASTREADOR DE HÁBITOS | `dashboard.habitTracker` | translated |
| Habits | Hábitos | `nav.habits` | translated |
| HABITS | HÁBITOS | `cycles.habits` | translated |
| Habits & Logs | Hábitos y Registros | `settings.storage.habitsAndLogs` | translated |
| Habits done | Hábitos hechos | `trends.performanceKpi.habitsDone` | translated |
| Habits held | Hábitos cumplidos | `cycleReport.header.habitsHeld` | translated |
| Health | Salud | `pulse.checkin.focus_health` | translated |
| Hide Archived | Ocultar Archivados | `lab.hideArchived` | translated |
| High | Alta | `goals.priorityHigh` | translated (resolved: nav-priority) |
| High (4) | Alto (4) | `habits.weightHigh` | translated |
| High Priority | Alta Prioridad | `lab.highPriority` | translated |
| Highlights | Destacados | `trends.reports.preview.highlights` | translated |
| History | Historial | `nav.history` | translated |
| Horizontal rule | Línea horizontal | `archives.toolbarHorizontalRule` | translated |
| How it works | Cómo funciona | `empty.stepsCaption` | translated |
| Identity | Identidad | `nav.identity` | translated |
| IDENTITY | IDENTIDAD | `cycles.identity` | translated |
| Identity & Mantras | Identidad y Mantras | `settings.storage.identityAndMantras` | translated |
| Identity Evolution | Evolución de Identidad | `trends.cycles.identity.title` | translated |
| Identity Kernel | Núcleo de Identidad | `lab.identityKernel` | translated |
| Identity System | Sistema de Identidad | `settings.general.identitySystem` | translated |
| Identity Title | Título de Identidad | `version.identityTitle` | translated |
| Impact Weight | Peso de Impacto | `habits.impactWeight` | translated |
| Import | Importar | `lab.import` | translated |
| Improving | Mejorando | `goalsPage.trendImproving` | translated |
| Include | Incluir | `trends.reports.include` | translated |
| Include habits | Incluir hábitos | `settings.pulseInsights.includeHabits` | translated |
| Indifferent | Indiferente | `pulse.checkin.feeling_indifferent` | translated |
| Initialize Cycle | Inicializar Ciclo | `cycles.initializeCycle` | translated |
| Initialize New Cycle | Inicializar Nuevo Ciclo | `cycles.initializeNewCycle` | translated |
| Initialize New Version | Inicializar Nueva Versión | `version.initialize` | translated |
| Initialize version | Iniciar versión | `empty.noVersion.action` | translated |
| Initialize Version | Inicializar Versión | `version.initializeVersion` | translated |
| Initialize Version 1.0 | Inicializar Versión 1.0 | `dashboard.initializeVersion` | translated |
| Initializing Portal… | Inicializando Portal… | `dashboard.initializingPortal` | translated |
| Insert link | Insertar enlace | `archives.toolbarInsertLink` | translated |
| Inspired | Inspirado | `pulse.checkin.feeling_inspired` | translated |
| Intent vs outcome | Intención vs resultado | `cycleReport.ledger.title` | translated |
| Is Active | Está Activo | `lab.isActive` | translated |
| Isolated | Aislado | `pulse.checkin.connectednessLabel1` | translated |
| Italic | Cursiva | `archives.toolbarItalic` | translated |
| Joyful | Alegre | `pulse.checkin.feeling_joyful` | translated |
| Key Insights | Hallazgos Clave | `trends.reports.preview.insights` | translated |
| Keyboard Shortcuts | Atajos de Teclado | `settings.general.keyboardShortcutHints` | translated |
| Language | Idioma | `settings.general.language` | translated |
| Last 3 months | Últimos 3 meses | `settings.pulseInsights.dataWindow3m` | translated |
| Last 6 months | Últimos 6 meses | `settings.pulseInsights.dataWindow6m` | translated |
| Last month | Mes pasado | `trends.timeNav.lastMonth` | translated |
| Last week | Semana pasada | `trends.timeNav.lastWeek` | translated |
| Last year | Año pasado | `trends.timeNav.lastYear` | translated |
| Learning | Aprendizaje | `pulse.checkin.focus_learning` | translated |
| Learning focus | Enfoque de aprendizaje | `cycleReport.ledger.learningFocus` | translated |
| Learning Focus | Enfoque de Aprendizaje | `dashboard.learningFocus` | translated |
| Library | Biblioteca | `archives.bank` | translated |
| Life Checklist | Checklist de Vida | `archives.tabLifeChecklist` | translated (resolved: nav-priority) |
| Lifetime | De por vida | `settings.account.lifetime` | translated |
| Lifetime access | Acceso de por vida | `settings.account.lifetimeAccess` | translated |
| Light | Claro | `settings.appearance.light` | translated |
| Light Mode | Modo Claro | `settings.appearance.lightMode` | translated |
| Link | Vincular | `settings.account.link` | translated |
| Link Account | Vincular Cuenta | `settings.account.linkAccount` | translated |
| Link Existing | Enlazar Existente | `goalsPage.linkExisting` | translated |
| Link Habit | Vincular Hábito | `lab.linkHabit` | translated |
| Link Habit Source | Vincular Fuente de Hábito | `goals.linkHabitSource` | translated |
| Linked | Vinculado | `cycles.linked` | translated |
| Linked Accounts | Cuentas Vinculadas | `settings.account.linkedAccounts` | translated |
| Linked Goal | Meta Vinculada | `habits.linkedGoal` | translated |
| Loading Goals… | Cargando Objetivos… | `goalsPage.loading` | translated |
| Loading Lab Environment… | Cargando Entorno del Lab… | `lab.loadingLab` | translated |
| Loading Temporal Records… | Cargando Registros Temporales… | `history.loading` | translated |
| Loading… | Cargando… | `common.loading` | translated |
| Log in | Iniciar sesión | `auth.login.submit` | translated (resolved: nav-priority) |
| Log out | Cerrar Sesión | `nav.logOut` | translated (resolved: nav-priority) |
| Lonely | Solo | `pulse.checkin.feeling_lonely` | translated |
| Low | Bajo | `cycleReport.livedExperience.axisLow` | translated (resolved: nav-priority) |
| Low (1) | Bajo (1) | `habits.weightLow` | translated |
| Lowest | Más bajo | `trends.reports.preview.lowest` | translated |
| M | L | `trends.dayMon` | translated |
| M,T,W,T,F,S,S | L,M,X,J,V,S,D | `trends.insightsTab.visual.dayInitials` | translated |
| Manage | Gestionar | `common.manage` | translated |
| Manage Categories | Gestionar Categorías | `habits.manageCategories` | translated |
| Manage Goals | Gestionar Metas | `lab.manageGoals` | translated |
| Manage Habits | Gestionar Hábitos | `lab.manageHabits` | translated |
| Mark as complete | Marcar como completo | `history.markComplete` | translated |
| Mark as incomplete | Marcar como incompleto | `history.markIncomplete` | translated |
| Mark complete | Marcar completo | `dashboard.markComplete` | translated |
| Max Streak | Racha Máxima | `history.maxStreak` | translated |
| Maximum 5 priorities | Máximo 5 prioridades | `cycles.maxPriorities` | translated |
| Media | Medios | `settings.storage.media` | translated |
| Medium | Media | `lab.medium` | translated |
| Medium (2) | Medio (2) | `habits.weightMedium` | translated |
| Member since | Miembro desde | `settings.account.memberSince` | translated |
| Metric | Métrica | `dashboard.metric` | translated |
| Metric Score | Puntaje de Métrica | `database.metricScore` | translated |
| Metrics | Métricas | `goalsPage.filterMetrics` | translated |
| Metrics Progress | Progreso de Métricas | `goalsPage.metricsProgress` | translated |
| Mild | Leve | `pulse.checkin.stressLabel2` | translated |
| MISS | FALLO | `dashboard.miss` | translated |
| Moderate | Moderado | `goalsPage.strengthModerate` | translated (resolved: nav-priority) |
| Mon | Lun | `trends.weekday.mon` | translated |
| Monday | lunes | `trends.insights.weekdayMonday` | translated (resolved: nav-priority) |
| Month | Mes | `trends.timeScale.month` | translated |
| Monthly | Mensual | `settings.pulseInsights.reportMonthly` | translated |
| Monthly digest | Resumen mensual | `settings.pulseInsights.digestLabel_monthly` | translated |
| Mood | Ánimo | `cycleReport.livedExperience.mood` | translated (resolved: nav-priority) |
| Mood calendar | Calendario de ánimo | `trends.mood.calendarAriaLabel` | translated |
| Mood Calendar | Calendario de Ánimo | `trends.mood.calendar` | translated |
| Mood closed | Ánimo al cierre | `cycleReport.header.moodClosed` | translated |
| Mood Distribution | Distribución de Ánimo | `trends.mood.distribution` | translated |
| Mood Shift | Cambio de Ánimo | `trends.moodDelta.title` | translated |
| Mood Trend | Tendencia de Ánimo | `trends.moodTrend.title` | translated |
| Morning | Mañana | `cycleReport.livedExperience.pulseMorning` | translated |
| Morning check-in | Check-in matutino | `dashboard.morningCheckin` | translated |
| Morning Check-in | Check-in Matutino | `settings.pulse.morningReminder` | translated |
| Most Experienced | Más Experimentados | `trends.emotions.mostExperienced` | translated |
| Motivated | Motivado | `pulse.checkin.feeling_motivated` | translated |
| Motivation | Motivación | `trends.vitals.motivation` | translated |
| Name | Nombre | `database.name` | translated |
| Name this slide | Nombra esta diapositiva | `cinema.titlePlaceholder` | translated |
| Narrative | Narrativa | `trends.reports.narrative` | translated |
| New | Nuevo | `archives.newItem` | translated |
| New Cycle | Nuevo Ciclo | `lab.newCycle` | translated |
| New goal | Nuevo objetivo | `goalsPage.newGoal` | translated |
| New Insight Report | Nuevo informe de insights | `notifications.newInsightReport` | translated |
| New insights | Nuevas perspectivas | `settings.pulseInsights.notifNewInsights` | translated |
| New item… | Nuevo elemento… | `lab.newItemPlaceholder` | translated |
| New Mantra… | Nuevo Mantra… | `cycles.newMantraPlaceholder` | translated |
| New note | Nota nueva | `archives.defaultTheoryNote` | translated (resolved: nav-priority) |
| New password | Nueva contraseña | `settings.account.newPasswordPlaceholder` | translated |
| New Password | Nueva Contraseña | `settings.account.newPassword` | translated |
| New routine | Nueva rutina | `archives.defaultNewEntry` | translated |
| New Version | Nueva Versión | `lab.newVersion` | translated |
| Newer report | Reporte más reciente | `trends.insightsTab.history.next` | translated |
| Newest | Más Recientes | `database.newest` | translated |
| Next | Siguiente | `common.next` | translated |
| Next cycle | Ciclo siguiente | `goalsPage.nextCycle` | translated |
| Next period | Siguiente periodo | `trends.timeNav.nextPeriod` | translated (resolved: nav-priority) |
| Night | Noche | `cycleReport.livedExperience.pulseNight` | translated |
| No active cycle | Sin ciclo activo | `dashboard.emptySection.cycleBar` | translated |
| No Active Cycle | Sin Ciclo Activo | `notifications.noCycle` | translated |
| No active version | Sin versión activa | `dashboard.cycleStatus.noVersionLabel` | translated |
| No Active Version | Sin Versión Activa | `lab.noActiveVersion` | translated |
| No characteristics selected | Sin características seleccionadas | `cycles.noCharacteristicsSelected` | translated |
| No cycles found | No se encontraron ciclos | `database.noCyclesFound` | translated |
| No data yet | Sin datos aún | `trends.correlation.noData` | translated |
| No files stored | Sin archivos almacenados | `settings.storage.noFiles` | translated |
| No friction defined | Sin fricción definida | `dashboard.noFriction` | translated |
| No goals set | Sin metas definidas | `dashboard.emptySection.kpiGoals` | translated |
| No goals yet | Aún no hay metas | `lab.noGoals` | translated |
| No habit linked | Sin hábito vinculado | `goalsPage.noLinkedHabit` | translated |
| No habits yet | Aún no hay hábitos | `lab.noHabits` | translated |
| No mantras selected | Sin mantras seleccionados | `dashboard.noMantras` | translated |
| No priorities defined | Sin prioridades definidas | `dashboard.noPriorities` | translated |
| No progress yet | Sin progreso aún | `trends.cycles.goalJourney.noProgress` | translated |
| No projects tracked | Sin proyectos en seguimiento | `goalsPage.zoneProjectsEmpty` | translated |
| No results found | Sin resultados | `common.noResults` | translated |
| No skills selected | Sin habilidades seleccionadas | `cycles.noSkillsSelected` | translated |
| No subtasks | Sin subtareas | `dashboard.noSubtasks` | translated |
| None | Ninguna | `pulse.checkin.motivationLabel1` | translated (resolved: nav-priority) |
| None (standalone) | Ninguna (independiente) | `habits.noLinkedGoal` | translated |
| Not defined | Indefinido | `common.notDefined` | translated |
| Not evenly divisible | No es divisible exactamente | `settings.general.notEvenlyDivisible` | translated |
| Not yet | Pendiente | `pulse.page.notYet` | translated |
| Note: | Nota: | `habits.noteLabel` | translated |
| Nothing selected | Nada seleccionado | `archives.noItemSelected` | translated |
| Nothing tracked today | Nada registrado hoy | `dashboard.emptySection.kpiToday` | translated |
| Notifications | Notificaciones | `settings.tabs.notifications` | translated |
| Number | Número | `database.number` | translated |
| Number of sprints | Número de sprints | `settings.general.numberOfSprints` | translated |
| Numbered list | Lista numerada | `archives.toolbarNumberedList` | translated |
| Off | No | `settings.pulseInsights.off` | translated |
| Okay | Regular | `pulse.checkin.sleepLabel3` | translated (resolved: nav-priority) |
| Older report | Reporte anterior | `trends.insightsTab.history.previous` | translated |
| Oldest | Más Antiguos | `database.oldest` | translated |
| On | Sí | `settings.pulseInsights.on` | translated |
| On cycle end | Por ciclo | `settings.pulseInsights.reportPerCycle` | translated |
| On Fire | En llamas | `pulse.checkin.productivityLabel5` | translated |
| On Track | En Curso | `goalsPage.onTrack` | translated |
| Onboarding progress | Progreso de la introducción | `onboarding.a11y.progress` | translated |
| Open | Abrir | `database.open` | translated |
| Open builder | Abrir editor | `settings.general.reportBuilder.cta` | translated |
| Open the Lab | Abrir el Lab | `identity.openLab` | translated (resolved: nav-priority) |
| Open the portal | Abrir el portal | `onboarding.cta.finish` | translated |
| Other | Otros | `trends.activities.other` | translated |
| Other files | Otros archivos | `settings.storage.otherFiles` | translated |
| Overwhelmed | Abrumado | `pulse.checkin.stressLabel5` | translated |
| Password | Contraseña | `auth.login.password` | translated |
| Password authentication enabled | Autenticación por contraseña habilitada | `settings.account.passwordLinked` | translated |
| Password updated | Contraseña actualizada | `settings.account.passwordUpdated` | translated |
| Past Cycles | Ciclos Anteriores | `goalsPage.pastCycles` | translated |
| Paste Image URL… | Pega URL de imagen… | `cinema.pasteImageUrl` | translated |
| Pattern detection | Detección de patrones | `trends.insightsTab.thresholds.patterns` | translated |
| Patterns | Patrones | `trends.cycles.sections.patterns` | translated |
| Patterns found | Patrones encontrados | `trends.insightsTab.patterns` | translated |
| Peaceful | Tranquilo | `pulse.checkin.feeling_peaceful` | translated |
| Perfect days | Días perfectos | `lab.statPerfectDays` | translated |
| Perfect Days | Días Perfectos | `history.perfectDays` | translated |
| Performance | Rendimiento | `history.performance` | translated |
| Performance Analytics | Analíticas de Rendimiento | `history.title` | translated |
| Performance Trajectory | Trayectoria de Rendimiento | `history.performanceTrajectory` | translated |
| Period | Período | `trends.reports.period` | translated |
| Permanently delete account | Eliminar cuenta permanentemente | `settings.account.permanentlyDelete` | translated |
| Persona Definition | Definición de Persona | `version.personaDefinition` | translated |
| Personal insights | Perspectivas personales | `settings.pulseInsights.insightsEnabled` | translated |
| Personal Report | Reporte Personal | `trends.report.title` | translated |
| Planned | Planificado | `lab.planned` | translated |
| Preview | Vista previa | `trends.reports.previewLabel` | translated |
| Previous | Anterior | `trends.wellbeingScore.legendPrevious` | translated |
| Previous cycle | Ciclo anterior | `goalsPage.previousCycle` | translated |
| Previous period | Periodo anterior | `trends.timeNav.previousPeriod` | translated (resolved: nav-priority) |
| Previous stories | Historias anteriores | `trends.insightsTab.previousStories` | translated |
| Print / PDF | Imprimir / PDF | `trends.reports.preview.print` | translated |
| Priorities | Prioridades | `dashboard.priorities` | translated |
| Priority | Prioridad | `goals.priority` | translated |
| Privacy | Privacidad | `settings.tabs.privacy` | translated |
| Problems | Problemas | `cycleReport.ledger.problems` | translated |
| Problems / Friction | Problemas / Fricción | `cycles.problemsFriction` | translated |
| Productive | Productivo | `pulse.checkin.productivityLabel4` | translated |
| Profile | Perfil | `settings.account.profileSection` | translated |
| Progress | Progreso | `goals.progress` | translated |
| Progress Chart | Gráfico de Progreso | `dashboard.progressChart` | translated |
| Progress Overview | Resumen de Progreso | `goalsPage.progressOverview` | translated |
| Project | Proyecto | `dashboard.project` | translated |
| Project (Tasks) | Proyecto (Tareas) | `goals.taskProject` | translated |
| Project Completion | Completado de Proyectos | `goalsPage.projectCompletion` | translated |
| Projected End:  | Fin Proyectado:  | `version.projectedEnd` | translated |
| Projects | Proyectos | `goals.projects` | translated |
| Pulse & Insights | Pulse y Perspectivas | `settings.tabs.pulse` | translated |
| Pulse Analytics | Analíticas de tus check-ins diarios | `trends.subtitle` | translated |
| Pulse check-ins | Check-ins | `cycleReport.livedExperience.pulseTitle` | translated |
| Pulse Trends | Tendencias Pulse | `history.pulseTrendsTitle` | translated |
| Quiet | Callado | `pulse.checkin.feeling_quiet` | translated |
| Read | Lectura | `archives.read` | translated |
| Recovery | Recuperación | `pulse.checkin.focus_recovery` | translated |
| Recurring Frictions | Fricciones Recurrentes | `trends.cycles.problems.title` | translated |
| Reflective | Reflexivo | `pulse.checkin.feeling_reflective` | translated |
| Refresh | Actualizar | `trends.insightsTab.footer.refresh` | translated |
| Relaxed | Relajado | `pulse.checkin.stressLabel1` | translated |
| Remove | Quitar | `common.remove` | translated |
| Reorder | Reordenar | `common.reorder` | translated |
| Replay tour | Repetir el tour | `onboarding.tour.replay` | translated |
| Report frequency | Frecuencia del reporte | `settings.pulseInsights.reportFrequency` | translated |
| Report history | Historial de reportes | `trends.insightsTab.history.title` | translated |
| Reports | Informes | `trends.zones.reports` | translated (resolved: nav-priority) |
| Reset | Restablecer | `common.reset` | translated |
| Rest | Descanso | `pulse.checkin.focus_rest` | translated |
| Restless | Inquieto | `pulse.checkin.feeling_restless` | translated |
| Restore | Restaurar | `lab.restore` | translated |
| Return to Login | Volver al Inicio de Sesión | `auth.verifyEmail.returnToLogin` | translated |
| Rough | Bajo | `cycleReport.livedExperience.moodBand1` | translated (resolved: nav-priority) |
| Routine | Rutina | `archives.routine` | translated |
| Routines | Rutinas | `archives.tabRoutines` | translated |
| Run a half | Correr una media | `onboarding.card.goal2` | translated |
| S | D | `trends.daySun` | translated (resolved: nav-priority) |
| Sad | Triste | `pulse.checkin.feeling_sad` | translated |
| Sat | Sáb | `trends.weekday.sat` | translated |
| Saturday | Sábado | `settings.pulseInsights.day5` | translated (resolved: nav-priority) |
| Save | Guardar | `common.save` | translated |
| Save & continue | Guardar y continuar | `welcomeConsent.save` | translated |
| Save Changes | Guardar Cambios | `common.saveChanges` | translated |
| Save Cycle Config | Guardar Config del Ciclo | `cycles.saveCycleConfig` | translated |
| Save PNG | Guardar PNG | `trends.reports.preview.savePNG` | translated |
| Save Settings | Guardar Ajustes | `settings.pulse.save` | translated |
| Saved | Guardado | `identity.saved` | translated |
| Saving | Guardando | `welcomeConsent.saving` | translated |
| Saving Changes… | Guardando Cambios… | `archives.savingChanges` | translated |
| Saving… | Guardando… | `identity.saving` | translated |
| Scattered | Disperso | `pulse.checkin.feeling_scattered` | translated |
| Score | Puntuación | `trends.zones.score` | translated |
| Score Breakdown | Desglose de Puntuación | `trends.performance.decomposition.title` | translated |
| Score so far | Puntuación actual | `lab.statScore` | translated (resolved: nav-priority) |
| Scores | Puntuaciones | `trends.zones.scores` | translated |
| Search cycles… | Buscar ciclos… | `database.searchCycles` | translated |
| Search habit history… | Buscar historial de hábitos… | `goals.searchHabitPlaceholder` | translated |
| Search history… | Buscar en historial… | `habits.searchHistoryPlaceholder` | translated |
| Search… | Buscar… | `common.search` | translated |
| Sections | Secciones | `trends.reports.sections` | translated |
| Select Active Mantras | Seleccionar Mantras Activos | `cycles.selectActiveMantras` | translated |
| Select from bank | Seleccionar del banco | `cycles.selectFromBank` | translated |
| Select time scale | Seleccionar escala de tiempo | `trends.timeScale.selectAriaLabel` | translated |
| Selected | Seleccionado | `common.selected` | translated |
| Selected Characteristics | Características Seleccionadas | `cycles.selectedCharacteristics` | translated |
| Selected Mantras | Mantras Seleccionados | `cycles.selectedMantras` | translated |
| Selected Skills | Habilidades Seleccionadas | `cycles.selectedSkills` | translated |
| Send every | Enviar cada | `settings.pulseInsights.digestDay` | translated |
| Set Password | Establecer Contraseña | `settings.account.setPassword` | translated |
| Settings | Configuración | `nav.settings` | translated |
| Share your journey | Comparte tu camino | `settings.general.reportBuilder.title` | translated |
| Ship the rewrite | Lanzar la reescritura | `onboarding.card.cyclename` | translated |
| Ship v2 | Lanzar la v2 | `onboarding.card.goal1` | translated |
| Shortcuts | Atajos | `settings.general.shortcuts` | translated |
| Show Archived | Mostrar Archivados | `lab.showArchived` | translated |
| Showing newest first | Mostrando más recientes primero | `database.showingNewest` | translated |
| Showing oldest first | Mostrando más antiguos primero | `database.showingOldest` | translated |
| Sidebar | Barra Lateral | `settings.appearance.sidebar` | translated |
| Sidebar Default | Barra Lateral por Defecto | `settings.appearance.sidebarDefault` | translated |
| Sign Out | Cerrar Sesión | `nav.signOut` | translated |
| Sign up | Regístrate | `auth.login.signUp` | translated |
| Sign Up | Registro | `auth.signup.title` | translated |
| Signals | Señales | `trends.zones.signals` | translated |
| Size | Tamaño | `database.size` | translated |
| Skill | Habilidad | `archives.skill` | translated |
| Skills | Habilidades | `lab.skills` | translated |
| Skills Focus | Enfoque de Habilidades | `cycles.skillsFocus` | translated |
| Skip | Omitir | `goalsPage.skipLinking` | translated (resolved: nav-priority) |
| Skip both | Omitir | `welcomeConsent.skip` | translated |
| Skip this part | Saltar esta parte | `onboarding.tour.skipSection` | translated |
| Sleep | Sueño | `cycleReport.header.sleep` | translated |
| Sleep avg | Sueño medio | `trends.wellbeingKpi.sleepAvg` | translated |
| Sleep Duration | Duración del Sueño | `trends.sleep.title` | translated |
| Sleep Quality | Calidad de Sueño | `trends.vitals.sleepQuality` | translated |
| Slide image | Imagen de diapositiva | `cinema.slideImageAlt` | translated |
| Slides | Diapositivas | `database.slides` | translated |
| Sluggish | Lento | `pulse.checkin.productivityLabel2` | translated |
| Sort | Orden | `goalsPage.sort` | translated |
| Spiritual | Espiritual | `pulse.checkin.focus_spiritual` | translated |
| Sports | Deportes | `pulse.checkin.focus_sports` | translated |
| Sprint Length | Duración del Sprint | `settings.general.sprintLength` | translated |
| Sprint num | Núm sprint | `database.sprintNum` | translated |
| Sprint Number | Número de Sprint | `lab.sprintNumber` | translated (resolved: nav-priority) |
| Stable | Estable | `goalsPage.trendStable` | translated |
| Standby | En Espera | `dashboard.standbyBadge` | translated |
| Start Check-in | Iniciar Check-in | `notifications.startCheckin` | translated |
| Start Date | Fecha de Inicio | `lab.startDate` | translated |
| Start Debrief | Iniciar Revisión | `notifications.startDebrief` | translated |
| Start next cycle | Empezar el próximo ciclo | `cycleReport.reflection.startNextCycle` | translated (resolved: nav-priority) |
| Status | Estado | `database.status` | translated |
| Status: Active | Estado: Activo | `cycles.statusActive` | translated |
| Status: Inactive | Estado: Inactivo | `cycles.statusInactive` | translated |
| Steady | Estable | `cycleReport.livedExperience.axisMoodMid` | translated |
| Storage | Almacenamiento | `settings.tabs.storage` | translated |
| Storage Limit | Límite de Almacenamiento | `settings.storage.limit` | translated |
| Storage Usage | Uso de Almacenamiento | `settings.storage.title` | translated |
| STRATEGIZE | ESTRATEGIA | `lab.strategize` | translated |
| Strategy | Estrategia | `cycles.tabStrategy` | translated |
| STRATEGY | ESTRATEGIA | `cycles.strategy` | translated |
| Streak milestones | Hitos de racha | `settings.pulseInsights.notifStreakMilestones` | translated |
| Stress | Estrés | `trends.vitals.stress` | translated |
| Stressed | Estresado | `pulse.checkin.stressLabel4` | translated |
| Strong | Fuerte | `goalsPage.strengthStrong` | translated |
| Study | Estudio | `pulse.checkin.focus_study` | translated |
| Subtasks | Subtareas | `goals.subtasks` | translated |
| Sun | Dom | `trends.weekday.sun` | translated |
| Sunday | Domingo | `settings.pulseInsights.day6` | translated (resolved: nav-priority) |
| Supercharged | Supercargado | `pulse.checkin.energyLabel5` | translated |
| Synced | Sincronizado | `archives.synced` | translated |
| System | Sistema | `goalsPage.systemStrength` | translated |
| System alerts | Alertas del sistema | `settings.pulseInsights.notifSystemAlerts` | translated |
| System Configuration | Configuración del Sistema | `cycles.systemConfiguration` | translated |
| System Default | Predeterminado del Sistema | `settings.appearance.systemDefault` | translated |
| System Initialization | Inicialización del Sistema | `version.systemConfiguration` | translated |
| System Standby | Sistema en Espera | `dashboard.systemStandby` | translated |
| T | J | `trends.dayThu` | translated (resolved: nav-priority) |
| Tactical Reality Check | Control Táctico | `goalsPage.title` | translated |
| Tempo & Structure | Tempo y Estructura | `settings.general.tempo` | translated |
| Temporal Config | Config Temporal | `cycles.temporalConfig` | translated |
| Temporal Records | Registros Temporales | `history.subtitle` | translated |
| The Cinema | El Cinema | `cinema.title` | translated |
| THE LAB | EL LAB | `lab.title` | translated |
| The Library | La Biblioteca | `archives.library` | translated |
| The Maker | El Creador | `onboarding.card.vname` | translated |
| Theme | Tema | `lab.theme` | translated |
| Theory Notes | Notas Teóricas | `archives.theoryNotes` | translated |
| This cycle | Este ciclo | `trends.timeNav.thisCycle` | translated |
| This month | Este mes | `trends.timeNav.thisMonth` | translated |
| This version | Esta versión | `trends.timeNav.thisVersion` | translated |
| This week | Esta semana | `trends.vitals.thisWeek` | translated |
| This week's story | La historia de esta semana | `trends.insightsTab.story` | translated |
| This year | Este año | `trends.timeNav.thisYear` | translated |
| Thu | Jue | `trends.weekday.thu` | translated |
| Thursday | jueves | `trends.insights.weekdayThursday` | translated (resolved: nav-priority) |
| Time | Hora | `settings.pulse.time` | translated |
| Timeline | Línea de Tiempo | `lab.timeline` | translated |
| Tired | Cansado | `pulse.checkin.feeling_tired` | translated |
| Title | Título | `archives.entryTitlePlaceholder` | translated |
| Title A-Z | Título A-Z | `goalsPage.sortTitle` | translated |
| Today | Hoy | `dashboard.backToToday` | translated |
| Top activities | Actividades principales | `cycleReport.livedExperience.topActivities` | translated |
| Top Activities | Actividades Principales | `trends.activities.topActivities` | translated |
| Top feeling | Sentimiento principal | `trends.reports.preview.topFeeling` | translated |
| Top feelings | Emociones principales | `cycleReport.livedExperience.topFeelings` | translated |
| Total Goals | Total de Objetivos | `goalsPage.totalGoals` | translated |
| Total Size | Tamaño Total | `settings.storage.totalSize` | translated |
| Trait | Rasgo | `archives.trait` | translated |
| Traits | Rasgos | `lab.traits` | translated |
| Trend | Tendencia | `goalsPage.trend` | translated |
| Try again | Reintentar | `cycleReport.loadError.retry` | translated |
| Try different email | Intentar con otro correo | `auth.conflict.tryDifferentEmail` | translated |
| Tue | Mar | `trends.weekday.tue` | translated |
| Tuesday | martes | `trends.insights.weekdayTuesday` | translated (resolved: nav-priority) |
| Two optional choices | Dos opciones opcionales | `welcomeConsent.title` | translated |
| Type | Tipo | `database.type` | translated |
| Underline | Subrayado | `archives.toolbarUnderline` | translated |
| Uneven division | División desigual | `settings.general.unevenDivision` | translated |
| Unlimited | Ilimitado | `settings.storage.unlimited` | translated |
| Unlinked | Sin vínculo | `database.unlinked` | translated |
| Unlock AI Insights | Desbloquear Insights con IA | `trends.insightsTab.narrative.upgrade` | translated |
| Unproductive | Improductivo | `pulse.checkin.productivityLabel1` | translated |
| Unsaved Changes | Cambios sin Guardar | `archives.unsavedChanges` | translated |
| Unstoppable | Imparable | `pulse.checkin.motivationLabel5` | translated |
| Untitled | Sin título | `lab.untitled` | translated |
| Update | Actualizar | `settings.account.update` | translated |
| Update Password | Actualizar Contraseña | `settings.account.updatePassword` | translated |
| Updated just now | Actualizado justo ahora | `trends.report.updatedJustNow` | translated |
| Upgrade to Pro | Actualizar a Pro | `settings.account.upgradeToPro` | translated |
| Upload Image | Subir Imagen | `cinema.uploadImage` | translated |
| Username | Nombre de Usuario | `settings.account.username` | translated |
| Verification Sent | Verificación Enviada | `auth.verifyEmail.title` | translated |
| Version | Versión | `database.version` | translated |
| Version deadlines | Fechas límite de versión | `settings.pulseInsights.notifVersionDeadlines` | translated |
| Version Duration | Duración de Versión | `settings.general.versionDuration` | translated |
| Version Ending Soon | Versión Por Terminar | `notifications.versionEndingSoon` | translated |
| Version ID | ID de Versión | `version.versionId` | translated |
| Versions | Versiones | `database.versions` | translated |
| View | Ver | `archives.view` | translated |
| View all | Ver todo | `notifications.expand` | translated |
| View all days | Ver todos los días | `trends.moodCalendar.viewAll` | translated |
| View report | Ver informe | `lab.viewReport` | translated |
| View Report | Ver informe | `notifications.viewReport` | translated |
| View Visions | Ver Visiones | `lab.viewVisions` | translated |
| Vision | Visión | `archives.tabVision` | translated |
| Visual Source | Fuente Visual | `cinema.visualSource` | translated |
| Vitals | Signos Vitales | `trends.vitals.title` | translated (resolved: nav-priority) |
| W | X | `trends.dayWed` | translated |
| Waiting for you | Esperándote | `onboarding.tour.waitingForYou` | translated |
| Watch | Vigilar | `goalsPage.riskMedium` | translated |
| Watching | En observación | `trends.insightsTab.watching` | translated |
| Weak | Débil | `goalsPage.strengthWeak` | translated |
| Wed | Mié | `trends.weekday.wed` | translated |
| Wednesday | miércoles | `trends.insights.weekdayWednesday` | translated (resolved: nav-priority) |
| Week | Semana | `trends.timeScale.week` | translated |
| WEEK | SEMANA | `dashboard.week` | translated |
| Weekly | Semanal | `trends.reports.periodWeekly` | translated |
| Weekly digest | Resumen semanal | `settings.pulseInsights.digestLabel_weekly` | translated |
| Weekly patterns | Patrones semanales | `trends.insightsTab.thresholds.dowPatterns` | translated |
| Weekly Summary | Resumen Semanal | `trends.insightsTab.narrative.title` | translated |
| Weight | Peso | `database.weight` | translated |
| Wellbeing | Bienestar | `trends.tabs.wellbeing` | translated |
| Wellbeing Score | Puntuación de Bienestar | `trends.wellbeingScore.title` | translated |
| Work | Trabajo | `pulse.checkin.focus_work` | translated |
| Write | Escritura | `archives.write` | translated |
| Write a mantra | Escribe un mantra | `identity.writeMantraLabel` | translated |
| Year | Año | `trends.timeScale.year` | translated |
| Yes | Sí | `common.yes` | translated |
| You're set | Listo | `onboarding.tour.phase.finale` | translated |
| Your cycles | Tus ciclos | `onboarding.tour.phase.labCycleAlt` | translated |
| Your personal report | Tu reporte personal | `trends.report.viewReport` | translated |
| Your reflection | Tu reflexión | `cycleReport.reflection.title` | translated |
| Your Report | Tu Reporte | `trends.reports.preview.header` | translated |
| Your versions | Tus versiones | `onboarding.tour.phase.labVersionAlt` | translated |
| Analytics | Analytics | `nav.analytics` | kept English |
| API | API | `settings.tabs.api` | kept English |
| Check-ins | Check-ins | `trends.reports.preview.checkIns` | kept English |
| Cinema | Cinema | `nav.cinema` | kept English |
| Dashboard | Dashboard | `nav.dashboard` | kept English |
| Database | Database | `nav.database` | kept English |
| Editor | Editor | `archives.editor` | kept English |
| El Portal Free | El Portal Free | `settings.account.elPortalFree` | kept English |
| El Portal Pro | El Portal Pro | `settings.account.elPortalPro` | kept English |
| Error | Error | `identity.error` | kept English |
| ETA | ETA | `goalsPage.eta` | kept English |
| Feedback | Feedback | `nav.feedback` | kept English |
| Free | Free | `nav.free` | kept English |
| General | General | `settings.tabs.general` | kept English |
| Google | Google | `settings.account.google` | kept English |
| Insights | Insights | `trends.tabs.insights` | kept English |
| Irritable | Irritable | `pulse.checkin.feeling_irritable` | kept English |
| Mantra | Mantra | `trends.reports.mantra` | kept English |
| Mantras | Mantras | `lab.mantrasTitle` | kept English |
| MANTRAS | MANTRAS | `cycles.mantras` | kept English |
| Manual | Manual | `goalsPage.sortManual` | kept English |
| No | No | `common.no` | kept English |
| Persona | Persona | `version.persona` | kept English |
| Plan | Plan | `settings.account.plan` | kept English |
| Portal | Portal | `onboarding.steps.portal.label` | kept English |
| Pro | Pro | `nav.pro` | kept English |
| Pulse | Pulse | `nav.pulse` | kept English |
| Social | Social | `pulse.checkin.focus_social` | kept English |
| Terrible | Terrible | `pulse.checkin.sleepLabel1` | kept English |
| The Lab | The Lab | `nav.lab` | kept English |
| Trends | Trends | `nav.trends` | kept English |
| URL: | URL: | `archives.toolbarEnterUrl` | kept English |

## Kept English

The terms above whose Spanish value equals the English one — the app kept
these unchanged rather than translating them:

| English | Spanish | Source key | Status |
|---|---|---|---|
| Analytics | Analytics | `nav.analytics` | kept English |
| API | API | `settings.tabs.api` | kept English |
| Check-ins | Check-ins | `trends.reports.preview.checkIns` | kept English |
| Cinema | Cinema | `nav.cinema` | kept English |
| Dashboard | Dashboard | `nav.dashboard` | kept English |
| Database | Database | `nav.database` | kept English |
| Editor | Editor | `archives.editor` | kept English |
| El Portal Free | El Portal Free | `settings.account.elPortalFree` | kept English |
| El Portal Pro | El Portal Pro | `settings.account.elPortalPro` | kept English |
| Error | Error | `identity.error` | kept English |
| ETA | ETA | `goalsPage.eta` | kept English |
| Feedback | Feedback | `nav.feedback` | kept English |
| Free | Free | `nav.free` | kept English |
| General | General | `settings.tabs.general` | kept English |
| Google | Google | `settings.account.google` | kept English |
| Insights | Insights | `trends.tabs.insights` | kept English |
| Irritable | Irritable | `pulse.checkin.feeling_irritable` | kept English |
| Mantra | Mantra | `trends.reports.mantra` | kept English |
| Mantras | Mantras | `lab.mantrasTitle` | kept English |
| MANTRAS | MANTRAS | `cycles.mantras` | kept English |
| Manual | Manual | `goalsPage.sortManual` | kept English |
| No | No | `common.no` | kept English |
| Persona | Persona | `version.persona` | kept English |
| Plan | Plan | `settings.account.plan` | kept English |
| Portal | Portal | `onboarding.steps.portal.label` | kept English |
| Pro | Pro | `nav.pro` | kept English |
| Pulse | Pulse | `nav.pulse` | kept English |
| Social | Social | `pulse.checkin.focus_social` | kept English |
| Terrible | Terrible | `pulse.checkin.sleepLabel1` | kept English |
| The Lab | The Lab | `nav.lab` | kept English |
| Trends | Trends | `nav.trends` | kept English |
| URL: | URL: | `archives.toolbarEnterUrl` | kept English |

**The rule:** any term not in this document must be looked up directly in
the app's `es.json` (or re-derived by re-running the extraction script),
never inferred from the pattern above. Some of these read English "by
coincidence" (e.g. `No`, a cognate) rather than by deliberate product
decision — the table does not distinguish the two, because the app doesn't
either; both are equally what ships to users today.

## Marketing-only (decided here)

Terms the marketing copy needs that the product UI never names anywhere in
`en.json`/`es.json` — D-02b. These are decided here, not derived, and are
flagged as such so a future app change cannot silently contradict them.

Seeded with the terms the site demonstrably already uses in component code
(`SystemBlueprintSection.tsx`, `MethodologyPreviewSection.tsx`) that have
no equivalent string anywhere in the app's catalogues (verified: neither
`"Methodology"` nor `"Manifesto"` appears in `en.json`):

| English | Spanish | Why the app has no string | Plan |
|---|---|---|---|
| Methodology | Metodología | Marketing/content concept (the "how it works" page and its preview section) — the app product has no in-app screen or string named this | 07-02 |
| Manifesto | Manifiesto | Marketing/editorial page name — a philosophical statement page that exists only on the marketing site | 07-02 |
| Primary (nav landmark aria-label) | Principal | Marketing-site-only nav landmark; the app has no equivalent `<nav aria-label>` string to reuse | 07-04 |
| Toggle menu | Alternar menú | Marketing-site-only hamburger control; the app's own mobile nav (if any) is a different component with its own string | 07-04 |
| Changelog (nav) | Cambios | No prior glossary entry. Shortened from the literal loanword "Changelog" (kept verbatim in the footer instance below) to close a 768px nav-row width deficit the new language switcher introduced — see TRANSLATION-FLAGS.07-04.md | 07-04 |
| Changelog (footer) | Changelog | No prior glossary entry; kept as the common untranslated loanword used across Spanish dev/tech products, not width-constrained the way the nav instance is | 07-04 |
| Pricing | Precios | Marketing-site-only nav/footer label; the app has no public pricing page of its own | 07-04 |
| MCP Integration | Integración MCP | Marketing-site-only footer link label describing a product feature page, not an app string | 07-04 |
| About | Sobre nosotros | Marketing-site-only footer link label (points at /manifesto under a second, distinct English label from "Manifesto") | 07-04 |
| El Portal home | Inicio de El Portal | Marketing-site-only aria-label on the footer wordmark link; the app's own logo link (if any) is a different component | 07-04 |
| Language notice (aside landmark label) | Aviso de idioma | Marketing-site-only accessible name for the cross-locale hint region; no app equivalent exists | 07-04 |
| biometrics | biometría | Marketing-site-only prose noun (Hero sub-copy, "Track habits, goals, biometrics...") describing a data category the app tracks; the app's own catalogue has no single `Biometrics` UI label to reuse — it exposes biometric data through several specific metric screens, not one named string. Standard-dictionary Spanish term, not a coinage. | 07-06 |
| Initiate (tier/plan name) | Initiate | Marketing-site-only pricing tier name; the app has no public pricing page and therefore no tier literally named "Initiate." Kept English rather than translated, matching the existing convention `GLOSSARY.md` already records for the app's own settings-page plan names — "El Portal Free" and "El Portal Pro" are both `kept English` (`settings.account.elPortalFree` / `settings.account.elPortalPro`). A plan/tier brand name is treated the same way a product name is: it identifies a specific offering, not a translatable concept. | 07-09 |
| Lifetime (tier/plan name) | Lifetime | Same reasoning as Initiate above. Note this is a distinct decision from the common noun "lifetime," which the app itself translates elsewhere (`settings.account.lifetime` → "De por vida," `settings.account.lifetimeAccess` → "Acceso de por vida") — this plan's own prose uses that translated form everywhere the word appears as an adjective/description (e.g. `tiers[1].period`: "pago único"; `comparisonFeatures` row "Actualizaciones de por vida, sin renovaciones"). Only the tier's own proper name, capitalized and used as a card heading/column header, stays "Lifetime." | 07-09 |
| Command bar | Barra de comandos | Added to the comparison table by the design owner after this plan shipped (2026-08-20). `GLOSSARY.md` has no row for it — the app ships no string containing "command bar" — so this is a coinage. Translated rather than kept English: unlike The Lab or Trends it is a generic UI affordance, not a named surface of the product, and a Spanish reader who opens the app will not be looking for a labelled "Command bar" to match it against. | 07-09 (post-plan edit) |
| Deep statistical analysis | Análisis estadístico profundo | Added by the design owner in the same edit. Generic descriptive phrase rather than a product noun; no app string to match. Translated directly. | 07-09 (post-plan edit) |
| Burnout (pattern-detector name) | Agotamiento | Marketing-site-only detector display name. The app's own catalogue never names this detector "Burnout" — it only ships the resulting headline/body copy (`trends.insights.patternHeadline` = "Energy dropped sharply" / "La energía cayó bruscamente"), never a standalone category label. This page coined the four detector names to give each pattern-detector card a title; GLOSSARY.md has no row to resolve against. | 07-13 |
| Regression (pattern-detector name) | Retroceso | Same situation as Burnout above — the app exposes only the rendered copy for this detector (`trends.insights.regressionHeadline`/`regressionBody`), never a standalone category name. Coined for this page's four-card detector grid. | 07-13 |
| Weekday Blind Spot (pattern-detector name) | Punto Ciego Semanal | Same situation — the app's `blindspotHeadline`/`blindspotBody` keys carry the rendered per-instance copy only, never a standalone detector-category name. Coined for this page. | 07-13 |
| Sleep Lag (pattern-detector name) | Desfase del Sueño | Same situation — no app string names this detector category directly; this page coined the label. See `TRANSLATION-FLAGS.07-13.md` for the rhythm/brevity loss this specific coinage costs against the English "X Lag" pattern. | 07-13 |
| Productivity (Pulse evening check-in axis label, standalone noun) | Rendimiento | GLOSSARY.md has no isolated row for this axis as a standalone noun — the app's only "productivity" strings are the five answer-option labels (`pulse.checkin.productivityLabel1-5`: Improductivo/Lento/Decente/Productivo/En llamas) and the full check-in question sentence ("¿Qué tan productivo fuiste?"), neither of which is a short chip-style axis label. Followed `src/messages/es/mcp.json`'s own sibling rendering of this exact axis in `tools.write.portal_pulse` ("Cubre ánimo, energía, sueño, estrés, rendimiento, sentimientos y reflexión") rather than coining a fresh word, so the two pages describing the same Pulse evening categories stay consistent. | 07-13 |
| Carry-over (Goals section label) | Continuidad | GLOSSARY.md's only close match is the verb phrase "Carry Forward → Continuar" (`goalsPage.carryForward`, an action button), not a noun label for a page section describing the carry-over mechanic itself. Translated as a noun rather than reused as a verb button label, since this is a static section heading, not an actionable control. | 07-13 |
| MoodOrb (Daily Pulse feature name, v2.0.13 entry) | MoodOrb | GLOSSARY.md has no row for this — it is the proper-noun name of a specific UI widget (the glowing sphere on the evening check-in), not a common noun the app's `en.json`/`es.json` catalogues name as translatable copy. Kept English by decision, consistent with the app's own precedent for other UI feature proper nouns that stay English regardless of locale (Cinema, Trends, Dashboard, Pulse, The Lab). | 07-14 |

**Merged by plan 07-16** from all nine `src/messages/glossary-additions/07-NN.md`
files (07-05, 07-07, 07-08 and 07-10 contributed zero rows — every product
noun those pages needed already resolved through this glossary's derived
section). 21 rows merged, in plan order, wording copied verbatim from each
source file. No coinage conflicts were found — every English term across all
nine files was unique. See `07-16-SUMMARY.md` for the reconciliation.

**THIS SECTION IS NOT APPENDED TO IN PLACE BY LATER PLANS.** Waves 3 and 4
run in parallel; several plans coining a term each would either conflict on
this file or silently lose one another's appends across isolated worktrees.
Instead: a translation plan that needs a term the app has no string for
writes `src/messages/glossary-additions/07-NN.md` — one file per plan, named
for the plan (see `src/messages/glossary-additions/README.md` for the exact
convention). Plan 07-16 merges every such file into this section once the
last translation wave has landed.

**Any term appearing in this section after phase 7 has landed arrived
through that 07-16 merge (with the two seed rows above as the sole
exception, added by this plan before Wave 2 began). Editing this section
directly during Waves 3-4 is a defect** — write to your own
`glossary-additions/07-NN.md` file instead. Any plan may read the whole
`src/messages/glossary-additions/` directory to see what a sibling plan
coined; no plan may write to another plan's file.
