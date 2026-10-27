import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CreateSolicitudReservaDto } from './dto/create-solicitud-reserva.dto';
export declare class ReservasController {
    private readonly reservasService;
    constructor(reservasService: ReservasService);
    findAll(): Promise<import("./models/reserva.model").Reserva[]>;
    findOne(id: number): Promise<import("./models/reserva.model").Reserva>;
    create(dto: CreateReservaDto): Promise<import("./models/reserva.model").Reserva>;
    update(id: number, dto: UpdateReservaDto): Promise<import("./models/reserva.model").Reserva>;
    remove(id: number): Promise<import("./models/reserva.model").Reserva>;
    crearSolicitud(dto: CreateSolicitudReservaDto): Promise<import("./models/reserva.model").Reserva>;
}
