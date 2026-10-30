
const { PrismaClient } = require('@prisma/client');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const prisma = new PrismaClient();

async function importarGaleria() {
  const ruta = join(
    process.cwd(),
    'data',
    'galeria.json'
  );

  if (!existsSync(ruta)) {
    throw new Error(
      'No se encontró data/galeria.json.'
    );
  }

  const fotos = JSON.parse(
    readFileSync(ruta, 'utf8')
  );

  if (!Array.isArray(fotos)) {
    throw new Error(
      'galeria.json debe contener un arreglo.'
    );
  }

  // Comprobar que las fotografías físicas existen
  const faltantes = [];

  for (const foto of fotos) {
    if (
      !foto.id ||
      typeof foto.src !== 'string' ||
      !foto.src.startsWith('/uploads/galeria/')
    ) {
      throw new Error(
        `Registro de fotografía inválido: ${foto.id}`
      );
    }

    const nombreArchivo = foto.src.split('/').pop();

    const rutaImagen = join(
      process.cwd(),
      'uploads',
      'galeria',
      nombreArchivo
    );

    if (!existsSync(rutaImagen)) {
      faltantes.push(foto.src);
    }
  }

  if (faltantes.length > 0) {
    throw new Error(
      `Faltan ${faltantes.length} imágenes físicas. ` +
      'No se importará hasta revisar los archivos.'
    );
  }

  await prisma.$transaction(async (tx) => {
    const existentes = await tx.galeria.count();

    if (existentes > 0) {
      throw new Error(
        'La tabla galeria ya contiene datos. Importación cancelada.'
      );
    }

    for (const foto of fotos) {
      await tx.galeria.create({
        data: {
          id: foto.id,
          src: foto.src,
          descripcion: foto.descripcion ?? null,
        },
      });

      console.log(`Fotografía importada: ${foto.id}`);
    }
  });

  console.log('\nImportación completada.');
  console.log('Fotografías:', await prisma.galeria.count());
}

importarGaleria()
  .catch(error => {
    console.error(
      'Error al importar galería:',
      error.message
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
