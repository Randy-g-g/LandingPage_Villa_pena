import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

import { Adicional } from './models/adicional.model';
import { CreateAdicionalDto } from './dto/create-adicional.dto';
import { UpdateAdicionalDto } from './dto/update-adicional.dto';

@Injectable()
export class AdicionalesService {
  private readonly rutaArchivo = join(
    process.cwd(),
    'data',
    'adicionales.json'
  );

  constructor() {
    if (!existsSync(this.rutaArchivo)) {
      writeFileSync(this.rutaArchivo, '[]', 'utf8');
    }
  }

  private leerAdicionales(): Adicional[] {
    const contenido = readFileSync(this.rutaArchivo, 'utf8');
    return JSON.parse(contenido) as Adicional[];
  }

  private guardarAdicionales(adicionales: Adicional[]): void {
    writeFileSync(
      this.rutaArchivo,
      JSON.stringify(adicionales, null, 2),
      'utf8'
    );
  }

  obtenerTodos(): Adicional[] {
    return this.leerAdicionales();
  }

  obtenerUno(id: number): Adicional {
    const adicionales = this.leerAdicionales();
    const adicional = adicionales.find(a => a.id === id);

    if (!adicional) {
      throw new NotFoundException(
        `No se encontró el adicional con ID ${id}`
      );
    }

    return adicional;
  }

  crear(dto: CreateAdicionalDto): Adicional {
    const adicionales = this.leerAdicionales();

    const existe = adicionales.some(a => a.id === dto.id);

    if (existe) {
      throw new ConflictException(
        `Ya existe un adicional con ID ${dto.id}`
      );
    }

    const nuevoAdicional: Adicional = { ...dto };

    adicionales.push(nuevoAdicional);
    this.guardarAdicionales(adicionales);

    return nuevoAdicional;
  }

  actualizar(id: number, dto: UpdateAdicionalDto): Adicional {
    const adicionales = this.leerAdicionales();

    const indice = adicionales.findIndex(a => a.id === id);

    if (indice === -1) {
      throw new NotFoundException(
        `No se encontró el adicional con ID ${id}`
      );
    }

    adicionales[indice] = {
      ...adicionales[indice],
      ...dto,
      id
    };

    this.guardarAdicionales(adicionales);

    return adicionales[indice];
  }

  eliminar(id: number): Adicional {
    const adicionales = this.leerAdicionales();

    const indice = adicionales.findIndex(a => a.id === id);

    if (indice === -1) {
      throw new NotFoundException(
        `No se encontró el adicional con ID ${id}`
      );
    }

    const eliminado = adicionales[indice];

    adicionales.splice(indice, 1);
    this.guardarAdicionales(adicionales);

    return eliminado;
  }
}