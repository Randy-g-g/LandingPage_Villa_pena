
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const sharp = require("sharp");

const raizBackend = path.resolve(__dirname, "..");
const raizProyecto = path.resolve(raizBackend, "..");

const carpetaImagenes = path.join(
    raizBackend,
    "uploads",
    "galeria"
);

const archivoJSON = path.join(
    raizBackend,
    "data",
    "galeria.json"
);

async function migrarGaleria() {

    // 1. Leer el arreglo de fotografías existente
    const archivoFotos = path.join(
        raizProyecto,
        "js",
        "fotos.js"
    );

    const contenido = await fs.readFile(
        archivoFotos,
        "utf8"
    );

    // Extraer el arreglo del archivo JavaScript
    const coincidencia = contenido.match(
        /const fotosGaleria\s*=\s*(\[[\s\S]*?\]);/
    );

    if (!coincidencia) {
        throw new Error(
            "No se encontró el arreglo fotosGaleria"
        );
    }

    // Parsear únicamente datos literales del arreglo.
    // No ejecutar código JavaScript.
    const textoArreglo = coincidencia[1];

    const fotos = [];

    const regexFoto =
        /\{\s*src:\s*["']([^"']+)["']\s*,\s*descripcion:\s*["']([^"']+)["']\s*\}/g;

    let resultado;

    while ((resultado = regexFoto.exec(textoArreglo)) !== null) {
        fotos.push({
            src: resultado[1],
            descripcion: resultado[2],
        });
    }

    if (fotos.length === 0) {
        throw new Error(
            "No se encontraron fotografías válidas"
        );
    }

    // 2. Preparar almacenamiento
    await fs.mkdir(carpetaImagenes, {
        recursive: true,
    });

    await fs.mkdir(path.dirname(archivoJSON), {
        recursive: true,
    });

    // Evitar repetir una migración ya completada
    const contenidoActual = await fs.readFile(
        archivoJSON,
        "utf8"
    );

    const fotosActuales = JSON.parse(contenidoActual);

    if (!Array.isArray(fotosActuales)) {
        throw new Error("galeria.json no contiene un arreglo");
    }

    if (fotosActuales.length > 0) {
        throw new Error(
            "La galería ya contiene fotografías. Se canceló la migración para evitar duplicados."
        );
    }

    // 3. Procesar las fotografías
    const fotosMigradas = [];

    for (const foto of fotos) {

        const origen = path.resolve(
            raizProyecto,
            foto.src
        );

        // Comprobar que la ruta pertenece a assets
        const carpetaAssets = path.join(
            raizProyecto,
            "assets"
        );

        if (!origen.startsWith(carpetaAssets + path.sep)) {
            throw new Error(
                `Ruta de fotografía no permitida: ${foto.src}`
            );
        }

        await fs.access(origen);

        const id = randomUUID();
        const nombre = `${id}.webp`;

        const destino = path.join(
            carpetaImagenes,
            nombre
        );

        await sharp(origen)
            .rotate()
            .resize({
                width: 1200,
                withoutEnlargement: true,
            })
            .webp({ quality: 78 })
            .toFile(destino);

        fotosMigradas.push({
            id,
            src: `/uploads/galeria/${nombre}`,
            descripcion: foto.descripcion,
        });

        console.log(
            `Migrada: ${foto.src}`
        );
    }

    // 4. Guardar los datos
    await fs.writeFile(
        archivoJSON,
        JSON.stringify(fotosMigradas, null, 2),
        "utf8"
    );

    console.log(
        `Migración finalizada: ${fotosMigradas.length} fotografías.`
    );
}

migrarGaleria().catch(error => {
    console.error("Error durante la migración:", error);
    process.exitCode = 1;
});
