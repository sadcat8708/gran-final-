
// ==========================================
// PANEL DE ADMINISTRACIÓN - PROM 2026
// ==========================================

// ELEMENTOS HTML
const totalGraduados = document.getElementById("total-graduados");
const totalCartas = document.getElementById("total-cartas");
const listaGraduados = document.getElementById("lista-graduados");
const listaCartas = document.getElementById("lista-cartas");
const logoutBtn = document.getElementById("logout-btn");

const formularioGraduado = document.getElementById("form-graduado");
const mensajeGraduado = document.getElementById("mensaje-graduado");
const botonGuardar = document.getElementById("guardar-graduado");
const buscadorGraduado = document.getElementById("buscar-graduado");

let graduadosRegistrados = [];
let cartasRegistradas = [];

// ==========================================
// TEMAS DISPONIBLES
// ==========================================

const temasValidos = [
    "dorado",
    "azul",
    "rosa",
    "verde",
    "morado",
    "rojo"
];

const opcionesTemas = `
    <option value="dorado">Dorado</option>
    <option value="azul">Azul</option>
    <option value="rosa">Rosa</option>
    <option value="verde">Verde</option>
    <option value="morado">Morado</option>
    <option value="rojo">Rojo</option>
`;

// ==========================================
// ESCAPAR TEXTO HTML
// ==========================================

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
        return "Fecha no disponible";
    }

    return fechaConvertida.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// ==========================================
// VERIFICAR ADMINISTRADOR
// ==========================================

async function verificarAdministrador() {
    if (typeof db === "undefined") {
        console.error("No se encontró Supabase.");
        window.location.href = "index.html";
        return false;
    }

    const { data: { session }, error } = await db.auth.getSession();

    if (error || !session) {
        console.error("Error de sesión:", error);
        window.location.href = "index.html";
        return false;
    }

    const { data: admin, error: adminError } = await db
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (adminError || !admin) {
        console.error("Error verificando administrador:", adminError);

        await db.auth.signOut();

        window.location.href = "index.html";
        return false;
    }

    return true;
}

// ==========================================
// UTILIDAD: VERIFICAR CARTA GUARDADA
// ==========================================

async function verificarCartaGuardada(personaId, datosEsperados) {
    const { data, error } = await db
        .from("cartas")
        .select("id, persona_id, titulo, contenido, despedida, tema, publicada")
        .eq("persona_id", personaId)
        .maybeSingle();

    if (error) {
        console.error("Error verificando carta:", error);
        throw error;
    }

    if (!data) {
        return false;
    }

    const coincide =
        String(data.persona_id) === String(personaId) &&
        data.titulo === datosEsperados.titulo &&
        data.contenido === datosEsperados.contenido &&
        (data.despedida ?? null) === datosEsperados.despedida &&
        data.tema === datosEsperados.tema &&
        Boolean(data.publicada) === datosEsperados.publicada;

    return coincide;
}

// ==========================================
// FORMULARIO PARA CREAR O ACTUALIZAR CARTAS
// ==========================================

const contenedorCrearCarta = document.createElement("div");

contenedorCrearCarta.className = "formulario-nueva-carta";

contenedorCrearCarta.innerHTML = `
    <div class="form-section-heading">
        <span class="form-icon">✉</span>

        <div>
            <h3>Crear o actualizar carta</h3>
            <p>Selecciona un graduado para crear su carta o modificar la existente.</p>
        </div>
    </div>

    <form id="form-nueva-carta">

        <div class="campo-nueva-carta">
            <label for="nuevo-graduado">Seleccionar graduado</label>

            <select id="nuevo-graduado" required>
                <option value="">Selecciona un graduado...</option>
            </select>
        </div>

        <div class="campo-nueva-carta">
            <label for="nuevo-titulo">Título de la carta</label>

            <input
                type="text"
                id="nuevo-titulo"
                maxlength="255"
                placeholder="Ej. Un recuerdo para toda la vida"
                required
            >
        </div>

        <div class="campo-nueva-carta">
            <label for="nuevo-contenido">Contenido de la carta</label>

            <textarea
                id="nuevo-contenido"
                rows="9"
                placeholder="Escribe aquí el mensaje especial..."
                required
            ></textarea>
        </div>

        <div class="campo-nueva-carta">
            <label for="nuevo-despedida">Despedida</label>

            <textarea
                id="nuevo-despedida"
                rows="3"
                placeholder="Con cariño, PROM 2026..."
            ></textarea>
        </div>

        <div class="campo-nueva-carta">
            <label for="nuevo-tema">Tema de la carta</label>

            <select id="nuevo-tema">
                ${opcionesTemas}
            </select>
        </div>

        <div class="campo-nueva-carta">
            <label for="nuevo-estado-carta">Estado de la carta</label>

            <select id="nuevo-estado-carta">
                <option value="false">Guardar como borrador</option>
                <option value="true">Publicar inmediatamente</option>
            </select>
        </div>

        <button type="submit" id="crear-carta">
            <span>＋</span>
            Crear carta
        </button>

        <p id="mensaje-nueva-carta" role="status"></p>

    </form>
`;

listaCartas.parentElement.insertBefore(
    contenedorCrearCarta,
    listaCartas
);

const formularioNuevaCarta = document.getElementById("form-nueva-carta");
const selectorGraduado = document.getElementById("nuevo-graduado");
const botonCrearCarta = document.getElementById("crear-carta");
const mensajeNuevaCarta = document.getElementById("mensaje-nueva-carta");

// ==========================================
// ACTUALIZAR SELECTOR DE GRADUADOS
// ==========================================

function actualizarSelectorGraduados() {
    const seleccionActual = selectorGraduado.value;

    selectorGraduado.innerHTML = `
        <option value="">Selecciona un graduado...</option>

        ${graduadosRegistrados.map(persona => `
            <option value="${escaparHTML(persona.id)}">
                ${escaparHTML(persona.numero)} - ${escaparHTML(persona.nombre)}
                (${escaparHTML(persona.curso || "PROM 2026")})
                ${persona.activo ? "" : "(Inactivo)"}
            </option>
        `).join("")}
    `;

    if (
        seleccionActual &&
        graduadosRegistrados.some(
            persona => String(persona.id) === String(seleccionActual)
        )
    ) {
        selectorGraduado.value = seleccionActual;
    }
}

// ==========================================
// CARGAR CARTA AL SELECCIONAR GRADUADO
// ==========================================

selectorGraduado.addEventListener("change", () => {
    const personaId = selectorGraduado.value;

    const cartaExistente = cartasRegistradas.find(
        carta => String(carta.persona_id) === String(personaId)
    );

    if (cartaExistente) {

        document.getElementById("nuevo-titulo").value =
            cartaExistente.titulo || "";

        document.getElementById("nuevo-contenido").value =
            cartaExistente.contenido || "";

        document.getElementById("nuevo-despedida").value =
            cartaExistente.despedida || "";

        document.getElementById("nuevo-tema").value =
            cartaExistente.tema || "dorado";

        document.getElementById("nuevo-estado-carta").value =
            String(Boolean(cartaExistente.publicada));

        botonCrearCarta.innerHTML = "<span>✎</span> Actualizar carta";

        mensajeNuevaCarta.textContent =
            "Este graduado ya tiene una carta. Puedes modificarla.";

        mensajeNuevaCarta.className = "mensaje-informativo";

    } else {

        formularioNuevaCarta.reset();

        selectorGraduado.value = personaId;

        document.getElementById("nuevo-tema").value = "dorado";

        botonCrearCarta.innerHTML = "<span>＋</span> Crear carta";

        mensajeNuevaCarta.textContent = personaId
            ? "Este graduado todavía no tiene una carta."
            : "";

        mensajeNuevaCarta.className = "mensaje-informativo";
    }
});

// ==========================================
// CREAR O ACTUALIZAR CARTA
// ==========================================

formularioNuevaCarta.addEventListener("submit", async event => {
    event.preventDefault();

    const personaId = selectorGraduado.value;

    const titulo = document.getElementById("nuevo-titulo").value.trim();

    const contenido = document.getElementById("nuevo-contenido").value.trim();

    const despedida = document.getElementById("nuevo-despedida").value.trim();

    const tema = document.getElementById("nuevo-tema").value;

    const publicada =
        document.getElementById("nuevo-estado-carta").value === "true";

    if (!personaId || !titulo || !contenido) {
        mensajeNuevaCarta.textContent =
            "Selecciona un graduado y completa el título y el contenido.";
        return;
    }

    if (!temasValidos.includes(tema)) {
        mensajeNuevaCarta.textContent = "Selecciona un tema válido.";
        return;
    }

    const persona = graduadosRegistrados.find(
        elemento => String(elemento.id) === String(personaId)
    );

    if (!persona) {
        mensajeNuevaCarta.textContent =
            "No se encontró el graduado seleccionado.";
        return;
    }

    if (!persona.activo && publicada) {
        mensajeNuevaCarta.textContent =
            "No puedes publicar una carta para un graduado inactivo. Activa su cuenta primero.";
        return;
    }

    const cartaExistente = cartasRegistradas.find(
        carta => String(carta.persona_id) === String(personaId)
    );

    const datosCarta = {
        titulo,
        contenido,
        despedida: despedida || null,
        tema,
        publicada
    };

    botonCrearCarta.disabled = true;
    botonCrearCarta.textContent = "Guardando...";

    mensajeNuevaCarta.textContent = "Guardando carta...";

    try {
        let resultado;

        if (cartaExistente) {

            resultado = await db
                .from("cartas")
                .update({
                    ...datosCarta,
                    updated_at: new Date().toISOString()
                })
                .eq("id", cartaExistente.id);

        } else {

            resultado = await db
                .from("cartas")
                .insert({
                    persona_id: personaId,
                    ...datosCarta
                });
        }

        if (resultado.error) {
            throw resultado.error;
        }

        // Comprobar que el registro realmente quedó guardado.
        const guardado = await verificarCartaGuardada(
            personaId,
            datosCarta
        );

        if (!guardado) {
            throw new Error(
                "La operación terminó, pero no se pudo confirmar la carta al consultarla. Revisa los permisos SELECT."
            );
        }

        await cargarCartas();

        formularioNuevaCarta.reset();

        document.getElementById("nuevo-tema").value = "dorado";

        botonCrearCarta.innerHTML = "<span>＋</span> Crear carta";

        mensajeNuevaCarta.textContent = cartaExistente
            ? "¡Carta actualizada correctamente!"
            : "¡Carta creada correctamente!";

        mensajeNuevaCarta.className = "mensaje-exito";

    } catch (error) {

        console.error("Error al guardar carta:", error);

        mensajeNuevaCarta.textContent =
            `No se pudo guardar la carta: ${error.message || "Error desconocido"}`;

        mensajeNuevaCarta.className = "mensaje-error";

    } finally {

        botonCrearCarta.disabled = false;

        if (botonCrearCarta.textContent === "Guardando...") {
            botonCrearCarta.innerHTML = "<span>＋</span> Crear carta";
        }
    }
});

// ==========================================
// MOSTRAR GRADUADOS
// ==========================================

function mostrarGraduados(graduados) {
    if (!graduados || graduados.length === 0) {
        listaGraduados.innerHTML = `
            <div class="mensaje-vacio">
                <span>♙</span>
                <p>No se encontraron graduados.</p>
            </div>
        `;
        return;
    }

    listaGraduados.innerHTML = `
        <div class="tabla-contenedor">
            <table class="tabla-datos">

                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Curso</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${graduados.map(persona => `
                        <tr>
                            <td>${escaparHTML(persona.numero ?? "-")}</td>

                            <td>
                                <strong class="nombre-tabla">
                                    ${escaparHTML(persona.nombre || "Sin nombre")}
                                </strong>
                            </td>

                            <td>${escaparHTML(persona.email || "Sin correo")}</td>

                            <td>${escaparHTML(persona.curso || "PROM 2026")}</td>

                            <td>
                                <span class="estado-persona ${persona.activo ? "activo" : "inactivo"}">
                                    ${persona.activo ? "Activo" : "Inactivo"}
                                </span>
                            </td>

                            <td>
                                <div class="acciones-tabla">

                                    <button
                                        type="button"
                                        class="btn-editar"
                                        data-id="${escaparHTML(persona.id)}"
                                    >
                                        ✎ Editar
                                    </button>

                                    <button
                                        type="button"
                                        class="btn-eliminar"
                                        data-id="${escaparHTML(persona.id)}"
                                    >
                                        × Eliminar
                                    </button>

                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>

            </table>
        </div>
    `;
}

// ==========================================
// CARGAR GRADUADOS
// ==========================================

async function cargarGraduados() {
    listaGraduados.textContent = "Cargando graduados...";

    const { data, count, error } = await db
        .from("personas")
        .select(
            "id, user_id, nombre, activo, created_at, numero, email, curso",
            { count: "exact" }
        )
        .order("numero", { ascending: true });

    if (error) {
        console.error("Error al cargar graduados:", error);
        listaGraduados.textContent = "Error al cargar los graduados.";
        return;
    }

    graduadosRegistrados = data || [];

    totalGraduados.textContent = count ?? 0;

    actualizarSelectorGraduados();

    filtrarGraduados();
}

// ==========================================
// BUSCAR GRADUADOS
// ==========================================

function filtrarGraduados() {
    const busqueda = buscadorGraduado.value.trim().toLowerCase();

    const resultados = graduadosRegistrados.filter(persona => {
        return (
            String(persona.nombre || "").toLowerCase().includes(busqueda) ||
            String(persona.numero ?? "").toLowerCase().includes(busqueda) ||
            String(persona.email || "").toLowerCase().includes(busqueda) ||
            String(persona.curso || "").toLowerCase().includes(busqueda)
        );
    });

    mostrarGraduados(resultados);
}

buscadorGraduado.addEventListener("input", filtrarGraduados);

// ==========================================
// VENTANA DE EDICIÓN DE GRADUADOS
// ==========================================

function crearVentanaEdicion() {
    const dialogo = document.createElement("dialog");

    dialogo.id = "modal-editar-graduado";
    dialogo.className = "modal-administracion";

    dialogo.innerHTML = `
        <form id="form-editar-graduado">

            <div class="modal-encabezado">
                <span class="modal-icono">✎</span>

                <div>
                    <span class="eyebrow">GESTIÓN DE PERSONAS</span>
                    <h2>Editar graduado</h2>
                </div>
            </div>

            <label for="editar-numero">Número</label>
            <input type="number" id="editar-numero" min="1" required>

            <label for="editar-nombre">Nombre completo</label>
            <input type="text" id="editar-nombre" maxlength="150" required>

            <label for="editar-correo">Correo electrónico</label>
            <input type="email" id="editar-correo" maxlength="255">

            <label for="editar-curso">Curso</label>

            <select id="editar-curso" required>
                <option value="PROM 2026">PROM 2026</option>
                <option value="C Y M">C Y M</option>
            </select>

            <label for="editar-activo">Estado</label>

            <select id="editar-activo">
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
            </select>

            <p id="mensaje-edicion" role="status"></p>

            <div class="acciones-edicion">

                <button type="submit" id="guardar-edicion" class="btn-modal-principal">
                    Guardar cambios
                </button>

                <button type="button" id="cancelar-edicion" class="btn-modal-secundario">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document.body.appendChild(dialogo);

    return dialogo;
}

const modalEdicion = crearVentanaEdicion();

// ==========================================
// EDITAR GRADUADO
// ==========================================

listaGraduados.addEventListener("click", event => {
    const boton = event.target.closest(".btn-editar");

    if (!boton) return;

    const persona = graduadosRegistrados.find(
        elemento => String(elemento.id) === boton.dataset.id
    );

    if (!persona) return;

    document.getElementById("editar-numero").value = persona.numero ?? "";
    document.getElementById("editar-nombre").value = persona.nombre ?? "";
    document.getElementById("editar-correo").value = persona.email ?? "";
    document.getElementById("editar-curso").value = persona.curso || "PROM 2026";
    document.getElementById("editar-activo").value = String(Boolean(persona.activo));

    document.getElementById("mensaje-edicion").textContent = "";

    modalEdicion.dataset.id = persona.id;

    modalEdicion.showModal();
});

// ==========================================
// GUARDAR EDICIÓN DE GRADUADO
// ==========================================

document.getElementById("form-editar-graduado").addEventListener("submit", async event => {
    event.preventDefault();

    const id = modalEdicion.dataset.id;

    const numero = Number(document.getElementById("editar-numero").value);
    const nombre = document.getElementById("editar-nombre").value.trim();
    const correo = document.getElementById("editar-correo").value.trim();
    const curso = document.getElementById("editar-curso").value;
    const activo = document.getElementById("editar-activo").value === "true";

    const mensaje = document.getElementById("mensaje-edicion");
    const boton = document.getElementById("guardar-edicion");

    if (!Number.isInteger(numero) || numero < 1 || !nombre) {
        mensaje.textContent = "Revisa el número y el nombre.";
        return;
    }

    boton.disabled = true;
    boton.textContent = "Guardando...";

    try {
        const { error } = await db
            .from("personas")
            .update({
                numero,
                nombre,
                email: correo || null,
                curso,
                activo
            })
            .eq("id", id);

        if (error) throw error;

        modalEdicion.close();

        await cargarGraduados();

    } catch (error) {
        console.error("Error al editar graduado:", error);
        mensaje.textContent = `No se pudieron guardar los cambios: ${error.message || "Error desconocido"}`;

    } finally {
        boton.disabled = false;
        boton.textContent = "Guardar cambios";
    }
});

document.getElementById("cancelar-edicion").addEventListener("click", () => {
    modalEdicion.close();
});

// ==========================================
// ELIMINAR GRADUADO
// ==========================================

listaGraduados.addEventListener("click", async event => {
    const boton = event.target.closest(".btn-eliminar");

    if (!boton) return;

    const id = boton.dataset.id;

    const persona = graduadosRegistrados.find(
        elemento => String(elemento.id) === String(id)
    );

    if (!persona) return;

    const confirmar = confirm(
        `¿Eliminar a ${persona.nombre}?\n\nTambién se eliminarán sus cartas relacionadas.`
    );

    if (!confirmar) return;

    boton.disabled = true;
    boton.textContent = "Eliminando...";

    try {
        const { error } = await db
            .from("personas")
            .delete()
            .eq("id", id);

        if (error) throw error;

        alert("Solicitud de eliminación completada.");

        await Promise.all([
            cargarGraduados(),
            cargarCartas()
        ]);

    } catch (error) {
        console.error("Error al eliminar graduado:", error);
        alert(`No se pudo eliminar el graduado: ${error.message || "Error desconocido"}`);

        boton.disabled = false;
        boton.textContent = "× Eliminar";
    }
});

// ==========================================
// BUSCADOR DE CARTAS
// ==========================================

const contenedorBuscadorCartas = document.createElement("div");

contenedorBuscadorCartas.className = "buscador-cartas";

contenedorBuscadorCartas.innerHTML = `
    <span>⌕</span>

    <input
        type="search"
        id="buscar-carta"
        placeholder="Buscar por nombre, número, título o contenido..."
        aria-label="Buscar cartas"
    >
`;

listaCartas.parentElement.insertBefore(
    contenedorBuscadorCartas,
    listaCartas
);

const buscadorCartas = document.getElementById("buscar-carta");

// ==========================================
// VENTANA DE EDICIÓN DE CARTAS
// ==========================================

function crearVentanaCarta() {
    const dialogo = document.createElement("dialog");

    dialogo.id = "modal-editar-carta";
    dialogo.className = "modal-administracion modal-carta";

    dialogo.innerHTML = `
        <form id="form-editar-carta">

            <div class="modal-encabezado">
                <span class="modal-icono">✉</span>

                <div>
                    <span class="eyebrow">RECUERDOS DE GENERACIÓN</span>
                    <h2>Editar carta</h2>
                </div>
            </div>

            <label for="carta-titulo">Título</label>
            <input type="text" id="carta-titulo" maxlength="255" required>

            <label for="carta-contenido">Contenido</label>
            <textarea id="carta-contenido" rows="8" required></textarea>

            <label for="carta-despedida">Despedida</label>
            <textarea id="carta-despedida" rows="3"></textarea>

            <label for="carta-tema">Tema de la carta</label>

            <select id="carta-tema">
                ${opcionesTemas}
            </select>

            <label for="carta-publicada">Estado de publicación</label>

            <select id="carta-publicada">
                <option value="false">Borrador</option>
                <option value="true">Publicada</option>
            </select>

            <p id="mensaje-edicion-carta" role="status"></p>

            <div class="acciones-edicion">

                <button type="submit" id="guardar-carta" class="btn-modal-principal">
                    Guardar cambios
                </button>

                <button type="button" id="cancelar-carta" class="btn-modal-secundario">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document.body.appendChild(dialogo);

    return dialogo;
}

const modalCarta = crearVentanaCarta();

// ==========================================
// MOSTRAR CARTAS
// ==========================================

function mostrarCartas(cartas) {
    if (!cartas || cartas.length === 0) {
        listaCartas.innerHTML = `
            <div class="mensaje-vacio">
                <span>✉</span>
                <p>No se encontraron cartas con esa búsqueda.</p>
            </div>
        `;
        return;
    }

    listaCartas.innerHTML = `
        <div class="tabla-contenedor">
            <table class="tabla-datos tabla-cartas">

                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Graduado</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Contenido</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${cartas.map(carta => {
                        const persona = Array.isArray(carta.personas)
                            ? carta.personas[0]
                            : carta.personas;

                        return `
                            <tr>
                                <td>
                                    <strong class="nombre-tabla">
                                        ${escaparHTML(carta.titulo || "Sin título")}
                                    </strong>
                                </td>

                                <td>
                                    ${escaparHTML(persona?.nombre || "No disponible")}

                                    <br>

                                    <small>
                                        N.º ${escaparHTML(persona?.numero ?? "-")}
                                    </small>
                                </td>

                                <td>
                                    <span class="estado-carta ${carta.publicada ? "publicada" : "no-publicada"}">
                                        ${carta.publicada ? "Publicada" : "Borrador"}
                                    </span>
                                </td>

                                <td>
                                    ${escaparHTML(formatearFecha(carta.created_at))}
                                </td>

                                <td>
                                    <details class="detalle-carta">

                                        <summary>Leer carta</summary>

                                        <div class="contenido-carta">

                                            <h4>
                                                ${escaparHTML(carta.titulo || "Sin título")}
                                            </h4>

                                            <p>
                                                ${escaparHTML(carta.contenido || "Sin contenido")}
                                            </p>

                                            ${carta.despedida ? `
                                                <p class="despedida-carta">
                                                    ${escaparHTML(carta.despedida)}
                                                </p>
                                            ` : ""}

                                        </div>

                                    </details>
                                </td>

                                <td>
                                    <div class="acciones-tabla">

                                        <button
                                            type="button"
                                            class="btn-editar-carta"
                                            data-id="${escaparHTML(carta.id)}"
                                        >
                                            ✎ Editar
                                        </button>

                                        <button
                                            type="button"
                                            class="btn-eliminar-carta"
                                            data-id="${escaparHTML(carta.id)}"
                                        >
                                            × Eliminar
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>

            </table>
        </div>
    `;
}

// ==========================================
// BUSCAR CARTAS
// ==========================================

function filtrarCartas() {
    const busqueda = buscadorCartas.value.trim().toLowerCase();

    const resultados = cartasRegistradas.filter(carta => {
        const persona = Array.isArray(carta.personas)
            ? carta.personas[0]
            : carta.personas;

        const campos = [
            carta.titulo,
            carta.contenido,
            carta.despedida,
            persona?.nombre,
            persona?.numero,
            carta.publicada ? "publicada" : "borrador",
            carta.tema
        ];

        return campos.some(campo =>
            String(campo ?? "").toLowerCase().includes(busqueda)
        );
    });

    mostrarCartas(resultados);
}

buscadorCartas.addEventListener("input", filtrarCartas);

// ==========================================
// CARGAR CARTAS
// ==========================================

async function cargarCartas() {
    listaCartas.textContent = "Cargando cartas...";

    const { data, count, error } = await db
        .from("cartas")
        .select(`
            id,
            persona_id,
            titulo,
            contenido,
            despedida,
            tema,
            publicada,
            created_at,
            updated_at,
            personas (
                nombre,
                numero
            )
        `, { count: "exact" })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al cargar cartas:", error);
        listaCartas.textContent = "Error al consultar las cartas.";
        return;
    }

    cartasRegistradas = data || [];

    totalCartas.textContent = count ?? 0;

    filtrarCartas();
}

// ==========================================
// ABRIR EDICIÓN DE CARTA
// ==========================================

listaCartas.addEventListener("click", event => {
    const boton = event.target.closest(".btn-editar-carta");

    if (!boton) return;

    const carta = cartasRegistradas.find(
        elemento => String(elemento.id) === boton.dataset.id
    );

    if (!carta) return;

    document.getElementById("carta-titulo").value = carta.titulo || "";
    document.getElementById("carta-contenido").value = carta.contenido || "";
    document.getElementById("carta-despedida").value = carta.despedida || "";
    document.getElementById("carta-tema").value = carta.tema || "dorado";
    document.getElementById("carta-publicada").value = String(Boolean(carta.publicada));

    document.getElementById("mensaje-edicion-carta").textContent = "";

    modalCarta.dataset.id = carta.id;

    modalCarta.showModal();
});

// ==========================================
// GUARDAR EDICIÓN DE CARTA
// ==========================================

document.getElementById("form-editar-carta").addEventListener("submit", async event => {
    event.preventDefault();

    const id = modalCarta.dataset.id;

    const titulo = document.getElementById("carta-titulo").value.trim();
    const contenido = document.getElementById("carta-contenido").value.trim();
    const despedida = document.getElementById("carta-despedida").value.trim();
    const tema = document.getElementById("carta-tema").value;

    const publicada =
        document.getElementById("carta-publicada").value === "true";

    const mensaje = document.getElementById("mensaje-edicion-carta");
    const boton = document.getElementById("guardar-carta");

    if (!titulo || !contenido) {
        mensaje.textContent = "El título y el contenido son obligatorios.";
        return;
    }

    if (!temasValidos.includes(tema)) {
        mensaje.textContent = "Selecciona un tema válido.";
        return;
    }

    boton.disabled = true;
    boton.textContent = "Guardando...";

    try {
        const datosCarta = {
            titulo,
            contenido,
            despedida: despedida || null,
            tema,
            publicada,
            updated_at: new Date().toISOString()
        };

        const { error } = await db
            .from("cartas")
            .update(datosCarta)
            .eq("id", id);

        if (error) throw error;

        const { data: comprobacion, error: errorComprobacion } = await db
            .from("cartas")
            .select("id, titulo, contenido, despedida, tema, publicada")
            .eq("id", id)
            .maybeSingle();

        if (errorComprobacion) throw errorComprobacion;

        if (
            !comprobacion ||
            comprobacion.titulo !== titulo ||
            comprobacion.contenido !== contenido ||
            (comprobacion.despedida ?? null) !== datosCarta.despedida ||
            comprobacion.tema !== tema ||
            Boolean(comprobacion.publicada) !== publicada
        ) {
            throw new Error(
                "No se pudieron verificar los cambios de la carta."
            );
        }

        await cargarCartas();

        modalCarta.close();

        alert("¡Carta actualizada correctamente!");

    } catch (error) {
        console.error("Error al editar carta:", error);

        mensaje.textContent =
            `No se pudieron guardar los cambios: ${error.message || "Error desconocido"}`;

    } finally {
        boton.disabled = false;
        boton.textContent = "Guardar cambios";
    }
});

document.getElementById("cancelar-carta").addEventListener("click", () => {
    modalCarta.close();
});

// ==========================================
// ELIMINAR CARTA
// ==========================================

listaCartas.addEventListener("click", async event => {
    const boton = event.target.closest(".btn-eliminar-carta");

    if (!boton) return;

    const id = boton.dataset.id;

    const carta = cartasRegistradas.find(
        elemento => String(elemento.id) === String(id)
    );

    if (!carta) return;

    const confirmar = confirm(
        `¿Eliminar la carta "${carta.titulo || "Sin título"}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    boton.disabled = true;
    boton.textContent = "Eliminando...";

    try {
        const { error } = await db
            .from("cartas")
            .delete()
            .eq("id", id);

        if (error) throw error;

        alert("Solicitud de eliminación completada.");

        await cargarCartas();

    } catch (error) {
        console.error("Error al eliminar carta:", error);

        alert(`No se pudo eliminar la carta: ${error.message || "Error desconocido"}`);

        boton.disabled = false;
        boton.textContent = "× Eliminar";
    }
});

// ==========================================
// AGREGAR NUEVO GRADUADO
// ==========================================

formularioGraduado.addEventListener("submit", async event => {
    event.preventDefault();

    const numero = Number(document.getElementById("numero").value);
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const curso = document.getElementById("curso").value;
    const activo = document.getElementById("activo").value === "true";

    if (!Number.isInteger(numero) || numero < 1 || !nombre) {
        mensajeGraduado.textContent = "Revisa el número y el nombre.";
        return;
    }

    if (!curso) {
        mensajeGraduado.textContent = "Selecciona un curso.";
        return;
    }

    botonGuardar.disabled = true;
    botonGuardar.textContent = "Guardando...";

    mensajeGraduado.textContent = "Registrando graduado...";

    try {
        const { error } = await db
            .from("personas")
            .insert({
                numero,
                nombre,
                email: correo || null,
                curso,
                activo
            });

        if (error) throw error;

        mensajeGraduado.textContent =
            "¡Graduado registrado correctamente!";

        mensajeGraduado.className = "mensaje-exito";

        formularioGraduado.reset();

        await cargarGraduados();

    } catch (error) {
        console.error("Error al registrar graduado:", error);

        mensajeGraduado.textContent =
            `No se pudo registrar: ${error.message || "Revisa los datos o si el número ya existe."}`;

        mensajeGraduado.className = "mensaje-error";

    } finally {
        botonGuardar.disabled = false;
        botonGuardar.innerHTML = "<span>＋</span> Agregar graduado";
    }
});

// ==========================================
// CERRAR SESIÓN
// ==========================================

logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;

    logoutBtn.textContent = "Cerrando sesión...";

    const { error } = await db.auth.signOut();

    if (error) {
        console.error("Error al cerrar sesión:", error);

        logoutBtn.disabled = false;

        logoutBtn.innerHTML = "<span>↪</span> Cerrar sesión";

        alert("No se pudo cerrar la sesión.");

        return;
    }

    window.location.href = "index.html";
});

// ==========================================
// INICIAR DASHBOARD
// ==========================================

async function iniciarDashboard() {
    try {
        const autorizado = await verificarAdministrador();

        if (!autorizado) return;

        await Promise.all([
            cargarGraduados(),
            cargarCartas()
        ]);

        console.log("Dashboard cargado correctamente.");

    } catch (error) {
        console.error("Error iniciando dashboard:", error);
    }
}

iniciarDashboard();
