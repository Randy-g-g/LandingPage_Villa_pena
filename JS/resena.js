
const API_URL = "http://localhost:3000/resenas";

const formulario = document.querySelector("#resenaForm");
const mensaje = document.querySelector("#resenaMensaje");
const botonEnviar = document.querySelector("#btnEnviarResena");

formulario.addEventListener("submit", async function (event) {
  event.preventDefault();

  const datos = {
    usuario: document.querySelector("#usuario").value.trim(),
    comentario: document.querySelector("#comentario").value.trim(),
    calificacion: Number(
      document.querySelector("#calificacion").value
    )
  };

  if (!datos.usuario || !datos.comentario) {
    mostrarMensaje("Completa todos los campos.", false);
    return;
  }

  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo registrar la reseña.");
    }

    mostrarMensaje(
      "¡Gracias por compartir tu experiencia! Tu reseña fue enviada y está pendiente de aprobación.",
      true
    );

    formulario.reset();

  } catch (error) {
    console.error(error);

    mostrarMensaje(
      "No se pudo enviar la reseña. Verifica que el backend esté funcionando.",
      false
    );
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar reseña";
  }
});

function mostrarMensaje(texto, exito) {
  mensaje.textContent = texto;
  mensaje.classList.remove("hidden");

  if (exito) {
    mensaje.className =
      "rounded-lg p-4 text-sm bg-green-100 text-green-800";
  } else {
    mensaje.className =
      "rounded-lg p-4 text-sm bg-red-100 text-red-800";
  }
}
