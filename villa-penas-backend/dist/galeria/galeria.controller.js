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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaleriaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const galeria_service_1 = require("./galeria.service");
const create_foto_dto_1 = require("./dto/create-foto.dto");
const update_foto_dto_1 = require("./dto/update-foto.dto");
let GaleriaController = class GaleriaController {
    galeriaService;
    constructor(galeriaService) {
        this.galeriaService = galeriaService;
    }
    obtenerTodas() {
        return this.galeriaService.obtenerTodas();
    }
    obtenerUna(id) {
        return this.galeriaService.obtenerUna(id);
    }
    subirFoto(archivo, datos) {
        return this.galeriaService.subirFoto(archivo, datos.descripcion.trim());
    }
    actualizarFoto(id, datos) {
        if (datos.descripcion === undefined) {
            return this.galeriaService.obtenerUna(id);
        }
        return this.galeriaService.actualizarFoto(id, datos.descripcion.trim());
    }
    eliminarFoto(id) {
        return this.galeriaService.eliminarFoto(id);
    }
};
exports.GaleriaController = GaleriaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GaleriaController.prototype, "obtenerTodas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GaleriaController.prototype, "obtenerUna", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({
                maxSize: 5 * 1024 * 1024,
            }),
            new common_1.FileTypeValidator({
                fileType: /^image\/(jpeg|png|webp)$/,
            }),
        ],
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_foto_dto_1.CreateFotoDto]),
    __metadata("design:returntype", Promise)
], GaleriaController.prototype, "subirFoto", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_foto_dto_1.UpdateFotoDto]),
    __metadata("design:returntype", Promise)
], GaleriaController.prototype, "actualizarFoto", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GaleriaController.prototype, "eliminarFoto", null);
exports.GaleriaController = GaleriaController = __decorate([
    (0, common_1.Controller)('galeria'),
    __metadata("design:paramtypes", [galeria_service_1.GaleriaService])
], GaleriaController);
//# sourceMappingURL=galeria.controller.js.map