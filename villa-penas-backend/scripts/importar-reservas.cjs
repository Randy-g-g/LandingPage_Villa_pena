
const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const prisma = new PrismaClient();

// Convertir YYYY-MM-DD a fecha de Prisma
function convertirFecha(fecha) {
  if (!fecha) return null;

  const resultado = new Date(`${fecha}T00:00:00.000Z`);

  if (
    Number.isNaN(resultado.getTime()) ||
    resultado.toISOString().slice(0, 10) !== fecha
  ) {
    throw new Error(`Fecha inválida: ${fecha}`);
  }

  return resultado;
}

// Convertir HH:mm a TIME de PostgreSQL
function convertirHora(hora) {
  if (!hora) return null;

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    throw new Error(`Hora inválida: ${hora}`);
  }

  return new Date(`1970-01-01T${hora}:00.000Z`);
}

async function importarReservas() {
  const ruta = join(
    process.cwd(),
    'data',
    'reservas.json'
  );

  const reservas = JSON.parse(
    readFileSync(ruta, 'utf8')
  );

  if (!Array.isArray(reservas)) {
    throw new Error(
      'reservas.json debe contener un arreglo.'
    );
  }

  await prisma.$transaction(async (tx) => {

    // No importar encima de información existente
    const totalReservas = await tx.reservas.count();
    const totalAdicionales =
      await tx.reserva_adicionales.count();

    if (totalReservas > 0 || totalAdicionales > 0) {
      throw new Error(
        'Las tablas ya contienen datos. Importación cancelada.'
      );
    }

    // Consultar los paquetes principales existentes
    const paquetes = await tx.paquetes.findMany();

    for (const reserva of reservas) {

      const paquete = paquetes.find(
        p => p.nombre === reserva.package
      );

      await tx.reservas.create({
        data: {
          id: reserva.id,
          name: reserva.name,
          fecha: convertirFecha(reserva.date),
          hora: convertirHora(reserva.time),
          fecha_fin: convertirFecha(
            reserva.endDate ?? reserva.date
          ),
          hora_fin: convertirHora(reserva.endTime),

          cliente: reserva.client,
          cantidad_invitados: reserva.guests,

          paquete_id: paquete?.id ?? null,
          nombre_paquete: reserva.package,
          precio_paquete: reserva.packagePrice ?? 0,

          estado: reserva.status,

          telefono: reserva.phone ?? null,
          email: reserva.email ?? null,
          mensaje: reserva.message ?? null,

          reserva_adicionales: {
            create: (reserva.adicionales ?? []).map(
              adicional => ({
                categoria: adicional.categoria,
                nombre_paquete: adicional.paquete,
                cantidad: adicional.cantidad ?? null,
                detalle: adicional.detalle ?? null,
                precio: adicional.precio
              })
            )
          }
        }
      });

      console.log(`Reservación ${reserva.id} importada.`);
    }

    // Sincronizar el ID automático de reservas
    if (reservas.length > 0) {
      await tx.$queryRaw`
        SELECT setval(
          pg_get_serial_sequence('public.reservas', 'id'),
          (SELECT MAX(id) FROM public.reservas),
          true
        )
      `;
    }
  });

  const totalReservas = await prisma.reservas.count();
  const totalAdicionales =
    await prisma.reserva_adicionales.count();

  console.log('\nImportación completada.');
  console.log('Reservaciones:', totalReservas);
  console.log('Adicionales reservados:', totalAdicionales);
}

importarReservas()
  .catch(error => {
    console.error('Error al importar:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
