"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResenasService = void 0;
const common_1 = require("@nestjs/common");
let ResenasService = class ResenasService {
    resenas = [
        {
            id: 1,
            usuario: 'María González',
            comentario: 'Un lugar hermoso para celebrar eventos familiares.',
            calificacion: 5,
            estado: 'APROBADA',
            fechaCreacion: '2026-10-20T10:00:00.000Z',
        },
        {
            id: 2,
            usuario: 'Carlos Rodríguez',
            comentario: 'Las instalaciones son bonitas y la atención excelente.',
            calificacion: 5,
            estado: 'PENDIENTE',
            fechaCreacion: '2026-10-21T14:30:00.000Z',
        },
        {
            id: 3,
            usuario: 'Ana López',
            comentario: 'Un buen lugar para compartir con amigos.',
            calificacion: 4,
            estado: 'RECHAZADA',
            fechaCreacion: '2026-10-22T09:15:00.000Z',
        },
        {
            id: 4,
            usuario: 'José Vargas',
            comentario: 'Muy bonito el espacio y todo estaba limpio.',
            calificacion: 5,
            estado: 'APROBADA',
            fechaCreacion: '2026-10-23T16:00:00.000Z',
        },
    ];
    obtenerPorId(id) {
        const resena = this.resenas.find(elemento => elemento.id === id);
        if (!resena) {
            throw new common_1.NotFoundException(`No existe una reseña con el ID ${id}.`);
        }
        return resena;
    }
    obtenerPublicadas() {
        return this.resenas.filter(resena => resena.estado === 'APROBADA');
    }
    obtenerPendientes() {
        return this.resenas.filter(resena => resena.estado === 'PENDIENTE');
    }
    crear(dto) {
        const nuevoId = this.resenas.length > 0
            ? Math.max(...this.resenas.map(r => r.id)) + 1
            : 1;
        const nuevaResena = {
            id: nuevoId,
            usuario: dto.usuario.trim(),
            comentario: dto.comentario.trim(),
            calificacion: dto.calificacion,
            estado: 'PENDIENTE',
            fechaCreacion: new Date().toISOString(),
        };
        this.resenas.push(nuevaResena);
        return nuevaResena;
    }
    actualizarEstado(id, dto) {
        const resena = this.resenas.find(elemento => elemento.id === id);
        if (!resena) {
            throw new common_1.NotFoundException(`No existe una reseña con el ID ${id}.`);
        }
        resena.estado = dto.estado;
        return resena;
    }
    eliminar(id) {
        const indice = this.resenas.findIndex(elemento => elemento.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No existe una reseña con el ID ${id}.`);
        }
        this.resenas.splice(indice, 1);
        return {
            mensaje: `La reseña ${id} fue eliminada correctamente.`,
        };
    }
};
exports.ResenasService = ResenasService;
exports.ResenasService = ResenasService = __decorate([
    (0, common_1.Injectable)()
], ResenasService);
//# sourceMappingURL=resenas.service.js.map