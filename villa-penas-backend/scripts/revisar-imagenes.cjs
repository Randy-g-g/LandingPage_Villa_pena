
/* ==========================================
   VILLA PEÑA - REVISIÓN DE IMÁGENES
   MODO SEGURO: NO BORRA NI MUEVE ARCHIVOS
========================================== */

const fs = require("node:fs/promises");
const path = require("node:path");

// ==========================================
// 1. CONFIGURACIÓN
// ==========================================

const raizProyecto = path.resolve(__dirname, "../..");

const carpetaAssets = path.join(
    raizProyecto,
    "assets"
);

const carpetaOptimizadas = path.join(
    carpetaAssets,
    "optimizadas"
);

const extensionesImagen = new Set([
    ".jpg",
    ".jpeg",
    ".png"
]);

const extensionesCodigo = new Set([
    ".html",
    ".css",
    ".js",
    ".cjs",
    ".mjs",
    ".ts",
    ".json"
]);

const carpetasIgnoradas = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    "optimizadas",
    "uploads"
]);

// ==========================================
// 2. BUSCAR ARCHIVOS RECURSIVAMENTE
// ==========================================

async function buscarArchivos(carpeta, extensiones) {

    const resultados = [];

    const entradas = await fs.readdir(carpeta, {
        withFileTypes: true
    });

    for (const entrada of entradas) {

        if (carpetasIgnoradas.has(entrada.name)) {
            continue;
        }

        const ruta = path.join(carpeta, entrada.name);

        if (entrada.isDirectory()) {

            const encontrados = await buscarArchivos(
                ruta,
                extensiones
            );

            resultados.push(...encontrados);

        } else if (
            entrada.isFile() &&
            extensiones.has(
                path.extname(entrada.name).toLowerCase()
            ) &&
            entrada.name !== "package-lock.json"
        ) {
            resultados.push(ruta);
        }
    }

    return resultados;
}

// ==========================================
// 3. REVISAR REFERENCIAS
// ==========================================

async function revisarImagenes() {

    const originales = await buscarArchivos(
        carpetaAssets,
        extensionesImagen
    );

    const archivosCodigo = await buscarArchivos(
        raizProyecto,
        extensionesCodigo
    );

    // Leer el código una sola vez
    const contenidos = [];

    for (const archivo of archivosCodigo) {

        // El propio script no cuenta como referencia
        if (archivo === __filename) continue;

        const contenido = await fs.readFile(
            archivo,
            "utf8"
        );

        contenidos.push({
            archivo: path.relative(raizProyecto, archivo),
            contenido
        });
    }

    const candidatas = [];
    const referenciadas = [];
    const revisionManual = [];

    let pesoCandidatas = 0;

    // ==========================================
    // 4. CLASIFICAR IMÁGENES
    // ==========================================

    for (const original of originales) {

        const relativa = path.relative(
            carpetaAssets,
            original
        );

        const extension = path.extname(relativa);

        const nombreSinExtension = relativa.slice(
            0,
            -extension.length
        );

        const rutaWebp = path.join(
            carpetaOptimizadas,
            nombreSinExtension + ".webp"
        );

        // Buscar referencias por nombre y ruta
        const nombreOriginal = path.basename(original);

        const rutaRelativa = relativa
            .split(path.sep)
            .join("/");

        const referencias = contenidos
            .filter(item =>
                item.contenido.includes(nombreOriginal) ||
                item.contenido.includes(rutaRelativa) ||
                item.contenido.includes(
                    encodeURIComponent(nombreOriginal)
                )
            )
            .map(item => item.archivo);

        let existeWebp = false;

        try {
            await fs.access(rutaWebp);
            existeWebp = true;
        } catch {
            existeWebp = false;
        }

        const info = await fs.stat(original);

        const registro = {
            original: relativa,
            webp: path.relative(
                carpetaAssets,
                rutaWebp
            ),
            tamanoMB: Number(
                (info.size / 1024 / 1024).toFixed(2)
            ),
            referencias
        };

        if (referencias.length > 0) {

            referenciadas.push(registro);

        } else if (!existeWebp) {

            revisionManual.push(registro);

        } else {

            candidatas.push(registro);
            pesoCandidatas += info.size;
        }
    }

    // ==========================================
    // 5. MOSTRAR RESULTADOS
    // ==========================================

    console.log("\n========== VILLA PEÑA ==========");
    console.log("REVISIÓN DE IMÁGENES ORIGINALES\n");

    console.log(
        `Originales encontrados: ${originales.length}`
    );

    console.log(
        `Con referencias detectadas: ${referenciadas.length}`
    );

    console.log(
        `Sin WebP correspondiente: ${revisionManual.length}`
    );

    console.log(
        `Candidatas para respaldo: ${candidatas.length}`
    );

    console.log("\n--- CANDIDATAS PARA RESPALDO ---");

    for (const imagen of candidatas) {
        console.log(
            `${imagen.original} (${imagen.tamanoMB} MB)`
        );
    }

    console.log("\n--- TODAVÍA REFERENCIADAS ---");

    for (const imagen of referenciadas) {
        console.log(`\n${imagen.original}`);

        for (const referencia of imagen.referencias) {
            console.log(`  Usada en: ${referencia}`);
        }
    }

    console.log("\n--- REVISIÓN MANUAL ---");

    for (const imagen of revisionManual) {
        console.log(
            `${imagen.original} - No se encontró WebP`
        );
    }

    console.log("\n--- RESUMEN ---");

    console.log(
        "Espacio potencial para retirar:",
        (pesoCandidatas / 1024 / 1024).toFixed(2),
        "MB"
    );

    console.log(
        "\nIMPORTANTE: Este análisis es conservador."
    );

    console.log(
        "Las rutas construidas dinámicamente pueden no detectarse."
    );

    console.log(
        "No se ha borrado ni movido ningún archivo."
    );
}

revisarImagenes().catch(error => {
    console.error("Error:", error.message);
    process.exitCode = 1;
});
