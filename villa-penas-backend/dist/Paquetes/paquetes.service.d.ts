import { Paquete } from './models/paquete.model';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
export declare class PaquetesService {
    private paquetes;
    obtenerTodos(): Paquete[];
    obtenerUno(id: number): Paquete;
    crear(dto: CreatePaqueteDto): Paquete;
    actualizar(id: number, dto: UpdatePaqueteDto): Paquete;
    eliminar(id: number): {
        mensaje: string;
    };
}
