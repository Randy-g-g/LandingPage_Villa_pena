
const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const prisma = new PrismaClient();

async function importarResenas() {

  // Leer las reseñas del JSON actual
  const ruta = join(
    process.cwd(),
    'data',
    'resenas.json'
  );

  const resenas = JSON.parse(
    readFileSync(ruta, 'utf8')
  );

  if (!Array.isArray(resenas)) {
    throw new Error(
      'resenas.json debe contener un arreglo.'
    );
  }

  // Validar los datos antes de importarlos
  for (const resena of resenas) {

    if (!Number.isInteger(resena.id) || resena.id < 1) {
      throw new Error('Se encontró un ID de reseña inválido.');
    }

    if (
      !['PENDIENTE', 'APROBADA', 'RECHAZADA']
        .includes(resena.estado)
    ) {
      throw new Error(
        `Estado inválido en la reseña ${resena.id}`
      );
    }

    if (
      !Number.isInteger(resena.calificacion) ||
      resena.calificacion < 1 ||
      resena.calificacion > 5
    ) {
      throw new Error(
        `Calificación inválida en la reseña ${resena.id}`
      );
    }

    if (
      !resena.fechaCreacion ||
      Number.isNaN(new Date(resena.fechaCreacion).getTime())
    ) {
      throw new Error(
        `Fecha inválida en la reseña ${resena.id}`
      );
    }
  }

  // Importar todo de forma segura
  await prisma.$transaction(async (tx) => {

    const existentes = await tx.resenas.count();

    if (existentes > 0) {
      throw new Error(
        'La tabla resenas ya contiene datos. Importación cancelada.'
      );
    }

    for (const resena of resenas) {

      await tx.resenas.create({
        data: {
          id: resena.id,
          usuario: resena.usuario,
          comentario: resena.comentario,
          calificacion: resena.calificacion,
          estado: resena.estado,
          fecha_creacion: new Date(resena.fechaCreacion)
        }
      });

      console.log(`Reseña ${resena.id} importada.`);
    }

    // Ajustar la secuencia para nuevos registros
    if (resenas.length > 0) {
      await tx.$queryRaw`
        SELECT setval(
          pg_get_serial_sequence('public.resenas', 'id'),
          (SELECT MAX(id) FROM public.resenas),
          true
        )
      `;
    }
  });

  const total = await prisma.resenas.count();

  console.log('\nImportación completada.');
  console.log('Reseñas:', total);
}

importarResenas()
  .catch(error => {
    console.error(
      'Error al importar reseñas:',
      error.message
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
