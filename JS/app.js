// Mismo estilo del ejercicio DOM_Poo_js visto en clase.
// Los arreglos paquetes y adicionales están en datos.js.
// La transición inicial se controla únicamente desde styles.css.

// Buscamos los elementos del HTML.
const formulario = document.querySelector("#solicitudForm");
const listaPaquetes = document.querySelector("#paquetesContainer");
const contenedorAdicionales = document.querySelector("#adicionalesContainer");
const opcionesAdicionales = document.querySelector("#checksAdicionales");
const seleccionarPaquete = document.querySelector("#paquete");
const mostrarAviso = document.querySelector("#formMessage");
const campos = formulario.querySelectorAll(".form-input");
const campoNombre = document.querySelector("#nombre");
const campoTelefono = document.querySelector("#telefono");
const campoCorreo = document.querySelector("#correo");
const campoFecha = document.querySelector("#fecha");
const campoPersonas = document.querySelector("#personas");
const campoMensaje = document.querySelector("#mensaje");
const botonMenu = document.querySelector("#menuButton");
const menu = document.querySelector("#menu");
const modal = document.querySelector("#modal");
const tituloModal = document.querySelector("#modalTitle");
const precioModal = document.querySelector("#modalPrice");
const descripcionModal = document.querySelector("#modalDescription");
const serviciosModal = document.querySelector("#modalServices");
const botonCerrarModal = document.querySelector("#closeModal");
const botonElegirPaquete = document.querySelector("#choosePackage");
const galeria = document.querySelector("#lightbox");
const imagenGaleria = document.querySelector("#lightboxImg");
const botonCerrarGaleria = document.querySelector("#closeLightbox");
const galeriaExtra = document.querySelector("#galeriaExtra");
const botonVerMas = document.querySelector("#verMasGaleria");

let paqueteSeleccionado = null;
let adicionalesSeleccionados = [];
// Se conserva pendiente hasta confirmar el WhatsApp oficial.
// Los teléfonos existentes son 8537-3750 y 8850-7712.
const WHATSAPP_NUMBER = "50685048785";

// Escuchamos el formulario, igual que en el ejercicio de productos.
formulario.addEventListener("submit", function(event) {
    // Evitar que el formulario recargue la página.
    event.preventDefault();
    campoFecha.min = fechaLocalHoy();
    campoNombre.value = campoNombre.value.trim();
    campoTelefono.value = campoTelefono.value.trim();
    campoCorreo.value = campoCorreo.value.trim();

    if (validarFormulario() === false) {
        return;
    }

    // Tomamos los valores y hacemos la conversión numérica.
    const nombre = campoNombre.value;
    const telefono = campoTelefono.value;
    const correo = campoCorreo.value;
    const fecha = campoFecha.value;
    const personas = Number(campoPersonas.value);
    const paquete = seleccionarPaquete.value;
    const mensaje = campoMensaje.value.trim();
    const seleccionados = obtenerAdicionalesSeleccionados();

    // Creamos un objeto, como el objeto producto del ejemplo de clase.
    const solicitud = {
        nombre: nombre,
        telefono: telefono,
        correo: correo,
        fecha: fecha,
        horaInicio: horaInicio.value,
        horaFinal: horaFinal.value,
        personas: personas,
        paquete: paquete,
        adicionales: seleccionados,
        mensaje: mensaje
    };

    abrirWhatsApp(solicitud);
});

// Mostramos los paquetes que están en el arreglo de datos.js.
function mostrarPaquetes() {
    listaPaquetes.innerHTML = "";

    paquetes.forEach(function(paquete) {
        // Crear tarjeta.
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

        // Agregar los elementos a la tarjeta y la tarjeta al HTML.
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

    paquetes.forEach(function(paquete) {
        const opcion = document.createElement("option");
        opcion.value = paquete.nombre;
        opcion.textContent = paquete.nombre;
        seleccionarPaquete.appendChild(opcion);
    });
}

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


        // Agregar todo el servicio
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
// Menú de celulares.
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
// Indicador animado del menú
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

// Ventana con los detalles del paquete.
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
document.querySelectorAll(".gallery-item").forEach(function(boton) {
    boton.addEventListener("click", function() {
        imagenGaleria.src = boton.getAttribute("data-src");
        imagenGaleria.alt = boton.querySelector("img").alt;
        galeria.classList.remove("hidden");
        galeria.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    });
});

function cerrarGaleria() {
    galeria.classList.add("hidden");
    galeria.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
}

botonCerrarGaleria.addEventListener("click", cerrarGaleria);
galeria.addEventListener("click", function(event) {
    if (event.target === galeria) {
        cerrarGaleria();
    }
});

//Ver mas de la galaeria

const fotosGaleria = [
    {src:"assets/Reglas.JPG", descripcion: "Relas, Villa Peña"},
    {src:"assets/Senal.JPG", descripcion: "Cartel exterior, Villa Peña"},
    {src:"assets/CartelArriba.JPG", descripcion: "Cartel en la puerta, Villa Peña"},
    {src:"assets/DesdeArriba.JPG", descripcion: "Vista desde arriba, Villa Peña"},
    {src:"assets/SillasExteriores.JPG", descripcion: "Sillas exteriores, Villa Peña"},
    {src:"assets/BrincaBrinca.JPG", descripcion: "Brinca brincas, Villa Peña"},
    {src:"assets/PlayGround(1).JPG", descripcion: "Area de juegos, Villa Peña"},
    {src:"assets/Tobogan.JPG", descripcion: "Tobogan, Villa Peña"},
    {src:"assets/Tobogan(1).JPG", descripcion: "Tobogan, Villa Peña"},
    {src:"assets/Llantas.JPG", descripcion: "Parte del Playground, Villa Peña"},
    {src:"assets/CartelArriba.JPG", descripcion: "Cartel y parrila, Villa Peña"},
    {src:"assets/Parrilla(1).JPG", descripcion: "Parrilla, Villa Peña"},
    {src:"assets/Rancho(3).JPG", descripcion: "Rancho intro mesas, Villa Peña"},
    {src:"assets/MesasInteriores.JPG", descripcion: "Mesas interiores, Villa Peña"},
    {src:"assets/MesasInteriores(1).JPG", descripcion: "Mesas interiores, Villa Peña"},
    {src:"assets/MesasInteriores(2).JPG", descripcion: "Mesas interiores, Villa Peña"},
    {src:"assets/Corazon.JPG", descripcion: "Mesas interiores, Villa Peña"},
    {src:"assets/SillasAltas.JPG", descripcion: "Sillas altas, Villa Peña"},
    {src:"assets/Entretenimiento.JPG", descripcion: "Entretenimiento, Villa Peña"},
    {src:"assets/Entretenimiento(1).JPG", descripcion: "Entretenimiento, Villa Peña"},
    {src:"assets/Piscina(1).JPG", descripcion: "Area piscina, Villa Peña"},
    {src:"assets/Piscina(2).JPG", descripcion: "Area piscina, Villa Peña"},
    {src:"assets/Piscina(3).JPG", descripcion: "Area piscina, Villa Peña"},
    {src:"assets/Fuente.JPG", descripcion: "Fuente, Villa Peña"},
    {src:"assets/PiscinayRancho.JPG", descripcion: "Area exterior, Villa Peña"},
    {src:"assets/Piscina(4).JPG", descripcion: "Area piscina, Villa Peña"},
    {src:"assets/Amaca.JPG", descripcion: "Amaca, Villa Peña"},
    {src:"assets/Panoramica.JPG", descripcion: "Vista panoramica, Villa Peña"},
];

function prepararImagenGaleria(boton){
    boton.addEventListener("click", function(){
        imagenGaleria.src = getAttribute("data-src");
        imagenGaleria.alt = boton.querySelector("img").alt;
        galeria.classList.remove("hidden");
        galeria.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    });
}

document.querySelectorAll(".gallery-item").forEach(function(boton){
    prepararImagenGaleria(boton);
});

function mostrarFotosGaleria(){
    fotosGaleria.forEach(function(foto){
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "gallery-item";
        boton.setAttribute("data-src", foto.src);
        boton.setAttribute("arial-label", "Abrir imagen:" + foto.descripcion);

        const imagen = document.createElement("img");
        imagen.src = foto.src;
        imagen.alt = foto.descripcion;
        imagen.leading = "lazy";

        boton.appendChild(imagen);
        prepararImagenGaleria(boton);
        galeriaExtra.appendChild(boton);
    });
}

botonVerMas.hidden = false;
botonVerMas.addEventListener("click", function() {
    // evita duplicar
    if (galeriaExtra.childElementCount === 0) {
        mostrarFotosGaleria();
    }

    galeriaExtra.hidden = !galeriaExtra.hidden;
    botonVerMas.textContent = galeriaExtra.hidden ? "Ver más" : "Ver menos";
    botonVerMas.setAttribute("aria-expanded", String(!galeriaExtra.hidden));
});

function cerrarGaleria() {
    galeria.classList.add("hidden");
    galeria.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
}

botonCerrarGaleria.addEventListener("click", cerrarGaleria);
galeria.addEventListener("click", function(event) {
    if (event.target === galeria) {
        cerrarGaleria();
    }
});
// Fecha mínima usando el día local del navegador.
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
        if (paquete.nombre === nombre) {
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
        // Contar dígitos sin espacios, paréntesis ni guiones.
        const digitos = valor.replace(/\D/g, "");
        const formatoValido = /^\+?[\d\s()-]+$/.test(valor);
        if (formatoValido === false || digitos.length < 8 || digitos.length > 15) {
            campo.setCustomValidity("Ingresá un teléfono válido de 8 a 15 dígitos.");
        }
    } else if (campo.id === "correo" && valor !== "") {
        const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        if (formatoValido === false) {
            campo.setCustomValidity("Ingresá un correo electrónico válido.");
        }
    } else if (campo.id === "fecha" && valor !== "") {
        const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(valor);
        if (formatoValido === false || valor < fechaLocalHoy()) {
            campo.setCustomValidity("Elegí la fecha de hoy o una fecha futura.");
        }
    } else if (campo.id === "personas" && valor !== "") {
        const cantidad = Number(valor);
        if (Number.isSafeInteger(cantidad) === false || cantidad < 1) {
            campo.setCustomValidity("Ingresá una cantidad entera de personas mayor que cero.");
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

function crearMensajeSolicitud(solicitud) {
    const fechaBonita = new Date(solicitud.fecha + "T12:00:00").toLocaleDateString("es-CR");
    let texto = "Hola, Villa Peñas.\n\n";
    texto += "Me gustaría solicitar información sobre un evento.\n\n";
    texto += "*Datos del cliente*\n";
    texto += "Nombre: " + solicitud.nombre + "\n";
    texto += "Teléfono: " + solicitud.telefono + "\n";
    texto += "Correo: " + solicitud.correo + "\n\n";
    texto += "*Datos del evento*\n";
    texto += "Fecha: " + fechaBonita + "\n";
    texto += "Hora de Inicio: " + solicitud.horaInicio + "\n";
    texto += "Hora Final: " + solicitud.horaFinal + "\n";
    texto += "Cantidad de personas: " + solicitud.personas + "\n";
    texto += "Paquete: " + solicitud.paquete + "\n\n";
    texto += "*Adicionales*\n";

   if (solicitud.adicionales.length === 0) {

    texto += "Ninguno seleccionado\n";

} else {

    solicitud.adicionales.forEach(function(adicional) {

        texto +=
            "• " +
            adicional.categoria +
            " - " +
            adicional.paquete +
            " - ₡" +
            adicional.precio.toLocaleString("es-CR") +
            "\n";

    });
}
    texto += "\n*Mensaje*\n";
    if (solicitud.mensaje === "") {
        texto += "Sin mensaje adicional.\n\n";
    } else {
        texto += solicitud.mensaje + "\n\n";
    }
    texto += "Quedo atento/a a la información y disponibilidad.";
    return texto;
}

function abrirWhatsApp(solicitud) {
    const texto = crearMensajeSolicitud(solicitud);
    if (/^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER) === false) {
        mostrarMensaje(
            "La solicitud está preparada, pero el envío por WhatsApp aún no está disponible. Podés comunicarte mediante los teléfonos de la sección Contactanos.",
            "warning"
        );
        return;
    }

    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
    mostrarMensaje("Solicitud preparada. Confirmá el envío en WhatsApp.", "success");

    // Mostrar un enlace por si el navegador bloquea la nueva pestaña.
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.className = "whatsapp-fallback";
    enlace.textContent = "Abrir WhatsApp";
    mostrarAviso.appendChild(document.createTextNode(" "));
    mostrarAviso.appendChild(enlace);
    window.open(url, "_blank", "noopener,noreferrer");
}

// Mantener la animación al desplazarse, con contenido visible como respaldo.
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

// Cargar los datos en el HTML al abrir la página.
mostrarPaquetes();
mostrarOpcionesPaquetes();
mostrarAdicionales();
mostrarOpcionesAdicionales();
campoFecha.min = fechaLocalHoy();
prepararAnimaciones();

//hora de formulario
const horaInicio = document.querySelector("#horaInicio");
const horaFinal = document.querySelector("#horaFinal");

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
