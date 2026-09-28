
  // =========================================================
  // 1. MENÚ RESPONSIVE
  // =========================================================
  const menuButton = document.querySelector("#menuButton");
  const menu = document.querySelector("#menu");
  const enlacesMenu = document.querySelectorAll("#menu a");

  menuButton.addEventListener("click", function () {
    menu.classList.toggle("hidden");

    const abierto = !menu.classList.contains("hidden");
    menuButton.setAttribute("aria-expanded", abierto);
  });

  enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      if (window.innerWidth < 1024) {
        menu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  });

  // =========================================================
  // 2. PAQUETES: ARREGLO DE OBJETOS + DOM
  // =========================================================
  const listaPaquetes = document.querySelector("#paquetesContainer");
  const selectPaquete = document.querySelector("#paquete");

  paquetes.forEach(function (paquete) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "rounded-2xl bg-vp-white p-6 text-vp-text shadow-xl";

    const etiqueta = document.createElement("p");
    etiqueta.className = "text-xs font-bold uppercase tracking-widest text-vp-gold";
    etiqueta.textContent = "Villa Peñas";

    const titulo = document.createElement("h3");
    titulo.className = "mt-2 font-display text-3xl text-vp-brown";
    titulo.textContent = paquete.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "mt-3 text-sm leading-6 text-vp-text/80";
    descripcion.textContent = paquete.descripcion;

    const subtitulo = document.createElement("p");
    subtitulo.className = "mt-5 text-xs font-bold uppercase tracking-wider text-vp-brown";
    subtitulo.textContent = "Servicios incluidos:";

    const listaServicios = document.createElement("ul");
    listaServicios.className = "mt-3 space-y-2 text-sm";

    paquete.servicios.forEach(function (servicio) {
      const item = document.createElement("li");
      item.className = "flex gap-2";

      const check = document.createElement("span");
      check.className = "font-bold text-vp-gold";
      check.textContent = "✓";

      const texto = document.createElement("span");
      texto.textContent = servicio;

      item.appendChild(check);
      item.appendChild(texto);
      listaServicios.appendChild(item);
    });

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "mt-6 w-full rounded-xl bg-vp-brown px-5 py-3 font-bold text-white transition hover:bg-vp-gold";
    boton.textContent = "Ver detalles";

    boton.addEventListener("click", function () {
      abrirModal(paquete);
    });

    tarjeta.appendChild(etiqueta);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(subtitulo);
    tarjeta.appendChild(listaServicios);
    tarjeta.appendChild(boton);

    listaPaquetes.appendChild(tarjeta);

    const opcion = document.createElement("option");
    opcion.value = paquete.nombre;
    opcion.textContent = paquete.nombre;
    selectPaquete.appendChild(opcion);
  });

  // Mostrar el arreglo como JSON en consola, como se practica en clase.
  const datosJSON = JSON.stringify(paquetes, null, 2);
  console.log("Paquetes en JSON:");
  console.log(datosJSON);

  // =========================================================
  // 3. ADICIONALES: ARREGLO + DOM
  // =========================================================
  const listaAdicionales = document.querySelector("#adicionalesContainer");
  const listaChecks = document.querySelector("#checksAdicionales");

  adicionales.forEach(function (adicional) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "rounded-2xl border border-vp-beige bg-vp-white p-5 shadow-sm";

    const categoria = document.createElement("p");
    categoria.className = "text-xs font-bold uppercase tracking-wider text-vp-gold";
    categoria.textContent = adicional.categoria;

    const nombre = document.createElement("h3");
    nombre.className = "mt-1 font-display text-2xl text-vp-brown";
    nombre.textContent = adicional.paquete;

    const cantidad = document.createElement("p");
    cantidad.className = "mt-4 text-sm font-bold";
    cantidad.textContent = adicional.cantidad;

    const detalle = document.createElement("p");
    detalle.className = "mt-1 text-sm text-vp-text/70";
    detalle.textContent = adicional.detalle;

    const precio = document.createElement("p");
    precio.className = "mt-5 text-xl font-bold text-vp-brown";
    precio.textContent = "₡" + adicional.precio.toLocaleString("es-CR");

    tarjeta.appendChild(categoria);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(cantidad);
    tarjeta.appendChild(detalle);
    tarjeta.appendChild(precio);

    listaAdicionales.appendChild(tarjeta);
  });

  // Crear una opción por cada categoría sin usar métodos nuevos para ustedes.
  const categorias = [];

  adicionales.forEach(function (adicional) {
    let existe = false;

    categorias.forEach(function (categoria) {
      if (categoria === adicional.categoria) {
        existe = true;
      }
    });

    if (!existe) {
      categorias.push(adicional.categoria);
    }
  });

  categorias.forEach(function (categoria) {
    const label = document.createElement("label");
    label.className = "flex cursor-pointer items-center gap-2 rounded-lg border border-vp-beige bg-vp-white p-3 text-sm";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "adicional";
    checkbox.value = categoria;
    checkbox.className = "h-4 w-4 accent-[#321D0E]";

    const texto = document.createElement("span");
    texto.textContent = categoria;

    label.appendChild(checkbox);
    label.appendChild(texto);
    listaChecks.appendChild(label);
  });

  // =========================================================
  // 4. MODAL DE PAQUETES
  // =========================================================
  const modal = document.querySelector("#modal");
  const cerrarModal = document.querySelector("#closeModal");
  const tituloModal = document.querySelector("#modalTitle");
  const precioModal = document.querySelector("#modalPrice");
  const descripcionModal = document.querySelector("#modalDescription");
  const serviciosModal = document.querySelector("#modalServices");
  const elegirPaquete = document.querySelector("#choosePackage");

  let paqueteSeleccionado = null;

  function abrirModal(paquete) {
    paqueteSeleccionado = paquete;

    tituloModal.textContent = paquete.nombre;
    precioModal.textContent = "Precio: consultar";
    descripcionModal.textContent = paquete.descripcion;
    serviciosModal.innerHTML = "";

    paquete.servicios.forEach(function (servicio) {
      const item = document.createElement("li");
      item.className = "rounded-lg bg-vp-cream p-3 text-sm";
      item.textContent = "✓ " + servicio;
      serviciosModal.appendChild(item);
    });

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  cerrarModal.addEventListener("click", function () {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");
    }
  });

  elegirPaquete.addEventListener("click", function () {
    if (paqueteSeleccionado) {
      selectPaquete.value = paqueteSeleccionado.nombre;
    }

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");

    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  });

  // =========================================================
  // 5. GALERÍA / LIGHTBOX
  // =========================================================
  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = document.querySelector("#lightboxImg");
  const cerrarLightbox = document.querySelector("#closeLightbox");
  const imagenesGaleria = document.querySelectorAll("#galeria button");

  imagenesGaleria.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const imagen = boton.querySelector("img");
      lightboxImg.src = imagen.src;
      lightboxImg.alt = imagen.alt;
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      document.body.classList.add("overflow-hidden");
    });
  });

  cerrarLightbox.addEventListener("click", function () {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");
    }
  });

  // =========================================================
  // 6. FORMULARIO: CAPTURA DE DATOS + VALIDACIÓN + WHATSAPP
  // =========================================================
  const formulario = document.querySelector("#solicitudForm");
  const mensajeFormulario = document.querySelector("#formMessage");
  const WHATSAPP_NUMBER = "506XXXXXXXX";

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.querySelector("#nombre").value.trim();
    const telefono = document.querySelector("#telefono").value.trim();
    const correo = document.querySelector("#correo").value.trim();
    const fecha = document.querySelector("#fecha").value;
    const personas = document.querySelector("#personas").value;
    const paquete = document.querySelector("#paquete").value;
    const mensaje = document.querySelector("#mensaje").value.trim();

    const adicionalesSeleccionados = [];
    const checks = document.querySelectorAll('input[name="adicional"]:checked');

    checks.forEach(function (check) {
      adicionalesSeleccionados.push(check.value);
    });

    if (!nombre || !telefono || !correo || !fecha || !personas || !paquete) {
      mostrarMensaje("Por favor completá todos los campos obligatorios (*).", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      mostrarMensaje("Ingresá un correo electrónico válido.", "error");
      return;
    }

    const solicitud = {
      nombre: nombre,
      telefono: telefono,
      correo: correo,
      fecha: fecha,
      personas: personas,
      paquete: paquete,
      adicionales: adicionalesSeleccionados,
      mensaje: mensaje
    };

    console.log("Solicitud creada:");
    console.log(solicitud);
    console.log("Solicitud en JSON:");
    console.log(JSON.stringify(solicitud, null, 2));

    let texto = "Hola, Villa Peñas.\n\n";
    texto += "Me gustaría solicitar información sobre un evento.\n\n";
    texto += "Datos del cliente\n";
    texto += "Nombre: " + solicitud.nombre + "\n";
    texto += "Teléfono: " + solicitud.telefono + "\n";
    texto += "Correo: " + solicitud.correo + "\n\n";
    texto += "Datos del evento\n";
    texto += "Fecha: " + solicitud.fecha + "\n";
    texto += "Cantidad de personas: " + solicitud.personas + "\n";
    texto += "Paquete: " + solicitud.paquete + "\n\n";
    texto += "Adicionales\n";
    texto += adicionalesSeleccionados.length > 0 ? adicionalesSeleccionados.join(", ") + "\n\n" : "Ninguno seleccionado\n\n";
    texto += "Mensaje\n" + (solicitud.mensaje || "Sin mensaje adicional.");

    if (WHATSAPP_NUMBER.indexOf("X") !== -1) {
      mostrarMensaje("La solicitud fue capturada. Falta configurar el número oficial de WhatsApp en js/app.js.", "aviso");
      formulario.reset();
      return;
    }

    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
    mostrarMensaje("Solicitud preparada. Abriendo WhatsApp...", "exito");
    window.open(url, "_blank");
    formulario.reset();
  });

  function mostrarMensaje(texto, tipo) {
    mensajeFormulario.classList.remove("hidden", "bg-red-50", "text-red-700", "bg-amber-50", "text-amber-800", "bg-green-50", "text-vp-green");

    if (tipo === "error") {
      mensajeFormulario.classList.add("bg-red-50", "text-red-700");
    } else if (tipo === "aviso") {
      mensajeFormulario.classList.add("bg-amber-50", "text-amber-800");
    } else {
      mensajeFormulario.classList.add("bg-green-50", "text-vp-green");
    }

    mensajeFormulario.textContent = texto;
  }

  // Fecha mínima usando la fecha local, no UTC.
  function obtenerFechaLocal() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return anio + "-" + mes + "-" + dia;
  }

  document.querySelector("#fecha").min = obtenerFechaLocal();

  // =========================================================
  // 7. ENTRADA SUAVE DE ELEMENTOS AL CARGAR
  // =========================================================
  const elementosAnimados = document.querySelectorAll(".opacity-0.translate-y-4");

  elementosAnimados.forEach(function (elemento, indice) {
    setTimeout(function () {
      elemento.classList.remove("opacity-0", "translate-y-4");
      elemento.classList.add("opacity-100", "translate-y-0");
    }, 1000 + (indice * 70));
  });

});