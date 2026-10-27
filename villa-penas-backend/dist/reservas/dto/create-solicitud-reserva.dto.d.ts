import { CreateReservaDto } from './create-reserva.dto';
declare const CreateSolicitudReservaDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Omit<CreateReservaDto, "status">>;
export declare class CreateSolicitudReservaDto extends CreateSolicitudReservaDto_base {
}
export {};
