
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
  // carpeta donde se almacenan las imágenes WebP
private readonly carpeta = join(
  process.cwd(),
  'uploads',
  'galeria',
);

// carpeta donde se guardan los datos JSON
private readonly carpetaDatos = join(
  process.cwd(),
  'data',
);

// archivo que contiene la información de las fotografías
private readonly archivoDatos = join(
  this.carpetaDatos,
  'galeria.json',
);

  // Leer fotografías
private async leerFotos(): Promise<Foto[]> {

  await fs.mkdir(this.carpetaDatos, {
    recursive: true,
  });

  try {
    const contenido = await fs.readFile(
      this.archivoDatos,
      'utf8',
    );

    return JSON.parse(contenido) as Foto[];

  } catch (error) {

    if (
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return [];
    }

    throw error;
  }
}

  // Guardar información
private async guardarFotos(
  fotos: Foto[],
): Promise<void> {

  await fs.mkdir(this.carpetaDatos, {
    recursive: true,
  });

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
    descripcion?: string,
    archivo?: Express.Multer.File,
  ): Promise<Foto> {
    const fotos = await this.leerFotos();
    const foto = fotos.find((f) => f.id === id);

    if (!foto) {
      throw new NotFoundException('Fotografía no encontrada');
    }

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

    const descripcionAnterior = foto.descripcion;
    const srcAnterior = foto.src;

    let destinoNuevo: string | undefined;

    // Procesar la fotografía nueva si existe
    if (archivo) {
      if (!archivo.buffer) {
        throw new BadRequestException(
          'No se recibió correctamente la imagen',
        );
      }

      await fs.mkdir(this.carpeta, { recursive: true });

      const nombreNuevo = `${randomUUID()}.webp`;
      destinoNuevo = join(this.carpeta, nombreNuevo);

      try {
        await sharp(archivo.buffer)
          .rotate()
          .resize({
            width: 1200,
            withoutEnlargement: true,
          })
          .webp({ quality: 78 })
          .toFile(destinoNuevo);

        foto.src = `/uploads/galeria/${nombreNuevo}`;
      } catch {
        await fs.rm(destinoNuevo, { force: true });
        throw new BadRequestException(
          'No se pudo procesar la nueva imagen',
        );
      }
    }

    // Actualizar descripción si fue enviada
    if (descripcion !== undefined) {
      foto.descripcion = descripcion.trim();
    }

    // Guardar cambios en galeria.json
    try {
      await this.guardarFotos(fotos);
    } catch (error) {
      // Recuperar los datos anteriores
      foto.src = srcAnterior;
      foto.descripcion = descripcionAnterior;

      // Eliminar la imagen nueva si falló el guardado
      if (destinoNuevo) {
        await fs.rm(destinoNuevo, { force: true });
      }

      throw error;
    }

    // Eliminar imagen anterior solo después de guardar el JSON
    if (destinoNuevo && srcAnterior.startsWith('/uploads/galeria/')) {
      const nombreAnterior = srcAnterior.split('/').pop();

      if (nombreAnterior) {
        try {
          await fs.rm(
            join(this.carpeta, nombreAnterior),
            { force: true },
          );
        } catch {
          // El registro ya fue actualizado.
          // Si falla la limpieza, conservamos la actualización.
        }
      }
    }

    return foto;
  }
  
  // Eliminar fotografía
   async eliminarFoto(id: string): Promise<{ mensaje: string }> {
    const fotos = await this.leerFotos();

    const foto = fotos.find((f) => f.id === id);

    if (!foto) {
      throw new NotFoundException('Fotografía no encontrada');
    }

    // Obtener la lista sin la fotografía eliminada
    const fotosActualizadas = fotos.filter((f) => f.id !== id);

    // Primero actualizamos galeria.json
    await this.guardarFotos(fotosActualizadas);

    // Después eliminamos el archivo físico, si pertenece
    // al directorio administrado por el backend
    if (foto.src.startsWith('/uploads/galeria/')) {
      const nombreArchivo = foto.src.split('/').pop();

      if (nombreArchivo) {
        try {
          await fs.rm(
            join(this.carpeta, nombreArchivo),
            { force: true },
          );
        } catch (error) {
          console.error(
            'No se pudo eliminar el archivo de imagen:',
            error,
          );
        }
      }
    }

    return {
      mensaje: 'Fotografía eliminada correctamente',
    };
  }
}
