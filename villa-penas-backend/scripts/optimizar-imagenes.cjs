
/* ==========================================
   VILLA PEÑA - OPTIMIZAR IMÁGENES CON SHARP
========================================== */

const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

// ==========================================
// 1. CONFIGURACIÓN
// ==========================================

const carpetaAssets = path.resolve(
    __dirname,
    "../../assets"
);

const carpetaSalida = path.join(
    carpetaAssets,
    "optimizadas"
);

const extensiones = new Set([
    ".jpg",
    ".jpeg",
    ".png"
]);

// ==========================================
// 2. BUSCAR IMÁGENES
// ==========================================

async function buscarImagenes(carpeta) {

    const resultados = [];
    const archivos = await fs.readdir(carpeta, {
        withFileTypes: true
    });

    for (const archivo of archivos) {

        const ruta = path.join(carpeta, archivo.name);

        if (archivo.isDirectory()) {

            // No volver a procesar las optimizadas
            if (ruta === carpetaSalida) continue;

            const imagenes = await buscarImagenes(ruta);
            resultados.push(...imagenes);

        } else if (
            archivo.isFile() &&
            extensiones.has(
                path.extname(archivo.name).toLowerCase()
            )
        ) {
            resultados.push(ruta);
        }
    }

    return resultados;
}

// ==========================================
// 3. OPTIMIZAR FOTOGRAFÍAS
// ==========================================

async function optimizarImagenes() {

    await fs.mkdir(carpetaSalida, {
        recursive: true
    });

    const imagenes = await buscarImagenes(carpetaAssets);

    let pesoOriginal = 0;
    let pesoOptimizado = 0;
    let procesadas = 0;

    console.log(
        `Se encontraron ${imagenes.length} imágenes.\n`
    );

    for (const origen of imagenes) {

        try {

            const relativa = path.relative(
                carpetaAssets,
                origen
            );

            const nombre = path.basename(
                relativa,
                path.extname(relativa)
            );

            const subcarpeta = path.dirname(relativa);

            const destino = path.join(
                carpetaSalida,
                subcarpeta,
                `${nombre}.webp`
            );

            await fs.mkdir(path.dirname(destino), {
                recursive: true
            });

            const esPortada =
                nombre.toLowerCase() === "villa.penas";

            const anchoMaximo = esPortada ? 1920 : 1000;
            const calidad = esPortada ? 80 : 78;

            const original = await fs.stat(origen);

            await sharp(origen)
                .rotate()
                .resize({
                    width: anchoMaximo,
                    withoutEnlargement: true
                })
                .webp({
                    quality: calidad,
                    effort: 5
                })
                .toFile(destino);

            const optimizada = await fs.stat(destino);

            pesoOriginal += original.size;
            pesoOptimizado += optimizada.size;
            procesadas++;

            const ahorro = (
                (1 - optimizada.size / original.size) * 100
            ).toFixed(1);

            console.log(
                `${relativa} -> ${path.relative(carpetaAssets, destino)} | Ahorro: ${ahorro}%`
            );

        } catch (error) {

            console.error(
                `Error procesando ${origen}:`,
                error.message
            );
        }
    }

    // ==========================================
    // 4. RESULTADOS
    // ==========================================

    const mb = bytes =>
        (bytes / 1024 / 1024).toFixed(2);

    console.log("\n========== RESULTADOS ==========");
    console.log(`Imágenes procesadas: ${procesadas}`);
    console.log(`Peso original: ${mb(pesoOriginal)} MB`);
    console.log(`Peso optimizado: ${mb(pesoOptimizado)} MB`);

    if (pesoOriginal > 0) {
        console.log(
            `Reducción: ${(
                (1 - pesoOptimizado / pesoOriginal) * 100
            ).toFixed(1)}%`
        );
    }

    console.log("================================");
}

optimizarImagenes().catch(console.error);
