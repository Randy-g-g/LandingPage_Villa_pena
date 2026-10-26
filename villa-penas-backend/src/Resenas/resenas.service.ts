
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';

import { join } from 'path';

import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Resena } from './models/resena.model';

@Injectable()
export class ResenasService {
  private readonly carpetaDatos = join(process.cwd(), 'data');
  private readonly rutaArchivo = join(
    this.carpetaDatos,
    'resenas.json',
  );

  constructor() {
    if (!existsSync(this.carpetaDatos)) {
      mkdirSync(this.carpetaDatos, { recursive: true });
    }

    if (!existsSync(this.rutaArchivo)) {
      writeFileSync(
        this.rutaArchivo,
        JSON.stringify([], null, 2),
        'utf-8',
      );
    }
  }

  private leerResenas(): Resena[] {
    const contenido = readFileSync(this.rutaArchivo, 'utf-8');
    return JSON.parse(contenido) as Resena[];
  }

  private guardarResenas(resenas: Resena[]): void {
    writeFileSync(
      this.rutaArchivo,
      JSON.stringify(resenas, null, 2),
      'utf-8',
    );
  }

  obtenerTodas(): Resena[] {
    return this.leerResenas();
  }

  obtenerPublicadas(): Resena[] {
    return this.leerResenas().filter(
      resena => resena.estado === 'APROBADA',
    );
  }

  obtenerPendientes(): Resena[] {
    return this.leerResenas().filter(
      resena => resena.estado === 'PENDIENTE',
    );
  }

  obtenerRechazadas(): Resena[] {
    return this.leerResenas().filter(
      resena => resena.estado === 'RECHAZADA',
    );
  }

  obtenerPorId(id: number): Resena {
    const resenas = this.leerResenas();

    const resena = resenas.find(
      elemento => elemento.id === id,
    );

    if (!resena) {
      throw new NotFoundException(
        `No existe una reseña con el ID ${id}.`,
      );
    }

    return resena;
  }

  crear(dto: CreateResenaDto): Resena {
    const resenas = this.leerResenas();

    const nuevoId = resenas.length > 0
      ? Math.max(...resenas.map(resena => resena.id)) + 1
      : 1;

    const nuevaResena: Resena = {
      id: nuevoId,
      usuario: dto.usuario.trim(),
      comentario: dto.comentario.trim(),
      calificacion: dto.calificacion,
      estado: 'PENDIENTE',
      fechaCreacion: new Date().toISOString(),
    };

    resenas.push(nuevaResena);
    this.guardarResenas(resenas);

    return nuevaResena;
  }

  actualizarEstado(
    id: number,
    dto: UpdateResenaDto,
  ): Resena {
    const resenas = this.leerResenas();

    const indice = resenas.findIndex(
      elemento => elemento.id === id,
    );

    if (indice === -1) {
      throw new NotFoundException(
        `No existe una reseña con el ID ${id}.`,
      );
    }

    resenas[indice].estado = dto.estado;

    this.guardarResenas(resenas);

    return resenas[indice];
  }

  eliminar(id: number): { mensaje: string } {
    const resenas = this.leerResenas();

    const indice = resenas.findIndex(
      elemento => elemento.id === id,
    );

    if (indice === -1) {
      throw new NotFoundException(
        `No existe una reseña con el ID ${id}.`,
      );
    }

    resenas.splice(indice, 1);
    this.guardarResenas(resenas);

    return {
      mensaje: `La reseña ${id} fue eliminada correctamente.`,
    };
  }
}
