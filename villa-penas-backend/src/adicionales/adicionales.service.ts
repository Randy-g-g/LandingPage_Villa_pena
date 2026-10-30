
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  Adicional,
} from './models/adicional.model';

import {
  CreateAdicionalDto,
} from './dto/create-adicional.dto';

import {
  UpdateAdicionalDto,
} from './dto/update-adicional.dto';

// Estructura que devuelve Prisma
type AdicionalPrisma = {
  id: number;
  categoria: string;
  descripcion: string | null;

  paquetes_adicionales: {
    id_local: number;
    nombre: string;
    cantidad: string | null;
    detalle: string | null;
    precio: { toString(): string };
  }[];
};

@Injectable()
export class AdicionalesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Convertir los datos de Neon al formato del frontend
  private convertirAdicional(
    adicional: AdicionalPrisma,
  ): Adicional {

    return {
      id: adicional.id,
      categoria: adicional.categoria,
      descripcion: adicional.descripcion ?? '',

      paquetes: adicional.paquetes_adicionales.map(
        paquete => ({
          id: paquete.id_local,
          nombre: paquete.nombre,
          cantidad: paquete.cantidad ?? '',
          detalle: paquete.detalle ?? '',
          precio: Number(paquete.precio),
        }),
      ),
    };
  }

  // Obtener todas las categorías
  async obtenerTodos(): Promise<Adicional[]> {

    const adicionales = await this.prisma.adicionales.findMany({
      include: {
        paquetes_adicionales: {
          orderBy: { id_local: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    return adicionales.map(
      (adicional: AdicionalPrisma) =>
        this.convertirAdicional(adicional),
    );
  }

  // Obtener una categoría por ID
  async obtenerUno(id: number): Promise<Adicional> {

    const adicional = await this.prisma.adicionales.findUnique({
      where: { id },
      include: {
        paquetes_adicionales: {
          orderBy: { id_local: 'asc' },
        },
      },
    });

    if (!adicional) {
      throw new NotFoundException(
        `No se encontró el adicional con ID ${id}`,
      );
    }

    return this.convertirAdicional(adicional);
  }

  // Crear categoría con sus paquetes
  async crear(
    dto: CreateAdicionalDto,
  ): Promise<Adicional> {

    const existe = await this.prisma.adicionales.findUnique({
      where: { id: dto.id },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un adicional con ID ${dto.id}`,
      );
    }

    const ids = dto.paquetes.map(p => p.id);

    if (new Set(ids).size !== ids.length) {
      throw new ConflictException(
        'Los ID de los paquetes no pueden repetirse dentro de la misma categoría.',
      );
    }

    const adicional = await this.prisma.adicionales.create({
      data: {
        id: dto.id,
        categoria: dto.categoria,
        descripcion: dto.descripcion,

        paquetes_adicionales: {
          create: dto.paquetes.map(paquete => ({
            id_local: paquete.id,
            nombre: paquete.nombre,
            cantidad: paquete.cantidad,
            detalle: paquete.detalle,
            precio: paquete.precio,
          })),
        },
      },
    });

    return this.obtenerUno(adicional.id);
  }

  // Actualizar categoría y sus paquetes
  async actualizar(
    id: number,
    dto: UpdateAdicionalDto,
  ): Promise<Adicional> {

    await this.obtenerUno(id);

    if (dto.paquetes !== undefined) {
      const ids = dto.paquetes.map(p => p.id);

      if (new Set(ids).size !== ids.length) {
        throw new ConflictException(
          'Los ID de los paquetes no pueden repetirse dentro de la misma categoría.',
        );
      }
    }

    await this.prisma.adicionales.update({
      where: { id },

      data: {
        ...(dto.categoria !== undefined && {
          categoria: dto.categoria,
        }),

        ...(dto.descripcion !== undefined && {
          descripcion: dto.descripcion,
        }),

        ...(dto.paquetes !== undefined && {
          paquetes_adicionales: {
            deleteMany: {},

            create: dto.paquetes.map(paquete => ({
              id_local: paquete.id,
              nombre: paquete.nombre,
              cantidad: paquete.cantidad,
              detalle: paquete.detalle,
              precio: paquete.precio,
            })),
          },
        }),
      },
    });

    return this.obtenerUno(id);
  }

  // Eliminar categoría y sus paquetes
  async eliminar(id: number): Promise<Adicional> {

    const adicional = await this.obtenerUno(id);

    await this.prisma.adicionales.delete({
      where: { id },
    });

    return adicional;
  }
}
