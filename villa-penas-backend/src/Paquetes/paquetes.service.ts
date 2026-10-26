import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

import { Paquete } from './models/paquete.model';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Injectable()
export class PaquetesService {

  private readonly rutaArchivo = join(
    process.cwd(),
    'data',
    'paquetes.json'
  );

  constructor() {
    if (!existsSync(this.rutaArchivo)) {
      writeFileSync(this.rutaArchivo, '[]', 'utf8');
    }
  }

  private leerPaquetes(): Paquete[] {
    const contenido = readFileSync(this.rutaArchivo, 'utf8');
    return JSON.parse(contenido) as Paquete[];
  }

  private guardarPaquetes(paquetes: Paquete[]): void {
    writeFileSync(
      this.rutaArchivo,
      JSON.stringify(paquetes, null, 2),
      'utf8'
    );
  }

  obtenerTodos(): Paquete[] {
    return this.leerPaquetes();
  }

  obtenerUno(id: number): Paquete {
    const paquetes = this.leerPaquetes();
    const paquete = paquetes.find(p => p.id === id);

    if (!paquete) {
      throw new NotFoundException(
        `No se encontró el paquete con ID ${id}`
      );
    }

    return paquete;
  }

  crear(dto: CreatePaqueteDto): Paquete {
    const paquetes = this.leerPaquetes();

    const nuevoId = paquetes.length === 0
      ? 1
      : Math.max(...paquetes.map(p => p.id)) + 1;

    const nuevoPaquete: Paquete = {
      id: nuevoId,
      ...dto
    };

    paquetes.push(nuevoPaquete);
    this.guardarPaquetes(paquetes);

    return nuevoPaquete;
  }

  actualizar(id: number, dto: UpdatePaqueteDto): Paquete {
    const paquetes = this.leerPaquetes();
    const indice = paquetes.findIndex(p => p.id === id);

    if (indice === -1) {
      throw new NotFoundException(
        `No se encontró el paquete con ID ${id}`
      );
    }

    paquetes[indice] = {
      ...paquetes[indice],
      ...dto,
      id
    };

    this.guardarPaquetes(paquetes);

    return paquetes[indice];
  }

  eliminar(id: number): Paquete {
    const paquetes = this.leerPaquetes();
    const indice = paquetes.findIndex(p => p.id === id);

    if (indice === -1) {
      throw new NotFoundException(
        `No se encontró el paquete con ID ${id}`
      );
    }

    const eliminado = paquetes[indice];

    paquetes.splice(indice, 1);
    this.guardarPaquetes(paquetes);

    return eliminado;
  }
}