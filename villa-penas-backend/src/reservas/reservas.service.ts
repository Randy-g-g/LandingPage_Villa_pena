
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Reserva } from './models/reserva.model';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

// Tipo de resultado de PostgreSQL con sus adicionales
type ReservaPrisma = {
  id: number;
  name: string;
  fecha: Date;
  hora: Date;
  fecha_fin: Date | null;
  hora_fin: Date | null;
  cliente: string;
  cantidad_invitados: number;
  nombre_paquete: string;
  precio_paquete: { toString(): string };
  estado: string;
  telefono: string | null;
  email: string | null;
  mensaje: string | null;
  reserva_adicionales: {
    categoria: string;
    nombre_paquete: string;
    cantidad: string | null;
    detalle: string | null;
    precio: { toString(): string };
  }[];
};

@Injectable()
export class ReservasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly DURACION = 8 * 60;
  private readonly APERTURA = 6 * 60;
  private readonly CIERRE = 18 * 60;

  // Convertir HH:mm a minutos
  private convertirAMinutos(hora: string): number {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      throw new BadRequestException(
        'La hora debe tener el formato HH:mm',
      );
    }

    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  // Convertir minutos a HH:mm
  private convertirAHora(minutos: number): string {
    const horas = Math.floor(minutos / 60) % 24;
    const restantes = minutos % 60;

    return (
      String(horas).padStart(2, '0') +
      ':' +
      String(restantes).padStart(2, '0')
    );
  }

  // Comprobar fecha real
  private validarFecha(fecha: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new BadRequestException(
        'La fecha debe tener el formato YYYY-MM-DD',
      );
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);

    const comprobacion = new Date(
      Date.UTC(anio, mes - 1, dia),
    );

    if (
      comprobacion.getUTCFullYear() !== anio ||
      comprobacion.getUTCMonth() !== mes - 1 ||
      comprobacion.getUTCDate() !== dia
    ) {
      throw new BadRequestException(
        'La fecha seleccionada no existe',
      );
    }
  }

  // Horario fijo de ocho horas
  private calcularHorario(
    fecha: string,
    horaInicio: string,
  ): { endTime: string; endDate: string } {
    this.validarFecha(fecha);

    const inicio = this.convertirAMinutos(horaInicio);
    const final = inicio + this.DURACION;

    if (
      inicio < this.APERTURA ||
      final > this.CIERRE
    ) {
      throw new BadRequestException(
        'La actividad debe realizarse entre las 6:00 AM y las 6:00 PM, con una duración de 8 horas.',
      );
    }

    return {
      endTime: this.convertirAHora(final),
      endDate: fecha,
    };
  }

  // Convertir YYYY-MM-DD a PostgreSQL DATE
  private convertirFecha(fecha: string): Date {
    this.validarFecha(fecha);

    return new Date(`${fecha}T00:00:00.000Z`);
  }

  // Convertir HH:mm a PostgreSQL TIME
  private convertirHora(hora: string): Date {
    this.convertirAMinutos(hora);

    return new Date(`1970-01-01T${hora}:00.000Z`);
  }

  // Recuperar fecha sin desfases de zona horaria
  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().slice(0, 10);
  }

  // Recuperar hora en formato HH:mm
  private formatearHora(hora: Date): string {
    return hora.toISOString().slice(11, 16);
  }

  // Convertir los datos de Neon al formato del frontend
  private convertirReserva(
    reserva: ReservaPrisma,
  ): Reserva {
    return {
      id: reserva.id,
      name: reserva.name,
      date: this.formatearFecha(reserva.fecha),
      time: this.formatearHora(reserva.hora),

      endDate: this.formatearFecha(
        reserva.fecha_fin ?? reserva.fecha,
      ),

      endTime: reserva.hora_fin
        ? this.formatearHora(reserva.hora_fin)
        : '',

      client: reserva.cliente,
      guests: reserva.cantidad_invitados,
      package: reserva.nombre_paquete,
      packagePrice: Number(reserva.precio_paquete),

      status: reserva.estado as Reserva['status'],

      phone: reserva.telefono ?? undefined,
      email: reserva.email ?? undefined,
      message: reserva.mensaje ?? undefined,

      adicionales: reserva.reserva_adicionales.map(
        adicional => ({
          categoria: adicional.categoria,
          paquete: adicional.nombre_paquete,
          cantidad: adicional.cantidad ?? '',
          detalle: adicional.detalle ?? '',
          precio: Number(adicional.precio),
        }),
      ),
    };
  }

  // Traducir conflictos de PostgreSQL a HTTP 409
  private manejarError(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'La fecha seleccionada ya tiene una actividad confirmada o se encuentra bloqueada.',
      );
    }

    throw error;
  }

  // GET /reservas
  async findAll(): Promise<Reserva[]> {
    const reservas = await this.prisma.reservas.findMany({
      include: {
        reserva_adicionales: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

      return reservas.map((reserva: ReservaPrisma) =>
    this.convertirReserva(reserva),
  );
  }

  // GET /reservas/:id
  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.prisma.reservas.findUnique({
      where: { id },
      include: {
        reserva_adicionales: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!reserva) {
      throw new NotFoundException(
        `No se encontró la reservación con ID ${id}`,
      );
    }

    return this.convertirReserva(reserva);
  }

  // POST /reservas

async create(dto: CreateReservaDto): Promise<Reserva> {
  const horario = this.calcularHorario(
    dto.date,
    dto.time,
  );

  // Buscar el paquete principal en Neon
  const paquete = await this.prisma.paquetes.findFirst({
    where: {
      nombre: dto.package,
    },
  });

  // Los bloqueos administrativos pueden no tener paquete
  const esBloqueo = dto.status === 'bloqueada';

  if (!paquete && !esBloqueo) {
    throw new BadRequestException(
      'El paquete seleccionado no existe.',
    );
  }

  // Precio oficial del paquete principal
  const precioPaquete = paquete
    ? Number(paquete.precio)
    : 0;

  // Consultar las categorías y paquetes adicionales
  const catalogoAdicionales =
    await this.prisma.adicionales.findMany({
      include: {
        paquetes_adicionales: true,
      },
    });

  // Construir los adicionales con precios oficiales
  const adicionalesValidados = (dto.adicionales ?? []).map(
    (adicional) => {

      const categoria = catalogoAdicionales.find(
        (item) => item.categoria === adicional.categoria,
      );

      if (!categoria) {
        throw new BadRequestException(
          `No existe el adicional: ${adicional.categoria}`,
        );
      }

      const paqueteAdicional =
        categoria.paquetes_adicionales.find(
          (item) => item.nombre === adicional.paquete,
        );

      if (!paqueteAdicional) {
        throw new BadRequestException(
          `No existe el paquete adicional: ${adicional.paquete}`,
        );
      }

      return {
        categoria: categoria.categoria,
        nombre_paquete: paqueteAdicional.nombre,
        cantidad: paqueteAdicional.cantidad,
        detalle: paqueteAdicional.detalle,

        // Precio obtenido directamente desde Neon
        precio: Number(paqueteAdicional.precio),
      };
    },
  );

  try {
    const nuevaReserva = await this.prisma.reservas.create({
      data: {
        name: dto.name,
        fecha: this.convertirFecha(dto.date),
        hora: this.convertirHora(dto.time),

        fecha_fin: this.convertirFecha(horario.endDate),
        hora_fin: this.convertirHora(horario.endTime),

        cliente: dto.client,
        cantidad_invitados: dto.guests,

        paquete_id: paquete?.id ?? null,
        nombre_paquete: dto.package,

        // Precio oficial del paquete
        precio_paquete: precioPaquete,

        estado: dto.status,

        telefono: dto.phone ?? null,
        email: dto.email ?? null,
        mensaje: dto.message ?? null,

        reserva_adicionales: {
          create: adicionalesValidados,
        },
      },
    });

    return this.findOne(nuevaReserva.id);

  } catch (error) {
    this.manejarError(error);
  }
}

  // PATCH /reservas/:id

async update(
  id: number,
  dto: UpdateReservaDto,
): Promise<Reserva> {
  const actual = await this.findOne(id);

  const fecha = dto.date ?? actual.date;
  const hora = dto.time ?? actual.time;

  const horario = this.calcularHorario(fecha, hora);

  const nombrePaquete = dto.package ?? actual.package;
  const estado = dto.status ?? actual.status;

  // Consultar el paquete principal en Neon
  const paquete = await this.prisma.paquetes.findFirst({
    where: { nombre: nombrePaquete },
  });

  const esBloqueo = estado === 'bloqueada';

  if (!paquete && !esBloqueo) {
    throw new BadRequestException(
      'El paquete seleccionado no existe.',
    );
  }

  const precioPaquete = paquete
    ? Number(paquete.precio)
    : 0;

  // Solo validar adicionales cuando se envían en la edición
  let adicionalesValidados;

  if (dto.adicionales !== undefined) {
    const catalogoAdicionales =
      await this.prisma.adicionales.findMany({
        include: {
          paquetes_adicionales: true,
        },
      });

    adicionalesValidados = dto.adicionales.map((adicional) => {
      const categoria = catalogoAdicionales.find(
        (item) => item.categoria === adicional.categoria,
      );

      if (!categoria) {
        throw new BadRequestException(
          `No existe el adicional: ${adicional.categoria}`,
        );
      }

      const paqueteAdicional =
        categoria.paquetes_adicionales.find(
          (item) => item.nombre === adicional.paquete,
        );

      if (!paqueteAdicional) {
        throw new BadRequestException(
          `No existe el paquete adicional: ${adicional.paquete}`,
        );
      }

      return {
        categoria: categoria.categoria,
        nombre_paquete: paqueteAdicional.nombre,
        cantidad: paqueteAdicional.cantidad,
        detalle: paqueteAdicional.detalle,
        precio: Number(paqueteAdicional.precio),
      };
    });
  }

  try {
    await this.prisma.reservas.update({
      where: { id },

      data: {
        name: dto.name ?? actual.name,
        fecha: this.convertirFecha(fecha),
        hora: this.convertirHora(hora),

        fecha_fin: this.convertirFecha(horario.endDate),
        hora_fin: this.convertirHora(horario.endTime),

        cliente: dto.client ?? actual.client,
        cantidad_invitados: dto.guests ?? actual.guests,

        paquete_id: paquete?.id ?? null,
        nombre_paquete: nombrePaquete,
        precio_paquete:
        dto.package !== undefined
        ? precioPaquete
        : actual.packagePrice ?? 0,

        estado,

        ...(dto.phone !== undefined && {
          telefono: dto.phone,
        }),

        ...(dto.email !== undefined && {
          email: dto.email,
        }),

        ...(dto.message !== undefined && {
          mensaje: dto.message,
        }),

        ...(adicionalesValidados !== undefined && {
          reserva_adicionales: {
            deleteMany: {},
            create: adicionalesValidados,
          },
        }),
      },
    });

    return this.findOne(id);

  } catch (error) {
    this.manejarError(error);
  }
}


  // DELETE /reservas/:id
  async remove(id: number): Promise<Reserva> {
    const reserva = await this.findOne(id);

    await this.prisma.reservas.delete({
      where: { id },
    });

    return reserva;
  }
}
