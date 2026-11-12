
// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const formulario = document.getElementById("formulario-acceso");
const campoCorreo = document.getElementById("correo");
const campoContrasena = document.getElementById("contrasena");
const botonIngresar = document.getElementById("boton-ingresar");
const mensaje = document.getElementById("mensaje-acceso");

// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function mostrarMensaje(texto, tipo = "error") {
    mensaje.textContent = texto;

    mensaje.style.color =
        tipo === "exito" ? "#b9d99a" : "#e5bd75";
}

// ==========================================
// INICIAR SESIÓN
// ==========================================

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const correo = campoCorreo.value.trim();
    const contrasena = campoContrasena.value;

    // 1. VALIDAR CAMPOS

    if (!correo || !contrasena) {
        mostrarMensaje("Completa todos los campos.");
        return;
    }

    // 2. BLOQUEAR BOTÓN MIENTRAS SE VERIFICA

    botonIngresar.disabled = true;
    botonIngresar.textContent = "Verificando...";

    mostrarMensaje("");

    try {

        // 3. VALIDAR CREDENCIALES EN SUPABASE

        const { data, error } = await db.auth.signInWithPassword({
            email: correo,
            password: contrasena
        });

        if (error) {
            throw new Error(
                "El correo o la contraseña son incorrectos."
            );
        }

        // 4. BUSCAR AL GRADUADO ASOCIADO A LA CUENTA

        const { data: persona, error: errorPersona } = await db
            .from("personas")
            .select("id, nombre, numero, activo, user_id")
            .eq("user_id", data.user.id)
            .maybeSingle();

        if (errorPersona) {
            throw new Error(
                "No fue posible verificar tu registro."
            );
        }

        if (!persona) {
            await db.auth.signOut();

            throw new Error(
                "Tu cuenta todavía no está asociada a un graduado."
            );
        }

        // 5. COMPROBAR SI LA CUENTA ESTÁ ACTIVA

        if (!persona.activo) {
            await db.auth.signOut();

            throw new Error(
                "Tu acceso todavía no está habilitado."
            );
        }

        // 6. ACCESO AUTORIZADO

        mostrarMensaje(
            `¡Bienvenido/a, ${persona.nombre}!`,
            "exito"
        );

        // 7. REDIRIGIR A LA CARTA

        setTimeout(() => {
            window.location.href = "carta.html";
        }, 1000);

    } catch (error) {

        console.error("Error de acceso:", error);

        mostrarMensaje(
            error.message || "Ocurrió un error al ingresar."
        );

        // CERRAR SESIÓN SI QUEDÓ ABIERTA

        await db.auth.signOut();

    } finally {

        botonIngresar.disabled = false;

        botonIngresar.innerHTML =
            'Ingresar a mi sorpresa <span>→</span>';

    }

});
