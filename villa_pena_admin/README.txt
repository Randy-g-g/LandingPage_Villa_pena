VILLA PEÑAS — PANEL INTERNO DE ADMINISTRACIÓN

ARCHIVOS
- index.html: estructura de la interfaz.
- styles.css: diseño responsive con la paleta café, beige y crema de Villa Peñas.
- app.js: interacciones de calendario, paquetes, reseñas y solicitudes.
- assets/logo.png: logo de Villa Peñas extraído del proyecto público.

CÓMO ABRIR
1. Descomprimir la carpeta.
2. Abrir la carpeta en Visual Studio Code.
3. Abrir index.html con Live Server.

IMPORTANTE: PROTOTIPO DE FRONTEND
Esta versión es una demostración interactiva. Los cambios se guardan en localStorage de ese navegador, no en un backend, y los datos iniciales son ejemplos. No está conectada todavía a NestJS.

PARA REFLEJAR CAMBIOS ENTRE EL PANEL Y LA PÁGINA PÚBLICA
1. Crear endpoints en NestJS para paquetes, reseñas y reservas/bloqueos.
2. Guardar los datos en MySQL/TypeORM cuando corresponda; un arreglo temporal se pierde al reiniciar NestJS.
3. Sustituir las funciones demo de app.js por fetch() a la API (API_BASE está declarado al inicio).
4. Hacer que la web pública consulte los paquetes y las reseñas aprobadas desde la misma API.
5. Proteger el panel con autenticación/autorización antes de publicarlo. No se incluye login real en este prototipo.

El calendario permite navegar entre meses, registrar eventos, cambiar su estado y bloquear fechas de demostración. La vista semana/día está indicada como futura mejora.
