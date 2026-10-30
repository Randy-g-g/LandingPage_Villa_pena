
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

import { PrismaService } from '../prisma/prisma.service';

import type { Express } from 'express';
import type { Foto } from './models/foto.model';

@Injectable()
export class GaleriaService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Carpeta donde se almacenan las imágenes WebP
  private readonly carpeta = join(
    process.cwd(),
    'uploads',
    'galeria',
  );

  // Convertir registro de Neon al formato del frontend
  private convertirFoto(foto: {
    id: string;
    src: string;
    descripcion: string | null;
  }): Foto {
    return {
      id: foto.id,
      src: foto.src,
      descripcion: foto.descripcion ?? '',
    };
  }

  // Eliminar únicamente archivos administrados por la galería
  private async eliminarArchivo(src: string): Promise<void> {
    const patron = /^\/uploads\/galeria\/([0-9a-f-]{36})\.webp$/i;
    const coincidencia = src.match(patron);

    if (!coincidencia) {
      return;
    }

    const nombre = `${coincidencia[1]}.webp`;

    await fs.rm(
      join(this.carpeta, nombre),
      { force: true },
    );
  }

  // GET /galeria
  async obtenerTodas(): Promise<Foto[]> {
    const fotos = await this.prisma.galeria.findMany({
      orderBy: { id: 'asc' },
    });

    return fotos.map(
      (foto: { id: string; src: string; descripcion: string | null }) =>
    this.convertirFoto(foto),
    );
  }

  // GET /galeria/:id
  async obtenerUna(id: string): Promise<Foto> {
    const foto = await this.prisma.galeria.findUnique({
      where: { id },
    });

    if (!foto) {
      throw new NotFoundException(
        'Fotografía no encontrada',
      );
    }

    return this.convertirFoto(foto);
  }

  // POST /galeria
  async subirFoto(
    archivo: Express.Multer.File,
    descripcion: string,
  ): Promise<Foto> {

    if (!archivo?.buffer) {
      throw new BadRequestException(
        'No se recibió correctamente la imagen',
      );
    }

    await fs.mkdir(this.carpeta, {
      recursive: true,
    });

    const id = randomUUID();
    const nombre = `${id}.webp`;
    const destino = join(this.carpeta, nombre);

    try {
      await sharp(archivo.buffer)
        .rotate()
        .resize({
          width: 1200,
          withoutEnlargement: true,
        })
        .webp({ quality: 78 })
        .toFile(destino);

    } catch {
      await fs.rm(destino, { force: true });

      throw new BadRequestException(
        'No se pudo procesar la imagen',
      );
    }

    const src = `/uploads/galeria/${nombre}`;

    // Guardar el registro en PostgreSQL
    try {
      const foto = await this.prisma.galeria.create({
        data: {
          id,
          src,
          descripcion: descripcion.trim(),
        },
      });

      return this.convertirFoto(foto);

    } catch (error) {
      // Si Neon falla, no dejar un archivo sin registrar
      await fs.rm(destino, { force: true });
      throw error;
    }
  }

  // PATCH /galeria/:id
  async actualizarFoto(
    id: string,
    descripcion?: string,
    archivo?: Express.Multer.File,
  ): Promise<Foto> {

    const fotoActual = await this.obtenerUna(id);

    if (descripcion !== undefined) {
      if (descripcion.trim().length === 0) {
        throw new BadRequestException(
          'La descripción no puede estar vacía',
        );
      }
    }

    if (!archivo && descripcion === undefined) {
      throw new BadRequestException(
        'Debés proporcionar una descripción o una imagen',
      );
    }

    let nuevaRuta: string | undefined;

    // Crear la imagen nueva antes de actualizar Neon
    if (archivo) {
      if (!archivo.buffer) {
        throw new BadRequestException(
          'No se recibió correctamente la imagen',
        );
      }

      await fs.mkdir(this.carpeta, {
        recursive: true,
      });

      const nombre = `${randomUUID()}.webp`;
      const destino = join(this.carpeta, nombre);

      try {
        await sharp(archivo.buffer)
          .rotate()
          .resize({
            width: 1200,
            withoutEnlargement: true,
          })
          .webp({ quality: 78 })
          .toFile(destino);

        nuevaRuta = `/uploads/galeria/${nombre}`;

      } catch {
        await fs.rm(destino, { force: true });

        throw new BadRequestException(
          'No se pudo procesar la nueva imagen',
        );
      }
    }

    // Actualizar la información en PostgreSQL
    let fotoActualizada;

    try {
      fotoActualizada = await this.prisma.galeria.update({
        where: { id },
        data: {
          ...(descripcion !== undefined && {
            descripcion: descripcion.trim(),
          }),

          ...(nuevaRuta !== undefined && {
            src: nuevaRuta,
          }),
        },
      });

    } catch (error) {
      // Si Neon falla, conservar la fotografía anterior
      if (nuevaRuta) {
        try {
          await this.eliminarArchivo(nuevaRuta);
        } catch (limpiezaError) {
          console.error(
            'No se pudo limpiar la imagen nueva:',
            limpiezaError,
          );
        }
      }

      throw error;
    }

    // Eliminar la imagen anterior solo después de actualizar Neon
    if (nuevaRuta && fotoActual.src !== nuevaRuta) {
      try {
        await this.eliminarArchivo(fotoActual.src);
      } catch (error) {
        console.error(
          'No se pudo eliminar la imagen anterior:',
          error,
        );
      }
    }

    return this.convertirFoto(fotoActualizada);
  }

  // DELETE /galeria/:id
  async eliminarFoto(
    id: string,
  ): Promise<{ mensaje: string }> {

    const foto = await this.obtenerUna(id);

    // Primero eliminar el registro de PostgreSQL
    await this.prisma.galeria.delete({
      where: { id },
    });

    // Después eliminar la imagen física
    try {
      await this.eliminarArchivo(foto.src);
    } catch (error) {
      console.error(
        'No se pudo eliminar el archivo de imagen:',
        error,
      );
    }

    return {
      mensaje: 'Fotografía eliminada correctamente',
    };
  }
}
