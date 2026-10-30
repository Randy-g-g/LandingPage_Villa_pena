
// Campos del formulario
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// Dirección del backend
const API_URL = "http://localhost:3000";

// Mostrar u ocultar contraseña
togglePassword.addEventListener("click", () => {
    const mostrar = passwordInput.type === "password";

    passwordInput.type = mostrar ? "text" : "password";
    togglePassword.textContent = mostrar ? "Ocultar" : "Mostrar";

    togglePassword.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );
});

// Iniciar sesión
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "Verificando credenciales...";

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent =
                data.message || "Usuario o contraseña incorrectos.";
            return;
        }

        loginMessage.textContent = "¡Inicio de sesión exitoso!";

        window.location.href = "villa_pena_admin/index.html";

        // Entrar al panel administrativo
        window.location.href = "villa_pena_admin/index.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        loginMessage.textContent =
            "No se pudo conectar con el servidor. Inténtalo nuevamente.";
    }
});

