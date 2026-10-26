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
exports.AdicionalesService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let AdicionalesService = class AdicionalesService {
    rutaArchivo = (0, path_1.join)(process.cwd(), 'data', 'adicionales.json');
    constructor() {
        if (!(0, fs_1.existsSync)(this.rutaArchivo)) {
            (0, fs_1.writeFileSync)(this.rutaArchivo, '[]', 'utf8');
        }
    }
    leerAdicionales() {
        const contenido = (0, fs_1.readFileSync)(this.rutaArchivo, 'utf8');
        return JSON.parse(contenido);
    }
    guardarAdicionales(adicionales) {
        (0, fs_1.writeFileSync)(this.rutaArchivo, JSON.stringify(adicionales, null, 2), 'utf8');
    }
    obtenerTodos() {
        return this.leerAdicionales();
    }
    obtenerUno(id) {
        const adicionales = this.leerAdicionales();
        const adicional = adicionales.find(a => a.id === id);
        if (!adicional) {
            throw new common_1.NotFoundException(`No se encontró el adicional con ID ${id}`);
        }
        return adicional;
    }
    crear(dto) {
        const adicionales = this.leerAdicionales();
        const existe = adicionales.some(a => a.id === dto.id);
        if (existe) {
            throw new common_1.ConflictException(`Ya existe un adicional con ID ${dto.id}`);
        }
        const nuevoAdicional = { ...dto };
        adicionales.push(nuevoAdicional);
        this.guardarAdicionales(adicionales);
        return nuevoAdicional;
    }
    actualizar(id, dto) {
        const adicionales = this.leerAdicionales();
        const indice = adicionales.findIndex(a => a.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No se encontró el adicional con ID ${id}`);
        }
        adicionales[indice] = {
            ...adicionales[indice],
            ...dto,
            id
        };
        this.guardarAdicionales(adicionales);
        return adicionales[indice];
    }
    eliminar(id) {
        const adicionales = this.leerAdicionales();
        const indice = adicionales.findIndex(a => a.id === id);
        if (indice === -1) {
            throw new common_1.NotFoundException(`No se encontró el adicional con ID ${id}`);
        }
        const eliminado = adicionales[indice];
        adicionales.splice(indice, 1);
        this.guardarAdicionales(adicionales);
        return eliminado;
    }
};
exports.AdicionalesService = AdicionalesService;
exports.AdicionalesService = AdicionalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AdicionalesService);
//# sourceMappingURL=adicionales.service.js.map