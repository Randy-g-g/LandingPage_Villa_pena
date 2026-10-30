
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Resena } from './models/resena.model';

// Estructura de la reseña almacenada en Neon
type ResenaPrisma = {
  id: number;
  usuario: string;
  comentario: string;
  calificacion: number;
  estado: string;
  fecha_creacion: Date;
};

@Injectable()
export class ResenasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Convertir datos de PostgreSQL al formato del frontend
  private convertirResena(resena: ResenaPrisma): Resena {
    return {
      id: resena.id,
      usuario: resena.usuario,
      comentario: resena.comentario,
      calificacion: resena.calificacion,
      estado: resena.estado as Resena['estado'],
      fechaCreacion: resena.fecha_creacion.toISOString(),
    };
  }

  // Todas las reseñas, sin importar su estado
  async obtenerTodas(): Promise<Resena[]> {
    const resenas = await this.prisma.resenas.findMany({
      orderBy: { id: 'asc' },
    });

    return resenas.map((resena: ResenaPrisma) =>
      this.convertirResena(resena),
    );
  }

  // Solo las reseñas aprobadas (página pública)
  async obtenerPublicadas(): Promise<Resena[]> {
    const resenas = await this.prisma.resenas.findMany({
      where: { estado: 'APROBADA' },
      orderBy: { id: 'asc' },
    });

    return resenas.map((resena: ResenaPrisma) =>
      this.convertirResena(resena),
    );
  }

  // Reseñas pendientes
  async obtenerPendientes(): Promise<Resena[]> {
    const resenas = await this.prisma.resenas.findMany({
      where: { estado: 'PENDIENTE' },
      orderBy: { id: 'asc' },
    });

    return resenas.map((resena: ResenaPrisma) =>
      this.convertirResena(resena),
    );
  }

  // Reseñas rechazadas
  async obtenerRechazadas(): Promise<Resena[]> {
    const resenas = await this.prisma.resenas.findMany({
      where: { estado: 'RECHAZADA' },
      orderBy: { id: 'asc' },
    });

    return resenas.map((resena: ResenaPrisma) =>
      this.convertirResena(resena),
    );
  }

  // Consultar una reseña por ID
  async obtenerPorId(id: number): Promise<Resena> {
    const resena = await this.prisma.resenas.findUnique({
      where: { id },
    });

    if (!resena) {
      throw new NotFoundException(
        `No existe una reseña con el ID ${id}.`,
      );
    }

    return this.convertirResena(resena);
  }

  // Crear reseña con estado pendiente
  async crear(dto: CreateResenaDto): Promise<Resena> {
    const nuevaResena = await this.prisma.resenas.create({
      data: {
        usuario: dto.usuario.trim(),
        comentario: dto.comentario.trim(),
        calificacion: dto.calificacion,
        estado: 'PENDIENTE',
      },
    });

    return this.convertirResena(nuevaResena);
  }

  // Aprobar o rechazar una reseña
  async actualizarEstado(
    id: number,
    dto: UpdateResenaDto,
  ): Promise<Resena> {
    await this.obtenerPorId(id);

    const resena = await this.prisma.resenas.update({
      where: { id },
      data: {
        estado: dto.estado,
      },
    });

    return this.convertirResena(resena);
  }

  // Eliminar definitivamente una reseña
  async eliminar(id: number): Promise<{ mensaje: string }> {
    await this.obtenerPorId(id);

    await this.prisma.resenas.delete({
      where: { id },
    });

    return {
      mensaje: `La reseña ${id} fue eliminada correctamente.`,
    };
  }
}
