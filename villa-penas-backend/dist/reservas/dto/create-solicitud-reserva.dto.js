"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSolicitudReservaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reserva_dto_1 = require("./create-reserva.dto");
class CreateSolicitudReservaDto extends (0, mapped_types_1.OmitType)(create_reserva_dto_1.CreateReservaDto, ['status']) {
}
exports.CreateSolicitudReservaDto = CreateSolicitudReservaDto;
//# sourceMappingURL=create-solicitud-reserva.dto.js.map