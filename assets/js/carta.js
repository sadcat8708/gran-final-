
// ==========================================
// ELEMENTOS DE LA PÁGINA
// ==========================================

const nombreGraduado = document.getElementById("nombre-graduado");
const tituloCarta = document.getElementById("titulo-carta");
const contenidoCarta = document.getElementById("contenido-carta");
const despedidaCarta = document.getElementById("despedida-carta");
const mensajeCarta = document.getElementById("mensaje-carta");
const botonCerrarSesion = document.getElementById("cerrar-sesion");
const botonCambiarTema = document.getElementById("cambiar-tema");
const cartaPersonal = document.querySelector(".carta-personal");

// ==========================================
// TEMA GENERAL DE LA PÁGINA
// ==========================================

function aplicarTemaGeneral() {
    const temaGuardado = localStorage.getItem("tema-general");
    const tema = temaGuardado === "azul" ? "azul" : "dorado";

    document.documentElement.dataset.temaGeneral = tema;

    actualizarBotonTema(tema);
}

function actualizarBotonTema(tema) {
    if (!botonCambiarTema) return;

    botonCambiarTema.textContent =
        tema === "azul" ? "◐ Tema dorado" : "◐ Tema azul";
}

if (botonCambiarTema) {
    botonCambiarTema.addEventListener("click", () => {
        const temaActual =
            document.documentElement.dataset.temaGeneral || "dorado";

        const nuevoTema =
            temaActual === "dorado" ? "azul" : "dorado";

        localStorage.setItem("tema-general", nuevoTema);

        document.documentElement.dataset.temaGeneral = nuevoTema;

        actualizarBotonTema(nuevoTema);
    });
}

// ==========================================
// TEMA PERSONALIZADO DE LA CARTA
// ==========================================

function aplicarTema(tema) {
    const temasPermitidos = [
        "dorado",
        "azul",
        "rosa",
        "verde",
        "morado",
        "rojo"
    ];

    const temaElegido = temasPermitidos.includes(tema)
        ? tema
        : "dorado";

    if (cartaPersonal) {
        cartaPersonal.dataset.temaCarta = temaElegido;
    }
}

// ==========================================
// CARGAR LA INFORMACIÓN DEL GRADUADO
// Y SU CARTA
// ==========================================

async function cargarCarta() {
    try {
        mensajeCarta.textContent = "Preparando tu recuerdo...";

        // Aplicar el tema general
        aplicarTemaGeneral();

        // Tema predeterminado de la carta
        aplicarTema("dorado");

        // 1. COMPROBAR LA SESIÓN

        const { data: sesionData, error: errorSesion } =
            await db.auth.getSession();

        if (errorSesion) {
            throw errorSesion;
        }

        const usuario = sesionData.session?.user;

        if (!usuario) {
            window.location.replace("acceso.html");
            return;
        }

        // 2. BUSCAR AL GRADUADO

        const { data: persona, error: errorPersona } = await db
            .from("personas")
            .select("id, nombre, activo")
            .eq("user_id", usuario.id)
            .maybeSingle();

        if (errorPersona) {
            throw errorPersona;
        }

        if (!persona || !persona.activo) {
            await db.auth.signOut();
            window.location.replace("acceso.html");
            return;
        }

        // 3. MOSTRAR SU NOMBRE

        nombreGraduado.textContent = persona.nombre;

        // 4. BUSCAR SU CARTA PUBLICADA

        const { data: carta, error: errorCarta } = await db
            .from("cartas")
            .select("titulo, contenido, despedida, tema")
            .eq("persona_id", persona.id)
            .eq("publicada", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (errorCarta) {
            throw errorCarta;
        }

        // 5. COMPROBAR SI TIENE UNA CARTA

        if (!carta) {
            tituloCarta.textContent = "Tu carta está en camino";

            contenidoCarta.textContent =
                "Todavía no hay una carta publicada para ti. " +
                "Muy pronto podrás descubrir tu mensaje especial.";

            despedidaCarta.textContent = "";
            mensajeCarta.textContent = "";

            return;
        }

        // 6. MOSTRAR LA CARTA

        tituloCarta.textContent =
            carta.titulo || "Un recuerdo especial";

        contenidoCarta.textContent = carta.contenido || "";

        despedidaCarta.textContent = carta.despedida || "";

        // 7. APLICAR EL TEMA PERSONALIZADO

        aplicarTema(carta.tema);

        mensajeCarta.textContent = "";

    } catch (error) {
        console.error("Error al cargar la carta:", error);

        mensajeCarta.textContent =
            "No pudimos cargar tu carta. Intenta nuevamente más tarde.";
    }
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", async () => {
        botonCerrarSesion.disabled = true;
        botonCerrarSesion.textContent = "Cerrando sesión...";

        const { error } = await db.auth.signOut();

        if (error) {
            console.error("Error al cerrar sesión:", error);

            mensajeCarta.textContent = "No se pudo cerrar la sesión.";

            botonCerrarSesion.disabled = false;
            botonCerrarSesion.textContent = "Cerrar sesión";

            return;
        }

        window.location.replace("acceso.html");
    });
}

// ==========================================
// INICIAR
// ==========================================

cargarCarta();
