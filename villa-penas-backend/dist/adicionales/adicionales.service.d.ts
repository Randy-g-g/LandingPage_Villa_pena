import { Adicional } from './models/adicional.model';
import { CreateAdicionalDto } from './dto/create-adicional.dto';
import { UpdateAdicionalDto } from './dto/update-adicional.dto';
export declare class AdicionalesService {
    private readonly rutaArchivo;
    constructor();
    private leerAdicionales;
    private guardarAdicionales;
    obtenerTodos(): Adicional[];
    obtenerUno(id: number): Adicional;
    crear(dto: CreateAdicionalDto): Adicional;
    actualizar(id: number, dto: UpdateAdicionalDto): Adicional;
    eliminar(id: number): Adicional;
}
