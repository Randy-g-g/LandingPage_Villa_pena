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
exports.PaquetesService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let PaquetesService = class PaquetesService {
    rutaArchivo = (0, path_1.join)(process.cwd(), 'data', 'paquetes.json');
    constructor() {
        if (!(0, fs_1.existsSync)(this.rutaArchivo)) {
            (0, fs_1.writeFileSync)(this.rutaArchivo, '[]', 'utf8');
        }
    }
    leerPaquetes() {
        const contenido = (0, fs_1.readFileSync)(this.rutaArchivo, 'utf8');
        return JSON.parse(contenido);
    }
    guardarPaquetes(paquetes) {
        (0, fs_1.writeFileSync)(this.rutaArchivo, JSON.stringify(paquetes, null, 2), 'utf8');
    }
    obtenerTodos() {
        return this.leerPaquetes();
    }
    obtenerUno(id) {
        const paquetes = this.leerPaquetes();
        const paquete = paquetes.find(p => p.id === id);
        if (!paquete) {
            throw new common_1.NotFoundException(`No se encontró el paquete con ID ${id}`);
        }
        return paquete;
    }
    crear(dto) {
        const paquetes = this.leerPaquetes();
        const nuevoId = paquetes.length === 0
            ? 1
            : Math.max(...paquetes.map(p => p.id)) + 1;
        const nuevoPaquete = {
            id: nuevoId,
            ...dto
        };
        paquetes.push(nuevoPaquete);
        this.guardarPaquetes(paquetes);
        return nuevoPaquete;
    }
    actualizar(id, dto) {
        const paquetes = this.leerPaquetes();
        const indice = paquetes.findIndex(p => p.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No se encontró el paquete con ID ${id}`);
        }
        paquetes[indice] = {
            ...paquetes[indice],
            ...dto,
            id
        };
        this.guardarPaquetes(paquetes);
        return paquetes[indice];
    }
    eliminar(id) {
        const paquetes = this.leerPaquetes();
        const indice = paquetes.findIndex(p => p.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No se encontró el paquete con ID ${id}`);
        }
        const eliminado = paquetes[indice];
        paquetes.splice(indice, 1);
        this.guardarPaquetes(paquetes);
        return eliminado;
    }
};
exports.PaquetesService = PaquetesService;
exports.PaquetesService = PaquetesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PaquetesService);
//# sourceMappingURL=paquetes.service.js.map