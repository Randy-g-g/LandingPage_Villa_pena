import { Resena } from './models/resena.model';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
export declare class ResenasService {
    private resenas;
    obtenerPorId(id: number): Resena;
    obtenerPublicadas(): Resena[];
    obtenerPendientes(): Resena[];
    crear(dto: CreateResenaDto): Resena;
    actualizarEstado(id: number, dto: UpdateResenaDto): Resena;
    eliminar(id: number): {
        mensaje: string;
    };
}
