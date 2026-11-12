
 // ==========================================
 // PDF CONMEMORATIVO - PROM 2026
 // Edición especial: negro, dorado y seis temas
 // ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("descargar-pdf");

    if (boton) {
        boton.addEventListener("click", generarPDF);
    }
});

// ==========================================
// PALETAS DE COLORES
// ==========================================

const temasPDF = {
    dorado: {
        principal: [201, 164, 92],
        claro: [234, 213, 163]
    },

    azul: {
        principal: [92, 158, 201],
        claro: [163, 213, 234]
    },

    rosa: {
        principal: [201, 108, 145],
        claro: [239, 184, 205]
    },

    verde: {
        principal: [110, 170, 124],
        claro: [181, 223, 189]
    },

    morado: {
        principal: [155, 122, 203],
        claro: [208, 185, 239]
    },

    rojo: {
        principal: [199, 94, 94],
        claro: [237, 170, 170]
    }
};

// ==========================================
// GENERAR PDF
// ==========================================

function generarPDF() {

    if (!window.jspdf?.jsPDF) {
        alert("No se pudo cargar el generador de PDF. Recarga la página.");
        return;
    }

    const obtenerTexto = (id, defecto = "") =>
        document.getElementById(id)?.innerText.trim() || defecto;

    const nombre = obtenerTexto("nombre-graduado", "Graduado");
    const titulo = obtenerTexto("titulo-carta", "Un recuerdo especial");
    const contenido = obtenerTexto("contenido-carta");
    const despedida = obtenerTexto("despedida-carta");

    if (
        !contenido ||
        contenido === "Preparando tu carta..." ||
        contenido === "Tu carta está en camino."
    ) {
        alert("Tu carta todavía no está disponible para descargar.");
        return;
    }

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const ancho = pdf.internal.pageSize.getWidth();
    const alto = pdf.internal.pageSize.getHeight();

    // Obtener el tema personalizado de la carta
    const cartaPersonal = document.querySelector(".carta-personal");

    const tema = cartaPersonal?.dataset.temaCarta || "dorado";

    const colores = temasPDF[tema] || temasPDF.dorado;

    const principal = colores.principal;
    const claro = colores.claro;

    const fondo = [17, 17, 18];
    const blanco = [245, 242, 235];
    const suave = [174, 170, 160];

    const margen = 27;
    const anchoTexto = ancho - margen * 2;
    const limiteInferior = alto - 39;

    let posicionY = 0;

    // ==========================================
    // FONDO Y MARCOS
    // ==========================================

    function dibujarFondo() {

        pdf.setFillColor(...fondo);
        pdf.rect(0, 0, ancho, alto, "F");

        // Marco exterior
        pdf.setDrawColor(...principal);
        pdf.setLineWidth(0.65);
        pdf.rect(10, 10, ancho - 20, alto - 20);

        // Marco interior
        pdf.setDrawColor(83, 79, 70);
        pdf.setLineWidth(0.2);
        pdf.rect(13, 13, ancho - 26, alto - 26);

        // Esquinas ornamentales
        const esquinas = [
            [17, 17, 1, 1],
            [ancho - 17, 17, -1, 1],
            [17, alto - 17, 1, -1],
            [ancho - 17, alto - 17, -1, -1]
        ];

        pdf.setDrawColor(...principal);
        pdf.setLineWidth(0.45);

        esquinas.forEach(([x, y, dx, dy]) => {
            pdf.line(x, y, x + dx * 5, y);
            pdf.line(x, y, x, y + dy * 5);
        });
    }

    // ==========================================
    // EMBLEMA DECORATIVO
    // ==========================================

    function dibujarEmblema(x, y, radio = 8) {

        pdf.setDrawColor(...principal);
        pdf.setLineWidth(0.45);

        pdf.circle(x, y, radio, "S");
        pdf.circle(x, y, radio - 1.3, "S");

        pdf.setTextColor(...claro);
        pdf.setFont("times", "bold");
        pdf.setFontSize(8);

        pdf.text("26", x, y + 1.5, {
            align: "center"
        });

        pdf.setFont("times", "normal");
        pdf.setFontSize(4.5);

        pdf.text("PROM", x, y - 3, {
            align: "center"
        });
    }

    // ==========================================
    // ENCABEZADO PRINCIPAL
    // ==========================================

    function dibujarEncabezado() {

        dibujarEmblema(ancho / 2, 25, 8);

        pdf.setTextColor(...principal);
        pdf.setFont("times", "bold");
        pdf.setFontSize(22);

        pdf.text("PROM 2026", ancho / 2, 45, {
            align: "center"
        });

        pdf.setTextColor(...claro);
        pdf.setFont("times", "normal");
        pdf.setFontSize(8);

        pdf.text(
            "UNA GENERACIÓN  |  UN RECUERDO  |  UNA HISTORIA",
            ancho / 2,
            53,
            { align: "center" }
        );

        // Separador ornamental
        pdf.setDrawColor(...principal);
        pdf.setLineWidth(0.45);

        pdf.line(66, 62, 91, 62);
        pdf.line(ancho - 91, 62, ancho - 66, 62);

        pdf.setFillColor(...principal);
        pdf.circle(ancho / 2, 62, 1.2, "F");

        // Presentación
        pdf.setTextColor(...suave);
        pdf.setFont("times", "italic");
        pdf.setFontSize(12);

        pdf.text(
            "Un recuerdo creado especialmente para",
            ancho / 2,
            77,
            { align: "center" }
        );

        // Nombre
        pdf.setTextColor(...claro);
        pdf.setFont("times", "bold");
        pdf.setFontSize(20);

        const nombreLineas = pdf.splitTextToSize(nombre, anchoTexto);

        pdf.text(nombreLineas, ancho / 2, 91, {
            align: "center"
        });

        let y = 91 + nombreLineas.length * 9 + 9;

        // Título
        pdf.setTextColor(...blanco);
        pdf.setFont("times", "bold");
        pdf.setFontSize(17);

        const tituloLineas = pdf.splitTextToSize(titulo, anchoTexto);

        pdf.text(tituloLineas, ancho / 2, y, {
            align: "center"
        });

        y += tituloLineas.length * 8 + 10;

        // Línea principal
        pdf.setDrawColor(...principal);
        pdf.setLineWidth(0.5);

        pdf.line(margen + 12, y, ancho - margen - 12, y);

        return y + 14;
    }

    // ==========================================
    // ENCABEZADO DE PÁGINAS ADICIONALES
    // ==========================================

    function dibujarEncabezadoSecundario() {

        pdf.setTextColor(...principal);
        pdf.setFont("times", "bold");
        pdf.setFontSize(13);

        pdf.text("PROM 2026", ancho / 2, 29, {
            align: "center"
        });

        pdf.setTextColor(...suave);
        pdf.setFont("times", "italic");
        pdf.setFontSize(8);

        pdf.text("CONTINUACIÓN DE UNA HISTORIA", ancho / 2, 36, {
            align: "center"
        });

        pdf.setDrawColor(...principal);
        pdf.setLineWidth(0.35);

        pdf.line(margen + 15, 43, ancho - margen - 15, 43);

        return 56;
    }

    // ==========================================
    // PIE DE PÁGINA
    // ==========================================

    function dibujarPiePagina(numero, total) {

        pdf.setDrawColor(90, 85, 75);
        pdf.setLineWidth(0.25);

        pdf.line(
            margen,
            alto - 29,
            ancho - margen,
            alto - 29
        );

        pdf.setFont("times", "italic");
        pdf.setFontSize(8);
        pdf.setTextColor(...suave);

        pdf.text(
            "Una etapa termina. Nuestra historia continúa.",
            ancho / 2,
            alto - 21,
            { align: "center" }
        );

        pdf.setFont("times", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...principal);

        pdf.text(`${numero} / ${total}`, ancho / 2, alto - 15, {
            align: "center"
        });
    }

    // ==========================================
    // NUEVA PÁGINA
    // ==========================================

    function nuevaPagina() {

        pdf.addPage();
        dibujarFondo();

        posicionY = dibujarEncabezadoSecundario();
    }

    // ==========================================
    // PRIMERA PÁGINA
    // ==========================================

    dibujarFondo();
    posicionY = dibujarEncabezado();

    // ==========================================
    // TEXTO DE LA CARTA
    // ==========================================

    const parrafos = contenido
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean);

    const alturaLinea = 7.8;
    const espacioParrafo = 6;

    pdf.setFont("times", "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(...blanco);

    parrafos.forEach(parrafo => {

        const lineas = pdf.splitTextToSize(parrafo, anchoTexto);

        lineas.forEach(linea => {

            if (posicionY + alturaLinea > limiteInferior) {
                nuevaPagina();

                pdf.setFont("times", "normal");
                pdf.setFontSize(13);
                pdf.setTextColor(...blanco);
            }

            pdf.text(linea, margen, posicionY);
            posicionY += alturaLinea;
        });

        posicionY += espacioParrafo;
    });

    // ==========================================
    // CIERRE CONMEMORATIVO
    // ==========================================

    const despedidaLineas = despedida
        ? pdf.splitTextToSize(despedida, anchoTexto)
        : [];

    const alturaCierre =
        12 +
        despedidaLineas.length * 8 +
        34;

    // En cartas cortas, ubicar el cierre más abajo
    // para equilibrar el espacio de la página.

    const posicionCierre = Math.max(posicionY + 12, 194);

    if (posicionCierre + alturaCierre > limiteInferior) {
        nuevaPagina();
    } else {
        posicionY = posicionCierre;
    }

    // Separador ornamental
    pdf.setDrawColor(...principal);
    pdf.setLineWidth(0.45);

    pdf.line(
        ancho / 2 - 17,
        posicionY,
        ancho / 2 + 17,
        posicionY
    );

    posicionY += 13;

    // Despedida
    if (despedidaLineas.length) {

        pdf.setFont("times", "italic");
        pdf.setFontSize(13);
        pdf.setTextColor(...claro);

        pdf.text(despedidaLineas, ancho / 2, posicionY, {
            align: "center"
        });

        posicionY += despedidaLineas.length * 8 + 13;
    }

    // Firma
    pdf.setFont("times", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...suave);

    pdf.text("CON CARIÑO,", ancho / 2, posicionY, {
        align: "center"
    });

    posicionY += 9;

    pdf.setFont("times", "bold");
    pdf.setFontSize(15);
    pdf.setTextColor(...principal);

    pdf.text("PROMOCIÓN 2026", ancho / 2, posicionY, {
        align: "center"
    });

    // ==========================================
    // PIE EN TODAS LAS PÁGINAS
    // ==========================================

    const totalPaginas = pdf.internal.getNumberOfPages();

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        pdf.setPage(pagina);
        dibujarPiePagina(pagina, totalPaginas);
    }

    // ==========================================
    // DESCARGA
    // ==========================================

    const nombreArchivo = nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "_") || "Graduado";

    pdf.save(`Carta_PROM2026_${nombreArchivo}.pdf`);
}
