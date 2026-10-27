import { Reserva } from './models/reserva.model';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
export declare class ReservasService {
    private readonly archivo;
    private readonly DURACION;
    private readonly APERTURA;
    private readonly CIERRE;
    private cola;
    private ejecutarEnOrden;
    private leerReservas;
    private guardarReservas;
    private convertirAMinutos;
    private convertirAHora;
    private validarFecha;
    private calcularHorario;
    private comprobarDisponibilidad;
    findAll(): Promise<Reserva[]>;
    findOne(id: number): Promise<Reserva>;
    create(dto: CreateReservaDto): Promise<Reserva>;
    update(id: number, dto: UpdateReservaDto): Promise<Reserva>;
    remove(id: number): Promise<Reserva>;
}
