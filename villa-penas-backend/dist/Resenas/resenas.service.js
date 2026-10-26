"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResenasService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let ResenasService = class ResenasService {
    carpetaDatos = (0, path_1.join)(process.cwd(), 'data');
    rutaArchivo = (0, path_1.join)(this.carpetaDatos, 'resenas.json');
    constructor() {
        if (!(0, fs_1.existsSync)(this.carpetaDatos)) {
            (0, fs_1.mkdirSync)(this.carpetaDatos, { recursive: true });
        }
        if (!(0, fs_1.existsSync)(this.rutaArchivo)) {
            (0, fs_1.writeFileSync)(this.rutaArchivo, JSON.stringify([], null, 2), 'utf-8');
        }
    }
    leerResenas() {
        const contenido = (0, fs_1.readFileSync)(this.rutaArchivo, 'utf-8');
        return JSON.parse(contenido);
    }
    guardarResenas(resenas) {
        (0, fs_1.writeFileSync)(this.rutaArchivo, JSON.stringify(resenas, null, 2), 'utf-8');
    }
    obtenerTodas() {
        return this.leerResenas();
    }
    obtenerPublicadas() {
        return this.leerResenas().filter(resena => resena.estado === 'APROBADA');
    }
    obtenerPendientes() {
        return this.leerResenas().filter(resena => resena.estado === 'PENDIENTE');
    }
    obtenerRechazadas() {
        return this.leerResenas().filter(resena => resena.estado === 'RECHAZADA');
    }
    obtenerPorId(id) {
        const resenas = this.leerResenas();
        const resena = resenas.find(elemento => elemento.id === id);
        if (!resena) {
            throw new common_1.NotFoundException(`No existe una reseña con el ID ${id}.`);
        }
        return resena;
    }
    crear(dto) {
        const resenas = this.leerResenas();
        const nuevoId = resenas.length > 0
            ? Math.max(...resenas.map(resena => resena.id)) + 1
            : 1;
        const nuevaResena = {
            id: nuevoId,
            usuario: dto.usuario.trim(),
            comentario: dto.comentario.trim(),
            calificacion: dto.calificacion,
            estado: 'PENDIENTE',
            fechaCreacion: new Date().toISOString(),
        };
        resenas.push(nuevaResena);
        this.guardarResenas(resenas);
        return nuevaResena;
    }
    actualizarEstado(id, dto) {
        const resenas = this.leerResenas();
        const indice = resenas.findIndex(elemento => elemento.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No existe una reseña con el ID ${id}.`);
        }
        resenas[indice].estado = dto.estado;
        this.guardarResenas(resenas);
        return resenas[indice];
    }
    eliminar(id) {
        const resenas = this.leerResenas();
        const indice = resenas.findIndex(elemento => elemento.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No existe una reseña con el ID ${id}.`);
        }
        resenas.splice(indice, 1);
        this.guardarResenas(resenas);
        return {
            mensaje: `La reseña ${id} fue eliminada correctamente.`,
        };
    }
};
exports.ResenasService = ResenasService;
exports.ResenasService = ResenasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResenasService);
//# sourceMappingURL=resenas.service.js.map