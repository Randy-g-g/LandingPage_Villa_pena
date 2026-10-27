import { Reserva } from './models/reserva.model';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
export declare class ReservasService {
    private reservas;
    private siguienteId;
    findAll(): Reserva[];
    findOne(id: number): Reserva;
    create(dto: CreateReservaDto): Reserva;
    update(id: number, dto: UpdateReservaDto): Reserva;
    remove(id: number): Reserva;
}
