"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaquetesService = void 0;
const common_1 = require("@nestjs/common");
let PaquetesService = class PaquetesService {
    paquetes = [
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
    obtenerTodos() {
        return this.paquetes;
    }
    obtenerUno(id) {
        const paquete = this.paquetes.find(elemento => elemento.id === id);
        if (!paquete) {
            throw new common_1.NotFoundException(`No existe un paquete con el ID ${id}.`);
        }
        return paquete;
    }
    crear(dto) {
        const nuevoId = this.paquetes.length > 0
            ? Math.max(...this.paquetes.map(p => p.id)) + 1
            : 1;
        const nuevoPaquete = {
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
    actualizar(id, dto) {
        const indice = this.paquetes.findIndex(elemento => elemento.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No existe un paquete con el ID ${id}.`);
        }
        if (dto.nombre !== undefined &&
            !dto.nombre.trim()) {
            throw new common_1.BadRequestException('El nombre no puede estar vacío.');
        }
        if (dto.descripcion !== undefined &&
            !dto.descripcion.trim()) {
            throw new common_1.BadRequestException('La descripción no puede estar vacía.');
        }
        const paqueteActualizado = {
            ...this.paquetes[indice],
            ...dto,
            id
        };
        this.paquetes[indice] = paqueteActualizado;
        return paqueteActualizado;
    }
    eliminar(id) {
        const indice = this.paquetes.findIndex(elemento => elemento.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No existe un paquete con el ID ${id}.`);
        }
        this.paquetes.splice(indice, 1);
        return {
            mensaje: `El paquete con ID ${id} fue eliminado correctamente.`
        };
    }
};
exports.PaquetesService = PaquetesService;
exports.PaquetesService = PaquetesService = __decorate([
    (0, common_1.Injectable)()
], PaquetesService);
//# sourceMappingURL=paquetes.service.js.map