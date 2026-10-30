
const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const prisma = new PrismaClient();

async function importarAdicionales() {

  // Leer los datos actuales
  const ruta = join(
    process.cwd(),
    'data',
    'adicionales.json'
  );

  const adicionales = JSON.parse(
    readFileSync(ruta, 'utf8')
  );

  if (!Array.isArray(adicionales)) {
    throw new Error(
      'adicionales.json debe contener un arreglo.'
    );
  }

  // Importar todo en una transacción
  await prisma.$transaction(async (tx) => {

    // Evitar importar dos veces
    const totalAdicionales =
      await tx.adicionales.count();

    const totalPaquetes =
      await tx.paquetes_adicionales.count();

    if (totalAdicionales > 0 || totalPaquetes > 0) {
      throw new Error(
        'Las tablas ya contienen datos. Importación cancelada.'
      );
    }

    for (const adicional of adicionales) {

      await tx.adicionales.create({
        data: {
          id: adicional.id,
          categoria: adicional.categoria,
          descripcion: adicional.descripcion,

          paquetes_adicionales: {
            create: adicional.paquetes.map(paquete => ({
              nombre: paquete.nombre,
              cantidad: paquete.cantidad,
              detalle: paquete.detalle,
              precio: paquete.precio
            }))
          }
        }
      });

    }

    // Sincronizar los IDs automáticos de categorías
    if (adicionales.length > 0) {
      await tx.$queryRaw`
        SELECT setval(
          pg_get_serial_sequence('public.adicionales', 'id'),
          (SELECT MAX(id) FROM public.adicionales),
          true
        )
      `;
    }

  });

  // Verificar resultados
  const totalCategorias =
    await prisma.adicionales.count();

  const totalPaquetes =
    await prisma.paquetes_adicionales.count();

  console.log('\nImportación completada.');
  console.log('Categorías:', totalCategorias);
  console.log('Paquetes adicionales:', totalPaquetes);
}

importarAdicionales()
  .catch(error => {
    console.error(
      'Error al importar adicionales:',
      error.message
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
