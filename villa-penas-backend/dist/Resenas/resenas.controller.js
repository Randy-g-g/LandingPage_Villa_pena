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
exports.ResenasController = void 0;
const common_1 = require("@nestjs/common");
const resenas_service_1 = require("./resenas.service");
const create_resena_dto_1 = require("./dto/create-resena.dto");
const update_resena_dto_1 = require("./dto/update-resena.dto");
let ResenasController = class ResenasController {
    resenasService;
    constructor(resenasService) {
        this.resenasService = resenasService;
    }
    obtenerPublicadas() {
        return this.resenasService.obtenerPublicadas();
    }
    obtenerPendientes() {
        return this.resenasService.obtenerPendientes();
    }
    obtenerRechazadas() {
        return this.resenasService.obtenerRechazadas();
    }
    obtenerPorId(id) {
        return this.resenasService.obtenerPorId(id);
    }
    crear(dto) {
        return this.resenasService.crear(dto);
    }
    actualizarEstado(id, dto) {
        return this.resenasService.actualizarEstado(id, dto);
    }
    eliminar(id) {
        return this.resenasService.eliminar(id);
    }
};
exports.ResenasController = ResenasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ResenasController.prototype, "obtenerPublicadas", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ResenasController.prototype, "obtenerPendientes", null);
__decorate([
    (0, common_1.Get)('rechazadas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ResenasController.prototype, "obtenerRechazadas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], ResenasController.prototype, "obtenerPorId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_resena_dto_1.CreateResenaDto]),
    __metadata("design:returntype", Object)
], ResenasController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_resena_dto_1.UpdateResenaDto]),
    __metadata("design:returntype", Object)
], ResenasController.prototype, "actualizarEstado", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], ResenasController.prototype, "eliminar", null);
exports.ResenasController = ResenasController = __decorate([
    (0, common_1.Controller)('resenas'),
    __metadata("design:paramtypes", [resenas_service_1.ResenasService])
], ResenasController);
//# sourceMappingURL=resenas.controller.js.map