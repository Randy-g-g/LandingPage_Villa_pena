"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservasService = void 0;
const common_1 = require("@nestjs/common");
let ReservasService = class ReservasService {
    reservas = [];
    siguienteId = 1;
    findAll() {
        return this.reservas;
    }
    findOne(id) {
        const reserva = this.reservas.find((reserva) => reserva.id === id);
        if (!reserva) {
            throw new common_1.NotFoundException(`No se encontró la reserva con ID ${id}`);
        }
        return reserva;
    }
    create(dto) {
        const nuevaReserva = {
            id: this.siguienteId++,
            ...dto,
        };
        this.reservas.push(nuevaReserva);
        return nuevaReserva;
    }
    update(id, dto) {
        const reserva = this.findOne(id);
        Object.assign(reserva, dto);
        return reserva;
    }
    remove(id) {
        const reserva = this.findOne(id);
        this.reservas = this.reservas.filter((item) => item.id !== id);
        return reserva;
    }
};
exports.ReservasService = ReservasService;
exports.ReservasService = ReservasService = __decorate([
    (0, common_1.Injectable)()
], ReservasService);
//# sourceMappingURL=reservas.service.js.map