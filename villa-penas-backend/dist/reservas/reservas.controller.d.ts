import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
export declare class ReservasController {
    private readonly reservasService;
    constructor(reservasService: ReservasService);
    findAll(): import("./models/reserva.model").Reserva[];
    findOne(id: number): import("./models/reserva.model").Reserva;
    create(dto: CreateReservaDto): import("./models/reserva.model").Reserva;
    update(id: number, dto: UpdateReservaDto): import("./models/reserva.model").Reserva;
    remove(id: number): import("./models/reserva.model").Reserva;
}
