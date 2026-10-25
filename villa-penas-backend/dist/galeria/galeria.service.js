"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaleriaService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const sharp_1 = __importDefault(require("sharp"));
let GaleriaService = class GaleriaService {
    carpeta = (0, node_path_1.join)(process.cwd(), 'uploads', 'galeria');
    archivoDatos = (0, node_path_1.join)(this.carpeta, 'fotos.json');
    async leerFotos() {
        await node_fs_1.promises.mkdir(this.carpeta, { recursive: true });
        try {
            const contenido = await node_fs_1.promises.readFile(this.archivoDatos, 'utf8');
            return JSON.parse(contenido);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
    async guardarFotos(fotos) {
        await node_fs_1.promises.writeFile(this.archivoDatos, JSON.stringify(fotos, null, 2), 'utf8');
    }
    async obtenerTodas() {
        return this.leerFotos();
    }
    async obtenerUna(id) {
        const fotos = await this.leerFotos();
        const foto = fotos.find((f) => f.id === id);
        if (!foto) {
            throw new common_1.NotFoundException('Fotografía no encontrada');
        }
        return foto;
    }
    async subirFoto(archivo, descripcion) {
        await node_fs_1.promises.mkdir(this.carpeta, { recursive: true });
        const id = (0, node_crypto_1.randomUUID)();
        const nombre = `${id}.webp`;
        const destino = (0, node_path_1.join)(this.carpeta, nombre);
        try {
            await (0, sharp_1.default)(archivo.buffer)
                .rotate()
                .resize({
                width: 1200,
                withoutEnlargement: true,
            })
                .webp({ quality: 78 })
                .toFile(destino);
        }
        catch {
            throw new common_1.BadRequestException('No se pudo procesar la imagen');
        }
        const nuevaFoto = {
            id,
            src: `/uploads/galeria/${nombre}`,
            descripcion,
        };
        try {
            const fotos = await this.leerFotos();
            fotos.push(nuevaFoto);
            await this.guardarFotos(fotos);
        }
        catch (error) {
            await node_fs_1.promises.rm(destino, { force: true });
            throw error;
        }
        return nuevaFoto;
    }
    async actualizarFoto(id, descripcion) {
        const fotos = await this.leerFotos();
        const foto = fotos.find((f) => f.id === id);
        if (!foto) {
            throw new common_1.NotFoundException('Fotografía no encontrada');
        }
        foto.descripcion = descripcion;
        await this.guardarFotos(fotos);
        return foto;
    }
    async eliminarFoto(id) {
        const fotos = await this.leerFotos();
        const foto = fotos.find((f) => f.id === id);
        if (!foto) {
            throw new common_1.NotFoundException('Fotografía no encontrada');
        }
        const restantes = fotos.filter((f) => f.id !== id);
        await this.guardarFotos(restantes);
        const nombre = foto.src.split('/').pop();
        if (nombre) {
            await node_fs_1.promises.rm((0, node_path_1.join)(this.carpeta, nombre), {
                force: true,
            });
        }
    }
};
exports.GaleriaService = GaleriaService;
exports.GaleriaService = GaleriaService = __decorate([
    (0, common_1.Injectable)()
], GaleriaService);
//# sourceMappingURL=galeria.service.js.map