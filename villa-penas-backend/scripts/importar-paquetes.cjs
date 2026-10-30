
const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const prisma = new PrismaClient();

async function importarPaquetes() {
  const ruta = join(
    process.cwd(),
    'data',
    'paquetes.json'
  );

  const paquetes = JSON.parse(
    readFileSync(ruta, 'utf8')
  );

  if (!Array.isArray(paquetes)) {
    throw new Error('paquetes.json debe contener un arreglo.');
  }

  // Evitar importar sobre tablas que ya tienen información.
  const [totalPaquetes, totalServicios, totalDetalles] =
    await Promise.all([
      prisma.paquetes.count(),
      prisma.servicios_paquete.count(),
      prisma.detalles_paquete.count()
    ]);

  if (totalPaquetes || totalServicios || totalDetalles) {
    throw new Error(
      'La importación se canceló: las tablas ya contienen datos.'
    );
  }

  // Todas las inserciones se realizan en una transacción.
  await prisma.$transaction(async (tx) => {
    for (const paquete of paquetes) {
      await tx.paquetes.create({
        data: {
          id: paquete.id,
          nombre: paquete.nombre,
          descripcion: paquete.descripcion,
          precio: paquete.precio,
          activo: paquete.activo,

          servicios_paquete: {
            create: paquete.servicios.map(nombre => ({
              nombre
            }))
          },

          detalles_paquete: {
            create: paquete.detalles.map(detalle => ({
              nombre: detalle.nombre,
              descripcion: detalle.descripcion
            }))
          }
        }
      });

      console.log(
        `Paquete importado: ${paquete.nombre}`
      );
    }
  });

  // Ajustar el contador automático después de importar
  // identificadores explícitos desde JSON.
  await prisma.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('public.paquetes', 'id'),
      COALESCE((SELECT MAX(id) FROM paquetes), 1),
      (SELECT COUNT(*) > 0 FROM paquetes)
    )
  `;

  const [cantidadPaquetes, cantidadServicios, cantidadDetalles] =
    await Promise.all([
      prisma.paquetes.count(),
      prisma.servicios_paquete.count(),
      prisma.detalles_paquete.count()
    ]);

  console.log('\nImportación completada.');
  console.log('Paquetes:', cantidadPaquetes);
  console.log('Servicios:', cantidadServicios);
  console.log('Detalles:', cantidadDetalles);
}

importarPaquetes()
  .catch(error => {
    console.error('Error al importar paquetes:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
