
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

// Comprobar que existan los elementos del formulario
if (!loginForm || !loginMessage) {
    console.error("No se encontró el formulario o el mensaje de inicio de sesión.");
} else {

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        loginMessage.textContent = "Verificando acceso...";

        // Iniciar sesión en Supabase
        const { data, error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            loginMessage.textContent = "Correo o contraseña incorrectos.";
            console.error("Error de inicio de sesión:", error);
            return;
        }

        // Comprobar que sea administrador
        const { data: admin, error: adminError } = await db
            .from("admin_users")
            .select("user_id")
            .eq("user_id", data.user.id)
            .maybeSingle();

        if (adminError || !admin) {
            await db.auth.signOut();

            loginMessage.textContent = "No tienes permisos de administrador.";
            console.error("Error verificando administrador:", adminError);
            return;
        }

        // Acceso autorizado
        loginMessage.textContent = "¡Acceso autorizado!";

        console.log("Administrador autenticado correctamente");

        // Redirigir después de un segundo
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    });
}
