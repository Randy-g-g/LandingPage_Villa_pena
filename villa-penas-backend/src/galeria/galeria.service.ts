
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

import type { Express } from 'express';
import type { Foto } from './models/foto.model';

@Injectable()
export class GaleriaService {
  private readonly carpeta = join(
    process.cwd(),
    'uploads',
    'galeria',
  );

  private readonly archivoDatos = join(
    this.carpeta,
    'fotos.json',
  );

  // Leer fotografías
  private async leerFotos(): Promise<Foto[]> {
    await fs.mkdir(this.carpeta, { recursive: true });

    try {
      const contenido = await fs.readFile(
        this.archivoDatos,
        'utf8',
      );

      return JSON.parse(contenido) as Foto[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  // Guardar información
  private async guardarFotos(fotos: Foto[]): Promise<void> {
    await fs.writeFile(
      this.archivoDatos,
      JSON.stringify(fotos, null, 2),
      'utf8',
    );
  }

  // Obtener todas las fotografías
  async obtenerTodas(): Promise<Foto[]> {
    return this.leerFotos();
  }

  // Obtener una fotografía
  async obtenerUna(id: string): Promise<Foto> {
    const fotos = await this.leerFotos();
    const foto = fotos.find((f) => f.id === id);

    if (!foto) {
      throw new NotFoundException('Fotografía no encontrada');
    }

    return foto;
  }

  // Subir y optimizar fotografía
  async subirFoto(
    archivo: Express.Multer.File,
    descripcion: string,
  ): Promise<Foto> {
    await fs.mkdir(this.carpeta, { recursive: true });

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
      throw new BadRequestException(
        'No se pudo procesar la imagen',
      );
    }

    const nuevaFoto: Foto = {
      id,
      src: `/uploads/galeria/${nombre}`,
      descripcion,
    };

    try {
      const fotos = await this.leerFotos();
      fotos.push(nuevaFoto);
      await this.guardarFotos(fotos);
    } catch (error) {
      await fs.rm(destino, { force: true });
      throw error;
    }

    return nuevaFoto;
  }

  // Actualizar descripción
  async actualizarFoto(
    id: string,
    descripcion: string,
  ): Promise<Foto> {
    const fotos = await this.leerFotos();
    const foto = fotos.find((f) => f.id === id);

    if (!foto) {
      throw new NotFoundException('Fotografía no encontrada');
    }

    foto.descripcion = descripcion;
    await this.guardarFotos(fotos);

    return foto;
  }

  // Eliminar fotografía
  async eliminarFoto(id: string): Promise<void> {
    const fotos = await this.leerFotos();
    const foto = fotos.find((f) => f.id === id);

    if (!foto) {
      throw new NotFoundException('Fotografía no encontrada');
    }

    const restantes = fotos.filter((f) => f.id !== id);

    await this.guardarFotos(restantes);

    const nombre = foto.src.split('/').pop();

    if (nombre) {
      await fs.rm(join(this.carpeta, nombre), {
        force: true,
      });
    }
  }
}
