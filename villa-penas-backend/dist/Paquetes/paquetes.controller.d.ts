import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
export declare class PaquetesController {
    private readonly paquetesService;
    constructor(paquetesService: PaquetesService);
    obtenerTodos(): import("./models/paquete.model").Paquete[];
    obtenerUno(id: number): import("./models/paquete.model").Paquete;
    crear(dto: CreatePaqueteDto): import("./models/paquete.model").Paquete;
    actualizar(id: number, dto: UpdatePaqueteDto): import("./models/paquete.model").Paquete;
    eliminar(id: number): {
        mensaje: string;
    };
}
