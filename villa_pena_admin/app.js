/* ==========================================
   VILLA PEÑAS - PANEL ADMINISTRATIVO
   ==========================================

   Panel de administración (frontend).

   API futura: NestJS con TypeScript.
   Actualmente utiliza localStorage.

========================================== */


// ==========================================
// 1. CONFIGURACIÓN GENERAL
// ==========================================

const API_BASE = "http://localhost:3000";

const STORAGE_KEY = "villaPenasAdminDemoV1";


// ==========================================
// 2. DATOS INICIALES
// ==========================================

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


// ==========================================
// 4. SELECTORES DEL DOM
// ==========================================

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => [
    ...document.querySelectorAll(selector)
];


// ==========================================
// 5. ALMACENAMIENTO LOCAL
// ==========================================

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


// ==========================================
// 6. FUNCIONES AUXILIARES
// ==========================================

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


// ==========================================
// 7. ESTADÍSTICAS
// ==========================================

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

    $("#statReviews").textContent = data.reviews.filter(
        r => r.status === "pendiente"
    ).length;

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


// ==========================================
// 8. NAVEGACIÓN DEL PANEL
// ==========================================

function setView(next) {

    view = next;

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

    if (next === "resenas") renderReviews();

    if (next === "solicitudes") renderRequests();

    if (next === "calendario") renderCalendar();
}

// 9. EVENTOS DE NAVEGACIÓN

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

// 10. CALENDARIO

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

// 11. FORMATO DE HORA

function formatTime(time) {

    if (!time) return "";

    const [h, m] = time.split(":").map(Number);

    const hour = h % 12 || 12;

    return `${hour}:${String(m).padStart(2, "0")} ${
        h >= 12 ? "p. m." : "a. m."
    }`;
}

// 12. NAVEGACIÓN DEL CALENDARIO

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

// 13. FORMULARIO DE RESERVACIONES

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

// 14. ADMINISTRACIÓN DE PAQUETES

function renderPackages() {

    const body = $("#packageRows");

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
                        class="mini-action"
                        data-edit-package="${p.id}"
                        title="Editar paquete"
                        aria-label="Editar ${escapeHTML(p.name)}">
                        ✎
                    </button>

                    <button
                        class="mini-action delete"
                        data-delete-package="${p.id}"
                        title="Eliminar paquete"
                        aria-label="Eliminar ${escapeHTML(p.name)}">
                        ⌫
                    </button>

                </div>
            </td>

        </tr>

    `).join("") ||
    '<tr><td colspan="5" class="empty-state">Todavía no hay paquetes. Agrega el primero.</td></tr>';

    body.querySelectorAll("[data-edit-package]").forEach(boton => {

        boton.addEventListener("click", () => {

            openPackageDialog(
                Number(boton.dataset.editPackage)
            );
        });
    });

    body.querySelectorAll("[data-delete-package]").forEach(boton => {

        boton.addEventListener("click", () => {

            deletePackage(
                Number(boton.dataset.deletePackage)
            );
        });
    });
}

// 15. FORMULARIO DE PAQUETES

const packageDialog = $("#packageDialog");

function openPackageDialog(id = null) {

    const p = data.packages.find(x => x.id === id);

    $("#packageForm").reset();

    $("#packageId").value = p?.id || "";

    $("#packageDialogTitle").textContent =
        p ? "Editar paquete" : "Nuevo paquete";

    $("#packageName").value = p?.name || "";

    $("#packageDescription").value = p?.description || "";

    $("#packagePrice").value = p?.price ?? "";

    $("#packageActive").value = String(p?.active ?? true);

    packageDialog.showModal();
}


$("#addPackage").addEventListener("click", () => {
    openPackageDialog();
});


$("#packageForm").addEventListener("submit", event => {

    event.preventDefault();

    const id = Number($("#packageId").value) || Date.now();

    const p = {

        id: id,

        name: $("#packageName").value.trim(),

        description: $("#packageDescription").value.trim(),

        price: Number($("#packagePrice").value),

        active: $("#packageActive").value === "true"
    };

    const i = data.packages.findIndex(
        x => x.id === id
    );

    if (i >= 0) {
        data.packages[i] = p;
    } else {
        data.packages.push(p);
    }

    saveData();

    packageDialog.close();

    renderPackages();

    showToast(
        "Paquete guardado localmente. Falta conectarlo a la API para publicar el cambio."
    );
});

// 16. ELIMINAR PAQUETES

function deletePackage(id) {

    const p = data.packages.find(x => x.id === id);

    if (!p || !confirm(
        `¿Eliminar el paquete “${p.name}” de esta demostración?`
    )) {
        return;
    }

    data.packages = data.packages.filter(
        x => x.id !== id
    );

    saveData();

    renderPackages();

    showToast("Paquete eliminado localmente");
}

// 17. ADMINISTRACIÓN DE RESEÑAS

function renderReviews() {

    const filtered = data.reviews.filter(
        r => r.status === reviewStatus
    );

    $("#reviewsList").innerHTML = filtered.map(r => `

        <article class="review-item">

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

            <div class="review-main">

                <strong>
                    ${escapeHTML(r.name)}
                </strong>

                <div class="review-date">
                    ${escapeHTML(r.date)}
                </div>

                <div class="stars">
                    ${"★".repeat(r.rating)}
                    ${"☆".repeat(5 - r.rating)}
                </div>

                <div class="review-comment">
                    ${escapeHTML(r.comment)}
                </div>

            </div>

            <div class="review-actions">

                ${
                    r.status === "pendiente"
                        ? `
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
                        `
                        : `
                            <button
                                class="btn-small btn-neutral"
                                data-pending="${r.id}">
                                Volver a pendientes
                            </button>
                        `
                }

            </div>

        </article>

    `).join("") ||
    '<div class="empty-state">No hay reseñas en esta categoría.</div>';

    $("#reviewTabs")
        .querySelectorAll("button")
        .forEach(boton => {

            boton.classList.toggle(
                "selected",
                boton.dataset.status === reviewStatus
            );
        });

    $("#reviewsList")
        .querySelectorAll("[data-approve]")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                setReviewStatus(
                    Number(boton.dataset.approve),
                    "publicada"
                );
            });
        });

    $("#reviewsList")
        .querySelectorAll("[data-reject]")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                setReviewStatus(
                    Number(boton.dataset.reject),
                    "rechazada"
                );
            });
        });

    $("#reviewsList")
        .querySelectorAll("[data-pending]")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                setReviewStatus(
                    Number(boton.dataset.pending),
                    "pendiente"
                );
            });
        });

    updateStats();
}

// 18. CAMBIAR ESTADO DE RESEÑAS

function setReviewStatus(id, status) {

    const review = data.reviews.find(
        r => r.id === id
    );

    if (!review) return;

    review.status = status;

    saveData();

    renderReviews();

    showToast(
        status === "publicada"
            ? "Reseña aprobada en la demostración. La web pública necesita la API para reflejarlo."
            : status === "rechazada"
                ? "Reseña rechazada."
                : "Reseña devuelta a pendientes."
    );
}

// 19. FILTROS DE RESEÑAS

$("#reviewTabs")
    .querySelectorAll("button")
    .forEach(boton => {

        boton.addEventListener("click", () => {

            reviewStatus = boton.dataset.status;

            renderReviews();
        });
    });

// 20. SOLICITUDES DE RESERVACIÓN

function renderRequests() {

    $("#requestList").innerHTML = data.requests.map(r => `

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

    $("#requestList")
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

// 21. CERRAR VENTANAS EMERGENTES

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

// 22. INICIALIZACIÓN DEL PANEL

function renderAll() {

    renderCalendar();

    renderPackages();

    renderReviews();

    renderRequests();

    updateStats();
}

// galeria ventana emergente

const photoDialog = document.getElementById("photoDialog");
const addPhoto = document.getElementById("addPhoto");
const photoForm = document.getElementById("photoForm");

// abrir formulario
addPhoto.addEventListener("click", function () {

    photoForm.reset();

    document.getElementById("photoPreviewContainer").hidden = true;

    photoDialog.showModal();
});

// Cerrar formulario
photoDialog.querySelectorAll(".close-dialog").forEach(function (boton) {

    boton.addEventListener("click", function () {
        photoDialog.close();
    });

});
// Iniciar todas las secciones
renderAll();
