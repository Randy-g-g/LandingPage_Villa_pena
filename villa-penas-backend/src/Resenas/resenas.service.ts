import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Resena } from './models/resena.model';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';

@Injectable()
export class ResenasService {
  
  private resenas: Resena[] = [
  {
    id: 1,
    usuario: 'María González',
    comentario: 'Un lugar hermoso para celebrar eventos familiares.',
    calificacion: 5,
    estado: 'APROBADA',
    fechaCreacion: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 2,
    usuario: 'Carlos Rodríguez',
    comentario: 'Las instalaciones son bonitas y la atención excelente.',
    calificacion: 5,
    estado: 'PENDIENTE',
    fechaCreacion: '2026-10-21T14:30:00.000Z',
  },
  {
    id: 3,
    usuario: 'Ana López',
    comentario: 'Un buen lugar para compartir con amigos.',
    calificacion: 4,
    estado: 'RECHAZADA',
    fechaCreacion: '2026-10-22T09:15:00.000Z',
  },
  {
    id: 4,
    usuario: 'José Vargas',
    comentario: 'Muy bonito el espacio y todo estaba limpio.',
    calificacion: 5,
    estado: 'APROBADA',
    fechaCreacion: '2026-10-23T16:00:00.000Z',
  },
];
obtenerPorId(id: number): Resena {
  const resena = this.resenas.find(
    elemento => elemento.id === id,
  );

  if (!resena) {
    throw new NotFoundException(
      `No existe una reseña con el ID ${id}.`,
    );
  }

  return resena;
}

  obtenerPublicadas(): Resena[] {
    return this.resenas.filter(
      resena => resena.estado === 'APROBADA',
    );
  }

  obtenerPendientes(): Resena[] {
    return this.resenas.filter(
      resena => resena.estado === 'PENDIENTE',
    );
  }

  crear(dto: CreateResenaDto): Resena {
    const nuevoId =
      this.resenas.length > 0
        ? Math.max(...this.resenas.map(r => r.id)) + 1
        : 1;

    const nuevaResena: Resena = {
      id: nuevoId,
      usuario: dto.usuario.trim(),
      comentario: dto.comentario.trim(),
      calificacion: dto.calificacion,
      estado: 'PENDIENTE',
      fechaCreacion: new Date().toISOString(),
    };

    this.resenas.push(nuevaResena);

    return nuevaResena;
  }

  actualizarEstado(
    id: number,
    dto: UpdateResenaDto,
  ): Resena {
    const resena = this.resenas.find(
      elemento => elemento.id === id,
    );

    if (!resena) {
      throw new NotFoundException(
        `No existe una reseña con el ID ${id}.`,
      );
    }

    resena.estado = dto.estado;

    return resena;
  }

  eliminar(id: number): { mensaje: string } {
    const indice = this.resenas.findIndex(
      elemento => elemento.id === id,
    );

    if (indice === -1) {
      throw new NotFoundException(
        `No existe una reseña con el ID ${id}.`,
      );
    }

    this.resenas.splice(indice, 1);

    return {
      mensaje: `La reseña ${id} fue eliminada correctamente.`,
    };
  }
}