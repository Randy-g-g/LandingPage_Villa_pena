import { AdicionalesService } from './adicionales.service';
import { CreateAdicionalDto } from './dto/create-adicional.dto';
import { UpdateAdicionalDto } from './dto/update-adicional.dto';
export declare class AdicionalesController {
    private readonly adicionalesService;
    constructor(adicionalesService: AdicionalesService);
    obtenerTodos(): import("./models/adicional.model").Adicional[];
    obtenerUno(id: number): import("./models/adicional.model").Adicional;
    crear(dto: CreateAdicionalDto): import("./models/adicional.model").Adicional;
    actualizar(id: number, dto: UpdateAdicionalDto): import("./models/adicional.model").Adicional;
    eliminar(id: number): import("./models/adicional.model").Adicional;
}
