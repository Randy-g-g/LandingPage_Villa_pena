# Villa Peñas — Landing Page | Primera entrega

Proyecto construido según las indicaciones de la primera entrega de Programación III.

## Tecnologías

- HTML5 semántico
- Tailwind CSS
- JavaScript
- Arreglos de objetos
- Manipulación del DOM
- Eventos
- Responsive design

## Estructura

- `index.html` — estructura y contenido
- `styles.css` — identidad visual y estilos complementarios
- `js/datos.js` — paquetes y servicios adicionales
- `js/app.js` — funcionalidades

## Funcionalidades JavaScript

1. Menú responsive.
2. Catálogo dinámico de paquetes desde un arreglo de objetos.
3. Catálogo dinámico de servicios adicionales.
4. Modal para consultar detalles de paquetes.
5. Galería con lightbox.
6. Validación del formulario.
7. Construcción automática de una solicitud para WhatsApp.
8. Animaciones de aparición al hacer scroll.

## Contenido de Villa Peñas

La estructura sigue la referencia visual proporcionada por el cliente:

- Villa Peñas, Santa Cruz.
- Celebra, comparte y disfruta.
- Sección informativa.
- Ubicación.
- Paquetes Básico, Full y Premium.
- Palomitas.
- Algodón de azúcar.
- Fuente de chocolate.
- Testimonios.
- Formulario de solicitud.
- Contacto y redes.

Los documentos entregados también contienen información de productos adicionales y teléfonos 8537-3750 / 8850-7712.

## Importante antes de entregar

1. Reemplazar las imágenes de demostración por fotografías reales.
2. Confirmar logo.
3. Confirmar número de WhatsApp que recibirá las solicitudes.
4. Confirmar correo real.
5. Confirmar ubicación exacta para el mapa.
6. Confirmar precios de los paquetes Básico, Full y Premium.
7. Confirmar si la nomenclatura definitiva será Básico/Full/Premium o Essentials/Premium.
8. Sustituir testimonios de demostración por testimonios reales autorizados.
9. Agregar enlaces reales de Instagram/Facebook.
10. Mantener el calendario fuera de la parte pública: corresponde a la futura parte interna.

## Nota sobre los paquetes

La referencia visual proporcionada muestra tres paquetes llamados Básico, Full y Premium. Los documentos de paquetes proporcionados anteriormente utilizan también la nomenclatura Essentials y Premium. Por eso, los precios de los tres paquetes no se inventaron en esta versión: aparecen como "Precio: consultar" hasta que el cliente confirme la tabla definitiva.


## Accesos rápidos flotantes

Se agregaron dos botones fijos en la esquina inferior derecha, inspirados en la navegación flotante observada en Nimbu:

- Instagram: `https://www.instagram.com/eventos_villapena/`
- WhatsApp: queda configurado como pendiente hasta confirmar el número oficial.

El botón de Instagram abre la cuenta oficial en una pestaña nueva.


## Revisión de código — guía del equipo

Esta versión mantiene el diseño y la transición de entrada de la guía.
Se corrigieron detalles técnicos menores: botones de galería/modal con `type="button"`,
enlace de Instagram del footer y cálculo de la fecha mínima usando la fecha local.


## Corrección del formulario y transición inicial

- La animación de entrada se controla únicamente desde `styles.css`: 2,2 segundos de presentación y 1,05 segundos de salida. No espera las fotografías ni el mapa. Respeta `prefers-reduced-motion` y desaparece aunque JavaScript esté desactivado.
- Se restauraron los estilos complementarios que usaban el formulario y las tarjetas.
- Los campos tienen `name`, autocompletado y estados accesibles de error. Se valida nombre obligatorio, teléfono de 8 a 15 dígitos, correo, fecha actual o futura, cantidad entera positiva y paquete disponible.
- La fecha mínima se calcula con la fecha local y se actualiza también al enviar.
- Las dos imágenes JPG adjuntas se incluyen en `assets` y se utilizan en el encabezado y el pie de página. Los archivos originales se conservan sin editar.
- `js/datos.js`, los teléfonos, el correo, las redes, la ubicación, las descripciones y los testimonios se mantienen.
- WhatsApp sigue pendiente: `WHATSAPP_NUMBER = "506XXXXXXXX"`. El formulario prepara y valida los datos, pero no los envía mientras no exista un número confirmado. Para habilitarlo, configurar esa constante con el número oficial, en formato internacional y sin signos ni espacios.
- Con un número configurado se abre WhatsApp y se muestra un enlace alternativo. La persona debe confirmar el envío dentro de WhatsApp; esto no confirma una reserva ni guarda la solicitud en una base de datos.

## Cómo abrir el proyecto

Descomprimir el ZIP completo y abrir `index.html`, manteniendo juntas las carpetas `assets` y `js` y el archivo `styles.css`. Se necesita conexión para cargar Tailwind, las fotos de referencia y el mapa.


## Verificación realizada

Sintaxis JavaScript y CSS, IDs y rutas locales, campos obligatorios, teléfono, correo, fecha pasada, cantidad cero/negativa/decimal, selección de paquetes y adicionales, y generación del enlace de WhatsApp con una configuración simulada. No se enviaron solicitudes.

Pruebas en Chromium: entrada CSS, contenido visible sin JavaScript, movimiento reducido, carga de las dos imágenes locales, formulario y menú en escritorio (1366 px) y móvil (390 px), sin desbordamiento horizontal. Las fotos externas y el mapa se bloquearon durante esas pruebas; los estilos Tailwind se reprodujeron localmente para la verificación.


## JavaScript adaptado al ejercicio DOM_Poo_js de clase

`js/app.js` sigue el estilo del proyecto de productos proporcionado:

- Selecciona los elementos HTML con `document.querySelector` y `querySelectorAll`.
- Usa funciones normales con `function` y eventos con `addEventListener`.
- Recorre los arreglos con `forEach(function(elemento) { ... })`.
- Construye tarjetas con `createElement`, `className`, `textContent` y `appendChild`.
- Limpia los contenedores con `innerHTML = ""` antes de mostrar sus elementos.
- Obtiene los valores del formulario, convierte la cantidad con `Number` y crea un objeto `solicitud` con propiedades explícitas.
- Agrupa categorías y guarda adicionales seleccionados usando arreglos y `push`.

Funciones principales para estudiar:

| Función | Qué hace |
| --- | --- |
| `mostrarPaquetes()` | Recorre el arreglo y crea las tarjetas de paquetes. |
| `mostrarAdicionales()` | Recorre el arreglo y crea las tarjetas con sus precios. |
| `mostrarOpcionesPaquetes()` | Llena el selector del formulario. |
| `mostrarOpcionesAdicionales()` | Crea las casillas sin repetir categorías. |
| `validarFormulario()` | Comprueba los campos y muestra el primer error. |
| `obtenerAdicionalesSeleccionados()` | Devuelve un arreglo con las casillas marcadas. |
| `crearMensajeSolicitud(solicitud)` | Usa el objeto para preparar el texto del mensaje. |
| `abrirWhatsApp(solicitud)` | Abre el enlace cuando exista un número oficial configurado. |

Al final de `app.js` se llaman las funciones que muestran los datos. Se mantienen los scripts al final del HTML y `datos.js` se carga antes que `app.js`.

El formulario conserva los datos escritos para poder corregirlos o reintentar el envío. La solicitud se prepara para WhatsApp y sigue sujeta a confirmación de Villa Peñas.

La transición inicial permanece en CSS. Los datos de `datos.js`, el HTML, los estilos y las imágenes no cambiaron durante esta adaptación.
