
const API_RESENAS = "http://localhost:3000/resenas";

async function cargarResenas() {
  const contenedor = document.querySelector("#resenasContainer");

  try {
    const respuesta = await fetch(API_RESENAS);

    if (!respuesta.ok) {
      throw new Error("Error al consultar las reseñas.");
    }

    const resenas = await respuesta.json();

    contenedor.replaceChildren();

    if (!Array.isArray(resenas) || resenas.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.className = "col-span-full text-sm";
      mensaje.textContent =
        "Todavía no hay reseñas publicadas. ¡Sé la primera persona en compartir tu experiencia!";
      contenedor.appendChild(mensaje);
      return;
    }

    resenas.forEach(function (resena) {
      const tarjeta = document.createElement("article");
      tarjeta.className = "testimonial-card reveal";

      const estrellas = document.createElement("div");
      estrellas.className = "stars";
      estrellas.textContent =
        "★".repeat(Math.max(0, Math.min(5, Number(resena.calificacion) || 0))) +
        "☆".repeat(5 - Math.max(0, Math.min(5, Number(resena.calificacion) || 0)));

      const comentario = document.createElement("p");
      comentario.className = "mt-3 text-sm leading-6";
      comentario.textContent = `“${resena.comentario}”`;

      const pie = document.createElement("div");
      pie.className = "mt-5 flex items-center gap-3";

      const avatar = document.createElement("span");
      avatar.className = "avatar";
      avatar.textContent =
        (resena.usuario || "V").trim().charAt(0).toUpperCase();

      const datosUsuario = document.createElement("div");

      const nombre = document.createElement("strong");
      nombre.textContent = resena.usuario;

      const descripcion = document.createElement("small");
      descripcion.textContent = "Visitante de Villa Peñas";

      datosUsuario.append(nombre, descripcion);
      pie.append(avatar, datosUsuario);
      tarjeta.append(estrellas, comentario, pie);
      contenedor.appendChild(tarjeta);
    });

  } catch (error) {
    console.error(error);

    contenedor.replaceChildren();

    const mensaje = document.createElement("p");
    mensaje.className = "col-span-full text-sm";
    mensaje.textContent =
      "No se pudieron cargar las reseñas. Intenta nuevamente más tarde.";

    contenedor.appendChild(mensaje);
  }
}

cargarResenas();
