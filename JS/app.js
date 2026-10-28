// buscamos los elementos del HTML.
const formulario = document.querySelector("#solicitudForm");
//paquetes y adicionales
const listaPaquetes = document.querySelector("#paquetesContainer");
const contenedorAdicionales = document.querySelector("#adicionalesContainer");
const opcionesAdicionales = document.querySelector("#checksAdicionales");
const seleccionarPaquete = document.querySelector("#paquete");
const mostrarAviso = document.querySelector("#formMessage");
const campos = formulario.querySelectorAll(".form-input");
//formulario
const campoNombre = document.querySelector("#nombre");
const campoTelefono = document.querySelector("#telefono");
const campoCorreo = document.querySelector("#correo");
const campoFecha = document.querySelector("#fecha");
const campoPersonas = document.querySelector("#personas");
const campoMensaje = document.querySelector("#mensaje");
const acepta = document.querySelector("#acepta");
const botonMenu = document.querySelector("#menuButton");
const menu = document.querySelector("#menu");
const modal = document.querySelector("#modal");
const tituloModal = document.querySelector("#modalTitle");
const precioModal = document.querySelector("#modalPrice");
const descripcionModal = document.querySelector("#modalDescription");
const serviciosModal = document.querySelector("#modalServices");
const botonCerrarModal = document.querySelector("#closeModal");
const botonElegirPaquete = document.querySelector("#choosePackage");
//galeria section
const galeria = document.querySelector("#lightbox");
const imagenGaleria = document.querySelector("#lightboxImg");
const botonCerrarGaleria = document.querySelector("#closeLightbox");
//hora de formulario
const horaInicio = document.querySelector("#horaInicio");
const horaFinal = document.querySelector("#horaFinal");
//galeria ver mas 
const galeriaExtra = document.querySelector("#galeriaExtra");
const botonVerMas = document.querySelector("#verMasGaleria");

let paqueteSeleccionado = null;
let adicionalesSeleccionados = [];
// se conserva pendiente hasta confirmar el WhatsApp oficial, este numero de momento es de prueba.
const WHATSAPP_NUMBER = "50660121469";

/* enviar solicitud */

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // validar la cantidad de personas antes de enviar la solicitud
    const cantidadSolicitada = Number(campoPersonas.value);

    if (
        !Number.isSafeInteger(cantidadSolicitada) ||
        cantidadSolicitada < 1 ||
        cantidadSolicitada > 50
    ) {
        mostrarMensaje(
            "La cantidad permitida es de 1 a 50 personas.",
            "error"
        );
        return;
    }

    // Asegurar que el adicional esté seleccionado antes
    // de construir la solicitud enviada a NestJS.
    sincronizarAdicionalPersonas();

    if (!campoPersonas.validity.valid) {
        mostrarMensaje(
            campoPersonas.validationMessage,
            "error"
        );
        return;
    }


    campoFecha.min = fechaLocalHoy();
    campoNombre.value = campoNombre.value.trim();
    campoTelefono.value = campoTelefono.value.trim();
    campoCorreo.value = campoCorreo.value.trim();

    if (!validarFormulario()) {
        return;
    }

    if (!acepta.checked) {
        mostrarMensaje(
            "Debés aceptar las indicaciones de la reserva.",
            "error"
        );
        return;
    }

    //buscar el paquete elegido en el arreglo de paquetes
    const paqueteElegido = paquetes.find(function(paquete) {
    return paquete.nombre === seleccionarPaquete.value &&
           paquete.activo !== false;
    });

    if (!paqueteElegido) {
        mostrarMensaje("Seleccioná un paquete válido.", "error");
        return;
    }

    // recopilar datos del formulario
    const solicitud = {
        name: "Solicitud de reservación",
        client: campoNombre.value,
        phone: campoTelefono.value.replace(/[\s()-]/g, ""),
        email: campoCorreo.value,
        date: campoFecha.value,
        time: horaInicio.value,
        guests: Number(campoPersonas.value),
        package: seleccionarPaquete.value,
        packagePrice: Number(paqueteElegido.precio),
        adicionales: obtenerAdicionalesSeleccionados().map(a => ({
            categoria: String(a.categoria),
            paquete: String(a.paquete),
            cantidad: String(a.cantidad),
            detalle: String(a.detalle),
            precio: Number(a.precio)
        })),
        message: campoMensaje.value.trim()
    };

    // Validar las 8 horas dentro del horario permitido
    const [horas, minutos] = solicitud.time.split(":").map(Number);
    const inicio = horas * 60 + minutos;
    const salida = inicio + 8 * 60;

    if (
        !Number.isFinite(inicio) ||
        inicio < 6 * 60 ||
        salida > 18 * 60
    ) {
        mostrarMensaje(
            "La hora de entrada debe estar entre las 6:00 a. m. y las 10:00 a. m.",
            "error"
        );
        return;
    }

    const botonEnviar = formulario.querySelector('button[type="submit"]');

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando solicitud...";

    try {
        const respuesta = await fetch(
            "http://localhost:3000/reservas/solicitudes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(solicitud)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            const mensaje = Array.isArray(resultado.message)
                ? resultado.message.join(", ")
                : resultado.message;

            throw new Error(
                mensaje || "No se pudo registrar la solicitud."
            );
        }

        
console.log("Solicitud registrada en NestJS:", resultado);

// Preparar el mensaje con los datos de la cotización
const mensajeWhatsApp = crearMensajeSolicitud(solicitud);

const numeroWhatsApp = WHATSAPP_NUMBER.replace(/\D/g, "");

if (!/^[1-9]\d{7,14}$/.test(numeroWhatsApp)) {
    mostrarMensaje(
        "La cotización quedó registrada, pero el número de WhatsApp de Villa Peñas no está configurado correctamente.",
        "warning"
    );
} else {
    const urlWhatsApp =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(mensajeWhatsApp);

    mostrarMensaje(
        "¡Cotización registrada! Abrí WhatsApp y presioná Enviar para completar tu solicitud.",
        "success"
    );

    // enlace de respaldo por si el navegador bloquea la pestaña
    const enlace = document.createElement("a");
    enlace.href = urlWhatsApp;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.className = "whatsapp-fallback";
    enlace.textContent = "Abrir WhatsApp";
    mostrarAviso.appendChild(document.createTextNode(" "));
    mostrarAviso.appendChild(enlace);

    window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
}

    } catch (error) {
        console.error("Error al enviar solicitud:", error);

        mostrarMensaje(
            error.message || "No se pudo enviar la solicitud. Intentá nuevamente.",
            "error"
        );

    } finally {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Cotizar";
    }
});

// muestra los paquetes que están en el arreglo de datos.js.
function mostrarPaquetes() {
    listaPaquetes.innerHTML = "";

   paquetes
    .filter(function(paquete) {
        return paquete.activo !== false;
    })
    .forEach(function(paquete) {
        // crea la tarjeta.
        const tarjeta = document.createElement("article");
        tarjeta.className = "package-card reveal";
        const encabezado = document.createElement("div");
        encabezado.className = "package-head";
        const marca = document.createElement("p");
        marca.className = "text-[10px] font-bold uppercase tracking-widest text-vp-gold";
        marca.textContent = "Villa Peñas";
        const titulo = document.createElement("h3");
        titulo.textContent = paquete.nombre;
        const descripcion = document.createElement("p");
        descripcion.className = "mt-3 text-xs leading-5";
        descripcion.textContent = paquete.descripcion;
        const etiqueta = document.createElement("p");
        etiqueta.className = "mt-4 text-xs font-bold uppercase tracking-wider text-vp-brown";
        etiqueta.textContent = "Servicios incluidos:";
        const servicios = document.createElement("ul");

        paquete.servicios.forEach(function(servicio) {
            const elemento = document.createElement("li");
            elemento.textContent = servicio;
            servicios.appendChild(elemento);
        });

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "package-button";
        boton.textContent = "Ver detalles";
        boton.setAttribute("data-package-id", paquete.id);
        boton.addEventListener("click", function() {
            abrirModalPaquete(paquete);
        });

        // agrega los elementos a la tarjeta y la tarjeta al HTML.
        encabezado.appendChild(marca);
        encabezado.appendChild(titulo);
        tarjeta.appendChild(encabezado);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(etiqueta);
        tarjeta.appendChild(servicios);
        tarjeta.appendChild(boton);
        listaPaquetes.appendChild(tarjeta);
    });
}

function mostrarOpcionesPaquetes() {
    seleccionarPaquete.innerHTML = "";
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Seleccionar...";
    seleccionarPaquete.appendChild(opcionInicial);

  paquetes
    .filter(function(paquete) {
        return paquete.activo !== false;
    })
    .forEach(function(paquete) {
        const opcion = document.createElement("option");
        opcion.value = paquete.nombre;
        opcion.textContent = paquete.nombre;
        seleccionarPaquete.appendChild(opcion);
    });
}

/* limite de personas por paquete */

function actualizarLimitePersonas(restablecer = false) {

    const nombrePaquete = seleccionarPaquete.value;

    const esPaqueteLimitado =
        nombrePaquete === "Paquete Essentials" ||
        nombrePaquete === "Paquete Premium";

    if (!esPaqueteLimitado) {
        campoPersonas.removeAttribute("max");
        return;
    }

    // capacidad máxima incluyendo el adicional
    campoPersonas.max = "50";
    campoPersonas.min = "1";

    // al seleccionar un paquete, iniciar en 30 personas
    if (restablecer || !campoPersonas.value) {
        campoPersonas.value = "30";
    }
}

//sincronizar adicional de personas según la cantidad ingresada.
function sincronizarAdicionalPersonas() {

    const cantidad = Number(campoPersonas.value);

    const adicional = adicionales.find(a =>
        a.categoria === "Adicional por personas"
    );

    const paquete = adicional?.paquetes.find(p =>
        p.nombre === "Paquete #1"
    );

    if (!adicional || !paquete) {
        if (cantidad > 30) {
            campoPersonas.setCustomValidity(
                "El adicional de 20 personas no está disponible."
            );
            campoPersonas.reportValidity();
        }
        return;
    }

    const indice = adicionalesSeleccionados.findIndex(a =>
        a.adicionalId === adicional.id &&
        a.paqueteId === paquete.id
    );

    let cambio = false;

    if (cantidad > 30 && cantidad <= 50 && indice === -1) {

        // agregar automáticamente el adicional de ₡20.000
        adicionalesSeleccionados.push({
            adicionalId: adicional.id,
            paqueteId: paquete.id
        });

        cambio = true;

    } else if (cantidad <= 30 && indice !== -1) {

        // retirar el adicional si ya no es necesario
        adicionalesSeleccionados.splice(indice, 1);

        cambio = true;
    }

    if (cambio) {
        mostrarAdicionalesSeleccionados();
        actualizarBotonAdicional(adicional.id, paquete.id);
    }

    actualizarResumenCotizacion();
}
// cuando se ingresa la cantidad de personas, validar el máximo y mínimo permitido.
campoPersonas.addEventListener("input", function() {

    const cantidad = Number(campoPersonas.value);

    campoPersonas.setCustomValidity("");

    if (campoPersonas.value !== "" && cantidad > 50) {
        campoPersonas.setCustomValidity(
            "La cantidad máxima permitida es de 50 personas."
        );
        campoPersonas.reportValidity();
        return;
    }

    if (campoPersonas.value !== "" && cantidad < 1) {
        campoPersonas.setCustomValidity(
            "Ingresá al menos una persona."
        );
        return;
    }

    sincronizarAdicionalPersonas();
});

// al cambiar el paquete, actualizar la cantidad de personas.
seleccionarPaquete.addEventListener("change", function() {
    actualizarLimitePersonas(true);
});


function mostrarAdicionales(){
      contenedorAdicionales.innerHTML = "";

    adicionales.forEach(function(adicional) {
        const seccion = document.createElement("div");
        seccion.className = "mb-10";
        const titulo = document.createElement("h3");

        titulo.className =
            "text-2xl font-bold text-vp-text";
        titulo.textContent = adicional.categoria;
        const descripcion = document.createElement("p");

        descripcion.className =
            "mt-2 max-w-2xl text-sm text-vp-text/70";
        descripcion.textContent = adicional.descripcion;

        const contenedorPaquetesAdicional = document.createElement("div");

        contenedorPaquetesAdicional.className =
            "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

        adicional.paquetes.forEach(function(paquete) {
            const tarjeta = document.createElement("article");

            tarjeta.className =
                "rounded-2xl border border-vp-beige bg-vp-white p-5 shadow-sm";
            const nombre = document.createElement("h4");

            nombre.className =
                "text-lg font-bold text-vp-text";

            nombre.textContent = paquete.nombre;
            const cantidad = document.createElement("p");

            cantidad.className =
                "mt-2 text-sm text-vp-text/70";

            cantidad.textContent = paquete.cantidad;
            const detalle = document.createElement("p");

            detalle.className =
                "mt-1 text-sm text-vp-text/70";

            detalle.textContent = paquete.detalle;
            const precio = document.createElement("p");

            precio.className =
                "mt-4 text-lg font-bold text-vp-brown";

            precio.textContent =
                "₡" + paquete.precio.toLocaleString("es-CR");
            const boton = document.createElement("button");

            boton.type = "button";

            boton.className =
                "package-button mt-4 w-full";

            boton.textContent =
                "Solicitar este adicional";

            boton.setAttribute(
                "data-adicional-id",
                adicional.id
            );

            boton.setAttribute(
                "data-paquete-id",
                paquete.id
            );
        
            boton.addEventListener("click", function() {

                seleccionarAdicional(adicional, paquete);

            });
            tarjeta.appendChild(nombre);
            tarjeta.appendChild(cantidad);
            tarjeta.appendChild(detalle);
            tarjeta.appendChild(precio);
            tarjeta.appendChild(boton);
            contenedorPaquetesAdicional.appendChild(tarjeta);

        });


        // agregar todo el servicio
        seccion.appendChild(titulo);
        seccion.appendChild(descripcion);
        seccion.appendChild(contenedorPaquetesAdicional);

        contenedorAdicionales.appendChild(seccion);
    });
}

function mostrarOpcionesAdicionales() {

    mostrarAdicionalesSeleccionados();

}

function seleccionarAdicional(adicional, paquete) {

    const seleccionado = {
        adicionalId: adicional.id,
        paqueteId: paquete.id
    };


    const indice = adicionalesSeleccionados.findIndex(function(elemento) {

        return elemento.adicionalId === adicional.id &&
               elemento.paqueteId === paquete.id;

    });


    if (indice === -1) {

        adicionalesSeleccionados.push(seleccionado);

    } else {

        adicionalesSeleccionados.splice(indice, 1);
    }


    mostrarAdicionalesSeleccionados();

    actualizarBotonAdicional(
        adicional.id,
        paquete.id
    );
}

function mostrarAdicionalesSeleccionados() {

    opcionesAdicionales.innerHTML = "";

    actualizarResumenCotizacion();
    actualizarLimitePersonas();

    if (adicionalesSeleccionados.length === 0) {

        const texto = document.createElement("p");

        texto.className =
            "text-sm text-vp-text/60";

        texto.textContent =
            "No has seleccionado adicionales.";

        opcionesAdicionales.appendChild(texto);

        return;
    }


    adicionalesSeleccionados.forEach(function(seleccionado) {

        const adicional = adicionales.find(function(elemento) {

            return elemento.id === seleccionado.adicionalId;

        });


        if (!adicional) {
            return;
        }


        const paquete = adicional.paquetes.find(function(elemento) {

            return elemento.id === seleccionado.paqueteId;

        });


        if (!paquete) {
            return;
        }


        const elemento = document.createElement("div");

        elemento.className =
            "flex items-center justify-between rounded-lg border border-vp-beige bg-vp-white p-3 text-sm";


        const texto = document.createElement("span");

        texto.textContent =
            "✓ " +
            adicional.categoria +
            " · " +
            paquete.nombre;


        const boton = document.createElement("button");

        boton.type = "button";

        boton.textContent = "×";

        boton.className =
            "ml-3 font-bold text-vp-brown";


        boton.addEventListener("click", function() {

            quitarAdicional(
                adicional.id,
                paquete.id
            );

        });


        elemento.appendChild(texto);
        elemento.appendChild(boton);

        opcionesAdicionales.appendChild(elemento);
    });
}

function quitarAdicional(adicionalId, paqueteId) {

    const indice = adicionalesSeleccionados.findIndex(function(elemento) {

        return elemento.adicionalId === adicionalId &&
               elemento.paqueteId === paqueteId;

    });


    if (indice !== -1) {

        adicionalesSeleccionados.splice(indice, 1);
    }


    mostrarAdicionalesSeleccionados();

    actualizarBotonAdicional(
        adicionalId,
        paqueteId
    );
}

function actualizarBotonAdicional(adicionalId, paqueteId) {

    const boton = document.querySelector(
        '[data-adicional-id="' +
        adicionalId +
        '"][data-paquete-id="' +
        paqueteId +
        '"]'
    );


    if (boton) {

        const seleccionado =
            adicionalesSeleccionados.some(function(elemento) {

                return elemento.adicionalId === adicionalId &&
                       elemento.paqueteId === paqueteId;

            });


        if (seleccionado) {

            boton.textContent = "Agregado ✓";

        } else {

            boton.textContent = "Agregar al formulario";
        }
    }
}
// ver menú de celulares.
botonMenu.addEventListener("click", function() {
    const abierto = menu.classList.toggle("mobile-open");
    botonMenu.setAttribute("aria-expanded", String(abierto));
});

document.querySelectorAll(".menu-link").forEach(function(enlace) {
    enlace.addEventListener("click", function() {
        menu.classList.remove("mobile-open");
        botonMenu.setAttribute("aria-expanded", "false");
    });
});
// indicador animado del menú
const indicadorMenu = document.querySelector("#menuIndicator");
const enlacesMenu = document.querySelectorAll(".menu-link");

enlacesMenu.forEach(function(enlace) {
    enlace.addEventListener("mouseenter", function() {
        indicadorMenu.style.left = enlace.offsetLeft + "px";
        indicadorMenu.style.width = enlace.offsetWidth + "px";
        indicadorMenu.style.opacity = "1";
    });
});

menu.addEventListener("mouseleave", function() {
    indicadorMenu.style.opacity = "0";
});

// ventana con los detalles del paquete.
function abrirModalPaquete(paquete) {
     paqueteSeleccionado = paquete;

    tituloModal.textContent = paquete.nombre;

    precioModal.textContent = "Precio: ₡" + paquete.precio.toLocaleString("es-CR");

    descripcionModal.textContent = paquete.descripcion;

    serviciosModal.innerHTML = "";

    paquete.detalles.forEach(function(detalle) {

        const elemento = document.createElement("li");

        elemento.className = "rounded-lg bg-vp-cream p-3 text-sm";

        const nombre = document.createElement("strong");

        nombre.textContent = detalle.nombre;

        const descripcion = document.createElement("p");

        descripcion.className = "mt-1 text-sm leading-5";

        descripcion.textContent = detalle.descripcion;

        elemento.appendChild(nombre);

        elemento.appendChild(descripcion);

        serviciosModal.appendChild(elemento);
    });

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
}

function cerrarModalPaquete() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
}

botonCerrarModal.addEventListener("click", cerrarModalPaquete);
modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        cerrarModalPaquete();
    }
});

botonElegirPaquete.addEventListener("click", function() {
    if (paqueteSeleccionado === null) {
        return;
    }
    seleccionarPaquete.value = paqueteSeleccionado.nombre;
    limpiarErrorCampo(seleccionarPaquete);
    cerrarModalPaquete();
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
});

// Ampliar las imágenes de la galería.

/* ========================================
   GALERÍA DE FOTOGRAFÍAS - VILLA PEÑA
======================================== */

// Abrir fotografía ampliada
function abrirGaleria(boton) {
    const imagen = boton.querySelector("img");

    if (!imagen) return;

    imagenGaleria.src = boton.dataset.src || imagen.src;
    imagenGaleria.alt = imagen.alt;

    galeria.classList.remove("hidden");
    galeria.classList.add("flex");

    document.body.classList.add("overflow-hidden");
}

// Cerrar fotografía ampliada
function cerrarGaleria() {
    galeria.classList.add("hidden");
    galeria.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");

    imagenGaleria.removeAttribute("src");
}

// Un solo evento para todas las fotografías
document.querySelector("#galeria").addEventListener(
    "click",
    function(event) {
        const boton = event.target.closest(".gallery-item");

        if (boton) {
            abrirGaleria(boton);
        }
    }
);

// Cerrar con botón X
botonCerrarGaleria.addEventListener(
    "click",
    cerrarGaleria
);

// Cerrar al hacer clic fuera
galeria.addEventListener("click", function(event) {
    if (event.target === galeria) {
        cerrarGaleria();
    }
});

// Cerrar con tecla Escape
document.addEventListener("keydown", function(event) {
    if (
        event.key === "Escape" &&
        !galeria.classList.contains("hidden")
    ) {
        cerrarGaleria();
    }
});

// fotografias adicionales


/* ========================================
   CARRUSEL DE GALERÍA - VILLA PEÑA
======================================== */

const API_GALERIA = "http://localhost:3000";

const carouselGaleria = document.getElementById("carouselGaleria");
const carouselImagen = document.getElementById("carouselImagen");
const carouselDescripcion = document.getElementById("carouselDescripcion");
const carouselContador = document.getElementById("carouselContador");

const carouselAnterior = document.getElementById("carouselAnterior");
const carouselSiguiente = document.getElementById("carouselSiguiente");
const cerrarCarousel = document.getElementById("cerrarCarousel");

let fotosCarousel = [];
let indiceCarousel = 0;

// ========================================
// CONSULTAR FOTOGRAFÍAS DESDE NESTJS
// ========================================

async function obtenerFotosCarousel() {

    const respuesta = await fetch(`${API_GALERIA}/galeria`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las fotografías");
    }

    const fotos = await respuesta.json();

    if (!Array.isArray(fotos)) {
        throw new Error("Respuesta de galería inválida");
    }

    return fotos;
}

// ========================================
// MOSTRAR FOTOGRAFÍA ACTUAL
// ========================================

function mostrarFotoCarousel() {

    if (fotosCarousel.length === 0) return;

    const foto = fotosCarousel[indiceCarousel];

    carouselImagen.src = `${API_GALERIA}${foto.src}`;
    carouselImagen.alt = foto.descripcion;

    carouselDescripcion.textContent = foto.descripcion;

    carouselContador.textContent =
        `${indiceCarousel + 1} / ${fotosCarousel.length}`;
}

// ========================================
// CAMBIAR DE FOTOGRAFÍA
// ========================================

function cambiarFotoCarousel(direccion) {

    if (fotosCarousel.length === 0) return;

    indiceCarousel = (
        indiceCarousel + direccion + fotosCarousel.length
    ) % fotosCarousel.length;

    mostrarFotoCarousel();
}

// ========================================
// ABRIR CARRUSEL
// ========================================

botonVerMas.addEventListener("click", async function () {

    botonVerMas.disabled = true;

    try {

        // Consultar siempre para incluir fotos nuevas
        fotosCarousel = await obtenerFotosCarousel();

        if (fotosCarousel.length === 0) {
            alert("Todavía no hay fotografías disponibles.");
            return;
        }

        indiceCarousel = 0;

        mostrarFotoCarousel();

        carouselGaleria.showModal();

    } catch (error) {

        console.error("Error al abrir la galería:", error);

        alert("No se pudieron cargar las fotografías.");

    } finally {

        botonVerMas.disabled = false;
    }
});

// ========================================
// BOTONES DE NAVEGACIÓN
// ========================================

carouselAnterior.addEventListener("click", function () {
    cambiarFotoCarousel(-1);
});

carouselSiguiente.addEventListener("click", function () {
    cambiarFotoCarousel(1);
});

// ========================================
// CERRAR CARRUSEL
// ========================================

cerrarCarousel.addEventListener("click", function () {
    carouselGaleria.close();
});

// Cerrar al tocar fuera de la ventana
carouselGaleria.addEventListener("click", function (event) {

    if (event.target === carouselGaleria) {
        carouselGaleria.close();
    }
});

// Navegación con teclado
document.addEventListener("keydown", function (event) {

    if (!carouselGaleria.open) return;

    if (event.key === "ArrowRight") {
        cambiarFotoCarousel(1);
    }

    if (event.key === "ArrowLeft") {
        cambiarFotoCarousel(-1);
    }
});

// Liberar la imagen al cerrar
carouselGaleria.addEventListener("close", function () {
    carouselImagen.removeAttribute("src");
});

// fecha mínima usando el día local del navegador.

function fechaLocalHoy() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return anio + "-" + mes + "-" + dia;
}

function mostrarMensaje(texto, tipo) {
    mostrarAviso.className = "form-message form-message-" + tipo;
    mostrarAviso.textContent = texto;
}

function limpiarErrorCampo(campo) {
    campo.setCustomValidity("");
    campo.removeAttribute("aria-invalid");
    campo.removeAttribute("aria-describedby");
    mostrarAviso.classList.add("hidden");
}

campos.forEach(function(campo) {
    campo.addEventListener("input", function() {
        limpiarErrorCampo(campo);
    });
    campo.addEventListener("change", function() {
        limpiarErrorCampo(campo);
    });
});

function existePaquete(nombre) {
    let encontrado = false;

    paquetes.forEach(function(paquete) {
        if (
            paquete.nombre === nombre &&
            paquete.activo !== false
        ) {
            encontrado = true;
        }
    });

    return encontrado;
}

function validarCampo(campo) {
    campo.setCustomValidity("");
    const valor = campo.value.trim();

    if (campo.required && valor === "") {
        campo.setCustomValidity("Completá este campo obligatorio.");
    } else if (campo.id === "telefono" && valor !== "") {
          const telefonoLimpio = valor.replace(/[\s()-]/g, "");

    const telefonoValido =
        /^(?:\+506)?[2-8]\d{7}$/.test(telefonoLimpio);

    if (!telefonoValido) {
        campo.setCustomValidity(
            "Ingresá un teléfono válido de Costa Rica de 8 dígitos."
        );
        }
    } else if (campo.id === "correo" && valor !== "") {
        const correoValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);

    if (!correoValido) {
        campo.setCustomValidity(
            "Ingresá un correo válido, por ejemplo: cliente@gmail.com."
        );
        }
    } else if (campo.id === "fecha" && valor !== "") {
        const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(valor);
        if (formatoValido === false || valor < fechaLocalHoy()) {
            campo.setCustomValidity("Elegí la fecha de hoy o una fecha futura.");
        }
    } else if (campo.id === "personas" && valor !== "") {
    const cantidad = Number(valor);
    const maximo = Number(campo.max);

    if (!Number.isSafeInteger(cantidad) || cantidad < 1) {
        campo.setCustomValidity(
            "Ingresá una cantidad entera de personas mayor que cero."
        );
    } else if (
        campo.max !== "" &&
        cantidad > maximo
    ) {
        campo.setCustomValidity(
            `Este paquete permite un máximo de ${maximo} personas.`
        );
    }
    } else if (campo.id === "paquete" && valor !== "") {
        if (existePaquete(valor) === false) {
            campo.setCustomValidity("Seleccioná un paquete disponible.");
        }
    }

    const valido = campo.validity.valid;
    campo.setAttribute("aria-invalid", String(!valido));
    if (valido === false) {
        campo.setAttribute("aria-describedby", "formMessage");
    } else {
        campo.removeAttribute("aria-describedby");
    }
    return valido;
}

function validarFormulario() {
    let primerError = null;
    campos.forEach(function(campo) {
        if (validarCampo(campo) === false && primerError === null) {
            primerError = campo;
        }
    });

    if (primerError !== null) {
        const etiqueta = formulario.querySelector('label[for="' + primerError.id + '"]');
        const nombreCampo = etiqueta.textContent.replace("*", "").trim();
        mostrarMensaje(nombreCampo + ": " + primerError.validationMessage, "error");
        primerError.focus({ preventScroll: true });
        primerError.scrollIntoView({ block: "center", behavior: "auto" });
        return false;
    }
    return true;
}

function obtenerAdicionalesSeleccionados() {

    const seleccionados = [];


    adicionalesSeleccionados.forEach(function(seleccionado) {

        const adicional = adicionales.find(function(elemento) {

            return elemento.id === seleccionado.adicionalId;

        });


        if (!adicional) {
            return;
        }


        const paquete = adicional.paquetes.find(function(elemento) {

            return elemento.id === seleccionado.paqueteId;

        });


        if (!paquete) {
            return;
        }


        seleccionados.push({

            categoria: adicional.categoria,

            paquete: paquete.nombre,

            cantidad: paquete.cantidad,

            detalle: paquete.detalle,

            precio: paquete.precio

        });

    });


    return seleccionados;
    
}

seleccionarPaquete.addEventListener(
    "change",
    actualizarResumenCotizacion
);
/* resumen de cotización */

function actualizarResumenCotizacion() {

    const nombrePaquete = document.querySelector("#nombrePaqueteResumen");
    const precioPaquete = document.querySelector("#precioPaqueteResumen");
    const listaAdicionales = document.querySelector("#adicionalesResumen");
    const totalCotizacion = document.querySelector("#totalCotizacionResumen");

    // Buscar el paquete principal seleccionado
    const paquete = paquetes.find(function(p) {
        return p.nombre === seleccionarPaquete.value &&
               p.activo !== false;
    });

    const precioPrincipal = Number(paquete?.precio || 0);

    nombrePaquete.textContent = paquete?.nombre || "Seleccioná un paquete";
    precioPaquete.textContent = "₡" + precioPrincipal.toLocaleString("es-CR");

    // Obtener los adicionales seleccionados
    const seleccionados = obtenerAdicionalesSeleccionados();

    listaAdicionales.innerHTML = "";

    let totalAdicionales = 0;

    if (seleccionados.length === 0) {
        listaAdicionales.textContent = "No has seleccionado adicionales.";
    } else {

        seleccionados.forEach(function(adicional) {

            const precio = Number(adicional.precio || 0);
            totalAdicionales += precio;

            const fila = document.createElement("div");
            fila.className = "flex justify-between gap-4 py-2";

            const nombre = document.createElement("span");
            nombre.textContent =
                adicional.categoria + " — " + adicional.paquete;

            const monto = document.createElement("strong");
            monto.textContent = "₡" + precio.toLocaleString("es-CR");

            fila.appendChild(nombre);
            fila.appendChild(monto);

            listaAdicionales.appendChild(fila);
        });
    }

    // Calcular total estimado
    const total = precioPrincipal + totalAdicionales;

    totalCotizacion.textContent =
        "₡" + total.toLocaleString("es-CR");
}

// crear el mensaje de solicitud para WhatsApp.

function crearMensajeSolicitud(solicitud) {

    const fecha = new Date(
        solicitud.date + "T12:00:00"
    ).toLocaleDateString("es-CR");

    const formatoPrecio = precio =>
        "₡" + Number(precio || 0).toLocaleString("es-CR");

    const adicionales = solicitud.adicionales || [];

    const totalAdicionales = adicionales.reduce(
        (total, adicional) =>
            total + Number(adicional.precio || 0),
        0
    );

    const total =
        Number(solicitud.packagePrice || 0) +
        totalAdicionales;

    let texto = "Hola, Villa Peñas.\n\n";
    texto += "Me gustaría solicitar una cotización para un evento.\n\n";

    texto += "*DATOS DEL CLIENTE*\n";
    texto += "Nombre: " + solicitud.client + "\n";
    texto += "Teléfono: " + solicitud.phone + "\n";
    texto += "Correo: " + solicitud.email + "\n\n";

    texto += "*DATOS DEL EVENTO*\n";
    texto += "Fecha: " + fecha + "\n";
    texto += "Hora de entrada: " + solicitud.time + "\n";
    texto += "Cantidad de personas: " + solicitud.guests + "\n\n";

    texto += "*PAQUETE PRINCIPAL*\n";
    texto += solicitud.package + "\n";
    texto += "Precio: " +
        formatoPrecio(solicitud.packagePrice) + "\n\n";

    texto += "*PAQUETES ADICIONALES*\n";

    if (adicionales.length === 0) {
        texto += "Ninguno seleccionado.\n";
    } else {
        adicionales.forEach(adicional => {
            texto +=
                "- " + adicional.categoria +
                " / " + adicional.paquete + "\n";

            texto +=
                "  " + adicional.cantidad + "\n";

            texto +=
                "  Precio: " +
                formatoPrecio(adicional.precio) + "\n";
        });
    }

    texto += "\n*TOTAL ESTIMADO*\n";
    texto += formatoPrecio(total) + "\n\n";

    texto += "*OBSERVACIONES*\n";
    texto += solicitud.message ||
        "Sin observaciones adicionales.";

    texto += "\n\nQuedo atento a la disponibilidad y confirmación del precio final.";

    return texto;
}

// mantener la animación al desplazarse, con contenido visible como respaldo.
function prepararAnimaciones() {
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducirMovimiento || !("IntersectionObserver" in window)) {
        return;
    }

    const observador = new IntersectionObserver(function(elementos) {
        elementos.forEach(function(elemento) {
            if (elemento.isIntersecting) {
                elemento.target.classList.add("visible");
                elemento.target.classList.remove("reveal-pending");
                observador.unobserve(elemento.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(function(elemento) {
        elemento.classList.add("reveal-pending");
        observador.observe(elemento);
    });
}

// Cargar paquetes y adicionales desde el backend.
async function cargarDatosBackend() {
    try {
        const respuestaPaquetes =
            await fetch("http://localhost:3000/paquetes");

        const respuestaAdicionales =
            await fetch("http://localhost:3000/adicionales");

        if (!respuestaPaquetes.ok || !respuestaAdicionales.ok) {
            throw new Error("No se pudieron obtener los datos.");
        }

        const datosPaquetes = await respuestaPaquetes.json();
        const datosAdicionales = await respuestaAdicionales.json();

        if (
            !Array.isArray(datosPaquetes) ||
            !Array.isArray(datosAdicionales)
        ) {
            throw new Error("Formato de datos incorrecto.");
        }

        // Reemplazar los datos locales por los del backend.
        paquetes = datosPaquetes;
        adicionales = datosAdicionales;

        console.log("Datos cargados desde el backend.");

    } catch (error) {
        console.warn(
            "No se pudo conectar con el backend. Se usarán los datos locales.",
            error
        );
    }

    // Mostrar los datos en la página.
    mostrarPaquetes();
    mostrarOpcionesPaquetes();
    mostrarAdicionales();
    mostrarOpcionesAdicionales();
    actualizarResumenCotizacion();

    // Configuración adicional de la página.
    campoFecha.min = fechaLocalHoy();
    prepararAnimaciones();
}

cargarDatosBackend();


//hora inicio hora fin
horaInicio.addEventListener("change", function(){
    const [horas, minutos] = horaInicio.value
        .split(":")
        .map(Number);
    let final = horas + 8;
    if(final>=24){
        final = final-24;
    }
    horaFinal.value =
    String(final).padStart(2,"0") + ":" + String(minutos).padStart(2,"0");
});
