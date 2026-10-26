/* ==========================================
   VILLA PEÑAS - PANEL ADMINISTRATIVO
   ==========================================*/

// configuracion general aun sin aprobar

const API_BASE = "http://localhost:3000";

const STORAGE_KEY = "villaPenasAdminDemoV1";

let packageItems = [];

// datos de demostración

const initialData = {

    // PAQUETES
    packages: [
        {
            id: 1,
            name: "Paquete Essentials",
            description: "Ideal para eventos íntimos.",
            price: 150000,
            active: true
        },
        {
            id: 2,
            name: "Paquete Premium",
            description: "Nuestra opción más completa.",
            price: 250000,
            active: true
        },
        {
            id: 3,
            name: "Paquete Bodas",
            description: "Todo para un día especial.",
            price: 350000,
            active: true
        }
    ],

    // RESERVACIONES
    events: [
        {
            id: 101,
            name: "Cumpleaños adulto",
            date: "2026-10-03",
            time: "16:00",
            client: "Jimena Pérez Baltodano",
            guests: 30,
            package: "Paquete Premium",
            status: "confirmada"
        },
        {
            id: 102,
            name: "Reunión amistades",
            date: "2026-10-04",
            time: "17:00",
            client: "María Rojas",
            guests: 40,
            package: "Paquete Essentials",
            status: "pendiente"
        },
        {
            id: 103,
            name: "Reunión familiar",
            date: "2026-10-11",
            time: "10:00",
            client: "Carlos Méndez",
            guests: 30,
            package: "Paquete Essentials",
            status: "confirmada"
        },
        {
            id: 104,
            name: "Cumpleaños adulto",
            date: "2026-10-17",
            time: "16:00",
            client: "Jimena Pérez Baltodano",
            guests: 30,
            package: "Paquete Premium",
            status: "confirmada"
        },
        {
            id: 105,
            name: "Cumpleaños infantil",
            date: "2026-10-18",
            time: "10:00",
            client: "Laura Soto",
            guests: 40,
            package: "Paquete Essentials",
            status: "pendiente"
        },
        {
            id: 106,
            name: "Mantenimiento",
            date: "2026-10-22",
            time: "08:00",
            client: "Villa Peñas",
            guests: 0,
            package: "—",
            status: "bloqueada"
        }
    ],

    // RESEÑAS
    reviews: [
        {
            id: 201,
            name: "Carla Méndez",
            date: "12 oct 2026",
            rating: 5,
            comment: "Un lugar hermoso, muy recomendado para familias.",
            status: "pendiente"
        },
        {
            id: 202,
            name: "José Ramírez",
            date: "8 oct 2026",
            rating: 4,
            comment: "Excelente atención, la piscina estaba impecable.",
            status: "pendiente"
        },
        {
            id: 203,
            name: "Laura Soto",
            date: "5 oct 2026",
            rating: 5,
            comment: "Celebramos el cumpleaños de mi hija y todo fue precioso.",
            status: "pendiente"
        },
        {
            id: 204,
            name: "Andrea Ruiz",
            date: "28 sep 2026",
            rating: 5,
            comment: "Un espacio precioso para compartir con la familia.",
            status: "publicada"
        },
        {
            id: 205,
            name: "Pedro Solís",
            date: "21 sep 2026",
            rating: 4,
            comment: "Muy buena atención y ambiente tranquilo.",
            status: "publicada"
        },
        {
            id: 206,
            name: "Comentario de prueba",
            date: "19 sep 2026",
            rating: 2,
            comment: "Este comentario de demostración fue rechazado.",
            status: "rechazada"
        }
    ],

    // SOLICITUDES
    requests: [
        {
            id: 301,
            name: "Daniela Vargas",
            date: "2026-11-14",
            time: "15:00",
            guests: 35,
            package: "Paquete Premium",
            phone: "8888-1234",
            status: "Nueva",
            message: "Celebración familiar; consulta por disponibilidad."
        },
        {
            id: 302,
            name: "Andrés López",
            date: "2026-11-21",
            time: "12:00",
            guests: 50,
            package: "Paquete Bodas",
            phone: "8777-5678",
            status: "Nueva",
            message: "Consulta para una actividad de un día."
        }
    ]
};


// ==========================================
// 3. VARIABLES GLOBALES
// ==========================================

let data = loadData();

let view = "calendario";

let reviewStatus = "pendiente";

let currentDate = new Date(2026, 9, 1);

let toastTimer;

// selector del dom

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => [
    ...document.querySelectorAll(selector)
];

// almacenamiento local sin persistencia en el backend

function loadData() {

    try {

        const stored = localStorage.getItem(STORAGE_KEY);

        return stored
            ? JSON.parse(stored)
            : structuredClone(initialData);

    } catch {

        return structuredClone(initialData);
    }
}


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

    updateStats();
}

// funciones auxiliares

function money(value) {

    return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0
    }).format(value);
}


function escapeHTML(value = "") {

    return String(value).replace(
        /[&<>"']/g,
        (c) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c])
    );
}


function showToast(message) {

    const toast = $("#toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// panel de estadisticas

function updateStats() {
    const ym = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    $("#statEvents").textContent = data.events.filter(
        e => e.date.startsWith(ym) &&
             e.status !== "bloqueada"
    ).length;

    $("#statOccupied").textContent = new Set(
        data.events
            .filter(e => e.date.startsWith(ym))
            .map(e => e.date)
    ).size;

    $("#statRequests").textContent = data.requests.filter(
        r => r.status === "Nueva"
    ).length;

    $("#pendingCount").textContent = data.reviews.filter(
        r => r.status === "pendiente"
    ).length;

    $("#tabPending").textContent = data.reviews.filter(
        r => r.status === "pendiente"
    ).length;

    $("#tabPublished").textContent = data.reviews.filter(
        r => r.status === "publicada"
    ).length;

    $("#tabRejected").textContent = data.reviews.filter(
        r => r.status === "rechazada"
    ).length;

    $("#reviewsPill").textContent =
        `${data.reviews.filter(
            r => r.status === "pendiente"
        ).length} pendientes`;
}

async function actualizarContadoresResenas() {
    try {
        const [
            respuestaPendientes,
            respuestaPublicadas,
            respuestaRechazadas
        ] = await Promise.all([
            fetch(`${API_BASE}/resenas/pendientes`),
            fetch(`${API_BASE}/resenas`),
            fetch(`${API_BASE}/resenas/rechazadas`)
        ]);

        if (
            !respuestaPendientes.ok ||
            !respuestaPublicadas.ok ||
            !respuestaRechazadas.ok
        ) {
            throw new Error("No se pudieron consultar las reseñas.");
        }

        const pendientes = await respuestaPendientes.json();
        const publicadas = await respuestaPublicadas.json();
        const rechazadas = await respuestaRechazadas.json();

        $("#statReviews").textContent = pendientes.length;
        $("#pendingCount").textContent = pendientes.length;
        $("#tabPending").textContent = pendientes.length;
        $("#tabPublished").textContent = publicadas.length;
        $("#tabRejected").textContent = rechazadas.length;

        $("#reviewsPill").textContent =
            `${pendientes.length} pendientes`;

    } catch (error) {
        console.error(
            "Error al actualizar los contadores:",
            error
        );
    }
}

// navegación del panel

function setView(next) {

    view = next;

    sessionStorage.setItem("adminVistaActual", next);

    $$(".view-panel").forEach(panel => {

        panel.classList.toggle(
            "active",
            panel.id === `view-${next}`
        );
    });

    $$(".nav-link").forEach(boton => {

        boton.classList.toggle(
            "active",
            boton.dataset.view === next
        );
    });

    const titles = {

        calendario: [
            "Calendario",
            "Calendario de reservaciones",
            "Visualiza y administra las reservaciones y fechas bloqueadas."
        ],

        paquetes: [
            "Paquetes",
            "Administración de paquetes",
            "Actualiza los paquetes y la información que se mostrará en la página pública."
        ],
        adicionales: [
            "Adicionales",
            "Administración de adicionales",
            "Administra los servicios adicionales que se mostrarán en la página pública."
        ],
        galeria: [
             "Galería",
             "Administración de galería",
             "Administra las fotografías que se mostrarán en la página pública de Villa Peña."
        ],

        resenas: [
            "Reseñas",
            "Reseñas y testimonios",
            "Modera los comentarios antes de publicarlos en la página pública."
        ],

        solicitudes: [
            "Solicitudes",
            "Solicitudes de reservación",
            "Consulta las solicitudes y coordina la confirmación con los clientes."
        ]
    };

    const t = titles[next];

    $("#crumbTitle").textContent = t[0];

    $("#pageTitle").textContent = t[1];

    $("#pageDescription").textContent = t[2];

    $("#headerActions").style.display =
        next === "calendario" ? "flex" : "none";

    $("#sidebar").classList.remove("open");

    if (next === "paquetes") renderPackages();

    if (next === "adicionales") renderAdditionals();

    if (next === "galeria") renderGallery();

    if (next === "resenas") renderReviews();

    if (next === "solicitudes") renderRequests();

    if (next === "calendario") renderCalendar();
}

// eventos de navegación del panel

$$(".nav-link").forEach(boton => {

    boton.addEventListener("click", () => {
        setView(boton.dataset.view);
    });
});


$("#mobileMenu").addEventListener("click", () => {

    $("#sidebar").classList.toggle("open");
});


$("#resetDemo").addEventListener("click", () => {

    if (confirm(
        "¿Restaurar los datos de demostración? Se perderán los cambios locales."
    )) {

        data = structuredClone(initialData);

        saveData();

        renderAll();

        showToast("Datos de demostración restaurados");
    }
});

// calendario

function renderCalendar() {

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    $("#monthLabel").textContent =
        new Intl.DateTimeFormat("es-CR", {
            month: "long",
            year: "numeric"
        }).format(currentDate);

    const grid = $("#calendarGrid");

    grid.innerHTML = "";

    const weekdays = [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo"
    ];

    weekdays.forEach(dia => {

        const elemento = document.createElement("div");

        elemento.className = "weekday";

        elemento.textContent = dia;

        grid.appendChild(elemento);
    });

    const first = new Date(year, month, 1);

    const offset = (first.getDay() + 6) % 7;

    const start = new Date(year, month, 1 - offset);

    const today = new Date();

    const days = 42;

    for (let i = 0; i < days; i++) {

        const date = new Date(start);

        date.setDate(start.getDate() + i);

        const iso =
            `${date.getFullYear()}-` +
            `${String(date.getMonth() + 1).padStart(2, "0")}-` +
            `${String(date.getDate()).padStart(2, "0")}`;

        const cell = document.createElement("div");

        cell.className = "day-cell";

        if (date.getMonth() !== month) {
            cell.classList.add("outside");
        }

        if (date.toDateString() === today.toDateString()) {
            cell.classList.add("today");
        }

        const top = document.createElement("div");

        top.className = "day-top";

        const number = document.createElement("button");

        number.className = "day-number";

        number.textContent = date.getDate();

        number.title = "Agregar reservación o bloqueo";

        number.addEventListener("click", () => {
            openEventDialog(null, iso);
        });

        top.appendChild(number);

        cell.appendChild(top);

        const events = data.events.filter(
            e => e.date === iso
        );

        events.slice(0, 2).forEach(ev => {

            const boton = document.createElement("button");

            boton.className =
                "event-chip" +
                (ev.status === "pendiente"
                    ? " pending-event"
                    : ev.status === "bloqueada"
                        ? " blocked-event"
                        : "");

            boton.innerHTML = `
                <span class="event-time">
                    ${
                        ev.status === "bloqueada"
                            ? "Día bloqueado"
                            : escapeHTML(formatTime(ev.time))
                    }
                </span>

                <span class="event-name">
                    ${escapeHTML(ev.name)}
                </span>

                <span class="event-meta">
                    ${
                        ev.status === "bloqueada"
                            ? "No disponible"
                            : `♙ ${ev.guests} personas`
                    }
                </span>
            `;

            boton.title = "Seleccionar para ver o editar";

            boton.addEventListener("click", () => {
                openEventDialog(ev.id);
            });

            cell.appendChild(boton);
        });

        if (events.length > 2) {

            const more = document.createElement("div");

            more.className = "more-events";

            more.textContent = `+${events.length - 2} más`;

            cell.appendChild(more);
        }

        cell.addEventListener("dblclick", () => {
            openEventDialog(null, iso);
        });

        grid.appendChild(cell);
    }

    updateStats();
}

// formato de hora

function formatTime(time) {

    if (!time) return "";

    const [h, m] = time.split(":").map(Number);

    const hour = h % 12 || 12;

    return `${hour}:${String(m).padStart(2, "0")} ${
        h >= 12 ? "p. m." : "a. m."
    }`;
}

// navegación del calendario

$("#prevMonth").addEventListener("click", () => {

    currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
    );

    renderCalendar();
});


$("#nextMonth").addEventListener("click", () => {

    currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
    );

    renderCalendar();
});


$("#todayBtn").addEventListener("click", () => {

    const now = new Date();

    currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    renderCalendar();
});


$$(".view-toggle button").forEach(boton => {

    boton.addEventListener("click", () => {

        if (boton.dataset.mode !== "month") {

            showToast(
                "Las vistas de semana y día se habilitarán en una siguiente versión."
            );

            return;
        }

        $$(".view-toggle button").forEach(elemento => {

            elemento.classList.toggle(
                "selected",
                elemento === boton
            );
        });
    });
});


$("#newReservation").addEventListener("click", () => {
    openEventDialog();
});


$("#blockDate").addEventListener("click", () => {
    openEventDialog(null, null, true);
});

$("#addEventFromCalendar").addEventListener("click", () => {
    openEventDialog();
});

// formulario de reservaciones

const eventDialog = $("#eventDialog");

function fillPackageOptions(selected) {

    const select = $("#eventPackage");

    select.innerHTML = data.packages
        .filter(p => p.active)
        .map(p => `
            <option value="${escapeHTML(p.name)}">
                ${escapeHTML(p.name)}
            </option>
        `)
        .join("") ||
        '<option value="—">Sin paquetes activos</option>';

    if (selected) {
        select.value = selected;
    }
}


function openEventDialog(id = null, date = null, blocked = false) {

    const ev = data.events.find(e => e.id === id);

    $("#eventForm").reset();

    $("#eventId").value = ev?.id || "";

    $("#eventDialogTitle").textContent = ev
        ? "Editar evento"
        : blocked
            ? "Bloquear fecha"
            : "Nueva reservación";

    $("#eventName").value =
        ev?.name || (blocked ? "Fecha no disponible" : "");

    $("#eventDate").value =
        ev?.date || date || new Date().toISOString().slice(0, 10);

    $("#eventTime").value = ev?.time || "16:00";

    $("#eventClient").value =
        ev?.client || (blocked ? "Villa Peñas" : "");

    $("#eventGuests").value = ev?.guests || 30;

    $("#eventStatus").value =
        ev?.status || (blocked ? "bloqueada" : "confirmada");

    fillPackageOptions(ev?.package);

    eventDialog.showModal();
}


$("#eventForm").addEventListener("submit", event => {

    event.preventDefault();

    const id = Number($("#eventId").value) || Date.now();

    const ev = {

        id: id,

        name: $("#eventName").value.trim(),

        date: $("#eventDate").value,

        time: $("#eventTime").value,

        client: $("#eventClient").value.trim(),

        guests: Number($("#eventGuests").value),

        package: $("#eventPackage").value || "—",

        status: $("#eventStatus").value
    };

    const existing = data.events.findIndex(
        x => x.id === id
    );

    if (existing >= 0) {
        data.events[existing] = ev;
    } else {
        data.events.push(ev);
    }

    saveData();

    eventDialog.close();

    renderCalendar();

    showToast("Evento guardado en este navegador");
});

// administración de paquetes

function agregarCampoServicio(valor = "") {
  const contenedor = $("#packageServicesContainer");
  const fila = document.createElement("div");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "servicio-input";
  input.placeholder = "Ej. Uso del rancho";
  input.maxLength = 100;
  input.value = valor;

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn btn-outline";
  boton.textContent = "Eliminar";

  boton.addEventListener("click", () => {
    fila.remove();
  });

  fila.appendChild(input);
  fila.appendChild(boton);
  contenedor.appendChild(fila);
}

function obtenerServiciosFormulario() {
  return Array.from(
    document.querySelectorAll(
      "#packageServicesContainer .servicio-input"
    )
  )
    .map(input => input.value.trim())
    .filter(servicio => servicio !== "");
}

function agregarCampoDetalle(detalle = {}) {
  const contenedor = $("#packageDetailsContainer");
  const fila = document.createElement("div");
  fila.className = "detalle-form-row";

  const etiquetaNombre = document.createElement("label");
  etiquetaNombre.textContent = "Nombre del servicio";

  const inputNombre = document.createElement("input");
  inputNombre.type = "text";
  inputNombre.className = "detalle-nombre";
  inputNombre.placeholder = "Ej. Piscina";
  inputNombre.maxLength = 100;
  inputNombre.value = detalle.nombre || "";

  const etiquetaDescripcion = document.createElement("label");
  etiquetaDescripcion.textContent = "Descripción del servicio";

  const inputDescripcion = document.createElement("textarea");
  inputDescripcion.className = "detalle-descripcion";
  inputDescripcion.rows = 2;
  inputDescripcion.maxLength = 300;
  inputDescripcion.placeholder = "Describe el servicio";
  inputDescripcion.value = detalle.descripcion || "";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn btn-outline";
  boton.textContent = "Eliminar detalle";

  boton.addEventListener("click", () => {
    fila.remove();
  });

  fila.appendChild(etiquetaNombre);
  fila.appendChild(inputNombre);
  fila.appendChild(etiquetaDescripcion);
  fila.appendChild(inputDescripcion);
  fila.appendChild(boton);

  contenedor.appendChild(fila);
}

function obtenerDetallesFormulario() {
  return Array.from(
    document.querySelectorAll(
      "#packageDetailsContainer .detalle-form-row"
    )
  ).map(fila => ({
    nombre: fila.querySelector(".detalle-nombre").value.trim(),
    descripcion: fila.querySelector(".detalle-descripcion").value.trim()
  }));
}

$("#btnAgregarServicio").addEventListener("click", () => {
  agregarCampoServicio();
});

$("#btnAgregarDetalle").addEventListener("click", () => {
  agregarCampoDetalle();
});
async function obtenerPaquetes() {

    const body = $("#packageRows");

    try {

        const respuesta = await fetch(`${API_BASE}/paquetes`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los paquetes.");
        }

        const paquetesAPI = await respuesta.json();

        // convertir los nombres del backend a los del panel

        data.packages = paquetesAPI.map(p => ({
            id: p.id,
            name: p.nombre,
            description: p.descripcion,
            price: p.precio,
            active: p.activo !== false,
            servicios: p.servicios || [],
            detalles: p.detalles || []
        }));

        renderPackages();

        // actualizar las opciones de paquetes de las reservaciones

        if ($("#eventPackage")) {
            fillPackageOptions($("#eventPackage").value);
        }

    } catch (error) {

        console.error("Error al consultar paquetes:", error);

        if (body) {
            body.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        No se pudieron cargar los paquetes.
                        Verifica que NestJS esté funcionando.
                    </td>
                </tr>
            `;
        }
    }
}


// mostrar paquetes en la tabla

function renderPackages() {

    const body = $("#packageRows");

    if (!body) return;

    body.innerHTML = data.packages.map(p => `

        <tr>

            <td>
                <span class="package-name">
                    ${escapeHTML(p.name)}
                </span>

                <span class="package-desc">
                    ID ${p.id}
                </span>
            </td>

            <td>
                ${escapeHTML(p.description)}
            </td>

            <td class="price">
                ${money(p.price)}
            </td>

            <td>
                <span class="pill ${
                    p.active ? "pill-active" : "pill-hidden"
                }">
                    ${p.active ? "Activo" : "Oculto"}
                </span>
            </td>

            <td>
                <div class="row-actions">

                    <button
                        type="button"
                        class="mini-action"
                        data-edit-package="${p.id}"
                        title="Editar paquete"
                        aria-label="Editar ${escapeHTML(p.name)}">
                        ✎
                    </button>

                    <button
                        type="button"
                        class="mini-action delete"
                        data-delete-package="${p.id}"
                        title="Eliminar paquete"
                        aria-label="Eliminar ${escapeHTML(p.name)}">
                        ⌫
                    </button>

                </div>
            </td>

        </tr>

    `).join("") || `
        <tr>
            <td colspan="5" class="empty-state">
                Todavía no hay paquetes registrados.
            </td>
        </tr>
    `;

    body.querySelectorAll("[data-edit-package]").forEach(boton => {

        boton.addEventListener("click", () => {
            openPackageDialog(Number(boton.dataset.editPackage));
        });

    });

    body.querySelectorAll("[data-delete-package]").forEach(boton => {

        boton.addEventListener("click", () => {
            deletePackage(Number(boton.dataset.deletePackage));
        });

    });
}
// formulario de paquetes

const packageDialog = $("#packageDialog");

function openPackageDialog(id = null) {
  const p = data.packages.find(x => x.id === id);

  $("#packageForm").reset();

  $("#packageId").value = p?.id || "";
  $("#packageDialogTitle").textContent = p
    ? "Editar paquete"
    : "Nuevo paquete";

  $("#packageName").value = p?.name || "";
  $("#packageDescription").value = p?.description || "";
  $("#packagePrice").value = p?.price ?? "";
  $("#packageActive").value = String(p?.active ?? true);

  $("#packageServicesContainer").innerHTML = "";
  $("#packageDetailsContainer").innerHTML = "";

  const servicios = p?.servicios || [];
  const detalles = p?.detalles || [];

  servicios.forEach(servicio => {
    agregarCampoServicio(servicio);
  });

  detalles.forEach(detalle => {
    agregarCampoDetalle(detalle);
  });

  if (servicios.length === 0) {
    agregarCampoServicio();
  }

  if (detalles.length === 0) {
    agregarCampoDetalle();
  }

  packageDialog.showModal();
}

// abrir formulario para un paquete nuevo

$("#addPackage").addEventListener("click", () => {
    openPackageDialog();
});

// crear o actualizar un paquete en NestJS

$("#packageForm").addEventListener("submit", async event => {
  event.preventDefault();

  const idActual = Number($("#packageId").value);
  const esNuevo = !idActual;

  const paquete = {
  nombre: $("#packageName").value.trim(),
  descripcion: $("#packageDescription").value.trim(),
  precio: Number($("#packagePrice").value),
  servicios: obtenerServiciosFormulario(),
  detalles: obtenerDetallesFormulario(),
  activo: $("#packageActive").value === "true"
};
  if (
    !paquete.nombre ||
    !paquete.descripcion ||
    !Number.isFinite(paquete.precio) ||
    paquete.precio < 0
  ) {
    showToast("Revisa el nombre, la descripción y el precio.");
    return;
  }

  if (paquete.servicios.length === 0) {
    showToast("Agrega al menos un servicio.");
    return;
  }

  if (
    paquete.detalles.length === 0 ||
    paquete.detalles.some(
      detalle => !detalle.nombre || !detalle.descripcion
    )
  ) {
    showToast("Completa los detalles del paquete.");
    return;
  }

  try {
    const respuesta = await fetch(
      esNuevo
        ? `${API_BASE}/paquetes`
        : `${API_BASE}/paquetes/${idActual}`,
      {
        method: esNuevo ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paquete)
      }
    );

    if (!respuesta.ok) {
      const mensaje = await respuesta.text();
      throw new Error(mensaje || "No se pudo guardar el paquete.");
    }

    packageDialog.close();

    await obtenerPaquetes();

    showToast(
      esNuevo
        ? "Paquete creado correctamente."
        : "Paquete actualizado correctamente."
    );

  } catch (error) {
    console.error("Error al guardar el paquete:", error);
    showToast("No se pudo guardar el paquete. Revisa el backend.");
  }
});

// eliminar paquetes

async function deletePackage(id) {

    const paquete = data.packages.find(p => p.id === id);

    if (!paquete) return;

    if (!confirm(
        `¿Deseas eliminar el paquete "${paquete.name}"?`
    )) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_BASE}/paquetes/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!respuesta.ok) {

            const mensaje = await respuesta.text();

            throw new Error(
                mensaje || "No se pudo eliminar el paquete."
            );
        }

        await obtenerPaquetes();

        showToast("Paquete eliminado correctamente.");

    } catch (error) {

        console.error("Error al eliminar el paquete:", error);

        showToast(
            "No se pudo eliminar el paquete. Verifica NestJS."
        );

    }

}

 // administracion de adicionales

let additionalItems = [];

const adicionalDialog = $("#adicionalDialog");


// consultar adicionales desde NestJS
async function obtenerAdicionales() {

    const body = $("#adicionalesTableBody");

    try {

        const respuesta = await fetch(`${API_BASE}/adicionales`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los adicionales.");
        }

        additionalItems = await respuesta.json();

        renderAdditionals();

    } catch (error) {

        console.error("Error al consultar adicionales:", error);

        if (body) {
            body.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        No se pudieron cargar los adicionales.
                        Verifica que NestJS esté funcionando.
                    </td>
                </tr>
            `;
        }
    }
}


// mostrar los adicionales en la tabla
function renderAdditionals() {

    const body = $("#adicionalesTableBody");

    if (!body) return;

    body.innerHTML = additionalItems.map(adicional => `

        <tr>
            <td>${adicional.id}</td>

            <td>
                <span class="package-name">
                    ${escapeHTML(adicional.categoria)}
                </span>
            </td>

            <td>
                ${escapeHTML(adicional.descripcion)}
            </td>

            <td>
                ${adicional.paquetes.length}
            </td>

          <td>
    <div class="row-actions">

        <button
            class="mini-action"
            data-edit-adicional="${adicional.id}"
            title="Editar adicional"
            aria-label="Editar ${escapeHTML(adicional.categoria)}">
            ✎
        </button>

        <button
            class="mini-action delete"
            data-delete-adicional="${adicional.id}"
            title="Eliminar adicional"
            aria-label="Eliminar ${escapeHTML(adicional.categoria)}">
            ⌫
        </button>

    </div>
</td>
        </tr>

    `).join("") || `
        <tr>
            <td colspan="5" class="empty-state">
                No hay adicionales registrados.
            </td>
        </tr>
    `;


    // botón para editar
    body.querySelectorAll("[data-edit-adicional]").forEach(boton => {

        boton.addEventListener("click", () => {

            abrirFormularioAdicional(
                Number(boton.dataset.editAdicional)
            );

        });

    });


    // botón para eliminar
    body.querySelectorAll("[data-delete-adicional]").forEach(boton => {

        boton.addEventListener("click", () => {

            eliminarAdicional(
                Number(boton.dataset.deleteAdicional)
            );

        });

    });

}


// crear los campos de paquetes dentro del formulario
function renderCamposPaquetes(paquetes = []) {

    const contenedor = $("#adicionalPaquetesContainer");

    contenedor.innerHTML = "";

    paquetes.forEach(paquete => {
        agregarCampoPaquete(paquete);
    });

}


// agregar un paquete al formulario
function agregarCampoPaquete(paquete = {}) {

    const contenedor = $("#adicionalPaquetesContainer");

    const idsActuales = Array.from(
        contenedor.querySelectorAll(".adicional-paquete")
    ).map(campo => Number(campo.dataset.paqueteId));

    const id = paquete.id ??
        (Math.max(0, ...idsActuales) + 1);

    const campo = document.createElement("fieldset");

    campo.className = "adicional-paquete";

    campo.dataset.paqueteId = id;

    campo.innerHTML = `

        <legend>Paquete #${id}</legend>

        <label>Nombre del paquete</label>
        <input
            type="text"
            data-campo="nombre"
            value="${escapeHTML(paquete.nombre || "")}"
            required>

        <label>Cantidad</label>
        <input
            type="text"
            data-campo="cantidad"
            value="${escapeHTML(paquete.cantidad || "")}"
            required>

        <label>Detalle</label>
        <textarea
            data-campo="detalle"
            required>${escapeHTML(paquete.detalle || "")}</textarea>

        <label>Precio en colones</label>
        <input
            type="number"
            data-campo="precio"
            min="0"
            step="1"
            value="${paquete.precio ?? ""}"
            required>

        <button
            type="button"
            class="btn btn-outline btn-quitar-paquete">
            Quitar paquete
        </button>

    `;


    campo.querySelector(".btn-quitar-paquete")
        .addEventListener("click", () => {

            campo.remove();

        });


    contenedor.appendChild(campo);

}


// Botón para agregar paquetes al adicional
$("#btnAgregarPaqueteAdicional").addEventListener("click", () => {

    const contenedor = $("#adicionalPaquetesContainer");

    const idsActuales = Array.from(
        contenedor.querySelectorAll(".adicional-paquete")
    ).map(campo => Number(campo.dataset.paqueteId));

    const siguienteId = Math.max(0, ...idsActuales) + 1;

    agregarCampoPaquete({
        id: siguienteId,
        nombre: `Paquete #${siguienteId}`,
        cantidad: "",
        detalle: "",
        precio: 0
    });

});


// obtener los paquetes escritos en el formulario
function obtenerPaquetesFormulario() {

    return Array.from(
        $("#adicionalPaquetesContainer")
            .querySelectorAll(".adicional-paquete")
    ).map(campo => ({

        id: Number(campo.dataset.paqueteId),

        nombre: campo.querySelector(
            '[data-campo="nombre"]'
        ).value.trim(),

        cantidad: campo.querySelector(
            '[data-campo="cantidad"]'
        ).value.trim(),

        detalle: campo.querySelector(
            '[data-campo="detalle"]'
        ).value.trim(),

        precio: Number(campo.querySelector(
            '[data-campo="precio"]'
        ).value)

    }));

}


// abrir el formulario para crear o editar
function abrirFormularioAdicional(id = null) {

    const adicional = additionalItems.find(
        item => item.id === id
    );

    $("#adicionalForm").reset();

    $("#adicionalId").value = adicional?.id ?? "";

    $("#adicionalDialogTitle").textContent = adicional
        ? "Editar adicional"
        : "Nuevo adicional";

    $("#adicionalCategoria").value =
        adicional?.categoria || "";

    $("#adicionalDescripcion").value =
        adicional?.descripcion || "";


    renderCamposPaquetes(adicional?.paquetes || [
        {
            id: 1,
            nombre: "Paquete #1",
            cantidad: "",
            detalle: "",
            precio: 0
        }
    ]);

    adicionalDialog.showModal();

}


// botón para crear un nuevo adicional
$("#btnNuevoAdicional").addEventListener("click", () => {

    abrirFormularioAdicional();

});


// guardar un adicional nuevo o actualizar uno existente
$("#adicionalForm").addEventListener("submit", async event => {

    event.preventDefault();

    const idActual = Number($("#adicionalId").value);

    const paquetes = obtenerPaquetesFormulario();


    if (paquetes.length === 0) {

        showToast("Agrega al menos un paquete.");

        return;
    }


    const adicional = {

        categoria: $("#adicionalCategoria").value.trim(),

        descripcion: $("#adicionalDescripcion").value.trim(),

        paquetes

    };


    // validar campos de los paquetes
    const paqueteInvalido = paquetes.some(paquete =>

        !paquete.nombre ||
        !paquete.cantidad ||
        !paquete.detalle ||
        !Number.isFinite(paquete.precio) ||
        paquete.precio < 0

    );


    if (paqueteInvalido) {

        showToast("Revisa los datos de los paquetes.");

        return;
    }


    const esNuevo = !idActual;


    // el backend requiere un ID al crear un adicional
    if (esNuevo) {

        adicional.id = Math.max(
            0,
            ...additionalItems.map(item => Number(item.id))
        ) + 1;

    }


    try {

        const respuesta = await fetch(

            esNuevo
                ? `${API_BASE}/adicionales`
                : `${API_BASE}/adicionales/${idActual}`,

            {

                method: esNuevo ? "POST" : "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(adicional)

            }

        );


        if (!respuesta.ok) {

            const mensaje = await respuesta.text();

            throw new Error(
                mensaje || "No se pudo guardar el adicional."
            );

        }


        adicionalDialog.close();

        await obtenerAdicionales();

        showToast(
            esNuevo
                ? "Adicional creado correctamente."
                : "Adicional actualizado correctamente."
        );


    } catch (error) {

        console.error("Error al guardar el adicional:", error);

        showToast(
            "No se pudo guardar. Verifica NestJS y los datos enviados."
        );

    }

});


// eliminar un adicional
async function eliminarAdicional(id) {

    const adicional = additionalItems.find(
        item => item.id === id
    );

    if (!adicional) return;


    if (!confirm(
        `¿Deseas eliminar el adicional "${adicional.categoria}"?`
    )) {
        return;
    }


    try {

        const respuesta = await fetch(
            `${API_BASE}/adicionales/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!respuesta.ok) {

            throw new Error("No se pudo eliminar el adicional.");

        }


        await obtenerAdicionales();

        showToast("Adicional eliminado correctamente.");


    } catch (error) {

        console.error("Error al eliminar el adicional:", error);

        showToast("No se pudo eliminar el adicional.");

    }

}

// administración de reseñas
async function renderReviews() {
    const lista = document.querySelector("#reviewsList");

    lista.innerHTML = `
        <div class="empty-state">Cargando reseñas...</div>
    `;

    let endpoint;

    if (reviewStatus === "pendiente") {
        endpoint = `${API_BASE}/resenas/pendientes`;
    } else if (reviewStatus === "publicada") {
        endpoint = `${API_BASE}/resenas`;
    } else if (reviewStatus === "rechazada") {
        endpoint = `${API_BASE}/resenas/rechazadas`;
    }

    try {
        const respuesta = await fetch(endpoint);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar las reseñas.");
        }

        const resenas = await respuesta.json();

        const resenasAdmin = resenas.map(r => ({
            id: r.id,
            name: r.usuario,
            date: r.fechaCreacion
                ? new Date(r.fechaCreacion).toLocaleDateString("es-CR")
                : "",
            rating: r.calificacion,
            comment: r.comentario,
            status: r.estado === "APROBADA"
                ? "publicada"
                : r.estado === "RECHAZADA"
                    ? "rechazada"
                    : "pendiente"
        }));

        lista.innerHTML = resenasAdmin.map(r => `
            <article class="review-item">
                <div class="avatar avatar-light">
                    ${escapeHTML(
                        (r.name || "")
                            .split(" ")
                            .map(s => s[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                    )}
                </div>

                <div class="review-main">
                    <strong>${escapeHTML(r.name || "")}</strong>

                    <div class="review-date">
                        ${escapeHTML(r.date)}
                    </div>

                    <div class="stars">
                        ${"★".repeat(r.rating)}
                        ${"☆".repeat(5 - r.rating)}
                    </div>

                    <div class="review-comment">
                        ${escapeHTML(r.comment || "")}
                    </div>
                </div>

                <div class="review-actions">
                    ${r.status === "pendiente" ? `
                        <button
                            class="btn-small btn-approve"
                            data-approve="${r.id}">
                            Publicar
                        </button>

                        <button
                            class="btn-small btn-reject"
                            data-reject="${r.id}">
                            Rechazar
                        </button>
                    ` : ""}

                    ${r.status === "publicada" ? `
                        <button
                            class="btn-small btn-reject"
                            data-withdraw="${r.id}">
                            Retirar publicación
                        </button>
                    ` : ""}

                    ${r.status === "rechazada" ? `
                        <button
                            class="btn-small btn-approve"
                            data-approve="${r.id}">
                            Volver a publicar
                        </button>
                    ` : ""}
                </div>
            </article>
        `).join("") || `
            <div class="empty-state">
                No hay reseñas en esta categoría.
            </div>
        `;

        document.querySelectorAll("#reviewTabs button")
            .forEach(boton => {
                boton.classList.toggle(
                    "selected",
                    boton.dataset.status === reviewStatus
                );
            });

        lista.querySelectorAll("[data-approve]")
            .forEach(boton => {
                boton.addEventListener("click", () => {
                    setReviewStatus(
                        Number(boton.dataset.approve),
                        "publicada"
                    );
                });
            });

        lista.querySelectorAll("[data-reject]")
            .forEach(boton => {
                boton.addEventListener("click", () => {
                    setReviewStatus(
                        Number(boton.dataset.reject),
                        "rechazada"
                    );
                });
            });

        lista.querySelectorAll("[data-withdraw]")
            .forEach(boton => {
                boton.addEventListener("click", () => {
                    const confirmar = confirm(
                        "¿Deseas retirar esta reseña de la página principal?"
                    );

                    if (confirmar) {
                        setReviewStatus(
                            Number(boton.dataset.withdraw),
                            "rechazada"
                        );
                    }
                });
            });

    } catch (error) {
        console.error("Error al cargar las reseñas:", error);

        lista.innerHTML = `
            <div class="empty-state">
                No se pudieron cargar las reseñas.
                Verifica que NestJS esté funcionando.
            </div>
        `;
    }

    await actualizarContadoresResenas();
}

// cambiar estados de la reseña

async function setReviewStatus(id, status) {
    const estadoAPI = status === "publicada"
        ? "APROBADA"
        : status === "rechazada"
            ? "RECHAZADA"
            : null;

    if (!estadoAPI) return;

    try {
        const respuesta = await fetch(
            `${API_BASE}/resenas/${id}/estado`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    estado: estadoAPI
                })
            }
        );

        if (!respuesta.ok) {
            const mensaje = await respuesta.text();

            throw new Error(
                mensaje || "No se pudo actualizar la reseña."
            );
        }

        showToast(
            status === "publicada"
                ? "Reseña publicada correctamente."
                : "Reseña retirada o rechazada correctamente."
        );

        await renderReviews();

    } catch (error) {
        console.error(
            "Error al actualizar la reseña:",
            error
        );

        showToast(
            "No se pudo actualizar la reseña. Revisa la consola."
        );
    }
}



// filtros de reseñas por estado

$("#reviewTabs")
    .querySelectorAll("button")
    .forEach(boton => {

        boton.addEventListener("click", () => {

            reviewStatus = boton.dataset.status;

            renderReviews();
        });
    });

// solicitudes de reservaciones

function renderRequests() {

    const requestList = $("#requestList");

    if (!requestList) return;

    requestList.innerHTML = data.requests.map(r => `

        <article class="request-item">

            <div class="avatar avatar-light">

                ${escapeHTML(
                    r.name
                        .split(" ")
                        .map(s => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                )}

            </div>

            <div class="request-main">

                <strong>

                    ${escapeHTML(r.name)}

                    <span class="pill ${
                        r.status === "Nueva"
                            ? "pill-pending"
                            : "pill-active"
                    }">
                        ${escapeHTML(r.status)}
                    </span>

                </strong>

                <div class="request-date">

                    ${escapeHTML(r.date)} ·
                    ${escapeHTML(formatTime(r.time))} ·
                    ${r.guests} personas

                </div>

                <div class="request-detail">

                    ${escapeHTML(r.package)} ·
                    ${escapeHTML(r.message)} ·
                    Tel. ${escapeHTML(r.phone)}

                </div>

            </div>

            <div class="review-actions">

                <button
                    class="btn-small btn-approve"
                    data-confirm-request="${r.id}">

                    Marcar revisada

                </button>

            </div>

        </article>

    `).join("") ||
    '<div class="empty-state">No hay solicitudes nuevas.</div>';

    requestList
    .querySelectorAll("[data-confirm-request]")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const req = data.requests.find(
                    r => r.id === Number(
                        boton.dataset.confirmRequest
                    )
                );

                if (req) {

                    req.status = "Revisada";

                    saveData();

                    renderRequests();

                    showToast(
                        "Solicitud marcada como revisada"
                    );
                }
            });
        });

    updateStats();
}

// cerrar ventanas emergentes

$$(".close-dialog").forEach(boton => {

    boton.addEventListener("click", () => {

        boton.closest("dialog").close();
    });
});


$$("dialog").forEach(dialogo => {

    dialogo.addEventListener("click", event => {

        if (event.target === dialogo) {

            dialogo.close();
        }
    });
});

// inicializacion de todas las secciones

function renderAll() {

    renderCalendar();

    renderPackages();

    renderReviews();

    renderRequests();

    updateStats();
}


// consultar fotografias

async function renderGallery() {

    const contenedor = document.getElementById("adminGallery");

    contenedor.innerHTML = `
        <p class="empty-state">Cargando fotografías...</p>
    `;

    try {
        // Obtener fotografías desde NestJS
        const respuesta = await fetch(`${API_BASE}/galeria`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar las fotografías");
        }

        const fotos = await respuesta.json();

        contenedor.innerHTML = "";

        if (fotos.length === 0) {
            contenedor.innerHTML = `
                <p class="empty-state">
                    No hay fotografías registradas.
                </p>
            `;
            return;
        }

        const fragmento = document.createDocumentFragment();

        fotos.forEach(function(foto, indice) {

            const tarjeta = document.createElement("article");
            tarjeta.className = "gallery-admin-card";

            // Imagen almacenada en NestJS
            const imagen = document.createElement("img");

            imagen.src = `${API_BASE}${foto.src}`;
            imagen.alt = foto.descripcion;
            imagen.loading = "lazy";
            imagen.decoding = "async";

            // Contenido de la tarjeta
            const contenido = document.createElement("div");
            contenido.className = "gallery-admin-content";

            const numero = document.createElement("small");
            numero.textContent = `Fotografía ${indice + 1}`;

            const descripcion = document.createElement("p");
            descripcion.textContent = foto.descripcion;

            contenido.appendChild(numero);
            contenido.appendChild(descripcion);

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(contenido);

            fragmento.appendChild(tarjeta);
        });

        contenedor.appendChild(fragmento);

    } catch (error) {

        console.error("Error al cargar fotografías:", error);

        contenedor.innerHTML = `
            <p class="empty-state">
                No se pudieron cargar las fotografías.
                Verificá que NestJS esté funcionando.
            </p>
        `;
    }
}

// galeria ventana emergente

const photoDialog = document.getElementById("photoDialog");
const addPhoto = document.getElementById("addPhoto");
const photoForm = document.getElementById("photoForm");

// vista previa de la foto

const photoFile = document.getElementById("photoFile");
const photoPreview = document.getElementById("photoPreview");

const photoPreviewContainer = document.getElementById(
    "photoPreviewContainer"
);

let photoPreviewURL = null;

// liberar la vista previa anterior
function limpiarVistaPrevia() {

    if (photoPreviewURL) {
        URL.revokeObjectURL(photoPreviewURL);
        photoPreviewURL = null;
    }

    photoPreview.removeAttribute("src");
    photoPreviewContainer.hidden = true;
}

// mostrar fotografía seleccionada
photoFile.addEventListener("change", function () {

    limpiarVistaPrevia();

    const archivo = photoFile.files[0];

    if (!archivo) return;

    // validar formato
    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
        alert("Seleccioná una imagen JPG, PNG o WebP.");
        photoFile.value = "";
        return;
    }

    // validar tamaño máximo de 5 MB
    if (archivo.size > 5 * 1024 * 1024) {
        alert("La imagen no puede superar los 5 MB.");
        photoFile.value = "";
        return;
    }

    // crear URL temporal para mostrar la imagen
    photoPreviewURL = URL.createObjectURL(archivo);

    photoPreview.src = photoPreviewURL;

    photoPreviewContainer.hidden = false;
});

// abrir formulario
addPhoto.addEventListener("click", function () {

    photoForm.reset();

    limpiarVistaPrevia();

    photoDialog.showModal();
});


// guardar fotos en nestJS

photoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const archivo = photoFile.files[0];

    const descripcion = document
        .getElementById("photoDescription")
        .value
        .trim();

    // Validar fotografía
    if (!archivo) {
        showToast("Seleccioná una fotografía.");
        return;
    }

    // Validar descripción
    if (!descripcion) {
        showToast("Ingresá una descripción.");
        return;
    }

    if (descripcion.length > 200) {
        showToast("La descripción no puede superar 200 caracteres.");
        return;
    }

    // Validar formato
    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
        showToast("Solo se permiten imágenes JPG, PNG y WebP.");
        return;
    }

    // Validar tamaño máximo
    if (archivo.size > 5 * 1024 * 1024) {
        showToast("La fotografía no puede superar los 5 MB.");
        return;
    }

    // Preparar datos para NestJS
    const formData = new FormData();

    formData.append("imagen", archivo);
    formData.append("descripcion", descripcion);

    const botonGuardar = photoForm.querySelector(
        'button[type="submit"]'
    );

    botonGuardar.disabled = true;
    botonGuardar.textContent = "Guardando...";

    try {
        // Enviar fotografía al backend
        const respuesta = await fetch(`${API_BASE}/galeria`, {
            method: "POST",
            body: formData
        });

        if (!respuesta.ok) {
            const error = await respuesta.text();

            throw new Error(
                error || "No se pudo guardar la fotografía."
            );
        }

        // Obtener información de la fotografía registrada
        const nuevaFoto = await respuesta.json();

        console.log("Fotografía registrada:", nuevaFoto);

        // Cerrar formulario
        photoDialog.close();

        // Actualizar fotografías del administrador
        await renderGallery();

        showToast("Fotografía guardada correctamente.");

    } catch (error) {

        console.error("Error al guardar fotografía:", error);

        showToast(
            "No se pudo guardar la fotografía. Revisá la conexión con NestJS."
        );

    } finally {

        botonGuardar.disabled = false;
        botonGuardar.textContent = "Guardar fotografía";
    }
});

//liberar memoria
photoDialog.addEventListener("close", function () {

    limpiarVistaPrevia();

});

// iniciar todas las secciones

renderAll();

obtenerPaquetes();
obtenerAdicionales();
actualizarContadoresResenas();

// Recuperar la última sección seleccionada
const vistaGuardada =
    sessionStorage.getItem("adminVistaActual") || "calendario";

const vistasPermitidas = [
    "calendario",
    "paquetes",
    "adicionales",
    "galeria",
    "resenas",
    "solicitudes"
];

if (vistasPermitidas.includes(vistaGuardada)) {
    setView(vistaGuardada);
} else {
    setView("calendario");
}