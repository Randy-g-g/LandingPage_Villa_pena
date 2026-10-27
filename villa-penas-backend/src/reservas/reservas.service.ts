import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import { Reserva } from './models/reserva.model';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {

  // configuracion del json

  private readonly archivo = join(
    process.cwd(),
    'data',
    'reservas.json',
  );

  // duración de cada actividad: 8 horas
  private readonly DURACION = 8 * 60;

  // horario de atención: 6:00 AM a 6:00 PM
  private readonly APERTURA = 6 * 60;
  private readonly CIERRE = 18 * 60;

  // evitar operaciones simultáneas sobre el JSON
  private cola: Promise<void> = Promise.resolve();

  private ejecutarEnOrden<T>(
    operacion: () => Promise<T>,
  ): Promise<T> {

    const resultado = this.cola.then(operacion);

    this.cola = resultado.then(
      () => undefined,
      () => undefined,
    );

    return resultado;
  }

  // leer las reservas

  private async leerReservas(): Promise<Reserva[]> {

    try {
      const contenido = await fs.readFile(
        this.archivo,
        'utf8',
      );

      const reservas: unknown = JSON.parse(contenido);

      if (!Array.isArray(reservas)) {
        throw new Error(
          'El archivo reservas.json debe contener un arreglo',
        );
      }

      return reservas as Reserva[];

    } catch (error) {

      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return [];
      }

      throw error;
    }
  }

  // guardar las reservas

  private async guardarReservas(
    reservas: Reserva[],
  ): Promise<void> {

    await fs.mkdir(
      join(process.cwd(), 'data'),
      { recursive: true },
    );

    const archivoTemporal = `${this.archivo}.tmp`;

    await fs.writeFile(
      archivoTemporal,
      JSON.stringify(reservas, null, 2),
      'utf8',
    );

    await fs.rename(
      archivoTemporal,
      this.archivo,
    );
  }

  // horas y minutos totales

  private convertirAMinutos(hora: string): number {

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      throw new BadRequestException(
        'La hora debe tener el formato HH:mm',
      );
    }

    const [horas, minutos] = hora.split(':').map(Number);

    return horas * 60 + minutos;
  }

  // convertir minutos a hora en formato HH:mm

  private convertirAHora(minutos: number): string {

    const horas = Math.floor(minutos / 60) % 24;
    const minutosRestantes = minutos % 60;

    return (
      String(horas).padStart(2, '0') +
      ':' +
      String(minutosRestantes).padStart(2, '0')
    );
  }

  // validar fecha 

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

  // calcular las 8 horas

  private calcularHorario(
    fecha: string,
    horaInicio: string,
  ): {
    endTime: string;
    endDate: string;
  } {

    this.validarFecha(fecha);

    const inicio = this.convertirAMinutos(horaInicio);

    // sumar automáticamente las 8 horas
    const final = inicio + this.DURACION;

    // validar horario de atención
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

  // una por dia

  private comprobarDisponibilidad(
    reservas: Reserva[],
    nuevaReserva: Reserva,
  ): void {

    // las solicitudes pendientes no bloquean
    // definitivamente una fecha
    if (nuevaReserva.status === 'pendiente') {
      return;
    }

    const conflicto = reservas.some((reserva) => {

      // ignorar la misma reserva durante una edición
      if (reserva.id === nuevaReserva.id) {
        return false;
      }

      // las fechas diferentes no generan conflicto
      if (reserva.date !== nuevaReserva.date) {
        return false;
      }

      // una solicitud pendiente no ocupa el día
      if (reserva.status === 'pendiente') {
        return false;
      }

      // confirmada o bloqueada ocupa todo el día
      return (
        reserva.status === 'confirmada' ||
        reserva.status === 'bloqueada'
      );
    });

    if (conflicto) {
      throw new ConflictException(
        'La fecha seleccionada ya tiene una actividad confirmada o se encuentra bloqueada.',
      );
    }
  }

  // GET all reservas

  async findAll(): Promise<Reserva[]> {

    return this.leerReservas();
  }

  // GET by id reservas

  async findOne(id: number): Promise<Reserva> {

    const reservas = await this.leerReservas();

    const reserva = reservas.find(
      (item) => item.id === id,
    );

    if (!reserva) {
      throw new NotFoundException(
        `No se encontró la reservación con ID ${id}`,
      );
    }

    return reserva;
  }

  // create reservas

  async create(
    dto: CreateReservaDto,
  ): Promise<Reserva> {

    return this.ejecutarEnOrden(async () => {

      const reservas = await this.leerReservas();

      // calcular hora de salida automáticamente
      const horario = this.calcularHorario(
        dto.date,
        dto.time,
      );

      // generar ID automáticamente
      const siguienteId = Math.max(
        0,
        ...reservas.map((reserva) => reserva.id),
      ) + 1;

      const nuevaReserva: Reserva = {
    id: siguienteId,
    name: dto.name,
    date: dto.date,
    time: dto.time,
    endTime: horario.endTime,
    endDate: horario.endDate,
    client: dto.client,
    guests: dto.guests,
    package: dto.package,
    packagePrice: dto.packagePrice,
    status: dto.status,

    // Información adicional del cliente
    phone: dto.phone,
    email: dto.email,
    message: dto.message,
    adicionales: dto.adicionales ?? [],
};

      // comprobar disponibilidad
      this.comprobarDisponibilidad(
        reservas,
        nuevaReserva,
      );

      // agregar al arreglo
      reservas.push(nuevaReserva);

      // guardar en JSON
      await this.guardarReservas(reservas);

      return nuevaReserva;
    });
  }

  // update reservas

  async update(
    id: number,
    dto: UpdateReservaDto,
  ): Promise<Reserva> {

    return this.ejecutarEnOrden(async () => {

      const reservas = await this.leerReservas();

      const indice = reservas.findIndex(
        (reserva) => reserva.id === id,
      );

      if (indice === -1) {
        throw new NotFoundException(
          `No se encontró la reservación con ID ${id}`,
        );
      }

      // copiar datos existentes y aplicar cambios
      const reservaActualizada: Reserva = {
        ...reservas[indice],
        ...dto,
      };

      // recalcular las 8 horas si cambia la entrada
      const horario = this.calcularHorario(
        reservaActualizada.date,
        reservaActualizada.time,
      );

      reservaActualizada.endTime = horario.endTime;
      reservaActualizada.endDate = horario.endDate;

      // evitar confirmar dos actividades el mismo día
      this.comprobarDisponibilidad(
        reservas,
        reservaActualizada,
      );

      // reemplazar registro en el arreglo
      reservas[indice] = reservaActualizada;

      // guardar los cambios
      await this.guardarReservas(reservas);

      return reservaActualizada;
    });
  }

  // delete reservas

  async remove(id: number): Promise<Reserva> {

    return this.ejecutarEnOrden(async () => {

      const reservas = await this.leerReservas();

      const reserva = reservas.find(
        (item) => item.id === id,
      );

      if (!reserva) {
        throw new NotFoundException(
          `No se encontró la reservación con ID ${id}`,
        );
      }

      // eliminar del arreglo
      const reservasActualizadas = reservas.filter(
        (item) => item.id !== id,
      );

      // guardar arreglo actualizado
      await this.guardarReservas(reservasActualizadas);

      return reserva;
    });
  }
}
