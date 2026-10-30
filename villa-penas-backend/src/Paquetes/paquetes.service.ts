
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';


import {
  Paquete,
} from './models/paquete.model';

import {
  CreatePaqueteDto,
} from './dto/create-paquete.dto';

import {
  UpdatePaqueteDto,
} from './dto/update-paquete.dto';

type PaquetePrisma = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: { toString(): string };
  activo: boolean;

  servicios_paquete: {
    nombre: string;
  }[];

  detalles_paquete: {
    nombre: string;
    descripcion: string | null;
  }[];
};

@Injectable()
export class PaquetesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Convertir el resultado de PostgreSQL al formato del frontend
  private convertirPaquete(paquete: PaquetePrisma): Paquete {
    return {
      id: paquete.id,
      nombre: paquete.nombre,
      descripcion: paquete.descripcion ?? '',
      precio: Number(paquete.precio),
      activo: paquete.activo,
      servicios: paquete.servicios_paquete.map(
        (servicio: { nombre: string }) => servicio.nombre,
      ),
      detalles: paquete.detalles_paquete.map(
        (detalle: {
          nombre: string;
          descripcion: string | null;
        }) => ({
          nombre: detalle.nombre,
          descripcion: detalle.descripcion ?? '',
        }),
      ),
    };
  }

  // Obtener todos los paquetes
  async obtenerTodos(): Promise<Paquete[]> {
    const paquetes = await this.prisma.paquetes.findMany({
      include: {
        servicios_paquete: {
          orderBy: { id: 'asc' },
        },
        detalles_paquete: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    return paquetes.map(
  (paquete: PaquetePrisma) =>
    this.convertirPaquete(paquete),
);
  }

  // Obtener un paquete por ID
  async obtenerUno(id: number): Promise<Paquete> {
    const paquete = await this.prisma.paquetes.findUnique({
      where: { id },
      include: {
        servicios_paquete: {
          orderBy: { id: 'asc' },
        },
        detalles_paquete: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!paquete) {
      throw new NotFoundException(
        `No se encontró el paquete con ID ${id}`,
      );
    }

    return this.convertirPaquete(paquete);
  }

  // Crear un paquete
  async crear(dto: CreatePaqueteDto): Promise<Paquete> {
    const paquete = await this.prisma.paquetes.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio: dto.precio,
        activo: dto.activo,
        servicios_paquete: {
          create: dto.servicios.map(nombre => ({
            nombre,
          })),
        },
        detalles_paquete: {
          create: dto.detalles.map(detalle => ({
            nombre: detalle.nombre,
            descripcion: detalle.descripcion,
          })),
        },
      },
    });

    return this.obtenerUno(paquete.id);
  }

  // Actualizar un paquete
  async actualizar(
    id: number,
    dto: UpdatePaqueteDto,
  ): Promise<Paquete> {
    await this.obtenerUno(id);

    await this.prisma.paquetes.update({
      where: { id },
      data: {
        ...(dto.nombre !== undefined && {
          nombre: dto.nombre,
        }),
        ...(dto.descripcion !== undefined && {
          descripcion: dto.descripcion,
        }),
        ...(dto.precio !== undefined && {
          precio: dto.precio,
        }),
        ...(dto.activo !== undefined && {
          activo: dto.activo,
        }),

        ...(dto.servicios !== undefined && {
          servicios_paquete: {
            deleteMany: {},
            create: dto.servicios.map(nombre => ({
              nombre,
            })),
          },
        }),

        ...(dto.detalles !== undefined && {
          detalles_paquete: {
            deleteMany: {},
            create: dto.detalles.map(detalle => ({
              nombre: detalle.nombre,
              descripcion: detalle.descripcion,
            })),
          },
        }),
      },
    });

    return this.obtenerUno(id);
  }

  // Eliminar un paquete
  async eliminar(id: number): Promise<Paquete> {
    const paquete = await this.obtenerUno(id);

    await this.prisma.paquetes.delete({
      where: { id },
    });

    return paquete;
  }
}
