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
exports.AdicionalesController = void 0;
const common_1 = require("@nestjs/common");
const adicionales_service_1 = require("./adicionales.service");
const create_adicional_dto_1 = require("./dto/create-adicional.dto");
const update_adicional_dto_1 = require("./dto/update-adicional.dto");
let AdicionalesController = class AdicionalesController {
    adicionalesService;
    constructor(adicionalesService) {
        this.adicionalesService = adicionalesService;
    }
    obtenerTodos() {
        return this.adicionalesService.obtenerTodos();
    }
    obtenerUno(id) {
        return this.adicionalesService.obtenerUno(id);
    }
    crear(dto) {
        return this.adicionalesService.crear(dto);
    }
    actualizar(id, dto) {
        return this.adicionalesService.actualizar(id, dto);
    }
    eliminar(id) {
        return this.adicionalesService.eliminar(id);
    }
};
exports.AdicionalesController = AdicionalesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdicionalesController.prototype, "obtenerTodos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdicionalesController.prototype, "obtenerUno", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_adicional_dto_1.CreateAdicionalDto]),
    __metadata("design:returntype", void 0)
], AdicionalesController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_adicional_dto_1.UpdateAdicionalDto]),
    __metadata("design:returntype", void 0)
], AdicionalesController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdicionalesController.prototype, "eliminar", null);
exports.AdicionalesController = AdicionalesController = __decorate([
    (0, common_1.Controller)('adicionales'),
    __metadata("design:paramtypes", [adicionales_service_1.AdicionalesService])
], AdicionalesController);
//# sourceMappingURL=adicionales.controller.js.map