import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';

import { Paquete } from './models/paquete.model';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Injectable()
export class PaquetesService {

  private paquetes: Paquete[] = [
    {
      id: 1,
      nombre: 'Paquete Essentials',
      descripcion: 'Una opción sencilla para disfrutar del rancho y compartir con tus invitados.',
      servicios: [
        'Uso del rancho',
        'Cocina equipada',
        'Playground',
        'Trampolín',
        'Piscina',
        'Wi-Fi'
      ],
      precio: 60000,
      detalles: [
        {
          nombre: 'Rancho',
          descripcion: 'Uso del rancho y sus áreas principales durante el evento.'
        },
        {
          nombre: 'Cocina equipada',
          descripcion: 'Uso de cocina equipada para preparar y almacenar alimentos.'
        },
        {
          nombre: 'Playground',
          descripcion: 'Acceso al área de juegos infantiles durante el evento.'
        },
        {
          nombre: 'Trampolín',
          descripcion: 'Uso del trampolín durante el evento.'
        },
        {
          nombre: 'Piscina',
          descripcion: 'Piscina de 1,40 metros de profundidad, con cascada e iluminación de colores.'
        },
        {
          nombre: 'Wi-Fi',
          descripcion: 'Acceso a conexión inalámbrica a Internet.'
        }
      ]
    },
    {
      id: 2,
      nombre: 'Paquete Premium',
      descripcion: 'Una opción más completa con entretenimiento y productos adicionales.',
      servicios: [
        'Uso del rancho',
        'Cocina equipada',
        'Parrilla de gas Premium',
        'Playground',
        'Sistema de sonido',
        'Trampolín',
        'Micrófonos inalámbricos',
        'Piscina',
        'Smart TV',
        'Wi-Fi'
      ],
      precio: 80000,
      detalles: [
        {
          nombre: 'Rancho',
          descripcion: 'Uso del rancho y sus áreas principales durante el evento.'
        },
        {
          nombre: 'Cocina equipada',
          descripcion: 'Uso de cocina equipada para preparar y almacenar alimentos.'
        },
        {
          nombre: 'Parrilla de gas Premium',
          descripcion: 'Uso de parrilla de gas Premium para preparar alimentos.'
        },
        {
          nombre: 'Playground',
          descripcion: 'Acceso al área de juegos infantiles.'
        },
        {
          nombre: 'Sistema de sonido JBL PartyBox 720',
          descripcion: 'Uso del sistema de sonido para música y entretenimiento.'
        },
        {
          nombre: 'Trampolín',
          descripcion: 'Uso del trampolín durante el evento.'
        },
        {
          nombre: 'Micrófonos inalámbricos',
          descripcion: 'Uso de micrófonos inalámbricos conectados al sistema de sonido.'
        },
        {
          nombre: 'Piscina',
          descripcion: 'Piscina de 1,40 metros de profundidad, con cascada e iluminación de colores.'
        },
        {
          nombre: 'Smart TV de 75 pulgadas',
          descripcion: 'Uso de Smart TV para proyección de contenido y entretenimiento.'
        },
        {
          nombre: 'Wi-Fi',
          descripcion: 'Acceso a conexión inalámbrica a Internet.'
        }
      ]
    }
  ];

  // READ: consultar todos los paquetes
  obtenerTodos(): Paquete[] {
    return this.paquetes;
  }

  // READ: consultar un paquete por su ID
  obtenerUno(id: number): Paquete {
    const paquete = this.paquetes.find(
      elemento => elemento.id === id
    );

    if (!paquete) {
      throw new NotFoundException(
        `No existe un paquete con el ID ${id}.`
      );
    }

    return paquete;
  }

  // CREATE: registrar un paquete nuevo
  crear(dto: CreatePaqueteDto): Paquete {
    const nuevoId = this.paquetes.length > 0
      ? Math.max(...this.paquetes.map(p => p.id)) + 1
      : 1;

    const nuevoPaquete: Paquete = {
      id: nuevoId,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      servicios: dto.servicios,
      precio: dto.precio,
      detalles: dto.detalles
    };

    this.paquetes.push(nuevoPaquete);

    return nuevoPaquete;
  }

  // UPDATE: modificar parcialmente un paquete
  actualizar(
    id: number,
    dto: UpdatePaqueteDto
  ): Paquete {
    const indice = this.paquetes.findIndex(
      elemento => elemento.id === id
    );

    if (indice === -1) {
      throw new NotFoundException(
        `No existe un paquete con el ID ${id}.`
      );
    }

    if (
      dto.nombre !== undefined &&
      !dto.nombre.trim()
    ) {
      throw new BadRequestException(
        'El nombre no puede estar vacío.'
      );
    }

    if (
      dto.descripcion !== undefined &&
      !dto.descripcion.trim()
    ) {
      throw new BadRequestException(
        'La descripción no puede estar vacía.'
      );
    }

    const paqueteActualizado: Paquete = {
      ...this.paquetes[indice],
      ...dto,
      id
    };

    this.paquetes[indice] = paqueteActualizado;

    return paqueteActualizado;
  }

  // DELETE: eliminar un paquete
  eliminar(id: number): { mensaje: string } {
    const indice = this.paquetes.findIndex(
      elemento => elemento.id === id
    );

    if (indice === -1) {
      throw new NotFoundException(
        `No existe un paquete con el ID ${id}.`
      );
    }

    this.paquetes.splice(indice, 1);

    return {
      mensaje: `El paquete con ID ${id} fue eliminado correctamente.`
    };
  }
}