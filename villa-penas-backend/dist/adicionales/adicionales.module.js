"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdicionalesModule = void 0;
const common_1 = require("@nestjs/common");
const adicionales_controller_1 = require("./adicionales.controller");
const adicionales_service_1 = require("./adicionales.service");
let AdicionalesModule = class AdicionalesModule {
};
exports.AdicionalesModule = AdicionalesModule;
exports.AdicionalesModule = AdicionalesModule = __decorate([
    (0, common_1.Module)({
        controllers: [adicionales_controller_1.AdicionalesController],
        providers: [adicionales_service_1.AdicionalesService]
    })
], AdicionalesModule);
//# sourceMappingURL=adicionales.module.js.map