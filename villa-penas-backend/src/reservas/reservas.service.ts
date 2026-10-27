
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Reserva } from './models/reserva.model';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  private reservas: Reserva[] = [];
  private siguienteId = 1;

  findAll(): Reserva[] {
    return this.reservas;
  }

  findOne(id: number): Reserva {
    const reserva = this.reservas.find(
      (reserva) => reserva.id === id,
    );

    if (!reserva) {
      throw new NotFoundException(
        `No se encontró la reserva con ID ${id}`,
      );
    }

    return reserva;
  }

  create(dto: CreateReservaDto): Reserva {
    const nuevaReserva: Reserva = {
      id: this.siguienteId++,
      ...dto,
    };

    this.reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  update(
    id: number,
    dto: UpdateReservaDto,
  ): Reserva {
    const reserva = this.findOne(id);

    Object.assign(reserva, dto);

    return reserva;
  }

  remove(id: number): Reserva {
    const reserva = this.findOne(id);

    this.reservas = this.reservas.filter(
      (item) => item.id !== id,
    );

    return reserva;
  }
}
